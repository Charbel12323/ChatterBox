import type React from "react";
import { AuthProvider } from "@/app/Authcontent"; // ✅ Import AuthProvider
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AuthProvider> {/* ✅ Wrap the app in AuthProvider */}
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
