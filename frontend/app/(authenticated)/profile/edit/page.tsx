import { getProfileEditFormData } from "@/app/(authenticated)/profile/edit/data";
import { getOptions } from "@/app/(authenticated)/profile/edit/data";
import ProfileEditForm from "@/app/(authenticated)/profile/edit/ProfileEditForm";
import { Options } from "@/app/(authenticated)/profile/types";

export default async function ProfileEdit() {
    const options: Options = await getOptions();
    const data = await getProfileEditFormData();

    return (
        <ProfileEditForm options={options} data={data} />
    );
}