import { useI18n, type Language } from "@/i18n";

/**
 * Compact EN / AF toggle shared by the public header and the dashboard header.
 * The choice is stored by LanguageProvider, so it persists across pages and reloads.
 */
export default function LanguageSwitcher({ className = "" }: { className?: string })
{
  const { lang, setLang, t } = useI18n();
  const options: { value: Language; label: string; name: string }[] =
  [
    { value: "en", label: "EN", name: t("common.english") },
    { value: "af", label: "AF", name: t("common.afrikaans") },
  ];

  return (
    <div role="group" aria-label={t("common.language")} className={`inline-flex rounded-full border border-border bg-background p-0.5 text-xs font-semibold ${className}`}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          title={o.name}
          aria-pressed={lang === o.value}
          onClick={() => setLang(o.value)}
          className={`rounded-full px-2.5 py-1 transition-colors ${lang === o.value ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
