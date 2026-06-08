import type { Metadata } from "next";
import { getRecommendations, getUserData } from "./data";
import DiscoverClient from "./discoverclient";

export const metadata: Metadata = {
    title: 'Discover',
}

export default async function Discover() {
    const recommendations = await getRecommendations();
    const users = await Promise.all(recommendations.map((id: number) => getUserData(id)));

    return <DiscoverClient users={users} />;
}