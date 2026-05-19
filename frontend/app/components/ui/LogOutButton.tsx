'use client'

import { LogOut } from "lucide-react";
import { logout } from "@/app/(guest)/actions";

export default function LogOutButton() {
    return (
        <a onClick={async () => await logout()}>
            <LogOut /> Log out
        </a>
    );
}