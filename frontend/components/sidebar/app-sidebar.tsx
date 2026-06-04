"use client"

import * as React from "react"

import { NavMain } from "@/components/sidebar/nav-main"
import { NavUser } from "@/components/sidebar/nav-user"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import { HeartIcon, CompassIcon, UserIcon } from "lucide-react"
import { MeResponse } from "@/app/(authenticated)/types";

const data = {
  navMain: [
    {
      title: "Discover",
      url: "/discover",
      icon: ( <CompassIcon /> ),
    },
    {
      title: "Matches",
      url: "/matches",
      icon: ( <HeartIcon/> ),
    },
    {
      title: "My profile",
      url: "/profile",
      icon: ( <UserIcon/> ),
    },
  ]
}

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  user: MeResponse
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <HeartIcon className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-2xl leading-tight">
                  <span className="truncate font-semibold">Match Me</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}