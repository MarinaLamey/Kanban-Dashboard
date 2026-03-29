import type { Metadata } from "next";
// 1. Import the MUI Cache Provider
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter'; 
import Providers from "../../componant/useQueryClient/providers";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Kanban Board Enterprise",
  description: "High-performance task management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        {/* 2. Wrap everything in the Cache Provider */}
        <AppRouterCacheProvider>
           <Providers>{children}</Providers>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}