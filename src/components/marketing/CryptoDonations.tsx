import { useState } from "react";
import { Bitcoin, Copy, Check, HeartHandshake } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { useI18n } from "@/i18n";

/** Supported donation wallets. Addresses are public and safe to ship in the client. */
export const cryptoWallets =
[
    {
        symbol: "BTC",
        name: "Bitcoin",
        address: "bc1p38w07j80mpugyytgh08k9cn4jmmz96q3v6968elj2s8lnvvleq3qf2dljd",
    },
    {
        symbol: "ETH",
        name: "Ethereum",
        address: "0x604FBA84292d963c6108ed8c2c3249d349800E50",
    },
];

interface CryptoDonationsProps
{
    /** Renders the section heading; disable when the page already provides one. */
    withHeading?: boolean;
}

export default function CryptoDonations({ withHeading = true }: CryptoDonationsProps)
{
    const [copied, setCopied] = useState<string | null>(null);
    const { t } = useI18n();

    /**
     * Copies an address to the clipboard. The async Clipboard API is unavailable in some
     * non-secure contexts, so failures fall back to an explanatory toast.
     */
    const handleCopy = async (symbol: string, address: string) =>
    {
        try
        {
            await navigator.clipboard.writeText(address);
            setCopied(symbol);
            toast({
                title: t("mkt.crypto.toastCopiedTitle").replace("{symbol}", symbol),
                description: t("mkt.crypto.toastCopiedDesc"),
            });
            window.setTimeout(() => setCopied(null), 2000);
        }
        catch
        {
            toast({
                variant: "destructive",
                title: t("mkt.crypto.toastFailedTitle"),
                description: t("mkt.crypto.toastFailedDesc"),
            });
        }
    };

    return (
        <section id="donate" className="container mx-auto px-4 py-16 md:py-20">
            {withHeading && (
                <div className="max-w-2xl mb-10">
                    <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-primary bg-primary/10 px-3 py-1 rounded-full">
                        <HeartHandshake className="h-3.5 w-3.5" /> {t("mkt.crypto.supportBadge")}
                    </span>
                    <h2 className="mt-4 text-3xl md:text-4xl font-bold">{t("mkt.crypto.heading")}</h2>
                    <p className="mt-3 text-muted-foreground">{t("mkt.crypto.description")}</p>
                </div>
            )}

            <div className="grid gap-5 md:grid-cols-2">
                {cryptoWallets.map((wallet) => (
                    <Card key={wallet.symbol} className="shadow-[var(--shadow-soft)]">
                        <CardContent className="p-6 space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-primary-glow text-primary-foreground flex items-center justify-center">
                                    <Bitcoin className="h-5 w-5" aria-hidden="true" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">{wallet.name}</h3>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider">{wallet.symbol}</p>
                                </div>
                            </div>

                            <code
                                className="block break-all rounded-lg bg-muted px-3 py-3 text-xs leading-relaxed"
                                aria-label={t("mkt.crypto.addressAria").replace("{name}", wallet.name)}
                            >
                                {wallet.address}
                            </code>

                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => handleCopy(wallet.symbol, wallet.address)}
                            >
                                {copied === wallet.symbol
                                    ? (<><Check className="h-4 w-4" /> {t("mkt.crypto.copied")}</>)
                                    : (<><Copy className="h-4 w-4" /> {t("mkt.crypto.copyAddress").replace("{symbol}", wallet.symbol)}</>)}
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <p className="mt-6 text-xs text-muted-foreground max-w-2xl">
                {t("mkt.crypto.disclaimer")}
            </p>
        </section>
    );
}
