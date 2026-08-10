import PageHero from "@/components/marketing/PageHero";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

/** Static, editorially maintained article list. No CMS is wired up yet. */
const articles =
[
    {
        title: "Campus Eats goes live on the Fake Restaurant API",
        date: "2026-07-28",
        tag: "Release",
        excerpt: "Restaurants, menus, sign-in, and checkout now run against live API data routed through our backend proxy.",
    },
    {
        title: "Five reports every campus vendor should read weekly",
        date: "2026-07-12",
        tag: "Guide",
        excerpt: "Sales, order summary, vendor performance, detailed order, and user activity — what each one tells you.",
    },
    {
        title: "Why we round totals up to the nearest R5",
        date: "2026-06-30",
        tag: "Product",
        excerpt: "Cash-friendly pricing at a busy stall beats exact change. Here is how the tax, rounding, and student discount stack.",
    },
    {
        title: "Designing one product for phone and desktop",
        date: "2026-06-15",
        tag: "Design",
        excerpt: "The website is not a separate site — it is the mobile application, adapted to a bigger canvas.",
    },
];

const dateFormatter = new Intl.DateTimeFormat("en-ZA", { day: "numeric", month: "long", year: "numeric" });

export default function Blog()
{
    return (
        <>
            <PageHero
                eyebrow="Blog"
                title="News, guides, and announcements"
                description="Product updates and practical guides for students and vendors using Campus Eats."
            />

            <section className="container mx-auto px-4 py-16">
                {articles.length === 0 ? (
                    <p className="text-muted-foreground">No articles have been published yet. Check back soon.</p>
                ) : (
                    <div className="grid gap-5 md:grid-cols-2">
                        {articles.map((a) => (
                            <Card key={a.title} className="h-full shadow-[var(--shadow-soft)]">
                                <CardContent className="p-6 space-y-3">
                                    <div className="flex items-center gap-3">
                                        <Badge variant="secondary">{a.tag}</Badge>
                                        <time className="text-xs text-muted-foreground" dateTime={a.date}>
                                            {dateFormatter.format(new Date(a.date))}
                                        </time>
                                    </div>
                                    <h2 className="font-semibold text-lg">{a.title}</h2>
                                    <p className="text-sm text-muted-foreground">{a.excerpt}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </section>
        </>
    );
}