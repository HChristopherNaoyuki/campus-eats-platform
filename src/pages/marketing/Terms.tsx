import PageHero from "@/components/marketing/PageHero";
import LegalSection from "@/components/marketing/LegalSection";

const LAST_UPDATED = "10 August 2026";

export default function Terms()
{
    return (
        <>
            <PageHero
                eyebrow="Legal"
                title="Terms and Conditions"
                description={`Last updated: ${LAST_UPDATED}`}
            />

            <div className="container mx-auto px-4 py-16 max-w-3xl space-y-8">
                <LegalSection title="1. Acceptance">
                    <p>
                        By using the Campus Eats website or mobile application you agree to these terms. If you do not
                        agree, please do not use the platform.
                    </p>
                </LegalSection>

                <LegalSection title="2. Accounts">
                    <ul>
                        <li>You must provide accurate registration details and keep your password confidential.</li>
                        <li>Your 16-character User ID is a recovery key; anyone holding it may attempt account recovery.</li>
                        <li>Roles (Student, Standard, Vendor, Administrator) determine what you can access.</li>
                        <li>We may suspend accounts used for fraud, abuse, or attempts to bypass access controls.</li>
                    </ul>
                </LegalSection>

                <LegalSection title="3. Orders and pickup">
                    <p>
                        Campus Eats is a pickup-only service. Orders move through Pending, Accepted or Rejected,
                        Preparing, Ready, and Completed. A vendor may reject an order, for example when an item is out
                        of stock. Uncollected orders may be discarded after the vendor's trading hours.
                    </p>
                </LegalSection>

                <LegalSection title="4. Pricing">
                    <p>
                        All prices are shown in South African Rand (R). Totals are calculated as the subtotal plus 20%
                        tax, rounded up to the next R5, with a 2.5% discount applied to verified Student accounts.
                        Prices and availability are set by each vendor and may change without notice.
                    </p>
                </LegalSection>

                <LegalSection title="5. Vendor obligations">
                    <p>
                        Vendors are responsible for the accuracy of their shop details, menu items, stock levels, food
                        safety, and compliance with campus and municipal regulations. Vendors retain full control of
                        their own inventory and may not list or sell items belonging to another vendor.
                    </p>
                </LegalSection>

                <LegalSection title="6. Donations">
                    <p>
                        Cryptocurrency donations are voluntary, non-refundable, and confer no goods, services,
                        membership, or ownership interest. Transactions sent to an incorrect address cannot be
                        recovered. Verify the published address before sending.
                    </p>
                </LegalSection>

                <LegalSection title="7. Acceptable use">
                    <p>
                        You may not interfere with the platform, attempt unauthorised access, scrape data at scale, or
                        use the service for unlawful purposes.
                    </p>
                </LegalSection>

                <LegalSection title="8. Liability and changes">
                    <p>
                        The platform is provided on an "as is" basis. To the extent permitted by law, Campus Eats is not
                        liable for indirect or consequential loss arising from use of the service. These terms may be
                        updated as the platform develops; continued use constitutes acceptance of the updated terms.
                    </p>
                </LegalSection>
            </div>
        </>
    );
}