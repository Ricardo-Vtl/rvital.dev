"use client";

import { ExternalLink, GitBranch } from "lucide-react";
import { useLang } from "./providers";
import { projects, tData } from "@/data/portfolio";
import { Reveal } from "./motion";

function ProjectThumbnail({ color, index }: { color: string; index: number }) {
  return (
    <div className="relative w-full aspect-16/10 overflow-hidden">
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
  const { t, lang } = useLang();

  return (
    <section id="projects" className="relative overflow-hidden px-6 py-28 md:py-40">
      {/* Watermark editorial */}
      <div className="pointer-events-none absolute top-1/2 left-2 -translate-y-1/2 select-none leading-none opacity-[0.08]">
        <span className="block font-heading text-[22vw] font-bold leading-none tracking-tighter text-text-primary md:hidden">
          WORK
        </span>
        <span className="hidden font-heading text-[12vw] font-bold leading-none tracking-tighter text-text-primary md:block">
          WORK
        </span>
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="grid gap-12 md:grid-cols-12">
          {/* Label */}
          <div className="md:col-span-2">
            <span className="font-mono text-[10px] font-medium uppercase tracking-[0.3em] text-text-tertiary">
              {t("section.selectedWork")}
            </span>
            <div className="mt-4 h-px w-8 bg-border" />
          </div>

          {/* Projects grid */}
          <div className="grid gap-6 md:col-span-10 md:grid-cols-2">
            {projects.map((project, i) => (
              <Reveal key={project.title.en} delay={i * 0.1}>
                <article className="beam-border group relative flex h-full flex-col overflow-hidden border border-border bg-surface transition-colors hover:border-border-light hover:bg-surface-hover">
                  {/* Thumbnail */}
                  <ProjectThumbnail color={project.color} index={i} />

                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="font-heading text-xl font-semibold text-text-primary transition-colors group-hover:text-accent md:text-2xl">
                      {tData(project.title, lang)}
                    </h3>

                    <p className="mt-3 flex-1 font-body text-sm leading-relaxed text-text-secondary">
                      {tData(project.description, lang)}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-1.5">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="border border-border px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.1em] text-text-tertiary transition-colors group-hover:border-accent/25 group-hover:text-accent-muted"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="mt-6 flex items-center gap-5 border-t border-border pt-4">
                      {project.liveUrl ? (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 font-body text-sm font-medium text-text-primary transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
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
                          className="inline-flex items-center gap-1.5 font-body text-sm font-medium text-text-tertiary transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                        >
                          <GitBranch className="h-3.5 w-3.5" />
                          {t("project.source")}
                        </a>
                      ) : null}
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
