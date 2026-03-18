"use client";

import React, { ReactNode } from "react";
import { WalletProvider, NetworkId, WalletId, WalletManager } from "@txnlab/use-wallet-react";

// Initialize the WalletManager with desired wallets
const walletManager = new WalletManager({
    wallets: [
        WalletId.PERA,
        WalletId.DEFLY,
        WalletId.LUTE,
        // Add MyAlgo or others if needed
    ],
    network: NetworkId.TESTNET,
});

export function AppWalletProvider({ children }: { children: ReactNode }) {
    return (
        <WalletProvider manager={walletManager}>
            {children}
        </WalletProvider>
    );
}
