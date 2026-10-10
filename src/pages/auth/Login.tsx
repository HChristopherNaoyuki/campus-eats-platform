import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCampus } from "@/store/campusStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { useI18n } from "@/i18n";

export default function Login() {
  const { login, loginWithGoogle } = useCampus();
  const { t } = useI18n();
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);

  const routeFor = (role: string) =>
    role === "Admin" ? "/dashboard" : role === "Vendor" ? "/vendor" : "/student";

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const u = await login(identifier.trim(), password).catch(() => null);
    setBusy(false);
    if (!u) return toast.error(t("authx.invalidCredentials"));
    toast.success(t("authx.welcomeBack").replace("{name}", u.name));
    navigate(routeFor(u.role));
  };

  // Google single sign-on through Firebase Authentication.
  const onGoogle = async () => {
    setGoogleBusy(true);
    const u = await loginWithGoogle().catch(() => null);
    setGoogleBusy(false);
    if (!u) {
      const detail = useCampus.getState().firebaseError;
      return toast.error(detail ?? t("authx.googleSignInFailed"));
    }
    toast.success(t("authx.welcome").replace("{name}", u.name));
    navigate(routeFor(u.role));
  };

  return (
    <AuthShell title={t("authx.signInTitle")} subtitle={t("authx.signInSubtitle")}>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label>{t("authx.userIdOrEmail")}</Label>
          <Input required value={identifier} onChange={(e) => setIdentifier(e.target.value)} placeholder={t("authx.userIdPlaceholder")} />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label>{t("authx.password")}</Label>
            <Link to="/forgot-password" className="text-xs text-primary hover:underline">{t("authx.recoverAccount")}</Link>
          </div>
          <Input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <Button type="submit" className="w-full" disabled={busy}>{busy ? t("authx.signingIn") : t("authx.signIn")}</Button>
        <div className="relative py-1 text-center">
          <span className="bg-card px-2 text-xs text-muted-foreground relative z-10">{t("authx.or")}</span>
          <div className="absolute inset-x-0 top-1/2 border-t" />
        </div>
        <Button
          type="button"
          variant="outline"
          className="w-full"
          disabled={googleBusy}
          onClick={onGoogle}
        >
          <i className="fa-brands fa-google mr-2" aria-hidden="true" />
          {googleBusy ? t("authx.signingIn") : t("authx.continueWithGoogle")}
        </Button>
        <p className="text-sm text-center text-muted-foreground">
          {t("authx.newHere")} <Link to="/signup" className="text-primary hover:underline">{t("authx.createAccount")}</Link>
        </p>
        <div className="pt-4">
          <div className="rounded-lg border bg-muted/40 p-3">
            <p className="text-xs font-semibold text-center mb-2">{t("authx.demoAccountsTitle")}</p>
            <div className="grid grid-cols-[1fr_auto] gap-x-3 gap-y-1 text-xs font-mono">
              <span>amara.nkosi@campuseats.test</span><span className="text-muted-foreground">Adm1n#Amara</span>
              <span>pieter.vanwyk@campuseats.test</span><span className="text-muted-foreground">Adm1n#Pieter</span>
              <span>thandiwe.mokoena@campuseats.test</span><span className="text-muted-foreground">Vend0r#Thandi</span>
              <span>sipho.dlamini@campuseats.test</span><span className="text-muted-foreground">Vend0r#Sipho</span>
              <span>annelie.botha@campuseats.test</span><span className="text-muted-foreground">Vend0r#Annelie</span>
              <span>lerato.khumalo@campuseats.test</span><span className="text-muted-foreground">Stand@rd#Lerato</span>
              <span>johan.pretorius@campuseats.test</span><span className="text-muted-foreground">Stand@rd#Johan</span>
              <span>zanele.ndlovu@campuseats.test</span><span className="text-muted-foreground">Stand@rd#Zanele</span>
              <span>marius.steyn@campuseats.test</span><span className="text-muted-foreground">Stand@rd#Marius</span>
              <span>naledi.mahlangu@campuseats.test</span><span className="text-muted-foreground">Stud3nt#Naledi</span>
            </div>
            <p className="mt-2 text-[11px] text-center text-muted-foreground">
              {t("authx.demoAccountsHint")}
            </p>
          </div>
        </div>

      </form>
    </AuthShell>
  );
}

export function AuthShell({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary/30 to-background px-4 py-10">
      <Card className="w-full max-w-md rounded-2xl border-border/60 shadow-[var(--shadow-glow)]">
        <CardHeader className="text-center space-y-1 pb-4">
          <Link to="/" className="mx-auto mb-3 flex items-center gap-2">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-primary-glow text-primary-foreground font-bold flex items-center justify-center">CE</div>
            <span className="font-bold text-lg">Campus Eats</span>
          </Link>
          <CardTitle className="text-2xl font-semibold tracking-tight">{title}</CardTitle>
          {subtitle && <CardDescription>{subtitle}</CardDescription>}
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </div>
  );
}
