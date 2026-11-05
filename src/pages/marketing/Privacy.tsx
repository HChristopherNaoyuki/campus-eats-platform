import PageHero from "@/components/marketing/PageHero";
import LegalSection from "@/components/marketing/LegalSection";
import ReadingProgress from "@/components/public/ReadingProgress";
import TableOfContents from "@/components/public/TableOfContents";
import YourLibrary from "@/components/public/YourLibrary";
import { PageToolbar, ReadingTime, usePolishedPage } from "@/components/public/PageEnhancements";
import { useI18n } from "@/i18n";

const LAST_UPDATED = "10 August 2026";

const SECTION_KEYS = [
    { id: "privacy-s1", titleKey: "mkt.privacy.s1Title", bodyKeys: ["mkt.privacy.s1P1"] },
    {
        id: "privacy-s2",
        titleKey: "mkt.privacy.s2Title",
        bodyKeys: [
            "mkt.privacy.s2Item1",
            "mkt.privacy.s2Item2",
            "mkt.privacy.s2Item3",
            "mkt.privacy.s2Item4",
            "mkt.privacy.s2Item5",
        ],
    },
    { id: "privacy-s3", titleKey: "mkt.privacy.s3Title", bodyKeys: ["mkt.privacy.s3P1"] },
    { id: "privacy-s4", titleKey: "mkt.privacy.s4Title", bodyKeys: ["mkt.privacy.s4P1"] },
    { id: "privacy-s5", titleKey: "mkt.privacy.s5Title", bodyKeys: ["mkt.privacy.s5P1"] },
    { id: "privacy-s6", titleKey: "mkt.privacy.s6Title", bodyKeys: ["mkt.privacy.s6P1"] },
    { id: "privacy-s7", titleKey: "mkt.privacy.s7Title", bodyKeys: ["mkt.privacy.s7P1"] },
    { id: "privacy-s8", titleKey: "mkt.privacy.s8Title", bodyKeys: ["mkt.privacy.s8P1Pre"] },
];

export default function Privacy()
{
    const { t } = useI18n();
    const title = t("mkt.privacy.title");
    const library = usePolishedPage(title);

    const sections = SECTION_KEYS.map((section) => ({ id: section.id, label: t(section.titleKey) }));
    const fragments = SECTION_KEYS.flatMap((section) => [section.titleKey, ...section.bodyKeys]).map((key) => t(key));

    return (
        <div className="polished-page">
            <ReadingProgress />
            <PageHero
                eyebrow={t("mkt.privacy.eyebrow")}
                title={title}
                description={t("mkt.privacy.lastUpdated").replace("{date}", LAST_UPDATED)}
            >
                <div className="flex flex-wrap items-center gap-3">
                    <ReadingTime fragments={fragments} />
                    <PageToolbar title={title} library={library} />
                </div>
            </PageHero>

            <div className="legal-grid">
                <TableOfContents sections={sections} />

                <div className="space-y-8">
                    {SECTION_KEYS.map((section) => (
                        <LegalSection key={section.id} id={section.id} title={t(section.titleKey)}>
                            {section.id === "privacy-s2" ? (
                                <ul>
                                    {section.bodyKeys.map((key) => (
                                        <li key={key}>{t(key)}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p>
                                    {t(section.bodyKeys[0])}
                                    {section.id === "privacy-s8" && (
                                        <>
                                            {" "}
                                            <a className="text-primary hover:underline" href="mailto:support@campuseats.co.za">
                                                support@campuseats.co.za
                                            </a>
                                            .
                                        </>
                                    )}
                                </p>
                            )}
                        </LegalSection>
                    ))}
                </div>
            </div>

            <div className="mx-auto max-w-3xl px-4 pb-16">
                <YourLibrary saved={library.saved} recent={library.recent} />
            </div>
        </div>
    );
}
