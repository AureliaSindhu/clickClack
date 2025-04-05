import type { Metadata } from "next";
import localFont from "next/font/local";
import { Analytics } from '@vercel/analytics/next';
import "./globals.css";
import "./manifest.ts";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "ClickClack",
  description: "Your virtual photobooth",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.ts" />
        <link rel="apple-touch-icon" href="/light-icon.png" /> 
        <meta name="theme-color" content="#1C1C1C" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
