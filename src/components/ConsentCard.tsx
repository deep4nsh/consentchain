'use client';

import { Shield, FileText, Clock, Building2, CheckSquare, Square } from 'lucide-react';
import { motion } from 'framer-motion';

import { Organization, DataScope, Purpose, Duration } from '@/lib/constants';
interface ConsentCardProps {
    organizations: Organization[];
    dataScopes: DataScope[];
    purposes: Purpose[];
    durations: Duration[];

    selectedOrganization: string;
    onOrganizationChange: (id: string) => void;

    selectedScopes: string[];
    onScopeToggle: (id: string) => void;

    selectedPurpose: string;
    onPurposeChange: (id: string) => void;

    selectedDuration: number;
    onDurationChange: (value: number) => void;

    onAccept: () => void;
    onDecline: () => void;
    isLoading: boolean;
    isWalletConnected: boolean;
}

export default function ConsentCard({
    organizations, dataScopes, purposes, durations,
    selectedOrganization, onOrganizationChange,
    selectedScopes, onScopeToggle,
    selectedPurpose, onPurposeChange,
    selectedDuration, onDurationChange,
    onAccept, onDecline, isLoading, isWalletConnected
}: ConsentCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="glass-card rounded-2xl p-4 md:p-8 max-w-lg w-full relative"
        >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500" />

            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/10 mb-6 mx-auto">
                <Shield className="w-8 h-8 text-blue-400" />
            </div>

            <h2 className="text-xl md:text-2xl font-bold text-center mb-1">Consent Configuration</h2>
            <p className="text-gray-400 text-xs md:text-sm text-center mb-6 md:mb-8">
                Configure the parameters for the consent you are about to grant.
            </p>

            <div className="space-y-4 mb-8">
                {/* Organization Setup */}
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4 transition-all hover:border-white/20">
                    <div className="flex items-center space-x-2">
                        <Building2 className="w-5 h-5 text-indigo-400" />
                        <p className="text-sm font-semibold text-gray-300">Requesting Organization</p>
                    </div>
                    <div className="relative">
                        <select
                            value={selectedOrganization}
                            onChange={(e) => onOrganizationChange(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none transition-all"
                        >
                            <option value="" disabled className="bg-slate-900">Select an Organization</option>
                            {organizations.map(org => (
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

                {/* Data Scopes Setup */}
                <div className="p-4 md:p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3 md:space-y-4 transition-all hover:border-white/20">
                    <div className="flex items-center space-x-2">
                        <FileText className="w-5 h-5 text-blue-400" />
                        <p className="text-sm font-semibold text-gray-300">Data Scopes</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {dataScopes.map((scope) => {
                            const isSelected = selectedScopes.includes(scope.id);
                            return (
                                <motion.div
                                    key={scope.id}
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                    onClick={() => onScopeToggle(scope.id)}
                                    className={`flex items-center space-x-2 p-2.5 rounded-xl border cursor-pointer transition-all ${isSelected ? 'glass-card border-blue-500/50 bg-blue-500/10' : 'bg-black/20 border-white/5 hover:border-white/20'}`}
                                >
                                    <div className="text-blue-400 flex-shrink-0">
                                        {isSelected ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4 opacity-30" />}
                                    </div>
                                    <span className={`text-[11px] md:text-xs font-medium leading-tight ${isSelected ? 'text-white' : 'text-gray-400'}`}>{scope.label}</span>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* Duration & Purpose Setup */}
                <div className="p-4 md:p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4 md:space-y-6 transition-all hover:border-white/20">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2 md:space-y-3">
                            <div className="flex items-center space-x-2">
                                <Clock className="w-4 h-4 text-amber-400" />
                                <p className="text-[11px] md:text-xs font-bold uppercase tracking-wider text-gray-400">Validity</p>
                            </div>
                            <div className="relative">
                                <select
                                    value={selectedDuration}
                                    onChange={(e) => onDurationChange(Number(e.target.value))}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none transition-all"
                                >
                                    <option value={0} disabled className="bg-slate-900">Duration</option>
                                    {durations.map(dur => (
                                        <option key={dur.value} value={dur.value} className="bg-slate-900">{dur.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2 md:space-y-3">
                            <div className="flex items-center space-x-2">
                                <FileText className="w-4 h-4 text-emerald-400" />
                                <p className="text-[11px] md:text-xs font-bold uppercase tracking-wider text-gray-400">Purpose</p>
                            </div>
                            <div className="relative">
                                <select
                                    value={selectedPurpose}
                                    onChange={(e) => onPurposeChange(e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none transition-all"
                                >
                                    <option value="" disabled className="bg-slate-900">Purpose</option>
                                    {purposes.map(purp => (
                                        <option key={purp.id} value={purp.id} className="bg-slate-900">{purp.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex space-x-4">
                <button
                    onClick={onDecline}
                    disabled={isLoading}
                    className="flex-1 py-4 px-4 rounded-xl border border-white/10 hover:bg-white/5 text-gray-300 font-medium transition-all active:scale-95 disabled:opacity-50"
                >
                    Cancel
                </button>
                <button
                    onClick={onAccept}
                    disabled={isLoading || !isWalletConnected || !selectedOrganization || selectedScopes.length === 0 || !selectedPurpose || selectedDuration === 0}
                    className="flex-1 py-4 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                        </span>
                    ) : (
                        'Allow Consent'
                    )}
                </button>
            </div>

            <p className="text-xs text-center text-gray-500 mt-6">
                By clicking Allow, your consent will be cryptographically hashed and recorded immutably on the Algorand blockchain.
            </p>
        </motion.div>
    );
}
