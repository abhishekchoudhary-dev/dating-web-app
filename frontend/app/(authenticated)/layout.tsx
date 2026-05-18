import React from "react";
import Form from "next/form";
import { getAuthenticatedUser } from "@/app/(authenticated)/actions";
import { logout } from "@/app/(guest)/actions";


import { CompassIcon, GearSixIcon, HeartIcon, SignOutIcon, UserIcon } from '@phosphor-icons/react/ssr';
import Navbar from "@/app/components/Navbar";
import NavLinks from "@/app/components/NavLinks";

const navLinks = [
    {
        href: '/matches',
        title: 'Matches',
        icon: <HeartIcon size={24} />
    },
    {
        href: '/discover',
        title: 'Discover',
        icon: <CompassIcon size={24} />
    },
    {
        href: '/profile',
        title: 'Profile',
        icon: <UserIcon size={24} />
    }
]

export default async function AuthenticatedLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    const user = await getAuthenticatedUser();

    const navigation = (<NavLinks links={navLinks} />);

    const menu = (
        <>
            <span>{user.email}</span>
            <div className="dropdown dropdown-end ml-2">
                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                    <div className="w-10 rounded-full">
                        <img
                            alt="Tailwind CSS Navbar component"
                            src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"/>
                    </div>
                </div>
                <ul
                    tabIndex={-1}
                    className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                    <li>
                        <a><GearSixIcon size={24} /> Settings</a>
                    </li>
                    <Form action={logout}>
                        <li>
                            <button type="submit">
                                <SignOutIcon size={24} className="link"/> Log out
                            </button>
                        </li>
                    </Form>
                </ul>
            </div>
        </>
    );

    return (
        <>
            <Navbar center={navigation} end={menu} />

            <div className="mx-auto max-w-7xl p-4">
                {children}
            </div>
        </>
    );
}