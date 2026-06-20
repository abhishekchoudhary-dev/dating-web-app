import { FullUser, User, UserBio, UserProfile } from "@/app/(authenticated)/types";
import { fetchWithAuth } from "@/app/(authenticated)/actions";

export async function getUserData(userId: string): Promise<FullUser | undefined> {
    const [
        userResponse,
        profileResponse,
        bioResponse
    ] = await Promise.all([
        fetchWithAuth<User>(`/users/${userId}`, {
            cache: 'no-store'
        }),
        fetchWithAuth<UserBio>(`/users/${userId}/profile`, {
            cache: 'no-store'
        }),
        fetchWithAuth<UserProfile>(`/users/${userId}/bio`, {
            cache: 'no-store'
        }),
    ]);

    if (!userResponse.ok) throw new Error(userResponse.data.message);
    if (!profileResponse.ok) throw new Error(profileResponse.data.message);
    if (!bioResponse.ok) throw new Error(bioResponse.data.message);

    return { ...userResponse.data, ...profileResponse.data, ...bioResponse.data};
}