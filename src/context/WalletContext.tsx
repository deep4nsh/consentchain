"use client";

import React, { ReactNode } from "react";
import { WalletProvider, WalletId, WalletManager, NetworkId } from "@txnlab/use-wallet-react";
import { algodClient } from "@/lib/algorand";

// Standardized dApp metadata for all wallet handshakes
const dAppMetadata = {
    name: "ConsentChain",
    description: "Decentralized Consent Management on Algorand",
    url: "https://consentchain-vert.vercel.app",
    icons: ["https://consentchain-vert.vercel.app/consentchain.gif"],
};

// Prioritize the Project ID from the environment
const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID || "3c87e9c9eb18903e620d440d42194c5f";

// Initialize the WalletManager with hardened settings for EVERY wallet provider
const walletManager = new WalletManager({
    wallets: [
        {
            id: WalletId.PERA,
            options: { metadata: dAppMetadata }
        },
        {
            id: WalletId.DEFLY,
            options: { metadata: dAppMetadata }
        },
        {
            id: WalletId.EXODUS,
            options: { metadata: dAppMetadata }
        },
        {
            id: WalletId.KIBISIS,
            options: { metadata: dAppMetadata }
        },
        {
            id: WalletId.LUTE,
            options: { siteName: "ConsentChain" }
        },
        {
            id: WalletId.WALLETCONNECT,
            options: { projectId, metadata: dAppMetadata }
        }
    ],
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
