import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCampus } from "@/store/campusStore";
import { Users, Store, UtensilsCrossed, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

export default function Index() {
  const { users, vendors, menu, orders } = useCampus();

  const stats = [
    { label: "Users", value: users.length, icon: Users, to: "/users", color: "from-orange-500 to-amber-500" },
    { label: "Vendors", value: vendors.length, icon: Store, to: "/vendors", color: "from-rose-500 to-orange-500" },
    { label: "Menu Items", value: menu.length, icon: UtensilsCrossed, to: "/menu", color: "from-emerald-500 to-teal-500" },
    { label: "Orders", value: orders.length, icon: ShoppingBag, to: "/orders", color: "from-amber-500 to-yellow-500" },
  ];

  return (
    <div className="space-y-8">
      <section className="rounded-2xl bg-gradient-to-br from-primary to-primary-glow p-8 text-primary-foreground shadow-[var(--shadow-glow)]">
        <h1 className="text-3xl font-bold">Welcome to Campus Eats</h1>
        <p className="mt-2 text-primary-foreground/90 max-w-xl">
          Manage users, vendors, menus, and orders for your campus food network — all in one place.
        </p>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} to={s.to}>
            <Card className="transition hover:shadow-[var(--shadow-soft)] hover:-translate-y-0.5">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{s.label}</CardTitle>
                <div className={`h-9 w-9 rounded-lg bg-gradient-to-br ${s.color} flex items-center justify-center text-white`}>
                  <s.icon className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{s.value}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <p className="text-sm text-muted-foreground">No orders yet. Place one in Order Management.</p>
          ) : (
            <ul className="divide-y">
              {orders.slice(-5).reverse().map((o) => (
                <li key={o.id} className="py-2 flex justify-between text-sm">
                  <span className="font-mono text-xs text-muted-foreground">#{o.id}</span>
                  <span>{o.lines.length} item(s)</span>
                  <span className="font-medium">{o.status}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
