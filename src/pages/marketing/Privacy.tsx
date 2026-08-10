import PageHero from "@/components/marketing/PageHero";
import LegalSection from "@/components/marketing/LegalSection";

const LAST_UPDATED = "10 August 2026";

export default function Privacy()
{
    return (
        <>
            <PageHero
                eyebrow="Legal"
                title="Privacy Policy"
                description={`Last updated: ${LAST_UPDATED}`}
            />

            <div className="container mx-auto px-4 py-16 max-w-3xl space-y-8">
                <LegalSection title="1. Who we are">
                    <p>
                        Campus Eats operates a campus food pickup website and mobile application. This policy explains
                        what personal information we collect, why we collect it, and how it is stored and protected.
                    </p>
                </LegalSection>

                <LegalSection title="2. Information we collect">
                    <ul>
                        <li>Account information: your name, email address, password, role, and generated User ID.</li>
                        <li>Vendor information: shop name, campus location, and contact details.</li>
                        <li>Order information: items ordered, totals, order status, and order history.</li>
                        <li>Feedback you submit, such as compliments and complaints.</li>
                        <li>Security events, such as sign-in attempts and order actions, recorded in an internal log.</li>
                    </ul>
                </LegalSection>

                <LegalSection title="3. How we use your information">
                    <p>
                        We use your information to create and secure your account, process and track orders, display
                        order history, generate operational reports for vendors and administrators, respond to feedback,
                        and protect the platform against misuse.
                    </p>
                </LegalSection>

                <LegalSection title="4. Storage and security">
                    <p>
                        Account and order data is processed through our hosted backend services. Sensitive credentials
                        are not stored in your browser's local storage. Access to administrative data is restricted to
                        accounts with the Administrator role.
                    </p>
                </LegalSection>

                <LegalSection title="5. Sharing">
                    <p>
                        Order details are shared with the vendor fulfilling your order. We do not sell your personal
                        information. Information may be disclosed where required by applicable law.
                    </p>
                </LegalSection>

                <LegalSection title="6. Your rights">
                    <p>
                        You may request access to, correction of, or deletion of your personal information by contacting
                        us. Depending on where you live, additional rights may apply under laws such as the South
                        African Protection of Personal Information Act.
                    </p>
                </LegalSection>

                <LegalSection title="7. Donations">
                    <p>
                        Cryptocurrency donations are made directly to the published wallet addresses. We do not collect
                        or store payment card details, and blockchain transactions are public by design.
                    </p>
                </LegalSection>

                <LegalSection title="8. Changes and contact">
                    <p>
                        This policy may be updated as the platform develops and as legal requirements change. Questions
                        can be sent to <a className="text-primary hover:underline" href="mailto:support@campuseats.co.za">support@campuseats.co.za</a>.
                    </p>
                </LegalSection>
            </div>
        </>
    );
}