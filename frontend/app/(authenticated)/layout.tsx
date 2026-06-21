import React from "react";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { Separator } from "@/components/ui/separator";
import PageTitle from "@/components/PageTitle";
import { fetchWithAuth, getAuthenticatedUser } from "@/app/(authenticated)/actions";
import { UnreadProvider } from "@/app/(authenticated)/unread/UnreadContext";
import { Me } from "@/app/(authenticated)/types";
import { cookies } from "next/headers";
import GlobalWebSocketConnector from "@/components/realtime/GlobalWebSocketConnector";

export default async function AuthenticatedLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    const user: Me = await getAuthenticatedUser();
    //get token for global web socket connector
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value ?? '';

    const unreadRes = await fetchWithAuth<number>('/messages/unread');
    const unreadTotal = unreadRes.ok ? unreadRes.data : 0;

    return (
        <GlobalWebSocketConnector token={token}>
            <UnreadProvider currentUserEmail={user.email} initialTotal={unreadTotal}>
                <SidebarProvider>
                    <AppSidebar user={user} unreadTotal={unreadTotal} />
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

                        <div className="flex justify-center p-2 mx-auto max-w-4xl w-full">
                            { children }
                        </div>
                    </SidebarInset>
                </SidebarProvider>
            </UnreadProvider>
        </GlobalWebSocketConnector>
    )
}