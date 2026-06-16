import type { Metadata } from "next";
import React from "react";
import { getAuthenticatedUserData } from "@/app/(authenticated)/profile/update/data";
import { MessageCircleIcon, PencilIcon, UserIcon, UserX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { getUserData } from "@/app/(authenticated)/profile/[[...userId]]/data";
import { unmatchUser } from "@/app/(authenticated)/matches/actions";
import OnlineStatusListener from "@/components/realtime/OnlineStatusListener";
import { cookies } from "next/headers";
import { getAuthenticatedUser } from "@/app/(authenticated)/actions";

export const metadata: Metadata = {
    title: 'Profile',
}

export default async function Profile(props: PageProps<'/profile/[[...userId]]'>) {
    const { userId } = await props.params;
    let user;
    let isMeProfile = false;

    if (userId) {
        user = await getUserData(userId[0])
    } else {
        user = await getAuthenticatedUserData();
        isMeProfile = true;
    }

    if (!user) {
        return (
            <span className="flex gap-2"><UserX /> User not found</span>
        );
    }

     //fetching token and authenticates user for online indicator status
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value ?? '';
    const me = await getAuthenticatedUser();

    return (
        <div className="space-y-5 w-full">
            <div className="flex justify-center">
                <div className="relative w-fit">
                    <Avatar className="size-42">
                        <AvatarImage src={user.profilePictureLink} alt="Profile photo" />
                        <AvatarFallback className="text-xl">
                            <UserIcon size={50}/>
                        </AvatarFallback>
                    </Avatar>
                
                    {/*online indicator*/}
                    {!isMeProfile && userId && (
                        <OnlineStatusListener
                            currentUserEmail={me.email}
                            targetUserId={Number(userId[0])}
                            className="absolute bottom-0 right-1 size-5 border-[5px] border-green-500 bg-green-200"
                        />
                    )}
                </div>
            </div>
            <div className = "flex font-bold items-center justify-center w-full text-2xl">
                {user.name}
            </div>

            <div className="flex items-center justify-center gap-2">
                {isMeProfile ? (
                    <Link href="/profile/update">
                        <Button>
                            <PencilIcon size={15} />
                            Edit
                        </Button>
                    </Link>
                ) : (
                    <>
                        <Link href={`/chat/${userId[0]}`}>
                            <Button className="cursor-pointer py-5 px-10 bg-pink-500 hover:bg-pink-600 text-white">
                                <MessageCircleIcon size={15} />
                                Chat
                            </Button>
                        </Link>
                        <form action={unmatchUser.bind(null, Number(userId[0]))}>
                            <Button className="cursor-pointer py-5 px-10" variant="outline" type="submit">
                                <UserX size={15} />
                                Unmatch
                            </Button>
                        </form>
                    </>
                )}
            </div>

            <p className="text-m font-medium text-muted-foreground uppercase tracking-wide mb-1">Profile Details</p>
            <Separator />
            <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Full Name</p>
                <p className="text-base font-medium ">{user.name}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Languages</p>
                <div className="flex flex-wrap gap-2">
                    {user.languages.map((lang) => (
                        <Badge variant="outline" className="p-4 text-sm" key={lang.name}>
                            {lang.emoji} {lang.displayName}
                        </Badge>
                    ))}
                </div>
            </div>

            <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Interests</p>
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