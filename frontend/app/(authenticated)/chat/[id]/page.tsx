import { getChatData } from "./data";
import ChatWindow from "./ChatWindow";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function ChatPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;  
    const userId = parseInt(id);
    const chatData = await getChatData(userId);

    if (!userId || !chatData){
          return (
            <div className="flex flex-col items-center justify-center min-h-96 gap-4 text-center">
                <p className="text-6xl">🔒</p>
                <h2 className="text-xl font-semibold">Whoa there!</h2>
                <p className="text-muted-foreground max-w-sm">
                    You can only chat with people you have matched with. 
                    Go find your matches first! 💘
                </p>
                <Link href="/discover" className="underline text-pink-500">
                    Start Discovering
                </Link>
            </div>
        );
    }

    //we deconstruct only if its not null
    const {user,messages} = chatData;
    
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