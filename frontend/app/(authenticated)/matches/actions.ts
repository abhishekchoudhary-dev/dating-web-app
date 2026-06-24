'use server'

import { fetchWithAuth } from "@/app/(authenticated)/actions";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function unmatchUser(userId: number) {
    await fetchWithAuth(`/connections/${userId}/unmatch`, {
        method: 'DELETE'
    });
    revalidatePath('/matches');
    //redirect('/matches');
}