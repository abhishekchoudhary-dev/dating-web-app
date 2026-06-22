'use client'

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useWebSocket } from "@/components/realtime/WebSocketContext";
import { fetchWithAuth } from "@/app/(authenticated)/actions";

type LikesContextType = { total: number; refresh: () => void };
const LikesContext = createContext<LikesContextType>({ total: 0, refresh: () => {} });
export const useLikes = () => useContext(LikesContext);

export function LikesProvider({
    currentUserEmail,
    initialTotal,
    children,
}: {
    currentUserEmail: string;
    initialTotal: number;
    children: React.ReactNode;
}) {
    const [total, setTotal] = useState(initialTotal);
    const { client, isConnected } = useWebSocket();

    const refresh = useCallback(async () => {
        const res = await fetchWithAuth<number>('/connections/pending/count');
        if (res.ok) setTotal(res.data);
    }, []);

    useEffect(() => {
        if (!client || !isConnected) return;
        const sub = client.subscribe(
            `/user/${currentUserEmail}/queue/likes`,
            () => refresh()
        );
        return () => sub.unsubscribe();
    }, [client, isConnected, currentUserEmail, refresh]);

    return (
        <LikesContext.Provider value={{ total, refresh }}>
            {children}
        </LikesContext.Provider>
    );
}