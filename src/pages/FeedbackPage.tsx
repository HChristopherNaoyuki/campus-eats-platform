import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useCampus } from "@/store/campusStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { createFeedback } from "@/lib/firebaseFeedback";
import { useI18n } from "@/i18n";

/**
 * Feedback module.
 *
 * Records are written to two places:
 *  1. the local store, which keeps the existing offline behaviour intact, and
 *  2. the Firebase Realtime Database `feedback/` path, which is the shared
 *     source of truth and is guarded by the database security rules.
 *
 * A Firebase failure is reported to the user; it is never presented as a
 * successful cloud write.
 */
export default function FeedbackPage()
{
  const { currentUserId, users, feedback, addFeedback, firebaseUid } = useCampus();
  const { t } = useI18n();
  const user = users.find((u) => u.id === currentUserId);
  const [type, setType] = useState<"Compliment" | "Complaint">("Compliment");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  if (!user)
  {
    return <Navigate to="/login" replace />;
  }

  const submit = async (e: React.FormEvent) =>
  {
    e.preventDefault();

    const trimmedSubject = subject.trim();
    const trimmedMessage = message.trim();

    if (!trimmedSubject)
    {
      toast.error(t("feedback.needSubject"));
      return;
    }

    if (!trimmedMessage)
    {
      toast.error(t("feedback.needMessage"));
      return;
    }

    setBusy(true);

    let firebaseId: string | undefined;

    // The rules require an authenticated Firebase user; skip the remote write
    // (and say so) when this session has no Firebase identity.
    if (firebaseUid)
    {
      try
      {
        firebaseId = await createFeedback({
          type: type === "Complaint" ? "complaint" : "compliment",
          subject: trimmedSubject,
          message: trimmedMessage,
          userName: user.name,
          userEmail: user.email,
        });
      }
      catch (err)
      {
        const detail = err instanceof Error ? err.message : String(err);
        console.error("[firebase] feedback write failed:", err);
        toast.error(`${t("feedback.cloudFailed")} ${detail}`);
      }
    }
    else
    {
      toast.error(`${t("feedback.cloudFailed")} not signed in to Firebase`);
    }

    addFeedback({
      userId: user.id,
      type,
      subject: trimmedSubject,
      message: trimmedMessage,
      firebaseId,
    });

    setSubject("");
    setMessage("");
    setBusy(false);

    if (firebaseId)
    {
      toast.success(t("feedback.thanks"));
    }
  };

  const mine = feedback.filter((f) => f.userId === user.id).slice().reverse();

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader><CardTitle>{t("feedback.title")}</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-3">
            <div>
              <Label>{t("feedback.type")}</Label>
              <Select value={type} onValueChange={(v) => setType(v as "Compliment" | "Complaint")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Compliment">{t("feedback.compliment")}</SelectItem>
                  <SelectItem value="Complaint">{t("feedback.complaint")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>{t("feedback.subject")}</Label>
              <Input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                maxLength={120}
              />
            </div>
            <div>
              <Label>{t("feedback.message")}</Label>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                maxLength={500}
              />
            </div>
            <Button type="submit" className="w-full" disabled={busy}>
              {busy ? t("feedback.sending") : t("feedback.send")}
            </Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>{t("feedback.mine")}</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {mine.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t("feedback.empty")}</p>
          ) : mine.map((f) => (
            <div key={f.id} className="p-3 rounded border">
              <div className="flex justify-between items-center mb-1">
                <Badge variant={f.type === "Complaint" ? "destructive" : "secondary"}>
                  {f.type === "Complaint" ? t("feedback.complaint") : t("feedback.compliment")}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {new Date(f.createdAt).toLocaleString()}
                </span>
              </div>
              {f.subject && <p className="text-sm font-medium">{f.subject}</p>}
              <p className="text-sm">{f.message}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
