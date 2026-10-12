"use client";

import { useState, useEffect } from "react";
import { m, AnimatePresence } from "motion/react";
import { Menu, X, Languages } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { useReducedMotionSafe } from "@/lib/motion";
import { useLang } from "./providers";
import { personalInfo } from "@/data/portfolio";
import { cn } from "@/lib/utils";

const navLinks = [
  { key: "nav.about", href: "#about" },
  { key: "nav.workflow", href: "#workflow" },
  { key: "nav.projects", href: "#projects" },
  { key: "nav.experience", href: "#experience" },
  { key: "nav.contact", href: "#contact" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const prefersReducedMotion = useReducedMotionSafe();
  const { t, toggleLang, lang } = useLang();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <m.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.8, delay: prefersReducedMotion ? 0 : 0.3 }}
      className={cn(
        "fixed top-0 right-0 left-0 z-40 transition-all duration-500 [padding-top:env(safe-area-inset-top)] [padding-left:env(safe-area-inset-left)] [padding-right:env(safe-area-inset-right)]",
        scrolled
          ? "border-b border-border bg-bg/80 backdrop-blur-xl"
          : "bg-transparent",
      )}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <a
          href="#"
          className="px-1 font-heading text-lg font-semibold tracking-tight text-text-tertiary transition-colors hover:text-accent"
        >
          {personalInfo.initials}
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="py-2 font-body text-xs font-medium uppercase tracking-[0.2em] text-text-tertiary transition-colors hover:text-accent"
            >
              {t(link.key)}
            </a>
          ))}
          <button
            onClick={toggleLang}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-text-tertiary transition-colors hover:border-border-light hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent md:h-8 md:w-8"
            aria-label={t("lang.switch")}
          >
            <Languages className="h-3.5 w-3.5" />
          </button>
          <ThemeToggle />
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={toggleLang}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-text-tertiary transition-colors hover:border-border-light hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            aria-label={t("lang.switch")}
          >
            <Languages className="h-4 w-4" />
          </button>
          <ThemeToggle />
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-border transition-colors hover:border-border-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? (
              <X className="h-4 w-4 text-text-secondary" />
            ) : (
              <Menu className="h-4 w-4 text-text-secondary" />
            )}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <m.div
            initial={prefersReducedMotion ? undefined : { opacity: 0, height: 0 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, height: "auto" }}
            exit={prefersReducedMotion ? undefined : { opacity: 0, height: 0 }}
            className="overflow-hidden border-b border-border bg-bg/90 backdrop-blur-xl"
          >
            <div className="flex flex-col gap-5 px-6 pb-8">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="font-body text-sm text-text-secondary transition-colors hover:text-accent py-3"
                >
                  {t(link.key)}
                </a>
              ))}
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </m.header>
  );
}
