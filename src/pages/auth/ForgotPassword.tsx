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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 4) return toast.error("Password must be at least 4 characters");
    if (password !== confirm) return toast.error("Passwords do not match");
    const ok = resetPassword(email.trim(), password);
    if (!ok) return toast.error("No account with that email");
    toast.success("Password reset. Please sign in.");
    navigate("/login");
  };

  return (
    <AuthShell title="Reset password" subtitle="Enter your email and a new password">
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label>Email</Label>
          <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
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