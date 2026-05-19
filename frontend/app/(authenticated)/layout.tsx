import React from "react";
import Form from "next/form";

import { getAuthenticatedUser } from "@/app/(authenticated)/actions";
import { logout } from "@/app/(guest)/actions";

import { CompassIcon, GearSixIcon, HeartIcon, SignOutIcon, UserIcon } from '@phosphor-icons/react/ssr';
import Navbar from "@/app/components/Navbar";
import { Menu, MenuItem } from "@/app/components/ui/Menu";


export default async function AuthenticatedLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    const user = await getAuthenticatedUser();

    const navigation = (
        <Menu className="menu-horizontal gap-2">
            <MenuItem href="/matches" title="Matches" icon={<HeartIcon size={24} />} />
            <MenuItem href="/discover" title="Discover" icon={<CompassIcon size={24} />} />
            <MenuItem href="/profile" title="Profile" icon={<UserIcon size={24} />} />
        </Menu>
    );

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

                <Menu className="dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                    <MenuItem href="/settings" title="Settings" icon={<GearSixIcon size={24} />} />
                    <Form action={logout}>
                        <li>
                            <button type="submit">
                                <SignOutIcon size={24} className="link"/> Log out
                            </button>
                        </li>
                    </Form>
                </Menu>
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