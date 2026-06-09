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

export async function getRecommendations(): Promise<number[]> {
    const data = await fetchWithAuth('http://localhost:8080/api/recommendations');
    return data ?? [];
}

export async function getUserData(id: number) {
    const [user, bio, profile] = await Promise.all([
        fetchWithAuth(`http://localhost:8080/api/users/${id}`),
        fetchWithAuth(`http://localhost:8080/api/users/${id}/bio`),
        fetchWithAuth(`http://localhost:8080/api/users/${id}/profile`),
    ]);


    console.log('USER:', JSON.stringify(user));
    console.log('BIO:', JSON.stringify(bio));
    console.log('PROFILE:', JSON.stringify(profile));

    return {
        id,
        name: user?.name ?? 'Unknown',
        profilePictureLink: user?.profilePictureLink ?? null,
        age: bio?.age ?? null,
        gender: bio?.gender ?? null,
        location: bio?.location ?? null,
        aboutMe: profile?.aboutMe ?? null,
        interests: bio?.interests ?? [],
        languages: bio?.languages ?? [],
    };
}