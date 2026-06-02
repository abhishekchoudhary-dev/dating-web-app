'use client'

import { useForm } from "react-hook-form"
import Link from "next/link";
import { registerUser } from "@/app/(guest)/actions";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";


type RegisterForm = {
    email: string
    password: string
}

export default function Register() {
    const { register, handleSubmit, setError, formState: { errors } } = useForm<RegisterForm>()

    async function onSubmit(data: RegisterForm) {
        const result = await registerUser(data);
        console.log(result)
    }

    return (
        <>
            <Card className="w-full max-w-sm">
                <CardContent>
                    <form>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="email">E-mail</FieldLabel>
                                <Input
                                    {...register("email")}
                                    id="email"
                                    type="email"
                                    placeholder="user@example.com"
                                    required
                                />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="password">Password</FieldLabel>
                                <Input
                                    {...register("password")}
                                    id="password"
                                    type="password"
                                    placeholder="********"
                                    required />
                            </Field>
                            <Field>
                                <Button
                                    onClick={handleSubmit(onSubmit)}
                                    className="w-full">
                                    Register
                                </Button>
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