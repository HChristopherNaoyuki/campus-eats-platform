import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Copy, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { useI18n } from "@/i18n";

interface WalletRow
{
    symbol: string;
    name: string;
    address: string;
}

type SortKey = "symbol" | "name";
type SortDir = "asc" | "desc";

/**
 * Interactive wallet table: filter by name or symbol, sort by column, and
 * copy an address straight from the row.
 */
export default function WalletTable({ wallets }: { wallets: WalletRow[] })
{
    const { t } = useI18n();
    const [filter, setFilter] = useState("");
    const [sortKey, setSortKey] = useState<SortKey>("name");
    const [sortDir, setSortDir] = useState<SortDir>("asc");
    const [copied, setCopied] = useState<string | null>(null);

    const rows = useMemo(() =>
    {
        const query = filter.trim().toLowerCase();
        const filtered = wallets.filter(
            (wallet) =>
                query === "" ||
                wallet.name.toLowerCase().includes(query) ||
                wallet.symbol.toLowerCase().includes(query)
        );
        return filtered.sort((a, b) =>
        {
            const factor = sortDir === "asc" ? 1 : -1;
            return a[sortKey].localeCompare(b[sortKey]) * factor;
        });
    }, [wallets, filter, sortKey, sortDir]);

    const toggleSort = (key: SortKey) =>
    {
        if (sortKey === key)
        {
            setSortDir(sortDir === "asc" ? "desc" : "asc");
        }
        else
        {
            setSortKey(key);
            setSortDir("asc");
        }
    };

    const copyAddress = async (wallet: WalletRow) =>
    {
        try
        {
            await navigator.clipboard.writeText(wallet.address);
            setCopied(wallet.symbol);
            toast.success(t("mkt.crypto.toastCopiedTitle").replace("{symbol}", wallet.symbol));
            window.setTimeout(() => setCopied(null), 2000);
        }
        catch
        {
            toast.error(t("mkt.crypto.toastFailedTitle"));
        }
    };

    const sortHeader = (key: SortKey, label: string) => (
        <TableHead>
            <button
                type="button"
                className="inline-flex items-center gap-1 hover:text-foreground"
                onClick={() => toggleSort(key)}
                aria-label={`${t("mkt.crypto.colName")}: ${label}`}
            >
                {label}
                {sortKey === key ? (
                    sortDir === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                ) : null}
            </button>
        </TableHead>
    );

    return (
        <Card className="shadow-[var(--shadow-soft)]">
            <CardContent className="p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="font-semibold">{t("mkt.crypto.tableTitle")}</h3>
                    <Input
                        value={filter}
                        onChange={(event) => setFilter(event.target.value.slice(0, 40))}
                        placeholder={t("mkt.crypto.tableFilter")}
                        className="max-w-xs"
                    />
                </div>

                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                {sortHeader("symbol", t("mkt.crypto.colSymbol"))}
                                {sortHeader("name", t("mkt.crypto.colName"))}
                                <TableHead>{t("mkt.crypto.colAddress")}</TableHead>
                                <TableHead className="text-right">{t("mkt.crypto.colAction")}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {rows.map((wallet) => (
                                <TableRow key={wallet.symbol}>
                                    <TableCell className="font-semibold uppercase">{wallet.symbol}</TableCell>
                                    <TableCell>{wallet.name}</TableCell>
                                    <TableCell className="max-w-[16rem] truncate font-mono text-xs" title={wallet.address}>
                                        {wallet.address}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => void copyAddress(wallet)}
                                            aria-label={t("mkt.crypto.copyAddress").replace("{symbol}", wallet.symbol)}
                                        >
                                            {copied === wallet.symbol ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {rows.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="py-6 text-center text-muted-foreground">
                                        {t("mkt.polish.searchNoResults")}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}
