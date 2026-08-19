import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import MarketingHeader from "@/components/marketing/MarketingHeader";
import MarketingFooter from "@/components/marketing/MarketingFooter";

/**
 * Public-facing shell.
 *
 * The `php-site` class activates the ported reference stylesheet, which mirrors
 * the PHP application's `apple.css`, `style.css` and `public.css` exactly.
 */
export default function MarketingLayout()
{
    const { pathname, hash } = useLocation();

    // Route changes should always start the reader at the top of the new page,
    // unless the link targets an in-page anchor such as #vendors.
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
            <MarketingHeader />
            <main id="main-content">
                <Outlet />
            </main>
            <MarketingFooter />
        </div>
    );
}