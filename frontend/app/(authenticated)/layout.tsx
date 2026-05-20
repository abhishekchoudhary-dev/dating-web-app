import React from "react";
import { ChevronsUpDown, Compass, Heart, Menu, Settings, User, X } from "lucide-react";
import Link from "next/link";
import PageTitle from "@/app/components/ui/PageTitle";
import LogOutButton from "@/app/components/ui/LogOutButton";

export default async function AuthenticatedLayout({ children }: Readonly<{ children: React.ReactNode }>) {

    return (
        <>
            <div className="drawer lg:drawer-open">
                <input id="sidebar-left" type="checkbox" className="drawer-toggle"/>
                <div className="drawer-content p-6">
                    <div className="flex items-center mb-4">
                        <label htmlFor="sidebar-left" className="btn btn-ghost btn-circle drawer-button mr-4 lg:hidden">
                            <Menu />
                        </label>
                        <PageTitle />
                    </div>

                    {children}
                </div>
                <div className="drawer-side border-r border-base-300">
                    <label htmlFor="sidebar-left" aria-label="close sidebar" className="drawer-overlay"></label>

                    <div className="bg-base-100 min-h-full w-80 p-4 flex flex-col">
                        <div className="flex items-center justify-center gap-2 p-4">
                            <Heart fill="red" stroke="red"/>
                            <h1 className="text-3xl font-bold">Match Me</h1>
                        </div>

                        <ul className="menu gap-2 w-full flex-0">
                            <li>
                                <Link href="/discover"><Compass/> Discover</Link>
                            </li>
                            <li>
                                <Link href="/matches"><Heart /> Matches</Link>
                            </li>
                            <li>
                                <Link href="/profile"><User/> Profile</Link>
                            </li>
                        </ul>

                        <div className="mt-auto">
                            <div className="dropdown dropdown-top dropdown-center w-full">
                                <button
                                    tabIndex={0} role="button"
                                    className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-base-300 transition cursor-pointer">
                                    <div className="avatar">
                                        <div className="w-12 rounded-full">
                                            <img src="https://img.daisyui.com/images/profile/demo/batperson@192.webp"/>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-start flex-1 min-w-0">
                                    <span className="font-semibold truncate w-full text-left">
                                        John Doe
                                    </span>
                                        <span className="text-sm opacity-60 truncate w-full text-left">
                                        john@doe.com
                                    </span>
                                    </div>
                                    <ChevronsUpDown/>
                                </button>

                                <ul tabIndex={-1}
                                    className="dropdown-content menu bg-base-100 rounded-box z-1 w-full p-2 shadow-sm gap-2 mb-2">
                                    <li><Link href="/settings"><Settings /> Settings</Link></li>
                                    <li><LogOutButton /></li>
                                </ul>
                            </div>
                        </div>

                        <label
                            htmlFor="sidebar-left"
                            className="btn btn-circle absolute left-85 z-20"
                            aria-label="close sidebar"
                        >
                            <X />
                        </label>
                    </div>

                </div>
            </div>
        </>
    );
}