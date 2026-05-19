import React from "react";
import Form from "next/form";

import { logout } from "@/app/(guest)/actions";

import { CompassIcon, GearSixIcon, HeartIcon, SignOutIcon, UserIcon } from '@phosphor-icons/react/ssr';
import Navbar from "@/app/components/Navbar";
import { Menu, MenuItem } from "@/app/components/ui/Menu";
import Dock from "@/app/components/Dock";
import PageTitle from "@/app/components/ui/PageTitle";
import Avatar from "@/app/components/ui/Avatar";

export default async function AuthenticatedLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    const navigation = (
        <Menu className="menu-horizontal gap-2">
            <MenuItem href="/matches" title="Matches" icon={<HeartIcon size={24} />} />
            <MenuItem href="/discover" title="Discover" icon={<CompassIcon size={24} />} />
            <MenuItem href="/profile" title="Profile" icon={<UserIcon size={24} />} />
        </Menu>
    );

    const menu = (
        <>
            <div className="dropdown dropdown-end ml-2">

                <button tabIndex={0} className="btn btn-ghost btn-circle">
                    <Avatar className="w-10" src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                </button>

                <Menu className="dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 gap-2 shadow">
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
                <div className="flex justify-between items-center mb-6">
                    <PageTitle />

                    {/* Only on mobile */}
                    <div className="block lg:hidden">
                        {menu}
                    </div>
                </div>

                {children}
            </div>

            <Dock />
        </>
    );
}