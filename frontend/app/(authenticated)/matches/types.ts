import { FullUser } from "@/app/(authenticated)/types";

export type MatchedUser = Pick<FullUser, "id" | "name" | "profilePictureLink" | "age" |"location"> & {
    unreadCount: number;
    lastMessageAt: string | null; //for timestamp
}