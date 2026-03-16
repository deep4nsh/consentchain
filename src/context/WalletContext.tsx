"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { PeraWalletConnect } from "@perawallet/connect";

// Create the PeraWallet object
const peraWallet = new PeraWalletConnect();

interface WalletContextType {
    accountAddress: string | null;
    isReady: boolean;
    connectWallet: () => Promise<void>;
    disconnectWallet: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
    const [accountAddress, setAccountAddress] = useState<string | null>(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        // Reconnect to the session when the component is mounted
        peraWallet
            .reconnectSession()
            .then((accounts) => {
                // Setup the disconnect event listener
                peraWallet.connector?.on("disconnect", disconnectWallet);

                if (accounts.length) {
                    setAccountAddress(accounts[0]);
                }
            })
            .catch((e) => console.log(e))
            .finally(() => setIsReady(true));

        return () => {
            // No cleanup necessary for disconnect listener in this version of the SDK
        };
    }, []);

    const connectWallet = async () => {
        try {
            const newAccounts = await peraWallet.connect();
            // Setup the disconnect event listener
            peraWallet.connector?.on("disconnect", disconnectWallet);

            setAccountAddress(newAccounts[0]);
        } catch (error: any) {
            // Ignore the error if the user just closed the modal
            if (error?.name === "PeraWalletConnectError" || error?.message?.includes("closed by user")) {
                console.log("User closed the connection modal.");
            } else {
                console.error(error);
            }
        }
    };

    const disconnectWallet = () => {
        peraWallet.disconnect();
        setAccountAddress(null);
    };

    return (
        <WalletContext.Provider value={{ accountAddress, isReady, connectWallet, disconnectWallet }}>
            {children}
        </WalletContext.Provider>
    );
}

export function useWallet() {
    const context = useContext(WalletContext);
    if (context === undefined) {
        throw new Error("useWallet must be used within a WalletProvider");
    }
    return context;
}
