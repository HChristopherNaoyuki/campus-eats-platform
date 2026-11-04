import { useCallback, useEffect, useState } from "react";

/**
 * Save-for-later and recently-viewed tracking for the public pages.
 *
 * Both lists live in localStorage so they survive reloads and are scoped to
 * the browser. Saved entries keep their title; recent entries are trimmed to
 * the last five unique pages.
 */
export interface PageEntry
{
    path: string;
    title: string;
}

const SAVED_KEY = "campus-eats-saved-pages";
const RECENT_KEY = "campus-eats-recent-pages";
const MAX_RECENT = 5;

const readList = (key: string): PageEntry[] =>
{
    try
    {
        const raw = window.localStorage.getItem(key);
        const parsed = raw ? (JSON.parse(raw) as unknown) : [];
        return Array.isArray(parsed)
            ? parsed.filter(
                  (entry): entry is PageEntry =>
                      typeof entry === "object" &&
                      entry !== null &&
                      typeof (entry as PageEntry).path === "string" &&
                      typeof (entry as PageEntry).title === "string"
              )
            : [];
    }
    catch
    {
        return [];
    }
};

const writeList = (key: string, entries: PageEntry[]): void =>
{
    try
    {
        window.localStorage.setItem(key, JSON.stringify(entries));
    }
    catch
    {
        // Private browsing: the lists apply for this visit only.
    }
};

export function usePageLibrary()
{
    const [saved, setSaved] = useState<PageEntry[]>([]);
    const [recent, setRecent] = useState<PageEntry[]>([]);

    useEffect(() =>
    {
        setSaved(readList(SAVED_KEY));
        setRecent(readList(RECENT_KEY));
    }, []);

    const isSaved = useCallback(
        (path: string) => saved.some((entry) => entry.path === path),
        [saved]
    );

    const toggleSaved = useCallback((entry: PageEntry) =>
    {
        const list = readList(SAVED_KEY);
        const next = list.some((item) => item.path === entry.path)
            ? list.filter((item) => item.path !== entry.path)
            : [{ path: entry.path, title: entry.title }, ...list];
        writeList(SAVED_KEY, next);
        setSaved(next);
        return next.some((item) => item.path === entry.path);
    }, []);

    const recordRecent = useCallback((entry: PageEntry) =>
    {
        const list = readList(RECENT_KEY).filter((item) => item.path !== entry.path);
        const next = [entry, ...list].slice(0, MAX_RECENT);
        writeList(RECENT_KEY, next);
        setRecent(next);
    }, []);

    return { saved, recent, isSaved, toggleSaved, recordRecent };
}
