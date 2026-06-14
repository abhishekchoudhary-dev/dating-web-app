import { getChatData } from "./data";
import ChatWindow from "./ChatWindow";
import { cookies } from "next/headers";

export default async function ChatPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    console.log('Chat page id:', id);  
    const userId = parseInt(id);
    const { user, messages } = await getChatData(userId);
    
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value ?? '';

     // Fetch current user server side
    const meRes = await fetch('http://localhost:8080/api/me', {
        headers: { Cookie: `access_token=${token}` },
        cache: 'no-store'
    });
    const me = await meRes.json();

    return (
        <ChatWindow
            otherUser={user}
            initialMessages={messages}
            token={token}
            currentUserId={me.id}
            currentUserEmail={me.email}
        />
    );
}