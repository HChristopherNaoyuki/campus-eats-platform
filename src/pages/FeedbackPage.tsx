import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useCampus } from "@/store/campusStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function FeedbackPage() {
  const { currentUserId, users, feedback, addFeedback } = useCampus();
  const user = users.find((u) => u.id === currentUserId);
  const [type, setType] = useState<"Compliment" | "Complaint">("Compliment");
  const [message, setMessage] = useState("");

  if (!user) return <Navigate to="/login" replace />;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return toast.error("Write a short message");
    addFeedback({ userId: user.id, type, message: message.trim() });
    setMessage("");
    toast.success("Thanks for the feedback!");
  };

  const mine = feedback.filter((f) => f.userId === user.id).slice().reverse();

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader><CardTitle>Submit feedback</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-3">
            <div>
              <Label>Type</Label>
              <Select value={type} onValueChange={(v) => setType(v as "Compliment" | "Complaint")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Compliment">Compliment</SelectItem>
                  <SelectItem value="Complaint">Complaint</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Message</Label>
              <Textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={5} maxLength={500} />
            </div>
            <Button type="submit" className="w-full">Send</Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>My feedback</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {mine.length === 0 ? (
            <p className="text-sm text-muted-foreground">No feedback submitted yet.</p>
          ) : mine.map((f) => (
            <div key={f.id} className="p-3 rounded border">
              <div className="flex justify-between items-center mb-1">
                <Badge variant={f.type === "Complaint" ? "destructive" : "secondary"}>{f.type}</Badge>
                <span className="text-xs text-muted-foreground">{new Date(f.createdAt).toLocaleString()}</span>
              </div>
              <p className="text-sm">{f.message}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}