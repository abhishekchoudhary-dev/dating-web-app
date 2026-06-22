'use server'

import { fetchWithAuth } from "@/app/(authenticated)/actions";

export async function matchLike(id: number) {
    const response = await fetchWithAuth<string>(`/connections/${id}/match`, {
        method: 'POST',
    });
    return response.data;
}

export async function dismissLike(id: number) {
    return await fetchWithAuth(`/connections/${id}/dismiss`, {
        method: 'POST',
    });
}