import { ReactNode } from "react";

interface LegalSectionProps
{
    title: string;
    children: ReactNode;
}

/** Shared typographic wrapper for legal copy so Privacy and Terms stay visually identical. */
export default function LegalSection({ title, children }: LegalSectionProps)
{
    return (
        <section className="space-y-3">
            <h2 className="text-xl md:text-2xl font-bold">{title}</h2>
            <div className="text-muted-foreground space-y-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1">
                {children}
            </div>
        </section>
    );
}