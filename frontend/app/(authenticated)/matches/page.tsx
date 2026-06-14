import type { Metadata } from "next";
import { getMatchedUsers } from "./data";
import { getAuthenticatedUser } from "@/app/(authenticated)/actions";
import { cookies } from "next/headers";
import MatchesClient from "./MatchesClient";
import { HeartIcon } from "lucide-react";

export const metadata: Metadata = {
    title: 'Matches',
}

export default async function Matches() {
    const matches = await getMatchedUsers();
    const me = await getAuthenticatedUser();
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value ?? '';

    if (matches.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-64 gap-4 text-center">
                <HeartIcon className="size-12 text-muted-foreground" />
                <h2 className="text-xl font-semibold">No matches yet</h2>
                <p className="text-muted-foreground max-w-sm">
                    Start discovering people to find your matches
                </p>
            </div>
        );
    }

    return (
        <MatchesClient
            initialMatches={matches}
            token={token}
            currentUserEmail={me.email}
        />
    );
}