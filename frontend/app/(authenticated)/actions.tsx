'use server'

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function getAuthenticatedUser() {
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;

    const response = await fetch(`http://localhost:8080/api/me`, {
        method: 'GET',
        headers: { Cookie: `access_token=${token}` },
        cache: 'no-store'
    })

    return response.json();
}

export async function logoutUser() {
    const cookieStore = await cookies();
    cookieStore.delete('access_token');
    redirect('/login');
}