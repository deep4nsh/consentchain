'use client';

import { useState, useEffect } from 'react';
import { Shield, Clock, FileText, Database, Webhook, Activity, BadgeAlert, BadgeCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { useWallet } from '@txnlab/use-wallet-react';
import { parseAlgorandError } from '@/lib/errorParser';

interface ConsentRecord {
    transactionId: string;
    organization_id: string;
    data_scope: string;
    purpose: string;
    consent_timestamp: string;
    expiry_date: string;
    status: 'active' | 'expired' | 'revoked';
}

export default function Dashboard() {
    const { activeAddress: accountAddress, signTransactions } = useWallet();
    const [mounted, setMounted] = useState(false);

    const [consents, setConsents] = useState<ConsentRecord[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [revokingId, setRevokingId] = useState<string | null>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    const fetchConsents = async () => {
        if (!accountAddress) return;

        try {
            setLoading(true);
            const res = await fetch(`/api/consents/${accountAddress}`);
            const data = await res.json();

            if (!data.success) {
                throw new Error(data.error);
            }

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

            // STEP 1: Build Unsigned Revocation Txn on Backend
            const buildRes = await fetch('/api/consent/revoke', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ organization_id: organizationId, user_id: accountAddress })
            });

            const buildData = await buildRes.json();
            if (!buildData.success) throw new Error(buildData.error);

            // STEP 2: Sign in Frontend Web3 Wallet
            const unsignedTxnsBase64 = buildData.txns as string[];
            const uint8ArrayTxns = unsignedTxnsBase64.map(b64 => new Uint8Array(Buffer.from(b64, 'base64')));

            let signedTxnGroups;
            try {
                signedTxnGroups = await signTransactions(uint8ArrayTxns);
            } catch (err: any) {
                console.error(err);
                throw new Error("Transaction signing failed or was rejected by user");
            }

            // STEP 3: Submit signed transactions
            const base64SignedTxns = signedTxnGroups.filter(Boolean).map((arrIdx: any) => Buffer.from(arrIdx).toString('base64'));

            const submitRes = await fetch('/api/consent/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    signedTxns: base64SignedTxns
                })
            });

            const submitData = await submitRes.json();
            if (!submitData.success) throw new Error(submitData.error);

            // Refetch to get updated status
            await fetchConsents();
        } catch (err: any) {
            alert(`Failed to revoke: ${err.message}`);
        } finally {
            setRevokingId(null);
        }
    };

    useEffect(() => {
        if (mounted && accountAddress) {
            fetchConsents();
        } else {
            setConsents([]);
        }
    }, [mounted, accountAddress]);

    return (
        <main className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center">

            {/* Background decoration */}
            <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-gray-950">
                <div className="absolute top-0 right-[10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[10%] left-[10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px]" />
            </div>

            <div className="w-full max-w-5xl mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
                <div>
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 mb-2">My Data Consents</h1>
                    <p className="text-gray-400">Manage who has access to your data on-chain.</p>
                </div>

                {mounted && accountAddress && (
                    <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 flex items-center space-x-2 backdrop-blur-sm self-start sm:self-auto">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-sm font-medium text-gray-300">
                            {accountAddress.substring(0, 8)}...{accountAddress.substring(accountAddress.length - 8)}
                        </span>
                    </div>
                )}
            </div>

            {error && (
                <div className="w-full max-w-5xl bg-red-500/10 border border-red-500/20 text-red-500 px-6 py-4 rounded-xl mb-8">
                    Error loading consents: {error}
                </div>
            )}

            {mounted && !accountAddress ? (
                <div className="flex-1 w-full flex items-center justify-center pt-12">
                    <div className="w-full max-w-lg glass-card rounded-2xl p-10 text-center border border-yellow-500/20 bg-yellow-500/5 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500/50 to-orange-500/50" />
                        <Shield className="w-16 h-16 text-yellow-500/80 mx-auto mb-6" />
                        <h2 className="text-2xl font-bold mb-3 text-white tracking-wide">Wallet Disconnected</h2>
                        <p className="text-gray-400 mb-8 leading-relaxed">
                            Connect your Pera Wallet using the top navigation bar to view your immutable consent records.
                        </p>
                    </div>
                </div>
            ) : loading ? (
                <div className="flex-1 w-full flex items-center justify-center pt-12">
                    <div className="flex flex-col items-center space-y-4">
                        <Shield className="w-12 h-12 text-blue-500 animate-pulse" />
                        <p className="text-gray-400">Fetching immutable records from Algorand...</p>
                    </div>
                </div>
            ) : consents.length === 0 ? (
                <div className="w-full max-w-5xl glass-card rounded-2xl p-12 text-center border border-white/10 bg-white/[0.02]">
                    <Database className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold mb-2 text-gray-200">No Consent Records Found</h2>
                    <p className="text-gray-500 mb-6">You haven't granted access to any organizations yet.</p>
                </div>
            ) : (
                <div className="w-full max-w-5xl space-y-4">
                    {consents.map((consent, index) => (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            key={consent.transactionId}
                            className={`bg-white/[0.02] border border-white/10 transition-all rounded-2xl p-6 backdrop-blur-sm relative overflow-hidden group ${consent.status !== 'active' ? 'opacity-70' : 'hover:bg-white/[0.04]'}`}
                        >
                            <div className={`absolute top-0 left-0 w-1 h-full ${consent.status === 'active' ? 'bg-green-500'
                                : consent.status === 'revoked' ? 'bg-red-500'
                                    : 'bg-gray-600'
                                }`} />

                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="space-y-4 flex-1">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-white/5 rounded-lg border border-white/10">
                                            <Webhook className="w-5 h-5 text-indigo-400" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-white tracking-wide">{consent.organization_id}</h3>
                                            <a href={`https://lora.algokit.io/testnet/transaction/${consent.transactionId}`} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:text-blue-300 font-mono truncate max-w-[200px] sm:max-w-[300px] block">
                                                Txn: {consent.transactionId.substring(0, 16)}...
                                            </a>
                                        </div>

                                        <div className="ml-auto md:hidden">
                                            {consent.status === 'active' ? (
                                                <span className="flex items-center text-xs font-medium text-green-400 bg-green-400/10 px-2.5 py-1 rounded-full border border-green-400/20">
                                                    <BadgeCheck className="w-3 h-3 mr-1" /> Active
                                                </span>
                                            ) : consent.status === 'revoked' ? (
                                                <span className="flex items-center text-xs font-medium text-red-500 bg-red-500/10 px-2.5 py-1 rounded-full border border-red-500/20">
                                                    <BadgeAlert className="w-3 h-3 mr-1" /> Revoked
                                                </span>
                                            ) : (
                                                <span className="flex items-center text-xs font-medium text-gray-400 bg-gray-400/10 px-2.5 py-1 rounded-full border border-gray-400/20">
                                                    <BadgeAlert className="w-3 h-3 mr-1" /> Expired
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1"><Database className="w-3 h-3" /> Data Scope</p>
                                            <p className="text-sm font-medium text-gray-300 capitalize">{consent.data_scope.replace(',', ', ')}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1"><Activity className="w-3 h-3" /> Purpose</p>
                                            <p className="text-sm font-medium text-gray-300 capitalize">{consent.purpose}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1"><Clock className="w-3 h-3" /> Granted</p>
                                            <p className="text-sm font-medium text-gray-300">{new Date(consent.consent_timestamp).toLocaleDateString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1"><Shield className="w-3 h-3" /> Expires</p>
                                            <p className="text-sm font-medium text-gray-300">{new Date(consent.expiry_date).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="hidden md:flex flex-col items-end space-y-4 min-w-[120px]">
                                    {consent.status === 'active' ? (
                                        <>
                                            <span className="flex items-center text-sm font-medium text-green-400 bg-green-400/10 px-3 py-1 rounded-full border border-green-400/20">
                                                <BadgeCheck className="w-4 h-4 mr-1.5" /> Active
                                            </span>
                                            <button
                                                onClick={() => handleRevoke(consent.organization_id)}
                                                disabled={revokingId === consent.organization_id}
                                                className="text-sm font-medium text-red-400 hover:text-red-300 transition-colors border-b border-dashed border-red-500/50 hover:border-red-400 disabled:opacity-50"
                                            >
                                                {revokingId === consent.organization_id ? 'Revoking...' : 'Revoke Access'}
                                            </button>
                                        </>
                                    ) : consent.status === 'revoked' ? (
                                        <span className="flex items-center text-sm font-medium text-red-500 bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20">
                                            <BadgeAlert className="w-4 h-4 mr-1.5" /> Revoked
                                        </span>
                                    ) : (
                                        <span className="flex items-center text-sm font-medium text-gray-400 bg-gray-400/10 px-3 py-1 rounded-full border border-gray-400/20">
                                            <BadgeAlert className="w-4 h-4 mr-1.5" /> Expired
                                        </span>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </main>
    );
}
