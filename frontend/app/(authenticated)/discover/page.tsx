import type { Metadata } from "next";
import { getRecommendedUsers, getRecommendedUsersIds } from "./data";
import DiscoverClient from "./DiscoverClient";
import { RecommendedUser } from "@/app/(authenticated)/discover/types";

export const metadata: Metadata = {
    title: 'Discover',
}

export default async function Discover() {
    const recommendedUsersIds: number[] = await getRecommendedUsersIds();
    const recommendedUsers: RecommendedUser[] = await getRecommendedUsers(recommendedUsersIds);

    return <DiscoverClient users={recommendedUsers} />;
}