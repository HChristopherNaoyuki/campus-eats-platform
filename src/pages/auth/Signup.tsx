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
import { useI18n } from "@/i18n";

type Field = "name" | "username" | "email" | "password" | "confirm" | "shopName";

const ROLE_HOME: Record<Role, string> = { Student: "/student", Standard: "/student", Vendor: "/vendor", Admin: "/dashboard" };

export default function Signup()
{
    const { registerUser, users, login } = useCampus();
    const { t } = useI18n();
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: "", username: "", email: "", password: "", confirm: "", shopName: "" });
    const [role, setRole] = useState<Role>("Student");
    const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
    const [submitting, setSubmitting] = useState(false);
    const [created, setCreated] = useState<{ id: string; role: Role } | null>(null);

    const baseSchema = z.object(
    {
        name: z.string().trim().min(2, t("authx.errEnterFullName")).max(80, t("authx.errNameTooLong")),
        username: z.string().trim()
            .min(3, t("authx.errUsernameMin"))
            .max(30, t("authx.errUsernameTooLong"))
            .regex(/^[a-zA-Z0-9._-]+$/, t("authx.errUsernameChars")),
        email: z.string().trim().email(t("authx.errEmailInvalid")).max(120, t("authx.errEmailTooLong")),
        password: z.string().min(8, t("authx.errPasswordMin")).max(64, t("authx.errPasswordTooLong")),
        confirm: z.string(),
        shopName: z.string().trim().max(60, t("authx.errShopNameTooLong")),
    });

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
        if (form.confirm !== form.password) next.confirm = t("authx.errPasswordsMismatch");
        if (!form.confirm) next.confirm = t("authx.errConfirmPassword");
        if (role === "Vendor" && form.shopName.trim().length < 2) next.shopName = t("authx.errShopNameRequired");
        const email = form.email.trim().toLowerCase();
        const uname = form.username.trim().toLowerCase();
        if (!next.email && users.some((u) => u.email.toLowerCase() === email)) next.email = t("authx.errEmailTaken");
        if (!next.username && users.some((u) => (u.username ?? "").toLowerCase() === uname)) next.username = t("authx.errUsernameTaken");
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
            toast.success(t("authx.toastAccountCreated"));
        }
        catch (err)
        {
            toast.error(err instanceof Error ? err.message : t("authx.toastRegistrationFailed"));
        }
        finally
        {
            setSubmitting(false);
        }
    };

    if (created)
    {
        return (
            <AuthShell title={t("authx.saveUserIdTitle")} subtitle={t("authx.saveUserIdSubtitle")}>
                <div className="space-y-4">
                    <div className="rounded-xl border-2 border-dashed border-primary/60 bg-primary/5 p-4 text-center">
                        <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">{t("authx.yourUserId")}</div>
                        <div className="font-mono text-lg font-bold tracking-wider break-all">{created.id}</div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        {t("authx.storeIdHint")}
                    </p>
                    <Button className="w-full h-11" onClick={async () =>
                    {
                        await login(form.email.trim(), form.password);
                        navigate(ROLE_HOME[created.role]);
                    }}>{t("authx.continue")}</Button>
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
        <AuthShell title={t("authx.createAccountTitle")} subtitle={t("authx.createAccountSubtitle")}>
            <form onSubmit={onSubmit} noValidate className="space-y-4">
                <div className="space-y-1.5">
                    <Label>{t("authx.accountType")}</Label>
                    <Select value={role} onValueChange={(v) => { setRole(v as Role); setErrors((er) => ({ ...er, shopName: undefined })); }}>
                        <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Student">{t("authx.student")}</SelectItem>
                            <SelectItem value="Standard">{t("authx.standard")}</SelectItem>
                            <SelectItem value="Vendor">{t("authx.vendor")}</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                {role === "Vendor" && field("shopName", t("authx.shopName"), { maxLength: 60, placeholder: t("authx.shopNamePlaceholder") })}
                {field("name", t("authx.fullName"), { maxLength: 80, autoComplete: "name" })}
                <div className="grid gap-4 sm:grid-cols-2">
                    {field("username", t("authx.username"), { maxLength: 30, autoComplete: "username" })}
                    {field("email", t("authx.email"), { type: "email", maxLength: 120, autoComplete: "email" })}
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                    {field("password", t("authx.password"), { type: "password", maxLength: 64, autoComplete: "new-password" })}
                    {field("confirm", t("authx.confirmPassword"), { type: "password", maxLength: 64, autoComplete: "new-password" })}
                </div>
                <Button type="submit" className="w-full h-11" disabled={submitting}>
                    {submitting ? t("authx.creatingAccount") : t("authx.createAccount")}
                </Button>
                <p className="text-sm text-center text-muted-foreground">
                    {t("authx.alreadyHaveAccount")} <Link to="/login" className="text-primary font-medium hover:underline">{t("authx.signInLink")}</Link>
                </p>
            </form>
        </AuthShell>
    );
}
