'use client'

import Link from "next/link";
import { loginUser, registerUser } from "@/app/(guest)/actions";

import {
    Card,
    CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Controller, useForm } from "react-hook-form";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";

type LoginForm = {
    email: string
    password: string
}

export default function Login() {
    const {
        register,
        handleSubmit,
        control,
        setError,
        formState: { errors }
    } = useForm<LoginForm>()

    async function onSubmit(data: LoginForm) {
        const result = await loginUser(data);

        if (result?.errors && Object.keys(result.errors).length > 0) {
            Object.entries(result.errors).forEach(([field, messages]) => {
                setError(field as keyof LoginForm, {
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
                                <Button onClick={handleSubmit(onSubmit)}>
                                    Log in
                                </Button>
                                {errors.root && (
                                    <FieldError className="text-center" role="alert">
                                        {errors.root.message}
                                    </FieldError>
                                )}
                                <FieldDescription className="text-center">
                                    Don&apos;t have an account? <Link href="/register" className="underline">Register</Link>
                                </FieldDescription>
                            </Field>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </>
    );
}