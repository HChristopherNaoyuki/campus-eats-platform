import { useEffect, useState } from "react";

/**
 * Reading progress bar fixed to the top of the viewport. Tracks how far the
 * reader has scrolled through the page content.
 */
export default function ReadingProgress()
{
    const [progress, setProgress] = useState(0);

    useEffect(() =>
    {
        const update = () =>
        {
            const doc = document.documentElement;
            const scrollable = doc.scrollHeight - window.innerHeight;
            setProgress(scrollable > 0 ? Math.min(100, (window.scrollY / scrollable) * 100) : 0);
        };

        update();
        window.addEventListener("scroll", update, { passive: true });
        window.addEventListener("resize", update);

        return () =>
        {
            window.removeEventListener("scroll", update);
            window.removeEventListener("resize", update);
        };
    }, []);

    return (
        <div
            className="ce-reading-progress"
            role="progressbar"
            aria-label="Reading progress"
            aria-valuenow={Math.round(progress)}
            aria-valuemin={0}
            aria-valuemax={100}
            style={{ width: `${progress}%` }}
        />
    );
}
