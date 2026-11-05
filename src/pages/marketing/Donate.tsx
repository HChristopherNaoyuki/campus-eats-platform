import PageHero from "@/components/marketing/PageHero";
import CryptoDonations from "@/components/marketing/CryptoDonations";
import ReadingProgress from "@/components/public/ReadingProgress";
import YourLibrary from "@/components/public/YourLibrary";
import { PageToolbar, usePolishedPage } from "@/components/public/PageEnhancements";
import { useI18n } from "@/i18n";

export default function Donate()
{
    const { t } = useI18n();
    const title = t("mkt.donate.title");
    const library = usePolishedPage(title);

    return (
        <div className="polished-page">
            <ReadingProgress />
            <PageHero
                eyebrow={t("mkt.donate.eyebrow")}
                title={title}
                description={t("mkt.donate.description")}
            >
                <div className="flex flex-wrap items-center gap-3">
                    <PageToolbar title={title} library={library} />
                </div>
            </PageHero>
            <CryptoDonations withHeading={false} />
            <div className="mx-auto max-w-3xl px-4 pb-16">
                <YourLibrary saved={library.saved} recent={library.recent} />
            </div>
        </div>
    );
}
