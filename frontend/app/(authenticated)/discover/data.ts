import { fetchWithAuth } from "@/app/(authenticated)/actions";
import { UserBio, UserProfile, User } from "@/app/(authenticated)/types";
import { RecommendedUser } from "@/app/(authenticated)/discover/types";

export async function getRecommendedUsersIds(): Promise<number[]> {
    const response = await fetchWithAuth<number[]>('/recommendations', {
        method: 'GET',
        cache: 'no-store'
    });

    if (!response.ok) throw new Error(response.data.message);

    return response.data;
}

export async function getRecommendedUsers(ids: number[]): Promise<RecommendedUser[]> {
    return await Promise.all(
        ids.map((id: number) => getRecommendedUserData(id))
    );
}

export async function getRecommendedUserData(id: number): Promise<RecommendedUser> {
    const [userRes, bioRes, profileRes] = await Promise.all([
        fetchWithAuth<User>(`/users/${id}`, { cache: 'no-store' }),
        fetchWithAuth<UserBio>(`/users/${id}/bio`, { cache: 'no-store' }),
        fetchWithAuth<UserProfile>(`/users/${id}/profile`, { cache: 'no-store' }),
    ]);

    if (!userRes.ok) throw new Error(userRes.data.message);
    if (!bioRes.ok) throw new Error(bioRes.data.message);

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
        aboutMe: profile?.aboutMe ?? 'Unknown',
        interests: bio.interests ?? [],
        languages: bio.languages ?? [],
    };
}