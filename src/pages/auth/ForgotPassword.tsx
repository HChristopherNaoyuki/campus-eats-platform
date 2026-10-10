import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCampus } from "@/store/campusStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { AuthShell } from "./Login";
import { useI18n } from "@/i18n";

export default function ForgotPassword() {
  const { resetPassword } = useCampus();
  const { t } = useI18n();
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 4) return toast.error(t("authx.errPasswordMin4"));
    if (password !== confirm) return toast.error(t("authx.errPasswordsMismatch"));
    const ok = await resetPassword(identifier.trim(), password).catch(() => false);
    if (!ok) return toast.error(t("authx.errNoAccount"));
    toast.success(t("authx.toastRecovered"));
    navigate("/login");
  };

  return (
    <AuthShell title={t("authx.recoverAccountTitle")} subtitle={t("authx.recoverAccountSubtitle")}>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label>{t("authx.userIdOrEmail")}</Label>
          <Input required value={identifier} onChange={(e) => setIdentifier(e.target.value)} placeholder={t("authx.userIdPlaceholder")} />
        </div>
        <div className="space-y-2">
          <Label>{t("authx.newPassword")}</Label>
          <Input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>{t("authx.confirmNewPassword")}</Label>
          <Input type="password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        </div>
        <Button type="submit" className="w-full">{t("authx.resetPassword")}</Button>
        <p className="text-sm text-center text-muted-foreground">
          {t("authx.rememberedIt")} <Link to="/login" className="text-primary hover:underline">{t("authx.signInLink")}</Link>
        </p>
      </form>
    </AuthShell>
  );
}
