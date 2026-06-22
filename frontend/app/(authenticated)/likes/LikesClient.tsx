'use client'

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPinIcon, XIcon, HeartIcon, UserIcon } from "lucide-react";
import { matchLike, dismissLike } from "./actions";
import { LikedUser } from "@/app/(authenticated)/likes/types";
import { toast } from "sonner";
import { useLikes } from "@/components/realtime/LikesContext";

type Props = {
    users: LikedUser[]
}

export default function Likes({ users: initialUsers }: Props) {
    const [users, setUsers] = useState<LikedUser[]>(initialUsers);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const { refresh } = useLikes();

    const currentUser = users[currentIndex];

    const handleMatch = async () => {
        setLoading(true);
        const status = await matchLike(currentUser.id);
        setLoading(false);

        // Since they already liked us this will always be MATCHED
        if (status === "MATCHED") {
            toast("💘 It's a Match!", {
                description: `You and ${currentUser.name} liked each other!`,
                duration: 4000,
                style: {
                    padding: '32px',
                    fontSize: '18px',
                    textAlign: 'center',
                    minWidth: '350px',
                },
            });
            setTimeout(() => {
                setCurrentIndex(prev => prev + 1);
                refresh(); // update likes count in sidebar
            }, 1500);
        } else {
            setCurrentIndex(prev => prev + 1);
            refresh();
        }
    };

    const handleDismiss = async () => {
        setLoading(true);
        await dismissLike(currentUser.id);
        setLoading(false);
        setCurrentIndex(prev => prev + 1);
        refresh(); // update likes count in sidebar
    };

    if (!currentUser) {
        return (
            <div className="flex flex-col items-center justify-center min-h-96 gap-4 text-center">
                <div className="text-6xl">💝</div>
                <h2 className="text-xl font-semibold">No pending likes</h2>
                <p className="text-muted-foreground max-w-sm">
                    When someone likes you they will appear here
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center w-full max-w-sm mx-auto gap-6">
            <Card className="w-full max-h-[85vh] overflow-hidden shadow-lg">
                <div className="relative">
                    <div className="h-50 bg-white from-primary/20 to-primary/5 flex items-center justify-center">
                        <Avatar className="size-50 border-4 border-background shadow-md">
                            <AvatarImage src={currentUser.profilePictureLink ?? undefined} alt={currentUser.name} />
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
                            disabled={loading}
                            variant="outline"
                            className="flex-1 py-5 text-base gap-2 border-destructive text-destructive hover:bg-transparent hover:text-destructive cursor-pointer">
                            <XIcon className="size-5" />
                            Dismiss
                        </Button>
                        <Button
                            onClick={handleMatch}
                            disabled={loading}
                            className="flex-1 py-5 text-base gap-2 cursor-pointer bg-pink-500 hover:bg-pink-600 text-white">
                            <HeartIcon className="size-5" />
                            Match
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}