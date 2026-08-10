import PageHero from "@/components/marketing/PageHero";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs =
[
    { q: "What is Campus Eats?", a: "Campus Eats is a pickup-only ordering platform for campus food vendors. You order ahead from your phone or the web, the vendor prepares your order, and you collect it at the stall." },
    { q: "Is there a delivery fee?", a: "No. Campus Eats is pickup only, so there are no delivery fees and no delivery riders." },
    { q: "How is my total calculated?", a: "Your subtotal has 20% tax added, is rounded up to the nearest R5, and students then receive a 2.5% discount. All prices are in South African Rand (R)." },
    { q: "What is a User ID?", a: "When you register, the platform issues a 16-character User ID that acts as your recovery key. You can sign in with either your User ID or your email address together with your password." },
    { q: "How do I track my order?", a: "Orders move through Pending, Accepted or Rejected, Preparing, Ready, and Completed. The status updates live on your dashboard as the vendor works through the queue." },
    { q: "How do I become a vendor?", a: "Create an account and contact us to have your shop onboarded. Vendors get a unique shop name, their own inventory, and full create, read, update, and delete control over their menu." },
    { q: "Is there a mobile application?", a: "Yes. The Kotlin mobile application and this website share the same design language and the same order workflow, so you can move between them freely." },
    { q: "How can I support the project?", a: "Campus Eats accepts Bitcoin and Ethereum donations, which fund continued development and production of the website and the mobile application." },
];

export default function FAQ()
{
    return (
        <>
            <PageHero
                eyebrow="FAQ"
                title="Frequently asked questions"
                description="Answers to the questions students and vendors ask most often."
            />

            <section className="container mx-auto px-4 py-16 max-w-3xl">
                <Accordion type="single" collapsible className="w-full">
                    {faqs.map((f, i) => (
                        <AccordionItem key={f.q} value={`item-${i}`}>
                            <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
                            <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </section>
        </>
    );
}