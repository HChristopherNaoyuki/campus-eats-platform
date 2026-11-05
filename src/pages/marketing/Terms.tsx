import PageHero from "@/components/marketing/PageHero";
import LegalSection from "@/components/marketing/LegalSection";
import ReadingProgress from "@/components/public/ReadingProgress";
import TableOfContents from "@/components/public/TableOfContents";
import YourLibrary from "@/components/public/YourLibrary";
import { PageToolbar, ReadingTime, usePolishedPage } from "@/components/public/PageEnhancements";
import { useI18n } from "@/i18n";

const LAST_UPDATED = "10 August 2026";

const SECTION_KEYS = [
    { id: "terms-s1", titleKey: "mkt.terms.s1Title", bodyKeys: ["mkt.terms.s1P1"] },
    {
        id: "terms-s2",
        titleKey: "mkt.terms.s2Title",
        bodyKeys: ["mkt.terms.s2Item1", "mkt.terms.s2Item2", "mkt.terms.s2Item3", "mkt.terms.s2Item4"],
    },
    { id: "terms-s3", titleKey: "mkt.terms.s3Title", bodyKeys: ["mkt.terms.s3P1"] },
    { id: "terms-s4", titleKey: "mkt.terms.s4Title", bodyKeys: ["mkt.terms.s4P1"] },
    { id: "terms-s5", titleKey: "mkt.terms.s5Title", bodyKeys: ["mkt.terms.s5P1"] },
    { id: "terms-s6", titleKey: "mkt.terms.s6Title", bodyKeys: ["mkt.terms.s6P1"] },
    { id: "terms-s7", titleKey: "mkt.terms.s7Title", bodyKeys: ["mkt.terms.s7P1"] },
    { id: "terms-s8", titleKey: "mkt.terms.s8Title", bodyKeys: ["mkt.terms.s8P1"] },
];

export default function Terms()
{
    const { t } = useI18n();
    const title = t("mkt.terms.title");
    const library = usePolishedPage(title);

    const sections = SECTION_KEYS.map((section) => ({ id: section.id, label: t(section.titleKey) }));
    const fragments = SECTION_KEYS.flatMap((section) => [section.titleKey, ...section.bodyKeys]).map((key) => t(key));

    return (
        <div className="polished-page">
            <ReadingProgress />
            <PageHero
                eyebrow={t("mkt.terms.eyebrow")}
                title={title}
                description={t("mkt.terms.lastUpdated").replace("{date}", LAST_UPDATED)}
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
                            {section.id === "terms-s2" ? (
                                <ul>
                                    {section.bodyKeys.map((key) => (
                                        <li key={key}>{t(key)}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p>{t(section.bodyKeys[0])}</p>
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
