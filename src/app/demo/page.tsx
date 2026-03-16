'use client';

import { useState } from 'react';
import ConsentCard from '@/components/ConsentCard';
import TransactionReceipt from '@/components/TransactionReceipt';
import { motion } from 'framer-motion';

export default function Home() {
    const [status, setStatus] = useState<'pending' | 'processing' | 'success'>('pending');
    const [receiptData, setReceiptData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const handleAccept = async () => {
        setStatus('processing');
        setError(null);

        // Construct the payload as required by MVP specs
        const payload = {
            user_id: "U123",
            organization_id: "ORG001",
            data_scope: "medical_history,vitals",
            purpose: "research",
            consent_timestamp: new Date().toISOString(),
            expiry_date: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString() // 6 months
        };

        try {
            const response = await fetch('/api/consent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error || 'Failed to process consent transaction');
            }

            setReceiptData(data);
            setStatus('success');
        } catch (err: any) {
            console.error(err);
            setError(err.message);
            setStatus('pending');
        }
    };

    const handleDecline = () => {
        alert("Consent declined. In a full system, you would be redirected.");
    };

    return (
        <main className="min-h-screen flex flex-col items-center justify-center p-4 pt-20">
            {/* Header Logo */}
            <div className="absolute top-20 left-8 flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <span className="font-bold text-white leading-none">C</span>
                </div>
                <span className="font-bold text-xl tracking-tight">ConsentChain Demo</span>
            </div>

            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-500/10 border border-red-500/20 text-red-500 px-6 py-3 rounded-xl mb-8 max-w-lg w-full text-center"
                >
                    {error}
                </motion.div>
            )}

            {status !== 'success' ? (
                <ConsentCard
                    onAccept={handleAccept}
                    onDecline={handleDecline}
                    isLoading={status === 'processing'}
                />
            ) : (
                <TransactionReceipt {...receiptData} />
            )}

            {/* Background decoration */}
            <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
                <div className="absolute top-[20%] left-[20%] w-96 h-96 bg-purple-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[20%] right-[20%] w-96 h-96 bg-blue-500/10 rounded-full blur-[120px]" />
            </div>
        </main>
    );
}
