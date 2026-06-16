'use client'

import { useEffect, useState } from "react";
import { useWebSocket } from "@/components/realtime/WebSocketContext";

type Props = {
    currentUserEmail: string
    targetUserId: number
    className?: string
}

export default function OnlineStatusListener({ currentUserEmail, targetUserId, className }: Props) {
    const [isOnline, setIsOnline] = useState(false);
    const { client, isConnected } = useWebSocket();

    useEffect(() => {
        if (!client || !isConnected) return;

        const statusBroadcastSub = client.subscribe('/topic/status', (frame) => {
            const event = JSON.parse(frame.body);
            if (event.userId === targetUserId) {
                setIsOnline(event.online);
            }
        });

        const statusDirectSub = client.subscribe(`/user/${currentUserEmail}/queue/status`, (frame) => {
            const event = JSON.parse(frame.body);
            if (event.userId === targetUserId) {
                setIsOnline(event.online);
            }
        });

        setTimeout(() => {
            client.publish({
                destination: '/app/status/request',
                body: JSON.stringify({ userId: targetUserId })
            });
        }, 100);

        return () => {
            statusBroadcastSub.unsubscribe();
            statusDirectSub.unsubscribe();
        };
    }, [isConnected]);

    return (
        <span className={`size-3 rounded-full inline-block border-[3px] bg-background ${isOnline ? 'border-green-500' : 'border-gray-400'} ${className ?? ''}`} />
    );
}