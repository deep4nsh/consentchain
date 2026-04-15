'use client';

import { CheckCircle2, Copy, ExternalLink, Hash, Clock, Server, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface ReceiptProps {
    transactionId: string;
    round: number;
    hash: string;
    timestamp: string;
    onClose?: () => void;
}

export default function TransactionReceipt({ transactionId, round, hash, timestamp, onClose }: ReceiptProps) {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(transactionId);
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
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400" />

            <div className="flex flex-col items-center justify-center mb-8">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', damping: 12 }}
                    className="relative"
                >
                    <div className="absolute inset-0 bg-emerald-400/20 blur-2xl rounded-full" />
                    <CheckCircle2 className="w-20 h-20 text-emerald-400 mb-4 relative z-10" />
                </motion.div>
                <h2 className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Consent Recorded</h2>
                <div className="flex items-center space-x-2 mt-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest">
                        Verified on Algorand TestNet
                    </p>
                </div>
            </div>

            <div className="space-y-6">
                {/* Visual Timeline */}
                <div className="relative flex justify-between items-center px-4 py-8 bg-white/5 rounded-2xl border border-white/5">
                    <div className="absolute top-1/2 left-[10%] right-[10%] h-[2px] bg-white/10 -translate-y-1/2" />
                    <div className="absolute top-1/2 left-[10%] w-[80%] h-[2px] bg-gradient-to-r from-emerald-500 to-cyan-500 -translate-y-1/2 origin-left scale-x-0 animate-[scaleX_1.5s_ease-out_forwards]" />
                    
                    {[
                        { label: 'Broadcast', delay: 0 },
                        { label: 'Validated', delay: 0.5 },
                        { label: 'Committed', delay: 1 }
                    ].map((step, i) => (
                        <div key={step.label} className="relative z-10 flex flex-col items-center">
                            <motion.div 
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: step.delay, type: 'spring' }}
                                className="w-8 h-8 rounded-full bg-slate-900 border-2 border-emerald-500 flex items-center justify-center text-[10px] font-bold text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                            >
                                {i + 1}
                            </motion.div>
                            <motion.span 
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: step.delay + 0.2 }}
                                className="absolute -bottom-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap"
                            >
                                {step.label}
                            </motion.span>
                        </div>
                    ))}
                </div>

                {/* Transaction ID */}
                <div className="p-5 rounded-2xl bg-black/40 border border-white/10 group transition-all hover:border-emerald-500/30">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2 text-xs font-bold text-gray-500 uppercase tracking-widest">
                            <Hash className="w-4 h-4 text-emerald-400/70" />
                            <span>Transaction ID</span>
                        </div>
                        <button
                            onClick={copyToClipboard}
                            className="text-gray-400 hover:text-white transition-all transform active:scale-90"
                        >
                            {copied ? <span className="text-emerald-400 text-xs font-bold">COPIED!</span> : <Copy className="w-4 h-4" />}
                        </button>
                    </div>
                    <p className="font-mono text-[11px] break-all text-white/90 leading-relaxed font-medium">
                        {transactionId}
                    </p>
                    <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                        <a
                            href={`https://lora.algokit.io/testnet/transaction/${transactionId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 text-sm font-semibold transition-colors group"
                        >
                            <span>Explore on Blockchain</span>
                            <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </a>
                    </div>
                </div>

                {/* Data Hash */}
                <div className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                    <div className="flex items-center space-x-2 text-xs font-bold text-gray-500 uppercase tracking-widest">
                        <FileText className="w-4 h-4 text-blue-400/70" />
                        <span>Cryptographic Hash</span>
                    </div>
                    <p className="font-mono text-[10px] break-all text-gray-400 leading-tight">
                        {hash}
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                        <div className="flex items-center space-x-2 text-xs font-bold text-gray-500 uppercase tracking-widest">
                            <Server className="w-4 h-4 text-purple-400/70" />
                            <span>Block</span>
                        </div>
                        <p className="font-mono text-lg font-bold text-white leading-none">
                            {round}
                        </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                        <div className="flex items-center space-x-2 text-xs font-bold text-gray-500 uppercase tracking-widest">
                            <Clock className="w-4 h-4 text-amber-400/70" />
                            <span>Time</span>
                        </div>
                        <p className="font-mono text-lg font-bold text-white leading-none truncate" title={timestamp}>
                            {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                    </div>
                </div>
            </div>

            <button
                onClick={onClose || (() => window.location.reload())}
                className="w-full mt-8 py-4 px-4 rounded-xl bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 text-white font-bold transition-all transform hover:scale-[1.02] active:scale-[0.98] border border-white/10 shadow-lg"
            >
                {onClose ? 'Finish & View Records' : 'Done'}
            </button>
        </motion.div>
    );
}
