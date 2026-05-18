import React from "react";
import { getAuthenticatedUser } from "@/app/(authenticated)/actions";
import Form from "next/form";
import { logout } from "@/app/(guest)/actions";
import Link from "next/link";

export default async function AuthenticatedLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    const user = await getAuthenticatedUser();

    return (
        <>

            <div className="p-4">
                <p>Hello, <span className="font-bold">{user.email}</span>!</p>

                <div className="flex items-center gap-2">
                    <ul className="menu menu-horizontal bg-base-200 rounded-box">
                        <li><Link href="/discover">Discover</Link></li>
                        <li><Link href="/profile">Profile</Link></li>
                    </ul>
                    <Form action={logout}>
                        <button type="submit" className="btn btn-neutral">Log out</button>
                    </Form>
                </div>

                {children}
            </div>
        </>
    );
}