'use server'

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function getAuthenticatedUser() {
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;
    if (!token) redirect('/login');

    const response = await fetch(`http://localhost:8080/api/me`, {
        method: 'GET',
        headers: { Cookie: `access_token=${token}` }
    })

    if (!response.ok) redirect('/login')

    return response.json();
}