'use client'
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useWebSocket } from "@/components/realtime/WebSocketContext";
import { fetchWithAuth } from "@/app/(authenticated)/actions";

type UnreadContextType = { total: number; refresh: () => void };
const UnreadContext = createContext<UnreadContextType>({ total: 0, refresh: () => {} });
export const useUnread = () => useContext(UnreadContext);

export function UnreadProvider({currentUserEmail, initialTotal, children,}: {
    currentUserEmail: string;
    initialTotal: number;
    children: React.ReactNode;
}) {
    const [total, setTotal] = useState(initialTotal);
    const { client, isConnected } = useWebSocket();

    const refresh = useCallback(async () => {
        const res = await fetchWithAuth<number>('/messages/unread');
        if (res.ok) setTotal(res.data);
    }, []);

    useEffect(() => {
        if (!client || !isConnected) return;
        const sub = client.subscribe(
            `/user/${currentUserEmail}/queue/unread`,
            () => refresh()
        );
        return () => sub.unsubscribe();
    }, [client, isConnected, currentUserEmail, refresh]);

    return (
        <UnreadContext.Provider value={{ total, refresh }}>
            {children}
        </UnreadContext.Provider>
    );
}