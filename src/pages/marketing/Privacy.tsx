import PageHero from "@/components/marketing/PageHero";
import LegalSection from "@/components/marketing/LegalSection";
import { useI18n } from "@/i18n";

const LAST_UPDATED = "10 August 2026";

export default function Privacy()
{
    const { t } = useI18n();

    return (
        <>
            <PageHero
                eyebrow={t("mkt.privacy.eyebrow")}
                title={t("mkt.privacy.title")}
                description={t("mkt.privacy.lastUpdated").replace("{date}", LAST_UPDATED)}
            />

            <div className="container mx-auto px-4 py-16 max-w-3xl space-y-8">
                <LegalSection title={t("mkt.privacy.s1Title")}>
                    <p>{t("mkt.privacy.s1P1")}</p>
                </LegalSection>

                <LegalSection title={t("mkt.privacy.s2Title")}>
                    <ul>
                        <li>{t("mkt.privacy.s2Item1")}</li>
                        <li>{t("mkt.privacy.s2Item2")}</li>
                        <li>{t("mkt.privacy.s2Item3")}</li>
                        <li>{t("mkt.privacy.s2Item4")}</li>
                        <li>{t("mkt.privacy.s2Item5")}</li>
                    </ul>
                </LegalSection>

                <LegalSection title={t("mkt.privacy.s3Title")}>
                    <p>{t("mkt.privacy.s3P1")}</p>
                </LegalSection>

                <LegalSection title={t("mkt.privacy.s4Title")}>
                    <p>{t("mkt.privacy.s4P1")}</p>
                </LegalSection>

                <LegalSection title={t("mkt.privacy.s5Title")}>
                    <p>{t("mkt.privacy.s5P1")}</p>
                </LegalSection>

                <LegalSection title={t("mkt.privacy.s6Title")}>
                    <p>{t("mkt.privacy.s6P1")}</p>
                </LegalSection>

                <LegalSection title={t("mkt.privacy.s7Title")}>
                    <p>{t("mkt.privacy.s7P1")}</p>
                </LegalSection>

                <LegalSection title={t("mkt.privacy.s8Title")}>
                    <p>
                        {t("mkt.privacy.s8P1Pre")} <a className="text-primary hover:underline" href="mailto:support@campuseats.co.za">support@campuseats.co.za</a>.
                    </p>
                </LegalSection>
            </div>
        </>
    );
}
