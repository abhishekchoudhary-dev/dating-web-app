import { createContext, useContext } from "react";

type MenuContextValue = {
    isActive: (href: string) => boolean;
    markPending: (href: string) => void;
};

export const MenuContext = createContext<MenuContextValue | null>(null);

export function useMenuContext() {
    const ctx = useContext(MenuContext);
    if (!ctx) {
        throw new Error("<MenuItem> must be rendered inside a <Menu>.");
    }
    return ctx;
}