import { Options } from "@/app/(authenticated)/profile/types";
import { getOptions, getProfileEditFormData } from "@/app/(authenticated)/profile/update/data";
import ProfileEditForm from "@/app/(authenticated)/profile/update/ProfileEditForm";

export default async function page() {
    const options: Options = await getOptions();
    const data = await getProfileEditFormData();

    return (
        <main className="flex flex-col min-h-screen items-center justify-center p-4">
            <div className="flex flex-col justify-center items-center mb-6">
                <h1 className="text-3xl font-semibold">Complete your profile</h1>
                <p className="text-muted-foreground">Enter your details to start matching.</p>
            </div>
            <ProfileEditForm options={options} data={data} redirectTo="/discover" />
        </main>
    );
}