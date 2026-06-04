import type { Metadata } from "next";
import React from "react";
import { getAuthenticatedUserData } from "@/app/(authenticated)/profile/update/data";
import { MessageCircle, PencilIcon, UserIcon, UserMinus, UserMinusIcon, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

export const metadata: Metadata = {
    title: 'My profile',
}

export default async function Profile() {
    const user = await getAuthenticatedUserData();

    return (
        <div className="space-y-7">
            <div className="flex justify-center">
                <Avatar className="size-42">
                    <AvatarImage src={user.profilePictureLink} alt="Profile photo" />
                    <AvatarFallback className="text-xl">
                        <UserIcon size={50}/>
                    </AvatarFallback>
                </Avatar>
            </div>

            <div className="flex items-center justify-center">
                <Link href="/profile/update">
                    <Button>
                        <PencilIcon size={15} />
                        Edit
                    </Button>
                </Link>
            </div>

            <Separator />

            <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Name</p>
                <p className="text-base font-medium ">{user.name}</p>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Age</p>
                    <p className="text-base font-medium ">{user.age}</p>
                </div>
                <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Gender</p>
                    <p className="text-base font-medium ">{user.gender.displayName}</p>
                </div>
                <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Location</p>
                    <p className="text-base font-medium ">{user.location}</p>
                </div>
            </div>

            <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">About me</p>
                <p className="text-sm leading-relaxed">{user.aboutMe}</p>
            </div>

            <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Languages</p>
                <div className="flex flex-wrap gap-2">
                    {user.languages.map((lang) => (
                        <Badge variant="outline" className="p-4 text-sm" key={lang.name}>
                            {lang.emoji} {lang.displayName}
                        </Badge>
                    ))}
                </div>
            </div>

            <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Interests</p>
                <div className="flex flex-wrap gap-2">
                    {user.interests.map((interest) => (
                        <Badge variant="outline" className="p-4 text-sm" key={interest.name}>
                            {interest.emoji} {interest.displayName}
                        </Badge>
                    ))}
                </div>
            </div>
        </div>
    );
}