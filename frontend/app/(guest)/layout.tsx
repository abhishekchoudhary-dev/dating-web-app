import React from "react";
import Link from "next/link";

export default function GuestLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <>
            <div className="navbar bg-base-100 shadow-sm">
                <div className="flex-1">
                    <Link href="/" className="btn btn-ghost text-xl">Match Me</Link>
                </div>
                <div className="flex-none">
                    <ul className="menu menu-horizontal px-1">
                        <li><Link href="/login">Log in</Link></li>
                        <li><Link href="/register">Register</Link></li>
                    </ul>
                </div>
            </div>
            <div className="flex items-center justify-center h-screen">
                {children}
            </div>

        </>
    );
}