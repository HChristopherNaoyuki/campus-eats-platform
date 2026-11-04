import { Link, useLocation } from "react-router-dom";
import { CircleHelp, Home, LogIn, CircleHelp as FaqIcon } from "lucide-react";
import { useI18n } from "@/i18n";

/**
 * Fixed bottom navigation for phones on the public site. Hidden from the
 * medium breakpoint up, where the header navigation takes over again.
 */
export default function MobileBottomNav()
{
    const { t } = useI18n();
    const { pathname } = useLocation();

    const items = [
        { to: "/", label: t("mkt.nav.home"), icon: Home },
        { to: "/faq", label: "FAQ", icon: FaqIcon },
        { to: "/help", label: t("mkt.nav.help"), icon: CircleHelp },
        { to: "/login", label: t("mkt.header.signIn"), icon: LogIn },
    ];

    return (
        <nav className="ce-bottom-nav md:hidden" aria-label={t("mkt.polish.bottomNavAria")}>
            {items.map(({ to, label, icon: Icon }) =>
            {
                const active = pathname === to;
                return (
                    <Link
                        key={to}
                        to={to}
                        aria-current={active ? "page" : undefined}
                        className={`ce-bottom-nav-item ${active ? "active" : ""}`}
                    >
                        <Icon className="h-5 w-5" aria-hidden="true" />
                        <span>{label}</span>
                    </Link>
                );
            })}
        </nav>
    );
}
