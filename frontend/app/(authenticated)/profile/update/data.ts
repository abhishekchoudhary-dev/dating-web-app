import { MeBio, MeProfile, Me, Options, FullMe } from "@/app/(authenticated)/types";
import { fetchWithAuth } from "@/app/(authenticated)/actions";

export async function getOptions(): Promise<Options> {
    const response = await fetchWithAuth<Options>(`http://localhost:8080/api/me/bio/options`, {
        method: 'GET',
    })

    return response.data;
}

export async function getAuthenticatedUserData(): Promise<FullMe> {
    const [
        { data: me },
        { data: profile },
        { data: bio }
    ] = await Promise.all([
        fetchWithAuth<Me>(`http://localhost:8080/api/me`, {
            cache: 'no-store'
        }),
        fetchWithAuth<MeBio>(`http://localhost:8080/api/me/profile`, {
            cache: 'no-store'
        }),
        fetchWithAuth<MeProfile>(`http://localhost:8080/api/me/bio`, {
            cache: 'no-store'
        }),
    ]);

    return { ...me, ...profile, ...bio};
}

export async function getProfileEditFormData() {
    const data = await getAuthenticatedUserData();

    return {
        name: data.name ?? "",
        profilePictureLink: data.profilePictureLink ?? "",
        age: data.age ?? undefined,
        gender: data.gender?.name ?? undefined,
        languages: data.languages,
        location: data.location ?? "",
        aboutMe: data.aboutMe ?? "",
        interests: data.interests,
        preferenceGender: data.preferenceGender?.name ?? undefined,
        preferenceAgeRange: [data.preferenceAgeMin ?? 18, data.preferenceAgeMax ?? 90] as [number, number],
        preferenceDistanceRadius: [data.preferenceDistanceRadius ?? 10]
    }
}