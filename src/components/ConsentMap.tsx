'use client';

import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Building2, User, Activity } from 'lucide-react';
import { ORGANIZATIONS } from '@/lib/constants';

interface ConsentMapProps {
    activeAddress: string | null;
    consents: Array<{
        organization_id: string;
        status: string;
    }>;
}

export default function ConsentMap({ activeAddress, consents }: ConsentMapProps) {
    const activeConsents = useMemo(() => 
        consents.filter(c => c.status?.toLowerCase() === 'active'),
    [consents]);

    // Positions for organizations in a circle
    const getOrgPosition = (index: number, total: number) => {
        const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
        const radius = 140; // Desktop radius
        return {
            x: Math.cos(angle) * radius,
            y: Math.sin(angle) * radius
        };
    };

    if (!activeAddress) return null;

    return (
        <div className="relative w-full max-w-2xl h-[400px] flex items-center justify-center mb-12">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-blue-500/5 blur-[100px] rounded-full" />
            
            {/* Connections */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <AnimatePresence>
                    {activeConsents.map((consent, i) => {
                        const pos = getOrgPosition(i, activeConsents.length || 1);
                        return (
                            <motion.line
                                key={`line-${consent.organization_id}`}
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{ pathLength: 1, opacity: 0.4 }}
                                exit={{ opacity: 0 }}
                                x1="50%"
                                y1="50%"
                                x2={`calc(50% + ${pos.x}px)`}
                                y2={`calc(50% + ${pos.y}px)`}
                                stroke="url(#lineGradient)"
                                strokeWidth="2"
                                strokeDasharray="4 4"
                            >
                                <animate
                                    attributeName="stroke-dashoffset"
                                    from="20"
                                    to="0"
                                    dur="1s"
                                    repeatCount="indefinite"
                                />
                            </motion.line>
                        );
                    })}
                </AnimatePresence>
                <defs>
                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                </defs>
            </svg>

            {/* Central Node (User) */}
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="relative z-10 w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-[0_0_50px_-10px_rgba(59,130,246,0.5)] border border-white/20"
            >
                <User className="w-10 h-10 text-white" />
                <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 rounded-3xl bg-blue-400/20 -z-10"
                />
            </motion.div>

            {/* Organization Nodes */}
            <AnimatePresence>
                {activeConsents.map((consent, i) => {
                    const pos = getOrgPosition(i, activeConsents.length);
                    const orgName = ORGANIZATIONS.find(o => o.id === consent.organization_id)?.name || consent.organization_id;
                    
                    return (
                        <motion.div
                            key={`node-${consent.organization_id}`}
                            initial={{ scale: 0, x: 0, y: 0 }}
                            animate={{ 
                                scale: 1, 
                                x: pos.x, 
                                y: pos.y,
                                transition: { type: 'spring', damping: 12, stiffness: 100 }
                            }}
                            exit={{ scale: 0 }}
                            className="absolute flex flex-col items-center group"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center shadow-lg group-hover:border-indigo-500/50 transition-colors">
                                <Building2 className="w-6 h-6 text-indigo-400 group-hover:text-indigo-300" />
                            </div>
                            <div className="absolute top-14 whitespace-nowrap bg-black/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/5 text-[10px] font-bold text-gray-300 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                                {orgName}
                            </div>
                            {/* Data Stream Activity indicator */}
                            <motion.div
                                animate={{ opacity: [0.2, 1, 0.2] }}
                                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
                                className="absolute -top-1 -right-1"
                            >
                                <Activity className="w-3 h-3 text-green-400" />
                            </motion.div>
                        </motion.div>
                    );
                })}
            </AnimatePresence>

            {/* Hint */}
            {activeConsents.length > 0 && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { delay: 1 } }}
                    className="absolute -bottom-8 text-xs text-gray-500 font-medium tracking-widest uppercase flex items-center gap-2"
                >
                    <Shield className="w-3 h-3 text-blue-500" />
                    Active Decentralized Connections
                </motion.div>
            )}
        </div>
    );
}
