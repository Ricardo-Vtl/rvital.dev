export const workflow = {
  title: { en: "How I work", es: "Cómo trabajo" },
  intro: {
    en: "Good software comes from deliberate decisions — architecture first, then code, verified at every step.",
    es: "El buen software nace de decisiones deliberadas: primero la arquitectura, luego el código, verificado en cada paso.",
  },
  steps: [
    {
      cmd: "rv.plan",
      title: { en: "Understand, then plan", es: "Entender y planear" },
      body: {
        en: "Requirements first, architecture second, code last. If the problem isn't clear, nothing gets built.",
        es: "Primero los requisitos, después la arquitectura, al final el código. Si el problema no está claro, no se construye nada.",
      },
    },
    {
      cmd: "rv.build",
      title: { en: "Build with leverage", es: "Construir con apalancamiento" },
      body: {
        en: "I turn the plan into working code step by step, keeping every decision explicit and reversible.",
        es: "Transformo el plan en código funcional paso a paso, manteniendo cada decisión explícita y reversible.",
      },
    },
    {
      cmd: "rv.verify",
      title: { en: "Verify everything", es: "Verificar todo" },
      body: {
        en: "Output is a draft until tests, review and security checks pass. Nothing ships unverified.",
        es: "La salida es un borrador hasta que pasan pruebas, revisión y seguridad. Nada se entrega sin verificar.",
      },
    },
    {
      cmd: "rv.ship",
      title: { en: "Ship and document", es: "Entregar y documentar" },
      body: {
        en: "Deploy, document the decisions, leave the system maintainable. Software that can't be maintained isn't finished.",
        es: "Despliego, documento las decisiones y dejo el sistema mantenible. Un software que no se puede mantener no está terminado.",
      },
    },
  ],
};
