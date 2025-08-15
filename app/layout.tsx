// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "VibeFlix - Movie Recommendations by Mood",
  description: "Discover movies based on your current vibe",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: { background: "var(--card)", color: "var(--foreground)" },
          }}
        />
        {children}
      </body>
    </html>
  );
}
