import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCampus } from "@/store/campusStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { AuthShell } from "./Login";

export default function ForgotPassword() {
  const { resetPassword } = useCampus();
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 4) return toast.error("Password must be at least 4 characters");
    if (password !== confirm) return toast.error("Passwords do not match");
    const ok = resetPassword(identifier.trim(), password);
    if (!ok) return toast.error("No account with that User ID or email");
    toast.success("Account recovered. Please sign in.");
    navigate("/login");
  };

  return (
    <AuthShell title="Recover account" subtitle="Use your 16-character User ID (or email) to set a new password">
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label>User ID or Email</Label>
          <Input required value={identifier} onChange={(e) => setIdentifier(e.target.value)} placeholder="16-char User ID or you@campus.edu" />
        </div>
        <div className="space-y-2">
          <Label>New password</Label>
          <Input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Confirm new password</Label>
          <Input type="password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        </div>
        <Button type="submit" className="w-full">Reset password</Button>
        <p className="text-sm text-center text-muted-foreground">
          Remembered it? <Link to="/login" className="text-primary hover:underline">Sign in</Link>
        </p>
      </form>
    </AuthShell>
  );
}