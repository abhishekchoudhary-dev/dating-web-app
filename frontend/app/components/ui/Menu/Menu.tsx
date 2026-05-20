'use client'

import React from "react";
import { useActiveHref } from "@/app/hooks/useActiveHref";
import { MenuContext } from "./MenuContext";

type MenuProps = React.ComponentProps<'ul'>;

export function Menu({ className, children, ...props }: MenuProps) {
    const { isActive, markPending } = useActiveHref();

    return (
        <MenuContext.Provider value={{ isActive, markPending }}>
            <ul className={["menu", className].filter(Boolean).join(" ")} {...props}>
                {children}
            </ul>
        </MenuContext.Provider>
    );
}