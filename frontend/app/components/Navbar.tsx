import React from "react";
import Link from "next/link";

type NavbarComponentProps = {
    center?: React.ReactNode,
    end?: React.ReactNode
}

export default function Navbar({center, end}: NavbarComponentProps) {
    return (
        <div className="hidden lg:block shadow-sm">
            <div className="navbar bg-base-100 mx-auto max-w-7xl">
                <div className="navbar-start">
                    <Link href="/" className="btn btn-ghost text-xl">Match Me</Link>
                </div>
                <div className="navbar-center">
                    {center}
                </div>
                <div className="navbar-end">
                    {end}
                </div>
            </div>
        </div>
    );
}