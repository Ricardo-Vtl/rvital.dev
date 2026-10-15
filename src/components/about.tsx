"use client";

import Image from "next/image";
import { useLang } from "./providers";
import { personalInfo, tData } from "@/data/portfolio";
import { Parallax } from "./motion/parallax";
import { PointerDepth } from "./depth/pointer-depth";
import { Reveal, RevealWords } from "./motion";

export function About() {
  const { t, lang } = useLang();

  return (
    <section id="about" className="relative overflow-hidden px-6 pt-20 pb-24 md:pt-28 md:pb-40">
      {/* Plano lejano (depth 0.05): se mueve poco y responde poco al puntero */}
      <Parallax speed={0.34} className="pointer-events-none absolute inset-0 select-none">
        <PointerDepth depth={0.08} className="h-full w-full">
          <div aria-hidden="true" className="absolute top-1/2 left-0 -translate-y-1/2 leading-none opacity-[0.06] md:left-8">
            <span className="block font-heading text-[30vw] font-bold tracking-tighter text-text-primary md:text-[20vw]">
              ABOUT
            </span>
          </div>
        </PointerDepth>
      </Parallax>

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
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
          <Parallax speed={0.14} className="md:col-span-10 md:col-start-3">
            {/* Foto a la izquierda y bio fluyendo a su derecha: la fila
                aprovecha el ancho del contenido en vez de crecer vertical. */}
            <div className="md:flex md:items-start md:gap-12">
              {/* Retrato real: el ASCII es la firma del hero; la cara vive aquí.
                  Ancho fijo en md: como item flex de ancho auto colapsaria
                  (el Image fill es absoluto, no aporta ancho intrinseco). */}
              <Reveal className="mb-14 md:mb-0 md:w-[15rem] md:shrink-0">
                <div className="relative mx-auto w-full max-w-[15rem] md:mx-0">
                  <div className="relative aspect-4/5 w-full overflow-hidden border border-border-light">
                    <Image
                      src="/photo.png"
                      alt="Ricardo Vital"
                      fill
                      sizes="(max-width: 768px) 60vw, 240px"
                      className="object-cover"
                    />
                  </div>
                  {[
                    "-top-2 -left-2 border-t border-l",
                    "-top-2 -right-2 border-t border-r",
                    "-bottom-2 -left-2 border-b border-l",
                    "-bottom-2 -right-2 border-b border-r",
                  ].map((pos) => (
                    <span
                      key={pos}
                      aria-hidden="true"
                      className={`absolute h-4 w-4 border-accent/70 ${pos}`}
                    />
                  ))}
                </div>
              </Reveal>

              <Reveal className="space-y-6 md:min-w-0 md:flex-1">
                {tData(personalInfo.bio, lang).map((paragraph, i) => (
                  <p
                    key={i}
                    className="font-body text-lg leading-relaxed text-text-secondary md:text-xl md:leading-relaxed"
                  >
                    <RevealWords text={paragraph} delay={i * 0.12} />
                  </p>
                ))}
              </Reveal>
            </div>

            {/* Idiomas: bloque humano, separado del Stack técnico */}
            <Reveal delay={0.15} className="mt-14">
              <span className="font-mono text-[10px] font-medium uppercase tracking-[0.25em] text-text-tertiary">
                {t("about.languagesLabel")}
              </span>
              <p className="mt-4 font-body text-base text-text-secondary md:text-lg">
                {t("about.languages")}
              </p>
            </Reveal>
          </Parallax>
        </div>
      </div>
    </section>
  );
}
