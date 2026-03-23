'use client';

import { useState, useEffect } from 'react';
import ConsentCard from '@/components/ConsentCard';
import TransactionReceipt from '@/components/TransactionReceipt';
import { motion } from 'framer-motion';
import { useWallet } from '@txnlab/use-wallet-react';
import { ORGANIZATIONS, DATA_SCOPES, PURPOSES, DURATIONS } from '@/lib/constants';
import { parseAlgorandError } from '@/lib/errorParser';
export default function Home() {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    const { activeAddress: accountAddress, signTransactions } = useWallet();
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    const [status, setStatus] = useState<'pending' | 'processing' | 'success'>('pending');
    const [receiptData, setReceiptData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const [selectedOrganization, setSelectedOrganization] = useState<string>('');
    const [selectedScopes, setSelectedScopes] = useState<string[]>([]);
    const [selectedPurpose, setSelectedPurpose] = useState<string>('');
    const [selectedDuration, setSelectedDuration] = useState<number>(0);

    const handleScopeToggle = (id: string) => {
        setSelectedScopes((prev) =>
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
        );
    };

    const handleAccept = async () => {
        setStatus('processing');
        setError(null);

        // Construct the dynamic payload
        const payload = {
            user_id: accountAddress,
            organization_id: selectedOrganization,
            data_scope: selectedScopes.join(','),
            purpose: selectedPurpose,
            consent_timestamp: new Date().toISOString(),
            expiry_date: new Date(Date.now() + selectedDuration * 30 * 24 * 60 * 60 * 1000).toISOString()
        };

        try {
            // STEP 1: Build Unsigned Txn(s) on Backend
            const buildRes = await fetch('/api/consent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const buildData = await buildRes.json();
            if (!buildData.success) {
                throw new Error(buildData.error || 'Failed to build consent transaction');
            }

            // STEP 2: Decode Base64 and Sign in Frontend Web3 Wallet
            const unsignedTxnsBase64 = buildData.txns as string[];

            const uint8ArrayTxns = unsignedTxnsBase64.map(b64 => new Uint8Array(Buffer.from(b64, 'base64')));

            let signedTxnGroups;
            try {
                signedTxnGroups = await signTransactions(uint8ArrayTxns);
            } catch (err: any) {
                console.error(err);
                throw new Error("Transaction signing failed or was rejected by user");
            }

            // STEP 3: Submit signed transactions
            const base64SignedTxns = signedTxnGroups.filter(Boolean).map((arrIdx: any) => Buffer.from(arrIdx).toString('base64'));

            const submitRes = await fetch('/api/consent/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    signedTxns: base64SignedTxns,
                    consentHash: buildData.consentHash
                })
            });

            const submitData = await submitRes.json();
            if (!submitData.success) {
                throw new Error(submitData.error || 'Failed to submit signed transaction');
            }

            setReceiptData(submitData);
            setStatus('success');
        } catch (err: any) {
            console.error("Raw Error:", err);
            setError(parseAlgorandError(err));
            setStatus('pending');
        }
    };

    const handleDecline = () => {
        // Reset selections instead of alert
        setSelectedOrganization('');
        setSelectedScopes([]);
        setSelectedPurpose('');
        setSelectedDuration(0);
        setError("Consent configured cleared. Start over.");
    };

    return (
        <motion.main 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="min-h-screen flex flex-col items-center justify-center p-4 pt-20"
        >
            {/* Header Logo */}
            <motion.div variants={itemVariants} className="absolute top-24 left-8 hidden md:flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <span className="font-bold text-white text-xl">C</span>
                </div>
                <span className="font-bold text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">ConsentChain Portal</span>
            </motion.div>

            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-500/10 border border-red-500/20 text-red-500 px-6 py-3 rounded-xl mb-8 max-w-lg w-full text-center"
                >
                    {error}
                </motion.div>
            )}

            {mounted && !accountAddress && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 px-6 py-3 rounded-xl mb-8 max-w-lg w-full text-center"
                >
                    Please connect your Wallet via the Navbar to interact!
                </motion.div>
            )}

            {status !== 'success' ? (
                <motion.div variants={itemVariants}>
                    <ConsentCard
                        organizations={ORGANIZATIONS}
                        dataScopes={DATA_SCOPES}
                        purposes={PURPOSES}
                        durations={DURATIONS}
                        selectedOrganization={selectedOrganization}
                        onOrganizationChange={setSelectedOrganization}
                        selectedScopes={selectedScopes}
                        onScopeToggle={handleScopeToggle}
                        selectedPurpose={selectedPurpose}
                        onPurposeChange={setSelectedPurpose}
                        selectedDuration={selectedDuration}
                        onDurationChange={setSelectedDuration}
                        onAccept={handleAccept}
                        onDecline={handleDecline}
                        isLoading={status === 'processing'}
                        isWalletConnected={!!accountAddress}
                    />
                </motion.div>
            ) : (
                <motion.div variants={itemVariants}>
                    <TransactionReceipt {...receiptData} />
                </motion.div>
            )}
        </motion.main>
    );
}
