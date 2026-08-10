import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Primary marketing navigation, mirrors the mobile app's top bar + tab structure. */
export const marketingNav =
[
    { to: "/", label: "Home", end: true },
    { to: "/about", label: "About" },
    { to: "/services", label: "Services" },
    { to: "/faq", label: "FAQ" },
    { to: "/blog", label: "Blog" },
    { to: "/contact", label: "Contact" },
    { to: "/donate", label: "Donate" },
];

export default function MarketingHeader()
{
    const [open, setOpen] = useState(false);

    return (
        <header className="sticky top-0 z-30 backdrop-blur bg-background/85 border-b">
            <div className="container mx-auto flex items-center justify-between h-16 px-4">
                <Link to="/" className="flex items-center gap-2" aria-label="Campus Eats home">
                    <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-primary to-primary-glow text-primary-foreground font-bold flex items-center justify-center">
                        CE
                    </div>
                    <span className="font-bold text-lg">Campus Eats</span>
                </Link>

                <nav className="hidden lg:flex items-center gap-6 text-sm" aria-label="Main">
                    {marketingNav.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.end}
                            className={({ isActive }) =>
                                cn(
                                    "transition-colors hover:text-foreground",
                                    isActive ? "text-primary font-semibold" : "text-muted-foreground",
                                )
                            }
                        >
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="flex items-center gap-2">
                    <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
                        <Link to="/login">Sign in</Link>
                    </Button>
                    <Button asChild size="sm">
                        <Link to="/signup">
                            Get started <ArrowRight className="h-4 w-4" />
                        </Link>
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="lg:hidden"
                        aria-label={open ? "Close menu" : "Open menu"}
                        aria-expanded={open}
                        onClick={() => setOpen((v) => !v)}
                    >
                        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </Button>
                </div>
            </div>

            {open && (
                <nav className="lg:hidden border-t bg-background px-4 py-3 grid gap-1" aria-label="Mobile">
                    {marketingNav.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.end}
                            onClick={() => setOpen(false)}
                            className={({ isActive }) =>
                                cn(
                                    "rounded-lg px-3 py-2 text-sm",
                                    isActive ? "bg-secondary text-primary font-semibold" : "text-muted-foreground",
                                )
                            }
                        >
                            {item.label}
                        </NavLink>
                    ))}
                </nav>
            )}
        </header>
    );
}