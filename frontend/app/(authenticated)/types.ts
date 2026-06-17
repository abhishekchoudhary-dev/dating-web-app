export type FetchResponse<T> = {
    status: number;
    ok: boolean;
    data: T;
}

// ME
export type Me = {
    id: number;
    name: string;
    email: string;
    profilePictureLink: string;
    profileLink: string;
    profileComplete: boolean;
    hideOnlineStatus: boolean;
}

export type MeProfile = {
    aboutMe: string;
}

export type MeBio = {
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

export type FullMe = Me & MeProfile & MeBio;

// USER
export type User = Pick<Me, "id" | "name" | "email" | "profilePictureLink" | "profileLink">
export type UserProfile = MeProfile;
export type UserBio = Pick<MeBio, "age" | "gender" | "interests" | "languages" | "location">
export type FullUser = User & UserProfile & UserBio;

// OPTIONS
export type Options = {
    genders: Option[];
    languages: Option[];
    interests: Option[];
    genderPreferences: Option[];
}

export type Option = {
    name: string;
    displayName: string;
    emoji: string;
}