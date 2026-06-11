'use server'

import { cookies } from "next/headers";

async function getToken() {
    const cookieStore = await cookies();
    return cookieStore.get('access_token')?.value;
}

export async function matchUser(id: number) {
    const token = await getToken();
    const response = await fetch(`http://localhost:8080/api/connections/${id}/match`, {
        method: 'POST',
        headers: { Cookie: `access_token=${token}` },
    });
    return response.json();
}

export async function dismissUser(id: number) {
    const token = await getToken();
    const response = await fetch(`http://localhost:8080/api/connections/${id}/dismiss`, {
        method: 'POST',
        headers: { Cookie: `access_token=${token}` },
    });
    return response.json();
}