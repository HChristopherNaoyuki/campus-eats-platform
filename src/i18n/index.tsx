/**
 * Lightweight multi-language support (English + Afrikaans).
 *
 * A small context-based translator is used instead of a third-party i18n
 * library: the project already depends on React context elsewhere and the
 * translation surface is small, so no extra dependency is justified.
 *
 * The chosen language is persisted in localStorage so it survives reloads.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type Language = "en" | "af";

const STORAGE_KEY = "campus-eats-language";

type Dictionary = Record<string, string>;

const EN: Dictionary = {
  "common.save": "Save",
  "common.cancel": "Cancel",
  "common.language": "Language",
  "common.english": "English",
  "common.afrikaans": "Afrikaans",
  "common.loading": "Loading…",

  "auth.signIn": "Sign in",
  "auth.signingIn": "Signing in…",
  "auth.google": "Continue with Google",
  "auth.or": "or",
  "auth.invalid": "Invalid credentials",

  "settings.title": "Settings",
  "settings.subtitle": "Manage your profile and app preferences",
  "settings.profile": "Profile",
  "settings.name": "Display name",
  "settings.email": "Email address",
  "settings.emailLocked": "Your email cannot be changed after registration.",
  "settings.role": "Role",
  "settings.roleLocked": "Only an administrator can change your role.",
  "settings.userId": "User ID",
  "settings.firebaseUid": "Firebase UID",
  "settings.notLinked": "Not linked",
  "settings.preferences": "Preferences",
  "settings.saved": "Settings saved",
  "settings.saveFailed": "Could not save your settings",

  "feedback.title": "Submit feedback",
  "feedback.type": "Type",
  "feedback.compliment": "Compliment",
  "feedback.complaint": "Complaint",
  "feedback.subject": "Subject",
  "feedback.message": "Message",
  "feedback.send": "Send",
  "feedback.sending": "Sending…",
  "feedback.mine": "My feedback",
  "feedback.empty": "No feedback submitted yet.",
  "feedback.thanks": "Thanks for the feedback!",
  "feedback.needMessage": "Write a short message",
  "feedback.needSubject": "Add a short subject",
  "feedback.cloudFailed": "Saved on this device, but not to the cloud:",
};

const AF: Dictionary = {
  "common.save": "Stoor",
  "common.cancel": "Kanselleer",
  "common.language": "Taal",
  "common.english": "Engels",
  "common.afrikaans": "Afrikaans",
  "common.loading": "Laai…",

  "auth.signIn": "Teken in",
  "auth.signingIn": "Besig om in te teken…",
  "auth.google": "Gaan voort met Google",
  "auth.or": "of",
  "auth.invalid": "Ongeldige besonderhede",

  "settings.title": "Instellings",
  "settings.subtitle": "Bestuur jou profiel en voorkeure",
  "settings.profile": "Profiel",
  "settings.name": "Vertoonnaam",
  "settings.email": "E-posadres",
  "settings.emailLocked": "Jou e-posadres kan nie na registrasie verander word nie.",
  "settings.role": "Rol",
  "settings.roleLocked": "Slegs 'n administrateur kan jou rol verander.",
  "settings.userId": "Gebruiker-ID",
  "settings.firebaseUid": "Firebase UID",
  "settings.notLinked": "Nie gekoppel nie",
  "settings.preferences": "Voorkeure",
  "settings.saved": "Instellings gestoor",
  "settings.saveFailed": "Kon nie jou instellings stoor nie",

  "feedback.title": "Dien terugvoer in",
  "feedback.type": "Tipe",
  "feedback.compliment": "Kompliment",
  "feedback.complaint": "Klagte",
  "feedback.subject": "Onderwerp",
  "feedback.message": "Boodskap",
  "feedback.send": "Stuur",
  "feedback.sending": "Besig om te stuur…",
  "feedback.mine": "My terugvoer",
  "feedback.empty": "Nog geen terugvoer ingedien nie.",
  "feedback.thanks": "Dankie vir die terugvoer!",
  "feedback.needMessage": "Skryf 'n kort boodskap",
  "feedback.needSubject": "Voeg 'n kort onderwerp by",
  "feedback.cloudFailed": "Op hierdie toestel gestoor, maar nie in die wolk nie:",
};

const DICTIONARIES: Record<Language, Dictionary> = { en: EN, af: AF };

interface I18nValue
{
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nValue | null>(null);

function readStoredLanguage(): Language
{
  if (typeof window === "undefined")
  {
    return "en";
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === "af" ? "af" : "en";
}

export function LanguageProvider({ children }: { children: React.ReactNode })
{
  const [lang, setLangState] = useState<Language>(readStoredLanguage);

  useEffect(() =>
  {
    window.localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((next: Language) =>
  {
    setLangState(next);
  }, []);

  // Falls back to English, then to the key itself, so a missing translation
  // never renders as an empty string.
  const t = useCallback(
    (key: string) => DICTIONARIES[lang][key] ?? EN[key] ?? key,
    [lang]
  );

  const value = useMemo<I18nValue>(() => ({ lang, setLang, t }), [lang, setLang, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue
{
  const ctx = useContext(I18nContext);

  if (!ctx)
  {
    throw new Error("useI18n must be used inside <LanguageProvider>.");
  }

  return ctx;
}
