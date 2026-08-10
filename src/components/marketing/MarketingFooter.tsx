import { Link } from "react-router-dom";
import { marketingNav } from "./MarketingHeader";

/** Site-wide footer with legal + navigation links. */
export default function MarketingFooter()
{
    return (
        <footer className="border-t bg-secondary/30">
            <div className="container mx-auto px-4 py-12 grid gap-8 md:grid-cols-4">
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary-glow text-primary-foreground text-sm font-bold flex items-center justify-center">
                            CE
                        </div>
                        <span className="font-bold">Campus Eats</span>
                    </div>
                    <p className="text-sm text-muted-foreground max-w-xs">
                        The student pickup network — order ahead from campus vendors and skip the queue.
                    </p>
                </div>

                <nav aria-label="Footer navigation" className="text-sm space-y-2">
                    <h2 className="font-semibold text-foreground">Explore</h2>
                    {marketingNav.map((item) => (
                        <Link key={item.to} to={item.to} className="block text-muted-foreground hover:text-foreground">
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <nav aria-label="Application links" className="text-sm space-y-2">
                    <h2 className="font-semibold text-foreground">Application</h2>
                    <Link to="/login" className="block text-muted-foreground hover:text-foreground">Sign in</Link>
                    <Link to="/signup" className="block text-muted-foreground hover:text-foreground">Create account</Link>
                    <Link to="/student" className="block text-muted-foreground hover:text-foreground">Student dashboard</Link>
                    <Link to="/vendor" className="block text-muted-foreground hover:text-foreground">Vendor dashboard</Link>
                    <Link to="/dashboard" className="block text-muted-foreground hover:text-foreground">Admin dashboard</Link>
                </nav>

                <nav aria-label="Legal" className="text-sm space-y-2">
                    <h2 className="font-semibold text-foreground">Legal</h2>
                    <Link to="/privacy" className="block text-muted-foreground hover:text-foreground">Privacy Policy</Link>
                    <Link to="/terms" className="block text-muted-foreground hover:text-foreground">Terms &amp; Conditions</Link>
                    <a
                        href="https://github.com/HChristopherNaoyuki/campus-eats-platform"
                        target="_blank"
                        rel="noreferrer noopener"
                        className="block text-muted-foreground hover:text-foreground"
                    >
                        Website repository
                    </a>
                    <a
                        href="https://github.com/HChristopherNaoyuki/campus-eats-app-kt"
                        target="_blank"
                        rel="noreferrer noopener"
                        className="block text-muted-foreground hover:text-foreground"
                    >
                        Mobile app repository
                    </a>
                </nav>
            </div>

            <div className="border-t">
                <div className="container mx-auto px-4 py-5 text-xs text-muted-foreground text-center">
                    © {new Date().getFullYear()} Campus Eats — student pickup network. All prices in South African Rand (R).
                </div>
            </div>
        </footer>
    );
}