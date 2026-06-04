"use server"

import { cookies } from "next/headers";
import { ProfileEditFormFields } from "@/app/(authenticated)/profile/update/types";

export async function updateProfile(data: ProfileEditFormFields) {
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;

    const requests = [];

    if (data.profilePictureFile) {
        const formData = new FormData();
        formData.append("file", data.profilePictureFile);
        requests.push(fetch(`http://localhost:8080/api/me/profile-picture`, {
            method: 'PUT',
            headers: { Cookie: `access_token=${token}` },
            body: formData,
        }));
    }

    requests.push(
        fetch(`http://localhost:8080/api/me`, {
            method: 'PATCH',
            headers: { Cookie: `access_token=${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: data.name })
        }),
        fetch(`http://localhost:8080/api/me/profile`, {
            method: 'PUT',
            headers: { Cookie: `access_token=${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ aboutMe: data.aboutMe })
        }),
        fetch(`http://localhost:8080/api/me/bio`, {
            method: 'PUT',
            headers: { Cookie: `access_token=${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                age: data.age,
                gender: data.gender,
                interests: data.interests.map(i => i.name),
                languages: data.languages.map(l => l.name),
                location: data.location,
                preferenceGender: data.preferenceGender,
                preferenceAgeMin: data.preferenceAgeRange[0],
                preferenceAgeMax: data.preferenceAgeRange[1],
                preferenceDistanceRadius: data.preferenceDistanceRadius[0]
            })
        }),
    );

    await Promise.all(requests);
}