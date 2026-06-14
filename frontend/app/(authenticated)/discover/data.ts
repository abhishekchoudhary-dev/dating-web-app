import { fetchWithAuth } from "@/app/(authenticated)/actions";
import { UserBio, UserProfile, User } from "@/app/(authenticated)/types";
import { RecommendedUser } from "@/app/(authenticated)/discover/types";

export async function getRecommendedUsersIds(): Promise<number[]> {
    const response = await fetchWithAuth<number[]>('http://localhost:8080/api/recommendations', {
        method: 'GET',
        cache: 'no-store'
    });

    return response.data;
}

export async function getRecommendedUsers(ids: number[]): Promise<RecommendedUser[]> {
    return await Promise.all(
        ids.map((id: number) => getRecommendedUserData(id))
    );
}

export async function getRecommendedUserData(id: number): Promise<RecommendedUser> {
    const [
        { data: user },
        { data: bio },
        { data: profile }
    ] = await Promise.all([
        fetchWithAuth<User>(`http://localhost:8080/api/users/${id}`, {
            cache: 'no-store'
        }),
        fetchWithAuth<UserBio>(`http://localhost:8080/api/users/${id}/bio`, {
            cache: 'no-store'
        }),
        fetchWithAuth<UserProfile>(`http://localhost:8080/api/users/${id}/profile`, {
            cache: 'no-store'
        }),
    ]);

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