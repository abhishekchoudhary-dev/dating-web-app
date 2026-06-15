import { FullUser, User, UserBio, UserProfile } from "@/app/(authenticated)/types";
import { fetchWithAuth } from "@/app/(authenticated)/actions";

export async function getUserData(userId: string): Promise<FullUser | undefined> {
    const [
        userResponse,
        profileResponse,
        bioResponse
    ] = await Promise.all([
        fetchWithAuth<User>(`http://localhost:8080/api/users/${userId}`, {
            cache: 'no-store'
        }),
        fetchWithAuth<UserBio>(`http://localhost:8080/api/users/${userId}/profile`, {
            cache: 'no-store'
        }),
        fetchWithAuth<UserProfile>(`http://localhost:8080/api/users/${userId}/bio`, {
            cache: 'no-store'
        }),
    ]);

    if (!userResponse.ok) return undefined;

    return { ...userResponse.data, ...profileResponse.data, ...bioResponse.data};
}