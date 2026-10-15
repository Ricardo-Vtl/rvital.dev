"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import { ExternalLink, GitBranch, ArrowUpRight } from "lucide-react";
import { useLang } from "./providers";
import { projects, tData } from "@/data/portfolio";
import { SplitReveal } from "./motion/split-text";
import { Parallax } from "./motion/parallax";
import { PointerDepth } from "./depth/pointer-depth";
import { gsap } from "@/lib/gsap";
import {
  isMobileViewport,
  prefersReducedMotion,
  useIsMobile,
  useReducedMotionSafe,
} from "@/lib/motion";

const SHOT_HOLD = 4;
const SHOT_FADE = 1.4;

function ProjectVisual({
  color,
  index,
  shots = [],
  total,
}: {
  color: string;
  index: number;
  shots?: string[];
  total: number;
}) {
  const shotsRef = useRef<HTMLDivElement>(null);
  const hasShots = shots.length > 0;

  // Crossfade lento entre las capturas reales (modo captura).
  useLayoutEffect(() => {
    const el = shotsRef.current;
    if (!el || shots.length <= 1 || prefersReducedMotion()) return;

    const imgs = gsap.utils.toArray<HTMLElement>("img", el);
    if (imgs.length <= 1) return;

    const ctx = gsap.context(() => {
      gsap.set(imgs, { autoAlpha: 0 });
      gsap.set(imgs[0], { autoAlpha: 1 });

      const tl = gsap.timeline({
        repeat: -1,
        defaults: { duration: SHOT_FADE, ease: "power2.inOut" },
      });
      imgs.forEach((img, i) => {
        const next = imgs[(i + 1) % imgs.length];
        tl.to(next, { autoAlpha: 1 }, `+=${SHOT_HOLD}`).to(img, { autoAlpha: 0 }, "<");
      });
    }, el);

    return () => ctx.revert();
  }, [shots]);

  const indexLabel = (
    <PointerDepth depth={0.95} className="absolute top-4 right-5 z-20">
      <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-text-primary">
        {`${String(index + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`}
      </span>
    </PointerDepth>
  );

  // ─── Modo captura: imágenes reales a plena vista, nítidas ───
  if (hasShots) {
    return (
      <div className="relative h-full w-full overflow-hidden bg-surface">
        <div ref={shotsRef} className="absolute inset-0">
          {shots.map((src, i) => (
            <Image
              key={src}
              src={src}
              alt=""
              fill
              sizes="(max-width: 768px) 92vw, 40vw"
              className="object-cover object-top motion-safe:transition-transform motion-safe:duration-[1200ms] motion-safe:ease-out motion-safe:group-hover/visual:scale-[1.03]"
              style={{ opacity: i === 0 ? 1 : 0 }}
            />
          ))}
        </div>

        {/* Scrims cortos: solo para asentar las etiquetas mono */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-bg/60 to-transparent"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-bg/85 to-transparent"
        />

        {/* Marcas de encuadre: mismo lenguaje que el retrato de About */}
        {[
          "top-2 left-2 border-t border-l",
          "top-2 right-2 border-t border-r",
          "bottom-2 left-2 border-b border-l",
          "bottom-2 right-2 border-b border-r",
        ].map((pos) => (
          <span
            key={pos}
            aria-hidden="true"
            className={`pointer-events-none absolute z-20 h-4 w-4 border-accent/80 ${pos}`}
          />
        ))}

        {indexLabel}
      </div>
    );
  }

  // ─── Modo abstracto: proyectos sin material (glow + rejilla + número) ───
  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Plano lejano: glow atmosférico (se mueve menos) */}
      <Parallax speed={0.05} className="absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(60% 50% at 72% 18%, ${color}33, transparent 70%)`,
          }}
        />
      </Parallax>

      {/* Plano medio: rejilla técnica */}
      <Parallax speed={0.1} className="absolute inset-0">
        <svg
          className="h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <pattern id={`grid-${index}`} width="8" height="8" patternUnits="userSpaceOnUse">
              <path d="M 8 0 L 0 0 0 8" fill="none" stroke={color} strokeOpacity="0.1" strokeWidth="0.4" />
            </pattern>
            <linearGradient id={`fade-${index}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.05" />
              <stop offset="100%" stopColor={color} stopOpacity="0.16" />
            </linearGradient>
          </defs>
          <rect width="100" height="100" fill={`url(#grid-${index})`} />
          <rect width="100" height="100" fill={`url(#fade-${index})`} />
        </svg>
      </Parallax>

      {/* Plano cercano: número gigante (viaja más que el fondo) */}
      <Parallax speed={0.2} className="absolute inset-0">
        <span
          className="absolute right-4 bottom-0 font-heading text-[26vw] leading-none font-bold tracking-tighter md:text-[14vw]"
          style={{ color: `${color}22` }}
          aria-hidden="true"
        >
          {String(index + 1).padStart(2, "0")}
        </span>
      </Parallax>

      {indexLabel}
    </div>
  );
}

export function Projects() {
  const { t, lang } = useLang();
  const panelsRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotionSafe();
  const isMobile = useIsMobile();

  // ─── Apilado cinemático: cada panel se hunde cuando el siguiente lo cubre ───
  useLayoutEffect(() => {
    const container = panelsRef.current;
    // `isMobileViewport()` (síncrono) evita un primer setup en móvil antes de
    // que `isMobile` hidrate; `isMobile` reactivo reconfigura al cruzar 768px.
    if (!container || reduced || isMobile || isMobileViewport()) return;

    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray<HTMLElement>("[data-panel]");

      panels.forEach((panel, i) => {
        const content = panel.querySelector<HTMLElement>("[data-panel-content]");
        const inner = panel.querySelector<HTMLElement>("[data-panel-inner]");
        if (!inner) return;

        // El último panel no se hunde: nada lo cubre.
        if (i < panels.length - 1) {
          gsap.to(inner, {
            scale: 0.9,
            opacity: 0.3,
            yPercent: -3,
            ease: "none",
            scrollTrigger: {
              trigger: panel,
              start: "top top",
              end: "bottom top",
              scrub: true,
              invalidateOnRefresh: true,
            },
          });
        }

        if (!content) return;

        gsap.from(content, {
          opacity: 0,
          y: 48,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: panel,
            start: "top 72%",
            once: true,
          },
        });
      });
    }, container);

    return () => ctx.revert();
  }, [reduced, isMobile]);

  return (
    <section id="projects" className="relative overflow-hidden bg-bg">
      {/* ─── Cabecera editorial ─── */}
      <div className="relative px-6 pt-28 pb-16 md:pt-40 md:pb-24">
        <Parallax speed={0.1} className="pointer-events-none absolute inset-0 select-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 leading-none opacity-[0.06]">
            <span className="block font-heading text-[26vw] font-bold tracking-tighter text-text-primary">
              WORK
            </span>
          </div>
        </Parallax>

        <div className="relative z-10 mx-auto max-w-6xl">
          <div className="flex items-center gap-4">
            <span className="font-mono text-[10px] font-medium uppercase tracking-[0.3em] text-text-tertiary">
              {t("section.selectedWork")}
            </span>
            <div className="h-px w-8 bg-border" />
          </div>

          <SplitReveal
            as="h2"
            text={t("section.selectedWork")}
            className="mt-8 font-heading text-5xl font-bold tracking-tight text-text-primary md:text-7xl"
            stagger={0.02}
          />
        </div>
      </div>

      {/* ─── Paneles apilados (sticky en desktop, stack simple en móvil) ─── */}
      <div ref={panelsRef} className="relative">
        {projects.map((project, i) => (
          <div
            key={project.title.en}
            data-panel
            className="relative z-0 flex min-h-[92svh] items-center bg-bg px-6 py-20 md:sticky md:top-0 md:h-svh md:min-h-0 md:py-0"
            style={{ zIndex: i + 1 }}
          >
            <div data-panel-inner className="mx-auto w-full max-w-6xl will-change-transform">
              <div
                data-panel-content
                className="grid grid-cols-1 items-center gap-12 md:grid-cols-12 md:gap-14"
              >
                {/* Texto */}
                <div className="md:col-span-7">
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-[11px] tracking-[0.25em] text-accent">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="h-px w-10 bg-border" />
                    <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-text-tertiary">
                      {String(i + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
                    </span>
                  </div>

                  <h3 className="mt-6 font-heading text-4xl leading-[0.95] font-bold tracking-tight text-text-primary md:text-6xl">
                    {tData(project.title, lang)}
                  </h3>

                  <p className="mt-7 max-w-xl font-body text-base leading-relaxed text-text-secondary md:text-lg">
                    {tData(project.description, lang)}
                  </p>

                  <div className="mt-8 flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="border border-border px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.1em] text-text-tertiary"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-10 flex items-center gap-6 border-t border-border pt-6">
                    {project.liveUrl ? (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-cursor="link"
                        className="group inline-flex items-center gap-2 border border-accent bg-accent px-6 py-2.5 font-body text-sm font-medium text-bg transition-colors hover:bg-accent-hover"
                      >
                        {t("project.live")}
                        <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </a>
                    ) : (
                      <span className="inline-flex items-center gap-2 border border-border px-6 py-2.5 font-mono text-xs uppercase tracking-[0.15em] text-text-tertiary">
                        <ExternalLink className="h-3.5 w-3.5" />
                        {t("project.soon")}
                      </span>
                    )}
                    {project.repoUrl ? (
                      <a
                        href={project.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-cursor="link"
                        className="inline-flex items-center gap-1.5 font-body text-sm font-medium text-text-tertiary transition-colors hover:text-accent"
                      >
                        <GitBranch className="h-3.5 w-3.5" />
                        {t("project.source")}
                      </a>
                    ) : null}
                  </div>
                </div>

                {/* Visual */}
                <div className="group/visual beam-border md:col-span-5">
                  <div className="relative aspect-4/5 w-full overflow-hidden border border-border-light md:aspect-3/4">
                    <ProjectVisual
                      color={project.color}
                      index={i}
                      shots={project.shots}
                      total={projects.length}
                    />
                    {!project.shots?.length && (
                      <div className="absolute inset-0 bg-gradient-to-t from-bg/70 via-transparent to-transparent" />
                    )}
                    <span className="absolute bottom-4 left-4 z-20 font-mono text-[10px] uppercase tracking-[0.3em] text-text-secondary">
                      {project.tags[0]}
                    </span>
                  </div>
                </div>              </div>
            </div>
          </div>
        ))}

        {/* Cierre de la galería */}
        <div className="relative z-10 flex min-h-[40svh] items-center justify-center border-t border-border bg-bg px-6">
          <p className="max-w-md text-center font-mono text-[11px] uppercase tracking-[0.25em] text-text-tertiary">
            {lang === "es" ? "Más proyectos en camino" : "More projects on the way"}
          </p>
        </div>
      </div>
    </section>
  );
}
