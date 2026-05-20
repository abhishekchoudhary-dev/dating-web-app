import React from "react";
import Navbar from "@/app/components/Navbar";
import { Menu, MenuItem } from "@/app/components/ui/Menu";

export default function GuestLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <>
            <Navbar end={
                <Menu className="menu-horizontal gap-2">
                    <MenuItem href="/login" title="Log in" />
                    <MenuItem href="/register" title="Register" />
                </Menu>
            } />

            <div className="flex items-center justify-center h-screen">
                {children}
            </div>
        </>
    );
}