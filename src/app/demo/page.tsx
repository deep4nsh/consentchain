'use client';

import { motion } from 'framer-motion';
import ConsentWidget from '@/components/ConsentWidget';
import { Shield } from 'lucide-react';

export default function IntegrationDemo() {
    return (
        <motion.main 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen flex flex-col items-center justify-center p-4 pt-20"
        >
            {/* Header Logo */}
            <div className="absolute top-24 left-8 hidden md:flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <Shield className="w-6 h-6 text-white" />
                </div>
                <span className="font-bold text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">ConsentChain Demo</span>
            </div>

            <div className="text-center mb-12 max-w-2xl">
                <h1 className="text-4xl font-extrabold mb-4 text-white">Example Third-Party Integration</h1>
                <p className="text-gray-400 text-lg">
                    This page demonstrates how an external hospital or bank can integrate ConsentChain with just one component.
                </p>
                <div className="mt-8 p-4 bg-slate-900 border border-white/10 rounded-2xl font-mono text-xs text-blue-400 shadow-inner">
                    <code>{`<ConsentWidget orgId="apollo_hospitals" />`}</code>
                </div>
            </div>

            {/* The Integrated Widget */}
            <ConsentWidget 
                orgId="apollo_hospitals" 
            />
            
            <div className="mt-16 text-gray-500 text-sm flex flex-col items-center space-y-4">
                <p>Protected by ConsentChain Smart Contract (Algorand Testnet)</p>
                <a href="/" className="px-6 py-2 border border-white/10 rounded-full hover:bg-white/5 transition-all">
                    Back to Home
                </a>
            </div>
        </motion.main>
    );
}
