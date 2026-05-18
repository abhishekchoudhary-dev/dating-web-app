import React from "react";
import Navbar from "@/app/components/Navbar";
import NavLinks from "@/app/components/NavLinks";

const navLinks = [
    {
        href: '/login',
        title: 'Log in',
    },
    {
        href: '/register',
        title: 'Register',
    },
]

export default function GuestLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <>
            <Navbar end={<NavLinks links={navLinks} />} />

            <div className="flex items-center justify-center h-screen">
                {children}
            </div>
        </>
    );
}