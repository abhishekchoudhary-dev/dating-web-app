import { FullUser } from "@/app/(authenticated)/types";

export type RecommendedUser = Omit<FullUser, "email" | "profileLink">