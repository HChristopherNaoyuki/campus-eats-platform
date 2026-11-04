import { useState } from "react";
const PLACEHOLDER_URL = "/placeholder.svg";

/**
 * Food thumbnail used wherever a menu item is shown. Falls back to the
 * project placeholder when an item has no photo or its photo fails to load.
 */
export default function FoodImage({
    src,
    alt,
    className = "",
}: {
    src?: string;
    alt: string;
    className?: string;
})
{
    const [failed, setFailed] = useState(false);

    return (
        <img
            src={failed || !src ? placeholderUrl : src}
            alt={alt}
            loading="lazy"
            width={800}
            height={600}
            onError={() => setFailed(true)}
            className={`object-cover ${className}`}
        />
    );
}
