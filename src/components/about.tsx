"use client";

import { useLang } from "./providers";
import { personalInfo, tData } from "@/data/portfolio";
import { Reveal } from "./motion";

const marqueeSkills = [...personalInfo.skills, ...personalInfo.skills];

export function About() {
  const { t, lang } = useLang();

  return (
    <section id="about" className="relative overflow-hidden px-6 py-28 md:py-40">
      {/* Watermark editorial */}
      <div className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 select-none leading-none opacity-[0.08] md:left-8">
        <span className="font-heading text-[30vw] font-bold tracking-tighter text-text-primary md:text-[20vw]">
          ABOUT
        </span>
      </div>

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

          {/* Right: content */}
          <div className="md:col-span-8 md:col-start-4">
            <Reveal className="space-y-6">
              {tData(personalInfo.bio, lang).map((paragraph, i) => (
                <p
                  key={i}
                  className="font-body text-lg leading-relaxed text-text-secondary md:text-xl md:leading-relaxed"
                >
                  {paragraph}
                </p>
              ))}
            </Reveal>

            {/* Skills marquee */}
            <Reveal delay={0.15} className="mt-14">
              <span className="font-mono text-[10px] font-medium uppercase tracking-[0.25em] text-text-tertiary">
                {t("section.technologies")}
              </span>

              <div className="marquee relative mt-5 overflow-hidden border-y border-border py-4">
                <div className="marquee-track gap-8">
                  {marqueeSkills.map((skill, i) => (
                    <span
                      key={`${skill}-${i}`}
                      className="whitespace-nowrap font-mono text-xs uppercase tracking-[0.2em] text-text-tertiary transition-colors hover:text-accent"
                    >
                      {skill}
                      <span className="ml-8 text-accent-muted">/</span>
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
