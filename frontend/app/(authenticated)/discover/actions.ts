'use server'

import { fetchWithAuth } from "@/app/(authenticated)/actions";

export async function matchUser(id: number){
    const response = await fetchWithAuth<String>(`/connections/${id}/match`,{
        method: 'POST',
    });
    return response.data;
}

//export async function matchUser(id: number) {
//    return await fetchWithAuth(`/connections/${id}/match`, {
//        method: 'POST',
//    });
//}

export async function dismissUser(id: number) {
    return await fetchWithAuth(`/connections/${id}/dismiss`, {
        method: 'POST',
    });
}