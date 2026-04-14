'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Shield, Activity, CreditCard, Heart, ArrowRight, ExternalLink, BadgeCheck } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useRef } from 'react';

const container = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const portals = [
    {
        name: "St. Mary's Digital Health",
        orgId: 'health-vault-demo',
        description: 'Access patient records, vitals, and appointments with on-chain consent verification.',
        href: '/demo/hospital',
        icon: Activity,
        color: 'from-sky-500 to-blue-600',
        shadow: 'shadow-sky-500/20',
        badge: 'Medical',
    },
    {
        name: 'FinSentinel Banking',
        orgId: 'finsentinel-demo',
        description: 'Unlock secure financial data, transaction history, and yield analytics.',
        href: '/demo/bank',
        icon: CreditCard,
        color: 'from-emerald-500 to-teal-600',
        shadow: 'shadow-emerald-500/20',
        badge: 'Banking',
    },
    {
        name: 'MetaFinance Hub',
        orgId: 'meta-finance-demo',
        description: 'Institutional wealth management portal with encrypted net worth and DeFi integrations.',
        href: '/partners/metafinance',
        icon: Shield,
        color: 'from-emerald-400 to-cyan-500',
        shadow: 'shadow-emerald-400/20',
        badge: 'Finance',
    },
];

const externalPortals = [
    {
        name: "St. Mary's Medical Portal",
        description: 'Standalone medical portal with Sentinel auto-unlock.',
        href: 'https://medical-demo-theta.vercel.app',
        badge: 'External',
    },
    {
        name: 'MetaBank Institutional',
        description: 'Standalone banking portal with ledger verification.',
        href: 'https://banking-demo-coral.vercel.app',
        badge: 'External',
    },
    {
        name: 'UltraCover Insurance',
        description: 'Standalone insurance portal with claims access.',
        href: 'https://insurance-demo-inky.vercel.app',
        badge: 'External',
    },
];

function DemoPortalContent() {
    const searchParams = useSearchParams();
    const grantTarget = searchParams.get('grant');
    const targetRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (grantTarget && targetRef.current) {
            targetRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [grantTarget]);

    return (
        <motion.main 
            initial="hidden"
            animate="visible"
            variants={container}
            className="min-h-screen flex flex-col items-center p-4 pt-28 pb-20"
        >
            {/* Header */}
            <motion.div variants={item} className="text-center mb-16 max-w-2xl">
                <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-6">
                    <Shield className="w-4 h-4 text-blue-400" />
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Demo Portals</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400">
                    Choose a Portal
                </h1>
                <p className="text-gray-400 text-lg leading-relaxed">
                    Each portal simulates a real-world organization. Connect your wallet, 
                    grant consent, and watch the data unlock in real-time.
                </p>
            </motion.div>

            {/* In-App Portals */}
            <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                {portals.map((portal) => {
                    const isTarget = grantTarget === portal.orgId;
                    return (
                        <motion.div 
                            key={portal.orgId} 
                            variants={item}
                            ref={isTarget ? targetRef : null}
                            className={isTarget ? 'relative' : ''}
                        >
                            {isTarget && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 px-4 py-1 rounded-full bg-blue-600 text-[10px] font-black uppercase tracking-tighter text-white animate-bounce shadow-xl shadow-blue-600/40 border border-blue-400/50">
                                    Action Required
                                </div>
                            )}
                            <Link href={portal.href} className="block group">
                                <div className={`relative glass-card rounded-3xl p-8 h-full overflow-hidden border transition-all duration-500 group-hover:shadow-2xl group-hover:-translate-y-1 ${
                                    isTarget 
                                        ? 'border-blue-500/50 shadow-[0_0_50px_-12px_rgba(59,130,246,0.5)] ring-2 ring-blue-500/20' 
                                        : 'border-white/5 hover:border-white/15'
                                }`}>
                                    {/* Background glow */}
                                    <div className={`absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br ${portal.color} opacity-10 blur-[60px] group-hover:opacity-20 transition-opacity duration-500`} />
                                    
                                    <div className="relative z-10">
                                        {/* Badge */}
                                        <div className="flex justify-between items-start mb-6">
                                            <span className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                                {portal.badge}
                                            </span>
                                            {isTarget && <BadgeCheck className="w-5 h-5 text-blue-400 animate-pulse" />}
                                        </div>
                                        
                                        {/* Icon */}
                                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${portal.color} flex items-center justify-center mb-6 ${portal.shadow} shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                                            <portal.icon className="w-7 h-7 text-white" />
                                        </div>

                                        {/* Content */}
                                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">{portal.name}</h3>
                                        <p className="text-sm text-gray-500 leading-relaxed mb-6">{portal.description}</p>

                                        {/* CTA */}
                                        <div className={`flex items-center text-sm font-bold transition-colors ${isTarget ? 'text-blue-400' : 'text-gray-500'} group-hover:text-white`}>
                                            <span>Enter Portal</span>
                                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    );
                })}
            </div>

            {/* External Standalone Demos */}
            <motion.div variants={item} className="w-full max-w-5xl">
                <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <ExternalLink className="w-4 h-4" />
                    Standalone Demo Sites
                    <span className="text-[10px] font-normal text-gray-600 normal-case tracking-normal ml-2">
                        — These work with the Sentinel extension for auto-unlock
                    </span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {externalPortals.map((portal) => (
                        <a
                            key={portal.href}
                            href={portal.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center justify-between p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/15 hover:bg-white/[0.04] transition-all"
                        >
                            <div>
                                <h4 className="text-sm font-bold text-gray-300 group-hover:text-white transition-colors">{portal.name}</h4>
                                <p className="text-xs text-gray-600 mt-1">{portal.description}</p>
                            </div>
                            <ExternalLink className="w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors flex-shrink-0 ml-4" />
                        </a>
                    ))}
                </div>
            </motion.div>

            {/* Footer hint */}
            <motion.div variants={item} className="mt-16 text-center">
                <p className="text-gray-600 text-xs">
                    All portals connect to the same ConsentChain smart contract on Algorand Testnet (App #{' '}
                    <span className="text-gray-400 font-mono">758027210</span>)
                </p>
            </motion.div>
        </motion.main>
    );
}

export default function DemoPortalHub() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <Shield className="w-12 h-12 text-blue-500 animate-pulse" />
            </div>
        }>
            <DemoPortalContent />
        </Suspense>
    );
}
