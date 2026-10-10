import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useCampus } from "@/store/campusStore";
import type { Role } from "@/types/campus";
import { toast } from "sonner";
import { useI18n } from "@/i18n";

export default function UsersPage() {
  const { t } = useI18n();
  const { users, registerUser, login, currentUserId } = useCampus();
  const [reg, setReg] = useState({ name: "", email: "", password: "", role: "Student" as Role });
  const [creds, setCreds] = useState({ email: "", password: "" });
  const adminExists = users.some((u) => u.role === "Admin");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reg.name || !reg.email || !reg.password) return toast.error(t("adm.users.fillAllFields"));
    try {
      await registerUser(reg);
      toast.success(t("adm.users.registered"));
      setReg({ name: "", email: "", password: "", role: "Student" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("adm.users.registrationFailed"));
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const u = await login(creds.email, creds.password).catch(() => null);
    u ? toast.success(t("adm.users.welcomeUser").replace("{name}", u.name)) : toast.error(t("adm.users.invalidCredentials"));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t("adm.users.title")}</h1>
        <p className="text-muted-foreground text-sm">{t("adm.users.subtitle")}</p>
      </div>

      <Tabs defaultValue="register" className="grid gap-6 lg:grid-cols-[420px_1fr]">
        <Card>
          <CardHeader>
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="register">{t("adm.users.register")}</TabsTrigger>
              <TabsTrigger value="login">{t("adm.users.login")}</TabsTrigger>
            </TabsList>
          </CardHeader>
          <CardContent>
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-3">
                <div><Label>{t("adm.users.name")}</Label><Input value={reg.name} onChange={(e) => setReg({ ...reg, name: e.target.value })} /></div>
                <div><Label>{t("adm.users.email")}</Label><Input type="email" value={reg.email} onChange={(e) => setReg({ ...reg, email: e.target.value })} /></div>
                <div><Label>{t("adm.users.password")}</Label><Input type="password" value={reg.password} onChange={(e) => setReg({ ...reg, password: e.target.value })} /></div>
                <div>
                  <Label>{t("adm.users.role")}</Label>
                  <Select value={reg.role} onValueChange={(v) => setReg({ ...reg, role: v as Role })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Student">{t("adm.role.Student")}</SelectItem>
                      <SelectItem value="Vendor">{t("adm.role.Vendor")}</SelectItem>
                      {!adminExists && <SelectItem value="Admin">{t("adm.users.roleAdminBootstrap")}</SelectItem>}
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full">{t("adm.users.registerUser")}</Button>
              </form>
            </TabsContent>
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-3">
                <div><Label>{t("adm.users.email")}</Label><Input type="email" value={creds.email} onChange={(e) => setCreds({ ...creds, email: e.target.value })} /></div>
                <div><Label>{t("adm.users.password")}</Label><Input type="password" value={creds.password} onChange={(e) => setCreds({ ...creds, password: e.target.value })} /></div>
                <Button type="submit" className="w-full">{t("adm.users.loginButton")}</Button>
              </form>
            </TabsContent>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>{t("adm.users.allUsers")}</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow><TableHead>{t("adm.users.tableName")}</TableHead><TableHead>{t("adm.users.tableEmail")}</TableHead><TableHead>{t("adm.users.tableRole")}</TableHead><TableHead></TableHead></TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">{u.name}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell><Badge variant="secondary">{t(`adm.role.${u.role}`)}</Badge></TableCell>
                    <TableCell>{u.id === currentUserId && <Badge>{t("adm.users.active")}</Badge>}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </Tabs>
    </div>
  );
}
