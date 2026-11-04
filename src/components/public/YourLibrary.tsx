import { Link } from "react-router-dom";
import { Bookmark, History } from "lucide-react";
import { useI18n } from "@/i18n";
import type { PageEntry } from "@/hooks/usePageLibrary";

interface YourLibraryProps
{
    saved: PageEntry[];
    recent: PageEntry[];
}

/**
 * "Save for later" and "Recently viewed" summary shown at the end of the
 * polished public pages. Lists only link entries; empty lists are hidden.
 */
export default function YourLibrary({ saved, recent }: YourLibraryProps)
{
    const { t } = useI18n();

    if (saved.length === 0 && recent.length === 0) return null;

    const renderList = (entries: PageEntry[], heading: string, icon: React.ReactNode) =>
    {
        if (entries.length === 0) return null;
        return (
            <div>
                <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold">
                    {icon}
                    {heading}
                </h2>
                <ul className="space-y-1">
                    {entries.map((entry) => (
                        <li key={entry.path}>
                            <Link
                                to={entry.path}
                                className="text-sm text-muted-foreground hover:text-foreground hover:underline"
                            >
                                {entry.title}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        );
    };

    return (
        <section aria-label={t("mkt.polish.yourLibrary")} className="ce-your-library rounded-lg border bg-card p-5">
            <div className="grid gap-6 sm:grid-cols-2">
                {renderList(saved, t("mkt.polish.savedForLater"), <Bookmark className="h-4 w-4" aria-hidden="true" />)}
                {renderList(recent, t("mkt.polish.recentlyViewed"), <History className="h-4 w-4" aria-hidden="true" />)}
            </div>
        </section>
    );
}
