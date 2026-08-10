import { Link } from "react-router-dom";
import PageHero from "@/components/marketing/PageHero";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCampus } from "@/store/campusStore";
import { Users, Store, UtensilsCrossed, ClipboardList, BarChart3, MessageSquare } from "lucide-react";

const modules =
[
    { title: "User management", desc: "Register and sign in as Student, Standard user, Vendor, or Admin, each with their own dashboard.", icon: Users },
    { title: "Vendor management", desc: "Onboard campus vendors with a unique shop name, location, and contact details.", icon: Store },
    { title: "Menu management", desc: "Vendors create, read, update, and delete their own menu items and stock levels.", icon: UtensilsCrossed },
    { title: "Order management", desc: "Pending → Accepted → Preparing → Ready → Completed, tracked live for both sides.", icon: ClipboardList },
    { title: "Reporting", desc: "Sales, order summary, vendor performance, detailed order, and user activity reports.", icon: BarChart3 },
    { title: "Feedback", desc: "Students log compliments and complaints; admins review them alongside the security log.", icon: MessageSquare },
];

export default function Services()
{
    const { vendors, menu } = useCampus();
    const isLoading = vendors.length === 0;

    return (
        <>
            <PageHero
                eyebrow="Services"
                title="What Campus Eats does"
                description="One platform covering the full campus pickup workflow — for students, for vendors, and for the administrators who keep it running."
            />

            <section className="container mx-auto px-4 py-16">
                <h2 className="text-2xl md:text-3xl font-bold mb-8">Platform modules</h2>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {modules.map((m) => (
                        <Card key={m.title} className="h-full shadow-[var(--shadow-soft)]">
                            <CardContent className="p-6 space-y-3">
                                <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                                    <m.icon className="h-5 w-5" aria-hidden="true" />
                                </div>
                                <h3 className="font-semibold">{m.title}</h3>
                                <p className="text-sm text-muted-foreground">{m.desc}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            <section className="bg-secondary/40 border-y">
                <div className="container mx-auto px-4 py-16">
                    <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold">Campus vendors</h2>
                            <p className="text-muted-foreground mt-2">
                                Every vendor runs their own shop with their own inventory.
                            </p>
                        </div>
                        <Button asChild>
                            <Link to="/student">Browse and order</Link>
                        </Button>
                    </div>

                    {isLoading ? (
                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <Skeleton key={i} className="h-32 rounded-xl" />
                            ))}
                        </div>
                    ) : (
                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                            {vendors.map((v) =>
                            {
                                const items = menu.filter((m) => m.vendorId === v.id);
                                return (
                                    <Card key={v.id} className="h-full">
                                        <CardContent className="p-5">
                                            <div className="text-xs text-muted-foreground">{v.location}</div>
                                            <h3 className="font-semibold mt-1">{v.name}</h3>
                                            <p className="text-xs text-muted-foreground mt-2">
                                                {items.length} {items.length === 1 ? "item" : "items"} on the menu
                                            </p>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}