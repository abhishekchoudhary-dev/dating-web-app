'use server'

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { FetchResponse, Me } from "@/app/(authenticated)/types";

export async function fetchWithAuth<T>(url: string, options?: RequestInit): Promise<FetchResponse<T>> {
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;

    const response = await fetch(url, {
        method: options?.method ?? "GET",
        headers: { Cookie: `access_token=${token}` },
        ...options
    });

    return {
        status: response.status,
        ok: response.ok,
        data: await response.json() as T,
    };
}

export async function getAuthenticatedUser(): Promise<Me> {
    const response = await fetchWithAuth<Me>(`http://localhost:8080/api/me`, {
        cache: 'no-store'
    });

    return response.data;
}

export async function logoutUser() {
    const cookieStore = await cookies();
    cookieStore.delete('access_token');
    redirect('/login');
}