import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
    title: 'My profile',
}

export default function Profile() {
    return (<h1>My profile content</h1>);
}