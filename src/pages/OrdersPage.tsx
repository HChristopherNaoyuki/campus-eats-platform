import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useCampus } from "@/store/campusStore";
import type { OrderStatus } from "@/types/campus";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { SAMPLE_COUPONS, isSampleCoupon } from "@/lib/coupons";
import { useI18n } from "@/i18n";

const statusVariant: Record<OrderStatus, string> = {
  Pending: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  Accepted: "bg-sky-500/15 text-sky-700 dark:text-sky-400",
  Rejected: "bg-red-500/15 text-red-700 dark:text-red-400",
  Preparing: "bg-blue-500/15 text-blue-700 dark:text-blue-400",
  Ready: "bg-violet-500/15 text-violet-700 dark:text-violet-400",
  Completed: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
};

const ALL_STATUSES: OrderStatus[] = ["Pending", "Accepted", "Rejected", "Preparing", "Ready", "Completed"];

export default function OrdersPage() {
  const { t } = useI18n();
  const { orders, users, menu, placeOrder, updateOrderStatus } = useCampus();
  const [userId, setUserId] = useState(users[0]?.id ?? "");
  const [lines, setLines] = useState<{ itemId: string; quantity: number }[]>([
    { itemId: menu[0]?.id ?? "", quantity: 1 },
  ]);
  const [couponCode, setCouponCode] = useState("");

  const updateLine = (i: number, patch: Partial<{ itemId: string; quantity: number }>) =>
    setLines(lines.map((l, idx) => (idx === i ? { ...l, ...patch } : l)));

  const handleConfirm = () => {
    if (!userId) return toast.error(t("adm.orders.selectUser"));
    const valid = lines.filter((l) => l.itemId && l.quantity > 0);
    if (valid.length === 0) return toast.error(t("adm.orders.addAtLeastOneItem"));
    const normalizedCoupon = couponCode.trim().toUpperCase();
    if (normalizedCoupon && !isSampleCoupon(normalizedCoupon)) return toast.error(t("adm.orders.enterValidCoupon"));
    void placeOrder(userId, valid, normalizedCoupon);
    setLines([{ itemId: menu[0]?.id ?? "", quantity: 1 }]);
    setCouponCode("");
    toast.success(t("adm.orders.orderPlaced"));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t("adm.orders.title")}</h1>
        <p className="text-muted-foreground text-sm">{t("adm.orders.subtitle")}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[460px_1fr]">
        <Card>
          <CardHeader><CardTitle>{t("adm.orders.placeOrder")}</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>{t("adm.orders.user")}</Label>
              <Select value={userId} onValueChange={setUserId}>
                <SelectTrigger><SelectValue placeholder={t("adm.orders.selectUserPlaceholder")} /></SelectTrigger>
                <SelectContent>
                  {users.map((u) => <SelectItem key={u.id} value={u.id}>{u.name} ({t(`adm.role.${u.role}`)})</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>{t("adm.orders.items")}</Label>
              {lines.map((l, i) => (
                <div key={i} className="flex gap-2">
                  <Select value={l.itemId} onValueChange={(v) => updateLine(i, { itemId: v })}>
                    <SelectTrigger className="flex-1"><SelectValue placeholder={t("adm.orders.itemPlaceholder")} /></SelectTrigger>
                    <SelectContent>
                      {menu.map((m) => <SelectItem key={m.id} value={m.id}>{m.name} — R{m.price.toFixed(2)}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Input type="number" min="1" className="w-20" value={l.quantity} onChange={(e) => updateLine(i, { quantity: parseInt(e.target.value) || 1 })} />
                  <Button size="icon" variant="ghost" onClick={() => setLines(lines.filter((_, idx) => idx !== i))} disabled={lines.length === 1}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => setLines([...lines, { itemId: menu[0]?.id ?? "", quantity: 1 }])}>
                <Plus className="h-4 w-4 mr-1" /> {t("adm.orders.addItem")}
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="admin-coupon">{t("adm.orders.sampleCoupon")}</Label>
              <Input id="admin-coupon" value={couponCode} onChange={(event) => setCouponCode(event.target.value.slice(0, 20).toUpperCase())} placeholder={t("adm.orders.optionalCouponCode")} />
              <div className="flex flex-wrap gap-2">
                {Object.entries(SAMPLE_COUPONS).map(([code, percentage]) => (
                  <Button key={code} type="button" size="sm" variant={couponCode === code ? "secondary" : "outline"} onClick={() => setCouponCode(code)}>
                    {code} · {percentage}%
                  </Button>
                ))}
              </div>
            </div>

            <Button className="w-full" onClick={handleConfirm}>{t("adm.orders.confirmOrder")}</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>{t("adm.orders.allOrders")}</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow><TableHead>{t("adm.orders.orderId")}</TableHead><TableHead>{t("adm.orders.userHeader")}</TableHead><TableHead>{t("adm.orders.itemsHeader")}</TableHead><TableHead>{t("adm.orders.totalHeader")}</TableHead><TableHead>{t("adm.orders.statusHeader")}</TableHead></TableRow>
              </TableHeader>
              <TableBody>
                {orders.length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">{t("adm.orders.noOrdersYet")}</TableCell></TableRow>
                ) : orders.map((o) => {
                  const user = users.find((u) => u.id === o.userId);
                  const total = o.lines.reduce((sum, l) => {
                    const item = menu.find((m) => m.id === l.itemId);
                    return sum + (item?.price ?? 0) * l.quantity;
                  }, 0);
                  return (
                    <TableRow key={o.id}>
                      <TableCell className="font-mono text-xs">{o.id}</TableCell>
                      <TableCell>{user?.name ?? t("adm.orders.dash")}</TableCell>
                      <TableCell>
                        <div className="text-xs text-muted-foreground">
                          {o.lines.map((l) => {
                            const m = menu.find((mi) => mi.id === l.itemId);
                            return <div key={l.itemId}>{m?.name ?? "?"} × {l.quantity}</div>;
                          })}
                        </div>
                      </TableCell>
                      <TableCell>R{(o.total ?? total).toFixed(2)}</TableCell>
                      <TableCell>
                        <Select value={o.status} onValueChange={(v) => updateOrderStatus(o.id, v as OrderStatus)}>
                          <SelectTrigger className="w-[160px] h-8">
                            <Badge className={statusVariant[o.status]} variant="outline">{t(`adm.status.${o.status}`)}</Badge>
                          </SelectTrigger>
                          <SelectContent>
                            {ALL_STATUSES.map((s) => (
                              <SelectItem key={s} value={s}>{t(`adm.status.${s}`)}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
