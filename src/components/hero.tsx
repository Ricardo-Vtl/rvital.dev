"use client";

import dynamic from "next/dynamic";
import { useCallback, useLayoutEffect, useRef } from "react";
import { m } from "motion/react";
import Image from "next/image";
import { ArrowDown, Github, Linkedin } from "lucide-react";
import { useLang } from "./providers";
import { personalInfo, tData } from "@/data/portfolio";
import { SplitReveal } from "./motion/split-text";
import { DepthScene, DepthLayer, type DepthFrame } from "./depth/depth-scene";
import type { DepthFieldHandle } from "./depth/depth-field";
import { gsap } from "@/lib/gsap";
import { useReducedMotionSafe } from "@/lib/motion";
import { usePageIntro } from "./providers/page-intro";

// El campo WebGL se carga solo en cliente y fuera del bundle inicial:
// protege LCP y TTI (el canvas es decorativo, carga tras la hidratación).
const DepthField = dynamic(
  () => import("./depth/depth-field").then((mod) => mod.DepthField),
  { ssr: false },
);

export function Hero() {
  const fieldRef = useRef<DepthFieldHandle>(null);
  const badgeRef = useRef<HTMLSpanElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const ctasRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const clipRef = useRef<HTMLDivElement>(null);

  const reduced = useReducedMotionSafe();
  const enabled = !reduced;
  const { t, lang } = useLang();
  const { ready } = usePageIntro();

  const onFrame = useCallback((frame: DepthFrame) => {
    fieldRef.current?.update(frame);
  }, []);

  // ─── Intro: se dispara cuando el preloader libera `ready` ───
  useLayoutEffect(() => {
    if (!ready || reduced) return;

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.fromTo(badgeRef.current, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.7 }, 0)
      .fromTo(introRef.current, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.9 }, 0.15)
      .fromTo(
        clipRef.current,
        { clipPath: "inset(100% 0% 0% 0%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 1.5, ease: "expo.out" },
        0.2,
      )
      .fromTo(mediaRef.current, { scale: 1.06 }, { scale: 1, duration: 1.6, ease: "expo.out" }, 0.2)
      .fromTo(ctasRef.current, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.8 }, 0.5);

    return () => {
      tl.kill();
    };
  }, [ready, reduced]);

  return (
    <DepthScene length={2.4} className="relative" onFrame={onFrame}>
      {/* ─── Plano 0 · Campo de profundidad WebGL ─── */}
      <DepthLayer depth={0} className="absolute inset-0">
        {enabled && <DepthField ref={fieldRef} />}
      </DepthLayer>

      {/* ─── Plano 0.06 · Aurora (fondo más lejano) ─── */}
      <DepthLayer depth={0.06} speed={0.08} className="absolute inset-0">
        <div className="aurora" />
      </DepthLayer>

      {/* ─── Plano 0.16 · Rejilla técnica ─── */}
      <DepthLayer depth={0.16} speed={0.17} className="absolute inset-0">
        <div className="grid-texture pointer-events-none absolute inset-0" aria-hidden="true" />
      </DepthLayer>

      {/* ─── Plano 0.32 · Wordmark gigante: ancla la escala de la escena ─── */}
      <DepthLayer depth={0.32} speed={0.32} className="absolute inset-0 flex items-center justify-center">
        <span
          className="font-heading text-[34vw] leading-none font-bold tracking-tighter text-text-primary/[0.035] select-none"
          aria-hidden="true"
        >
          VITAL
        </span>
      </DepthLayer>

      {/* ─── Plano 0.5 · Contenido principal ─── */}
      <DepthLayer
        depth={0.5}
        speed={0.42}
        baseOpacity={1}
        fadeOut={[0.22, 0.48]}
        className="absolute inset-0"
      >
        <div className="mx-auto flex h-full w-full max-w-6xl items-center px-6 pt-24 pb-20">
          <div className="grid w-full grid-cols-1 items-center gap-16 md:grid-cols-12">
            <div className="md:col-span-7">
              <span
                ref={badgeRef}
                className="inline-flex items-center gap-2.5 border border-border bg-surface/70 px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-text-secondary backdrop-blur-sm"
              >
                <span className="pulse-dot h-1.5 w-1.5 bg-accent" aria-hidden="true" />
                {t("hero.available")}
              </span>

              <h1 className="mt-8 font-heading text-6xl font-bold leading-[0.92] tracking-tight text-text-primary md:text-8xl lg:text-9xl">
                <SplitReveal
                  text="Ricardo"
                  trigger="intro"
                  play={ready}
                  delay={0.05}
                  className="block"
                />
                <SplitReveal
                  text="Vital"
                  trigger="intro"
                  play={ready}
                  delay={0.18}
                  className="block text-accent"
                />
              </h1>

              <div ref={introRef} className="mt-10 flex gap-5">
                <div className="hidden w-px shrink-0 bg-accent/40 md:block" />
                <p className="max-w-md font-body text-lg leading-relaxed text-text-secondary md:text-xl">
                  {tData(personalInfo.tagline, lang)}
                </p>
              </div>

              <div ref={ctasRef} className="mt-12 flex flex-wrap items-center gap-4">
                <a
                  href="#projects"
                  data-cursor="link"
                  className="group inline-flex items-center gap-2 border border-accent bg-accent px-7 py-3 font-body text-sm font-medium text-bg transition-colors hover:border-accent-hover hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  <span>{t("hero.viewProjects")}</span>
                  <ArrowDown className="h-3.5 w-3.5 transition-transform group-hover:translate-y-0.5" />
                </a>

                <div className="flex items-center gap-2">
                  {[
                    { icon: Github, href: personalInfo.social.github, label: "GitHub" },
                    { icon: Linkedin, href: personalInfo.social.linkedin, label: "LinkedIn" },
                  ].map(({ icon: Icon, href, label }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-cursor="link"
                      className="flex h-11 w-11 items-center justify-center border border-border text-text-secondary transition-colors hover:border-accent/40 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent md:h-10 md:w-10"
                      aria-label={label}
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DepthLayer>

      {/* ─── Plano 0.72 · Foto: plano cercano, viaja casi con el scroll ───
          Móvil: full-bleed atmosférico tras el texto (con scrim).
          Desktop: columna enmarcada a la derecha. */}
      <DepthLayer
        depth={0.72}
        speed={0.6}
        baseOpacity={1}
        fadeOut={[0.3, 0.58]}
        className="absolute inset-0 md:inset-y-0 md:right-[max(1.5rem,calc(50%-44rem))] md:left-auto md:flex md:w-[min(30rem,38vw)] md:items-center"
      >
        <div className="absolute inset-0 md:hidden" aria-hidden="true">
          <Image
            src="/photo.png"
            alt=""
            fill
            sizes="100vw"
            className="object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/80 to-bg/50" />
        </div>

        <div ref={mediaRef} className="relative hidden w-full origin-top md:block">
          <div
            ref={clipRef}
            className="relative aspect-4/5 w-full overflow-hidden border border-border-light"
          >
            <Image
              src="/photo.png"
              alt="Ricardo Vital"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 384px"
              priority
            />

            {/* Esquinas técnicas */}
            {[
              "-top-2 -left-2 border-t border-l",
              "-top-2 -right-2 border-t border-r",
              "-bottom-2 -left-2 border-b border-l",
              "-bottom-2 -right-2 border-b border-r",
            ].map((pos) => (
              <span
                key={pos}
                aria-hidden="true"
                className={`absolute h-5 w-5 border-accent/70 ${pos}`}
              />
            ))}
          </div>

          <p className="mt-5 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-text-tertiary">
            Irapuato, GTO · MX
          </p>
        </div>
      </DepthLayer>

      {/* ─── Plano 0.65 · Statement intermedio: entra desde abajo y llena el pin ─── */}
      <DepthLayer
        depth={0.65}
        speed={0.55}
        offset={0.55}
        baseOpacity={1}
        fadeIn={[0.44, 0.62]}
        fadeOut={[0.8, 0.96]}
        pointer={0.09}
        className="absolute inset-0 flex items-center justify-center px-6"
      >
        <p className="max-w-3xl text-center font-heading text-4xl leading-[1.05] font-bold tracking-tight text-text-primary md:text-6xl lg:text-7xl">
          {lang === "es" ? (
            <>
              Construyo el siguiente nivel
              <span className="text-accent"> con tecnología moderna</span>
            </>
          ) : (
            <>
              Building the next level
              <span className="text-accent"> with modern technology</span>
            </>
          )}
        </p>
      </DepthLayer>

      {/* ─── Plano 0.95 · Primer plano: atraviesa la pantalla ─── */}
      <DepthLayer
        depth={0.95}
        speed={1.35}
        baseOpacity={0.95}
        pointer={0.11}
        className="pointer-events-none absolute inset-0"
      >
        {/* Esquinas del viewport */}
        {[
          "top-6 left-6 border-t border-l",
          "top-6 right-6 border-t border-r",
          "bottom-6 left-6 border-b border-l",
          "bottom-6 right-6 border-b border-r",
        ].map((pos) => (
          <span
            key={pos}
            aria-hidden="true"
            className={`absolute h-8 w-8 border-border-light ${pos}`}
          />
        ))}

        {/* Etiqueta vertical */}
        <span
          aria-hidden="true"
          className="absolute top-1/2 left-8 -translate-y-1/2 font-mono text-[9px] uppercase tracking-[0.35em] text-text-tertiary [writing-mode:vertical-lr]"
        >
          {lang === "es" ? "profundidad 0.95" : "depth 0.95"}
        </span>

        {/* Marcas de escaneo */}
        <span
          aria-hidden="true"
          className="absolute top-[28%] right-8 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.3em] text-text-tertiary"
        >
          <span className="h-px w-6 bg-border-light" />
          01 / 05
        </span>
        <span
          aria-hidden="true"
          className="absolute bottom-[26%] left-8 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.3em] text-text-tertiary"
        >
          <span className="h-px w-6 bg-border-light" />
          RV — 2026
        </span>
      </DepthLayer>

      {/* ─── Indicador de scroll: se retira en cuanto te mueves ─── */}
      <DepthLayer depth={0.85} speed={0.3} baseOpacity={1} fadeOut={[0, 0.06]} className="absolute inset-0">
        <m.div
          initial={reduced ? undefined : { opacity: 0 }}
          animate={reduced ? undefined : { opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <span className="scroll-hint flex flex-col items-center gap-2 font-mono text-[9px] uppercase tracking-[0.3em] text-text-tertiary">
            {t("hero.scroll")}
            <span className="h-8 w-px bg-border-light" />
          </span>
        </m.div>
      </DepthLayer>
    </DepthScene>
  );
}
