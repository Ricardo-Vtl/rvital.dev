"use client";

import { Github, Linkedin, Mail, ArrowUp } from "lucide-react";
import { motion } from "framer-motion";
import { useLang } from "./providers";
import { personalInfo, tData } from "@/data/portfolio";

export function Footer() {
  const year = new Date().getFullYear();
  const { t, lang } = useLang();

  return (
    <footer className="border-t border-border px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center justify-between gap-10 md:flex-row">
          {/* Left */}
          <div className="text-center md:text-left">
            <a
              href="#"
              className="font-heading text-lg font-semibold tracking-tight text-text-tertiary transition-colors hover:text-accent"
            >
              {personalInfo.initials}
            </a>
            <p className="mt-1 font-body text-sm text-text-tertiary">
              {tData(personalInfo.title, lang)}
            </p>
          </div>

          {/* Center - Social */}
          <div className="flex items-center gap-4">
            {[
              { icon: Github, href: personalInfo.social.github, label: "GitHub" },
              { icon: Linkedin, href: personalInfo.social.linkedin, label: "LinkedIn" },
              { icon: Mail, href: `mailto:${personalInfo.email}`, label: "Email" },
            ].map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-text-tertiary transition-all hover:border-border-light hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent md:h-9 md:w-9"
                aria-label={label}
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>

          {/* Right */}
          <div className="flex items-center gap-6">
            <a
              href="#"
              className="font-body text-xs text-text-tertiary transition-colors hover:text-accent"
            >
              &copy; {year} {personalInfo.name}
            </a>
            <motion.a
              href="#"
              className="inline-flex items-center gap-1 font-body text-xs text-text-tertiary transition-colors hover:text-accent"
              whileHover={{ x: -2 }}
            >
              {t("footer.top")}
              <ArrowUp className="h-3 w-3" />
            </motion.a>
          </div>
        </div>

        <div className="mt-10 text-center">
          <p className="font-body text-xs text-text-tertiary">
            {t("footer.designed")}
          </p>
        </div>
      </div>
    </footer>
  );
}
