import { fetchWithAuth } from "@/app/(authenticated)/actions";
import { FetchResponse, User, UserBio } from "@/app/(authenticated)/types";
import { MatchedUser } from "@/app/(authenticated)/matches/types";

export async function getMatchedUsers(): Promise<MatchedUser[]> {
    const { data: matchesIds }: FetchResponse<number[]> = await fetchWithAuth<number[]>('http://localhost:8080/api/connections');

<<<<<<< HEAD
export async function getMatches() {
    const ids: number[] = await fetchWithAuth('http://localhost:8080/api/connections') ?? [];
    
    const users = await Promise.all(ids.map(async (id) => {
        const [user, bio, unread] = await Promise.all([
            fetchWithAuth(`http://localhost:8080/api/users/${id}`),
            fetchWithAuth(`http://localhost:8080/api/users/${id}/bio`),
            fetchWithAuth(`http://localhost:8080/api/messages/${id}/unread`)
=======
    return await Promise.all(matchesIds.map(async (id: number): Promise<MatchedUser> => {
        const [{data: user}, {data: bio}] = await Promise.all([
            fetchWithAuth<User>(`http://localhost:8080/api/users/${id}`),
            fetchWithAuth<UserBio>(`http://localhost:8080/api/users/${id}/bio`),
>>>>>>> origin/main
        ]);

        return {
            id,
            name: user?.name ?? 'Unknown',
            profilePictureLink: user?.profilePictureLink ?? null,
            age: bio?.age ?? null,
            location: bio?.location ?? null,
<<<<<<< HEAD
            interests: bio?.interests ?? [],
            languages: bio?.languages ?? [],
            unreadCount: unread ?? 0,
=======
>>>>>>> origin/main
        };
    }));
}