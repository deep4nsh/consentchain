import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import BackgroundElements from "@/components/BackgroundElements";
import { AppWalletProvider } from "@/context/WalletContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ConsentChain",
  description: "ConsentChain - Decentralized Consent Management Platform on Algorand",
  icons: {
    icon: "/concentchain.png",
    apple: "/concentchain.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-950 text-gray-50`}
      >
        <AppWalletProvider>
          <BackgroundElements />
          <Navbar />
          {children}
        </AppWalletProvider>
      </body>
    </html>
  );
}
