import { useNavigate } from "react-router-dom";
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command";
import { useI18n } from "@/i18n";

interface SearchEntry
{
    label: string;
    path: string;
    group: string;
}

/**
 * Smart search bar (command palette). Searches the public pages and the
 * frequently asked questions, then jumps straight to the match.
 *
 * Opened with Ctrl/⌘ + K, the `/` key, or the header search button.
 */
export default function CommandSearch({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void })
{
    const { t } = useI18n();
    const navigate = useNavigate();

    const pages: SearchEntry[] = [
        { label: t("mkt.nav.home"), path: "/", group: t("mkt.polish.searchPages") },
        { label: t("mkt.nav.about"), path: "/about", group: t("mkt.polish.searchPages") },
        { label: t("mkt.nav.services"), path: "/services", group: t("mkt.polish.searchPages") },
        { label: t("mkt.footer.cryptoDonations"), path: "/donate", group: t("mkt.polish.searchPages") },
        { label: t("mkt.footer.privacyPolicy"), path: "/privacy", group: t("mkt.polish.searchPages") },
        { label: t("mkt.footer.termsConditions"), path: "/terms", group: t("mkt.polish.searchPages") },
        { label: t("mkt.nav.help"), path: "/help", group: t("mkt.polish.searchPages") },
        { label: t("mkt.nav.faq"), path: "/faq", group: t("mkt.polish.searchPages") },
        { label: t("mkt.header.signIn"), path: "/login", group: t("mkt.polish.searchPages") },
        { label: t("mkt.header.createAccount"), path: "/signup", group: t("mkt.polish.searchPages") },
    ];

    const faqs: SearchEntry[] = [1, 2, 3, 4, 5, 6, 7, 8].map((n) => ({
        label: t(`mkt.faq.q${n}`),
        path: "/faq",
        group: t("mkt.polish.searchFaqs"),
    }));

    const run = (entry: SearchEntry) =>
    {
        onOpenChange(false);
        navigate(entry.path);
    };

    const renderGroup = (title: string, entries: SearchEntry[]) =>
    {
        if (entries.length === 0) return null;
        return (
            <CommandGroup heading={title}>
                {entries.map((entry) => (
                    <CommandItem key={`${entry.path}-${entry.label}`} onSelect={() => run(entry)}>
                        {entry.label}
                    </CommandItem>
                ))}
            </CommandGroup>
        );
    };

    return (
        <CommandDialog open={open} onOpenChange={onOpenChange}>
            <CommandInput placeholder={t("mkt.polish.searchPlaceholder")} />
            <CommandList>
                <CommandEmpty>{t("mkt.polish.searchNoResults")}</CommandEmpty>
                {renderGroup(t("mkt.polish.searchPages"), pages)}
                <CommandSeparator />
                {renderGroup(t("mkt.polish.searchFaqs"), faqs)}
            </CommandList>
        </CommandDialog>
    );
}
