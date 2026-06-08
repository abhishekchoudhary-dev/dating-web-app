'use client'

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPinIcon, XIcon, HeartIcon, ImageIcon, UserIcon, PencilIcon } from "lucide-react";


type User = {
    id: number
    name: string
    profilePictureLink: string | null
    age: number | null
    gender: string | null
    location: string | null
    aboutMe: string | null
    interests: { name: string, displayName: string, emoji: string }[]
    languages: { name: string, displayName: string, emoji: string }[]
}

type Props = {
    users: User[]
}

export default function discoverclient({ users }: Props) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const currentUser = users[currentIndex];

    const handleMatch = () => {
        // TODO — send connection request to backend
        setCurrentIndex(prev => prev + 1);
    }

    const handleDismiss = () => {
        // TODO — send dismiss to backend so user is never recommended again
        setCurrentIndex(prev => prev + 1);
    }

    if (!currentUser) {
        return (
            <div className="flex flex-col items-center justify-center min-h-96 gap-4 text-center">
                <div className="text-6xl">🌍</div>
                <h2 className="text-xl font-semibold">No more matches in your area</h2>
                <p className="text-muted-foreground max-w-sm">
                    Increase your distance radius to find more matches
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center w-full max-w-sm mx-auto gap-6">
            <Card className="w-full max-h-[85vh] overflow-hidden shadow-lg">
                <div className="relative">
                    <div className="h-50 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                        <Avatar className="size-40 border-4 border-background shadow-md">
                            <AvatarImage src={currentUser.profilePictureLink ?? ''} alt={currentUser.name} />
                             <AvatarFallback className="text-4xl">
                                <UserIcon size={50} />
                            </AvatarFallback>
                        </Avatar>
                    </div>
                </div>

                <CardContent className="pt-1 pb-2 space-y-3">
                    <div>
                        <h2 className="text-2xl font-bold">
                            {currentUser.name}
                            {currentUser.age && (
                                <span className="text-muted-foreground font-normal text-xl">, {currentUser.age}</span>
                            )}
                        </h2>
                        {currentUser.location && (
                            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1 font-bold">
                                <MapPinIcon className="size-4" />
                                {currentUser.location}
                            </div>
                        )}
                    </div>

                    {currentUser.aboutMe && (
                        <p className="text-sm text-muted-foreground">
                            {currentUser.aboutMe}
                        </p>
                    )}

                    {currentUser.interests.length > 0 && (
                        <div>
                            <p className="text-xs font-medium text-muted-foreground mb-2">INTERESTS</p>
                            <div className="flex flex-wrap gap-1">
                                {currentUser.interests.map((interest: any) => (
                                    <Badge key={interest.name} variant="secondary" className="text-xs">
                                        {interest.emoji} {interest.displayName}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}

                    {currentUser.languages.length > 0 && (
                        <div>
                            <p className="text-xs font-medium text-muted-foreground mb-2">LANGUAGES</p>
                            <div className="flex flex-wrap gap-1">
                                {currentUser.languages.map((lang: any) => (
                                    <Badge key={lang.name} variant="outline" className="text-xs">
                                        {lang.emoji} {lang.displayName}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex justify-between items-center mt-4 pb-0 pt-4 gap-3">
                        <Button
                            onClick={handleDismiss}
                            variant="outline"
                            className="flex-1 py-5 text-base gap-2 border-destructive text-destructive hover: bg-transparent hover:text-destructive-foreground cursor-pointer gap-2">
                            <XIcon className="size-5" />
                            Dismiss
                        </Button>
                        <Button
                            onClick={handleMatch}
                            className="flex-1 py-5 text-base gap-2 cursor-pointer hover:bg-primary hover:opacity-90">
                            <HeartIcon className="size-5" />
                            Match
                        </Button>
                    </div>
                </CardContent>
            </Card>
            {/*
            <p className="text-sm text-muted-foreground">
                {users.length - currentIndex - 1} more {users.length - currentIndex - 1 === 1 ? 'match' : 'matches'} remaining
            </p> 
            */}
        </div>
    );
}