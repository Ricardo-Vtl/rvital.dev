"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { ArrowDown, Github, Linkedin } from "lucide-react";
import { useLang } from "./providers";
import { personalInfo, tData } from "@/data/portfolio";

const techPills = ["React", "TypeScript", "Next.js", "Node.js"];

const barcodeBars = [2, 4, 1, 3, 5, 2, 1, 4, 2, 6, 1, 3, 2, 5, 1, 2, 4, 1, 3, 5, 2, 1, 4, 2, 6, 1, 3, 2];

const waveConfig = (prefersReducedMotion: boolean | null) => ({
  wave1: { delay: prefersReducedMotion ? 0 : 0, duration: prefersReducedMotion ? 0 : 0.8 },
  wave2: { delay: prefersReducedMotion ? 0 : 0.6, duration: prefersReducedMotion ? 0 : 1.0 },
  wave3: { delay: prefersReducedMotion ? 0 : 1.0, duration: prefersReducedMotion ? 0 : 0.7 },
  wave4: { delay: prefersReducedMotion ? 0 : 1.4, duration: prefersReducedMotion ? 0 : 0.6 },
  wave5: { delay: prefersReducedMotion ? 0 : 2.0, duration: prefersReducedMotion ? 0 : 0.5 },
  wave6: { delay: prefersReducedMotion ? 0 : 2.4, duration: prefersReducedMotion ? 0 : 0.5 },
  wave7: { delay: prefersReducedMotion ? 0 : 2.8, duration: prefersReducedMotion ? 0 : 0.5 },
});

function FadeIn({
  children,
  delay,
  duration,
  y = 20,
  x = 0,
}: {
  children: React.ReactNode;
  delay: number;
  duration: number;
  y?: number;
  x?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y, x }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      transition={{ duration, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function Hero() {
  const photoRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const { t, lang } = useLang();
  const wave = waveConfig(prefersReducedMotion);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(mouseY, { stiffness: 120, damping: 25 });
  const rotateY = useSpring(mouseX, { stiffness: 120, damping: 25 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!photoRef.current) return;
    const rect = photoRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    mouseX.set(((e.clientX - cx) / rect.width) * 10);
    mouseY.set(((e.clientY - cy) / rect.height) * -10);
  };

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden px-6">
      {/* Dot grid background */}
      <div className="pointer-events-none absolute inset-0 select-none opacity-[0.03]">
        <svg className="h-full w-full" aria-hidden="true">
          <defs>
            <pattern id="dotGrid" width="32" height="32" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="0.8" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dotGrid)" />
        </svg>
      </div>

      {/* Decorative horizontal lines */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: wave.wave2.duration, delay: wave.wave2.delay, ease: [0.25, 0.1, 0.25, 1] }}
        className="absolute top-1/4 right-0 h-px w-1/3 origin-right bg-border"
      />
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: wave.wave2.duration, delay: wave.wave2.delay + 0.2, ease: [0.25, 0.1, 0.25, 1] }}
        className="absolute bottom-1/4 left-0 h-px w-1/2 origin-left bg-border"
      />

      {/* Watermark */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none leading-none opacity-[0.08]">
        <span className="font-heading text-[35vw] font-bold tracking-tighter text-text-primary md:text-[30vw]">
          RV
        </span>
      </div>

      {/* Main content */}
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center gap-12 md:flex-row md:gap-20">

        {/* ─── LEFT: Text ─── */}
        <div className="flex flex-1 flex-col items-center text-center md:items-start md:text-left">
          {/* Subtitle */}
          <FadeIn delay={wave.wave3.delay} duration={wave.wave3.duration}>
            <span className="font-body text-xs font-medium uppercase tracking-[0.3em] text-text-tertiary">
              {tData(personalInfo.title, lang)}
            </span>
          </FadeIn>

          {/* Rule */}
          <FadeIn delay={wave.wave3.delay + 0.15} duration={wave.wave3.duration}>
            <div className="mt-4 h-px w-12 bg-accent/40" />
          </FadeIn>

          {/* Name */}
          <FadeIn delay={wave.wave4.delay} duration={wave.wave4.duration} y={30}>
            <h1 className="mt-8 font-heading text-6xl font-bold leading-[0.9] tracking-tight md:text-7xl lg:text-8xl xl:text-9xl">
              {"RICARDO".split("").map((char, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, x: prefersReducedMotion ? 0 : -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.1,
                    delay: (prefersReducedMotion ? 0 : wave.wave4.delay + 0.3) + i * 0.04,
                    ease: "easeOut",
                  }}
                  className="inline-block text-text-primary"
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
              <br />
              {"VITAL".split("").map((char, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, x: prefersReducedMotion ? 0 : -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.1,
                    delay: (prefersReducedMotion ? 0 : wave.wave4.delay + 0.8) + i * 0.04,
                    ease: "easeOut",
                  }}
                  className="inline-block text-text-primary"
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}

              {/* Animated dots — inline con VITAL */}
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: prefersReducedMotion ? 0 : wave.wave4.delay + 1.3, duration: 0.3 }}
                className="ml-3 inline-flex items-end gap-1.5"
              >
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={
                      prefersReducedMotion
                        ? { opacity: 1, scale: 1 }
                        : {
                            opacity: [1, 0.2, 1],
                            scale: [1, 0.65, 1],
                          }
                    }
                    transition={{
                      duration: 1.8,
                      delay: i * 0.35,
                      repeat: Infinity,
                      ease: [0.65, 0, 0.35, 1],
                    }}
                    className="h-3 w-3 bg-text-tertiary"
                  />
                ))}
              </motion.span>
            </h1>
          </FadeIn>

          {/* Tagline */}
          <FadeIn delay={wave.wave5.delay} duration={wave.wave5.duration} y={20}>
            <div className="mt-8 flex gap-4 md:mt-10">
              <div className="hidden w-px shrink-0 bg-accent/30 md:block" />
              <p className="max-w-md font-body text-base leading-relaxed text-text-secondary md:text-lg">
                {tData(personalInfo.tagline, lang)}
              </p>
            </div>
          </FadeIn>

          {/* CTA */}
          <FadeIn delay={wave.wave6.delay} duration={wave.wave6.duration} y={20}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4 md:justify-start">
              <a
                href="#projects"
                className="inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3 text-sm font-medium text-white transition-all hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <span>{t("hero.viewProjects")}</span>
                <ArrowDown className="h-3.5 w-3.5" />
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
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-text-secondary transition-all hover:border-accent/30 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent md:h-10 md:w-10"
                    aria-label={label}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* Tech pills — mobile only */}
          <FadeIn delay={wave.wave7.delay} duration={wave.wave7.duration} y={15}>
            <div className="mt-8 flex flex-wrap justify-center gap-2 md:hidden">
              {techPills.map((pill, i) => (
                <motion.span
                  key={pill}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: prefersReducedMotion ? 0 : 0.3,
                    delay: prefersReducedMotion ? 0 : wave.wave7.delay + 0.1 + i * 0.06,
                  }}
                  className="cursor-default rounded-full border border-accent/15 bg-accent-subtle px-2.5 py-0.5 font-body text-[10px] text-accent-muted"
                >
                  {pill}
                </motion.span>
              ))}
            </div>
          </FadeIn>
        </div>

        {/* ─── RIGHT: Badge card + Tech pills — desktop only ─── */}
        <div className="hidden md:block">
          <div className="flex flex-col items-center gap-6">
            {/* Badge card */}
            <div
              ref={photoRef}
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => {
                setHovered(false);
                mouseX.set(0);
                mouseY.set(0);
              }}
              className="relative"
              style={{ perspective: "1200px" }}
            >
              <div
                className={`pointer-events-none absolute -inset-12 rounded-full bg-accent/15 blur-3xl transition-all duration-700 ${
                  hovered ? "scale-150 opacity-100" : "scale-100 opacity-20"
                }`}
              />
              <div
                className={`pointer-events-none absolute -inset-8 rounded-full bg-accent/20 blur-2xl transition-all duration-500 ${
                  hovered ? "opacity-100" : "opacity-0"
                }`}
              />

              <motion.div
                style={prefersReducedMotion ? {} : { rotateX, rotateY }}
                whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
                transition={{ type: "spring", stiffness: 180, damping: 22 }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.85, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{
                    duration: prefersReducedMotion ? 0 : 0.6,
                    delay: prefersReducedMotion ? 0 : 0.15,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                >
                  <motion.div
                    animate={!prefersReducedMotion && !hovered ? { y: [0, -6, 0] } : { y: 0 }}
                    transition={
                      !prefersReducedMotion && !hovered
                        ? { duration: 4.5, repeat: Infinity, ease: "easeInOut" }
                        : { duration: 0.3 }
                    }
                  >
                    {/* Badge card */}
                    <div className="relative w-56 rounded-xl border border-accent/20 bg-gradient-to-b from-surface to-accent-subtle px-4 pb-4 pt-9 shadow-xl shadow-accent/10">
                      <div className="pointer-events-none absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

                      <div className="absolute top-3 left-1/2 h-3.5 w-3.5 -translate-x-1/2 rounded-full border-2 border-accent/40 bg-bg shadow-[inset_0_1px_4px_rgba(0,0,0,0.4)]" />

                      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-md bg-black/40">
                        <Image
                          src="/photo.png"
                          alt="Ricardo Vital"
                          fill
                          className="object-cover"
                          sizes="224px"
                          priority
                        />
                      </div>

                      <div className="mx-auto mt-3 h-px w-10 bg-accent/30" />

                      <div className="mt-3 space-y-0.5 text-center">
                        <p className="font-heading text-sm font-semibold tracking-tight text-text-primary">
                          {personalInfo.name}
                        </p>
                        <p className="font-body text-[10px] uppercase tracking-[0.15em] text-accent-muted">
                          {tData(personalInfo.title, lang)}
                        </p>
                      </div>

                      <div className="mx-auto mt-3 h-5 w-full rounded-[2px] bg-gradient-to-b from-[#2a2a2a] to-[#1a1a1a] shadow-inner" />

                      <div className="mx-auto mt-2 flex h-6 items-center justify-center gap-[1.5px] opacity-70">
                        {barcodeBars.map((width, i) => (
                          <div
                            key={i}
                            className="h-full bg-text-tertiary"
                            style={{ width: `${width}px`, opacity: i % 3 === 0 ? 0.9 : 0.5 }}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>

            {/* Tech pills — desktop only */}
            <div className="flex flex-wrap justify-center gap-2">
              {techPills.map((pill, i) => (
                <motion.span
                  key={pill}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: prefersReducedMotion ? 0 : 0.35,
                    delay: prefersReducedMotion ? 0 : 2.4 + i * 0.08,
                  }}
                  className="cursor-default rounded-full border border-accent/15 bg-accent-subtle px-3 py-1 font-body text-[11px] text-accent-muted transition-colors hover:border-accent/30 hover:text-accent"
                >
                  {pill}
                </motion.span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <FadeIn delay={wave.wave6.delay + 0.4} duration={0.6}>
        <div className="absolute bottom-10 left-1/2 hidden -translate-x-1/2 md:block">
          <motion.div
            animate={prefersReducedMotion ? {} : { y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2"
          >
            <span className="font-body text-[10px] uppercase tracking-[0.3em] text-text-tertiary">
              {t("hero.scroll")}
            </span>
            <div className="h-8 w-px bg-accent/30" />
          </motion.div>
        </div>
      </FadeIn>
    </section>
  );
}
