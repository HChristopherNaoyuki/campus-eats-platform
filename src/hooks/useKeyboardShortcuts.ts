import { useEffect } from "react";

interface ShortcutHandlers
{
    onSearch: () => void;
    onShortcuts: () => void;
    onToggleTheme: () => void;
}

/**
 * Global keyboard shortcuts for the public site:
 *
 * - `Ctrl/⌘ + K` or `/` — smart search bar
 * - `?` — keyboard shortcut help
 * - `d` — light / dark toggle
 *
 * Shortcuts never fire while the reader is typing in a field.
 */
export function useKeyboardShortcuts({ onSearch, onShortcuts, onToggleTheme }: ShortcutHandlers)
{
    useEffect(() =>
    {
        const handler = (event: KeyboardEvent) =>
        {
            const target = event.target;
            const typing =
                target instanceof HTMLElement &&
                (target.isContentEditable ||
                    target.tagName === "INPUT" ||
                    target.tagName === "TEXTAREA" ||
                    target.tagName === "SELECT");

            const isSearchCombo =
                (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k";

            if (isSearchCombo)
            {
                event.preventDefault();
                onSearch();
                return;
            }

            if (typing || event.ctrlKey || event.metaKey || event.altKey) return;

            if (event.key === "/")
            {
                event.preventDefault();
                onSearch();
            }
            else if (event.key === "?")
            {
                event.preventDefault();
                onShortcuts();
            }
            else if (event.key.toLowerCase() === "d")
            {
                onToggleTheme();
            }
        };

        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [onSearch, onShortcuts, onToggleTheme]);
}
