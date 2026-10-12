import PageHero from "@/components/marketing/PageHero";
import CryptoDonations from "@/components/marketing/CryptoDonations";
import { useI18n } from "@/i18n";

export default function Donate()
{
    const { t } = useI18n();

    return (
        <>
            <PageHero
                eyebrow={t("mkt.donate.eyebrow")}
                title={t("mkt.donate.title")}
                description={t("mkt.donate.description")}
            />
            <CryptoDonations withHeading={false} />
        </>
    );
}
