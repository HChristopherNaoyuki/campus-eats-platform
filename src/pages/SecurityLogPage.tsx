import { Navigate } from "react-router-dom";
import { useCampus } from "@/store/campusStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/i18n";

export default function SecurityLogPage() {
  const { t } = useI18n();
  const { currentUserId, users, logs } = useCampus();
  const user = users.find((u) => u.id === currentUserId);
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "Admin") return <Navigate to="/" replace />;

  const tone = (a: string) =>
    a.includes("FAILED") || a.includes("REJECTED") ? "destructive" : "secondary";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t("adm.security.title")}</h1>
        <p className="text-muted-foreground text-sm">{t("adm.security.subtitle")}</p>
      </div>
      <Card>
        <CardHeader><CardTitle>{t("adm.security.eventsCount").replace("{n}", String(logs.length))}</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("adm.security.time")}</TableHead>
                <TableHead>{t("adm.security.action")}</TableHead>
                <TableHead>{t("adm.security.user")}</TableHead>
                <TableHead>{t("adm.security.detail")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.slice().reverse().map((l) => {
                const u = users.find((x) => x.id === l.userId);
                return (
                  <TableRow key={l.id}>
                    <TableCell className="text-xs whitespace-nowrap">{new Date(l.createdAt).toLocaleString()}</TableCell>
                    <TableCell><Badge variant={tone(l.action)}>{l.action}</Badge></TableCell>
                    <TableCell className="font-mono text-xs">{u?.name ?? l.userId ?? t("adm.security.dash")}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{l.detail ?? ""}</TableCell>
                  </TableRow>
                );
              })}
              {logs.length === 0 && (
                <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-6">{t("adm.security.noEvents")}</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
