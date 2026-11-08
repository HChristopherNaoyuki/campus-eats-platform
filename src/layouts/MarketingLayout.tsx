import { Outlet, useLocation } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import MarketingHeader from "@/components/marketing/MarketingHeader";
import MarketingFooter from "@/components/marketing/MarketingFooter";
import BackToTop from "@/components/public/BackToTop";
import MobileBottomNav from "@/components/public/MobileBottomNav";
import CommandSearch from "@/components/public/CommandSearch";
import ShortcutsDialog from "@/components/public/ShortcutsDialog";
import DevtoolsGuard from "@/components/public/DevtoolsGuard";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useTheme } from "@/hooks/useTheme";

/**
 * Public-facing shell.
 *
 * The `php-site` class activates the ported reference stylesheet. The shell
 * also hosts the site-wide reader features: smart search, keyboard
 * shortcuts, back-to-top, mobile bottom navigation and the inspect deterrent.
 */
export default function MarketingLayout()
{
    const { pathname, hash } = useLocation();
    const { toggle } = useTheme();
    const [searchOpen, setSearchOpen] = useState(false);
    const [shortcutsOpen, setShortcutsOpen] = useState(false);

    const openSearch = useCallback(() => setSearchOpen(true), []);
    const openShortcuts = useCallback(() => setShortcutsOpen(true), []);
    useKeyboardShortcuts({ onSearch: openSearch, onShortcuts: openShortcuts, onToggleTheme: toggle });

    // Route changes start at the top unless the link targets an in-page anchor.
    useEffect(() =>
    {
        if (hash)
        {
            const target = document.querySelector(hash);

            if (target)
            {
                target.scrollIntoView({ behavior: "smooth" });
                return;
            }
        }

        window.scrollTo({ top: 0 });
    }, [pathname, hash]);

    return (
        <div className="php-site">
            <a className="skip-link" href="#main-content">Skip to main content</a>
            <MarketingHeader onSearch={openSearch} />
            <main id="main-content">
                <Outlet />
            </main>
            <MarketingFooter />
            <BackToTop />
            <MobileBottomNav />
            <CommandSearch open={searchOpen} onOpenChange={setSearchOpen} />
            <ShortcutsDialog open={shortcutsOpen} onOpenChange={setShortcutsOpen} />
            <DevtoolsGuard />
        </div>
    );
}
