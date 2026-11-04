import { useCallback, useEffect, useState } from "react";

/**
 * Site-wide theme (light / dark). The choice is stored under
 * `campus-eats-theme` and defaults to the operating system preference.
 *
 * A module-level store keeps every toggle in sync — the public header, the
 * dashboard header and the keyboard shortcut all share one source of truth.
 */
const STORAGE_KEY = "campus-eats-theme";

export type Theme = "light" | "dark";

let current: Theme | null = null;
const listeners = new Set<(theme: Theme) => void>();

const prefersDark = (): Theme =>
  typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";

const stored = (): Theme | null =>
{
  const value = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null;
  return value === "light" || value === "dark" ? value : null;
};

const initial = (): Theme =>
{
  if (current) return current;
  current = stored() ?? prefersDark();
  if (typeof document !== "undefined")
  {
    document.documentElement.classList.toggle("dark", current === "dark");
  }
  return current;
};

const setTheme = (theme: Theme): void =>
{
  current = theme;
  if (typeof document !== "undefined")
  {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }
  try
  {
    window.localStorage.setItem(STORAGE_KEY, theme);
  }
  catch
  {
    // Storage can be unavailable in private browsing; the theme simply will not persist.
  }
  listeners.forEach((listener) => listener(theme));
};

export function useTheme()
{
  const [theme, setLocal] = useState<Theme>(initial);

  useEffect(() =>
  {
    const listener = (next: Theme) => setLocal(next);
    listeners.add(listener);
    return () =>
    {
      listeners.delete(listener);
    };
  }, []);

  const toggle = useCallback(() =>
  {
    setTheme(initial() === "dark" ? "light" : "dark");
  }, []);

  return { theme, toggle };
}
