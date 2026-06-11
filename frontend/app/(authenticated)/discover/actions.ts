'use server'

import { fetchWithAuth } from "@/app/(authenticated)/actions";

export async function matchUser(id: number) {
    return await fetchWithAuth(`http://localhost:8080/api/connections/${id}/match`, {
        method: 'POST',
    });
}

export async function dismissUser(id: number) {
    return await fetchWithAuth(`http://localhost:8080/api/connections/${id}/dismiss`, {
        method: 'POST',
    });
}