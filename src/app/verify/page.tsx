'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ShieldAlert, ShieldCheck, ShieldX, Clock, Database, Building2 } from 'lucide-react';
import { ORGANIZATIONS, DATA_SCOPES } from '@/lib/constants';

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
                const consents: ConsentRecord[] = data.consents;

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
            console.error('API Error:', error);
            setSearchResult({ status: 'ERROR', message: error.message || 'An unexpected error occurred while verifying consent.' });
        } finally {
            setIsSearching(false);
        }
    };

    const StatusBadge = ({ status }: { status?: 'ACTIVE' | 'REVOKED' | 'EXPIRED' }) => {
        switch (status) {
            case 'ACTIVE':
                return (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-500/20 text-green-400 border border-green-500/30">
                        <ShieldCheck className="w-4 h-4 mr-2" />
                        Valid & Active
                    </span>
                );
            case 'REVOKED':
                return (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-red-500/20 text-red-400 border border-red-500/30">
                        <ShieldX className="w-4 h-4 mr-2" />
                        Revoked by User
                    </span>
                );
            case 'EXPIRED':
                return (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                        <Clock className="w-4 h-4 mr-2" />
                        Consent Expired
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-gray-500/20 text-gray-400 border border-gray-500/30">
                        <ShieldAlert className="w-4 h-4 mr-2" />
                        Unknown Status
                    </span>
                );
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto space-y-8">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">
                        Organization Verification Portal
                    </h1>
                    <p className="text-xl text-gray-400">
                        Verify real-time, on-chain consent status for any user wallet.
                    </p>
                </div>

                {/* Search Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-[1px] rounded-2xl bg-gradient-to-br from-indigo-500/30 via-purple-500/30 to-blue-500/30"
                >
                    <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 sm:p-8">
                        <form onSubmit={handleSearch} className="space-y-6">

                            <div className="space-y-2">
                                <label className="flex items-center text-sm font-medium text-gray-300">
                                    <Building2 className="w-4 h-4 mr-2 text-indigo-400" />
                                    Requesting Organization
                                </label>
                                <select
                                    value={selectedOrg}
                                    onChange={(e) => setSelectedOrg(e.target.value)}
                                    className="w-full bg-black/50 border border-indigo-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none"
                                >
                                    {ORGANIZATIONS.map(org => (
                                        <option key={org.id} value={org.id}>{org.name}</option>
                                    ))}
                                </select>
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
                                        className="w-full bg-black/50 border border-blue-500/30 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                    />
                                    <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSearching || !inputAddress.trim()}
                                className="w-full flex items-center justify-center px-4 py-3.5 border border-transparent rounded-xl shadow-lg shadow-indigo-500/20 text-base font-medium text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                {isSearching ? 'Verifying Blockchain...' : 'Check On-Chain Status'}
                            </button>
                        </form>
                    </div>
                </motion.div>

                {/* Results Section */}
                {searchResult && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        {searchResult.status !== 'SUCCESS' ? (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
                                <ShieldAlert className="w-12 h-12 text-red-400 mx-auto mb-3" />
                                <h3 className="text-lg font-medium text-white mb-1">Consent Not Verified</h3>
                                <p className="text-red-300/80">{searchResult.message}</p>
                            </div>
                        ) : searchResult.latestConsent && (
                            <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
                                <div className="border-b border-white/5 bg-white/5 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-1">
                                            {ORGANIZATIONS.find(o => o.id === searchResult.latestConsent!.organization)?.name || searchResult.latestConsent.organization}
                                        </h3>
                                        <div className="flex items-center text-sm text-gray-400">
                                            <span className="font-mono text-xs bg-black/50 px-2 py-1 rounded truncate max-w-[200px] sm:max-w-xs block">
                                                {inputAddress}
                                            </span>
                                        </div>
                                    </div>
                                    <StatusBadge status={searchResult.latestConsent.status} />
                                </div>

                                <div className="p-6 space-y-6">
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-400 mb-3 uppercase tracking-wider">Authorized Data Scopes</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {searchResult.latestConsent.dataScopes.map(scopeId => {
                                                const matchingScope = DATA_SCOPES.find(s => s.id === scopeId);
                                                return (
                                                    <span key={scopeId} className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 rounded-lg text-sm">
                                                        {matchingScope ? matchingScope.label : scopeId}
                                                    </span>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="bg-black/30 rounded-xl p-4 border border-white/5">
                                            <div className="text-xs text-gray-500 mb-1 uppercase tracking-wider">Purpose</div>
                                            <div className="text-gray-200 capitalize">{searchResult.latestConsent.purpose.replace('_', ' ')}</div>
                                        </div>
                                        <div className="bg-black/30 rounded-xl p-4 border border-white/5">
                                            <div className="text-xs text-gray-500 mb-1 uppercase tracking-wider">Transaction ID</div>
                                            <a
                                                href={`https://lora.algokit.io/testnet/transaction/${searchResult.latestConsent.id}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-400 hover:text-blue-300 truncate block font-mono text-sm"
                                            >
                                                {searchResult.latestConsent.id}
                                            </a>
                                        </div>
                                        <div className="bg-black/30 rounded-xl p-4 border border-white/5">
                                            <div className="text-xs text-gray-500 mb-1 uppercase tracking-wider">Granted On</div>
                                            <div className="text-gray-200">{new Date(searchResult.latestConsent.timestamp).toLocaleString()}</div>
                                        </div>
                                        <div className="bg-black/30 rounded-xl p-4 border border-white/5">
                                            <div className="text-xs text-gray-500 mb-1 uppercase tracking-wider">Expires On</div>
                                            <div className="text-gray-200">{new Date(searchResult.latestConsent.expiryDate).toLocaleString()}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </div>
        </div>
    );
}
