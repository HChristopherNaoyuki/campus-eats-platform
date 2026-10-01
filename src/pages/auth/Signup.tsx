import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useCampus } from "@/store/campusStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { AuthShell } from "./Login";
import type { Role } from "@/types/campus";

type Field = "name" | "username" | "email" | "password" | "confirm" | "shopName";

const baseSchema = z.object(
{
    name: z.string().trim().min(2, "Enter your full name").max(80, "Name is too long"),
    username: z.string().trim()
        .min(3, "Username must be at least 3 characters")
        .max(30, "Username is too long")
        .regex(/^[a-zA-Z0-9._-]+$/, "Use letters, numbers, dots, dashes or underscores only"),
    email: z.string().trim().email("Enter a valid email address").max(120, "Email is too long"),
    password: z.string().min(8, "Password must be at least 8 characters").max(64, "Password is too long"),
    confirm: z.string(),
    shopName: z.string().trim().max(60, "Shop name is too long"),
});

const ROLE_HOME: Record<Role, string> = { Student: "/student", Standard: "/student", Vendor: "/vendor", Admin: "/dashboard" };

export default function Signup()
{
    const { registerUser, users, login } = useCampus();
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: "", username: "", email: "", password: "", confirm: "", shopName: "" });
    const [role, setRole] = useState<Role>("Student");
    const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
    const [submitting, setSubmitting] = useState(false);
    const [created, setCreated] = useState<{ id: string; role: Role } | null>(null);

    const set = (k: Field) => (e: React.ChangeEvent<HTMLInputElement>) =>
    {
        setForm((f) => ({ ...f, [k]: e.target.value }));
        setErrors((er) => ({ ...er, [k]: undefined }));
    };

    const validate = (): boolean =>
    {
        const next: Partial<Record<Field, string>> = {};
        const parsed = baseSchema.safeParse(form);
        if (!parsed.success)
        {
            for (const issue of parsed.error.issues)
            {
                const k = issue.path[0] as Field;
                if (!next[k]) next[k] = issue.message;
            }
        }
        if (form.confirm !== form.password) next.confirm = "Passwords do not match";
        if (!form.confirm) next.confirm = "Confirm your password";
        if (role === "Vendor" && form.shopName.trim().length < 2) next.shopName = "Enter your shop name";
        const email = form.email.trim().toLowerCase();
        const uname = form.username.trim().toLowerCase();
        if (!next.email && users.some((u) => u.email.toLowerCase() === email)) next.email = "Email already registered";
        if (!next.username && users.some((u) => (u.username ?? "").toLowerCase() === uname)) next.username = "Username already taken";
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const onSubmit = async (e: React.FormEvent) =>
    {
        e.preventDefault();
        if (submitting || !validate()) return;
        const safeRole: Role = (["Student", "Standard", "Vendor"] as Role[]).includes(role) ? role : "Student";
        setSubmitting(true);
        try
        {
            const user = await registerUser(
            {
                name: form.name.trim(),
                username: form.username.trim(),
                email: form.email.trim(),
                password: form.password,
                role: safeRole,
                ...(safeRole === "Vendor" ? { shopName: form.shopName.trim() } : {}),
            });
            setCreated({ id: user.id, role: safeRole });
            toast.success("Account created. Save your User ID.");
        }
        catch (err)
        {
            toast.error(err instanceof Error ? err.message : "Registration failed");
        }
        finally
        {
            setSubmitting(false);
        }
    };

    if (created)
    {
        return (
            <AuthShell title="Save your User ID" subtitle="This 16-character ID is your account recovery key">
                <div className="space-y-4">
                    <div className="rounded-xl border-2 border-dashed border-primary/60 bg-primary/5 p-4 text-center">
                        <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Your User ID</div>
                        <div className="font-mono text-lg font-bold tracking-wider break-all">{created.id}</div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Store this somewhere safe. You can sign in with it, your username or your email.
                    </p>
                    <Button className="w-full h-11" onClick={async () =>
                    {
                        await login(form.email.trim(), form.password);
                        navigate(ROLE_HOME[created.role]);
                    }}>Continue</Button>
                </div>
            </AuthShell>
        );
    }

    const field = (k: Field, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
        <div className="space-y-1.5">
            <Label htmlFor={k}>{label}</Label>
            <Input
                id={k}
                value={form[k]}
                onChange={set(k)}
                aria-invalid={!!errors[k]}
                className={`h-11 ${errors[k] ? "border-destructive focus-visible:ring-destructive" : ""}`}
                {...props}
            />
            {errors[k] && <p className="text-xs text-destructive">{errors[k]}</p>}
        </div>
    );

    return (
        <AuthShell title="Create account" subtitle="Join the campus pickup network">
            <form onSubmit={onSubmit} noValidate className="space-y-4">
                <div className="space-y-1.5">
                    <Label>Account type</Label>
                    <Select value={role} onValueChange={(v) => { setRole(v as Role); setErrors((er) => ({ ...er, shopName: undefined })); }}>
                        <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Student">Student</SelectItem>
                            <SelectItem value="Standard">Standard</SelectItem>
                            <SelectItem value="Vendor">Vendor</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                {role === "Vendor" && field("shopName", "Shop name", { maxLength: 60, placeholder: "e.g. Campus Corner Kitchen" })}
                {field("name", "Full name", { maxLength: 80, autoComplete: "name" })}
                <div className="grid gap-4 sm:grid-cols-2">
                    {field("username", "Username", { maxLength: 30, autoComplete: "username" })}
                    {field("email", "Email", { type: "email", maxLength: 120, autoComplete: "email" })}
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                    {field("password", "Password", { type: "password", maxLength: 64, autoComplete: "new-password" })}
                    {field("confirm", "Confirm password", { type: "password", maxLength: 64, autoComplete: "new-password" })}
                </div>
                <Button type="submit" className="w-full h-11" disabled={submitting}>
                    {submitting ? "Creating account..." : "Create account"}
                </Button>
                <p className="text-sm text-center text-muted-foreground">
                    Already have an account? <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
                </p>
            </form>
        </AuthShell>
    );
}
