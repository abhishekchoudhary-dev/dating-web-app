'use client'

import { createContext, useContext, useRef, useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";

type WebSocketContextType = {
    client: Client | null
    isConnected: boolean
}

const WebSocketContext = createContext<WebSocketContextType>({ client: null, isConnected: false });

export function useWebSocket() {
    return useContext(WebSocketContext);
}

type Props = {
    token: string
    children: React.ReactNode
}

export function WebSocketProvider({ token, children }: Props) {
    const [isConnected, setIsConnected] = useState(false);
    const clientRef = useRef<Client | null>(null);

    useEffect(() => {
        let active = true;

        import('sockjs-client').then(({ default: SockJS }) => {
            if (!active) return;

            const client = new Client({
                webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
                connectHeaders: { Cookie: `access_token=${token}` },
                onConnect: () => {
                    console.log('Global WebSocket connected');
                    setIsConnected(true);
                },
                onDisconnect: () => {
                    console.log('Global WebSocket disconnected');
                    setIsConnected(false);
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

    return (
        <WebSocketContext.Provider value={{ client: clientRef.current, isConnected }}>
            {children}
        </WebSocketContext.Provider>
    );
}