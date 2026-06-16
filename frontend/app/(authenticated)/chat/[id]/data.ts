import { cookies } from "next/headers";

async function fetchWithAuth(url: string) {
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;
    const response = await fetch(url, {
        method: 'GET',
        headers: { Cookie: `access_token=${token}` },
        cache: 'no-store'
    });
    if (!response.ok) return null;
    return response.json();
}

export async function getChatData(userId: number) {
    const [user, messages] = await Promise.all([
        fetchWithAuth(`http://localhost:8080/api/users/${userId}`),
        fetchWithAuth(`http://localhost:8080/api/messages/${userId}`),
    ]);

    //if users are not matched then no messages
    if(messages===null){
        return null;
    }

    return {
        user: {
            id: userId,
            name: user?.name ?? 'Unknown',
            profilePictureLink: user?.profilePictureLink ?? null,
        },
        messages: messages ?? []
    };
}