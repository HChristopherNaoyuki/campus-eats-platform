import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useI18n } from "@/i18n";

interface ShortcutRow
{
    keys: string;
    labelKey: string;
}

const SHORTCUTS: ShortcutRow[] = [
    { keys: "Ctrl / ⌘ + K", labelKey: "mkt.polish.shortcutSearch" },
    { keys: "/", labelKey: "mkt.polish.shortcutSearch" },
    { keys: "?", labelKey: "mkt.polish.shortcutHelp" },
    { keys: "D", labelKey: "mkt.polish.shortcutTheme" },
];

/** Help dialog listing the public site's keyboard shortcuts. Opened with `?`. */
export default function ShortcutsDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void })
{
    const { t } = useI18n();

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-sm">
                <DialogHeader>
                    <DialogTitle>{t("mkt.polish.shortcutsTitle")}</DialogTitle>
                    <DialogDescription>{t("mkt.polish.shortcutsDescription")}</DialogDescription>
                </DialogHeader>
                <ul className="space-y-2">
                    {SHORTCUTS.map((shortcut) => (
                        <li key={`${shortcut.keys}-${shortcut.labelKey}`} className="flex items-center justify-between gap-4 text-sm">
                            <span>{t(shortcut.labelKey)}</span>
                            <kbd className="rounded border bg-muted px-2 py-0.5 font-mono text-xs">{shortcut.keys}</kbd>
                        </li>
                    ))}
                </ul>
            </DialogContent>
        </Dialog>
    );
}
