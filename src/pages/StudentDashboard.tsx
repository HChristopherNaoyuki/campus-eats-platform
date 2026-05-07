import { useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { useCampus } from "@/store/campusStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, Minus, ShoppingBag, LogOut, Clock, CheckCircle2, ChefHat } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

export default function StudentDashboard() {
  const { currentUserId, users, vendors, menu, orders, placeOrder, logout } = useCampus();
  const user = users.find((u) => u.id === currentUserId);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [search, setSearch] = useState("");

  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "Student") return <Navigate to={user.role === "Vendor" ? "/vendor" : "/dashboard"} replace />;

  const filtered = menu.filter((m) => m.name.toLowerCase().includes(search.toLowerCase()));
  const cartTotal = useMemo(
    () => Object.entries(cart).reduce((sum, [id, q]) => sum + (menu.find((m) => m.id === id)?.price ?? 0) * q, 0),
    [cart, menu]
  );
  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);
  const myOrders = orders.filter((o) => o.userId === user.id).slice().reverse();

  const inc = (id: string) => setCart({ ...cart, [id]: (cart[id] ?? 0) + 1 });
  const dec = (id: string) => {
    const next = { ...cart, [id]: Math.max(0, (cart[id] ?? 0) - 1) };
    if (next[id] === 0) delete next[id];
    setCart(next);
  };

  const checkout = () => {
    const lines = Object.entries(cart).map(([itemId, quantity]) => ({ itemId, quantity }));
    if (lines.length === 0) return toast.error("Your cart is empty");
    placeOrder(user.id, lines);
    setCart({});
    toast.success("Order placed! Vendor will start preparing soon.");
  };

  const statusIcon = (s: string) =>
    s === "Pending" ? <Clock className="h-3 w-3" /> : s === "Preparing" ? <ChefHat className="h-3 w-3" /> : <CheckCircle2 className="h-3 w-3" />;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b bg-card">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-primary to-primary-glow text-primary-foreground font-bold flex items-center justify-center">CE</div>
            <span className="font-bold">Campus Eats</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-medium">{user.name}</div>
              <div className="text-xs text-muted-foreground">Student</div>
            </div>
            <Button variant="ghost" size="sm" onClick={logout}><LogOut className="h-4 w-4" /></Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Hey {user.name.split(" ")[0]} 👋</h1>
            <p className="text-muted-foreground">What are you eating today?</p>
          </div>
          <Input placeholder="Search menu items…" value={search} onChange={(e) => setSearch(e.target.value)} />

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
                        <div className="text-sm text-muted-foreground">${m.price.toFixed(2)}</div>
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
                      <span className="font-medium">${(m.price * q).toFixed(2)}</span>
                    </div>
                  );
                })
              )}
              <div className="border-t pt-3 flex justify-between font-semibold">
                <span>Total</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <Button className="w-full" onClick={checkout}>Confirm order</Button>
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
      </main>
    </div>
  );
}