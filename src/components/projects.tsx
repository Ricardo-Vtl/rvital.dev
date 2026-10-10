"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { ExternalLink, GitBranch } from "lucide-react";
import { useLang } from "./providers";
import { projects, tData } from "@/data/portfolio";

function ProjectThumbnail({ color, index, isWide }: { color: string; index: number; isWide: boolean }) {
  return (
    <div
      className={`relative w-full overflow-hidden ${isWide ? "aspect-[21/9]" : "aspect-[4/3]"}`}
    >
      <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <pattern id={`grid-${index}`} width="12" height="12" patternUnits="userSpaceOnUse">
            <path d="M 12 0 L 0 0 0 12" fill="none" stroke={color} strokeOpacity="0.08" strokeWidth="0.5" />
          </pattern>
          <linearGradient id={`fade-${index}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.04" />
            <stop offset="100%" stopColor={color} stopOpacity="0.12" />
          </linearGradient>
        </defs>
        <rect width="100" height="100" fill={`url(#grid-${index})`} />
        <rect width="100" height="100" fill={`url(#fade-${index})`} />
      </svg>
      <span
        className="absolute bottom-2 right-3 font-heading text-5xl font-bold leading-none tracking-tighter md:text-6xl"
        style={{ color: `${color}18` }}
      >
        {String(index + 1).padStart(2, "0")}
      </span>
    </div>
  );
}

export function Projects() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  const prefersReducedMotion = useReducedMotion();
  const { t, lang } = useLang();

  const fadeConfig = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const };

  return (
    <section id="projects" className="relative overflow-hidden px-6 py-28 md:py-40">
      {/* Background watermark — horizontal on mobile, vertical on desktop */}
      <div className="pointer-events-none absolute top-1/2 left-2 -translate-y-1/2 select-none leading-none opacity-[0.08] md:left-8 md:opacity-[0.08]">
        {/* Mobile: horizontal word */}
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.4 }}
          className="block font-heading text-[22vw] font-bold leading-none tracking-tighter text-text-primary md:hidden"
        >
          WORK
        </motion.span>
        {/* Desktop: vertical letters */}
        <div className="hidden md:flex md:flex-col md:items-center md:gap-1">
          {"WORK".split("").map((char, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.4, delay: prefersReducedMotion ? 0 : 0.1 + i * 0.08 }}
              className="font-heading text-[12vw] font-bold leading-none tracking-tighter text-text-primary"
            >
              {char}
            </motion.span>
          ))}
        </div>
      </div>

      <div ref={ref} className="relative z-10 mx-auto max-w-6xl">
        <div className="grid gap-12 md:grid-cols-12">
          {/* Label */}
          <div className="md:col-span-2">
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.6, delay: prefersReducedMotion ? 0 : 0.2 }}
            >
              <span className="font-mono text-[10px] font-medium uppercase tracking-[0.3em] text-text-tertiary">
                {t("section.selectedWork")}
              </span>
              <div className="mt-4 h-px w-8 bg-border" />
            </motion.div>
          </div>

          {/* Projects grid */}
          <div className="md:col-span-10">
            <div className="grid gap-6 md:grid-cols-6">
              {projects.map((project, i) => {
                const isWide = i === 0 || i === projects.length - 1;
                const colSpan = isWide ? "md:col-span-6" : "md:col-span-3";

                return (
                  <motion.article
                    key={project.title.en}
                    initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 40 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: prefersReducedMotion ? 0 : 40 }}
                    transition={{
                      duration: fadeConfig.duration,
                      delay: prefersReducedMotion ? 0 : 0.3 + i * 0.12,
                      ease: fadeConfig.ease,
                    }}
                    className={`group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-all hover:border-accent/20 hover:bg-surface-hover hover:shadow-lg hover:shadow-accent/5 ${colSpan}`}
                  >
                    {/* Thumbnail */}
                    <ProjectThumbnail color={project.color} index={i} isWide={isWide} />

                    <div className="flex flex-1 flex-col p-6">
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="font-heading text-xl font-semibold text-text-primary transition-colors group-hover:text-accent">
                          {tData(project.title, lang)}
                        </h3>
                      </div>

                      <p className="mt-2 flex-1 font-body text-sm leading-relaxed text-text-secondary">
                        {tData(project.description, lang)}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-border bg-surface px-2.5 py-1 font-body text-xs text-text-secondary transition-colors group-hover:border-accent/20 group-hover:bg-accent-subtle group-hover:text-accent-muted"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="mt-5 flex items-center gap-4 border-t border-border pt-4">
                        {project.liveUrl ? (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 font-body text-sm font-medium text-text-primary transition-all hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                            {t("project.live")}
                          </a>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.15em] text-text-tertiary">
                            <ExternalLink className="h-3.5 w-3.5" />
                            {t("project.soon")}
                          </span>
                        )}
                        {project.repoUrl ? (
                          <a
                            href={project.repoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 font-body text-sm font-medium text-text-tertiary transition-all hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                          >
                            <GitBranch className="h-3.5 w-3.5" />
                            {t("project.source")}
                          </a>
                        ) : null}
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
