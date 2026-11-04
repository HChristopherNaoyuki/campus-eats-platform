import { useEffect, useState } from "react";
import { ALargeSmall } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n";

/**
 * Adjustable text sizes. Scales the root font size so every rem-based style
 * on the site grows or shrinks together. The choice is persisted.
 */
const STORAGE_KEY = "campus-eats-text-size";

const SIZES = [
    { id: "small", label: "A-", fontSize: "87.5%" },
    { id: "default", label: "A", fontSize: "100%" },
    { id: "large", label: "A+", fontSize: "112.5%" },
] as const;

type SizeId = (typeof SIZES)[number]["id"];

const readSize = (): SizeId =>
{
    const value = window.localStorage.getItem(STORAGE_KEY);
    return SIZES.some((s) => s.id === value) ? (value as SizeId) : "default";
};

export default function TextSizeControl()
{
    const { t } = useI18n();
    const [size, setSize] = useState<SizeId>("default");

    useEffect(() =>
    {
        setSize(readSize());
    }, []);

    const choose = (id: SizeId) =>
    {
        setSize(id);
        const match = SIZES.find((s) => s.id === id);
        document.documentElement.style.fontSize = match?.fontSize ?? "100%";
        try
        {
            window.localStorage.setItem(STORAGE_KEY, id);
        }
        catch
        {
            // Private browsing: the size applies for this visit only.
        }
    };

    return (
        <div role="group" aria-label={t("mkt.polish.textSize")} className="ce-text-size inline-flex items-center gap-1 rounded-full border border-border bg-background p-0.5">
            {SIZES.map((s) => (
                <Button
                    key={s.id}
                    type="button"
                    variant="ghost"
                    size="icon"
                    className={`h-7 w-7 rounded-full text-xs font-semibold ${size === s.id ? "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground" : "text-muted-foreground"}`}
                    aria-label={`${t("mkt.polish.textSize")} ${s.label}`}
                    aria-pressed={size === s.id}
                    onClick={() => choose(s.id)}
                >
                    <ALargeSmall className="h-4 w-4" aria-hidden="true" />
                    <span className="sr-only">{s.label}</span>
                </Button>
            ))}
        </div>
    );
}
