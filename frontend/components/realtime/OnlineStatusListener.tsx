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

        //receive broadcasted status
        const statusBroadcastSub = client.subscribe('/topic/status', (frame) => {
            console.log('Profile status broadcast:', frame.body);
            const event = JSON.parse(frame.body);
            if (event.userId === targetUserId) {
                setIsOnline(event.online);
            }
        });

        //request status of particular user when we log in which is for authenticated user
        const statusDirectSub = client.subscribe(`/user/${currentUserEmail}/queue/status`, (frame) => {
            const event = JSON.parse(frame.body);
            if (event.userId === targetUserId) {
                setIsOnline(event.online);
            }
        });

        //publish our status on our own without anyone request for updates
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
        <span className={`size-3 rounded-full inline-block border-[6px] ${isOnline ? 'border-green-500 bg-green-200' : 'border-gray-400 bg-gray-200'} ${className ?? ''}`} />
    );
}