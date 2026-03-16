'use client';

import { useState, useEffect } from 'react';
import ConsentCard, { Organization, DataScope, Purpose, Duration } from '@/components/ConsentCard';
import TransactionReceipt from '@/components/TransactionReceipt';
import { motion } from 'framer-motion';
import { useWallet } from '@/context/WalletContext';

const ORGANIZATIONS: Organization[] = [
    { id: 'ORG001', name: 'HealthPlus Research' },
    { id: 'ORG002', name: 'Global Finance Corp' },
    { id: 'ORG003', name: 'City Transport Authority' },
];

const DATA_SCOPES: DataScope[] = [
    { id: 'medical_history', label: 'Medical History' },
    { id: 'vitals', label: 'Vitals & Activity Log' },
    { id: 'financial_records', label: 'Financial Records' },
    { id: 'location_data', label: 'Real-time Location Data' },
];

const PURPOSES: Purpose[] = [
    { id: 'research', label: 'Academic & Medical Research' },
    { id: 'service_provision', label: 'Service Provision & Optimization' },
    { id: 'marketing', label: 'Targeted Marketing' },
];

const DURATIONS: Duration[] = [
    { value: 1, label: '1 Month' },
    { value: 3, label: '3 Months' },
    { value: 6, label: '6 Months' },
    { value: 12, label: '1 Year' },
];

export default function Home() {
    const { accountAddress } = useWallet();
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
        // Reset selections instead of alert
        setSelectedOrganization('');
        setSelectedScopes([]);
        setSelectedPurpose('');
        setSelectedDuration(0);
        setError("Consent configured cleared. Start over.");
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
