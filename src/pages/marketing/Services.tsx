import { Link } from "react-router-dom";
import PageHero from "@/components/marketing/PageHero";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCampus } from "@/store/campusStore";
import { Users, Store, UtensilsCrossed, ClipboardList, BarChart3, MessageSquare } from "lucide-react";
import { useI18n } from "@/i18n";

const modules =
[
    { titleKey: "mkt.services.module1Title", descKey: "mkt.services.module1Desc", icon: Users },
    { titleKey: "mkt.services.module2Title", descKey: "mkt.services.module2Desc", icon: Store },
    { titleKey: "mkt.services.module3Title", descKey: "mkt.services.module3Desc", icon: UtensilsCrossed },
    { titleKey: "mkt.services.module4Title", descKey: "mkt.services.module4Desc", icon: ClipboardList },
    { titleKey: "mkt.services.module5Title", descKey: "mkt.services.module5Desc", icon: BarChart3 },
    { titleKey: "mkt.services.module6Title", descKey: "mkt.services.module6Desc", icon: MessageSquare },
];

export default function Services()
{
    const { vendors, menu } = useCampus();
    const isLoading = vendors.length === 0;
    const { t } = useI18n();

    return (
        <>
            <PageHero
                eyebrow={t("mkt.services.eyebrow")}
                title={t("mkt.services.title")}
                description={t("mkt.services.description")}
            />

            <section className="container mx-auto px-4 py-16">
                <h2 className="text-2xl md:text-3xl font-bold mb-8">{t("mkt.services.modulesTitle")}</h2>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {modules.map((m) => (
                        <Card key={m.titleKey} className="h-full shadow-[var(--shadow-soft)]">
                            <CardContent className="p-6 space-y-3">
                                <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                                    <m.icon className="h-5 w-5" aria-hidden="true" />
                                </div>
                                <h3 className="font-semibold">{t(m.titleKey)}</h3>
                                <p className="text-sm text-muted-foreground">{t(m.descKey)}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            <section className="bg-secondary/40 border-y">
                <div className="container mx-auto px-4 py-16">
                    <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold">{t("mkt.services.vendorsTitle")}</h2>
                            <p className="text-muted-foreground mt-2">{t("mkt.services.vendorsSubtitle")}</p>
                        </div>
                        <Button asChild>
                            <Link to="/student">{t("mkt.services.browseAndOrder")}</Link>
                        </Button>
                    </div>

                    {isLoading ? (
                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <Skeleton key={i} className="h-32 rounded-xl" />
                            ))}
                        </div>
                    ) : (
                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                            {vendors.map((v) =>
                            {
                                const items = menu.filter((m) => m.vendorId === v.id);
                                return (
                                    <Card key={v.id} className="h-full">
                                        <CardContent className="p-5">
                                            <div className="text-xs text-muted-foreground">{v.location}</div>
                                            <h3 className="font-semibold mt-1">{v.name}</h3>
                                            <p className="text-xs text-muted-foreground mt-2">
                                                {items.length} {items.length === 1 ? t("mkt.services.itemOnMenu") : t("mkt.services.itemsOnMenu")}
                                            </p>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}
