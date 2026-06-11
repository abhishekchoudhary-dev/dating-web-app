"use client"

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

import { Options } from "@/app/(authenticated)/types";
import { Controller, useForm } from "react-hook-form";
import { updateProfile } from "@/app/(authenticated)/profile/update/actions";
import { ProfileEditFormFields } from "@/app/(authenticated)/profile/update/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React, { useRef, useState } from "react";
import { ImageIcon, PencilIcon, UserIcon, XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { toast } from "sonner";

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
        setError,
        formState: { errors },
    } = useForm<ProfileEditFormFields>({ defaultValues: data })

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);

    const anchor = useComboboxAnchor()

    const onSubmit = async (data: ProfileEditFormFields) => {
        const response = await updateProfile(data);

        const fieldMap: Record<string, keyof ProfileEditFormFields> = {
            'preferenceAgeMin': 'preferenceAgeRange',
            'preferenceAgeMax': 'preferenceAgeRange'
        };

        if (response?.errors && Object.keys(response.errors).length > 0) {
            Object.entries(response.errors).forEach(([field, messages]) => {
                const key = field.includes('.') ? field.split('.')[1] : field;
                const mappedKey = fieldMap[key] ?? key;
                setError(mappedKey as keyof ProfileEditFormFields, {
                    message: (messages as string[]).join(', ')
                });
            });
        } else if (response?.message) {
            setError('root', { message: response.message });
        } else {
            toast("Profile saved", { position: "top-center" })
            router.refresh();
            if (redirectTo) router.push(redirectTo)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6">
            <div className="space-y-3 flex justify-center">
                <Controller
                    name="profilePictureLink"
                    control={control}
                    render={({ field }) => (
                        <div className="relative w-fit">
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

                            {field.value && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        field.onChange(null);
                                        setValue("profilePictureFile", null);
                                    }}
                                    aria-label="Remove profile photo"
                                    className="absolute top-0 left-0 z-20 flex items-center justify-center size-8 rounded-full bg-destructive border-2 border-background"
                                >
                                    <XIcon color="white" size={14} />
                                </button>
                            )}
                        </div>
                    )}
                />
            </div>

            <div className="space-y-3">
                <Controller
                    name="name"
                    control={control}
                    render={
                    ({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="name">Name</FieldLabel>
                            <Input
                                {...register("name")}
                                aria-invalid={fieldState.invalid}
                                id="name"
                                type="text"
                                placeholder="Your name"
                            />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )
                }
                />
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
                <div className="space-y-3">
                    <Controller
                        name="age"
                        control={control}
                        render={
                            ({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="age">Age</FieldLabel>
                                    <Input
                                        {...register("age", { valueAsNumber: true })}
                                        aria-invalid={fieldState.invalid}
                                        id="age"
                                        type="number"
                                        placeholder="Your age"
                                        required
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )
                        }
                    />
                </div>
                <div className="space-y-3">
                    <Controller
                        name="gender"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="gender">Gender</FieldLabel>
                                <Select value={field.value ?? ''} onValueChange={field.onChange} >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Gender" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Gender</SelectLabel>
                                            {options.genders.map((gender) =>
                                                <SelectItem key={gender.name} id={gender.name} value={gender.name}>{gender.emoji} {gender.displayName}</SelectItem>
                                            )}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                </div>
                <div className="space-y-3">
                    <Controller
                        name="location"
                        control={control}
                        render={
                            ({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="location">Location</FieldLabel>
                                    <Input
                                        {...register("location")}
                                        aria-invalid={fieldState.invalid}
                                        id="location"
                                        placeholder="Your location"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )
                        }
                    />
                </div>
            </div>

            <div className="space-y-3">
                <Controller
                    name="aboutMe"
                    control={control}
                    render={
                        ({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="aboutMe">About me</FieldLabel>
                                <Textarea
                                    {...register("aboutMe")}
                                    aria-invalid={fieldState.invalid}
                                    id="aboutMe"
                                    placeholder="Write something about yourself"
                                    rows={4}
                                    className="resize-none"
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )
                    }
                />
            </div>

            <div className="space-y-3">
                <Controller
                    name="languages"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="languages">Languages</FieldLabel>
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
                                    <ComboboxChipsInput placeholder="Languages" aria-invalid={fieldState.invalid} />
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
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />
            </div>

            <div className="space-y-3">
                <Controller
                    name="interests"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="interests">Interests</FieldLabel>
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
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
                <div className="space-y-3">
                    <Controller
                        name="preferenceGender"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field>
                                <FieldLabel htmlFor="preferenceGender">Gender preference</FieldLabel>
                                <Select
                                    aria-invalid={fieldState.invalid}
                                    value={field.value ?? ''}
                                    onValueChange={field.onChange}
                                >
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
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                </div>
                <div className="space-y-3">
                    <Controller
                        name="preferenceAgeRange"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="preferenceAgeRange">Age range preference</FieldLabel>
                                <div className="flex items-center gap-3 w-full mt-2">
                                    <span className="text-sm text-muted-foreground w-6 text-right">{field.value[0]}</span>
                                    <Slider
                                        value={field.value}
                                        aria-invalid={fieldState.invalid}
                                        onValueChange={field.onChange}
                                        min={18}
                                        max={90}
                                        step={1}
                                    />
                                    <span className="text-sm text-muted-foreground w-6">{field.value[1]}</span>
                                </div>
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                </div>
                <div className="space-y-3">
                    <Controller
                        name="preferenceDistanceRadius"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="preferenceDistanceRadius">Distance radius preference</FieldLabel>
                                <div className="flex items-center gap-3 w-full mt-2">
                                    <Slider
                                        value={field.value}
                                        aria-invalid={fieldState.invalid}
                                        onValueChange={field.onChange}
                                        min={1}
                                        max={100}
                                        step={1}
                                    />
                                    <span className="text-sm text-muted-foreground w-6">{field.value[0]}km</span>
                                </div>
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                </div>
            </div>

            <div className="flex justify-end">
                <Button type="submit">Save profile</Button>
            </div>
        </form>
    );
}