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

export async function getMatches() {
    const ids: number[] = await fetchWithAuth('http://localhost:8080/api/connections') ?? [];
    
    const users = await Promise.all(ids.map(async (id) => {
        const [user, bio, unread] = await Promise.all([
            fetchWithAuth(`http://localhost:8080/api/users/${id}`),
            fetchWithAuth(`http://localhost:8080/api/users/${id}/bio`),
            fetchWithAuth(`http://localhost:8080/api/messages/${id}/unread`)
        ]);

        return {
            id,
            name: user?.name ?? 'Unknown',
            profilePictureLink: user?.profilePictureLink ?? null,
            age: bio?.age ?? null,
            location: bio?.location ?? null,
            interests: bio?.interests ?? [],
            languages: bio?.languages ?? [],
            unreadCount: unread ?? 0,
        };
    }));

    return users;
}