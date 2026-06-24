'use client'

import { useUnread } from "@/components/realtime/UnreadContext";
import { unmatchUser } from "@/app/(authenticated)/matches/actions";
import { Button } from "@/components/ui/button";
import { UserX } from "lucide-react";
import { useRouter } from "next/navigation";

export default function UnmatchButton({ userId }: { userId: number }) {
    const { refresh } = useUnread();
    const router = useRouter();

    const handleUnmatch = async () => {
        router.push('/matches');
        await unmatchUser(userId);
        refresh();
        
        
    };

    return (
        <Button
            onClick={handleUnmatch}
            className="cursor-pointer py-5 px-10"
            variant="outline">
            <UserX size={15} />
            Unmatch
        </Button>
    );
}