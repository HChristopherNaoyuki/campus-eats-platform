import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PageHero from "@/components/marketing/PageHero";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, UserPlus, ShoppingBag, Store, ShieldCheck, ArrowRight, CircleHelp } from "lucide-react";
import { useI18n } from "@/i18n";

const topics =
[
    { icon: UserPlus, titleKey: "mkt.help.topicAccounts", items:
    [
        { qKey: "mkt.help.q1", aKey: "mkt.help.a1" },
        { qKey: "mkt.help.q2", aKey: "mkt.help.a2" },
        { qKey: "mkt.help.q3", aKey: "mkt.help.a3" },
    ]},
    { icon: ShoppingBag, titleKey: "mkt.help.topicOrdering", items:
    [
        { qKey: "mkt.help.q4", aKey: "mkt.help.a4" },
        { qKey: "mkt.help.q5", aKey: "mkt.help.a5" },
        { qKey: "mkt.help.q6", aKey: "mkt.help.a6" },
        { qKey: "mkt.help.q7", aKey: "mkt.help.a7" },
    ]},
    { icon: Store, titleKey: "mkt.help.topicVendors", items:
    [
        { qKey: "mkt.help.q8", aKey: "mkt.help.a8" },
        { qKey: "mkt.help.q9", aKey: "mkt.help.a9" },
    ]},
    { icon: ShieldCheck, titleKey: "mkt.help.topicPrivacy", items:
    [
        { qKey: "mkt.help.q10", aKey: "mkt.help.a10" },
        { qKey: "mkt.help.q11", aKey: "mkt.help.a11" },
    ]},
];

export default function Help()
{
    const [query, setQuery] = useState("");
    const { t } = useI18n();

    const filtered = useMemo(() =>
    {
        const q = query.trim().toLowerCase();
        const withText = topics.map((topic) => ({
            ...topic,
            title: t(topic.titleKey),
            items: topic.items.map((i) => ({ ...i, q: t(i.qKey), a: t(i.aKey) })),
        }));

        if (!q)
        {
            return withText;
        }

        return withText
            .map((topic) => ({ ...topic, items: topic.items.filter((i) => (i.q + " " + i.a).toLowerCase().includes(q)) }))
            .filter((topic) => topic.items.length > 0);
    }, [query, t]);

    return (
        <div className="support-page support-help">
            <PageHero eyebrow={t("mkt.help.eyebrow")} title={t("mkt.help.title")} description={t("mkt.help.description")} />
            <section className="mx-auto max-w-5xl px-4 py-12 md:py-16 space-y-10">
                <div className="mx-auto max-w-2xl">
                    <label htmlFor="help-search" className="mb-2 block text-sm font-medium">{t("mkt.help.searchLabel")}</label>
                    <div className="relative">
                    <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        id="help-search"
                        value={query}
                        onChange={(e) => setQuery(e.target.value.slice(0, 100))}
                        placeholder={t("mkt.help.searchPlaceholder")}
                        className="h-12 pl-12 text-base shadow-sm"
                        aria-label={t("mkt.help.searchAria")}
                    />
                    </div>
                </div>

                {filtered.length === 0 && (
                    <p className="text-center text-muted-foreground">{t("mkt.help.noMatches").replace("{query}", query)}</p>
                )}

                <div className="grid items-start gap-5 md:grid-cols-2">
                    {filtered.map((topic) => (
                        <div key={topic.titleKey} className="rounded-lg border bg-card p-5 shadow-sm">
                            <div className="mb-3 flex items-center gap-3 border-b pb-4">
                                <span className="grid h-10 w-10 place-items-center rounded-md bg-primary/10 text-primary"><topic.icon className="h-5 w-5" /></span>
                                <div><h2 className="font-semibold">{topic.title}</h2><p className="text-xs text-muted-foreground">{topic.items.length} {topic.items.length === 1 ? t("mkt.help.answer") : t("mkt.help.answers")}</p></div>
                            </div>
                            <Accordion type="single" collapsible>
                                {topic.items.map((i) => (
                                    <AccordionItem key={i.qKey} value={i.qKey}>
                                        <AccordionTrigger className="text-left leading-6">{i.q}</AccordionTrigger>
                                        <AccordionContent className="leading-7 text-muted-foreground">{i.a}</AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col items-center justify-between gap-5 border-t pt-8 text-center sm:flex-row sm:text-left">
                    <div className="flex items-center gap-3"><CircleHelp className="h-6 w-6 text-primary" /><div><p className="font-semibold">{t("mkt.help.stillNeedHelp")}</p><p className="text-sm text-muted-foreground">{t("mkt.help.sendMessage")}</p></div></div>
                    <Button asChild><Link to="/contact">{t("mkt.help.contactSupport")} <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
                </div>
            </section>
        </div>
    );
}
