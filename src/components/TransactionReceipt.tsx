'use client';

import { CheckCircle2, Copy, ExternalLink, Hash, Clock, Server, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface ReceiptProps {
    txId: string;
    round: number;
    hash: string;
    timestamp: string;
}

export default function TransactionReceipt({ txId, round, hash, timestamp }: ReceiptProps) {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(txId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, type: 'spring' }}
            className="glass-card rounded-2xl p-8 max-w-lg w-full relative overflow-hidden text-left"
        >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-teal-500" />

            <div className="flex flex-col items-center justify-center mb-8">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring' }}
                >
                    <CheckCircle2 className="w-16 h-16 text-emerald-400 mb-4" />
                </motion.div>
                <h2 className="text-2xl font-bold text-center">Consent Recorded</h2>
                <p className="text-emerald-400 text-sm mt-1 font-medium bg-emerald-400/10 px-3 py-1 rounded-full">
                    Verified on Algorand TestNet
                </p>
            </div>

            <div className="space-y-4">
                {/* Transaction ID */}
                <div className="p-4 rounded-xl bg-black/40 border border-white/5 group">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2 text-sm text-gray-400">
                            <Hash className="w-4 h-4" />
                            <span>Transaction ID</span>
                        </div>
                        <button
                            onClick={copyToClipboard}
                            className="text-gray-400 hover:text-white transition-colors"
                        >
                            {copied ? <span className="text-emerald-400 text-xs font-medium">Copied!</span> : <Copy className="w-4 h-4" />}
                        </button>
                    </div>
                    <p className="font-mono text-xs break-all text-white/90 leading-relaxed">
                        {txId}
                    </p>
                    <a shrink-0
                        href={`https://testnet.explorer.perawallet.app/tx/${txId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 text-sm mt-3 font-medium transition-colors"
                    >
                        <span>View on Explorer</span>
                        <ExternalLink className="w-4 h-4" />
                    </a>
                </div>

                {/* Data Hash */}
                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                    <div className="flex items-center space-x-2 text-sm text-gray-400 mb-1">
                        <FileText className="w-4 h-4" />
                        <span>Cryptographic Payload Hash</span>
                    </div>
                    <p className="font-mono text-xs break-all text-gray-300">
                        {hash}
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                        <div className="flex items-center space-x-2 text-sm text-gray-400 mb-1">
                            <Server className="w-4 h-4" />
                            <span>Block Round</span>
                        </div>
                        <p className="font-mono text-sm text-white">
                            {round}
                        </p>
                    </div>

                    <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                        <div className="flex items-center space-x-2 text-sm text-gray-400 mb-1">
                            <Clock className="w-4 h-4" />
                            <span>Timestamp</span>
                        </div>
                        <p className="font-mono text-sm text-white truncate" title={timestamp}>
                            {new Date(timestamp).toLocaleTimeString()}
                        </p>
                    </div>
                </div>
            </div>

            <button
                onClick={() => window.location.reload()}
                className="w-full mt-8 py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-colors"
            >
                Done
            </button>
        </motion.div>
    );
}

