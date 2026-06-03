import { Option } from "@/app/(authenticated)/profile/types";

export type UserResponse = {
    name: string;
    profileLink: string;
    profilePictureLink: string;
}

export type UserProfileResponse = {
    aboutMe: string;
}

export type UserBioResponse = {
    age: number;
    gender: Option;
    interests: Option[];
    languages: Option[];
    location: string;
    preferenceGender: Option;
    preferenceAgeMin: number;
    preferenceAgeMax: number;
    preferenceDistanceRadius: number;
}

export type ProfileEditFormFields = {
    name: string
    profilePictureLink: string
    profilePictureFile?: File
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