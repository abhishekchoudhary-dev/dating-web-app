'use server'

import { cookies } from 'next/headers'
import setCookieParser, { Cookie } from 'set-cookie-parser';
import { redirect } from 'next/navigation';

const BASE_URL = 'http://localhost:8080/api';

export async function registerUser(form: any) {
    const response = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form }),
    })

    if (!response.ok) {
        return { error: 'Registration failed' }
    }

    await setResponseCookies(response.headers.getSetCookie());

    redirect('/discover');
}

export async function loginUser(form: any) {
    const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form }),
    })

    if (!response.ok) {
        return { error: 'Logging in failed' }
    }

    await setResponseCookies(response.headers.getSetCookie());

    redirect('/discover');
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