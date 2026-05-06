import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCampus } from "@/store/campusStore";
import type { OrderStatus } from "@/types/campus";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Printer } from "lucide-react";

const fmt = (n: number) => `$${n.toFixed(2)}`;
const dateOnly = (iso: string) => iso.slice(0, 10);

export default function ReportsPage() {
  const { orders, users, vendors, menu } = useCampus();

  // ----- Report 1: Sales -----
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const sales = useMemo(() => {
    const filtered = orders.filter((o) => {
      const d = dateOnly(o.createdAt);
      if (from && d < from) return false;
      if (to && d > to) return false;
      return true;
    });
    const byDate = new Map<string, { orders: number; revenue: number }>();
    filtered.forEach((o) => {
      const d = dateOnly(o.createdAt);
      const rev = o.lines.reduce((s, l) => {
        const item = menu.find((m) => m.id === l.itemId);
        return s + (item?.price ?? 0) * l.quantity;
      }, 0);
      const cur = byDate.get(d) ?? { orders: 0, revenue: 0 };
      byDate.set(d, { orders: cur.orders + 1, revenue: cur.revenue + rev });
    });
    return Array.from(byDate.entries())
      .map(([date, v]) => ({ date, ...v }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [orders, menu, from, to]);

  // ----- Report 2: Order Summary -----
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "All">("All");
  const orderSummary = useMemo(() => {
    const all: OrderStatus[] = ["Pending", "Preparing", "Completed"];
    const counts = all.map((s) => ({ status: s, count: orders.filter((o) => o.status === s).length }));
    return statusFilter === "All" ? counts : counts.filter((c) => c.status === statusFilter);
  }, [orders, statusFilter]);

  // ----- Report 3: Vendor Performance -----
  const [vendorFilter, setVendorFilter] = useState<string>("All");
  const vendorPerf = useMemo(() => {
    const data = vendors.map((v) => {
      const itemIds = menu.filter((m) => m.vendorId === v.id).map((m) => m.id);
      const sold = orders.reduce((sum, o) => {
        return sum + o.lines.filter((l) => itemIds.includes(l.itemId)).reduce((s, l) => s + l.quantity, 0);
      }, 0);
      return { vendor: v.name, vendorId: v.id, sold };
    });
    return vendorFilter === "All" ? data : data.filter((d) => d.vendorId === vendorFilter);
  }, [vendors, menu, orders, vendorFilter]);

  // ----- Report 4: Detailed Order -----
  const [orderId, setOrderId] = useState<string>(orders[0]?.id ?? "");
  const detailedOrder = useMemo(() => {
    const o = orders.find((x) => x.id === orderId);
    if (!o) return null;
    const user = users.find((u) => u.id === o.userId);
    const items = o.lines.map((l) => {
      const m = menu.find((mi) => mi.id === l.itemId);
      return {
        name: m?.name ?? "Unknown",
        price: m?.price ?? 0,
        quantity: l.quantity,
        total: (m?.price ?? 0) * l.quantity,
      };
    });
    return { order: o, user, items, grandTotal: items.reduce((s, i) => s + i.total, 0) };
  }, [orders, orderId, users, menu]);

  // ----- Report 5: User Activity -----
  const [userFilter, setUserFilter] = useState<string>("All");
  const userActivity = useMemo(() => {
    const data = users.map((u) => ({
      userId: u.id,
      name: u.name,
      role: u.role,
      totalOrders: orders.filter((o) => o.userId === u.id).length,
    }));
    return userFilter === "All" ? data : data.filter((d) => d.userId === userFilter);
  }, [users, orders, userFilter]);

  const handlePrint = () => window.print();

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Reports</h1>
          <p className="text-muted-foreground text-sm">Sales, orders, vendor and user analytics.</p>
        </div>
        <Button onClick={handlePrint} variant="outline">
          <Printer className="h-4 w-4 mr-2" /> Print / Export PDF
        </Button>
      </div>

      <Tabs defaultValue="sales" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="summary">Order Summary</TabsTrigger>
          <TabsTrigger value="vendor">Vendor</TabsTrigger>
          <TabsTrigger value="detailed">Detailed Order</TabsTrigger>
          <TabsTrigger value="user">User Activity</TabsTrigger>
        </TabsList>

        {/* Sales Report */}
        <TabsContent value="sales">
          <Card>
            <CardHeader><CardTitle>Sales Report</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-3">
                <div>
                  <Label>From</Label>
                  <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
                </div>
                <div>
                  <Label>To</Label>
                  <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
                </div>
              </div>
              <Table>
                <TableHeader>
                  <TableRow><TableHead>Date</TableHead><TableHead>Total Orders</TableHead><TableHead>Total Revenue</TableHead></TableRow>
                </TableHeader>
                <TableBody>
                  {sales.length === 0 ? (
                    <TableRow><TableCell colSpan={3} className="text-center text-muted-foreground py-6">No sales in range</TableCell></TableRow>
                  ) : sales.map((s) => (
                    <TableRow key={s.date}>
                      <TableCell>{s.date}</TableCell>
                      <TableCell>{s.orders}</TableCell>
                      <TableCell>{fmt(s.revenue)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {sales.length > 0 && (
                <div className="text-sm font-medium text-right">
                  Grand Total: {fmt(sales.reduce((s, x) => s + x.revenue, 0))} ({sales.reduce((s, x) => s + x.orders, 0)} orders)
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Order Summary */}
        <TabsContent value="summary">
          <Card>
            <CardHeader><CardTitle>Order Summary Report</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Status</Label>
                <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as OrderStatus | "All")}>
                  <SelectTrigger className="w-[200px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Preparing">Preparing</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Table>
                <TableHeader>
                  <TableRow><TableHead>Status</TableHead><TableHead>Number of Orders</TableHead></TableRow>
                </TableHeader>
                <TableBody>
                  {orderSummary.map((s) => (
                    <TableRow key={s.status}>
                      <TableCell>{s.status}</TableCell>
                      <TableCell>{s.count}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Vendor Performance */}
        <TabsContent value="vendor">
          <Card>
            <CardHeader><CardTitle>Vendor Performance Report</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Vendor (optional)</Label>
                <Select value={vendorFilter} onValueChange={setVendorFilter}>
                  <SelectTrigger className="w-[260px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Vendors</SelectItem>
                    {vendors.map((v) => <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={vendorPerf}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="vendor" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="sold" fill="hsl(var(--primary))" name="Items Sold" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <Table>
                <TableHeader>
                  <TableRow><TableHead>Vendor Name</TableHead><TableHead>Total Items Sold</TableHead></TableRow>
                </TableHeader>
                <TableBody>
                  {vendorPerf.map((v) => (
                    <TableRow key={v.vendorId}>
                      <TableCell>{v.vendor}</TableCell>
                      <TableCell>{v.sold}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Detailed Order */}
        <TabsContent value="detailed">
          <Card>
            <CardHeader><CardTitle>Detailed Order Report</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Order ID</Label>
                <Select value={orderId} onValueChange={setOrderId}>
                  <SelectTrigger className="w-[260px]"><SelectValue placeholder="Select order" /></SelectTrigger>
                  <SelectContent>
                    {orders.map((o) => <SelectItem key={o.id} value={o.id}>{o.id}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              {!detailedOrder ? (
                <p className="text-sm text-muted-foreground">No order selected.</p>
              ) : (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div><div className="text-muted-foreground">Order ID</div><div className="font-medium">{detailedOrder.order.id}</div></div>
                    <div><div className="text-muted-foreground">User</div><div className="font-medium">{detailedOrder.user?.name ?? "—"} ({detailedOrder.order.userId})</div></div>
                    <div><div className="text-muted-foreground">Date</div><div className="font-medium">{dateOnly(detailedOrder.order.createdAt)}</div></div>
                    <div><div className="text-muted-foreground">Status</div><div className="font-medium">{detailedOrder.order.status}</div></div>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow><TableHead>Item Name</TableHead><TableHead>Quantity</TableHead><TableHead>Price</TableHead><TableHead>Total Cost</TableHead></TableRow>
                    </TableHeader>
                    <TableBody>
                      {detailedOrder.items.map((it, i) => (
                        <TableRow key={i}>
                          <TableCell>{it.name}</TableCell>
                          <TableCell>{it.quantity}</TableCell>
                          <TableCell>{fmt(it.price)}</TableCell>
                          <TableCell>{fmt(it.total)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <div className="text-right font-semibold">Grand Total: {fmt(detailedOrder.grandTotal)}</div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* User Activity */}
        <TabsContent value="user">
          <Card>
            <CardHeader><CardTitle>User Activity Report</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>User (optional)</Label>
                <Select value={userFilter} onValueChange={setUserFilter}>
                  <SelectTrigger className="w-[260px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Users</SelectItem>
                    {users.map((u) => <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <Table>
                <TableHeader>
                  <TableRow><TableHead>User Name</TableHead><TableHead>Role</TableHead><TableHead>Total Orders</TableHead></TableRow>
                </TableHeader>
                <TableBody>
                  {userActivity.map((u) => (
                    <TableRow key={u.userId}>
                      <TableCell>{u.name}</TableCell>
                      <TableCell>{u.role}</TableCell>
                      <TableCell>{u.totalOrders}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}