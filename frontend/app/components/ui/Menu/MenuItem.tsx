// MenuItem.tsx
'use client'

import React from "react";
import Link from "next/link";
import { useMenuContext } from "./MenuContext";

type MenuItemProps = React.ComponentProps<typeof Link> & {
    icon?: React.ReactNode;
    title: string;
};

export function MenuItem({ icon, title, href, className, onClick, ...rest }: MenuItemProps) {
    const { isActive, markPending } = useMenuContext();
    const hrefString = typeof href === "string" ? href : href.pathname ?? "";
    const active = isActive(hrefString);

    return (
        <li>
            <Link
                href={href}
                className={[active && "menu-active", className].filter(Boolean).join(" ") || undefined}
                onClick={(e) => {
                    markPending(hrefString);
                    onClick?.(e);
                }}
                {...rest}
            >
                {icon} {title}
            </Link>
        </li>
    );
}