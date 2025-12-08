import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TA Chatbot",
  description: "Teaching Assistant Chatbot",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <header className="border-b border-gray-200 bg-background">
          <div className="container mx-auto px-4 py-4">
            <Link href="/" className="text-2xl font-semibold hover:opacity-80 transition-opacity">
              TA Chatbot
            </Link>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
