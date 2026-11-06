import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import PageHero from "@/components/marketing/PageHero";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CircleHelp, CreditCard, ShieldCheck, ShoppingBag } from "lucide-react";
import { useI18n } from "@/i18n";

const faqs =
[
    { categoryKey: "mkt.faq.catOrdering", icon: ShoppingBag, qKey: "mkt.faq.q1", aKey: "mkt.faq.a1" },
    { categoryKey: "mkt.faq.catOrdering", icon: ShoppingBag, qKey: "mkt.faq.q2", aKey: "mkt.faq.a2" },
    { categoryKey: "mkt.faq.catPayments", icon: CreditCard, qKey: "mkt.faq.q3", aKey: "mkt.faq.a3" },
    { categoryKey: "mkt.faq.catAccounts", icon: ShieldCheck, qKey: "mkt.faq.q4", aKey: "mkt.faq.a4" },
    { categoryKey: "mkt.faq.catOrdering", icon: ShoppingBag, qKey: "mkt.faq.q5", aKey: "mkt.faq.a5" },
    { categoryKey: "mkt.faq.catVendors", icon: CircleHelp, qKey: "mkt.faq.q6", aKey: "mkt.faq.a6" },
    { categoryKey: "mkt.faq.catAccess", icon: ShieldCheck, qKey: "mkt.faq.q7", aKey: "mkt.faq.a7" },
    { categoryKey: "mkt.faq.catSupport", icon: CircleHelp, qKey: "mkt.faq.q8", aKey: "mkt.faq.a8" },
];

export default function FAQ()
{
    const { t } = useI18n();
    const [query, setQuery] = useState("");
    const [category, setCategory] = useState("all");

    const topics: [typeof ShoppingBag, string, string][] =
    [
        [ShoppingBag, t("mkt.faq.topicOrderingTitle"), t("mkt.faq.topicOrderingDesc")],
        [CreditCard, t("mkt.faq.topicPricingTitle"), t("mkt.faq.topicPricingDesc")],
        [ShieldCheck, t("mkt.faq.topicAccountsTitle"), t("mkt.faq.topicAccountsDesc")],
    ];

    const categories = useMemo(() => Array.from(new Set(faqs.map((f) => f.categoryKey))), []);

    const filtered = useMemo(() =>
    {
        const needle = query.trim().toLowerCase();
        return faqs.filter((f) =>
        {
            if (category !== "all" && f.categoryKey !== category) return false;
            if (!needle) return true;
            return (
                t(f.qKey).toLowerCase().includes(needle) ||
                t(f.aKey).toLowerCase().includes(needle)
            );
        });
    }, [category, query, t]);

    return (
        <div className="support-page support-faq">
            <PageHero
                eyebrow={t("mkt.faq.eyebrow")}
                title={t("mkt.faq.title")}
                description={t("mkt.faq.description")}
            />

            <section className="container mx-auto max-w-4xl px-4 py-12 md:py-16">
                <div className="mb-8 grid gap-3 sm:grid-cols-3">
                    {topics.map(([Icon, title, copy]) => (
                        <div key={title} className="flex items-center gap-3 rounded-lg border bg-card p-4"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-primary/10 text-primary"><Icon className="h-5 w-5" /></span><span><strong className="block text-sm">{title}</strong><span className="text-xs text-muted-foreground">{copy}</span></span></div>
                    ))}
                </div>

                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="relative flex-1">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                        <Input
                            type="search"
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            placeholder={t("mkt.polish.faqSearch")}
                            aria-label={t("mkt.polish.filter")}
                            className="pl-9"
                        />
                    </div>
                    <div role="group" aria-label={t("mkt.polish.filter")} className="flex flex-wrap gap-1.5">
                        <Button
                            type="button"
                            size="sm"
                            variant={category === "all" ? "default" : "outline"}
                            className="h-8 rounded-full"
                            onClick={() => setCategory("all")}
                        >
                            {t("mkt.polish.filterAll")}
                        </Button>
                        {categories.map((key) => (
                            <Button
                                key={key}
                                type="button"
                                size="sm"
                                variant={category === key ? "default" : "outline"}
                                className="h-8 rounded-full"
                                onClick={() => setCategory(key)}
                            >
                                {t(key)}
                            </Button>
                        ))}
                    </div>
                </div>

                {filtered.length === 0 ? (
                    <div className="rounded-lg border bg-card px-5 py-8 text-center text-muted-foreground">
                        {t("mkt.polish.noFaqs")}
                    </div>
                ) : (
                    <Accordion type="single" collapsible className="w-full rounded-lg border bg-card px-5 md:px-7">
                        {filtered.map((f, i) => (
                            <AccordionItem key={f.qKey} value={`item-${i}`}>
                                <AccordionTrigger className="gap-4 py-5 text-left text-base"><span><span className="mb-1 block text-xs font-semibold uppercase text-primary">{t(f.categoryKey)}</span>{t(f.qKey)}</span></AccordionTrigger>
                                <AccordionContent className="max-w-2xl pb-5 leading-7 text-muted-foreground">{t(f.aKey)}</AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                )}

                <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t pt-8 text-center sm:flex-row sm:text-left">
                    <div><h2 className="font-semibold">{t("mkt.faq.stillLookingTitle")}</h2><p className="text-sm text-muted-foreground">{t("mkt.faq.stillLookingText")}</p></div>
                    <Button asChild><Link to="/help">{t("mkt.faq.visitHelpCenter")}</Link></Button>
                </div>
            </section>
        </div>
    );
}
