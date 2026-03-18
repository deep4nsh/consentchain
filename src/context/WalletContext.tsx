"use client";

import React, { ReactNode } from "react";
import { WalletProvider, NetworkId, WalletId, WalletManager } from "@txnlab/use-wallet-react";

// Initialize the WalletManager with desired wallets
const walletManager = new WalletManager({
    wallets: [
        WalletId.PERA,
        WalletId.DEFLY,
        WalletId.LUTE,
        WalletId.EXODUS,
        WalletId.KIBISIS,
        {
            id: WalletId.WALLETCONNECT,
            options: { projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID || "3c87e9c9eb18903e620d440d42194c5f" }
        },
        {
            id: WalletId.MAGIC,
            options: { apiKey: process.env.NEXT_PUBLIC_MAGIC_API_KEY || "pk_live_your_magic_api_key" }
        }
    ]
});

export function AppWalletProvider({ children }: { children: ReactNode }) {
    return (
        <WalletProvider manager={walletManager}>
            {children}
        </WalletProvider>
    );
}
