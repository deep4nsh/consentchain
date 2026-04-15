"use client";

import React, { ReactNode, useMemo } from "react";
import { WalletProvider, WalletId, WalletManager, NetworkId } from "@txnlab/use-wallet-react";

// Prioritize the Project ID from the environment
const FALLBACK_PROJECT_ID = "3c87e9c9eb18903e620d440d42194c5f";

export function AppWalletProvider({ children }: { children: ReactNode }) {
    const walletManager = useMemo(() => {
        // Dynamically detect origin to prevent "Invalid QR" or "Origin Mismatch" on preview/local domains
        let origin = "";
        if (typeof window !== "undefined") {
            origin = window.location.origin;
        } else {
            origin = process.env.NEXT_PUBLIC_SITE_URL || "https://consentchain-vert.vercel.app";
        }
        const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID || FALLBACK_PROJECT_ID;


        const dAppMetadata = {
            name: "ConsentChain",
            description: "Decentralized Consent Management on Algorand",
            url: origin,
            icons: [`${origin}/consentchain.gif`],
        };

        return new WalletManager({
            wallets: [
                {
                    id: WalletId.PERA,
                    metadata: dAppMetadata,
                    options: { 
                        shouldShowSignTxnToast: true
                    }
                },
                {
                    id: WalletId.DEFLY,
                    metadata: dAppMetadata,
                    options: { 
                        shouldShowSignTxnToast: true
                    }
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
    }, []);

    return (
        <WalletProvider manager={walletManager}>
            {children}
        </WalletProvider>
    );
}
