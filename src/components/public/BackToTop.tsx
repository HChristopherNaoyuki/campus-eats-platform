import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n";

/** Floating back-to-top button; appears once the reader scrolls down. */
export default function BackToTop()
{
    const { t } = useI18n();
    const [visible, setVisible] = useState(false);

    useEffect(() =>
    {
        const update = () => setVisible(window.scrollY > 400);
        update();
        window.addEventListener("scroll", update, { passive: true });
        return () =>
        {
            window.removeEventListener("scroll", update);
        };
    }, []);

    if (!visible) return null;

    return (
        <Button
            type="button"
            size="icon"
            className="fixed bottom-20 right-4 z-40 rounded-full shadow-lg md:bottom-6 md:right-6"
            aria-label={t("mkt.polish.backToTop")}
            title={t("mkt.polish.backToTop")}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
            <ArrowUp className="h-4 w-4" />
        </Button>
    );
}
