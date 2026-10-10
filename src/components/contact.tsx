"use client";

import { ArrowUpRight } from "lucide-react";
import { useLang } from "./providers";
import { personalInfo, tData } from "@/data/portfolio";
import { Reveal } from "./motion";

export function Contact() {
  const { t, lang } = useLang();

  return (
    <section id="contact" className="relative overflow-hidden px-6 py-28 md:py-40">
      {/* Watermark editorial */}
      <div className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 select-none leading-none opacity-[0.08]">
        <span className="font-heading text-[30vw] font-bold tracking-tighter text-text-primary md:text-[20vw]">
          TALK
        </span>
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="font-mono text-[10px] font-medium uppercase tracking-[0.3em] text-text-tertiary">
            {t("section.getInTouch")}
          </span>

          <div className="mx-auto mt-6 h-px w-8 bg-border" />

          <p className="mt-8 font-body text-lg leading-relaxed text-text-secondary md:text-xl">
            {t("section.contactText")}
          </p>

          <div className="mt-12">
            <a href={`mailto:${personalInfo.email}`} className="group inline-block">
              <span className="font-heading text-xl font-bold tracking-tight text-text-primary transition-colors hover:text-accent sm:text-2xl md:text-4xl">
                {personalInfo.email}
                <ArrowUpRight className="ml-1 inline-block h-5 w-5 text-text-tertiary transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent md:ml-2 md:h-6 md:w-6" />
              </span>
            </a>
          </div>

          <p className="mt-6 font-mono text-xs uppercase tracking-[0.2em] text-text-tertiary">
            {tData(personalInfo.location, lang)}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
