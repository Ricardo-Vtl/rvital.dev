"use client";

import { useLang } from "./providers";
import { personalInfo, tData } from "@/data/portfolio";
import { Parallax } from "./motion/parallax";
import { PointerDepth } from "./depth/pointer-depth";
import { Reveal, RevealWords } from "./motion";
import { VelocityMarquee } from "./motion/velocity-marquee";

export function About() {
  const { t, lang } = useLang();

  return (
    <section id="about" className="relative overflow-hidden px-6 py-28 md:py-40">
      {/* Plano lejano (depth 0.05): se mueve poco y responde poco al puntero */}
      <Parallax speed={0.34} className="pointer-events-none absolute inset-0 select-none">
        <PointerDepth depth={0.08} className="h-full w-full">
          <div className="absolute top-1/2 left-0 -translate-y-1/2 leading-none opacity-[0.06] md:left-8">
            <span className="block font-heading text-[30vw] font-bold tracking-tighter text-text-primary md:text-[20vw]">
              ABOUT
            </span>
          </div>
        </PointerDepth>
      </Parallax>

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="grid gap-12 md:grid-cols-12">
          {/* Left: vertical label */}
          <div className="hidden md:col-span-2 md:flex md:flex-col md:items-center md:justify-start">
            <div className="flex flex-col items-center gap-4">
              <div className="h-16 w-px bg-border" />
              <span className="font-mono text-[10px] font-medium uppercase tracking-[0.3em] text-text-tertiary [writing-mode:vertical-lr]">
                {t("nav.about")}
              </span>
              <div className="h-8 w-px bg-border" />
            </div>
          </div>

          {/* Right: content — plano cercano (depth 0.5): deriva menos que el fondo */}
          <Parallax speed={0.14} className="md:col-span-8 md:col-start-4">
            <Reveal className="space-y-6">
              {tData(personalInfo.bio, lang).map((paragraph, i) => (
                <p
                  key={i}
                  className="font-body text-lg leading-relaxed text-text-secondary md:text-xl md:leading-relaxed"
                >
                  <RevealWords text={paragraph} delay={i * 0.12} />
                </p>
              ))}
            </Reveal>

            {/* Plano cercano (depth 0.75): responde más al puntero */}
            <Reveal delay={0.15} className="mt-14">
              <span className="font-mono text-[10px] font-medium uppercase tracking-[0.25em] text-text-tertiary">
                {t("section.technologies")}
              </span>

              <PointerDepth depth={0.7} className="mt-5 border-y border-border py-5">
                <VelocityMarquee items={personalInfo.skills} duration={34} size="sm" />
              </PointerDepth>
            </Reveal>
          </Parallax>
        </div>
      </div>
    </section>
  );
}
