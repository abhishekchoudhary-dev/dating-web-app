import { cookies } from "next/headers";
import { UserBioResponse, UserProfileResponse, UserResponse } from "@/app/(authenticated)/profile/edit/types";
import { Option } from "@/app/(authenticated)/profile/types";

export async function getOptions() {
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;

    const response = await fetch(`http://localhost:8080/api/me/bio/options`, {
        method: 'GET',
        headers: { Cookie: `access_token=${token}` }
    })

    return response.json();
}

export async function getAuthenticatedUserData() {
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;

    const [meRes, profileRes, bioRes] = await Promise.all([
        fetch(`http://localhost:8080/api/me`, {
            method: 'GET',
            headers: { Cookie: `access_token=${token}` },
        }),
        fetch(`http://localhost:8080/api/me/profile`, {
            method: 'GET',
            headers: { Cookie: `access_token=${token}` },
        }),
        fetch(`http://localhost:8080/api/me/bio`, {
            method: 'GET',
            headers: { Cookie: `access_token=${token}` },
        }),
    ])

    const data: UserResponse & UserProfileResponse & UserBioResponse = {
        ...await meRes.json(),
        ...await profileRes.json(),
        ...await bioRes.json(),
    }

    return data;
}

export async function getProfileEditFormData() {
    const data = await getAuthenticatedUserData();

    console.log(data)

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