import PageHero from "@/components/marketing/PageHero";
import LegalSection from "@/components/marketing/LegalSection";
import { useI18n } from "@/i18n";

const LAST_UPDATED = "10 August 2026";

export default function Terms()
{
    const { t } = useI18n();

    return (
        <>
            <PageHero
                eyebrow={t("mkt.terms.eyebrow")}
                title={t("mkt.terms.title")}
                description={t("mkt.terms.lastUpdated").replace("{date}", LAST_UPDATED)}
            />

            <div className="container mx-auto px-4 py-16 max-w-3xl space-y-8">
                <LegalSection title={t("mkt.terms.s1Title")}>
                    <p>{t("mkt.terms.s1P1")}</p>
                </LegalSection>

                <LegalSection title={t("mkt.terms.s2Title")}>
                    <ul>
                        <li>{t("mkt.terms.s2Item1")}</li>
                        <li>{t("mkt.terms.s2Item2")}</li>
                        <li>{t("mkt.terms.s2Item3")}</li>
                        <li>{t("mkt.terms.s2Item4")}</li>
                    </ul>
                </LegalSection>

                <LegalSection title={t("mkt.terms.s3Title")}>
                    <p>{t("mkt.terms.s3P1")}</p>
                </LegalSection>

                <LegalSection title={t("mkt.terms.s4Title")}>
                    <p>{t("mkt.terms.s4P1")}</p>
                </LegalSection>

                <LegalSection title={t("mkt.terms.s5Title")}>
                    <p>{t("mkt.terms.s5P1")}</p>
                </LegalSection>

                <LegalSection title={t("mkt.terms.s6Title")}>
                    <p>{t("mkt.terms.s6P1")}</p>
                </LegalSection>

                <LegalSection title={t("mkt.terms.s7Title")}>
                    <p>{t("mkt.terms.s7P1")}</p>
                </LegalSection>

                <LegalSection title={t("mkt.terms.s8Title")}>
                    <p>{t("mkt.terms.s8P1")}</p>
                </LegalSection>
            </div>
        </>
    );
}
