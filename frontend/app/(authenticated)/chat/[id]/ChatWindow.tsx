'use client'

import { useState, useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
//import SockJS from "sockjs-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserIcon, SendIcon } from "lucide-react";

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
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [input, setInput] = useState('');
    const [isOnline, setIsOnline] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    //const [currentUserId, setCurrentUserId] = useState<number | null>(null);
    const clientRef = useRef<Client | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {

        let active = true;

        // Connect WebSocket
        let client: Client;

        import('sockjs-client').then(({ default: SockJS }) => {
            if (!active) return;
            client = new Client({
                webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
                connectHeaders: {
                    Cookie: `access_token=${token}`
                },
                onConnect: () => {

                    console.log('WebSocket connected!');

                    client.subscribe(`/user/${currentUserEmail}/queue/messages`, (frame) => {
                        const message = JSON.parse(frame.body);
                        console.log('Received main message:', frame.body);
                        setMessages(prev => [...prev, message]);

                        // Mark as read immediately if user is in window already
                        fetch(`http://localhost:8080/api/messages/${otherUser.id}/read`, {
                            method: 'POST',
                            credentials: 'include'
                        });
                    });

                    //typing indicator
                    client.subscribe(`/user/${currentUserId}/queue/typing`, (frame) => {
                        const event = JSON.parse(frame.body);
                        if (String(event.senderId) === String(otherUser.id)) {
                            setIsTyping(event.typing);
                        }
                    });
                   

                    //broadcast online status of other user
                    client.subscribe('/topic/status', (frame) => {
                        const event = JSON.parse(frame.body);
                        if (event.userId === otherUser.id) {
                            setIsOnline(event.online);
                        }
                    });

                    //Direct response to online status
                    client.subscribe(`/user/${currentUserEmail}/queue/status`, (frame) => {
                        const event = JSON.parse(frame.body);
                        if (event.userId === otherUser.id) {
                            setIsOnline(event.online);
                        }
                    });
                   
                    //requesting current online status
                    setTimeout(() => {
                        client.publish({
                            destination: '/app/status/request',
                            body: JSON.stringify({ userId: otherUser.id })
                        });
                    }, 100);
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

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'instant' });
    }, [messages]);
    
    //mark chat messages as read when chat is opened
    useEffect(() => {
    fetch(`http://localhost:8080/api/messages/${otherUser.id}/read`, {
        method: 'POST',
        credentials: 'include'
    });
    }, []);

    const sendMessage = () => {
        if (!input.trim() || !clientRef.current?.connected) return;

        clientRef.current.publish({
            destination: '/app/chat',
            body: JSON.stringify({
                receiverId: otherUser.id,
                content: input.trim()
            })
        });

        // Add message to local state immediately
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

        if (!clientRef.current?.connected) return;

        // Send typing event
        clientRef.current.publish({
            destination: '/app/typing',
            body: JSON.stringify({
                receiverId: otherUser.id,
                typing: true
            })
        });

        // Stop typing after 3 seconds of inactivity
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
            clientRef.current?.publish({
                destination: '/app/typing',
                body: JSON.stringify({
                    receiverId: otherUser.id,
                    typing: false
                })
            });
        }, 2000);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
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
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
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