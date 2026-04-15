'use client';

import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import Link from 'next/link';
import { Shield, Activity, CreditCard, ArrowRight, ExternalLink, BadgeCheck, Zap } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useRef, MouseEvent } from 'react';

// --- ANIMATION VARIANTS --- //
const container = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const item = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
};

// --- DATA --- //
const portals = [
    {
        name: "St. Mary's Digital Health",
        orgId: 'health-vault-demo',
        description: 'Access patient records, vitals, and appointments with on-chain consent verification.',
        href: '/demo/hospital',
        icon: Activity,
        glowColor: 'rgba(56, 189, 248, 0.15)', // Light Blue Glow
        borderColor: 'rgba(56, 189, 248, 0.5)',
        badge: 'Medical',
    },
    {
        name: 'FinSentinel Banking',
        orgId: 'finsentinel-demo',
        description: 'Unlock secure financial data, transaction history, and yield analytics.',
        href: '/demo/bank',
        icon: CreditCard,
        glowColor: 'rgba(16, 185, 129, 0.15)', // Emerald Glow
        borderColor: 'rgba(16, 185, 129, 0.5)',
        badge: 'Banking',
    },
    {
        name: 'MetaFinance Hub',
        orgId: 'meta-finance-demo',
        description: 'Institutional wealth management portal with encrypted net worth and DeFi integrations.',
        href: '/partners/metafinance',
        icon: Shield,
        glowColor: 'rgba(168, 85, 247, 0.15)', // Purple Glow
        borderColor: 'rgba(168, 85, 247, 0.5)',
        badge: 'Finance',
    },
];

const externalPortals = [
    {
        name: "St. Mary's Medical Portal",
        description: 'Standalone medical portal with Sentinel auto-unlock.',
        href: 'https://medical-demo-theta.vercel.app',
    },
    {
        name: 'MetaBank Institutional',
        description: 'Standalone banking portal with ledger verification.',
        href: 'https://banking-demo-coral.vercel.app',
    },
    {
        name: 'UltraCover Insurance',
        description: 'Standalone insurance portal with claims access.',
        href: 'https://insurance-demo-inky.vercel.app',
    },
];

// --- COMPONENTS --- //

function SpotlightCard({ children, glowColor, borderColor, isTarget }: any) {
  let mouseX = useMotionValue(0);
  let mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    let { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div
      className={`group relative h-full rounded-[2rem] border-[3px] bg-[#0A0C10] overflow-hidden transition-all duration-300 transform-gpu
        ${isTarget ? 'border-indigo-400 shadow-[8px_8px_0_#818CF8] hover:shadow-[4px_4px_0_#818CF8] translate-y-1' : 'border-white/20 shadow-[8px_8px_0_#6366f1] hover:shadow-[4px_4px_0_#6366f1] hover:translate-y-1'}
      `}
      onMouseMove={handleMouseMove}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-[2rem] opacity-0 transition duration-300 group-hover:opacity-100 mix-blend-screen"
        style={{
          background: useMotionTemplate`radial-gradient(400px circle at ${mouseX}px ${mouseY}px, ${borderColor}, transparent 80%)`,
        }}
      />
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-[2rem] opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`radial-gradient(600px circle at ${mouseX}px ${mouseY}px, ${glowColor}, transparent 80%)`,
        }}
      />
      
      {isTarget && (
         <div className="absolute inset-0 bg-indigo-500/5 animate-pulse-slow pointer-events-none" />
      )}

      <div className="relative z-10 w-full h-full flex flex-col">
        {children}
      </div>
    </div>
  );
}

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
            className="min-h-screen flex flex-col items-center p-4 pt-32 pb-20 relative overflow-hidden"
        >
            {/* Cinematic Background Mesh */}
            <div className="absolute inset-0 pointer-events-none z-0 opacity-20">
                <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px] mix-blend-screen" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[100px] mix-blend-screen" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(10,12,16,0.95)_80%)]" />
            </div>

            {/* Header */}
            <motion.div variants={item} className="text-center mb-16 max-w-2xl relative z-10">
                <div className="inline-flex items-center space-x-2 bg-[#050608] border-[2px] border-white/20 rounded-full px-5 py-2 mb-8 shadow-[4px_4px_0_#6366f1]">
                    <Zap className="w-4 h-4 text-indigo-400 animate-pulse" />
                    <span className="text-xs font-black text-white uppercase tracking-widest">Enterprise Sandbox</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight text-white drop-shadow-2xl uppercase">
                    Verification <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Hub.</span>
                </h1>
                <p className="text-gray-400 text-lg font-light leading-relaxed max-w-xl mx-auto">
                    A zero-trust environment. Test how applications interact directly with your cryptographic consent rules perfectly.
                </p>
            </motion.div>

            {/* Spotlight Bento Grid Portals */}
            <motion.div variants={item} className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24 relative z-10">
                {portals.map((portal) => {
                    const isTarget = grantTarget === portal.orgId;
                    
                    return (
                        <div 
                            key={portal.orgId} 
                            ref={isTarget ? targetRef : null}
                            className={isTarget ? "md:col-span-2 lg:col-span-1" : ""} // Subtle asymmetry fallback if 2 columns
                        >
                            <SpotlightCard glowColor={portal.glowColor} borderColor={portal.borderColor} isTarget={isTarget}>
                                <Link href={portal.href} className="w-full h-full block relative p-8 flex flex-col justify-between z-10">
                                    
                                    <div>
                                        <div className="flex justify-between items-start mb-8">
                                            <div className="w-16 h-16 rounded-[1rem] bg-[#050608] border-2 border-white/20 shadow-[4px_4px_0_rgba(255,255,255,0.1)] flex items-center justify-center">
                                                <portal.icon className="w-8 h-8 text-indigo-400 opacity-90" />
                                            </div>
                                            
                                            {isTarget && (
                                                <div className="px-3 py-1.5 rounded-full bg-indigo-500/20 text-[10px] font-black uppercase tracking-widest text-indigo-300 border-2 border-indigo-500/50 shadow-[2px_2px_0_rgba(99,102,241,0.5)]">
                                                    Action Required
                                                </div>
                                            )}
                                        </div>
                                        
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 block">
                                            {portal.badge} Integration
                                        </span>
                                        <h3 className="text-2xl font-bold text-gray-100 mb-3 group-hover:text-white transition-colors">
                                            {portal.name}
                                        </h3>
                                        <p className="text-sm text-gray-400 leading-relaxed mb-8">
                                            {portal.description}
                                        </p>
                                    </div>

                                    <div className="flex items-center text-sm font-bold text-gray-500 group-hover:text-white transition-colors mt-auto">
                                        Initialize Link
                                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </div>

                                </Link>
                            </SpotlightCard>
                        </div>
                    );
                })}
            </motion.div>

            {/* Floating Standalone Demos */}
            <motion.div variants={item} className="w-full max-w-4xl relative z-10 flex flex-col items-center">
                <div className="flex items-center gap-4 mb-8 opacity-60">
                    <div className="h-px w-24 bg-gradient-to-r from-transparent to-white/20" />
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-[0.3em]">Standalone Sites</span>
                    <div className="h-px w-24 bg-gradient-to-l from-transparent to-white/20" />
                </div>
                
                <div className="flex flex-wrap justify-center gap-4">
                    {externalPortals.map((portal) => (
                        <motion.a
                            whileHover={{ y: -5 }}
                            key={portal.href}
                            href={portal.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-4 p-4 pr-6 rounded-[1rem] bg-[#0A0C10] border-2 border-white/20 hover:border-white/40 transition-all shadow-[4px_4px_0_#6366f1]"
                        >
                            <div className="w-8 h-8 rounded-full bg-[#050608] flex items-center justify-center border-2 border-white/20 shadow-[2px_2px_0_rgba(255,255,255,0.2)]">
                                <ExternalLink className="w-4 h-4 text-indigo-400" />
                            </div>
                            <div>
                                <h4 className="text-sm font-black text-white uppercase">{portal.name}</h4>
                            </div>
                        </motion.a>
                    ))}
                </div>
            </motion.div>
            
            <motion.div variants={item} className="mt-20 text-center opacity-40 relative z-10">
                <p className="text-[10px] font-mono tracking-widest text-gray-400 uppercase">
                    Secured by Algorand App #758027210
                </p>
            </motion.div>
        </motion.main>
    );
}

export default function DemoPortalHub() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-[#0a0a0c]">
                <Shield className="w-12 h-12 text-purple-500 animate-pulse-slow" />
            </div>
        }>
            <DemoPortalContent />
        </Suspense>
    );
}
