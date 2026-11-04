import { useEffect } from "react";
import { useI18n } from "@/i18n";

/**
 * Deters casual "inspect element" attempts on the public site by blocking the
 * context menu and common devtools shortcuts.
 *
 * NOTE: this is a deterrent only, not real protection. Anything running in a
 * browser remains visible to a determined visitor; it only hides the obvious
 * entry points, as agreed in the project requirements.
 */
export default function DevtoolsGuard()
{
    const { t } = useI18n();

    useEffect(() =>
    {
        const isEditable = (target: EventTarget | null): boolean =>
        {
            if (!(target instanceof HTMLElement)) return false;
            return (
                target.isContentEditable ||
                target.tagName === "INPUT" ||
                target.tagName === "TEXTAREA" ||
                target.tagName === "SELECT"
            );
        };

        const onContextMenu = (event: MouseEvent) =>
        {
            if (!isEditable(event.target)) event.preventDefault();
        };

        const onKeyDown = (event: KeyboardEvent) =>
        {
            const key = event.key.toUpperCase();
            const blockedShortcut =
                key === "F12" ||
                (event.ctrlKey && event.shiftKey && ["I", "J", "C"].includes(key)) ||
                (event.ctrlKey && key === "U");

            if (blockedShortcut)
            {
                event.preventDefault();
            }
        };

        document.addEventListener("contextmenu", onContextMenu);
        document.addEventListener("keydown", onKeyDown);

        return () =>
        {
            document.removeEventListener("contextmenu", onContextMenu);
            document.removeEventListener("keydown", onKeyDown);
        };
    }, [t]);

    return null;
}
