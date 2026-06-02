'use client'

import Form from "next/form";
import { login } from "../actions";
import { useActionState } from "react";
import Link from "next/link";
import {
    Card,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState = {
    error: ''
}

export default function Login() {
    const [state, formAction, pending] = useActionState(login, initialState)

    return (
        <>
            <Card className="w-full max-w-sm">
                <CardContent>
                    <Form action={formAction}>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="user@example.com"
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                </div>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="********"
                                    required />
                            </div>
                        </div>
                    </Form>
                </CardContent>
                <CardFooter className="flex-col gap-2">
                    <Button type="submit" className="w-full" disabled={pending}>
                        Log in
                    </Button>
                    <div className="mt-4">
                        <p>Don't have an account? <Link href="/register" className="underline">Register</Link></p>
                    </div>
                </CardFooter>
            </Card>

            {/*<div className="flex items-center justify-center h-screen">
                <div className="relative flex flex-col items-center">
                    <h1 className="absolute bottom-full mb-6 text-5xl font-bold title-font">Login</h1>

                    <div className="card card-border bg-base-100 w-96">
                        <div className="card-body">
                            <Form action={formAction}>
                                <fieldset className="fieldset mb-2">
                                    <label className="label">E-mail</label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        className="input w-full"
                                        placeholder="E-mail"
                                    />

                                    <label className="label">Password</label>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        className="input w-full"
                                        placeholder="Password"
                                    />

                                    {state?.error && (
                                        <p className="text-error text-sm mt-2">{state.error}</p>
                                    )}

                                    <div className="mt-2">
                                        <button type="submit" className="btn btn-block btn-neutral" disabled={pending}>Log in</button>
                                    </div>
                                </fieldset>
                            </Form>

                            <p className="text-center">Don't have an account? <Link href="/register" className="link">Register</Link></p>
                        </div>
                    </div>
                </div>
            </div>*/}
        </>
    );
}