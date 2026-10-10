export const workflow = {
  title: { en: "How I work", es: "Cómo trabajo" },
  intro: {
    en: "AI is my tool, not my replacement: I set the architecture and I verify everything.",
    es: "La IA es mi herramienta, no mi reemplazo: yo defino la arquitectura y lo verifico todo.",
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
        en: "I orchestrate AI agents and MCP tooling from the CLI — I direct, they accelerate. They never get secrets or sensitive data.",
        es: "Orquesto agentes de IA y herramientas MCP desde la CLI — yo dirijo, ellos aceleran. Nunca reciben secretos ni datos sensibles.",
      },
    },
    {
      cmd: "rv.verify",
      title: { en: "Verify everything", es: "Verificar todo" },
      body: {
        en: "AI output is a draft until tests, review and security checks pass. Nothing ships unverified.",
        es: "La salida de la IA es un borrador hasta que pasan pruebas, revisión y seguridad. Nada se entrega sin verificar.",
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
