import Link from "next/link";
import { HeartIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center space-y-4">
        <HeartIcon size="100" className="text-pink-500"/>
        <h1 className="text-5xl font-bold">Match Me</h1>
        <p className="text-muted-foreground text-center">Maybe someone is already waiting for you...</p>
        <div className="flex justify-center gap-4 mt-4">
            <Link href="/login">
                <Button variant="outline" className="cursor-pointer hover:bg-pink-500 hover:text-white">Log in</Button>
            </Link>
            <Link href="/register">
                <Button variant="outline" className="cursor-pointer hover:bg-pink-500 hover:text-white">Register</Button>
            </Link>
        </div>
    </div>
  );
}