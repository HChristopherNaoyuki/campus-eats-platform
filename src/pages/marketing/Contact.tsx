import { FormEvent, useState } from "react";
import PageHero from "@/components/marketing/PageHero";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Mail, MapPin, Clock, Loader2 } from "lucide-react";
import { useI18n } from "@/i18n";

interface ContactErrors
{
    name?: string;
    email?: string;
    message?: string;
}

const businessHours =
[
    { dayKey: "mkt.contact.hoursWeekday", hoursKey: "mkt.contact.hoursWeekdayTime" },
    { dayKey: "mkt.contact.hoursSaturday", hoursKey: "mkt.contact.hoursSaturdayTime" },
    { dayKey: "mkt.contact.hoursSunday", hoursKey: "mkt.contact.hoursSundayTime" },
];

export default function Contact()
{
    const { t } = useI18n();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [errors, setErrors] = useState<ContactErrors>({});
    const [submitting, setSubmitting] = useState(false);
    const [sent, setSent] = useState(false);

    /** Client-side validation. There is no mail backend yet, so the form confirms locally. */
    const validate = (): ContactErrors =>
    {
        const next: ContactErrors = {};

        if (!name.trim())
        {
            next.name = t("mkt.contact.errorName");
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
        {
            next.email = t("mkt.contact.errorEmail");
        }

        if (message.trim().length < 10)
        {
            next.message = t("mkt.contact.errorMessage");
        }

        return next;
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) =>
    {
        event.preventDefault();
        const found = validate();
        setErrors(found);

        if (Object.keys(found).length > 0)
        {
            return;
        }

        setSubmitting(true);
        await new Promise((resolve) => window.setTimeout(resolve, 600));
        setSubmitting(false);
        setSent(true);
        setName("");
        setEmail("");
        setMessage("");
        toast({ title: t("mkt.contact.toastReceivedTitle"), description: t("mkt.contact.toastReceivedDesc") });
    };

    return (
        <>
            <PageHero
                eyebrow={t("mkt.contact.eyebrow")}
                title={t("mkt.contact.title")}
                description={t("mkt.contact.description")}
            />

            <section className="container mx-auto px-4 py-16 grid gap-8 lg:grid-cols-[1fr_1.2fr]">
                <div className="space-y-5">
                    <Card className="shadow-[var(--shadow-soft)]">
                        <CardContent className="p-6 space-y-4">
                            <div className="flex gap-3">
                                <Mail className="h-5 w-5 text-primary shrink-0" aria-hidden="true" />
                                <div>
                                    <h2 className="font-semibold">{t("mkt.contact.emailTitle")}</h2>
                                    <a href="mailto:support@campuseats.co.za" className="text-sm text-muted-foreground hover:text-foreground">
                                        support@campuseats.co.za
                                    </a>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <MapPin className="h-5 w-5 text-primary shrink-0" aria-hidden="true" />
                                <div>
                                    <h2 className="font-semibold">{t("mkt.contact.addressTitle")}</h2>
                                    <address className="not-italic text-sm text-muted-foreground">
                                        {t("mkt.contact.addressLine1")}<br />
                                        {t("mkt.contact.addressLine2")}<br />
                                        {t("mkt.contact.addressLine3")}
                                    </address>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <Clock className="h-5 w-5 text-primary shrink-0" aria-hidden="true" />
                                <div>
                                    <h2 className="font-semibold">{t("mkt.contact.hoursTitle")}</h2>
                                    <ul className="text-sm text-muted-foreground space-y-1 mt-1">
                                        {businessHours.map((h) => (
                                            <li key={h.dayKey} className="flex justify-between gap-6">
                                                <span>{t(h.dayKey)}</span>
                                                <span>{t(h.hoursKey)}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card className="shadow-[var(--shadow-soft)]">
                    <CardContent className="p-6">
                        <h2 className="text-xl font-semibold mb-4">{t("mkt.contact.sendMessageTitle")}</h2>

                        {sent && (
                            <div
                                role="status"
                                className="mb-4 rounded-lg border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-foreground"
                            >
                                {t("mkt.contact.sentNotice")}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} noValidate className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="contact-name">{t("mkt.contact.fullName")}</Label>
                                <Input
                                    id="contact-name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    aria-invalid={Boolean(errors.name)}
                                    aria-describedby={errors.name ? "contact-name-error" : undefined}
                                />
                                {errors.name && (
                                    <p id="contact-name-error" className="text-sm text-destructive">{errors.name}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="contact-email">{t("mkt.contact.emailAddress")}</Label>
                                <Input
                                    id="contact-email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    aria-invalid={Boolean(errors.email)}
                                    aria-describedby={errors.email ? "contact-email-error" : undefined}
                                />
                                {errors.email && (
                                    <p id="contact-email-error" className="text-sm text-destructive">{errors.email}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="contact-message">{t("mkt.contact.message")}</Label>
                                <Textarea
                                    id="contact-message"
                                    rows={6}
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    aria-invalid={Boolean(errors.message)}
                                    aria-describedby={errors.message ? "contact-message-error" : undefined}
                                />
                                {errors.message && (
                                    <p id="contact-message-error" className="text-sm text-destructive">{errors.message}</p>
                                )}
                            </div>

                            <Button type="submit" className="w-full" disabled={submitting}>
                                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                                {submitting ? t("mkt.contact.sending") : t("mkt.contact.sendMessage")}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </section>
        </>
    );
}
