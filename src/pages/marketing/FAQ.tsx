import PageHero from "@/components/marketing/PageHero";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CircleHelp, CreditCard, ShieldCheck, ShoppingBag } from "lucide-react";

const faqs =
[
    { category: "Ordering", icon: ShoppingBag, q: "What is Campus Eats?", a: "Campus Eats is a pickup-only ordering platform for campus food vendors. Order ahead, wait for the vendor to prepare your meal, then collect it at the stall." },
    { category: "Ordering", icon: ShoppingBag, q: "Is there a delivery fee?", a: "No. Campus Eats is pickup only, so there are no delivery fees or delivery riders." },
    { category: "Payments", icon: CreditCard, q: "How is my total calculated?", a: "We add 20% tax to your subtotal and round up to the next R5. Student accounts then receive a 2.5% discount. A valid coupon can add a further discount. All prices are in South African Rand (R)." },
    { category: "Accounts", icon: ShieldCheck, q: "What is a User ID?", a: "Registration gives you a 16-character User ID that acts as your recovery key. Sign in with your User ID, username, or email address and your password." },
    { category: "Ordering", icon: ShoppingBag, q: "How do I track my order?", a: "Orders move from Pending to Accepted, Preparing, Ready, and Completed. A vendor may also reject an order. Your dashboard shows the latest status." },
    { category: "Vendors", icon: CircleHelp, q: "How do I become a vendor?", a: "Choose Vendor when creating your account and provide your shop name. Vendors can manage their own menu, inventory, and incoming orders." },
    { category: "Access", icon: ShieldCheck, q: "Can I sign in with Google?", a: "Yes. Choose Continue with Google on the sign-in page to use Google single sign-on." },
    { category: "Support", icon: CircleHelp, q: "Where can I get more help?", a: "Visit the Help Center for searchable guidance, or contact support if you still need assistance." },
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

            <section className="container mx-auto max-w-4xl px-4 py-12 md:py-16">
                <div className="mb-8 grid gap-3 sm:grid-cols-3">
                    {[
                        [ShoppingBag, "Ordering", "Pickup and order tracking"],
                        [CreditCard, "Pricing", "Totals and discounts"],
                        [ShieldCheck, "Accounts", "Sign-in and recovery"],
                    ].map(([Icon, title, copy]) => {
                        const TopicIcon = Icon as typeof ShoppingBag;
                        return <div key={title as string} className="flex items-center gap-3 rounded-lg border bg-card p-4"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-primary/10 text-primary"><TopicIcon className="h-5 w-5" /></span><span><strong className="block text-sm">{title as string}</strong><span className="text-xs text-muted-foreground">{copy as string}</span></span></div>;
                    })}
                </div>
                <Accordion type="single" collapsible className="w-full rounded-lg border bg-card px-5 md:px-7">
                    {faqs.map((f, i) => (
                        <AccordionItem key={f.q} value={`item-${i}`}>
                            <AccordionTrigger className="gap-4 py-5 text-left text-base"><span><span className="mb-1 block text-xs font-semibold uppercase text-primary">{f.category}</span>{f.q}</span></AccordionTrigger>
                            <AccordionContent className="max-w-2xl pb-5 leading-7 text-muted-foreground">{f.a}</AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
                <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t pt-8 text-center sm:flex-row sm:text-left">
                    <div><h2 className="font-semibold">Still looking for an answer?</h2><p className="text-sm text-muted-foreground">Search detailed guides in the Help Center.</p></div>
                    <Button asChild><Link to="/help">Visit Help Center</Link></Button>
                </div>
            </section>
        </>
    );
}