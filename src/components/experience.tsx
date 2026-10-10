"use client";

import { useLang } from "./providers";
import { experience, tData } from "@/data/portfolio";
import { Reveal } from "./motion";

export function Experience() {
  const { t, lang } = useLang();

  return (
    <section id="experience" className="relative overflow-hidden px-6 py-28 md:py-40">
      {/* Watermark editorial */}
      <div className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 select-none leading-none opacity-[0.08]">
        <span className="font-heading text-[22vw] font-bold leading-none tracking-tighter text-text-primary md:text-[20vw]">
          PATH
        </span>
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="grid gap-12 md:grid-cols-12">
          {/* Label */}
          <div className="md:col-span-2">
            <span className="font-mono text-[10px] font-medium uppercase tracking-[0.3em] text-text-tertiary">
              {t("section.path")}
            </span>
            <div className="mt-4 h-px w-8 bg-border" />
          </div>

          {/* Timeline */}
          <div className="relative md:col-span-9 md:col-start-3">
            <div className="absolute top-1 bottom-1 left-0 w-px bg-border" />

            <div className="space-y-14 md:space-y-20">
              {experience.map((exp, i) => (
                <Reveal key={`${exp.role.en}-${exp.company.en}`} delay={i * 0.08} x={-16}>
                  <div className="relative pl-10 md:pl-14">
                    {/* Dot */}
                    <div className="absolute top-1.5 left-0">
                      <div className="flex h-5 w-5 items-center justify-center">
                        <div className="h-2.5 w-2.5 rounded-full bg-accent shadow-[0_0_14px_-2px_var(--color-accent-glow)]" />
                      </div>
                    </div>

                    <div className="mb-2 font-mono text-xs font-medium uppercase tracking-[0.15em] text-text-tertiary">
                      {exp.period}
                    </div>

                    <h3 className="font-heading text-xl font-semibold text-text-primary md:text-2xl">
                      {tData(exp.role, lang)}
                    </h3>
                    <p className="mt-0.5 font-body text-sm font-medium text-text-tertiary">
                      {tData(exp.company, lang)}
                    </p>
                    <p className="mt-3 max-w-xl font-body text-sm leading-relaxed text-text-secondary md:text-base">
                      {tData(exp.description, lang)}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
