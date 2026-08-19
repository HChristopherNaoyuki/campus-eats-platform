import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

/**
 * Public header, a direct port of `solution/includes/public_header.php`.
 *
 * Navigation order, labels, icons and active-state behaviour match the
 * reference PHP site exactly.
 */
export const marketingNav =
[
    { to: "/", label: "Home", match: "/" },
    { to: "/about", label: "About", match: "/about" },
    { to: "/#vendors", label: "Services", match: "/services" },
    { to: "/faq", label: "FAQ", match: "/faq" },
    { to: "/help", label: "Help Center", match: "/help" },
];

export default function MarketingHeader()
{
    const [open, setOpen] = useState(false);
    const { pathname } = useLocation();

    // The mobile drawer must never survive a route change.
    useEffect(() =>
    {
        setOpen(false);
    }, [pathname]);

    function isActive(match: string)
    {
        return pathname === match ? "active" : "";
    }

    return (
        <>
            <header className="public-header" role="banner">
                <div className="container">
                    <div className="logo">
                        <Link to="/" aria-label="Campus Eats Home">
                            <i className="fas fa-utensils" aria-hidden="true" />
                            <span>Campus Eats</span>
                        </Link>
                    </div>

                    <nav className="public-nav" aria-label="Main navigation">
                        <ul>
                            {marketingNav.map((item) => (
                                <li key={item.label}>
                                    <Link to={item.to} className={isActive(item.match)}>
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <div className="auth-buttons">
                        <Link to="/login" className="btn btn-outline">
                            <i className="fas fa-sign-in-alt" aria-hidden="true" /> Sign In
                        </Link>
                        <Link to="/signup" className="btn btn-ce-primary btn-primary">
                            <i className="fas fa-user-plus" aria-hidden="true" /> Create account
                        </Link>
                    </div>

                    <button
                        type="button"
                        className="mobile-menu-toggle"
                        aria-label="Menu"
                        aria-expanded={open}
                        onClick={() => setOpen((value) => !value)}
                    >
                        <i className="fas fa-bars" aria-hidden="true" />
                    </button>
                </div>
            </header>

            <div className="mobile-menu" aria-hidden={!open}>
                <nav aria-label="Mobile navigation">
                    <ul>
                        {marketingNav.map((item) => (
                            <li key={item.label}>
                                <Link to={item.to} onClick={() => setOpen(false)}>{item.label}</Link>
                            </li>
                        ))}
                        <li><Link to="/login" onClick={() => setOpen(false)}>Sign In</Link></li>
                        <li><Link to="/signup" onClick={() => setOpen(false)}>Create account</Link></li>
                    </ul>
                </nav>
            </div>
        </>
    );
}