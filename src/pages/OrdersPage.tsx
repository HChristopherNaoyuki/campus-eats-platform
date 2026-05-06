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

const statusVariant: Record<OrderStatus, string> = {
  Pending: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  Preparing: "bg-blue-500/15 text-blue-700 dark:text-blue-400",
  Completed: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
};

export default function OrdersPage() {
  const { orders, users, menu, placeOrder, updateOrderStatus } = useCampus();
  const [userId, setUserId] = useState(users[0]?.id ?? "");
  const [lines, setLines] = useState<{ itemId: string; quantity: number }[]>([
    { itemId: menu[0]?.id ?? "", quantity: 1 },
  ]);

  const updateLine = (i: number, patch: Partial<{ itemId: string; quantity: number }>) =>
    setLines(lines.map((l, idx) => (idx === i ? { ...l, ...patch } : l)));

  const handleConfirm = () => {
    if (!userId) return toast.error("Select a user");
    const valid = lines.filter((l) => l.itemId && l.quantity > 0);
    if (valid.length === 0) return toast.error("Add at least one item");
    placeOrder(userId, valid);
    setLines([{ itemId: menu[0]?.id ?? "", quantity: 1 }]);
    toast.success("Order placed");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Order Management</h1>
        <p className="text-muted-foreground text-sm">Place new orders and track fulfillment.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[460px_1fr]">
        <Card>
          <CardHeader><CardTitle>Place Order</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>User</Label>
              <Select value={userId} onValueChange={setUserId}>
                <SelectTrigger><SelectValue placeholder="Select user" /></SelectTrigger>
                <SelectContent>
                  {users.map((u) => <SelectItem key={u.id} value={u.id}>{u.name} ({u.role})</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Items</Label>
              {lines.map((l, i) => (
                <div key={i} className="flex gap-2">
                  <Select value={l.itemId} onValueChange={(v) => updateLine(i, { itemId: v })}>
                    <SelectTrigger className="flex-1"><SelectValue placeholder="Item" /></SelectTrigger>
                    <SelectContent>
                      {menu.map((m) => <SelectItem key={m.id} value={m.id}>{m.name} — ${m.price.toFixed(2)}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Input type="number" min="1" className="w-20" value={l.quantity} onChange={(e) => updateLine(i, { quantity: parseInt(e.target.value) || 1 })} />
                  <Button size="icon" variant="ghost" onClick={() => setLines(lines.filter((_, idx) => idx !== i))} disabled={lines.length === 1}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => setLines([...lines, { itemId: menu[0]?.id ?? "", quantity: 1 }])}>
                <Plus className="h-4 w-4 mr-1" /> Add item
              </Button>
            </div>

            <Button className="w-full" onClick={handleConfirm}>Confirm Order</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>All Orders</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow><TableHead>Order ID</TableHead><TableHead>User</TableHead><TableHead>Items</TableHead><TableHead>Total</TableHead><TableHead>Status</TableHead></TableRow>
              </TableHeader>
              <TableBody>
                {orders.length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">No orders yet</TableCell></TableRow>
                ) : orders.map((o) => {
                  const user = users.find((u) => u.id === o.userId);
                  const total = o.lines.reduce((sum, l) => {
                    const item = menu.find((m) => m.id === l.itemId);
                    return sum + (item?.price ?? 0) * l.quantity;
                  }, 0);
                  return (
                    <TableRow key={o.id}>
                      <TableCell className="font-mono text-xs">{o.id}</TableCell>
                      <TableCell>{user?.name ?? "—"}</TableCell>
                      <TableCell>
                        <div className="text-xs text-muted-foreground">
                          {o.lines.map((l) => {
                            const m = menu.find((mi) => mi.id === l.itemId);
                            return <div key={l.itemId}>{m?.name ?? "?"} × {l.quantity}</div>;
                          })}
                        </div>
                      </TableCell>
                      <TableCell>${total.toFixed(2)}</TableCell>
                      <TableCell>
                        <Select value={o.status} onValueChange={(v) => updateOrderStatus(o.id, v as OrderStatus)}>
                          <SelectTrigger className="w-[140px] h-8">
                            <Badge className={statusVariant[o.status]} variant="outline">{o.status}</Badge>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="Preparing">Preparing</SelectItem>
                            <SelectItem value="Completed">Completed</SelectItem>
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