import type { Metadata } from "next";
import { Sora, DM_Sans } from "next/font/google";
import { Providers } from "@/components/providers";
import { Header } from "@/components/header";
import { Particles } from "@/components/particles";
import { GrainOverlay } from "@/components/grain-overlay";
import { Cursor } from "@/components/cursor";
import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Ricardo Vital — Full-Stack Developer",
    template: "%s — Ricardo Vital",
  },
  description:
    "Full-stack developer focused on clean architecture, thoughtful UX, and products that ship. Portfolio of Ricardo Vital.",
  keywords: [
    "full-stack developer",
    "react",
    "next.js",
    "typescript",
    "ricardo vital",
    "web developer",
    "frontend",
    "backend",
    "portfolio",
  ],
  authors: [{ name: "Ricardo Vital" }],
  creator: "Ricardo Vital",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Ricardo Vital",
    title: "Ricardo Vital — Full-Stack Developer",
    description: "Full-stack developer focused on clean architecture, thoughtful UX, and products that ship.",
    url: "https://ricardovital.dev",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ricardo Vital — Full-Stack Developer",
    description: "Full-stack developer focused on clean architecture, thoughtful UX, and products that ship.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${sora.variable} ${dmSans.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Ricardo Vital",
              jobTitle: "Full-Stack Developer",
              url: "https://ricardovital.dev",
              sameAs: [
                "https://github.com/ricardovital",
                "https://linkedin.com/in/ricardovital",
              ],
            }),
          }}
        />
      </head>
      <body className="min-h-screen bg-bg font-body text-text-primary antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[70] focus:rounded-full focus:border focus:border-border-light focus:bg-surface focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-accent"
        >
          Skip to content
        </a>
        <Providers>
          <Particles />
          <Header />
          <main id="main-content">{children}</main>
          <Cursor />
          <GrainOverlay />
        </Providers>
      </body>
    </html>
  );
}
