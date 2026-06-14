import { fetchWithAuth } from "@/app/(authenticated)/actions";
import { FetchResponse, User, UserBio } from "@/app/(authenticated)/types";
import { MatchedUser } from "@/app/(authenticated)/matches/types";

export async function getMatchedUsers(): Promise<MatchedUser[]> {
    const { data: matchesIds }: FetchResponse<number[]> = await fetchWithAuth<number[]>('http://localhost:8080/api/connections');

    return await Promise.all(matchesIds.map(async (id: number): Promise<MatchedUser> => {
        const [{data: user}, {data: bio},{data: unread}] = await Promise.all([
            fetchWithAuth<User>(`http://localhost:8080/api/users/${id}`),
            fetchWithAuth<UserBio>(`http://localhost:8080/api/users/${id}/bio`),
            fetchWithAuth<number>(`http://localhost:8080/api/messages/${id}/unread`),
        ]);

        return {
            id,
            name: user?.name ?? 'Unknown',
            profilePictureLink: user?.profilePictureLink ?? null,
            age: bio?.age ?? null,
            location: bio?.location ?? null,
            unreadCount: unread ?? 0,
        };
    }));
}