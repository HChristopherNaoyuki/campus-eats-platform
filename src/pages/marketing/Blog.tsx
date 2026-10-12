import PageHero from "@/components/marketing/PageHero";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/i18n";

/** Static, editorially maintained article list. No CMS is wired up yet. */
const articles =
[
    {
        titleKey: "mkt.blog.article1Title",
        date: "2026-07-28",
        tagKey: "mkt.blog.article1Tag",
        excerptKey: "mkt.blog.article1Excerpt",
    },
    {
        titleKey: "mkt.blog.article2Title",
        date: "2026-07-12",
        tagKey: "mkt.blog.article2Tag",
        excerptKey: "mkt.blog.article2Excerpt",
    },
    {
        titleKey: "mkt.blog.article3Title",
        date: "2026-06-30",
        tagKey: "mkt.blog.article3Tag",
        excerptKey: "mkt.blog.article3Excerpt",
    },
    {
        titleKey: "mkt.blog.article4Title",
        date: "2026-06-15",
        tagKey: "mkt.blog.article4Tag",
        excerptKey: "mkt.blog.article4Excerpt",
    },
];

const dateFormatter = new Intl.DateTimeFormat("en-ZA", { day: "numeric", month: "long", year: "numeric" });

export default function Blog()
{
    const { t } = useI18n();

    return (
        <>
            <PageHero
                eyebrow={t("mkt.blog.eyebrow")}
                title={t("mkt.blog.title")}
                description={t("mkt.blog.description")}
            />

            <section className="container mx-auto px-4 py-16">
                {articles.length === 0 ? (
                    <p className="text-muted-foreground">{t("mkt.blog.empty")}</p>
                ) : (
                    <div className="grid gap-5 md:grid-cols-2">
                        {articles.map((a) => (
                            <Card key={a.titleKey} className="h-full shadow-[var(--shadow-soft)]">
                                <CardContent className="p-6 space-y-3">
                                    <div className="flex items-center gap-3">
                                        <Badge variant="secondary">{t(a.tagKey)}</Badge>
                                        <time className="text-xs text-muted-foreground" dateTime={a.date}>
                                            {dateFormatter.format(new Date(a.date))}
                                        </time>
                                    </div>
                                    <h2 className="font-semibold text-lg">{t(a.titleKey)}</h2>
                                    <p className="text-sm text-muted-foreground">{t(a.excerptKey)}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </section>
        </>
    );
}
