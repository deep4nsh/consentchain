'use client';

import { useState, useEffect, Suspense } from 'react';
import { Shield, Clock, FileText, Database, Webhook, Activity, BadgeAlert, BadgeCheck, ExternalLink, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWallet } from '@txnlab/use-wallet-react';
import { parseAlgorandError } from '@/lib/errorParser';
import { ORGANIZATIONS, resolveOrganizationName } from '@/lib/constants';
import { ConsentChainSDK } from '@/lib/sdk/core';
import { algodClient, indexerClient } from '@/lib/algorand';
import { useSearchParams, useRouter } from 'next/navigation';
import ConsentMap from '@/components/ConsentMap';

const APP_ID = parseInt(process.env.NEXT_PUBLIC_APP_ID || '0', 10);

interface ConsentRecord {
    transactionId: string;
    organization_id: string;
    data_scope: string;
    purpose: string;
    consent_timestamp: string;
    expiry_date: string;
    status: 'active' | 'expired' | 'revoked';
}

function DashboardContent() {
    const { activeAddress: accountAddress, signTransactions } = useWallet();
    const [mounted, setMounted] = useState(false);
    const [consents, setConsents] = useState<ConsentRecord[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [revokingId, setRevokingId] = useState<string | null>(null);
    const [auditLogs, setAuditLogs] = useState<string[]>([]);
    const [isSyncing, setIsSyncing] = useState(false);
    const [syncSuccess, setSyncSuccess] = useState(false);

    const addAuditLog = (msg: string) => {
        setAuditLogs(prev => [msg, ...prev].slice(0, 5));
    };

    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
    }, []);

    // Handle Auto-Revoke deep link
    useEffect(() => {
        const revokeOrgId = searchParams.get('revoke');
        if (mounted && revokeOrgId && accountAddress && consents.length > 0) {
            // Check if this org actually has an active consent
            const hasActive = consents.some(c => c.organization_id === revokeOrgId && c.status === 'active');
            if (hasActive) {
                addAuditLog(`Auto-Revoke triggered for ${revokeOrgId}`);
                handleRevoke(revokeOrgId);
                // Clear the param
                const params = new URLSearchParams(searchParams.toString());
                params.delete('revoke');
                router.replace(`/dashboard?${params.toString()}`);
            }
        }
    }, [mounted, searchParams, accountAddress, consents]);

    const fetchConsents = async () => {
        if (!accountAddress) return;

        try {
            setLoading(true);
            const res = await fetch(`/api/consents/${accountAddress}`);
            const data = await res.json();

            if (!data.success) throw new Error(data.error);
            setConsents(data.consents);
        } catch (err: any) {
            console.error("Dashboard error:", err);
            setError(parseAlgorandError(err));
        } finally {
            setLoading(false);
        }
    };

    const handleRevoke = async (organizationId: string) => {
        if (!accountAddress) return;
        try {
            setRevokingId(organizationId);
            setError(null);

            const sdk = new ConsentChainSDK(algodClient, indexerClient, APP_ID);
            
            // 1. Prepare Revocation Transaction group using SDK
            const txns = await sdk.prepareRevoke(accountAddress, organizationId);
            
            // 2. Sign Transaction(s)
            const signedGroups = await signTransactions(txns.map(t => t.toByte()));
            
            // 3. Submit
            const base64SignedTxns = (signedGroups.filter(Boolean) as Uint8Array[]).map(txn => Buffer.from(txn).toString('base64'));
            const submitRes = await fetch('/api/consent/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ signedTxns: base64SignedTxns })
            });

            const submitData = await submitRes.json();
            if (!submitData.success) throw new Error(submitData.error);

            addAuditLog(`Revoked: Success for ${organizationId}. TxID: ${submitData.txId.substring(0, 8)}`);
            
            // Wait a moment for the indexer/algod to catch up
            setTimeout(() => fetchConsents(), 2000);
        } catch (err: any) {
            setError(parseAlgorandError(err));
        } finally {
            setRevokingId(null);
        }
    };

    const handleSync = () => {
        if (!accountAddress || typeof window === 'undefined') return;
        
        setIsSyncing(true);
        console.log(`[Dashboard] Broadcasting identity sync for: ${accountAddress}`);

        // Universal Handshake: Broadcast to any listening Sentinel V2 instance
        window.postMessage({ 
            type: 'SENTINEL_SYNC_IDENTITY', 
            address: accountAddress 
        }, '*');

        // Automatic fallback for sync UI state
        setTimeout(() => {
            setIsSyncing(false);
        }, 1000);
    };

    // Listen for sync success from extension context
    useEffect(() => {
        const handleSyncSuccess = (event: MessageEvent) => {
            if (event.data.type === 'SENTINEL_SYNC_SUCCESS') {
                setSyncSuccess(true);
                addAuditLog("Sentinel: Connection established successfully.");
                setTimeout(() => setSyncSuccess(false), 3000);
            }
        };

        window.addEventListener('message', handleSyncSuccess);
        return () => window.removeEventListener('message', handleSyncSuccess);
    }, []);

    useEffect(() => {
        if (mounted && accountAddress) {
            fetchConsents();
        } else {
            setConsents([]);
        }
    }, [mounted, accountAddress]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    return (
        <motion.main 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center"
        >
            <motion.div variants={itemVariants} className="w-full max-w-5xl mb-12 flex flex-col md:flex-row md:justify-between md:items-end gap-6 text-center md:text-left">
                <div className="flex-1">
                    <h1 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 mb-3 tracking-tight">
                        Security Vault
                    </h1>
                    <p className="text-lg text-gray-500 font-light max-w-xl mx-auto md:mx-0">
                        Manage your immutable data permissions on the Algorand ledger. Unified consent control for all your apps.
                    </p>
                </div>

                {mounted && accountAddress && (
                    <div className="flex items-center gap-3">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleSync}
                            disabled={isSyncing}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-xl border transition-all ${
                                syncSuccess 
                                ? 'bg-green-500/20 border-green-500/50 text-green-400' 
                                : 'bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/20'
                            }`}
                        >
                            <Shield className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                            <span className="text-xs font-bold uppercase tracking-wider">
                                {syncSuccess ? 'Synced!' : 'Sync Sentinel'}
                            </span>
                        </motion.button>

                        <div className="glass-card px-4 py-2 flex items-center space-x-3 self-center md:self-auto rounded-xl border border-white/10">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-xs font-mono font-medium text-gray-400">
                                {accountAddress.substring(0, 6)}...{accountAddress.substring(accountAddress.length - 6)}
                            </span>
                        </div>
                    </div>
                )}
            </motion.div>

            {error && (
                <div className="w-full max-w-5xl bg-red-500/10 border border-red-500/20 text-red-500 px-6 py-4 rounded-xl mb-8 text-sm flex items-start gap-3">
                    <BadgeAlert className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div dangerouslySetInnerHTML={{ __html: error }} />
                </div>
            )}

            {!accountAddress ? (
                <motion.div variants={itemVariants} className="w-full max-w-lg glass-card rounded-3xl p-12 text-center mt-12">
                    <Shield className="w-16 h-16 text-yellow-500/80 mx-auto mb-6 animate-pulse-slow" />
                    <h2 className="text-2xl font-bold mb-3 text-white">Wallet Not Connected</h2>
                    <p className="text-gray-400 mb-8 font-light">
                        Please connect your Algorand wallet to view and manage your data consents.
                    </p>
                </motion.div>
            ) : loading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                    <div className="relative">
                        <Shield className="w-12 h-12 text-blue-500 animate-spin-slow" />
                        <div className="absolute inset-0 bg-blue-500/10 blur-xl rounded-full" />
                    </div>
                    <p className="text-gray-500 font-light">Decrypting on-chain permissions...</p>
                </div>
            ) : consents.length === 0 ? (
                <motion.div variants={itemVariants} className="w-full max-w-5xl glass-card rounded-3xl p-20 text-center border-dashed border-white/5">
                    <Database className="w-16 h-16 text-gray-700 mx-auto mb-4" />
                    <h2 className="text-xl font-bold mb-2 text-gray-300">Clean Slate</h2>
                    <p className="text-gray-500 font-light">You haven't granted any data permissions yet.</p>
                </motion.div>
            ) : (
                <div className="w-full max-w-5xl flex flex-col items-center">
                    <ConsentMap activeAddress={accountAddress} consents={consents} />
                    
                    {/* Live Audit Feed */}
                    <div className="w-full mb-8 bg-black/30 border border-white/5 rounded-2xl p-4">
                        <div className="flex items-center gap-2 mb-3 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">
                            <Activity className="w-3 h-3 text-green-500" />
                            Security Audit Stream
                        </div>
                        <div className="space-y-1.5">
                            <AnimatePresence mode='popLayout'>
                                {auditLogs.length > 0 ? auditLogs.map((log, i) => (
                                    <motion.div 
                                        key={log + i}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 10 }}
                                        className="text-[11px] font-mono text-blue-400 px-3 py-1 bg-blue-500/5 rounded flex items-center justify-between"
                                    >
                                        <span>{'>'} {log}</span>
                                    </motion.div>
                                )) : (
                                    <div className="text-[10px] font-mono text-gray-700 italic text-center py-1">
                                        Monitoring blockchain events...
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    <div className="w-full grid grid-cols-1 gap-4">
                        {consents.map((consent) => (
                            <motion.div
                                variants={itemVariants}
                                key={consent.organization_id + consent.transactionId}
                                className={`glass-card p-6 flex flex-col md:flex-row gap-6 group hover:border-white/20 transition-all rounded-3xl relative overflow-hidden ${consent.status !== 'active' ? 'opacity-50 grayscale shadow-none' : 'hover:shadow-[0_0_30px_rgba(59,130,246,0.1)]'}`}
                            >
                                {/* Verification Badge */}
                                <div className="absolute top-4 right-4 flex gap-2">
                                    {consent.transactionId === 'BoxVerified' && (
                                        <div className="flex items-center gap-1.5 bg-blue-500/10 text-blue-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-500/20">
                                            <BadgeCheck className="w-3 h-3" /> Blockchain Verified
                                        </div>
                                    )}
                                    <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                        consent.status === 'active' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                                    }`}>
                                        {consent.status}
                                    </div>
                                </div>

                                <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-2xl border border-white/10 flex items-center justify-center">
                                    <Webhook className="w-7 h-7 text-indigo-400" />
                                </div>

                                <div className="flex-1 space-y-4">
                                    <div className="pt-1">
                                        <h3 className="text-xl font-bold text-white mb-1">
                                            {resolveOrganizationName(consent.organization_id)}
                                        </h3>
                                        <p className="text-sm text-gray-400 font-light line-clamp-1">
                                            Granted for: <span className="text-gray-300 italic">"{consent.purpose}"</span>
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                                        <div className="space-y-1">
                                            <div className="text-[10px] uppercase tracking-wider text-gray-500 font-bold flex items-center gap-1.5">
                                                <Database className="w-3 h-3 text-blue-400" /> Scope
                                            </div>
                                            <div className="text-xs font-medium text-gray-300 capitalize">{consent.data_scope.split(',').join(', ')}</div>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="text-[10px] uppercase tracking-wider text-gray-500 font-bold flex items-center gap-1.5">
                                                <Clock className="w-3 h-3 text-indigo-400" /> Granted
                                            </div>
                                            <div className="text-xs font-medium text-gray-300">{new Date(consent.consent_timestamp).toLocaleDateString()}</div>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="text-[10px] uppercase tracking-wider text-gray-500 font-bold flex items-center gap-1.5">
                                                <BadgeCheck className="w-3 h-3 text-emerald-400" /> Expires
                                            </div>
                                            <div className="text-xs font-medium text-gray-300">{new Date(consent.expiry_date).toLocaleDateString()}</div>
                                        </div>
                                        <div className="space-y-1 hidden lg:block">
                                            <div className="text-[10px] uppercase tracking-wider text-gray-500 font-bold flex items-center gap-1.5">
                                                <ExternalLink className="w-3 h-3 text-purple-400" /> Evidence
                                            </div>
                                            {consent.transactionId !== 'BoxVerified' && consent.transactionId !== 'LegacyLocalState' ? (
                                                <a 
                                                    href={`https://lora.algokit.io/testnet/transaction/${consent.transactionId}`}
                                                    target="_blank"
                                                    className="text-[10px] font-mono text-blue-400 hover:underline block truncate"
                                                >
                                                    {consent.transactionId.substring(0, 10)}...
                                                </a>
                                            ) : (
                                                <div className="text-[10px] font-mono text-gray-500">Box Storage</div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {consent.status === 'active' && (
                                    <div className="flex md:flex-col justify-end gap-3 pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-white/5 md:pl-6 min-w-[140px]">
                                        <button
                                            onClick={() => handleRevoke(consent.organization_id)}
                                            disabled={revokingId === consent.organization_id}
                                            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl transition-all border border-red-500/20 disabled:opacity-50 text-xs font-bold group"
                                        >
                                            {revokingId === consent.organization_id ? (
                                                <Activity className="w-3.5 h-3.5 animate-spin" />
                                            ) : (
                                                <Trash2 className="w-3.5 h-3.5 group-hover:shake" />
                                            )}
                                            {revokingId === consent.organization_id ? 'Revoking...' : 'Revoke Access'}
                                        </button>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}
        </motion.main>
    );
}

export default function Dashboard() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-[#020617]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                    <p className="text-gray-500 font-medium animate-pulse">Initializing Security Vault...</p>
                </div>
            </div>
        }>
            <DashboardContent />
        </Suspense>
    );
}
