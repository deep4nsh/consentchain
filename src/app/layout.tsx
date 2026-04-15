import type { Metadata } from "next";
import "./globals.css";

import Navbar from "@/components/Navbar";
import BackgroundElements from "@/components/BackgroundElements";
import { AppWalletProvider } from "@/context/WalletContext";
import CustomCursor from "@/components/CustomCursor";

const geistSans = {
  variable: "--font-geist-sans",
};

const geistMono = {
  variable: "--font-geist-mono",
};


export const metadata: Metadata = {
  title: "ConsentChain",
  description: "ConsentChain - Decentralized Consent Management Platform on Algorand",
  icons: {
    icon: "/consentchain.png",
    apple: "/consentchain.png",
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
        <CustomCursor />
        <AppWalletProvider>
          <BackgroundElements />
          <Navbar />
          {children}
        </AppWalletProvider>
      </body>
    </html>
  );
}
