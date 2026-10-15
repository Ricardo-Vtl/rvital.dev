import { type Lang } from "@/lib/i18n";

export const personalInfo = {
  name: "Ricardo Vital",
  initials: "RV",
  title: { en: "Full-Stack Web Developer", es: "Desarrollador Web Full-Stack" },
  tagline: {
    en: "I build complete web applications — from idea to deployment.",
    es: "Construyo aplicaciones web completas — de la idea al despliegue.",
  },
  email: "vitalnegretericardo@gmail.com",
  location: {
    en: "Irapuato, GTO · MX — Remote / On-site",
    es: "Irapuato, GTO · MX — Remoto / Presencial",
  },
  social: {
    github: "https://github.com/Ricardo-Vtl",
    linkedin: "https://www.linkedin.com/in/ricardo-vital-dev",
  },
  bio: {
    en: [
      "I'm a full-stack web developer from Irapuato, building complete web applications since August 2024 — from idea to deployment. I trained in Computer Systems Engineering at the Instituto Tecnológico Superior de Irapuato (TecNM) for 10 semesters and as a Mechatronics Technician; since then I've built my education independently, focused on modern full-stack web development.",
      "I'm passionate about adopting new tools — not for the sake of trend, but because they represent real leaps in performance, maintainability, and developer experience. I'd rather have solid engineering underneath than something that only looks good — software should stay reliable as it grows.",
    ],
    es: [
      "Soy desarrollador web full-stack de Irapuato, construyendo aplicaciones web completas desde agosto de 2024 — de la idea al despliegue. Me formé en Ingeniería en Sistemas Computacionales en el Instituto Tecnológico Superior de Irapuato (TecNM) durante 10 semestres y como Técnico en Mecatrónica; desde entonces he construido mi formación de forma autónoma, enfocado en desarrollo web full-stack moderno.",
      "Me apasiona adoptar herramientas nuevas no por moda, sino porque representan saltos reales en rendimiento, mantenibilidad y experiencia de desarrollo. Prefiero una ingeniería sólida por debajo antes que algo que solo se vea bien — el software debe seguir siendo confiable a medida que crece.",
    ],
  },
};

/**
 * Tecnologías agrupadas por ambiente de uso. El orden de los grupos y de los
 * ítems es intencional (lo más fuerte primero) y se renderiza tal cual en la
 * sección Stack — edita aquí, no en el componente.
 */
export const skillGroups: { key: string; items: string[] }[] = [
  {
    key: "frontend",
    items: [
      "React",
      "Next.js",
      "TypeScript",
      "JavaScript",
      "HTML5",
      "CSS3",
      "Tailwind CSS",
      "shadcn/ui",
      "Framer Motion",
      "TanStack Query",
      "Zustand",
      "Zod",
    ],
  },
  {
    key: "backend",
    items: ["Node.js", "Python", "C#", "API REST"],
  },
  {
    key: "databases",
    items: ["PostgreSQL", "MySQL", "SQL Server", "Supabase", "Upstash Redis"],
  },
  {
    key: "tools",
    items: ["Git / GitHub", "pnpm", "Vercel", "Vitest"],
  },
  {
    key: "mobile",
    items: ["React Native"],
  },
];

interface Project {
  title: { en: string; es: string };
  description: { en: string; es: string };
  tags: string[];
  liveUrl?: string;
  repoUrl?: string;
  color: string;
  /** Capturas reales del producto, usadas como fondo del panel (opcional). */
  shots?: string[];
}

export const projects: Project[] = [
  {
    title: {
      en: "RMS — Restaurant Management System",
      es: "RMS — Sistema de Gestión para Restaurantes",
    },
    description: {
      en: "Restaurant management platform, architected and shipped end to end: a public landing with a live digital menu and online ordering, plus a 9-module panel — Dashboard, Tables, Orders, Kitchen (KDS), Cashier, Menu, Inventory, Staff and Settings. White-label identity per deployment over a clean Next.js + Supabase architecture: API-only writes with atomic PostgreSQL RPCs, row-level security, Zod validation at every boundary, real-time sync and a Vitest suite.",
      es: "Plataforma de gestión para restaurantes, arquitectada y llevada de punta a punta: landing pública con menú digital en vivo y pedidos en línea, más un panel de 9 módulos — Dashboard, Mesas, Pedidos, Cocina (KDS), Caja, Menú, Inventario, Personal y Configuración. Identidad white-label por despliegue sobre una arquitectura limpia de Next.js + Supabase: escrituras solo por API con RPC atómicas en PostgreSQL, seguridad a nivel de fila, validación Zod en cada frontera, sincronización en tiempo real y suite de pruebas con Vitest.",
    },
    tags: [
      "Next.js",
      "TypeScript",
      "Supabase",
      "TanStack Query",
      "Zod",
      "shadcn/ui",
      "Tailwind CSS",
      "Upstash Redis",
    ],
    liveUrl: "https://rms.rvital.dev",
    repoUrl: "https://github.com/Ricardo-Vtl/restaurant-manager",
    color: "#ff6b35",
    shots: [
      "/projects/rms/01-landing-dashboard.webp",
      "/projects/rms/02-menu-pedidos.webp",
    ],
  },
  {
    title: { en: "MyOrbit (planning)", es: "MyOrbit (en planeación)" },
    description: {
      en: "Productivity mobile app: To-Do, routines, calendar with reminders, performance analytics, and habit tracking. Currently in design and planning phase.",
      es: "App móvil de productividad personal: To-Do, rutinas, calendario con recordatorios, analíticas de desempeño y hábitos. En fase de diseño y planeación.",
    },
    tags: ["React Native", "TypeScript", "Planning"],
    liveUrl: undefined,
    repoUrl: undefined,
    color: "#5b7f7a",
  },
];

export const experience = [
  {
    role: { en: "Full-Stack Web Developer — Independent", es: "Desarrollador Web Full-Stack — Independiente" },
    company: { en: "Self-employed", es: "Independiente" },
    period: "2024 — Present",
    description: {
      en: "Started in August 2024 with a basic academic website (HTML, CSS, JavaScript) and moved into full-stack development in early 2025: I architected and shipped RMS, a white-label restaurant management platform — public landing with online ordering, PIN auth, a 9-module panel, atomic PostgreSQL RPCs, real-time sync and rate limiting.",
      es: "Comencé en agosto de 2024 con una web académica básica (HTML, CSS, JavaScript) y entré de lleno al desarrollo full-stack a inicios de 2025: arquitecté y desplegué RMS, una plataforma white-label de gestión para restaurantes — landing pública con pedidos en línea, autenticación por PIN, panel de 9 módulos, RPC atómicas en PostgreSQL, sincronización en tiempo real y rate limiting.",
    },
  },
  {
    role: { en: "Computer Hardware Repair & Maintenance — Independent", es: "Mantenimiento y reparación de equipo de cómputo — Independiente" },
    company: { en: "Self-employed", es: "Independiente" },
    period: "2020 — Present",
    description: {
      en: "Diagnose, maintain and repair desktops, laptops, all-in-ones and smartphones: component replacement, boot failures, overheating, OS installs and data recovery.",
      es: "Diagnóstico, mantenimiento y reparación de PCs de torre, laptops, All-in-One y smartphones: reemplazo de componentes, fallas de arranque, sobrecalentamiento, instalación de sistemas operativos y recuperación de datos.",
    },
  },
  {
    role: { en: "Computer Systems Engineering", es: "Ingeniería en Sistemas Computacionales" },
    company: { en: "Instituto Tecnológico Superior de Irapuato (TecNM)", es: "Instituto Tecnológico Superior de Irapuato (TecNM)" },
    period: "2021 — 2026 (Feb)",
    description: {
      en: "Studied up to the 10th semester; paused since February 2026 to focus on independent development and personal projects.",
      es: "Cursé estudios hasta el 10.º semestre; en pausa desde febrero de 2026 para centrarme en el desarrollo independiente y en proyectos personales.",
    },
  },
  {
    role: { en: "Mechatronics Technician", es: "Técnico en Mecatrónica" },
    company: { en: "CECyTEG", es: "CECyTEG" },
    period: "2016 — 2019",
    description: {
      en: "Completed studies with certificate and degree. Thesis: a robotic arm built from household parts with Arduino — first hands-on experience combining hardware and code.",
      es: "Estudios concluidos con certificado y título emitidos. Tesis: brazo robótico construido con piezas caseras y Arduino — primera experiencia práctica combinando hardware y código.",
    },
  },
];

export function tData<T>(value: T | { en: T; es: T }, lang: Lang): T {
  if (typeof value === "object" && value !== null && "en" in value && "es" in value) {
    return (value as Record<Lang, T>)[lang];
  }
  return value as T;
}
