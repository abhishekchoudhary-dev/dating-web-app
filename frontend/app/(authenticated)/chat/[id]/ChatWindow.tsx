'use client'

import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserIcon, SendIcon } from "lucide-react";
import { useWebSocket } from "@/components/realtime/WebSocketContext";

type Message = {
    id?: number
    senderId: number
    receiverId: number
    content: string
    sentAt: string
}

type User = {
    id: number
    name: string
    profilePictureLink: string | null
}

type Props = {
    otherUser: User
    initialMessages: Message[]
    token: string
    currentUserId: number
    currentUserEmail: string
}

export default function ChatWindow({ otherUser, initialMessages, token, currentUserId, currentUserEmail }: Props) {
    //state
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [input, setInput] = useState('');
    const [isOnline, setIsOnline] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    //oagination
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(initialMessages.length === 10);
    const [loadingMore, setLoadingMore] = useState(false);
    //refs
    const loadingOlderRef = useRef(false);
    const scrollHeightBeforeRef = useRef(0);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Use shared WebSocket from context
    const { client, isConnected } = useWebSocket();

    //actual socket subscriptions. set up after connect and clean at the end
    useEffect(() => {
        if (!client || !isConnected) return;

        // Mark as read when chat opens
        fetch(`http://localhost:8080/api/messages/${otherUser.id}/read`, {
            method: 'POST',
            credentials: 'include'
        });

        const messagesSub = client.subscribe(`/user/${currentUserEmail}/queue/messages`, (frame) => {
            const message = JSON.parse(frame.body);
            setMessages(prev => [...prev, message]);
            fetch(`http://localhost:8080/api/messages/${otherUser.id}/read`, {
                method: 'POST',
                credentials: 'include'
            });
        });

        const typingSub = client.subscribe(`/user/${currentUserId}/queue/typing`, (frame) => {
            const event = JSON.parse(frame.body);
            if (String(event.senderId) === String(otherUser.id)) {
                setIsTyping(event.typing);
            }
        });

        const statusBroadcastSub = client.subscribe('/topic/status', (frame) => {
            const event = JSON.parse(frame.body);
            if (event.userId === otherUser.id) {
                setIsOnline(event.online);
            }
        });

        const statusDirectSub = client.subscribe(`/user/${currentUserEmail}/queue/status`, (frame) => {
            const event = JSON.parse(frame.body);
            if (event.userId === otherUser.id) {
                setIsOnline(event.online);
            }
        });

        setTimeout(() => {
            client.publish({
                destination: '/app/status/request',
                body: JSON.stringify({ userId: otherUser.id })
            });
        }, 100);

        return () => {
            messagesSub.unsubscribe();
            typingSub.unsubscribe();
            statusBroadcastSub.unsubscribe();
            statusDirectSub.unsubscribe();
        };
    }, [isConnected]);

    useEffect(() => {
        if (loadingOlderRef.current) {
            loadingOlderRef.current = false;
            return;
        }
        messagesEndRef.current?.scrollIntoView({ behavior: 'instant' });
    }, [messages]);

    useLayoutEffect(() => {
        if (loadingOlderRef.current && messagesContainerRef.current) {
            const container = messagesContainerRef.current;
            container.scrollTop = container.scrollHeight - scrollHeightBeforeRef.current;
        }
    }, [messages]);

    const sendMessage = () => {
        if (!input.trim() || !client?.connected) return;

        client.publish({
            destination: '/app/chat',
            body: JSON.stringify({
                receiverId: otherUser.id,
                content: input.trim()
            })
        });

        setMessages(prev => [...prev, {
            senderId: currentUserId!,
            receiverId: otherUser.id,
            content: input.trim(),
            sentAt: new Date().toISOString()
        }]);

        setInput('');
    };

    const handleTyping = (value: string) => {
        setInput(value);

        if (!client?.connected) return;

        client.publish({
            destination: '/app/typing',
            body: JSON.stringify({
                receiverId: otherUser.id,
                typing: true
            })
        });

        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
            if (client?.connected) {
                client.publish({
                    destination: '/app/typing',
                    body: JSON.stringify({
                        receiverId: otherUser.id,
                        typing: false
                    })
                });
            }
        }, 2000);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const loadMoreMessages = async () => {
        setLoadingMore(true);
        loadingOlderRef.current = true;
        const nextPage = page + 1;

        const response = await fetch(
            `http://localhost:8080/api/messages/${otherUser.id}?page=${nextPage}`,
            { credentials: 'include' }
        );

        const olderMessages = await response.json();

        if (olderMessages.length < 10) {
            setHasMore(false);
        }

        scrollHeightBeforeRef.current = messagesContainerRef.current?.scrollHeight ?? 0;

        setMessages(prev => [...olderMessages, ...prev]);
        setPage(nextPage);
        setLoadingMore(false);
    };

    return (
        <div className="flex flex-col h-[calc(100vh-5rem)] w-full max-w-2xl mx-auto">
            
            {/* Header */}
            <div className="flex items-center gap-3 p-4 border-b bg-card">
                <div className="relative">
                    <Avatar className="size-10">
                        <AvatarImage src={otherUser.profilePictureLink ?? ''} alt={otherUser.name} />
                        <AvatarFallback>
                            <UserIcon size={20} />
                        </AvatarFallback>
                    </Avatar>
                    <span className={`absolute bottom-0 right-0 size-3 rounded-full border-2 border-background ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
                </div>
                <div>
                    <h2 className="font-semibold">{otherUser.name}</h2>
                    <p className="text-xs text-muted-foreground">
                        {isTyping ? 'typing...' : isOnline ? 'Online' : 'Offline'}
                    </p>
                </div>
            </div>

            {/* Messages */}
            <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 space-y-3">
                {hasMore && (
                    <div className="flex justify-center">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={loadMoreMessages}
                            disabled={loadingMore}
                            className="text-xs cursor-pointer">
                            {loadingMore ? 'Loading...' : 'Load older messages'}
                        </Button>
                    </div>
                )}
                {messages.length === 0 && (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-muted-foreground text-sm">
                            No messages yet. Say hello! 👋
                        </p>
                    </div>
                )}
                {messages.map((msg, index) => (
                    <div
                        key={`${index}-${msg.sentAt}`}
                        className={`flex flex-col ${String(msg.senderId) === String(currentUserId) ? 'items-end' : 'items-start'}`}
                    >
                        <div className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${
                            String(msg.senderId) === String(currentUserId)
                                ? 'bg-blue-500 text-primary-foreground rounded-br-sm shadow-md border border-blue-400'
                                : 'bg-green-500 text-primary-foreground rounded-bl-sm shadow-md border border-green-400'
                        }`}>
                            {msg.content}
                        </div>
                        <span suppressHydrationWarning className="text-xs text-muted-foreground mt-1 px-1">
                            {new Date(msg.sentAt).toLocaleDateString([], {
                                day: '2-digit',
                                month: 'short'
                            })} {new Date(msg.sentAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </span>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="flex items-center gap-2 p-4 border-t bg-card">
                <Input
                    value={input}
                    onChange={(e) => handleTyping(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message..."
                    className="flex-1"
                />
                <Button
                    onClick={sendMessage}
                    disabled={!input.trim()}
                    size="icon"
                    className="cursor-pointer bg-pink-500 hover:bg-pink-600">
                    <SendIcon className="size-4" />
                </Button>
            </div>
        </div>
    );
}