'use client'

import Link from "next/link";
import React, { ReactNode, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

type link = {
    href: string,
    title: string,
    icon?: ReactNode
}

type NavLinksProps = {
    links: link[]
}

export default function NavLinks({ links }: NavLinksProps) {
    const pathname = usePathname();
    const [pendingHref, setPendingHref] = useState<string | null>(null);

    useEffect(() => {
        if (pendingHref === pathname) {
            setPendingHref(null);
        }
    }, [pathname, pendingHref]);

    const activeHref = pendingHref ?? pathname;
    const isActive = (href: string) => href === activeHref;

    return (
        <ul className="menu menu-horizontal gap-2">
            {links.map((link) => (
                <li key={link.title}>
                    <Link href={link.href}
                          className={isActive(link.href) ? "menu-active" : ""}
                          onClick={() => setPendingHref(link.href)}
                    >
                        {link?.icon} {link.title}
                    </Link>
                </li>
            ))}
        </ul>
    );
}