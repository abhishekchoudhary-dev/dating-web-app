import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Match Me - Profile",
};

export default function Profile() {
    return (
        <>
            <h1 className="text-5xl font-bold">Profile</h1>
        </>
    );
}