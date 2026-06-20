'use server'

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { FetchResponse, Me } from "@/app/(authenticated)/types";
import { revalidatePath } from "next/cache";
import { API_BASE_URL } from "@/app/lib/config";

export async function fetchWithAuth<T>(endpoint: string, options?: RequestInit): Promise<FetchResponse<T>> {
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;

    const headers = new Headers(options?.headers);
    headers.set('Cookie', `access_token=${token}`);

    const response = await fetch(API_BASE_URL + endpoint, {
        ...options,
        method: options?.method ?? "GET",
        headers
    });

    //handle empty response upon unmatch 
    const text = await response.text();
    const data = text ? JSON.parse(text) as T : null as T;
    
    return {
        status: response.status,
        ok: response.ok,
        data
    } as FetchResponse<T>;
}

export async function getAuthenticatedUser(): Promise<Me> {
    const response = await fetchWithAuth<Me>(`/me`, {
        cache: 'no-store'
    });

    if (!response.ok) {
        throw new Error(response.data.message);
    }

    return response.data;
}

//check user status preference
export async function toggleHideOnlineStatus() {
    await fetchWithAuth('/me/hide-online-status', {
        method: 'PATCH'
    });
    revalidatePath('/');
}

export async function logoutUser() {
    const cookieStore = await cookies();
    cookieStore.delete('access_token');
    redirect('/login');
}