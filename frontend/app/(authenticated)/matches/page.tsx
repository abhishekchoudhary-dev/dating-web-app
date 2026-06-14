import type { Metadata } from "next";
import { getMatchedUsers } from "./data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MapPinIcon, HeartIcon, UserIcon, MessageCircleIcon, UserCircleIcon } from "lucide-react";

export const metadata: Metadata = {
    title: 'Matches',
}

export default async function Matches() {
    const matches = await getMatchedUsers();

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
        <div className="w-full space-y-4">
            <h1 className="text-2xl font-bold">Your Matches</h1>
            <div className="flex flex-col gap-3">
                {matches.map((match) => (
                    <div key={match.id} className="flex items-center gap-3 p-1 rounded-lg border bg-card hover:shadow-sm transition-shadow">
                        
                        <Avatar className="size-24 shrink-0">
                            <AvatarImage src={match.profilePictureLink ?? ''} alt={match.name} />
                            <AvatarFallback>
                                <UserIcon size={24} />
                            </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-base">
                                {match.name}
                                {match.age && (
                                    <span className="text-muted-foreground font-normal">, {match.age}</span>
                                )}
                            </h3>
                            {match.location && (
                                <div className="flex items-center font-bold gap-1 text-sm text-muted-foreground">
                                    <MapPinIcon className="size-3" />
                                    {match.location}
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                            <Button variant="outline" size="sm" className="gap-1 mr-2 py-5 px-4 cursor-pointer">
                                <UserCircleIcon className="size-4" />
                                View Full Profile
                            </Button>
                            <Button size="sm" className="gap-1 cursor-pointer py-5 mr-2 px-4 bg-pink-500 hover:bg-pink-600 text-white">
                                <MessageCircleIcon className="size-4" />
                                Chat
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}