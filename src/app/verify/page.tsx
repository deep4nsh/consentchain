'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ShieldAlert, ShieldCheck, ShieldX, Clock, Database, Building2 } from 'lucide-react';
import { ORGANIZATIONS, DATA_SCOPES } from '@/lib/constants';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5
        }
    }
};

interface ConsentRecord {
    id: string;
    organization: string;
    dataScopes: string[];
    purpose: string;
    timestamp: string;
    expiryDate: string;
    status: 'ACTIVE' | 'REVOKED' | 'EXPIRED';
}

export default function VerifyPortal() {
    const [inputAddress, setInputAddress] = useState('');
    const [selectedOrg, setSelectedOrg] = useState(ORGANIZATIONS[0].id);
    const [isSearching, setIsSearching] = useState(false);
    const [searchResult, setSearchResult] = useState<{
        status: 'SUCCESS' | 'NOT_FOUND' | 'ERROR';
        consents?: ConsentRecord[];
        latestConsent?: ConsentRecord;
        message?: string;
    } | null>(null);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputAddress.trim()) return;

        setIsSearching(true);
        setSearchResult(null);

        try {
            const response = await fetch(`/api/consents/${inputAddress}`);
            const data = await response.json();

            if (!response.ok) {
                if (response.status === 404) {
                    setSearchResult({ status: 'NOT_FOUND', message: 'No consent history found for this address.' });
                } else {
                    throw new Error(data.error || 'Failed to fetch consent records');
                }
            } else {
                const consents: ConsentRecord[] = data.consents.map((c: any) => ({
                    id: c.transactionId,
                    organization: c.organization_id,
                    dataScopes: c.data_scope ? c.data_scope.split(',') : [],
                    purpose: c.purpose,
                    timestamp: c.consent_timestamp,
                    expiryDate: c.expiry_date,
                    status: c.status?.toUpperCase()
                }));

                // Filter consents for the selected organization
                const orgConsents = consents.filter(c => c.organization === selectedOrg);

                if (orgConsents.length === 0) {
                    setSearchResult({ status: 'NOT_FOUND', message: `No consent records found between this wallet and the selected organization.` });
                } else {
                    // Highest timestamp means latest consent record
                    const latestConsent = orgConsents.reduce((latest, current) => {
                        return new Date(current.timestamp) > new Date(latest.timestamp) ? current : latest;
                    });

                    setSearchResult({ status: 'SUCCESS', consents: orgConsents, latestConsent });
                }
            }
        } catch (error: any) {
            setSearchResult({ status: 'ERROR', message: error.message || 'An unexpected error occurred while verifying consent.' });
        } finally {
            setIsSearching(false);
        }
    };

    const StatusBadge = ({ status }: { status?: string }) => {
        const normalizedStatus = status?.toUpperCase();
        switch (normalizedStatus) {
            case 'ACTIVE':
                return (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        <ShieldCheck className="w-4 h-4 mr-2" />
                        Valid & Active
                    </span>
                );
            case 'REVOKED':
                return (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                        <ShieldX className="w-4 h-4 mr-2" />
                        Revoked by User
                    </span>
                );
            case 'EXPIRED':
                return (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        <Clock className="w-4 h-4 mr-2" />
                        Consent Expired
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-slate-500/20 text-slate-400 border border-slate-500/30">
                        <ShieldAlert className="w-4 h-4 mr-2" />
                        {status ? `Status: ${status}` : 'Unknown Status'}
                    </span>
                );
        }
    };

    return (
        <div className="min-h-screen pt-32 pb-12 px-4 sm:px-6 lg:px-8">
            <motion.div 
                className="max-w-3xl mx-auto space-y-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.div variants={itemVariants} className="text-center space-y-4">
                    <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
                        Organization Verification Portal
                    </h1>
                    <p className="text-xl text-gray-400">
                        Verify real-time, on-chain consent status for any user wallet.
                    </p>
                </motion.div>

                {/* Search Form */}
                <motion.div
                    variants={itemVariants}
                    className="glass-card rounded-2xl p-6 sm:p-8"
                >
                    <form onSubmit={handleSearch} className="space-y-6">
                        <div className="space-y-2">
                            <label className="flex items-center text-sm font-medium text-gray-300">
                                <Building2 className="w-4 h-4 mr-2 text-indigo-400" />
                                Requesting Organization
                            </label>
                            <div className="relative">
                                <select
                                    value={selectedOrg}
                                    onChange={(e) => setSelectedOrg(e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none"
                                >
                                    {ORGANIZATIONS.map(org => (
                                        <option key={org.id} value={org.id} className="bg-slate-900">{org.name}</option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-gray-400">
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="flex items-center text-sm font-medium text-gray-300">
                                <Database className="w-4 h-4 mr-2 text-blue-400" />
                                User Wallet Address
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Enter Algorand Wallet Address (e.g. 52X...)"
                                    value={inputAddress}
                                    onChange={(e) => setInputAddress(e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                />
                                <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSearching || !inputAddress.trim()}
                            className="w-full flex items-center justify-center px-4 py-4 border border-transparent rounded-xl shadow-lg shadow-indigo-500/20 text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.01] active:scale-[0.99]"
                        >
                            {isSearching ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                                    Verifying Blockchain...
                                </>
                            ) : (
                                'Check On-Chain Status'
                            )}
                        </button>
                    </form>
                </motion.div>

                {/* Results Section */}
                {searchResult && (
                    <motion.div
                        variants={itemVariants}
                        className="space-y-6"
                    >
                        {searchResult.status !== 'SUCCESS' ? (
                            <div className="glass-card border-rose-500/20 rounded-xl p-8 text-center">
                                <ShieldAlert className="w-12 h-12 text-rose-400 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-white mb-2">Consent Not Verified</h3>
                                <p className="text-gray-400">{searchResult.message}</p>
                            </div>
                        ) : searchResult.latestConsent && (
                            <div className="glass-card rounded-2xl overflow-hidden">
                                <div className="border-b border-white/5 bg-white/5 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="space-y-1">
                                        <h3 className="text-xl font-bold text-white">
                                            {ORGANIZATIONS.find(o => o.id === searchResult.latestConsent!.organization)?.name || searchResult.latestConsent.organization}
                                        </h3>
                                        <div className="flex items-center text-sm text-indigo-400 font-mono">
                                            <span className="bg-indigo-500/10 px-2 py-0.5 rounded truncate max-w-[200px] sm:max-w-md block">
                                                {inputAddress}
                                            </span>
                                        </div>
                                    </div>
                                    <StatusBadge status={searchResult.latestConsent.status} />
                                </div>

                                <div className="p-6 space-y-8">
                                    <div>
                                        <h4 className="text-xs font-bold text-gray-500 mb-4 uppercase tracking-widest">Authorized Data Scopes</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {searchResult.latestConsent.dataScopes.map(scopeId => {
                                                const matchingScope = DATA_SCOPES.find(s => s.id === scopeId);
                                                return (
                                                    <span key={scopeId} className="px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 rounded-lg text-sm font-medium">
                                                        {matchingScope ? matchingScope.label : scopeId}
                                                    </span>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-black/30 rounded-xl p-4 border border-white/5 space-y-1">
                                            <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Purpose</div>
                                            <div className="text-gray-200 capitalize font-medium">{searchResult.latestConsent.purpose.replace(/_/g, ' ')}</div>
                                        </div>
                                        <div className="bg-black/30 rounded-xl p-4 border border-white/5 space-y-1">
                                            <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Transaction ID</div>
                                            {searchResult.latestConsent.id !== 'SmartContractState' && searchResult.latestConsent.id !== 'CorruptedState' ? (
                                                <a
                                                    href={`https://lora.algokit.io/testnet/transaction/${searchResult.latestConsent.id}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-400 hover:text-blue-300 truncate block font-mono text-sm font-medium transition-colors"
                                                >
                                                    {searchResult.latestConsent.id}
                                                </a>
                                            ) : (
                                                <span className="text-gray-500 block font-mono text-sm mt-1">Source: On-Chain State</span>
                                            )}
                                        </div>
                                        <div className="bg-black/30 rounded-xl p-4 border border-white/5 space-y-1">
                                            <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Granted On</div>
                                            <div className="text-gray-200 font-medium">{new Date(searchResult.latestConsent.timestamp).toLocaleString()}</div>
                                        </div>
                                        <div className="bg-black/30 rounded-xl p-4 border border-white/5 space-y-1">
                                            <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Expires On</div>
                                            <div className="text-gray-200 font-medium">{new Date(searchResult.latestConsent.expiryDate).toLocaleString()}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}
