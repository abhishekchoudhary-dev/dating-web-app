import { FullUser } from "@/app/(authenticated)/types";

export type LikedUser = Omit<FullUser, "email" | "profileLink">