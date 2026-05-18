'use client'

import Form from "next/form";
import { login } from "../actions";
import { useActionState } from "react";

const initialState = {
    error: ''
}

export default function Login() {
    const [state, formAction, pending] = useActionState(login, initialState)

    return (
        <>
            <h1>Login</h1>

            <Form action={formAction}>
                <input type="email" name="email" />
                <input type="password" name="password" />
                <p>{state?.error}</p>
                <button type="submit" disabled={pending}>Log in</button>
            </Form>
        </>
    );
}