'use client'

import Link from "next/link";
import { loginUser } from "@/app/(guest)/actions";

import {
    Card,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";

type LoginForm = {
    email: string
    password: string
}

export default function Login() {
    const { register, handleSubmit, setError, formState: { errors } } = useForm<LoginForm>()

    async function onSubmit(data: LoginForm) {
        const result = await loginUser(data);
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
                                <Button onClick={handleSubmit(onSubmit)}>
                                    Log in
                                </Button>
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