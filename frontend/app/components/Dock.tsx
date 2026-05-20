import { Menu, MenuItem } from "@/app/components/ui/Menu";
import { CompassIcon, HeartIcon, UserIcon } from "@phosphor-icons/react/ssr";
import React from "react";

export default function Dock() {
    return (
        <div className="block lg:hidden">
            <div className="fixed bottom-0 py-2 gap-2 w-full flex justify-center shadow-inner">
                <Menu className="menu-horizontal gap-2">
                    <MenuItem href="/matches" title="Matches" icon={<HeartIcon size={24} />} />
                    <MenuItem href="/discover" title="Discover" icon={<CompassIcon size={24} />} />
                    <MenuItem href="/profile" title="Profile" icon={<UserIcon size={24} />} />
                </Menu>
            </div>
        </div>
    );
}