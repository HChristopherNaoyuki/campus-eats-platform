import PageHero from "@/components/marketing/PageHero";
import CryptoDonations from "@/components/marketing/CryptoDonations";

export default function Donate()
{
    return (
        <>
            <PageHero
                eyebrow="Support us"
                title="Fund the next release"
                description="Campus Eats accepts cryptocurrency donations to help fund the continued development and production of the website and the mobile application."
            />
            <CryptoDonations withHeading={false} />
        </>
    );
}