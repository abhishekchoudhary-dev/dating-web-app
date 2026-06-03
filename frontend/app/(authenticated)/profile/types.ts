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