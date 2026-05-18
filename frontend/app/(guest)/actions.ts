'use server'

import { cookies } from 'next/headers'
import setCookieParser, { Cookie } from 'set-cookie-parser';
import { redirect } from 'next/navigation';

const BASE_URL = 'http://localhost:8080/api';

export async function register(initialState: any, form: FormData) {
    const email = form.get('email')
    const password = form.get('password')

    const response = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
        return { error: 'Registration failed' }
    }

    await setResponseCookies(response.headers.getSetCookie());

    redirect('/discover');
}

export async function login(initialState: any, form: FormData) {
    const email = form.get('email')
    const password = form.get('password')

    const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
        return { error: 'Logging in failed' }
    }

    await setResponseCookies(response.headers.getSetCookie());

    redirect('/discover');
}

export async function logout() {
    const cookieStore = await cookies();
    cookieStore.delete('access_token');
    redirect('/login');
}

async function setResponseCookies(responseCookies: string[]) {
    const parsedCookies: Cookie[] = setCookieParser.parse(responseCookies);
    const cookieStore = await cookies();

    for (const c of parsedCookies) {
        cookieStore.set({
            name: c.name,
            value: c.value,
            httpOnly: c.httpOnly,
            secure: c.secure,
            sameSite: c.sameSite?.toLowerCase() as 'lax' | 'strict' | 'none' | undefined,
            path: c.path,
            domain: c.domain,
            maxAge: c.maxAge,
            expires: c.expires,
        })
    }
}