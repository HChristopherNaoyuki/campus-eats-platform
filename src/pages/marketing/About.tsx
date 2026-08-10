import PageHero from "@/components/marketing/PageHero";
import { Card, CardContent } from "@/components/ui/card";
import { Github, Target, Users, Store } from "lucide-react";

const values =
[
    { icon: Target, title: "Built around the campus rhythm", desc: "Order between lectures, collect on the way past the stall — no delivery fleet, no delivery fees." },
    { icon: Users, title: "Made with students", desc: "Every screen started as a mobile mockup tested against real campus ordering behaviour." },
    { icon: Store, title: "Fair to vendors", desc: "Vendors keep their own shop, their own inventory, and full control over their menu and order queue." },
];

export default function About()
{
    return (
        <>
            <PageHero
                eyebrow="About"
                title="The team behind Campus Eats"
                description="Campus Eats is a student pickup platform: a Kotlin mobile application and a matching responsive web application, sharing one product language and one order workflow."
            />

            <section className="container mx-auto px-4 py-16 grid gap-10 lg:grid-cols-2">
                <div className="space-y-4">
                    <h2 className="text-2xl md:text-3xl font-bold">Our story</h2>
                    <p className="text-muted-foreground">
                        Campus Eats started as a process-modelling project: map how a campus food order actually moves
                        from a hungry student to a vendor stall and back again. That model became four core modules —
                        user management, vendor management, menu management, and order management — and those modules
                        became the product you are looking at.
                    </p>
                    <p className="text-muted-foreground">
                        The platform is developed in the open. The web application and the Kotlin mobile application are
                        maintained side by side so that a change in one is reflected in the other.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <a
                            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                            href="https://github.com/HChristopherNaoyuki/campus-eats-platform"
                            target="_blank"
                            rel="noreferrer noopener"
                        >
                            <Github className="h-4 w-4" /> Website repository
                        </a>
                        <a
                            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                            href="https://github.com/HChristopherNaoyuki/campus-eats-app-kt"
                            target="_blank"
                            rel="noreferrer noopener"
                        >
                            <Github className="h-4 w-4" /> Mobile application repository
                        </a>
                    </div>
                </div>

                <div className="grid gap-5">
                    {values.map((v) => (
                        <Card key={v.title} className="shadow-[var(--shadow-soft)]">
                            <CardContent className="p-6 flex gap-4">
                                <div className="h-10 w-10 shrink-0 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
                                    <v.icon className="h-5 w-5" aria-hidden="true" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">{v.title}</h3>
                                    <p className="text-sm text-muted-foreground mt-1">{v.desc}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>
        </>
    );
}