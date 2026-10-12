"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { Camera, Geometry, Mesh, Program, Renderer, Texture, Transform, Vec2, Vec3 } from "ogl";
import {
  MONOGRAM_ART,
  MONOGRAM_ASPECT,
  MONOGRAM_COLS,
  MONOGRAM_ROWS,
} from "@/data/ascii-monogram";
import type { DepthFrame } from "../depth/depth-scene";

export interface AsciiMonogramHandle {
  update: (frame: DepthFrame) => void;
}

type AsciiMonogramProps = {
  /** Etiqueta accesible (i18n: llega traducida desde el hero). */
  label: string;
  className?: string;
  /** Escala del monograma dentro del lienzo: <1 deja aire para que la
   *  dispersion no se recorte de golpe contra el marco. Default 0.75. */
  scale?: number;
};

/** Glifos del arte, en orden de aparición (índices del atlas). */
const GLYPHS = Array.from(
  new Set(MONOGRAM_ART.split("\n").join("").split("")),
).filter((ch) => ch !== " ");

/** Celda del atlas (px): aspect ~0.53, el mismo de la celda mono del grid. */
const ATLAS_CELL_W = 34;
const ATLAS_CELL_H = 64;
const ATLAS_STRIDE = GLYPHS.length;

/** Partículas por carácter del arte (density²): desktop más denso. */
function gridDensity(): number {
  return window.matchMedia("(max-width: 767px)").matches ? 2 : 3;
}

const vertex = /* glsl */ `
  attribute vec2 uv;
  attribute vec2 position;
  attribute vec2 aCell;
  attribute float aChar;
  attribute vec2 aDir;
  attribute float aSpeed;
  attribute float aSeed;
  attribute float aTone;

  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;
  uniform vec2 uGrid;
  uniform vec2 uCell;
  uniform float uProgress;
  uniform float uReveal;
  uniform float uTime;
  uniform vec2 uPointer;
  uniform float uScale;
  uniform float uIdle;

  varying vec2 vUv;
  varying float vAlpha;
  varying float vGlow;

  void main() {
    // UV dentro del atlas: los glifos van en una unica fila.
    vUv = vec2((aChar + uv.x) / ${ATLAS_STRIDE}.0, uv.y);

    // Reveal de arranque: el monograma se materializa del centro afuera.
    float d = length((aCell - uGrid * 0.5) / uGrid);
    float rev = smoothstep(0.0, 1.0, uReveal * 2.2 - d * 1.2);

    // Shimmer idle: cada caracter respira con su propia semilla.
    float shimmer = 0.88 + 0.12 * sin(uTime * (1.1 + aSeed * 1.7) + aSeed * 6.2831);

    // Barrido de escaneo: una banda cruza el monograma cada ~7 s. Es el
    // unico efecto de color (la tinta es uniforme, sin reaccion al puntero).
    float cycle = mod(uTime / 7.0, 1.0);
    float sx = cycle * (uGrid.x + 16.0) - 8.0;
    float scan = 1.0 - smoothstep(0.0, uGrid.x * 0.14, abs(aCell.x - sx));

    float glow = scan * uIdle;

    // Dispersion por scroll: expansion radial + vaiven, cada caracter
    // sale en su propia direccion y girando (tumble).
    float disp = pow(uProgress, 1.35) * 240.0 * aSpeed;
    vec2 wobble = vec2(
      sin(uTime * 0.8 + aSeed * 6.2831),
      cos(uTime * 0.62 + aSeed * 4.1)
    ) * 2.2 * uProgress;
    vec2 offset = aDir * disp + wobble + uPointer * 1.4 * (1.0 - uProgress * 0.55);

    float ang = (aSeed - 0.5) * 3.2 * uProgress;
    float ca = cos(ang);
    float sa = sin(ang);
    mat2 rot = mat2(ca, -sa, sa, ca);
    vec2 corner = rot * position;

    // La fila 0 del arte (arriba) vive arriba de la pantalla: el eje Y de
    // la camara ortografica crece hacia arriba, por eso se invierte el
    // termino vertical respecto al numero de fila.
    vec2 cellPos = vec2(
      (aCell.x - uGrid.x * 0.5) * uCell.x,
      (uGrid.y * 0.5 - aCell.y) * uCell.y
    );
    // El quad llena la celda (aspect mono 1:2): los caracteres se tocan
    // como en terminal — rejilla solida, sin huecos horizontales.
    vec2 world = cellPos + offset + corner * uCell * vec2(1.0, 0.95) * uScale;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(world, 0.0, 1.0);

    // Desvanecerse conforme se dispersa.
    float fade = 1.0 - smoothstep(0.16, 0.82, uProgress);

    vAlpha = rev * fade * mix(1.0, shimmer, uIdle) * (1.0 + glow * 0.6);
    vGlow = glow;
  }
`;

const fragment = /* glsl */ `
  precision highp float;

  uniform sampler2D uAtlas;
  uniform vec3 uInk;
  uniform vec3 uAccent;

  varying vec2 vUv;
  varying float vAlpha;
  varying float vGlow;

  void main() {
    float mask = texture2D(uAtlas, vUv).a;
    if (mask < 0.05) discard;
    // Tinta uniforme (gris/blanco); solo la ola de escaneo toma el acento.
    vec3 color = mix(uInk, uAccent, vGlow);
    gl_FragColor = vec4(color, mask * vAlpha);
  }
`;

/** Semilla determinista: la dispersion es siempre la misma en cada carga. */
function seededRandom(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/** Genera el atlas de glifos (fila unica, blanco sobre transparente). */
function buildAtlas(): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = ATLAS_CELL_W * ATLAS_STRIDE;
  canvas.height = ATLAS_CELL_H;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    // Fuente a ~94% de la altura de celda: el glifo llena ~2/3 de alto y
    // casi todo el ancho util. La celda ya tiene el aspect mono, asi que
    // el quad lo mapea sin deformarlo.
    ctx.font = `${Math.round(ATLAS_CELL_H * 0.94)}px "JetBrains Mono", ui-monospace, monospace`;

    for (let i = 0; i < ATLAS_STRIDE; i++) {
      ctx.fillText(GLYPHS[i], i * ATLAS_CELL_W + ATLAS_CELL_W / 2, ATLAS_CELL_H / 2 + 2);
    }
  }

  return canvas;
}

/**
 * Monograma ASCII "RV" (Big Money-nw) que se desarma con el scroll.
 *
 * - 1 solo draw call: cada partícula con tinta es un quad de la misma
 *   malla (atributos por vertice, sin instancing). ~900 quads en GPU.
 * - No toca el DOM: sin nodos de texto, sin coste de tipografia.
 * - Todo el movimiento vive en el vertex shader (direccion, velocidad,
 *   semilla y giro por celda) => la coreografia no consume CPU por frame.
 * - `uProgress` llega del Depth Engine: el monograma usa el mismo reloj
 *   que el resto de los planos del hero.
 * - La paleta se lee de los tokens CSS: se adapta solo a claro/oscuro.
 */
export const AsciiMonogram = forwardRef<AsciiMonogramHandle, AsciiMonogramProps>(
  ({ label, className, scale = 0.75 }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Estado compartido con la escena (sin provocar re-renders).
    const frame = useRef({ progress: 0, pointer: { x: 0, y: 0 } });

    useImperativeHandle(ref, () => ({
      update: (next) => {
        frame.current = { progress: next.progress, pointer: { ...next.pointer } };
      },
    }));

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      let renderer: Renderer;
      try {
        renderer = new Renderer({
          canvas,
          alpha: true,
          antialias: true,
          dpr: Math.min(window.devicePixelRatio || 1, window.matchMedia("(max-width: 767px)").matches ? 1.5 : 2),
        });
      } catch {
        return;
      }

      const gl = renderer.gl;
      gl.clearColor(0, 0, 0, 0);

      // ── Rejilla: cada carácter del arte → bloque density×density ──
      const density = gridDensity();
      const lines = MONOGRAM_ART.split("\n");
      const cols = MONOGRAM_COLS * density;
      const rows = MONOGRAM_ROWS * density;
      const centerX = (cols - 1) / 2;
      const centerY = (rows - 1) / 2;

      const random = seededRandom(0x5eed);
      const cells: Array<{
        col: number;
        row: number;
        char: number;
        dir: [number, number];
        speed: number;
        seed: number;
        tone: number;
      }> = [];

      for (let r = 0; r < lines.length; r++) {
        const line = lines[r];
        for (let c = 0; c < line.length; c++) {
          const char = GLYPHS.indexOf(line[c]);
          if (char < 0) continue;

          for (let dy = 0; dy < density; dy++) {
            for (let dx = 0; dx < density; dx++) {
              const col = c * density + dx;
              const row = r * density + dy;

              // Direccion radial hacia afuera con jitter: la dispersion
              // lee como expansion uniforme, no como ruido.
              const jx = random() - 0.5;
              const jy = random() - 0.5;
              let dirX = (col - centerX) / cols + jx * 0.55;
              let dirY = (row - centerY) / rows + jy * 0.55;
              const len = Math.hypot(dirX, dirY) || 1;
              dirX /= len;
              dirY /= len;

              cells.push({
                col,
                row,
                char,
                // El mundo vive con Y invertida respecto a las filas: se
                // niega dirY para que la dispersion siga siendo radial
                // hacia afuera y no colapse hacia el centro.
                dir: [dirX, -dirY],
                speed: 0.55 + random() * 0.9,
                seed: random(),
                tone: 0.5 + random() * 0.5,
              });
            }
          }
        }
      }

      // ── Geometria: 2 triangulos por celda ──
      const count = cells.length;
      const corners: Array<[number, number]> = [
        [-0.5, -0.5],
        [0.5, -0.5],
        [-0.5, 0.5],
        [-0.5, 0.5],
        [0.5, -0.5],
        [0.5, 0.5],
      ];

      const position = new Float32Array(count * 12);
      const uv = new Float32Array(count * 12);
      const aCell = new Float32Array(count * 12);
      const aChar = new Float32Array(count * 6);
      const aDir = new Float32Array(count * 12);
      const aSpeed = new Float32Array(count * 6);
      const aSeed = new Float32Array(count * 6);
      const aTone = new Float32Array(count * 6);
      const index: number[] = [];

      for (let i = 0; i < count; i++) {
        const cell = cells[i];
        for (let v = 0; v < 6; v++) {
          const k = i * 6 + v;
          position[k * 2] = corners[v][0];
          position[k * 2 + 1] = corners[v][1];
          uv[k * 2] = corners[v][0] + 0.5;
          uv[k * 2 + 1] = corners[v][1] + 0.5;
          aCell[k * 2] = cell.col;
          aCell[k * 2 + 1] = cell.row;
          aDir[k * 2] = cell.dir[0];
          aDir[k * 2 + 1] = cell.dir[1];
          aChar[k] = cell.char;
          aSpeed[k] = cell.speed;
          aSeed[k] = cell.seed;
          aTone[k] = cell.tone;
          index.push(k);
        }
      }

      const geometry = new Geometry(gl, {
        position: { size: 2, data: position },
        uv: { size: 2, data: uv },
        aCell: { size: 2, data: aCell },
        aChar: { size: 1, data: aChar },
        aDir: { size: 2, data: aDir },
        aSpeed: { size: 1, data: aSpeed },
        aSeed: { size: 1, data: aSeed },
        aTone: { size: 1, data: aTone },
        index: { data: new Uint16Array(index) },
      });

      // ── Paleta desde los tokens CSS (reacciona al tema sin recompilar) ──
      const readTokens = () => {
        const s = getComputedStyle(document.documentElement);
        return {
          ink: s.getPropertyValue("--color-text-primary").trim() || "#fafafa",
          accent: s.getPropertyValue("--color-accent").trim() || "#ff6b35",
        };
      };

      const parse = (value: string): Vec3 => {
        const hex = value.replace("#", "");
        if (hex.length === 6) {
          return new Vec3(
            parseInt(hex.slice(0, 2), 16) / 255,
            parseInt(hex.slice(2, 4), 16) / 255,
            parseInt(hex.slice(4, 6), 16) / 255,
          );
        }
        return new Vec3(0.64, 0.64, 0.64);
      };

      const tokens = readTokens();

      const program = new Program(gl, {
        vertex,
        fragment,
        transparent: true,
        depthTest: false,
        depthWrite: false,
        cullFace: false,
        uniforms: {
          // Textura ogl de verdad (no el canvas crudo): flipY por defecto
          // en TEXTURE_2D deja el glifo derecho con el UV tal cual. Sin
          // mipmaps: el atlas no es potencia de 2 y no los necesita.
          uAtlas: {
            value: new Texture(gl, {
              image: buildAtlas(),
              generateMipmaps: false,
              minFilter: gl.LINEAR,
            }),
          },
          uGrid: { value: new Vec2(cols, rows) },
          uCell: { value: new Vec2(1, 1) },
          uProgress: { value: 0 },
          uReveal: { value: reduced ? 1 : 0 },
          uTime: { value: 0 },
          uPointer: { value: new Vec2(0, 0) },
          uScale: { value: 1 },
          uIdle: { value: reduced ? 0 : 1 },
          uInk: { value: parse(tokens.ink) },
          uAccent: { value: parse(tokens.accent) },
        },
      });

      // Alpha blending estandar: la tinta funciona igual en oscuro y claro.
      program.setBlendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

      if (!program.uniformLocations) {
        console.warn(
          "[AsciiMonogram] link GLSL falló:",
          gl.getProgramInfoLog(program.program) ?? "sin detalle",
        );
        return;
      }

      const mesh = new Mesh(gl, { geometry, program });
      mesh.setParent(new Transform());

      // ── Camara ortografica centrada: la rejilla vive en torno al origen ──
      const scene = new Transform();
      mesh.setParent(scene);
      const camera = new Camera(gl, { left: -0.5, right: 0.5, top: 0.5, bottom: -0.5, near: -1, far: 1 });

      const resize = () => {
        const parent = canvas.parentElement;
        const width = parent?.clientWidth ?? 0;
        const height = parent?.clientHeight ?? 0;
        // Durante transiciones de viewport (p. ej. el toggle de emulación de
        // DevTools) el contenedor puede medir 0: saltamos para no fijar una
        // cámara/celda inválida; el ResizeObserver lo reintentará cuando haya
        // tamaño real.
        if (width < 1 || height < 1) return;
        renderer.setSize(width, height);
        camera.orthographic({
          left: -width / 2,
          right: width / 2,
          top: height / 2,
          bottom: -height / 2,
          near: -1,
          far: 1,
        });

        // Celda cuadrada en proporcion 0.5 (ancho/alto) para no deformar los
        // glifos; el conjunto se escala hasta caber en el contenedor y la
        // perilla `scale` deja aire alrededor para la dispersion.
        const cellH = (height / rows) * 0.95 * scale;
        const cellW = cellH * 0.5;
        const gridW = cols * cellW;
        const fit = gridW > width ? width / gridW : 1;

        program.uniforms.uCell.value.set(cellW * fit, cellH * fit);
        program.uniforms.uScale.value = fit;
      };

      resize();
      // ResizeObserver en vez de `window resize`: reacciona a cualquier
      // cambio de tamaño del contenedor (flex, aspect-ratio, emulación
      // móvil de DevTools…), no solo al tamaño de la ventana.
      const resizeObserver = new ResizeObserver(() => resize());
      if (canvas.parentElement) resizeObserver.observe(canvas.parentElement);

      const themeObserver = new MutationObserver(() => {
        const next = readTokens();
        program.uniforms.uInk.value.set(...([parse(next.ink).x, parse(next.ink).y, parse(next.ink).z] as [number, number, number]));
        program.uniforms.uAccent.value.set(...([parse(next.accent).x, parse(next.accent).y, parse(next.accent).z] as [number, number, number]));
      });
      themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class"],
      });

      // Reveal de arranque (del centro hacia afuera).
      const start = performance.now();
      let disposed = false;
      let raf = 0;

      const render = () => {
        if (disposed) return;
        raf = requestAnimationFrame(render);

        const elapsed = (performance.now() - start) / 1000;
        program.uniforms.uReveal.value = reduced
          ? 1
          : Math.min(1, elapsed / 1.4);
        program.uniforms.uTime.value = elapsed;

        if (!reduced) {
          const { progress, pointer } = frame.current;
          program.uniforms.uProgress.value = progress;
          program.uniforms.uPointer.value.set(pointer.x, pointer.y);
        }

        renderer.render({ scene, camera });
      };
      render();

      return () => {
        disposed = true;
        cancelAnimationFrame(raf);
        themeObserver.disconnect();
        resizeObserver.disconnect();
      };
    }, []);

    return (
      <div
        role="img"
        aria-label={label}
        className={`relative w-full ${className ?? ""}`}
        style={{ aspectRatio: String(MONOGRAM_ASPECT) }}
      >
        <canvas
          ref={canvasRef}
          className="pointer-events-none absolute inset-0 h-full w-full"
        />
      </div>
    );
  },
);

AsciiMonogram.displayName = "AsciiMonogram";
