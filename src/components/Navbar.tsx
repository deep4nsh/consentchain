"use client";

import Link from "next/link";
import { ShieldCheck, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWallet } from "@/context/WalletContext";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { accountAddress, connectWallet, disconnectWallet } = useWallet();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Demo", href: "/demo" },
        { name: "Dashboard", href: "/dashboard" },
    ];

    return (
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
                                {mounted && accountAddress ? (
                                    <div className="flex items-center space-x-3 bg-white/5 pl-4 pr-1 py-1 rounded-full border border-white/10">
                                        <span className="text-sm font-mono text-gray-300">
                                            {accountAddress.substring(0, 6)}...{accountAddress.substring(accountAddress.length - 4)}
                                        </span>
                                        <button
                                            onClick={disconnectWallet}
                                            className="bg-red-500/20 text-red-400 hover:bg-red-500/30 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors"
                                        >
                                            Disconnect
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={connectWallet}
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
                                {mounted && accountAddress ? (
                                    <div className="space-y-3">
                                        <div className="p-3 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center">
                                            <span className="text-sm font-mono text-gray-300">
                                                {accountAddress.substring(0, 8)}...{accountAddress.substring(accountAddress.length - 8)}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => {
                                                disconnectWallet();
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
                                            connectWallet();
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
    );
}
