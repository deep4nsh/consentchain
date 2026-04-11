"use client";

import React, { ReactNode } from "react";
import { WalletProvider, WalletId, WalletManager, NetworkId } from "@txnlab/use-wallet-react";
import { algodClient } from "@/lib/algorand";

// Build the wallet list dynamically, only including Magic if the API key is configured
const walletList: any[] = [
    WalletId.PERA,
    WalletId.DEFLY,
    WalletId.LUTE,
    WalletId.EXODUS,
    WalletId.KIBISIS,
    {
        id: WalletId.WALLETCONNECT,
        options: { 
            projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID || "3c87e9c9eb18903e620d440d42194c5f",
            metadata: {
                name: "ConsentChain",
                description: "Decentralized Consent Management on Algorand",
                url: "https://consentchain-vert.vercel.app",
                icons: ["https://consentchain-vert.vercel.app/consentchain.gif"],
            }
        }
    },
];

// Only add Magic wallet if an API key is actually configured
if (process.env.NEXT_PUBLIC_MAGIC_API_KEY) {
    walletList.push({
        id: WalletId.MAGIC,
        options: { apiKey: process.env.NEXT_PUBLIC_MAGIC_API_KEY }
    });
}

// Initialize the WalletManager with desired wallets and mandatory metadata for v4
const walletManager = new WalletManager({
    wallets: walletList,
    defaultNetwork: NetworkId.TESTNET,
    networks: {
        testnet: {
            algod: {
                baseServer: process.env.NEXT_PUBLIC_ALGOD_SERVER || 'https://testnet-api.algonode.cloud',
                port: process.env.ALGOD_PORT || '443',
                token: process.env.ALGOD_TOKEN || '',
            }
        }
    }
});

export function AppWalletProvider({ children }: { children: ReactNode }) {
    return (
        <WalletProvider manager={walletManager}>
            {children}
        </WalletProvider>
    );
}
