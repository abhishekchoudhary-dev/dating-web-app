'use client'

import Form from "next/form";
import { login } from "../actions";
import { useActionState } from "react";
import Link from "next/link";

const initialState = {
    error: ''
}

export default function Login() {
    const [state, formAction, pending] = useActionState(login, initialState)

    return (
        <>
            <div className="flex items-center justify-center h-screen">
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
            </div>
        </>
    );
}