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
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const u = await login(identifier.trim(), password).catch(() => null);
    setBusy(false);
    if (!u) return toast.error("Invalid credentials");
    toast.success(`Welcome back, ${u.name}`);
    if (u.role === "Admin") navigate("/dashboard");
    else if (u.role === "Vendor") navigate("/vendor");
    else navigate("/student");
  };

  return (
    <AuthShell title="Sign in" subtitle="Welcome back to Campus Eats">
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label>User ID or Email</Label>
          <Input required value={identifier} onChange={(e) => setIdentifier(e.target.value)} placeholder="16-char User ID or you@campus.edu" />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label>Password</Label>
            <Link to="/forgot-password" className="text-xs text-primary hover:underline">Recover account</Link>
          </div>
          <Input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <Button type="submit" className="w-full" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</Button>
        <p className="text-sm text-center text-muted-foreground">
          New here? <Link to="/signup" className="text-primary hover:underline">Create account</Link>
        </p>
        <div className="pt-4">
          <div className="rounded-lg border bg-muted/40 p-3">
            <p className="text-xs font-semibold text-center mb-2">Demo accounts (all 8 work)</p>
            <div className="grid grid-cols-[1fr_auto] gap-x-3 gap-y-1 text-xs font-mono">
              <span>student01@campus.edu</span><span className="text-muted-foreground">student</span>
              <span>student02@campus.edu</span><span className="text-muted-foreground">student</span>
              <span>standard01@campus.edu</span><span className="text-muted-foreground">standard</span>
              <span>standard02@campus.edu</span><span className="text-muted-foreground">standard</span>
              <span>vendor01@campus.edu</span><span className="text-muted-foreground">vendor</span>
              <span>vendor02@campus.edu</span><span className="text-muted-foreground">vendor</span>
              <span>admin01@campus.edu</span><span className="text-muted-foreground">admin</span>
              <span>admin02@campus.edu</span><span className="text-muted-foreground">admin</span>
            </div>
          </div>
        </div>
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