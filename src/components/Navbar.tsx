"use client";

import Link from "next/link";
import { ShieldCheck, Menu, X, Wallet } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWallet } from "@txnlab/use-wallet-react";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

    // @txnlab/use-wallet-react hooks
    const { activeAddress, wallets } = useWallet();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Demo", href: "/demo" },
        { name: "Dashboard", href: "/dashboard" },
        { name: "Verify", href: "/verify" },
    ];

    const handleDisconnect = () => {
        if (activeAddress) {
            wallets?.forEach((wallet) => {
                if (wallet.isConnected) {
                    wallet.disconnect();
                }
            });
        }
    };

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-md border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo Section */}
                        <div className="flex-shrink-0 flex items-center space-x-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                                <ShieldCheck className="w-5 h-5 text-white" />
                            </div>
                            <Link href="/" className="font-bold text-xl tracking-tight text-white hover:text-purple-400 transition-colors">
                                ConsentChain
                            </Link>
                        </div>

                        {/* Desktop Menu */}
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-8">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        className="text-gray-300 hover:text-white hover:bg-white/10 px-3 py-2 rounded-md text-sm font-medium transition-all"
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                                <div className="flex items-center space-x-4 pl-4 border-l border-white/10">
                                    {mounted && activeAddress ? (
                                        <div className="flex items-center space-x-3 bg-white/5 pl-4 pr-1 py-1 rounded-full border border-white/10">
                                            <span className="text-sm font-mono text-gray-300">
                                                {activeAddress.substring(0, 6)}...{activeAddress.substring(activeAddress.length - 4)}
                                            </span>
                                            <button
                                                onClick={handleDisconnect}
                                                className="bg-red-500/20 text-red-400 hover:bg-red-500/30 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors"
                                            >
                                                Disconnect
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => setIsWalletModalOpen(true)}
                                            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-5 py-2 rounded-full text-sm font-semibold shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all hover:-translate-y-0.5"
                                        >
                                            Connect Wallet
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Mobile menu button */}
                        <div className="md:hidden flex items-center">
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="text-gray-300 hover:text-white focus:outline-none p-2"
                            >
                                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden bg-black/90 backdrop-blur-xl border-b border-white/10"
                        >
                            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        onClick={() => setIsOpen(false)}
                                        className="text-gray-300 hover:text-white hover:bg-white/10 block px-3 py-2 rounded-md text-base font-medium"
                                    >
                                        {link.name}
                                    </Link>
                                ))}

                                <div className="pt-4 mt-2 border-t border-white/10">
                                    {mounted && activeAddress ? (
                                        <div className="space-y-3">
                                            <div className="p-3 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center">
                                                <span className="text-sm font-mono text-gray-300">
                                                    {activeAddress.substring(0, 8)}...{activeAddress.substring(activeAddress.length - 8)}
                                                </span>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    handleDisconnect();
                                                    setIsOpen(false);
                                                }}
                                                className="w-full text-center bg-red-500/20 text-red-400 hover:bg-red-500/30 block px-3 py-3 rounded-lg text-base font-medium transition-colors border border-red-500/20"
                                            >
                                                Disconnect Wallet
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => {
                                                setIsOpen(false);
                                                setIsWalletModalOpen(true);
                                            }}
                                            className="w-full text-center bg-gradient-to-r from-blue-500 to-purple-600 text-white block px-3 py-3 rounded-lg text-base font-medium transition-all shadow-lg shadow-purple-500/25"
                                        >
                                            Connect Wallet
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

            {/* Wallet Selector Modal */}
            <AnimatePresence>
                {isWalletModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-gray-900 border border-white/10 rounded-2xl shadow-2xl w-full max-w-sm flex flex-col"
                        >
                            <div className="px-6 py-4 flex items-center justify-between border-b border-white/10 bg-white/5">
                                <h3 className="text-lg font-semibold text-white flex items-center">
                                    <Wallet className="w-5 h-5 mr-2 text-purple-400" /> Connect a Wallet
                                </h3>
                                <button
                                    onClick={() => setIsWalletModalOpen(false)}
                                    className="p-1 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="p-6 space-y-3">
                                {wallets?.map((wallet) => (
                                    <button
                                        key={wallet.id}
                                        onClick={() => {
                                            if (wallet.isConnected) {
                                                wallet.setActive();
                                            } else {
                                                wallet.connect();
                                            }
                                            setIsWalletModalOpen(false);
                                        }}
                                        className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-purple-500/50 transition-all group"
                                    >
                                        <div className="flex items-center space-x-3">
                                            {/* Wallet Icon (Using generic or parsing it based on use-wallet) */}
                                            {wallet.metadata?.icon && (
                                                <img src={wallet.metadata.icon} alt={wallet.metadata.name} className="w-8 h-8 rounded-md" />
                                            )}
                                            <span className="font-medium text-gray-200 group-hover:text-white">
                                                {wallet.metadata?.name || wallet.id}
                                            </span>
                                        </div>
                                        <div className="text-xs font-semibold px-2 py-1 rounded bg-black/50 text-gray-400 border border-white/5 group-hover:bg-purple-500/20 group-hover:text-purple-300">
                                            {wallet.isConnected ? "Connected" : "Connect"}
                                        </div>
                                    </button>
                                ))}
                                {(!wallets || wallets.length === 0) && (
                                    <div className="text-center text-sm text-gray-400 py-4">
                                        No wallet providers found.
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
