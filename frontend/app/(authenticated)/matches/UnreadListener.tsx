'use client'

import { useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";

type Props = {
    token: string
    currentUserEmail: string
    onUnreadUpdate: (senderId: number, count: number) => void
}

export default function UnreadListener({ token, currentUserEmail, onUnreadUpdate }: Props) {
    const clientRef = useRef<Client | null>(null);

    useEffect(() => {
        let active = true;

        import('sockjs-client').then(({ default: SockJS }) => {
            if (!active) return;

            const client = new Client({
                webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
                connectHeaders: { Cookie: `access_token=${token}` },
                onConnect: () => {
                     client.subscribe('/user/**', (frame) => {
                        console.log('Any unread destination:', frame.headers['destination']);
                        console.log('Any unread body:', frame.body);
                    });
                    client.subscribe(`/user/${currentUserEmail}/queue/unread`, (frame) => {
                        console.log('Unread update received:', frame.body);
                        const data = JSON.parse(frame.body);
                        onUnreadUpdate(data.senderId, data.count);
                    });
                }
            });

            client.activate();
            clientRef.current = client;
        });

        return () => {
            active = false;
            clientRef.current?.deactivate();
        };
    }, []);

    return null;
}