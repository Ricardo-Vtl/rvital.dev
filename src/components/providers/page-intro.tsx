"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

interface PageIntroValue {
  ready: boolean;
  finish: () => void;
}

const PageIntroContext = createContext<PageIntroValue>({
  ready: true,
  finish: () => {},
});

/**
 * Coordina el preloader con la intro del hero: el hero solo arranca su
 * coreografía cuando `ready` es true (fuentes cargadas + overlay fuera).
 */
export function PageIntroProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);

  const finish = useCallback(() => setReady(true), []);
  const value = useMemo(() => ({ ready, finish }), [ready, finish]);

  return <PageIntroContext.Provider value={value}>{children}</PageIntroContext.Provider>;
}

export function usePageIntro() {
  return useContext(PageIntroContext);
}
