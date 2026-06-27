import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCampus } from "@/store/campusStore";
import { toast } from "sonner";
import { Pencil, Trash2, Check, X } from "lucide-react";

export default function MenuPage() {
  const { menu, vendors, addMenuItem, updateMenuItem, removeMenuItem } = useCampus();
  const [form, setForm] = useState({ name: "", price: "", vendorId: vendors[0]?.id ?? "" });
  const [editId, setEditId] = useState<string | null>(null);
  const [edit, setEdit] = useState({ name: "", price: "" });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseFloat(form.price);
    if (!form.name || isNaN(price) || !form.vendorId) return toast.error("Fill all fields");
    addMenuItem({ name: form.name, price, vendorId: form.vendorId });
    setForm({ ...form, name: "", price: "" });
    toast.success("Item added");
  };

  const startEdit = (id: string, name: string, price: number) => {
    setEditId(id);
    setEdit({ name, price: String(price) });
  };

  const saveEdit = () => {
    if (!editId) return;
    updateMenuItem(editId, { name: edit.name, price: parseFloat(edit.price) });
    setEditId(null);
    toast.success("Item updated");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Menu Management</h1>
        <p className="text-muted-foreground text-sm">Add, update, and remove menu items.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
        <Card>
          <CardHeader><CardTitle>Add Menu Item</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleAdd} className="space-y-3">
              <div><Label>Item Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
              <div><Label>Price</Label><Input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} /></div>
              <div>
                <Label>Vendor</Label>
                <Select value={form.vendorId} onValueChange={(v) => setForm({ ...form, vendorId: v })}>
                  <SelectTrigger><SelectValue placeholder="Select vendor" /></SelectTrigger>
                  <SelectContent>
                    {vendors.map((v) => <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full">Add Item</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Menu Items</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow><TableHead>ID</TableHead><TableHead>Name</TableHead><TableHead>Price</TableHead><TableHead>Vendor</TableHead><TableHead></TableHead></TableRow>
              </TableHeader>
              <TableBody>
                {menu.map((m) => {
                  const vendor = vendors.find((v) => v.id === m.vendorId);
                  return (
                    <TableRow key={m.id}>
                      <TableCell className="font-mono text-xs">{m.id}</TableCell>
                      <TableCell>
                        {editId === m.id ? <Input value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} /> : <span className="font-medium">{m.name}</span>}
                      </TableCell>
                      <TableCell>
                        {editId === m.id ? <Input type="number" step="0.01" value={edit.price} onChange={(e) => setEdit({ ...edit, price: e.target.value })} /> : `R${m.price.toFixed(2)}`}
                      </TableCell>
                      <TableCell>{vendor?.name ?? "—"}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {editId === m.id ? (
                            <>
                              <Button size="icon" variant="ghost" onClick={saveEdit}><Check className="h-4 w-4" /></Button>
                              <Button size="icon" variant="ghost" onClick={() => setEditId(null)}><X className="h-4 w-4" /></Button>
                            </>
                          ) : (
                            <>
                              <Button size="icon" variant="ghost" onClick={() => startEdit(m.id, m.name, m.price)}><Pencil className="h-4 w-4" /></Button>
                              <Button size="icon" variant="ghost" onClick={() => { removeMenuItem(m.id); toast.success("Removed"); }}><Trash2 className="h-4 w-4" /></Button>
                            </>
                          )}
                        </div>
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