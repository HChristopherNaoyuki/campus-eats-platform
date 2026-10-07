import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PageHero from "@/components/marketing/PageHero";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, UserPlus, ShoppingBag, Store, ShieldCheck, ArrowRight, CircleHelp } from "lucide-react";

const topics =
[
    { icon: UserPlus, title: "Accounts", items:
    [
        { q: "How do I create an account?", a: "Choose Sign up, pick your account type, then enter your full name, username, email and a password (entered twice). Vendors also enter their shop name." },
        { q: "How do I sign in?", a: "Use your email, username or 16-character User ID with your password, or sign in with Google." },
        { q: "I forgot my password", a: "Use Forgot password on the sign-in page. Keep your User ID safe, it is your recovery key." },
    ]},
    { icon: ShoppingBag, title: "Ordering", items:
    [
        { q: "How do I place an order?", a: "Browse shops on your dashboard, add items to your cart and check out. Collect your food at the stall when it shows Ready." },
        { q: "How is my total calculated?", a: "Subtotal plus 20% tax, rounded up to the next R5. Students receive a further 2.5% discount." },
        { q: "How do I apply a coupon?", a: "Enter your coupon code in the cart and choose Apply before confirming your order. The updated discount and total appear immediately." },
        { q: "What do order statuses mean?", a: "Pending, then Accepted or Rejected, then Preparing, Ready and Completed." },
    ]},
    { icon: Store, title: "Vendors", items:
    [
        { q: "How do I manage my menu?", a: "On the vendor dashboard you can add, edit and remove items and update stock." },
        { q: "How do I handle incoming orders?", a: "Accept or reject new orders, then move them through Preparing and Ready." },
    ]},
    { icon: ShieldCheck, title: "Privacy and security", items:
    [
        { q: "Are my passwords safe?", a: "Passwords are handled by a secure sign-in service and are never stored in plain text." },
        { q: "Can I change my language?", a: "Yes. Open Settings and choose English or Afrikaans." },
    ]},
];

export default function Help()
{
    const [query, setQuery] = useState("");
    const filtered = useMemo(() =>
    {
        const q = query.trim().toLowerCase();
        if (!q) return topics;
        return topics
            .map((t) => ({ ...t, items: t.items.filter((i) => (i.q + " " + i.a).toLowerCase().includes(q)) }))
            .filter((t) => t.items.length > 0);
    }, [query]);

    return (
        <>
            <PageHero eyebrow="Support" title="Help Center" description="Answers to common questions about Campus Eats" />
            <section className="mx-auto max-w-5xl px-4 py-12 md:py-16 space-y-10">
                <div className="mx-auto max-w-2xl">
                    <label htmlFor="help-search" className="mb-2 block text-sm font-medium">What can we help with?</label>
                    <div className="relative">
                    <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        id="help-search"
                        value={query}
                        onChange={(e) => setQuery(e.target.value.slice(0, 100))}
                        placeholder="Search help articles"
                        className="h-12 pl-12 text-base shadow-sm"
                        aria-label="Search help articles"
                    />
                    </div>
                </div>

                {filtered.length === 0 && (
                    <p className="text-center text-muted-foreground">No articles match "{query}".</p>
                )}

                <div className="grid items-start gap-5 md:grid-cols-2">
                    {filtered.map((t) => (
                        <div key={t.title} className="rounded-lg border bg-card p-5 shadow-sm">
                            <div className="mb-3 flex items-center gap-3 border-b pb-4">
                                <span className="grid h-10 w-10 place-items-center rounded-md bg-primary/10 text-primary"><t.icon className="h-5 w-5" /></span>
                                <div><h2 className="font-semibold">{t.title}</h2><p className="text-xs text-muted-foreground">{t.items.length} {t.items.length === 1 ? "answer" : "answers"}</p></div>
                            </div>
                            <Accordion type="single" collapsible>
                                {t.items.map((i) => (
                                    <AccordionItem key={i.q} value={i.q}>
                                        <AccordionTrigger className="text-left leading-6">{i.q}</AccordionTrigger>
                                        <AccordionContent className="leading-7 text-muted-foreground">{i.a}</AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col items-center justify-between gap-5 border-t pt-8 text-center sm:flex-row sm:text-left">
                    <div className="flex items-center gap-3"><CircleHelp className="h-6 w-6 text-primary" /><div><p className="font-semibold">Still need help?</p><p className="text-sm text-muted-foreground">Send our support team a message.</p></div></div>
                    <Button asChild><Link to="/contact">Contact support <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
                </div>
            </section>
        </>
    );
}
