"use server"

import { ProfileEditFormFields } from "@/app/(authenticated)/profile/update/types";
import { fetchWithAuth } from "@/app/(authenticated)/actions";
import { FullUser } from "@/app/(authenticated)/types";

export async function updateProfile(data: ProfileEditFormFields) {
    if (data.profilePictureFile) {
        const formData = new FormData();
        formData.append("file", data.profilePictureFile);
        await fetchWithAuth(`/me/profile-picture`, {
            method: 'PUT',
            body: formData,
        });
    } else if (data.profilePictureLink === null) {
        await fetchWithAuth(`/me/profile-picture`, {
            method: 'DELETE',
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

    const response = await fetchWithAuth<FullUser>(`/me`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })

    if (!response.ok) {
        const apiError = response.data
        return {
            message: apiError.message,
            errors: apiError.errors ?? {}
        }
    }
}