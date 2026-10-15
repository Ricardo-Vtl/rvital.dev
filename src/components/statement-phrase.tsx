import type { Lang } from "@/lib/i18n";

/**
 * Frase-firma del hero ("Building the next level…"). Vive en un solo lugar y
 * se reutiliza: en desktop, dentro del plano del hero; en móvil, en su propia
 * sección entre el hero y About.
 */
export function StatementPhrase({ lang }: { lang: Lang }) {
  return lang === "es" ? (
    <>
      Construyo el siguiente nivel
      <span className="text-accent"> con tecnología moderna</span>
    </>
  ) : (
    <>
      Building the next level
      <span className="text-accent"> with modern technology</span>
    </>
  );
}
