"use client";

import Link from "next/link";
import { useLang } from "@/components/providers";
import { personalInfo } from "@/data/portfolio";

export default function NotFound() {
  const { t } = useLang();

  return (
    <div className="flex min-h-svh flex-col items-center justify-center px-6 text-center">
      <span className="font-heading text-8xl font-bold text-accent">404</span>
      <h1 className="mt-4 font-heading text-2xl font-semibold text-text-primary">
        {t("404.title")}
      </h1>
      <p className="mt-2 font-body text-text-secondary">
        {t("404.description")}
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center rounded-full bg-accent px-6 py-3 font-body text-sm font-medium text-white transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        {t("404.back")}
      </Link>
    </div>
  );
}
