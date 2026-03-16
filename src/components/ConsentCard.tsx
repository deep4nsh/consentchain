'use client';

import { Shield, FileText, Clock, Building2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface ConsentCardProps {
    onAccept: () => void;
    onDecline: () => void;
    isLoading: boolean;
}

export default function ConsentCard({ onAccept, onDecline, isLoading }: ConsentCardProps) {
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

            <h2 className="text-2xl font-bold text-center mb-2">Consent Request</h2>
            <p className="text-gray-400 text-center mb-8">
                An organization is requesting access to your personal data.
            </p>

            <div className="space-y-4 mb-8">
                <div className="flex items-start space-x-4 p-4 rounded-xl bg-white/5 border border-white/10">
                    <Building2 className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                        <p className="text-sm text-gray-400">Organization</p>
                        <p className="font-medium text-white">HealthPlus Research</p>
                    </div>
                </div>

                <div className="flex items-start space-x-4 p-4 rounded-xl bg-white/5 border border-white/10">
                    <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                        <p className="text-sm text-gray-400">Data Requested</p>
                        <p className="font-medium text-white">Medical History, Vitals</p>
                    </div>
                </div>

                <div className="flex items-start space-x-4 p-4 rounded-xl bg-white/5 border border-white/10">
                    <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                        <p className="text-sm text-gray-400">Duration & Purpose</p>
                        <p className="font-medium text-white">6 Months for Medical Research</p>
                    </div>
                </div>
            </div>

            <div className="flex space-x-4">
                <button
                    onClick={onDecline}
                    disabled={isLoading}
                    className="flex-1 py-3 px-4 rounded-xl border border-white/10 hover:bg-white/5 transition-colors disabled:opacity-50"
                >
                    Decline
                </button>
                <button
                    onClick={onAccept}
                    disabled={isLoading}
                    className="flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium transition-all relative overflow-hidden disabled:opacity-50"
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
