import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCampus } from "@/store/campusStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { AuthShell } from "./Login";
import type { Role } from "@/types/campus";

export default function Signup() {
  const { registerUser, users, login } = useCampus();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("Student");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 4) return toast.error("Password must be at least 4 characters");
    if (users.some((u) => u.email === email.trim())) return toast.error("Email already registered");
    const adminExists = users.some((u) => u.role === "Admin");
    // Never trust a client-supplied Admin role unless no admin exists yet
    // (initial bootstrap). All other self-registrations are forced to Student.
    const safeRole: Role = role === "Admin" && !adminExists ? "Admin" : role === "Vendor" ? "Vendor" : "Student";
    registerUser({ name: name.trim(), email: email.trim(), password, role: safeRole });
    login(email.trim(), password);
    toast.success("Account created");
    if (safeRole === "Admin") navigate("/dashboard");
    else if (safeRole === "Vendor") navigate("/vendor");
    else navigate("/student");
  };

  return (
    <AuthShell title="Create account" subtitle="Join the campus pickup network">
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label>Name</Label>
          <Input required value={name} onChange={(e) => setName(e.target.value)} maxLength={80} />
        </div>
        <div className="space-y-2">
          <Label>Email</Label>
          <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} maxLength={120} />
        </div>
        <div className="space-y-2">
          <Label>Password</Label>
          <Input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} maxLength={64} />
        </div>
        <div className="space-y-2">
          <Label>Role</Label>
          <Select value={role} onValueChange={(v) => setRole(v as Role)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Student">Student</SelectItem>
              <SelectItem value="Vendor">Vendor</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button type="submit" className="w-full">Create account</Button>
        <p className="text-sm text-center text-muted-foreground">
          Already have an account? <Link to="/login" className="text-primary hover:underline">Sign in</Link>
        </p>
      </form>
    </AuthShell>
  );
}