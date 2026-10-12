import PageHero from "@/components/marketing/PageHero";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
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

    const topics: [typeof ShoppingBag, string, string][] =
    [
        [ShoppingBag, t("mkt.faq.topicOrderingTitle"), t("mkt.faq.topicOrderingDesc")],
        [CreditCard, t("mkt.faq.topicPricingTitle"), t("mkt.faq.topicPricingDesc")],
        [ShieldCheck, t("mkt.faq.topicAccountsTitle"), t("mkt.faq.topicAccountsDesc")],
    ];

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
                <Accordion type="single" collapsible className="w-full rounded-lg border bg-card px-5 md:px-7">
                    {faqs.map((f, i) => (
                        <AccordionItem key={f.qKey} value={`item-${i}`}>
                            <AccordionTrigger className="gap-4 py-5 text-left text-base"><span><span className="mb-1 block text-xs font-semibold uppercase text-primary">{t(f.categoryKey)}</span>{t(f.qKey)}</span></AccordionTrigger>
                            <AccordionContent className="max-w-2xl pb-5 leading-7 text-muted-foreground">{t(f.aKey)}</AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
                <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t pt-8 text-center sm:flex-row sm:text-left">
                    <div><h2 className="font-semibold">{t("mkt.faq.stillLookingTitle")}</h2><p className="text-sm text-muted-foreground">{t("mkt.faq.stillLookingText")}</p></div>
                    <Button asChild><Link to="/help">{t("mkt.faq.visitHelpCenter")}</Link></Button>
                </div>
            </section>
        </div>
    );
}
