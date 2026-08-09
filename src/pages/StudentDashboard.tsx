import { useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { useCampus, priceOrder } from "@/store/campusStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, Minus, ShoppingBag, Clock, CheckCircle2, ChefHat } from "lucide-react";
import { toast } from "sonner";

export default function StudentDashboard() {
  const { currentUserId, users, vendors, menu, orders, placeOrder, catalogLoading, catalogError } = useCampus();
  const user = users.find((u) => u.id === currentUserId);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [search, setSearch] = useState("");
  const [placing, setPlacing] = useState(false);

  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "Student" && user.role !== "Standard")
    return <Navigate to={user.role === "Vendor" ? "/vendor" : "/dashboard"} replace />;

  const filtered = menu.filter(
    (m) => m.available !== false && m.name.toLowerCase().includes(search.toLowerCase())
  );
  const pricing = useMemo(
    () =>
      priceOrder(
        Object.entries(cart).map(([itemId, quantity]) => ({ itemId, quantity })),
        menu,
        user.role
      ),
    [cart, menu, user.role]
  );
  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);
  const myOrders = orders.filter((o) => o.userId === user.id).slice().reverse();

  const inc = (id: string) => setCart({ ...cart, [id]: (cart[id] ?? 0) + 1 });
  const dec = (id: string) => {
    const next = { ...cart, [id]: Math.max(0, (cart[id] ?? 0) - 1) };
    if (next[id] === 0) delete next[id];
    setCart(next);
  };

  const checkout = async () => {
    const lines = Object.entries(cart).map(([itemId, quantity]) => ({ itemId, quantity }));
    if (lines.length === 0) return toast.error("Your cart is empty");
    setPlacing(true);
    try {
      await placeOrder(user.id, lines);
      setCart({});
      toast.success("Order placed! Vendor will start preparing soon.");
    } catch {
      toast.error("Could not place the order. Please try again.");
    } finally {
      setPlacing(false);
    }
  };

  const statusIcon = (s: string) =>
    s === "Pending" || s === "Accepted" ? <Clock className="h-3 w-3" />
      : s === "Preparing" ? <ChefHat className="h-3 w-3" />
      : <CheckCircle2 className="h-3 w-3" />;

  return (
    <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Hey {user.name.split(" ")[0]} 👋</h1>
            <p className="text-muted-foreground">What are you eating today?</p>
          </div>
          <Input placeholder="Search menu items…" value={search} onChange={(e) => setSearch(e.target.value)} />
          {catalogLoading && <p className="text-sm text-muted-foreground">Loading restaurants and menus…</p>}
          {catalogError && <p className="text-sm text-destructive">Menu service unavailable: {catalogError}</p>}

          {vendors.map((v) => {
            const items = filtered.filter((m) => m.vendorId === v.id);
            if (items.length === 0) return null;
            return (
              <Card key={v.id}>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>{v.name}</span>
                    <span className="text-xs font-normal text-muted-foreground">{v.location}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid sm:grid-cols-2 gap-3">
                  {items.map((m) => (
                    <div key={m.id} className="flex justify-between items-center p-3 rounded-lg border">
                      <div>
                        <div className="font-medium">{m.name}</div>
                        <div className="text-sm text-muted-foreground">R{m.price.toFixed(2)}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        {cart[m.id] ? (
                          <>
                            <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => dec(m.id)}><Minus className="h-3 w-3" /></Button>
                            <span className="w-6 text-center text-sm">{cart[m.id]}</span>
                            <Button size="icon" className="h-8 w-8" onClick={() => inc(m.id)}><Plus className="h-3 w-3" /></Button>
                          </>
                        ) : (
                          <Button size="sm" onClick={() => inc(m.id)}><Plus className="h-3 w-3" /> Add</Button>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="space-y-6">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><ShoppingBag className="h-4 w-4" /> Your cart ({cartCount})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(cart).length === 0 ? (
                <p className="text-sm text-muted-foreground">Cart is empty.</p>
              ) : (
                Object.entries(cart).map(([id, q]) => {
                  const m = menu.find((mi) => mi.id === id);
                  if (!m) return null;
                  return (
                    <div key={id} className="flex justify-between text-sm">
                      <span>{m.name} × {q}</span>
                      <span className="font-medium">R{(m.price * q).toFixed(2)}</span>
                    </div>
                  );
                })
              )}
              <div className="border-t pt-3 space-y-1 text-sm">
                <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>R{pricing.subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between text-muted-foreground"><span>Tax (20%)</span><span>R{pricing.tax.toFixed(2)}</span></div>
                <div className="flex justify-between text-muted-foreground"><span>Rounded to next R5</span><span>R{(pricing.subtotal + pricing.tax > 0 ? Math.ceil((pricing.subtotal + pricing.tax) / 5) * 5 : 0).toFixed(2)}</span></div>
                {pricing.discount > 0 && (
                  <div className="flex justify-between text-emerald-600"><span>Student discount (2.5%)</span><span>-R{pricing.discount.toFixed(2)}</span></div>
                )}
                <div className="flex justify-between font-semibold text-base pt-1 border-t"><span>Total</span><span>R{pricing.total.toFixed(2)}</span></div>
              </div>
              <Button className="w-full" onClick={checkout} disabled={placing}>{placing ? "Placing order…" : "Confirm order"}</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>My orders</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {myOrders.length === 0 ? (
                <p className="text-sm text-muted-foreground">No orders yet.</p>
              ) : (
                myOrders.slice(0, 5).map((o) => (
                  <div key={o.id} className="flex justify-between text-sm p-2 rounded border">
                    <span className="font-mono text-xs">#{o.id.slice(0, 6)}</span>
                    <span>{o.lines.length} item(s)</span>
                    <Badge variant="secondary" className="gap-1">{statusIcon(o.status)} {o.status}</Badge>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
    </div>
  );
}