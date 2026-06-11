import { getProfileEditFormData } from "@/app/(authenticated)/profile/update/data";
import { getOptions } from "@/app/(authenticated)/profile/update/data";
import ProfileEditForm from "@/app/(authenticated)/profile/update/ProfileEditForm";
import { Options } from "@/app/(authenticated)/types";

export default async function ProfileEdit() {
    const options: Options = await getOptions();
    const data = await getProfileEditFormData();

    return (
        <ProfileEditForm options={options} data={data} />
    );
}