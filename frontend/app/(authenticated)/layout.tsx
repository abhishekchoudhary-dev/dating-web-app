import React from "react";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { Separator } from "@/components/ui/separator";
import PageTitle from "@/components/PageTitle";
import { getAuthenticatedUser } from "@/app/(authenticated)/actions";
import { Me } from "@/app/(authenticated)/types";
import { cookies } from "next/headers";
import GlobalWebSocketConnector from "@/components/realtime/GlobalWebSocketConnector";

export default async function AuthenticatedLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    const user: Me = await getAuthenticatedUser();
    //get token for global web socket connector
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value ?? '';

    return (
        <SidebarProvider>
            <AppSidebar user={user} />
            <SidebarInset>
                <header className="flex justify-between h-16 shrink-0 items-center gap-2">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator
                            orientation="vertical"
                            className="mr-2 data-vertical:h-4 data-vertical:self-auto"
                        />
                    </div>

                    <PageTitle />
                </header>
                <GlobalWebSocketConnector token={token}>
                    <div className="flex justify-center p-2 mx-auto max-w-4xl w-full">
                        { children }
                    </div>
                </GlobalWebSocketConnector>
            </SidebarInset>
        </SidebarProvider>
    )
}