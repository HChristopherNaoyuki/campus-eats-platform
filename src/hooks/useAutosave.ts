import { useEffect, useState } from "react";

/**
 * Autosave for multi-field forms. Values are written to localStorage a short
 * delay after each keystroke and restored when the visitor returns.
 */
export function useAutosave(key: string, initial: Record<string, string>)
{
    const [values, setValues] = useState<Record<string, string>>(() =>
    {
        try
        {
            const raw = window.localStorage.getItem(key);
            if (raw)
            {
                const parsed = JSON.parse(raw) as Record<string, unknown>;
                const restored: Record<string, string> = { ...initial };
                for (const field of Object.keys(initial))
                {
                    if (typeof parsed[field] === "string") restored[field] = parsed[field];
                }
                if (Object.keys(restored).some((field) => restored[field] !== initial[field]))
                {
                    return restored;
                }
            }
        }
        catch
        {
            // Corrupt drafts are discarded; the blank form is used instead.
        }
        return initial;
    });

    const [restored, setRestored] = useState(
        () => Object.keys(initial).some((field) => values[field] !== initial[field])
    );

    useEffect(() =>
    {
        const timer = window.setTimeout(() =>
        {
            try
            {
                window.localStorage.setItem(key, JSON.stringify(values));
            }
            catch
            {
                // Private browsing: the draft applies for this visit only.
            }
        }, 400);
        return () => window.clearTimeout(timer);
    }, [key, values]);

    const setField = (field: string, value: string) =>
    {
        setRestored(false);
        setValues((previous) => ({ ...previous, [field]: value }));
    };

    const clear = () =>
    {
        try
        {
            window.localStorage.removeItem(key);
        }
        catch
        {
            // Nothing to clean up if storage is unavailable.
        }
        setRestored(false);
        setValues({ ...initial });
    };

    return { values, setField, restored, clear };
}
