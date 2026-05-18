import React from "react";
import { getAuthenticatedUser } from "@/app/(authenticated)/actions";
import Form from "next/form";
import { logout } from "@/app/(guest)/actions";

export default async function AuthenticatedLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    const user = await getAuthenticatedUser();

    return (
        <>
            <h1>This is authenticated layout</h1>
            <p>Hello, {user.email}!</p>
            <Form action={logout}>
                <button type="submit">Log out</button>
            </Form>
            {children}
        </>
    );
}