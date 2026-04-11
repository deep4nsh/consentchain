'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Activity, Clipboard, Lock, Unlock, AlertCircle, Calendar, Plus } from 'lucide-react';
import ConsentWidget from '@/components/ConsentWidget';
import { useWallet } from '@txnlab/use-wallet-react';
import { ConsentChainSDK } from '@/lib/sdk';
import { algodClient, indexerClient } from '@/lib/algorand';

const APP_ID = parseInt(process.env.NEXT_PUBLIC_APP_ID || '758027210', 10);
const ORG_ID = 'apollo_hospitals';

export default function ApolloHealthPortal() {
    const { activeAddress } = useWallet();
    const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // Initialize SDK (memoize to prevent re-creation on every render)
    const sdk = useMemo(() => new ConsentChainSDK(algodClient, indexerClient, APP_ID), []);

    // Check initial consent status on mount or address change
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
            {/* Dashboard Header */}
            <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center space-x-2 text-blue-500 mb-2">
                        <Activity className="w-5 h-5" />
                        <span className="text-sm font-semibold tracking-widest uppercase">Apollo Health Network</span>
                    </div>
                    <h1 className="text-4xl font-extrabold text-white">Patient Dashboard</h1>
                    <p className="text-gray-400 mt-1">Hello, Patient ID: <span className="text-blue-400 font-mono">AP-990-21</span></p>
                </div>
                <div className="flex gap-4">
                    <button className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-500 transition-all flex items-center shadow-lg shadow-blue-600/20">
                        <Plus className="w-4 h-4 mr-2" />
                        Report Incident
                    </button>
                    <button className="px-5 py-2.5 rounded-xl bg-white/5 text-gray-400 border border-white/10 font-medium hover:bg-white/10 transition-all">
                        Settings
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Vital Records Section */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold flex items-center">
                            <Clipboard className="w-5 h-5 mr-3 text-blue-400" />
                            Recent Vital Statistics
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
                            {/* Vital Card 1: Heart Rate */}
                            <VitalCard 
                                label="Heart Rate" 
                                value="72 BPM" 
                                trend="+2%" 
                                icon={<Heart className="w-6 h-6 text-red-400" />} 
                                isLocked={!isAuthorized}
                            />
                            
                            {/* Vital Card 2: Blood Pressure */}
                            <VitalCard 
                                label="Blood Pressure" 
                                value="120/80" 
                                trend="Normal" 
                                icon={<Activity className="w-6 h-6 text-emerald-400" />} 
                                isLocked={!isAuthorized}
                            />

                            {/* Overlay for Locked Vitals */}
                            {!isAuthorized && (
                                <div className="absolute inset-0 z-10 flex items-center justify-center rounded-3xl overflow-hidden backdrop-blur-[6px] bg-black/40 border border-white/5">
                                    <div className="text-center p-8">
                                        <div className="w-16 h-16 rounded-full bg-blue-600/20 flex items-center justify-center mx-auto mb-4 border border-blue-500/30">
                                            <Lock className="w-8 h-8 text-blue-400" />
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-2">Health Data Locked</h3>
                                        <p className="text-gray-400 text-sm max-w-xs mx-auto">
                                            Apollo Hospitals requires your verified blockchain consent before retrieving biometric data.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Labs & History Showcase */}
                    <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-lg font-bold">Timeline of Lab Results</h3>
                            <span className="text-sm text-gray-500 underline cursor-pointer">View Archive</span>
                        </div>
                        
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-all cursor-not-allowed group">
                                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mr-4 group-hover:scale-105 transition-transform">
                                        <Calendar className="w-6 h-6 text-gray-500" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-gray-300">Biochemistry Lab Report</h4>
                                        <p className="text-xs text-gray-500 font-mono tracking-widest">STW-9003-8822</p>
                                    </div>
                                    <Lock className="w-4 h-4 text-gray-600" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar: The Integration Area */}
                <div className="space-y-8">
                    <div className="bg-gradient-to-br from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-3xl p-8 relative overflow-hidden group">
                        {/* Background Decoration */}
                        <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-500/10 blur-3xl group-hover:bg-blue-500/20 transition-all"></div>
                        
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-6 text-blue-400 text-sm font-bold uppercase tracking-widest">
                                <Unlock className="w-4 h-4" />
                                <span>Security Gateway</span>
                            </div>
                            
                            <h3 className="text-2xl font-bold mb-4">Patient Data Access</h3>
                            <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                                Use the ConsentChain widget below to grant secure, time-limited access to your health metrics.
                            </p>

                            <ConsentWidget 
                                orgId={ORG_ID}
                                onSuccess={() => {
                                    setIsAuthorized(true);
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                            />
                            
                            <div className="mt-8 pt-6 border-t border-white/10 flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-gray-500 mt-0.5" />
                                <p className="text-[10px] uppercase tracking-widest leading-loose text-gray-500 font-bold">
                                    Only the patient associated with the active wallet can initiate this transaction on the Algorand Testnet.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Partner Footer Stats */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-3xl bg-white/[0.02] border border-white/5 text-center">
                            <span className="text-2xl font-extrabold text-blue-400">99.9%</span>
                            <p className="text-[10px] text-gray-600 uppercase font-black tracking-tighter">Uptime</p>
                        </div>
                        <div className="p-4 rounded-3xl bg-white/[0.02] border border-white/5 text-center">
                            <span className="text-2xl font-extrabold text-purple-400">Box</span>
                            <p className="text-[10px] text-gray-600 uppercase font-black tracking-tighter">Verified</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Subcomponent for Vital Cards
function VitalCard({ label, value, trend, icon, isLocked }: { 
    label: string; 
    value: string; 
    trend: string; 
    icon: React.ReactNode;
    isLocked: boolean; 
}) {
    return (
        <div className={`p-8 rounded-3xl border transition-all ${
            isLocked 
                ? 'bg-slate-900/50 border-white/5 saturate-[0.2]' 
                : 'bg-white/[0.03] border-white/10 hover:border-blue-500/30'
        }`}>
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                    {icon}
                </div>
                <span className={`text-xs px-2 py-1 rounded-lg ${
                    trend.includes('+') ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'
                }`}>
                    {trend}
                </span>
            </div>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">{label}</p>
            <p className="text-3xl font-black mt-1 text-white tabular-nums">{value}</p>
        </div>
    );
}
