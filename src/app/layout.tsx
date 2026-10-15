import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, IBM_Plex_Sans, JetBrains_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import { Header } from "@/components/header";
import { Preloader } from "@/components/layout/preloader";
import { FilmGrain } from "@/components/layout/grain";
import { ScrollProgress } from "@/components/layout/scroll-progress";
import { CustomCursor } from "@/components/layout/custom-cursor";
import { siteUrl } from "@/data/site";
import "./globals.css";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const sans = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Ricardo Vital — Full-Stack Web Developer",
    template: "%s — Ricardo Vital",
  },
  description:
    "Full-stack web developer from Irapuato, Mexico. I build complete web applications — from idea to deployment — with React, Next.js, TypeScript, Supabase and PostgreSQL. Portfolio of Ricardo Vital.",
  keywords: [
    "full-stack developer",
    "full-stack web developer",
    "desarrollador web",
    "react",
    "next.js",
    "typescript",
    "node.js",
    "supabase",
    "postgresql",
    "tailwind css",
    "ricardo vital",
    "irapuato",
    "web developer",
    "portfolio",
  ],
  authors: [{ name: "Ricardo Vital" }],
  creator: "Ricardo Vital",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "es_MX",
    siteName: "Ricardo Vital",
    title: "Ricardo Vital — Full-Stack Web Developer",
    description:
      "Desarrollador web full-stack de Irapuato, México. Construyo aplicaciones web completas — de la idea al despliegue — con React, Next.js, TypeScript, Supabase y PostgreSQL. Portafolio de Ricardo Vital.",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "Ricardo Vital — Full-Stack Web Developer",
    description:
      "Desarrollador web full-stack de Irapuato, México. Construyo aplicaciones web completas — de la idea al despliegue — con React, Next.js, TypeScript, Supabase y PostgreSQL.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // `cover` habilita env(safe-area-inset-*): el header respeta el notch/borde
  // en landscape y en modo standalone sin recortar contenido.
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
    { media: "(prefers-color-scheme: light)", color: "#f5f3f0" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Tema antes del primer pintado: aplica la clase `.light` leyendo
            localStorage (o prefers-color-scheme) para que no haya flash de
            color al recargar. Réplica exacta de la lógica de Providers. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';}if(t==='light'){document.documentElement.classList.add('light');}}catch(e){}",
          }}
        />
        {/* Sin JS el telón no se retira: se oculta por CSS. */}
        <noscript>
          <style>{`#preloader{display:none!important}`}</style>
        </noscript>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Ricardo Vital",
              jobTitle: "Full-Stack Web Developer",
              url: siteUrl,
              sameAs: [
                "https://github.com/Ricardo-Vtl",
                "https://www.linkedin.com/in/ricardo-vital-dev",
              ],
            }),
          }}
        />
      </head>
      <body className="min-h-screen bg-bg font-body text-text-primary antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[70] focus:border focus:border-border-light focus:bg-surface focus:px-4 focus:py-4 focus:text-sm focus:font-medium focus:text-accent"
        >
          Skip to content
        </a>
        <Providers>
          <Preloader />
          <FilmGrain />
          <ScrollProgress />
          <CustomCursor />
          <Header />
          <main id="main-content">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
