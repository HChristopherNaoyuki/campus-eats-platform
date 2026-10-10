import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCampus } from "@/store/campusStore";
import { toast } from "sonner";
import { Pencil, Check, X } from "lucide-react";
import { useI18n } from "@/i18n";

export default function VendorsPage() {
  const { t } = useI18n();
  const { vendors, addVendor, updateVendor, loadCatalog, catalogLoading } = useCampus();
  const [form, setForm] = useState({ name: "", location: "", contact: "" });
  const [editId, setEditId] = useState<string | null>(null);
  const [edit, setEdit] = useState({ name: "", location: "" });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.location || !form.contact) return toast.error(t("adm.vendors.fillAllFields"));
    addVendor(form);
    setForm({ name: "", location: "", contact: "" });
    toast.success(t("adm.vendors.registered"));
  };

  const startEdit = (id: string, name: string, location: string) => {
    setEditId(id);
    setEdit({ name, location });
  };

  const saveEdit = () => {
    if (!editId) return;
    updateVendor(editId, edit);
    setEditId(null);
    toast.success(t("adm.vendors.updated"));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{t("adm.vendors.title")}</h1>
          <p className="text-muted-foreground text-sm">{t("adm.vendors.subtitle")}</p>
        </div>
        <Button variant="outline" disabled={catalogLoading} onClick={() => loadCatalog(true)}>
          {catalogLoading ? t("adm.vendors.syncing") : t("adm.vendors.syncFromApi")}
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
        <Card>
          <CardHeader><CardTitle>{t("adm.vendors.registerVendor")}</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleAdd} className="space-y-3">
              <div><Label>{t("adm.vendors.vendorName")}</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
              <div><Label>{t("adm.vendors.location")}</Label><Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></div>
              <div><Label>{t("adm.vendors.contactNumber")}</Label><Input value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} /></div>
              <Button type="submit" className="w-full">{t("adm.vendors.registerVendor")}</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>{t("adm.vendors.allVendors")}</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow><TableHead>{t("adm.vendors.idHeader")}</TableHead><TableHead>{t("adm.vendors.nameHeader")}</TableHead><TableHead>{t("adm.vendors.locationHeader")}</TableHead><TableHead>{t("adm.vendors.contactHeader")}</TableHead><TableHead></TableHead></TableRow>
              </TableHeader>
              <TableBody>
                {vendors.map((v) => (
                  <TableRow key={v.id}>
                    <TableCell className="font-mono text-xs">{v.id}</TableCell>
                    <TableCell>
                      {editId === v.id ? <Input value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} /> : <span className="font-medium">{v.name}</span>}
                    </TableCell>
                    <TableCell>
                      {editId === v.id ? <Input value={edit.location} onChange={(e) => setEdit({ ...edit, location: e.target.value })} /> : v.location}
                    </TableCell>
                    <TableCell>{v.contact}</TableCell>
                    <TableCell>
                      {editId === v.id ? (
                        <div className="flex gap-1">
                          <Button size="icon" variant="ghost" onClick={saveEdit}><Check className="h-4 w-4" /></Button>
                          <Button size="icon" variant="ghost" onClick={() => setEditId(null)}><X className="h-4 w-4" /></Button>
                        </div>
                      ) : (
                        <Button size="icon" variant="ghost" onClick={() => startEdit(v.id, v.name, v.location)}><Pencil className="h-4 w-4" /></Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
