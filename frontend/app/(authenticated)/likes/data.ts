import { fetchWithAuth } from "@/app/(authenticated)/actions";
import { User, UserBio, UserProfile } from "@/app/(authenticated)/types";
import { LikedUser } from "@/app/(authenticated)/likes/types";

export async function getLikedUserIds(): Promise<number[]> {
    const response = await fetchWithAuth<number[]>('/connections/pending', {
        cache: 'no-store'
    });
    if (!response.ok) return [];
    return response.data;
}

export async function getLikedUsers(ids: number[]): Promise<LikedUser[]> {
    return await Promise.all(ids.map(id => getLikedUserData(id)));
}

export async function getLikedUserData(id: number): Promise<LikedUser> {
    const [userRes, bioRes, profileRes] = await Promise.all([
        fetchWithAuth<User>(`/users/${id}`, { cache: 'no-store' }),
        fetchWithAuth<UserBio>(`/users/${id}/bio`, { cache: 'no-store' }),
        fetchWithAuth<UserProfile>(`/users/${id}/profile`, { cache: 'no-store' }),
    ]);

    if (!userRes.ok || !bioRes.ok) {
        throw new Error(`Failed to fetch data for user ${id}`);
    }
    
    const user = userRes.data;
    const bio = bioRes.data;
    const profile = profileRes.ok ? profileRes.data : undefined;

    return {
        id,
        name: user.name,
        profilePictureLink: user.profilePictureLink ?? null,
        age: bio.age,
        gender: bio.gender,
        location: bio.location,
        aboutMe: profile?.aboutMe ?? '',
        interests: bio.interests ?? [],
        languages: bio.languages ?? [],
    };
}