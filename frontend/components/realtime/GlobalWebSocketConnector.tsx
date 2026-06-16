'use client'

import { WebSocketProvider } from "./WebSocketContext";

type Props = {
    token: string
    children: React.ReactNode
}

export default function GlobalWebSocketConnector({ token, children }: Props) {
    return (
        <WebSocketProvider token={token}>
            {children}
        </WebSocketProvider>
    );
}