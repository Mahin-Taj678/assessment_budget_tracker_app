import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { Toaster as DefaultToaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/components/providers/AuthProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ledger Dreams - Budget Tracker",
  description: "A complete budget tracker application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-background text-foreground antialiased`}>
        <AuthProvider>
          <TooltipProvider>
            {children}
            <SonnerToaster />
            <DefaultToaster />
          </TooltipProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
