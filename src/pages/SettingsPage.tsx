import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useCampus } from "@/store/campusStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useI18n, type Language } from "@/i18n";

/**
 * Account settings.
 *
 * Only fields the signed-in user is actually allowed to change are editable:
 * the e-mail and the role are immutable for a normal user because the Firebase
 * Realtime Database rules reject those updates without the admin claim.
 */
export default function SettingsPage()
{
  const { currentUserId, users, firebaseUid, updateProfile } = useCampus();
  const { t, lang, setLang } = useI18n();
  const user = users.find((u) => u.id === currentUserId);
  const [name, setName] = useState(user?.name ?? "");
  const [busy, setBusy] = useState(false);

  if (!user)
  {
    return <Navigate to="/login" replace />;
  }

  const save = async (e: React.FormEvent) =>
  {
    e.preventDefault();

    if (!name.trim())
    {
      toast.error(t("settings.saveFailed"));
      return;
    }

    setBusy(true);

    try
    {
      await updateProfile({ name });
      toast.success(t("settings.saved"));
    }
    catch (err)
    {
      const detail = err instanceof Error ? err.message : String(err);
      console.error("[settings] save failed:", err);
      toast.error(`${t("settings.saveFailed")}: ${detail}`);
    }
    finally
    {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">{t("settings.title")}</h1>
        <p className="text-muted-foreground text-sm">{t("settings.subtitle")}</p>
      </div>

      <Card>
        <CardHeader><CardTitle>{t("settings.profile")}</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={save} className="space-y-4">
            <div className="space-y-2">
              <Label>{t("settings.name")}</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} maxLength={80} />
            </div>
            <div className="space-y-2">
              <Label>{t("settings.email")}</Label>
              <Input value={user.email} readOnly disabled />
              <p className="text-xs text-muted-foreground">{t("settings.emailLocked")}</p>
            </div>
            <div className="space-y-2">
              <Label>{t("settings.role")}</Label>
              <Input value={user.role} readOnly disabled />
              <p className="text-xs text-muted-foreground">{t("settings.roleLocked")}</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4 text-xs">
              <div>
                <div className="text-muted-foreground">{t("settings.userId")}</div>
                <div className="font-mono break-all">{user.id}</div>
              </div>
              <div>
                <div className="text-muted-foreground">{t("settings.firebaseUid")}</div>
                <div className="font-mono break-all">{firebaseUid ?? t("settings.notLinked")}</div>
              </div>
            </div>
            <Button type="submit" disabled={busy}>{t("common.save")}</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("settings.preferences")}</CardTitle>
          <CardDescription>{t("common.language")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={lang} onValueChange={(v) => setLang(v as Language)}>
            <SelectTrigger className="w-60"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="en">{t("common.english")}</SelectItem>
              <SelectItem value="af">{t("common.afrikaans")}</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
    </div>
  );
}
