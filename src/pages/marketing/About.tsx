import PageHero from "@/components/marketing/PageHero";
import { Card, CardContent } from "@/components/ui/card";
import { Github, Target, Users, Store } from "lucide-react";
import { useI18n } from "@/i18n";

const values =
[
    { icon: Target, titleKey: "mkt.about.value1Title", descKey: "mkt.about.value1Desc" },
    { icon: Users, titleKey: "mkt.about.value2Title", descKey: "mkt.about.value2Desc" },
    { icon: Store, titleKey: "mkt.about.value3Title", descKey: "mkt.about.value3Desc" },
];

export default function About()
{
    const { t } = useI18n();

    return (
        <div className="refined-page about-page">
            <PageHero
                eyebrow={t("mkt.about.eyebrow")}
                title={t("mkt.about.title")}
                description={t("mkt.about.description")}
            />

            <section className="container mx-auto px-4 py-16 grid gap-10 lg:grid-cols-2">
                <div className="space-y-4">
                    <h2 className="text-2xl md:text-3xl font-bold">{t("mkt.about.storyTitle")}</h2>
                    <p className="text-muted-foreground">{t("mkt.about.storyP1")}</p>
                    <p className="text-muted-foreground">{t("mkt.about.storyP2")}</p>
                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <a
                            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                            href="https://github.com/HChristopherNaoyuki/campus-eats-platform"
                            target="_blank"
                            rel="noreferrer noopener"
                        >
                            <Github className="h-4 w-4" /> {t("mkt.about.websiteRepo")}
                        </a>
                        <a
                            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                            href="https://github.com/HChristopherNaoyuki/campus-eats-app-kt"
                            target="_blank"
                            rel="noreferrer noopener"
                        >
                            <Github className="h-4 w-4" /> {t("mkt.about.mobileRepo")}
                        </a>
                    </div>
                </div>

                <div className="grid gap-5">
                    {values.map((v) => (
                        <Card key={v.titleKey} className="shadow-[var(--shadow-soft)]">
                            <CardContent className="p-6 flex gap-4">
                                <div className="h-10 w-10 shrink-0 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
                                    <v.icon className="h-5 w-5" aria-hidden="true" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">{t(v.titleKey)}</h3>
                                    <p className="text-sm text-muted-foreground mt-1">{t(v.descKey)}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>
        </div>
    );
}
