'use client';

import { Shield, FileText, Clock, Building2, CheckSquare, Square } from 'lucide-react';
import { motion } from 'framer-motion';

export interface Organization { id: string, name: string }
export interface DataScope { id: string, label: string }
export interface Purpose { id: string, label: string }
export interface Duration { value: number, label: string }

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
            className="glass-card rounded-2xl p-8 max-w-lg w-full relative overflow-hidden"
        >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500" />

            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/10 mb-6 mx-auto">
                <Shield className="w-8 h-8 text-blue-400" />
            </div>

            <h2 className="text-2xl font-bold text-center mb-2">Consent Configuration</h2>
            <p className="text-gray-400 text-center mb-8">
                Configure the parameters for the consent you are about to grant.
            </p>

            <div className="space-y-4 mb-8">
                {/* Organization Setup */}
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                    <div className="flex items-center space-x-2">
                        <Building2 className="w-5 h-5 text-gray-400" />
                        <p className="text-sm font-medium text-gray-300">Requesting Organization</p>
                    </div>
                    <select
                        value={selectedOrganization}
                        onChange={(e) => onOrganizationChange(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none"
                    >
                        <option value="" disabled>Select an Organization</option>
                        {organizations.map(org => (
                            <option key={org.id} value={org.id}>{org.name}</option>
                        ))}
                    </select>
                </div>

                {/* Data Scopes Setup */}
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                    <div className="flex items-center space-x-2">
                        <FileText className="w-5 h-5 text-gray-400" />
                        <p className="text-sm font-medium text-gray-300">Data Scopes</p>
                    </div>
                    <div className="space-y-2">
                        {dataScopes.map((scope) => {
                            const isSelected = selectedScopes.includes(scope.id);
                            return (
                                <div
                                    key={scope.id}
                                    onClick={() => onScopeToggle(scope.id)}
                                    className={`flex items-center space-x-3 p-2.5 rounded-lg border cursor-pointer transition-colors ${isSelected ? 'bg-blue-500/10 border-blue-500/30' : 'bg-black/20 border-white/5 hover:border-white/20'}`}
                                >
                                    <div className="text-blue-400">
                                        {isSelected ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5 opacity-50" />}
                                    </div>
                                    <span className={`text-sm ${isSelected ? 'text-white' : 'text-gray-400'}`}>{scope.label}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Duration & Purpose Setup */}
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-4">
                    <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                            <Clock className="w-5 h-5 text-gray-400" />
                            <p className="text-sm font-medium text-gray-300">Duration</p>
                        </div>
                        <select
                            value={selectedDuration}
                            onChange={(e) => onDurationChange(Number(e.target.value))}
                            className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none"
                        >
                            <option value={0} disabled>Select Duration</option>
                            {durations.map(dur => (
                                <option key={dur.value} value={dur.value}>{dur.label}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-3 pt-2 border-t border-white/10">
                        <div className="flex items-center space-x-2">
                            <FileText className="w-5 h-5 text-gray-400" />
                            <p className="text-sm font-medium text-gray-300">Purpose of Processing</p>
                        </div>
                        <select
                            value={selectedPurpose}
                            onChange={(e) => onPurposeChange(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none"
                        >
                            <option value="" disabled>Select Purpose</option>
                            {purposes.map(purp => (
                                <option key={purp.id} value={purp.id}>{purp.label}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="flex space-x-4">
                <button
                    onClick={onDecline}
                    disabled={isLoading}
                    className="flex-1 py-3 px-4 rounded-xl border border-white/10 hover:bg-white/5 transition-colors disabled:opacity-50"
                >
                    Cancel
                </button>
                <button
                    onClick={onAccept}
                    disabled={isLoading || !isWalletConnected || !selectedOrganization || selectedScopes.length === 0 || !selectedPurpose || selectedDuration === 0}
                    className="flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium transition-all relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
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
