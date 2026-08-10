import { ReactNode } from "react";

interface PageHeroProps
{
    eyebrow?: string;
    title: string;
    description?: string;
    children?: ReactNode;
}

/** Consistent page header used by every secondary marketing page. */
export default function PageHero({ eyebrow, title, description, children }: PageHeroProps)
{
    return (
        <section className="border-b bg-secondary/40">
            <div className="container mx-auto px-4 py-12 md:py-16 max-w-3xl">
                {eyebrow && (
                    <span className="inline-block text-xs font-semibold tracking-wider uppercase text-primary bg-primary/10 px-3 py-1 rounded-full">
                        {eyebrow}
                    </span>
                )}
                <h1 className="mt-4 text-3xl md:text-5xl font-extrabold tracking-tight">{title}</h1>
                {description && <p className="mt-4 text-lg text-muted-foreground">{description}</p>}
                {children && <div className="mt-6">{children}</div>}
            </div>
        </section>
    );
}