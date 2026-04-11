"use client";

import React, { ReactNode } from "react";
import { WalletProvider, WalletId, WalletManager } from "@txnlab/use-wallet-react";

// Build the wallet list dynamically, only including Magic if the API key is configured
const walletList: any[] = [
    WalletId.PERA,
    WalletId.DEFLY,
    WalletId.LUTE,
    WalletId.EXODUS,
    WalletId.KIBISIS,
    {
        id: WalletId.WALLETCONNECT,
        options: { projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID || "3c87e9c9eb18903e620d440d42194c5f" }
    },
];

// Only add Magic wallet if an API key is actually configured
if (process.env.NEXT_PUBLIC_MAGIC_API_KEY) {
    walletList.push({
        id: WalletId.MAGIC,
        options: { apiKey: process.env.NEXT_PUBLIC_MAGIC_API_KEY }
    });
}

// Initialize the WalletManager with desired wallets
const walletManager = new WalletManager({
    wallets: walletList
});

export function AppWalletProvider({ children }: { children: ReactNode }) {
    return (
        <WalletProvider manager={walletManager}>
            {children}
        </WalletProvider>
    );
}
