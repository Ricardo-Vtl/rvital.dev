"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import {
  Camera,
  Geometry,
  Mesh,
  Program,
  Renderer,
  Transform,
  Vec2,
  Vec3,
} from "ogl";
import type { DepthFrame } from "./depth-scene";

export interface DepthFieldHandle {
  update: (frame: DepthFrame) => void;
}

type DepthFieldProps = {
  /** Número de partículas (se reduce automáticamente en móvil) */
  count?: number;
  className?: string;
};

/* Paletas: se leen del tema activo (clase .light en <html>). */
const PALETTE = {
  dark: { a: [1.0, 0.42, 0.2], b: [0.36, 0.5, 0.48], opacity: 1.0 },
  light: { a: [0.72, 0.24, 0.05], b: [0.25, 0.35, 0.33], opacity: 0.7 },
} as const;

const vertex = /* glsl */ `
  attribute vec2 uv;
  attribute vec2 position;
  attribute vec3 aOffset;
  attribute float aSize;
  attribute float aSeed;
  attribute float aDepth;

  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;
  uniform float uScroll;
  uniform vec2 uPointer;
  uniform float uTime;

  varying vec2 vUv;
  varying float vAlpha;
  varying float vSeed;

  void main() {
    vUv = uv;
    vSeed = aSeed;

    // 0 cerca, 1 lejos → cerca se mueve más (la regla del parallax real).
    float far = aDepth;
    float speed = 1.0 - far;

    vec3 p = aOffset;
    p.y += uScroll * 30.0 * speed;
    p.x += uPointer.x * 2.6 * speed;
    p.y += uPointer.y * 1.2 * speed;
    p.y += sin(uTime * 0.35 + aSeed * 6.2831) * 0.45 * speed;

    float scale = mix(1.0, 0.2, far);
    vec4 world = vec4(p + vec3(position * (aSize * scale), 0.0), 1.0);
    gl_Position = projectionMatrix * modelViewMatrix * world;

    vAlpha = mix(0.42, 0.05, far);
  }
`;

const fragment = /* glsl */ `
  precision highp float;

  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform float uOpacity;

  varying vec2 vUv;
  varying float vAlpha;
  varying float vSeed;

  void main() {
    float dist = length(vUv - 0.5) * 2.0;
    float mask = smoothstep(1.0, 0.1, dist);
    vec3 color = mix(uColorA, uColorB, vSeed);

    // Blending aditivo con alpha premultiplicado: el brillo decae con el
    // borde de la partícula y se suma a la escena sin tapar el fondo.
    float a = mask * vAlpha * uOpacity;
    gl_FragColor = vec4(color * a, a);
  }
`;

/**
 * Campo de profundidad WebGL: partículas repartidas en Z real.
 *
 * Decisiones de rendimiento:
 * - Un solo mesh, un solo draw call (atributos por partícula, sin instancing).
 * - No toca el DOM ni el layout: todo pasa en GPU.
 * - rAF propio, pausado por IntersectionObserver cuando sale de pantalla.
 * - DPR limitado (2 en escritorio, 1.5 en móvil) y conteo reducido en móvil.
 * - Additive blending: invisible sobre fondo sin pintar, cero CLS.
 * - Cualquier fallo deja el canvas transparente (fallback silencioso) y nunca
 *   interrumpe el render de React.
 */
export const DepthField = forwardRef<DepthFieldHandle, DepthFieldProps>(
  ({ count = 34, className }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Estado compartido con la escena (sin provocar re-renders).
    const frame = useRef<DepthFrame>({ progress: 0, pointer: { x: 0, y: 0 } });

    useImperativeHandle(ref, () => ({
      update: (next: DepthFrame) => {
        frame.current = next;
      },
    }));

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const isMobile = window.matchMedia("(max-width: 767px)").matches;
      const total = Math.max(8, isMobile ? Math.round(count * 0.5) : count);
      const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2);

      let renderer: Renderer;
      try {
        renderer = new Renderer({
          canvas,
          alpha: true,
          antialias: false,
          dpr,
          powerPreference: "high-performance",
        });
      } catch {
        return; // Sin WebGL disponible: el canvas queda transparente.
      }

      const gl = renderer.gl;
      gl.clearColor(0, 0, 0, 0);

      const camera = new Camera(gl, { fov: 45, near: 0.1, far: 120 });
      camera.position.set(0, 0, 13);
      const lookTarget = new Vec3(0, 0, -20);

      const scene = new Transform();

      // ── Geometría: 2 triángulos por partícula con atributos propios ──
      const corners: Array<[number, number]> = [
        [-0.5, -0.5],
        [0.5, -0.5],
        [-0.5, 0.5],
        [-0.5, 0.5],
        [0.5, -0.5],
        [0.5, 0.5],
      ];

      const positions = new Float32Array(total * 12);
      const uvs = new Float32Array(total * 12);
      const offsets = new Float32Array(total * 18);
      const sizes = new Float32Array(total * 6);
      const seeds = new Float32Array(total * 6);
      const depths = new Float32Array(total * 6);
      const index: number[] = [];

      for (let i = 0; i < total; i++) {
        const far = Math.random();
        const home: [number, number, number] = [
          (Math.random() - 0.5) * (18 + far * 12),
          (Math.random() - 0.5) * (11 + far * 7),
          -2 - far * 34,
        ];
        const size = (0.22 + Math.random() * 0.85) * (1 - far * 0.7);
        const seed = Math.random();

        for (let c = 0; c < 6; c++) {
          const v = i * 6 + c;
          positions[v * 2] = corners[c][0];
          positions[v * 2 + 1] = corners[c][1];
          uvs[v * 2] = corners[c][0] + 0.5;
          uvs[v * 2 + 1] = corners[c][1] + 0.5;
          offsets[v * 3] = home[0];
          offsets[v * 3 + 1] = home[1];
          offsets[v * 3 + 2] = home[2];
          sizes[v] = size;
          seeds[v] = seed;
          depths[v] = far;
          index.push(v);
        }
      }

      const geometry = new Geometry(gl, {
        position: { size: 2, data: positions },
        uv: { size: 2, data: uvs },
        aOffset: { size: 3, data: offsets },
        aSize: { size: 1, data: sizes },
        aSeed: { size: 1, data: seeds },
        aDepth: { size: 1, data: depths },
        index: { data: new Uint16Array(index) },
      });

      const isLight = () => document.documentElement.classList.contains("light");
      const palette = () => (isLight() ? PALETTE.light : PALETTE.dark);

      const program = new Program(gl, {
        vertex,
        fragment,
        transparent: true,
        depthTest: false,
        depthWrite: false,
        cullFace: false,
        uniforms: {
          uScroll: { value: 0 },
          uPointer: { value: new Vec2(0, 0) },
          uTime: { value: 0 },
          uColorA: { value: new Vec3(palette().a[0], palette().a[1], palette().a[2]) },
          uColorB: { value: new Vec3(palette().b[0], palette().b[1], palette().b[2]) },
          uOpacity: { value: palette().opacity },
        },
      });

      // Blending aditivo: las partículas suman luz sobre el fondo.
      program.setBlendFunc(gl.ONE, gl.ONE);
      program.setBlendEquation(gl.FUNC_ADD, gl.FUNC_ADD);

      // Blindaje 2: si el link falló, OGL deja `uniformLocations` sin definir y
      // el primer draw lanzaría. Salimos con el canvas transparente.
      if (!program.uniformLocations) {
        console.warn("[DepthField] no se pudo enlazar el programa GLSL");
        return;
      }

      const mesh = new Mesh(gl, { geometry, program });
      mesh.setParent(scene);

      let visible = true;
      const observer = new IntersectionObserver(
        (entries) => {
          visible = entries.some((entry) => entry.isIntersecting);
        },
        { threshold: 0 },
      );
      observer.observe(canvas);

      // El tema cambia la paleta sin recompilar shaders.
      const themeObserver = new MutationObserver(() => {
        const p = palette();
        program.uniforms.uColorA.value.set(p.a[0], p.a[1], p.a[2]);
        program.uniforms.uColorB.value.set(p.b[0], p.b[1], p.b[2]);
        program.uniforms.uOpacity.value = p.opacity;
      });
      themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class"],
      });

      // El tamaño se mide en el CONTENEDOR, nunca en el propio canvas: OGL
      // escribe width/height inline y leer el canvas devolvería su valor
      // anterior (300x150 por defecto), no el real.
      const resize = () => {
        const host = canvas.parentElement;
        const width = host?.clientWidth || window.innerWidth;
        const height = host?.clientHeight || window.innerHeight;
        renderer.setSize(width, height);
        camera.perspective({ aspect: width / Math.max(1, height) });
      };
      resize();
      window.addEventListener("resize", resize);

      const start = performance.now();
      let disposed = false;
      let raf = 0;

      const render = () => {
        if (disposed) return;
        raf = requestAnimationFrame(render);
        if (!visible) return;

        const { progress, pointer } = frame.current;
        const time = (performance.now() - start) / 1000;

        program.uniforms.uScroll.value = progress;
        program.uniforms.uPointer.value.set(pointer.x, pointer.y);
        program.uniforms.uTime.value = time;

        // Dolly de cámara: la escena se adentra en el campo al scrollear.
        camera.position.z = 13 - progress * 5;
        camera.position.x = pointer.x * 0.7;
        camera.position.y = -pointer.y * 0.5;
        camera.lookAt(lookTarget);

        renderer.render({ scene, camera });
      };
      render();

      return () => {
        disposed = true;
        cancelAnimationFrame(raf);
        observer.disconnect();
        themeObserver.disconnect();
        window.removeEventListener("resize", resize);
        // NO se llama `loseContext()`: en React Strict Mode el efecto se
        // desmonta y se remonta, y perder el contexto haría fallar el segundo
        // montaje. El contexto se libera solo al eliminarse el canvas.
      };
    }, [count]);

    return (
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 h-full w-full ${className ?? ""}`}
      />
    );
  },
);

DepthField.displayName = "DepthField";
