'use client'

import { useEffect } from "react";
import { useWebSocket } from "@/components/realtime/WebSocketContext";

type Props = {
    currentUserEmail: string
    matchIds: number[]
    onUnreadUpdate: (senderId: number, count: number) => void
    onStatusUpdate: (userId: number, online: boolean) => void
}

export default function RealtimeListener({ currentUserEmail, matchIds, onUnreadUpdate, onStatusUpdate }: Props) {
    const { client, isConnected } = useWebSocket();

    useEffect(() => {
        if (!client || !isConnected) return;

        const unreadSub = client.subscribe(`/user/${currentUserEmail}/queue/unread`, (frame) => {
            const data = JSON.parse(frame.body);
            onUnreadUpdate(data.senderId, data.count);
        });

        const statusBroadcastSub = client.subscribe('/topic/status', (frame) => {
            const event = JSON.parse(frame.body);
            if (matchIds.includes(event.userId)) {
                onStatusUpdate(event.userId, event.online);
            }
        });

        const statusDirectSub = client.subscribe(`/user/${currentUserEmail}/queue/status`, (frame) => {
            const event = JSON.parse(frame.body);
            if (matchIds.includes(event.userId)) {
                onStatusUpdate(event.userId, event.online);
            }
        });

        // Request current status for all matches
        matchIds.forEach(id => {
            client.publish({
                destination: '/app/status/request',
                body: JSON.stringify({ userId: id })
            });
        });

        return () => {
            unreadSub.unsubscribe();
            statusBroadcastSub.unsubscribe();
            statusDirectSub.unsubscribe();
        };
    }, [isConnected]);

    return null;
}