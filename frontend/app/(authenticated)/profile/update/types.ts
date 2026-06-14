import { Option } from "@/app/(authenticated)/types";

export type ProfileEditFormFields = {
    name: string
    profilePictureLink: string
    profilePictureFile?: File | null
    age: number
    gender: string
    languages: Option[]
    location: string
    aboutMe: string
    interests: Option[]
    preferenceGender: string
    preferenceAgeRange: [number, number]
    preferenceDistanceRadius: number[]
}