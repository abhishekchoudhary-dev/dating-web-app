'use client'

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function AdminPage() {
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleClear = async () => {
        setLoading(true);
        const res = await fetch('http://localhost:8080/api/admin/clear', { method: 'DELETE' });
        const text = await res.text();
        setMessage(text);
        setLoading(false);
    };

    const handleReseed = async () => {
        setLoading(true);
        setMessage('');
        const res = await fetch('http://localhost:8080/api/admin/reseed', { method: 'POST' });
        const text = await res.text();
        setMessage(text);
        setLoading(false);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-6">
            <h1 className="text-2xl font-bold">Admin Panel</h1>
            <p className="text-muted-foreground text-sm max-w-sm text-center">
                ⚠️ Clear your browser cookies before using these options
            </p>
            <div className="flex gap-4">
                <Button
                    variant="outline"
                    onClick={handleClear}
                    disabled={loading}
                    className="cursor-pointer border-gray shadow-lg bg-white-100 hover:bg-red-500 hover:text-red">
                    Clear Database
                </Button>
                <Button
                    onClick={handleReseed}
                    disabled={loading}
                    className="cursor-pointer border-gray shadow-lg bg-white-200 hover:bg-green-400 text-black">
                    Reseed Database
                </Button>
            </div>
            {loading && <p className="text-muted-foreground">Processing... this may take a moment</p>}
            {message && <p className="text-green-500 font-medium">{message}</p>}
        </div>
    );
}