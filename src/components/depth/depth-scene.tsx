"use client";

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useRef,
  type CSSProperties,
  type ReactNode,
} from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { isFinePointer, useReducedMotionSafe, useShortViewport } from "@/lib/motion";
import {
  depthOpacity,
  depthRotation,
  depthSpeed,
  depthPointerFactor,
  lerp,
  pinnedRaw,
  type DepthConfig,
} from "@/lib/depth";

export interface DepthFrame {
  /** 0 → 1 a lo largo del recorrido del pin */
  progress: number;
  /** Puntero normalizado -1..1, suavizado */
  pointer: { x: number; y: number };
}

interface DepthLayerHandle {
  el: HTMLElement;
  getConfig: () => DepthConfig;
}

interface RegistryValue {
  register: (layer: DepthLayerHandle) => () => void;
}

const RegistryContext = createContext<RegistryValue | null>(null);

type DepthSceneProps = {
  children: ReactNode;
  /** Recorrido del pin en unidades de viewport (1.8 = 180% de la altura). */
  length?: number;
  className?: string;
  /** Estado por frame: lo consume el campo WebGL. */
  onFrame?: (frame: DepthFrame) => void;
  onActiveChange?: (active: boolean) => void;
};

/**
 * Escena de profundidad.
 *
 * - Layout CSS puro (`sticky` + contenedor alto): sin pin-spacer de JS, sin
 *   saltos entre navegadores, funciona nativamente con Lenis.
 * - Motor: un único callback en `gsap.ticker` (el mismo reloj que Lenis).
 *   Progreso calculado desde `window.scrollY` con métricas cacheadas →
 *   **cero lecturas de layout por frame** (no hay thrashing).
 * - Solo corre mientras la escena está en viewport (ScrollTrigger onToggle):
 *   fuera de pantalla no se ejecuta nada.
 */
export function DepthScene({
  children,
  length = 1.8,
  className,
  onFrame,
  onActiveChange,
}: DepthSceneProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const layersRef = useRef<Set<DepthLayerHandle>>(new Set());
  const reduced = useReducedMotionSafe();
  const short = useShortViewport();
  // En viewports bajos el pin no cabe: se replica el fallback de
  // reduced-motion (layout estático, sin transforms ni fades) para que el
  // contenido —incluidos los CTAs— siempre sea alcanzable por scroll.
  const enabled = !reduced && !short;

  // Refs estables: los callbacks no recrean el motor al re-renderizar.
  const frameRef = useRef(onFrame);
  const activeCallbackRef = useRef(onActiveChange);
  frameRef.current = onFrame;
  activeCallbackRef.current = onActiveChange;

  const register = useCallback((layer: DepthLayerHandle) => {
    layersRef.current.add(layer);
    return () => {
      layersRef.current.delete(layer);
    };
  }, []);

  useLayoutEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper || !enabled) return;

    let start = 0;
    let distance = 1;
    let vh = window.innerHeight;

    const measure = () => {
      start = wrapper.offsetTop;
      distance = Math.max(1, wrapper.offsetHeight - window.innerHeight);
      vh = window.innerHeight;
    };

    measure();

    // `progress` (0..1) gobierna los transforms y se congela al terminar el
    // pin; `raw` no se clampa y sigue creciendo durante el despine (el tramo
    // en que el stage sale del encuadre), de modo que los rangos de fade
    // pueden expresar valores > 1 = "mientras el stage se despina".
    const apply = (progress: number, raw: number, px: number, py: number) => {
      for (const layer of layersRef.current) {
        const { el, getConfig } = layer;
        const config = getConfig();
        const depth = config.depth;
        const speed = config.speed ?? depthSpeed(depth);
        const pointerFactor = depthPointerFactor(depth);
        const amplitude = (config.pointer ?? 0.06) * vh;

        let opacity = config.baseOpacity ?? depthOpacity(depth);
        if (config.fadeOut) {
          const [from, to] = config.fadeOut;
          opacity *=
            raw <= from ? 1 : raw >= to ? 0 : 1 - (raw - from) / (to - from);
        }
        if (config.fadeIn) {
          const [from, to] = config.fadeIn;
          opacity *=
            raw >= to ? 1 : raw <= from ? 0 : (raw - from) / (to - from);
        }

        const yOffset = -progress * distance * speed + (config.offset ?? 0) * vh;
        const xOffset = px * amplitude * pointerFactor;
        const yPointer = py * amplitude * pointerFactor * 0.45;

        gsap.set(el, {
          x: xOffset,
          y: yOffset + yPointer,
          rotationX: config.rotate ? depthRotation(depth, progress) : 0,
          opacity,
          force3D: true,
        });
      }
    };

    // Estado correcto antes del primer frame visible (evita flash).
    apply(0, 0, 0, 0);

    let active = false;

    const trigger = ScrollTrigger.create({
      trigger: wrapper,
      start: "top bottom",
      end: "bottom top",
      onToggle: (self) => {
        active = self.isActive;
        activeCallbackRef.current?.(active);
        const next = active ? "transform, opacity" : "auto";
        for (const layer of layersRef.current) {
          layer.el.style.willChange = next;
        }
        if (active) measure();
      },
    });

    // Puntero: segunda fuente independiente de profundidad.
    const target = { x: 0, y: 0 };
    const smooth = { x: 0, y: 0 };

    const onPointerMove = (event: PointerEvent) => {
      target.x = (event.clientX / window.innerWidth) * 2 - 1;
      target.y = (event.clientY / window.innerHeight) * 2 - 1;
    };

    const onResize = () => {
      measure();
      ScrollTrigger.refresh();
      // Un cambio de viewport puede dejar un transform obsoleto en las capas
      // (p. ej. al alternar la emulación móvil de DevTools). Reseteamos el
      // puntero suavizado y re-aplicamos al instante con las métricas y el
      // scroll actuales, sin esperar al siguiente frame.
      smooth.x = target.x;
      smooth.y = target.y;
      const raw = pinnedRaw(window.scrollY, start, distance);
      apply(Math.min(1, Math.max(0, raw)), raw, smooth.x, smooth.y);
    };

    const tick = () => {
      if (!active) return;
      smooth.x = lerp(smooth.x, target.x, 0.055);
      smooth.y = lerp(smooth.y, target.y, 0.055);

      // Raw: sin clamps, llega hasta (altura - vh) / distancia al final del
      // despine (con length 2.4 ≈ 1.71). Los transforms usan el clamped.
      const raw = pinnedRaw(window.scrollY, start, distance);
      const progress = Math.min(1, Math.max(0, raw));
      apply(progress, raw, smooth.x, smooth.y);
      frameRef.current?.({ progress, pointer: { x: smooth.x, y: smooth.y } });
    };

    // Puntero: segunda fuente de profundidad, SOLO con mouse/trackpad. En
    // táctil no se registra el listener → las capas del hero (y el monograma
    // vía `uPointer`) no reaccionan al dedo. El parallax de scroll se conserva.
    if (isFinePointer()) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
    }
    window.addEventListener("resize", onResize);
    gsap.ticker.add(tick);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", onResize);
      gsap.ticker.remove(tick);
      trigger.kill();
      for (const layer of layersRef.current) {
        gsap.set(layer.el, { clearProps: "transform,opacity" });
        layer.el.style.willChange = "auto";
      }
    };
  }, [enabled]);

  return (
    <RegistryContext.Provider value={{ register }}>
      <div
        ref={wrapperRef}
        className={`depth-scene ${className ?? ""}`}
        style={{ "--depth-length": length } as CSSProperties}
      >
        <div className="depth-stage">{children}</div>
      </div>
    </RegistryContext.Provider>
  );
}

type DepthLayerProps = {
  children: ReactNode;
  /** 0 = infinitamente lejos, 1 = plano pantalla, >1 = delante de la pantalla */
  depth: number;
  /** Override manual de velocidad (por defecto se deriva de depth) */
  speed?: number;
  /** Desplazamiento vertical inicial, en unidades de viewport (positivo = más abajo) */
  offset?: number;
  /** Amplitud del parallax de puntero, en fracciones de viewport */
  pointer?: number;
  /** Opacidad 1→0 entre estos dos puntos de progreso raw (valores > 1 = durante el despine) */
  fadeOut?: [number, number];
  /** Opacidad 0→1 entre estos dos puntos de progreso raw */
  fadeIn?: [number, number];
  /** Override de opacidad base (por defecto la deriva depth) */
  baseOpacity?: number;
  /** Inclinación sutil de cámara (solo planos decorativos) */
  rotate?: boolean;
  className?: string;
};

/**
 * Plano de profundidad. Se registra en la escena y recibe su transform
 * directamente en el DOM vía gsap.set (sin estado de React, sin re-renders).
 */
export function DepthLayer({
  children,
  depth,
  speed,
  offset,
  pointer,
  fadeOut,
  fadeIn,
  baseOpacity,
  rotate,
  className,
}: DepthLayerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const registry = useContext(RegistryContext);

  // La config vive en un ref: se lee en cada frame, así el registro
  // ocurre una sola vez aunque las props cambien de identidad.
  const configRef = useRef<DepthConfig>({
    depth,
    speed,
    offset,
    pointer,
    fadeOut,
    fadeIn,
    baseOpacity,
    rotate,
  });
  configRef.current = { depth, speed, offset, pointer, fadeOut, fadeIn, baseOpacity, rotate };

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || !registry) return;
    return registry.register({ el, getConfig: () => configRef.current });
  }, [registry]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
