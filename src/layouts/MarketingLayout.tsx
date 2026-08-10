import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import MarketingHeader from "@/components/marketing/MarketingHeader";
import MarketingFooter from "@/components/marketing/MarketingFooter";

/** Public-facing shell: header + routed content + footer. */
export default function MarketingLayout()
{
    const { pathname } = useLocation();

    // Route changes should always start the reader at the top of the new page.
    useEffect(() =>
    {
        window.scrollTo({ top: 0 });
    }, [pathname]);

    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground">
            <MarketingHeader />
            <main className="flex-1">
                <Outlet />
            </main>
            <MarketingFooter />
        </div>
    );
}