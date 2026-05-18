import React from "react";

export default function GuestLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <>
            <h1>This is guest layout</h1>
            {children}
        </>
    );
}