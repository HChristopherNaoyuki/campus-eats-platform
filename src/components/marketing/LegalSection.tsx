import { ReactNode } from "react";

interface LegalSectionProps
{
    title: string;
    children: ReactNode;
    /** Anchor id for the table of contents. */
    id?: string;
}

/** Shared typographic wrapper for legal copy so Privacy and Terms stay visually identical. */
export default function LegalSection({ title, children, id }: LegalSectionProps)
{
    return (
        <section id={id} className="scroll-mt-24 space-y-3">
            <h2 className="text-xl md:text-2xl font-bold">{title}</h2>
            <div className="text-muted-foreground space-y-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1">
                {children}
            </div>
        </section>
    );
}