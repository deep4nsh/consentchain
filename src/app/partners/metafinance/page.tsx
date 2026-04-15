'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, TrendingUp, ArrowUpRight, DollarSign, ShieldCheck, Eye, EyeOff, LayoutPanelLeft, Clock } from 'lucide-react';
import ConsentWidget from '@/components/ConsentWidget';
import { useWallet } from '@txnlab/use-wallet-react';
import { ConsentChainSDK } from '@/lib/sdk';
import { algodClient, indexerClient } from '@/lib/algorand';

const APP_ID = parseInt(process.env.NEXT_PUBLIC_APP_ID || '758027210', 10);
const ORG_ID = 'meta_finance';

export default function MetaFinanceHub() {
    const { activeAddress } = useWallet();
    const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [showBalance, setShowBalance] = useState<boolean>(false);

    // Initialize SDK (memoize to prevent re-creation on every render)
    const sdk = useMemo(() => new ConsentChainSDK(algodClient, indexerClient, APP_ID), []);

    // Check initial consent status
    useEffect(() => {
        const checkConsent = async () => {
            if (!activeAddress) {
                setIsAuthorized(false);
                setIsLoading(false);
                return;
            }

            try {
                const status = await sdk.verifyConsent(activeAddress, ORG_ID);
                setIsAuthorized(status.exists && !status.isExpired);
            } catch (error) {
                console.error('Consent check failed:', error);
            } finally {
                setIsLoading(false);
            }
        };

        checkConsent();
    }, [activeAddress]);

    return (
        <div className="max-w-6xl mx-auto px-6">
            {/* Sentinel Discovery Meta Tags */}
            <meta name="consentchain-org-id" content="meta_finance" />
            <meta name="consentchain-app-id" content={APP_ID.toString()} />

            {/* Fintech Header */}
            <header className="mb-12 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center shadow-xl shadow-emerald-500/10">
                        <Wallet className="w-6 h-6 text-black" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tighter text-white">META FINANCE <span className="text-emerald-400">HUB</span></h1>
                        <p className="text-xs text-emerald-500/60 font-mono font-bold tracking-[0.3em]">SECURE WEALTH PORTAL</p>
                    </div>
                </div>
                <div className="hidden md:flex items-center space-x-6">
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Active Assets</span>
                        <span className="text-white font-mono">$ 1,240,559.00</span>
                    </div>
                    <button className="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all text-emerald-400">
                        <LayoutPanelLeft className="w-5 h-5" />
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left: Financial Dashboard */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Main Balance Card */}
                    <div className="relative p-1 rounded-[2.5rem] bg-gradient-to-br from-emerald-500/10 to-transparent border border-white/5 overflow-hidden group">
                        <div className="bg-[#0a0c10] p-10 rounded-[2.4rem] relative overflow-hidden">
                            {/* Animated Background Gradient */}
                            <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-emerald-500/5 blur-[120px] animate-pulse-slow"></div>
                            
                            <div className="relative z-10">
                                <div className="flex justify-between items-center mb-10">
                                    <div className="flex items-center space-x-2 text-emerald-500/80">
                                        <TrendingUp className="w-4 h-4" />
                                        <span className="text-xs font-bold uppercase tracking-widest">Total Net Worth</span>
                                    </div>
                                    <button 
                                        onClick={() => isAuthorized && setShowBalance(!showBalance)}
                                        className={`p-2 rounded-xl border transition-all ${isAuthorized ? 'bg-white/5 border-white/10 hover:border-emerald-500/30' : 'cursor-not-allowed opacity-30 text-gray-600'}`}
                                    >
                                        {showBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>

                                <div className="space-y-2">
                                    <h2 className={`text-6xl font-black tracking-tighter transition-all duration-700 ${!isAuthorized || !showBalance ? 'blur-[20px] select-none text-gray-800' : 'text-white'}`}>
                                        $ 428,290.00
                                    </h2>
                                    <div className={`flex items-center space-x-2 transition-opacity ${!isAuthorized || !showBalance ? 'opacity-20' : 'opacity-100'}`}>
                                        <span className="flex items-center text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-lg">
                                            <ArrowUpRight className="w-3 h-3 mr-1" />
                                            +12.4%
                                        </span>
                                        <span className="text-xs text-gray-500 font-medium font-mono">Last 30 days growth</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-6 mt-12 border-t border-white/5 pt-8">
                                    <StatItem label="Liquidity" value={isAuthorized ? "$22.4k" : "****"} color="text-cyan-400" />
                                    <StatItem label="Staked" value={isAuthorized ? "$104.9k" : "****"} color="text-purple-400" />
                                    <StatItem label="Yield" value={isAuthorized ? "8.2%" : "****"} color="text-yellow-400" />
                                </div>
                            </div>
                        </div>

                        {/* Financial Lock Overlay */}
                        {!isAuthorized && (
                            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center backdrop-blur-[4px] px-10 text-center">
                                <div className="w-20 h-20 rounded-3xl bg-slate-900 border border-emerald-500/20 flex items-center justify-center mb-6 shadow-2xl shadow-emerald-500/10 group-hover:scale-110 transition-transform">
                                    <ShieldCheck className="w-10 h-10 text-emerald-500" />
                                </div>
                                <h3 className="text-2xl font-black text-white mb-2">ACCESS RESTRICTED</h3>
                                <p className="text-gray-400 text-sm max-w-sm mb-6">
                                    To view your localized Meta Finance assets, you must provide a cryptographically verifiable consent hash via ConsentChain.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Meta Transactions */}
                    <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-10">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-lg font-bold flex items-center">
                                <Clock className="w-5 h-5 mr-3 text-emerald-500" />
                                Recent Transactions
                            </h3>
                            <button className="text-[10px] uppercase font-black tracking-widest text-emerald-500 hover:opacity-70 transition-all">Download CSV</button>
                        </div>
                        
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex justify-between items-center p-6 rounded-3xl bg-white/[0.02] border border-white/5">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
                                            <DollarSign className="w-5 h-5 text-gray-500" />
                                        </div>
                                        <div>
                                            <div className={`h-4 w-32 rounded-lg mb-1 transition-all ${isAuthorized ? 'bg-transparent' : 'bg-white/10 blur-[4px]'}`}>
                                                {isAuthorized && <p className="text-sm font-bold text-white">Apple Store Purchase</p>}
                                            </div>
                                            <p className="text-[10px] text-gray-600 font-mono uppercase tracking-widest">Oct 24, 2026 • 14:22</p>
                                        </div>
                                    </div>
                                    <div className={`text-right transition-all ${isAuthorized ? 'opacity-100' : 'opacity-20 blur-[8px]'}`}>
                                        <p className="font-black text-white">$ 1,299.00</p>
                                        <p className="text-[10px] text-emerald-500 font-bold uppercase">Settled</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right: The Security Sidebar */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="bg-[#111318] border border-white/5 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[80px]"></div>
                        
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-8 text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em]">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]"></span>
                                Verification Required
                            </div>

                            <h4 className="text-2xl font-black mb-4">Integrate Access</h4>
                            <p className="text-gray-500 text-sm mb-10 leading-relaxed font-medium">
                                Grant one-time access to Meta Finance to decrypt your wealth profile using ConsentChain protocol.
                            </p>

                            <ConsentWidget 
                                orgId={ORG_ID}
                                onSuccess={() => {
                                    setIsAuthorized(true);
                                    setShowBalance(true);
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                            />

                            <div className="mt-10 p-5 rounded-2xl bg-white/[0.03] border border-white/5 text-[11px] text-gray-500 leading-relaxed font-medium italic">
                                "Financial data is never stored on ConsentChain. Only the permission to view it is recorded on the Algorand blockchain."
                            </div>
                        </div>
                    </div>

                    <div className="p-1 rounded-[2.5rem] bg-gradient-to-b from-emerald-500/20 to-transparent border border-white/5">
                         <div className="bg-[#0a0c10] p-8 rounded-[2.4rem] text-center">
                            <h5 className="text-[10px] font-black text-emerald-500/60 uppercase tracking-[0.3em] mb-4">Security Level</h5>
                            <div className="text-4xl font-black text-white">TLS 1.3</div>
                            <p className="text-xs text-gray-600 mt-2 font-mono">Blockchain Verified</p>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatItem({ label, value, color }: { label: string, value: string, color: string }) {
    return (
        <div className="text-left">
            <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest block mb-1">{label}</span>
            <span className={`text-lg font-black tracking-tighter ${color}`}>{value}</span>
        </div>
    );
}
