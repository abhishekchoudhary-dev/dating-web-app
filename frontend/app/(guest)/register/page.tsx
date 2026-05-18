'use client'

import Form from "next/form";
import { register } from "../actions";
import { useActionState } from "react";

const initialState = {
    error: ''
}

export default function Register() {
    const [state, formAction, pending] = useActionState(register, initialState)

    return (
        <>
            <h1>Register</h1>

            <Form action={formAction}>
                <input type="email" name="email" />
                <input type="password" name="password" />
                <p>{state?.error}</p>
                <button type="submit" disabled={pending}>Register</button>
            </Form>
        </>
    );
}