import { useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useCampus } from "@/store/campusStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LogOut, Plus, Trash2, ShoppingBag, DollarSign, UtensilsCrossed } from "lucide-react";
import { toast } from "sonner";
import type { OrderStatus } from "@/types/campus";

export default function VendorDashboard() {
  const { currentUserId, users, vendors, menu, orders, addMenuItem, removeMenuItem, updateMenuItem, updateOrderStatus, logout } = useCampus();
  const user = users.find((u) => u.id === currentUserId);
  const vendor = vendors.find((v) => v.id === user?.vendorId) ?? vendors[0];

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "Vendor") return <Navigate to={user.role === "Student" ? "/student" : "/dashboard"} replace />;

  const myMenu = menu.filter((m) => m.vendorId === vendor?.id);
  const myItemIds = new Set(myMenu.map((m) => m.id));
  const myOrders = orders.filter((o) => o.lines.some((l) => myItemIds.has(l.itemId))).slice().reverse();

  const revenue = useMemo(
    () =>
      myOrders.reduce(
        (sum, o) =>
          sum +
          o.lines.reduce((s, l) => {
            const it = menu.find((m) => m.id === l.itemId);
            return s + (it && myItemIds.has(it.id) ? it.price * l.quantity : 0);
          }, 0),
        0
      ),
    [myOrders, menu]
  );

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    const p = parseFloat(price);
    if (!name.trim() || isNaN(p) || p <= 0) return toast.error("Enter a name and valid price");
    if (!vendor) return toast.error("No vendor profile linked");
    addMenuItem({ name: name.trim(), price: p, vendorId: vendor.id });
    setName(""); setPrice("");
    toast.success("Item added");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b bg-card">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-primary to-primary-glow text-primary-foreground font-bold flex items-center justify-center">CE</div>
            <span className="font-bold">Campus Eats · Vendor</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-medium">{vendor?.name ?? user.name}</div>
              <div className="text-xs text-muted-foreground">{vendor?.location}</div>
            </div>
            <Button variant="ghost" size="sm" onClick={logout}><LogOut className="h-4 w-4" /></Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-6">
        <div className="grid sm:grid-cols-3 gap-4">
          <Stat label="Menu items" value={myMenu.length} icon={UtensilsCrossed} />
          <Stat label="Orders" value={myOrders.length} icon={ShoppingBag} />
          <Stat label="Revenue" value={`$${revenue.toFixed(2)}`} icon={DollarSign} />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle>Incoming orders</CardTitle></CardHeader>
            <CardContent>
              {myOrders.length === 0 ? (
                <p className="text-sm text-muted-foreground">No orders yet.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow><TableHead>Order</TableHead><TableHead>Items</TableHead><TableHead>Status</TableHead></TableRow>
                  </TableHeader>
                  <TableBody>
                    {myOrders.map((o) => (
                      <TableRow key={o.id}>
                        <TableCell className="font-mono text-xs">#{o.id.slice(0, 6)}</TableCell>
                        <TableCell className="text-sm">
                          {o.lines.filter((l) => myItemIds.has(l.itemId)).map((l) => {
                            const it = menu.find((m) => m.id === l.itemId);
                            return <div key={l.itemId}>{it?.name} × {l.quantity}</div>;
                          })}
                        </TableCell>
                        <TableCell>
                          <Select value={o.status} onValueChange={(v) => updateOrderStatus(o.id, v as OrderStatus)}>
                            <SelectTrigger className="h-8 w-[130px]"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Pending">Pending</SelectItem>
                              <SelectItem value="Preparing">Preparing</SelectItem>
                              <SelectItem value="Completed">Completed</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Manage menu</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={add} className="grid grid-cols-[1fr,100px,auto] gap-2 items-end">
                <div className="space-y-1"><Label>Item name</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
                <div className="space-y-1"><Label>Price</Label><Input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} /></div>
                <Button type="submit"><Plus className="h-4 w-4" /></Button>
              </form>
              <Table>
                <TableHeader><TableRow><TableHead>Item</TableHead><TableHead>Price</TableHead><TableHead></TableHead></TableRow></TableHeader>
                <TableBody>
                  {myMenu.map((m) => (
                    <TableRow key={m.id}>
                      <TableCell><Input defaultValue={m.name} onBlur={(e) => updateMenuItem(m.id, { name: e.target.value })} /></TableCell>
                      <TableCell><Input type="number" step="0.01" defaultValue={m.price} onBlur={(e) => updateMenuItem(m.id, { price: parseFloat(e.target.value) || 0 })} /></TableCell>
                      <TableCell><Button size="icon" variant="ghost" onClick={() => removeMenuItem(m.id)}><Trash2 className="h-4 w-4" /></Button></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

function Stat({ label, value, icon: Icon }: { label: string; value: string | number; icon: any }) {
  return (
    <Card>
      <CardContent className="p-4 flex items-center justify-between">
        <div>
          <div className="text-xs text-muted-foreground uppercase">{label}</div>
          <div className="text-2xl font-bold">{value}</div>
        </div>
        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-primary-glow text-primary-foreground flex items-center justify-center">
          <Icon className="h-5 w-5" />
        </div>
      </CardContent>
    </Card>
  );
}