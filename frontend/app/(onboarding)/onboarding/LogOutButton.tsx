"use client"

import { LogOutIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { logoutUser } from "@/app/(authenticated)/actions";

export default function LogOutButton() {
    return (
        <Button variant="outline" onClick={ async () => await logoutUser() }>
            <LogOutIcon />
            Log out
        </Button>
    );
}