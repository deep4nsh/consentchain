"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, X, Wallet } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWallet } from "@txnlab/use-wallet-react";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
    const [showAllWallets, setShowAllWallets] = useState(false);

    // @txnlab/use-wallet-react hooks
    const { activeAddress, wallets } = useWallet();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Learn", href: "/blog" },
        { name: "Portal", href: "/demo" },
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
            <nav className="fixed top-0 left-0 right-0 z-50 glass-card !rounded-none !border-t-0 !border-x-0 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        {/* Logo Section */}
                        <div className="flex-shrink-0 flex items-center space-x-2">
                            <Link href="/" className="flex items-center space-x-2 group">
                                <Image
                                    src="/consentchain.gif"
                                    alt="ConsentChain Logo"
                                    width={36}
                                    height={36}
                                    className="rounded-lg object-contain bg-black p-1 shadow-lg shadow-purple-500/20 group-hover:shadow-purple-400/40 transition-shadow"
                                    unoptimized
                                />
                                <span className="font-bold text-xl tracking-tight text-white group-hover:text-purple-400 transition-colors">
                                    ConsentChain
                                </span>
                            </Link>
                        </div>

                        {/* Desktop Menu */}
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-8">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        className="text-gray-400 hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition-all relative group"
                                    >
                                        {link.name}
                                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all group-hover:w-full" />
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
                                            className="bg-white text-black px-6 py-2.5 rounded-full text-sm font-bold shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] transition-all hover:scale-105 active:scale-95"
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
                                aria-label={isOpen ? 'Close menu' : 'Open menu'}
                                className="text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 rounded-lg p-2"
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
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md" onClick={() => { setIsWalletModalOpen(false); setShowAllWallets(false); }}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="bg-[#0a0a0c] border border-white/10 shadow-2xl w-full max-w-[340px] rounded-[2rem] overflow-hidden relative"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Decorative background glow */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-blue-500/20 blur-[60px] pointer-events-none" />

                            <div className="px-6 pt-8 pb-4 flex items-center justify-between">
                                <h3 className="text-lg font-bold text-white tracking-tight">Connect Wallet</h3>
                                <button
                                    onClick={() => {
                                        setIsWalletModalOpen(false);
                                        setShowAllWallets(false);
                                    }}
                                    aria-label="Close wallet modal"
                                    className="p-2 rounded-full hover:bg-white/5 text-gray-500 hover:text-white transition-colors focus:ring-2 focus:ring-blue-500/50"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="px-6 pb-10">
                                <div className="grid grid-cols-2 gap-4 mt-2">
                                    {wallets?.filter(w => ['pera', 'defly'].includes(w.id.toLowerCase())).map((wallet) => (
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
                                            className="aspect-square flex flex-col items-center justify-center p-4 rounded-[1.5rem] bg-white/[0.03] border border-white/5 hover:border-blue-500/40 hover:bg-white/[0.06] transition-all group relative"
                                        >
                                            {wallet.metadata?.icon && (
                                                <div className="w-12 h-12 mb-2 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                                    <img
                                                        src={wallet.metadata.icon}
                                                        alt={wallet.metadata.name}
                                                        className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(255,255,255,0.1)]"
                                                    />
                                                </div>
                                            )}
                                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider group-hover:text-blue-400 transition-colors">
                                                {wallet.metadata?.name || wallet.id}
                                            </span>
                                            {wallet.isConnected && (
                                                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                                            )}
                                        </button>
                                    ))}
                                </div>

                                <div className="mt-6 text-center">
                                    <p className="text-[10px] text-gray-600 font-medium uppercase tracking-[0.2em]">Validated on Algorand</p>
                                </div>
                            </div>

                                {(!wallets || wallets.length === 0) && (
                                    <div className="text-center py-8">
                                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3">
                                            <Wallet className="w-6 h-6 text-gray-600" />
                                        </div>
                                        <p className="text-sm text-gray-500 font-medium">No wallets found</p>
                                    </div>
                                )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
