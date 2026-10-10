"use client";

import { useTheme, useLang } from "./providers";
import { Moon, Sun } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const { t } = useLang();
  const prefersReducedMotion = useReducedMotion();

  return (
    <button
      onClick={toggleTheme}
      className="group flex h-11 w-11 items-center justify-center rounded-full border border-border text-text-tertiary transition-colors hover:border-border-light hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent md:h-8 md:w-8"
      aria-label={theme === "dark" ? t("theme.light") : t("theme.dark")}
    >
      <motion.div
        key={theme}
        initial={prefersReducedMotion ? undefined : { rotate: -90, opacity: 0, scale: 0.5 }}
        animate={prefersReducedMotion ? undefined : { rotate: 0, opacity: 1, scale: 1 }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.3, ease: "easeInOut" }}
      >
        {theme === "dark" ? (
          <Sun className="h-3.5 w-3.5" />
        ) : (
          <Moon className="h-3.5 w-3.5" />
        )}
      </motion.div>
    </button>
  );
}
