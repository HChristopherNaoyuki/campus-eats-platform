import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PageHero from "@/components/marketing/PageHero";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, UserPlus, ShoppingBag, Store, ShieldCheck } from "lucide-react";

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
            <section className="mx-auto max-w-4xl px-4 py-12 space-y-8">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        value={query}
                        onChange={(e) => setQuery(e.target.value.slice(0, 100))}
                        placeholder="Search help articles"
                        className="pl-9 h-11"
                        aria-label="Search help articles"
                    />
                </div>

                {filtered.length === 0 && (
                    <p className="text-center text-muted-foreground">No articles match "{query}".</p>
                )}

                <div className="grid gap-6">
                    {filtered.map((t) => (
                        <div key={t.title} className="rounded-xl border bg-card p-6 shadow-sm">
                            <div className="mb-2 flex items-center gap-2">
                                <t.icon className="h-5 w-5 text-primary" />
                                <h2 className="text-lg font-semibold">{t.title}</h2>
                            </div>
                            <Accordion type="single" collapsible>
                                {t.items.map((i) => (
                                    <AccordionItem key={i.q} value={i.q}>
                                        <AccordionTrigger className="text-left">{i.q}</AccordionTrigger>
                                        <AccordionContent className="text-muted-foreground">{i.a}</AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </div>
                    ))}
                </div>

                <div className="rounded-xl border bg-secondary/40 p-6 text-center space-y-3">
                    <p className="font-medium">Still need help?</p>
                    <Button asChild><Link to="/contact">Contact support</Link></Button>
                </div>
            </section>
        </>
    );
}
