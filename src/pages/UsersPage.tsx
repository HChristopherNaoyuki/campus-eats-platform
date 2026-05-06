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

export default function UsersPage() {
  const { users, registerUser, login, currentUserId } = useCampus();
  const [reg, setReg] = useState({ name: "", email: "", password: "", role: "Student" as Role });
  const [creds, setCreds] = useState({ email: "", password: "" });

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reg.name || !reg.email || !reg.password) return toast.error("Fill all fields");
    registerUser(reg);
    toast.success("User registered");
    setReg({ name: "", email: "", password: "", role: "Student" });
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const u = login(creds.email, creds.password);
    u ? toast.success(`Welcome, ${u.name}`) : toast.error("Invalid credentials");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">User Management</h1>
        <p className="text-muted-foreground text-sm">Register users and authenticate them.</p>
      </div>

      <Tabs defaultValue="register" className="grid gap-6 lg:grid-cols-[420px_1fr]">
        <Card>
          <CardHeader>
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="register">Register</TabsTrigger>
              <TabsTrigger value="login">Login</TabsTrigger>
            </TabsList>
          </CardHeader>
          <CardContent>
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-3">
                <div><Label>Name</Label><Input value={reg.name} onChange={(e) => setReg({ ...reg, name: e.target.value })} /></div>
                <div><Label>Email</Label><Input type="email" value={reg.email} onChange={(e) => setReg({ ...reg, email: e.target.value })} /></div>
                <div><Label>Password</Label><Input type="password" value={reg.password} onChange={(e) => setReg({ ...reg, password: e.target.value })} /></div>
                <div>
                  <Label>Role</Label>
                  <Select value={reg.role} onValueChange={(v) => setReg({ ...reg, role: v as Role })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Student">Student</SelectItem>
                      <SelectItem value="Vendor">Vendor</SelectItem>
                      <SelectItem value="Admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full">Register User</Button>
              </form>
            </TabsContent>
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-3">
                <div><Label>Email</Label><Input type="email" value={creds.email} onChange={(e) => setCreds({ ...creds, email: e.target.value })} /></div>
                <div><Label>Password</Label><Input type="password" value={creds.password} onChange={(e) => setCreds({ ...creds, password: e.target.value })} /></div>
                <Button type="submit" className="w-full">Login</Button>
                <p className="text-xs text-muted-foreground">Try admin@campus.edu / admin</p>
              </form>
            </TabsContent>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>All Users</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow><TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Role</TableHead><TableHead></TableHead></TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">{u.name}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell><Badge variant="secondary">{u.role}</Badge></TableCell>
                    <TableCell>{u.id === currentUserId && <Badge>Active</Badge>}</TableCell>
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