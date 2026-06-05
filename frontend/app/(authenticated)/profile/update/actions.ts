"use server"

import { cookies } from "next/headers";
import { ProfileEditFormFields } from "@/app/(authenticated)/profile/update/types";

export async function updateProfile(data: ProfileEditFormFields) {
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;

    if (data.profilePictureFile) {
        const formData = new FormData();
        formData.append("file", data.profilePictureFile);
        await fetch(`http://localhost:8080/api/me/profile-picture`, {
            method: 'PUT',
            headers: { Cookie: `access_token=${token}` },
            body: formData,
        });
    }

    const payload = {
        user: {
            name: data.name
        },
        profile: {
            aboutMe: data.aboutMe
        },
        bio: {
            age: data.age,
            gender: data.gender,
            interests: data.interests.map(i => i.name),
            languages: data.languages.map(l => l.name),
            location: data.location,
            preferenceGender: data.preferenceGender,
            preferenceAgeMin: data.preferenceAgeRange[0],
            preferenceAgeMax: data.preferenceAgeRange[1],
            preferenceDistanceRadius: data.preferenceDistanceRadius[0]
        }
    }

    const response = await fetch(`http://localhost:8080/api/me`, {
        method: 'PUT',
        headers: { Cookie: `access_token=${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })

    if (!response.ok) {
        const apiError = await response.json()
        return {
            message: apiError.message,
            errors: apiError.errors ?? {}
        }
    }
}