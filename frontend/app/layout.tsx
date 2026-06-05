import type { Metadata } from "next";
import React from "react";

import "./globals.css";
import { Inter, Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
    title: {
        default: 'Match Me',
        template: 'Match Me | %s',
    },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={cn("h-full", "antialiased", "font-sans", inter.variable)}>
        <body>
            <TooltipProvider>{children}</TooltipProvider>
            <Toaster />
        </body>
    </html>
  );
}
