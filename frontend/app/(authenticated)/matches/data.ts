import { fetchWithAuth } from "@/app/(authenticated)/actions";
import { FetchResponse, User, UserBio } from "@/app/(authenticated)/types";
import { MatchedUser } from "@/app/(authenticated)/matches/types";

export async function getMatchedUsers(): Promise<MatchedUser[]> {
    const matchesRes = await fetchWithAuth<number[]>('/connections');
    if (!matchesRes.ok) throw new Error(matchesRes.data.message);
    const matchesIds = matchesRes.data;

    return await Promise.all(matchesIds.map(async (id): Promise<MatchedUser> => {
        const [userRes, bioRes, unreadRes, lastMessageRes] = await Promise.all([
            fetchWithAuth<User>(`/users/${id}`),
            fetchWithAuth<UserBio>(`/users/${id}/bio`),
            fetchWithAuth<number>(`/messages/${id}/unread`),
            fetchWithAuth<string>(`/messages/${id}/last`),
        ]);

        if (!userRes.ok) throw new Error(userRes.data.message);
        if (!bioRes.ok) throw new Error(bioRes.data.message);

        const user = userRes.data;
        const bio = bioRes.data;
        const unread = unreadRes.ok ? unreadRes.data : undefined;
        const lastMessageAt = lastMessageRes.ok ? lastMessageRes.data : undefined;

        return {
            id,
            name: user.name,
            profilePictureLink: user.profilePictureLink ?? null,
            age: bio.age,
            location: bio.location,
            unreadCount: unread ?? 0,
            lastMessageAt: lastMessageAt ?? null,
        };
    }));
}