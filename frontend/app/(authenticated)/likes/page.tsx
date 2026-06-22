import type { Metadata } from "next";
import { getLikedUserIds, getLikedUsers } from "./data";
import LikesClient from "./LikesClient";

export const metadata: Metadata = {
    title: 'Likes',
}

export default async function LikesPage() {
    const ids = await getLikedUserIds();
    const users = await getLikedUsers(ids);

    return <LikesClient users={users} />;
}