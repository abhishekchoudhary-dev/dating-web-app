'use client'

import { Controller, useForm } from "react-hook-form"
import Link from "next/link";
import { registerUser } from "@/app/(guest)/actions";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";

type RegisterForm = {
    email: string
    password: string
}

export default function Register() {
    const {
        register,
        handleSubmit,
        control,
        setError,
        formState: { errors }
    } = useForm<RegisterForm>()

    async function onSubmit(data: RegisterForm) {
        const result = await registerUser(data);

        if (result?.errors && Object.keys(result.errors).length > 0) {
            Object.entries(result.errors).forEach(([field, messages]) => {
                setError(field as keyof RegisterForm, {
                    message: (messages as string[]).join(', ')
                });
            });
        } else if (result?.message) {
            setError('root', { message: result.message });
        }
    }

    return (
        <>
            <Card className="w-full max-w-sm">
                <CardContent>
                    <form>
                        <FieldGroup>
                            <Controller
                                name="email"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="email">E-mail</FieldLabel>
                                        <Input
                                            {...register("email")}
                                            aria-invalid={fieldState.invalid}
                                            id="email"
                                            type="email"
                                            placeholder="user@example.com"
                                            required
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />

                            <Controller
                                name="password"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="password">Password</FieldLabel>
                                        <Input
                                            {...register("password")}
                                            aria-invalid={fieldState.invalid}
                                            id="password"
                                            type="password"
                                            placeholder="********"
                                            required
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />

                            <Field>
                                <Button
                                    onClick={handleSubmit(onSubmit)}
                                    className="w-full">
                                    Register
                                </Button>
                                {errors.root && (
                                    <FieldError className="text-center" role="alert">
                                        {errors.root.message}
                                    </FieldError>
                                )}
                                <FieldDescription className="text-center">
                                    Already have an account? <Link href="/login" className="underline">Log in</Link>
                                </FieldDescription>
                            </Field>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </>
    );
}