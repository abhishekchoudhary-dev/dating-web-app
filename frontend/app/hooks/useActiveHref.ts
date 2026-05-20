import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

// Stops active links flickering on click.
export function useActiveHref() {
    const pathname = usePathname();
    const [pendingHref, setPendingHref] = useState<string | null>(null);

    useEffect(() => {
        if (pendingHref === pathname) setPendingHref(null);
    }, [pathname, pendingHref]);

    const activeHref = pendingHref ?? pathname;
    return {
        activeHref,
        isActive: (href: string) => href === activeHref,
        markPending: setPendingHref,
    };
}