import type { Metadata } from "next";
import React from "react";

import "./globals.css";

export const metadata: Metadata = {
    title: {
        default: 'Match Me',
        template: 'Match Me | %s',
    },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`h-full antialiased`}>
        <body>
            {children}
        </body>
    </html>
  );
}
