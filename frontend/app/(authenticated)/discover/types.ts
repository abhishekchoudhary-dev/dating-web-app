export type RecommendationUser = {
    id: number
    name: string
    profilePictureLink: string
    profileLink: string
    age: number
    gender: string
    location: string
    aboutMe: string
    interests: { name: string, displayName: string, emoji: string }[]
    languages: { name: string, displayName: string, emoji: string }[]
}