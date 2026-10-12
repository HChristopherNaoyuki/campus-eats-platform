import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useI18n } from "@/i18n";
import LanguageSwitcher from "@/components/LanguageSwitcher";

/**
 * Public header, a direct port of `solution/includes/public_header.php`.
 *
 * Navigation order, labels, icons and active-state behaviour match the
 * reference PHP site exactly.
 */
export const marketingNav =
[
    { to: "/", label: "mkt.nav.home", match: "/" },
    { to: "/about", label: "mkt.nav.about", match: "/about" },
    { to: "/#vendors", label: "mkt.nav.services", match: "/services" },
    { to: "/faq", label: "mkt.nav.faq", match: "/faq" },
    { to: "/help", label: "mkt.nav.help", match: "/help" },
];

export default function MarketingHeader()
{
    const { t } = useI18n();
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
                        <Link to="/" aria-label={t("mkt.header.logoAria")}>
                            <i className="fas fa-utensils" aria-hidden="true" />
                            <span>Campus Eats</span>
                        </Link>
                    </div>

                    <nav className="public-nav" aria-label="Main navigation">
                        <ul>
                            {marketingNav.map((item) => (
                                <li key={item.label}>
                                    <Link to={item.to} className={isActive(item.match)}>
                                        {t(item.label)}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <div className="auth-buttons">
                        <LanguageSwitcher />
                        <Link to="/login" className="btn btn-outline">
                            <i className="fas fa-sign-in-alt" aria-hidden="true" /> {t("mkt.header.signIn")}
                        </Link>
                        <Link to="/signup" className="btn btn-ce-primary btn-primary">
                            <i className="fas fa-user-plus" aria-hidden="true" /> {t("mkt.header.createAccount")}
                        </Link>
                    </div>

                    <button
                        type="button"
                        className="mobile-menu-toggle"
                        aria-label={t("mkt.header.menuAria")}
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
                                <Link to={item.to} onClick={() => setOpen(false)}>{t(item.label)}</Link>
                            </li>
                        ))}
                        <li><Link to="/login" onClick={() => setOpen(false)}>{t("mkt.header.signIn")}</Link></li>
                        <li><Link to="/signup" onClick={() => setOpen(false)}>{t("mkt.header.createAccount")}</Link></li>
                        <li><LanguageSwitcher /></li>
                    </ul>
                </nav>
            </div>
        </>
    );
}