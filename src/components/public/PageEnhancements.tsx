import { useEffect } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import TextSizeControl from "@/components/public/TextSizeControl";
import ShareMenu from "@/components/public/ShareMenu";
import { usePageLibrary } from "@/hooks/usePageLibrary";
import { estimateReadingMinutesAll } from "@/lib/reading";
import { toast } from "sonner";
import { useI18n } from "@/i18n";

/**
 * Shared wiring for the polished public pages: page tracking, the reading
 * toolbar (text size, share, save for later) and the reading-time estimate.
 */
export function usePolishedPage(title: string)
{
    const library = usePageLibrary();
    const recordRecent = library.recordRecent;

    useEffect(() =>
    {
        recordRecent({ path: window.location.pathname, title });
    }, [recordRecent, title]);

    return library;
}

/** Text-size control, share menu and the save-for-later toggle in one row. */
export function PageToolbar({ title, library }: { title: string; library: ReturnType<typeof usePageLibrary> })
{
    const { t } = useI18n();
    const saved = library.isSaved(window.location.pathname);

    const onToggle = () =>
    {
        const nowSaved = library.toggleSaved({ path: window.location.pathname, title });
        if (nowSaved)
        {
            toast.success(t("mkt.polish.savedToast"));
        }
        else
        {
            toast.success(t("mkt.polish.unsavedToast"));
        }
    };

    return (
        <div className="flex flex-wrap items-center gap-2">
            <TextSizeControl />
            <ShareMenu title={title} />
            <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-2"
                aria-pressed={saved}
                onClick={onToggle}
            >
                {saved ? <BookmarkCheck className="h-4 w-4" aria-hidden="true" /> : <Bookmark className="h-4 w-4" aria-hidden="true" />}
                <span className="hidden sm:inline">
                    {saved ? t("mkt.polish.unsave") : t("mkt.polish.save")}
                </span>
            </Button>
        </div>
    );
}

/** Estimated reading time for the supplied copy fragments. */
export function ReadingTime({ fragments }: { fragments: string[] })
{
    const { t } = useI18n();
    const minutes = estimateReadingMinutesAll(fragments);
    if (!minutes) return null;

    return (
        <span className="text-sm text-muted-foreground">
            {t("mkt.polish.readingTime").replace("{minutes}", String(minutes))}
        </span>
    );
}
