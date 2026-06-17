'use server'

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { FetchResponse, Me } from "@/app/(authenticated)/types";
import { revalidatePath } from "next/cache";

export async function fetchWithAuth<T>(url: string, options?: RequestInit): Promise<FetchResponse<T>> {
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;

    const response = await fetch(url, {
        method: options?.method ?? "GET",
        headers: { Cookie: `access_token=${token}` },
        ...options
    });

    //handle empty response upon unmatch 
    const text = await response.text();
    const data = text ? JSON.parse(text) as T : null as T;
    
    return {
        status: response.status,
        ok: response.ok,
        data,
    };
}

export async function getAuthenticatedUser(): Promise<Me> {
    const response = await fetchWithAuth<Me>(`http://localhost:8080/api/me`, {
        cache: 'no-store'
    });

    return response.data;
}

//check user status preference
export async function toggleHideOnlineStatus() {
    await fetchWithAuth('http://localhost:8080/api/me/hide-online-status', {
        method: 'PATCH'
    });
    revalidatePath('/');
}

export async function logoutUser() {
    const cookieStore = await cookies();
    cookieStore.delete('access_token');
    redirect('/login');
}