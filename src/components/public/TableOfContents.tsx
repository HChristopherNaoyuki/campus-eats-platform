import { useEffect, useState } from "react";
import { useI18n } from "@/i18n";

export interface TocSection
{
    id: string;
    label: string;
}

/**
 * Table of contents with scroll-spy highlighting for long reference pages.
 * Sticks beside the content on large screens.
 */
export default function TableOfContents({ sections }: { sections: TocSection[] })
{
    const { t } = useI18n();
    const [activeId, setActiveId] = useState<string>(sections[0]?.id ?? "");

    useEffect(() =>
    {
        const observer = new IntersectionObserver(
            (entries) =>
            {
                const visible = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
                if (visible[0]) setActiveId(visible[0].target.id);
            },
            { rootMargin: "-80px 0px -60% 0px", threshold: 0 }
        );

        for (const section of sections)
        {
            const element = document.getElementById(section.id);
            if (element) observer.observe(element);
        }

        return () => observer.disconnect();
    }, [sections]);

    return (
        <nav aria-label={t("mkt.polish.contents")} className="ce-toc">
            <h2 className="ce-toc-title">{t("mkt.polish.contents")}</h2>
            <ul>
                {sections.map((section) => (
                    <li key={section.id}>
                        <a
                            href={`#${section.id}`}
                            className={section.id === activeId ? "active" : ""}
                            aria-current={section.id === activeId ? "location" : undefined}
                        >
                            {section.label}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
