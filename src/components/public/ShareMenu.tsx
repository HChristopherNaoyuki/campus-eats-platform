import { useState } from "react";
import { Share2, Link2, Mail, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useI18n } from "@/i18n";

/** Share buttons for the current page: copy link, WhatsApp, X and e-mail. */
export default function ShareMenu({ title }: { title: string })
{
    const { t } = useI18n();
    const [copied, setCopied] = useState(false);

    const pageUrl = typeof window !== "undefined" ? window.location.href : "";
    const shareText = `${title} — Campus Eats`;

    const copyLink = async () =>
    {
        try
        {
            await navigator.clipboard.writeText(pageUrl);
            setCopied(true);
            toast.success(t("mkt.polish.linkCopied"));
            window.setTimeout(() => setCopied(false), 2000);
        }
        catch
        {
            toast.error(t("mkt.polish.copyFailed"));
        }
    };

    const nativeShare = async () =>
    {
        if (typeof navigator.share !== "function") return;
        try
        {
            await navigator.share({ title: shareText, url: pageUrl });
        }
        catch
        {
            // The reader dismissed the share sheet — nothing to recover.
        }
    };

    const isNativeAvailable = typeof navigator !== "undefined" && typeof navigator.share === "function";

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button type="button" variant="outline" size="sm" className="gap-2">
                    <Share2 className="h-4 w-4" />
                    <span className="hidden sm:inline">{t("mkt.polish.share")}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
                {isNativeAvailable && (
                    <DropdownMenuItem onSelect={() => void nativeShare()}>
                        <Share2 className="h-4 w-4" /> {t("mkt.polish.shareDevice")}
                    </DropdownMenuItem>
                )}
                <DropdownMenuItem onSelect={() => void copyLink()}>
                    <Link2 className="h-4 w-4" /> {copied ? t("mkt.polish.copied") : t("mkt.polish.copyLink")}
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <a href={`https://wa.me/?text=${encodeURIComponent(`${shareText} ${pageUrl}`)}`} target="_blank" rel="noreferrer">
                        <MessageCircle className="h-4 w-4" /> WhatsApp
                    </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(pageUrl)}`} target="_blank" rel="noreferrer">
                        <Share2 className="h-4 w-4" /> X
                    </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <a href={`mailto:?subject=${encodeURIComponent(shareText)}&body=${encodeURIComponent(pageUrl)}`}>
                        <Mail className="h-4 w-4" /> {t("mkt.polish.shareEmail")}
                    </a>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
