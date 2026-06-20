import { MeBio, MeProfile, Me, Options, FullMe } from "@/app/(authenticated)/types";
import { fetchWithAuth } from "@/app/(authenticated)/actions";

export async function getOptions(): Promise<Options> {
    const response = await fetchWithAuth<Options>(`/me/bio/options`, {
        method: 'GET',
    })

    if (!response.ok) throw new Error(response.data.message);

    return response.data;
}

export async function getAuthenticatedUserData(): Promise<FullMe> {
    const [meRes, profileRes, bioRes] = await Promise.all([
        fetchWithAuth<Me>(`/me`, { cache: 'no-store' }),
        fetchWithAuth<MeProfile>(`/me/profile`, { cache: 'no-store' }),
        fetchWithAuth<MeBio>(`/me/bio`, { cache: 'no-store' }),
    ]);

    if (!meRes.ok) throw new Error(meRes.data.message);
    if (!profileRes.ok) throw new Error(profileRes.data.message);
    if (!bioRes.ok) throw new Error(bioRes.data.message);

    return { ...meRes.data, ...profileRes.data, ...bioRes.data };
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