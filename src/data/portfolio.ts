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
    linkedin: "https://www.linkedin.com/in/ricard0vitalnegrete/",
  },
  bio: {
    en: [
      "I studied Computer Systems Engineering at ITESI until my 10th semester, where I decided to forge my own path. Since then, I've built my education independently, focused on full-stack web development with modern technologies.",
      "I'm passionate about adopting new tools — not for the sake of trend, but because they represent real leaps in performance, maintainability, and developer experience. I believe well-integrated AI — agents, skills, specialized documentation — is the next efficiency frontier for small teams and ambitious projects.",
    ],
    es: [
      "Cursé Ingeniería en Sistemas Computacionales en el ITESI hasta 10mo semestre, donde decidí trazar mi propio camino. Desde entonces he construido mi formación de forma autónoma, enfocado en desarrollo web full-stack con tecnologías modernas.",
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
    "Upstash Redis",
    "Supabase",
    "Vercel",
    "Git / GitHub",
    "pnpm",
    "Zustand",
    "Framer Motion",
  ],
};

export const projects = [
  {
    title: { en: "Aguachilito POS", es: "Aguachilito POS" },
    description: {
      en: "Complete POS system for restaurants. Public landing page with menu and cart — no sign-up required. Payment methods (card/cash), pickup or delivery. Internal 9-module management panel: Dashboard, Tables, Orders, Kitchen (KDS), Cashier, Menu, Logistics, Staff, and Settings.",
      es: "Sistema POS completo para restaurante. Landing page pública con menú y carrito sin registro. Métodos de pago (tarjeta/efectivo), recoger o envío a domicilio. Panel interno de 9 módulos de gestión: Dashboard, Mesas, Pedidos, Cocina (KDS), Caja, Menú, Logística, Personal y Configuración.",
    },
    tags: ["Next.js", "TypeScript", "Supabase", "Tailwind CSS", "Upstash Redis", "Zustand"],
    liveUrl: "#",
    repoUrl: "https://github.com/Ricardo-Vtl/Front_Aguachilito",
    color: "#c49a4a",
  },
  {
    title: { en: "MyOrbit (planning)", es: "MyOrbit (en planeación)" },
    description: {
      en: "Productivity mobile app: To-Do, routines, calendar with reminders, performance analytics, and habit tracking. Currently in design and planning phase.",
      es: "App móvil de productividad personal: To-Do, rutinas, calendario con recordatorios, analíticas de desempeño y hábitos. En fase de diseño y planeación.",
    },
    tags: ["React Native", "TypeScript", "Planning"],
    liveUrl: "#",
    repoUrl: "#",
    color: "#5b7f7a",
  },
];

export const experience = [
  {
    role: { en: "Full-Stack Developer — Own Project", es: "Full-Stack Developer — Proyecto propio" },
    company: { en: "Aguachilito POS", es: "Aguachilito POS" },
    period: "2025 — Present",
    description: {
      en: "Full architecture and development of a restaurant POS system. Public landing page, PIN-based auth, 9-module management panel, shopping cart, real-time sync with Supabase, and rate limiting with Upstash Redis.",
      es: "Arquitectura y desarrollo completo de un sistema POS para restaurante. Landing page pública, autenticación por PIN, panel de 9 módulos, carrito de compras, sincronización en tiempo real con Supabase y rate limiting con Upstash Redis.",
    },
  },
  {
    role: { en: "Self-Taught Developer", es: "Formación Autodidacta" },
    company: { en: "Full-Stack Web Development", es: "Desarrollo Web Full-Stack" },
    period: "2023 — Present",
    description: {
      en: "Continuous study and hands-on application of React, Next.js, TypeScript, Node.js, databases, Vercel/Supabase deployment, and AI integration with agents and skills to accelerate development.",
      es: "Estudio continuo y aplicación práctica de React, Next.js, TypeScript, Node.js, bases de datos, despliegue en Vercel/Supabase, e integración de IA con agentes y skills para acelerar el desarrollo.",
    },
  },
  {
    role: { en: "Computer Systems Engineering", es: "Ing. en Sistemas Computacionales" },
    company: { en: "ITESI — Irapuato", es: "ITESI — Irapuato" },
    period: "2019 — 2024",
    description: {
      en: "Studied up to the 10th semester. Left the traditional path to focus on independent development and personal projects.",
      es: "Cursé hasta 10mo semestre. Decidí abandonar el camino tradicional para enfocarme en desarrollo autónomo y proyectos propios.",
    },
  },
  {
    role: { en: "Mechatronics Technician", es: "Técnico en Mecatrónica" },
    company: { en: "CECyTEG — Certified with Thesis", es: "CECyTEG — Concluido con titulación por tesis" },
    period: "2016 — 2019",
    description: {
      en: "Completed studies with certification and thesis defense. Technical foundation that developed my analytical approach to problem-solving.",
      es: "Estudios concluidos con certificado y tesis. Base técnica que desarrolló mi enfoque analítico para resolver problemas.",
    },
  },
];

export function tData<T>(value: T | { en: T; es: T }, lang: Lang): T {
  if (typeof value === "object" && value !== null && "en" in value && "es" in value) {
    return (value as Record<Lang, T>)[lang];
  }
  return value as T;
}
