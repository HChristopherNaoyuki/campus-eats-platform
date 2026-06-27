import { Navigate } from "react-router-dom";
import { useCampus } from "@/store/campusStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function SecurityLogPage() {
  const { currentUserId, users, logs } = useCampus();
  const user = users.find((u) => u.id === currentUserId);
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "Admin") return <Navigate to="/" replace />;

  const tone = (a: string) =>
    a.includes("FAILED") || a.includes("REJECTED") ? "destructive" : "secondary";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Security Log</h1>
        <p className="text-muted-foreground text-sm">All authentication, account, and order events.</p>
      </div>
      <Card>
        <CardHeader><CardTitle>{logs.length} event(s)</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Detail</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.slice().reverse().map((l) => {
                const u = users.find((x) => x.id === l.userId);
                return (
                  <TableRow key={l.id}>
                    <TableCell className="text-xs whitespace-nowrap">{new Date(l.createdAt).toLocaleString()}</TableCell>
                    <TableCell><Badge variant={tone(l.action)}>{l.action}</Badge></TableCell>
                    <TableCell className="font-mono text-xs">{u?.name ?? l.userId ?? "—"}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{l.detail ?? ""}</TableCell>
                  </TableRow>
                );
              })}
              {logs.length === 0 && (
                <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-6">No events yet.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}