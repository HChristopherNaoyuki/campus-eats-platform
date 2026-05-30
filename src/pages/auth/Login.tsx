import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCampus } from "@/store/campusStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";

export default function Login() {
  const { login } = useCampus();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const u = login(email.trim(), password);
    if (!u) return toast.error("Invalid email or password");
    toast.success(`Welcome back, ${u.name}`);
    if (u.role === "Admin") navigate("/dashboard");
    else if (u.role === "Vendor") navigate("/vendor");
    else navigate("/student");
  };

  return (
    <AuthShell title="Sign in" subtitle="Welcome back to Campus Eats">
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label>Email</Label>
          <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@campus.edu" />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label>Password</Label>
            <Link to="/forgot-password" className="text-xs text-primary hover:underline">Forgot password?</Link>
          </div>
          <Input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <Button type="submit" className="w-full">Sign in</Button>
        <p className="text-sm text-center text-muted-foreground">
          New here? <Link to="/signup" className="text-primary hover:underline">Create account</Link>
        </p>
        <p className="text-xs text-center text-muted-foreground pt-2">
          Demo: student@campus.edu / student · vendor@campus.edu / vendor
        </p>
      </form>
    </AuthShell>
  );
}

export function AuthShell({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary/30 to-background p-4">
      <Card className="w-full max-w-md shadow-[var(--shadow-glow)]">
        <CardHeader className="text-center">
          <Link to="/" className="mx-auto mb-4 flex items-center gap-2">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-primary-glow text-primary-foreground font-bold flex items-center justify-center">CE</div>
            <span className="font-bold text-lg">Campus Eats</span>
          </Link>
          <CardTitle className="text-2xl">{title}</CardTitle>
          {subtitle && <CardDescription>{subtitle}</CardDescription>}
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </div>
  );
}