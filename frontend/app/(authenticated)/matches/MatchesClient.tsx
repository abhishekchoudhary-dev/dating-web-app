'use client'

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MapPinIcon, UserIcon, MessageCircleIcon, UserCircleIcon } from "lucide-react";
import Link from "next/link";
import RealtimeListener from "@/components/realtime/RealtimeListener";
import { MatchedUser } from "./types";

type Props = {
    initialMatches: MatchedUser[]
    token: string
    currentUserEmail: string
}

export default function MatchesClient({ initialMatches, token, currentUserEmail }: Props) {
    const [matches, setMatches] = useState<MatchedUser[]>(initialMatches);
    const [onlineUsers, setOnlineUsers] = useState<Set<number>>(new Set());

    //handles unread message updates
    const handleUnreadUpdate = (senderId: number, count: number) => {
        setMatches(prev => {
        const updated = prev.map(match =>
            match.id === senderId
                ? { ...match, unreadCount: count, lastMessageAt: new Date().toISOString() }
                : match
        );
        const matchIndex = updated.findIndex(m => m.id === senderId);
        if (matchIndex > 0) {
            const match = updated.splice(matchIndex, 1)[0];
            updated.unshift(match);
        }
        return updated;
        });
    };



    //handles status updates
    const handleStatusUpdate = (userId: number, online: boolean) => {
        setOnlineUsers(prev => {
            const updated = new Set(prev);
            if (online) updated.add(userId);
            else updated.delete(userId);
            return updated;
        });
    };

    return (
        <>
            <RealtimeListener
                currentUserEmail={currentUserEmail}
                matchIds={matches.map(m => m.id)}
                onUnreadUpdate={handleUnreadUpdate}
                onStatusUpdate={handleStatusUpdate}
            />
            <div className="w-full space-y-4">
                <h1 className="text-2xl font-bold">Your Matches</h1>
                <div className="flex flex-col gap-3">
                    {matches.map((match) => (
                        <div key={match.id} className="flex flex-col sm:flex-row sm:items-center gap-3 p-2 rounded-lg border bg-card hover:shadow-sm transition-shadow">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                <div className="relative shrink-0 w-fit">
                                    <Avatar className="size-24">
                                        <AvatarImage src={match.profilePictureLink ?? ''} alt={match.name} />
                                        <AvatarFallback>
                                            <UserIcon size={24} />
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className={`absolute bottom-0 right-1 size-3 rounded-full border-[3px] bg-background ${onlineUsers.has(match.id) ? 'border-green-500 bg-green-300' : 'border-gray-400 bg-gray-200'}`} />
                                </div>

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
                                    {match.lastMessageAt && (
                                        <p className="text-xs mt-3 text-muted-foreground">
                                            Last message at <span suppressHydrationWarning>
                                                {new Date(match.lastMessageAt).toLocaleDateString([], { day: '2-digit', month: 'short' })}
                                                {' '}
                                                {new Date(match.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-2 w-full sm:w-auto sm:shrink-0">
                                <Link href={`/profile/${match.id}`} className="flex-1 sm:flex-none">
                                    <Button variant="outline" size="sm" className="gap-1 w-full sm:w-auto mr-2 py-5 px-4 cursor-pointer">
                                        <UserCircleIcon className="size-4" />
                                        View Full Profile
                                    </Button>
                                </Link>
                                <Link href={`/chat/${match.id}`} className="flex-1 sm:flex-none">
                                    <Button size="sm" className="relative gap-1 cursor-pointer w-full sm:w-auto py-5 mr-2 px-4 bg-pink-500 hover:bg-pink-600 text-white">
                                        <MessageCircleIcon className="size-4" />
                                        Chat
                                        {match.unreadCount > 0 && (
                                            <span className="absolute -top-3 -right-3 bg-red-500 text-white shadow-md text-xs rounded-full size-7 flex items-center justify-center">
                                                {match.unreadCount}
                                            </span>
                                        )}
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}