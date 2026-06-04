"use client"

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";

import {
    Combobox,
    ComboboxChip,
    ComboboxChips,
    ComboboxChipsInput,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxItem,
    ComboboxList,
    ComboboxValue, useComboboxAnchor,
} from "@/components/ui/combobox"

import { Button } from "@/components/ui/button";

import { Options } from "@/app/(authenticated)/profile/types";
import { Controller, useForm } from "react-hook-form";
import { updateProfile } from "@/app/(authenticated)/profile/update/actions";
import { ProfileEditFormFields } from "@/app/(authenticated)/profile/update/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React, { useRef, useState } from "react";
import { ImageIcon, PencilIcon, UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";

type ProfileEditFormProps = {
    options: Options
    data: ProfileEditFormFields
    redirectTo?: string
}

export default function ProfileEditForm({ options, data, redirectTo }: ProfileEditFormProps) {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        control,
        setValue,
        formState: { errors },
    } = useForm<ProfileEditFormFields>({ defaultValues: data })

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);

    const anchor = useComboboxAnchor()

    const onSubmit = async (data: ProfileEditFormFields) => {
        const response = await updateProfile(data);
        router.refresh();
        if (redirectTo) router.push(redirectTo)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6">
            <div className="space-y-3 flex justify-center">
                <Controller
                    name="profilePictureLink"
                    control={control}
                    render={({ field }) => (
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            aria-label="Upload profile photo"
                            className="relative rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-pointer"
                        >
                            <Avatar className="size-42">
                                <AvatarImage src={field.value} alt="Profile photo" />
                                <AvatarFallback className="text-xl">
                                    <UserIcon size={50}/>
                                </AvatarFallback>
                            </Avatar>

                            <span className="z-20 absolute bottom-0 right-0 flex items-center justify-center size-12 rounded-full bg-primary border-2 border-background">
                                <PencilIcon color="white" size={24} />
                            </span>

                            <div className="absolute inset-0 rounded-full flex items-center justify-center bg-black/0 hover:bg-black/40 transition-colors group">
                                <ImageIcon className="size-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                aria-hidden="true"
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;
                                    setAvatarFile(file);
                                    const reader = new FileReader();
                                    reader.onload = (e: ProgressEvent<FileReader>) => {
                                        if (e.target?.result) {
                                            field.onChange(e.target.result as string);
                                            setValue("profilePictureFile", file)
                                        }
                                    };
                                    reader.readAsDataURL(file);
                                    e.target.value = "";
                                }}
                            />
                        </button>
                    )}
                />
            </div>

            <div className="space-y-3">
                <Label htmlFor="name">Name</Label>
                <Input
                    {...register("name")}
                    id="name"
                    type="text"
                    placeholder="Your name"
                />
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
                <div className="space-y-3">
                    <Label htmlFor="age">Age</Label>
                    <Input
                        {...register("age", { valueAsNumber: true })}
                        id="age"
                        type="number"
                        placeholder="Your age"
                    />
                </div>
                <div className="space-y-3">
                    <Label htmlFor="gender">Gender</Label>
                    <Controller
                        name="gender"
                        control={control}
                        render={({ field }) => (
                            <Select value={field.value} onValueChange={field.onChange} >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Gender" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Gender</SelectLabel>
                                        {options.genders.map((gender) =>
                                            <SelectItem key={gender.name} value={gender.name}>{gender.emoji} {gender.displayName}</SelectItem>
                                        )}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        )}
                    />
                </div>
                <div className="space-y-3">
                    <Label htmlFor="location">Location</Label>
                    <Input
                        {...register("location")}
                        id="location"
                        placeholder="Your location"
                    />
                </div>
            </div>

            <div className="space-y-3">
                <Label htmlFor="aboutMe">About me</Label>
                <Textarea
                    {...register("aboutMe")}
                    id="aboutMe"
                    placeholder="Write something about yourself"
                    rows={4}
                    className="resize-none"
                />
            </div>

            <div className="space-y-3">
                <Label htmlFor="languages">Languages</Label>
                <Controller
                    name="languages"
                    control={control}
                    render={({ field }) => (
                        <Combobox
                            items={options.languages}
                            multiple
                            value={field.value}
                            onValueChange={(values) => {
                                if (values.length <= 3) {
                                    field.onChange(values);
                                }
                            }}
                            isItemEqualToValue={(item, value) => item.name === value.name}
                        >
                            <ComboboxChips ref={anchor}>
                                <ComboboxValue>
                                    {field.value.map((item) => (
                                        <ComboboxChip key={item.name}>{item.emoji} {item.displayName}</ComboboxChip>
                                    ))}
                                </ComboboxValue>
                                <ComboboxChipsInput placeholder="Languages" />
                            </ComboboxChips>
                            <ComboboxContent anchor={anchor}>
                                <ComboboxEmpty>No items found.</ComboboxEmpty>
                                <ComboboxList>
                                    {(item) => (
                                        <ComboboxItem key={item.name} value={item}>
                                            {item.emoji} {item.displayName}
                                        </ComboboxItem>
                                    )}
                                </ComboboxList>
                            </ComboboxContent>
                        </Combobox>
                    )}
                />
            </div>

            <div className="space-y-3">
                <Label htmlFor="interests">Interests</Label>
                <Controller
                    name="interests"
                    control={control}
                    render={({ field }) => (
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                            {options.interests.map((interest) => {
                                const selected = field.value.some((v) => v.name === interest.name)
                                return (
                                    <Badge
                                        key={interest.name}
                                        variant={selected ? "default" : "outline"}
                                        className="p-4 w-full text-sm cursor-pointer"
                                        onClick={() =>
                                            field.onChange(
                                                selected
                                                    ? field.value.filter((v) => v.name !== interest.name)
                                                    : [...field.value, interest]
                                            )
                                        }
                                    >
                                        {interest.emoji} {interest.displayName}
                                    </Badge>
                                )
                            })}
                        </div>
                    )}
                />
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
                <div className="space-y-3">
                    <Label htmlFor="username">Gender preference</Label>
                    <Controller
                        name="preferenceGender"
                        control={control}
                        render={({ field }) => (
                            <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Gender preference" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Gender preference</SelectLabel>
                                        {options.genderPreferences.map((gender) => (
                                            <SelectItem key={gender.name} value={gender.name}>
                                                {gender.emoji} {gender.displayName}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        )}
                    />
                </div>
                <div className="space-y-3">
                    <Label>Age range</Label>
                    <div className="flex items-end h-7">
                        <Controller
                            name="preferenceAgeRange"
                            control={control}
                            render={({ field }) => (
                                <div className="flex items-center gap-3 w-full">
                                    <span className="text-sm text-muted-foreground w-6 text-right">{field.value[0]}</span>
                                    <Slider
                                        value={field.value}
                                        onValueChange={field.onChange}
                                        min={18}
                                        max={90}
                                        step={1}
                                    />
                                    <span className="text-sm text-muted-foreground w-6">{field.value[1]}</span>
                                </div>
                            )}
                        />
                    </div>
                </div>
                <div className="space-y-3">
                    <Label>Distance radius</Label>
                    <div className="flex items-end h-7">
                        <Controller
                            name="preferenceDistanceRadius"
                            control={control}
                            render={({ field }) => (
                                <div className="flex items-center gap-3 w-full">
                                    <Slider
                                        value={field.value}
                                        onValueChange={field.onChange}
                                        min={1}
                                        max={100}
                                        step={1}
                                    />
                                    <span className="text-sm text-muted-foreground w-6">{field.value[0]}km</span>
                                </div>
                            )}
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-end">
                <Button type="submit">Save profile</Button>
            </div>
        </form>
    );
}