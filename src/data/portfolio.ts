import { type Lang } from "@/lib/i18n";

export const personalInfo = {
  name: "Ricardo Vital",
  initials: "RV",
  title: { en: "Full-Stack Developer", es: "Desarrollador Full-Stack" },
  tagline: {
    en: "Self-taught, adaptable, building the next level with modern technology.",
    es: "Autodidacta, adaptable, construyendo el siguiente nivel con tecnología moderna.",
  },
  email: "vitalnegretericardo@gmail.com",
  location: { en: "Irapuato, Guanajuato, MX — Remote", es: "Irapuato, Guanajuato, MX — Remoto" },
  social: {
    github: "https://github.com/Ricardo-Vtl",
    linkedin: "https://www.linkedin.com/in/ricardo-vital-dev",
  },
  bio: {
    en: [
      "I studied Computer Systems Engineering at the Instituto Tecnológico Superior de Irapuato (TecNM) until my 10th semester, where I decided to forge my own path. Since then, I've built my education independently, focused on full-stack web development with modern technologies.",
      "I'm passionate about adopting new tools — not for the sake of trend, but because they represent real leaps in performance, maintainability, and developer experience. I believe well-integrated AI — agents, skills, specialized documentation — is the next efficiency frontier for small teams and ambitious projects.",
    ],
    es: [
      "Cursé Ingeniería en Sistemas Computacionales en el Instituto Tecnológico Superior de Irapuato (TecNM) hasta 10mo semestre, donde decidí trazar mi propio camino. Desde entonces he construido mi formación de forma autónoma, enfocado en desarrollo web full-stack con tecnologías modernas.",
      "Me apasiona adoptar herramientas nuevas no por moda, sino porque representan saltos reales en rendimiento, mantenibilidad y experiencia de desarrollo. Creo que la IA bien integrada —agentes, skills, documentación especializada— es el siguiente escalón en eficiencia para equipos pequeños y proyectos ambiciosos.",
    ],
  },
  skills: [
    "React",
    "TypeScript",
    "Next.js",
    "Node.js",
    "Tailwind CSS",
    "PostgreSQL",
    "MySQL",
    "C# (básico)",
    "API REST",
    "Upstash Redis",
    "Supabase",
    "Vercel",
    "Git / GitHub",
    "pnpm",
    "Zustand",
  ],
};

interface Project {
  title: { en: string; es: string };
  description: { en: string; es: string };
  tags: string[];
  liveUrl?: string;
  repoUrl?: string;
  color: string;
}

export const projects: Project[] = [
  {
    title: { en: "POS Web — Point of Sale Platform", es: "POS Web — Plataforma de Punto de Venta" },
    description: {
      en: "White-label POS and management platform, built and deployed end to end: public storefront with digital menu and cart, and a 9-module admin panel — Dashboard, Tables, Orders, Kitchen (KDS), Cashier, Menu, Logistics, Staff, and Settings. REST APIs, row-level security, rate limiting, automated tests, and technical documentation.",
      es: "Plataforma POS y de gestión white-label, construida y desplegada de punta a punta: storefront público con menú digital y carrito, y panel administrativo de 9 módulos — Dashboard, Mesas, Pedidos, Cocina (KDS), Caja, Menú, Logística, Personal y Configuración. APIs REST, seguridad a nivel de fila, rate limiting, pruebas automatizadas y documentación técnica.",
    },
    tags: ["Next.js", "TypeScript", "Supabase", "Tailwind CSS", "Upstash Redis", "Zustand"],
    liveUrl: undefined,
    repoUrl: undefined,
    color: "#ff6b35",
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
    role: { en: "Full-Stack Developer — Own Project", es: "Desarrollador Full-Stack — Proyecto propio" },
    company: { en: "POS Web Platform", es: "Plataforma POS Web" },
    period: "2025 — Present",
    description: {
      en: "Full architecture and development of a POS and management web platform. Public storefront, PIN-based auth, 9-module admin panel, shopping cart, real-time sync with Supabase, and rate limiting with Upstash Redis.",
      es: "Arquitectura y desarrollo completo de una plataforma web POS y de gestión. Storefront público, autenticación por PIN, panel administrativo de 9 módulos, carrito de compras, sincronización en tiempo real con Supabase y rate limiting con Upstash Redis.",
    },
  },
  {
    role: { en: "Self-Taught Developer", es: "Formación autodidacta" },
    company: { en: "Full-Stack Web Development", es: "Desarrollo Web Full-Stack" },
    period: "2023 — Present",
    description: {
      en: "Continuous study and hands-on application of React, Next.js, TypeScript, Node.js, databases, Vercel/Supabase deployment, and AI integration with agents and skills to accelerate development.",
      es: "Estudio continuo y aplicación práctica de React, Next.js, TypeScript, Node.js, bases de datos, despliegue en Vercel/Supabase, e integración de IA con agentes y skills para acelerar el desarrollo.",
    },
  },
  {
    role: { en: "Computer Systems Engineering", es: "Ingeniería en Sistemas Computacionales" },
    company: { en: "Instituto Tecnológico Superior de Irapuato (TecNM)", es: "Instituto Tecnológico Superior de Irapuato (TecNM)" },
    period: "2021 — 2026",
    description: {
      en: "Studied up to the 10th semester. Left the traditional path to focus on independent development and personal projects.",
      es: "Cursé hasta 10.º semestre. Decidí abandonar el camino tradicional para enfocarme en desarrollo autónomo y proyectos propios.",
    },
  },
  {
    role: { en: "Mechatronics Technician", es: "Técnico en Mecatrónica" },
    company: { en: "CECyTEG", es: "CECyTEG" },
    period: "2016 — 2019",
    description: {
      en: "Completed studies with certificate and degree (issued; pending pick-up at the institution). Thesis: a robotic arm built from household parts with Arduino — first hands-on experience combining hardware and code.",
      es: "Estudios concluidos con certificado y título emitidos (pendientes de recoger en la institución). Tesis: brazo robótico construido con piezas caseras y Arduino — primera experiencia práctica combinando hardware y código.",
    },
  },
];

export function tData<T>(value: T | { en: T; es: T }, lang: Lang): T {
  if (typeof value === "object" && value !== null && "en" in value && "es" in value) {
    return (value as Record<Lang, T>)[lang];
  }
  return value as T;
}
