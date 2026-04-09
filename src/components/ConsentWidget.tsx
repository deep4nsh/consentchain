'use client';

import { useState } from 'react';
import { useWallet } from '@txnlab/use-wallet-react';
import ConsentCard from './ConsentCard';
import TransactionReceipt from './TransactionReceipt';
import { ORGANIZATIONS, DATA_SCOPES, PURPOSES, DURATIONS } from '@/lib/constants';
import { parseAlgorandError } from '@/lib/errorParser';

interface ConsentWidgetProps {
    orgId: string;
    onSuccess?: (receipt: any) => void;
    onError?: (error: string) => void;
}

export default function ConsentWidget({ orgId, onSuccess, onError }: ConsentWidgetProps) {
    const { activeAddress: accountAddress, signTransactions } = useWallet();
    
    const [status, setStatus] = useState<'pending' | 'processing' | 'success'>('pending');
    const [receiptData, setReceiptData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const [selectedScopes, setSelectedScopes] = useState<string[]>([]);
    const [selectedPurpose, setSelectedPurpose] = useState<string>('');
    const [selectedDuration, setSelectedDuration] = useState<number>(0);

    const handleScopeToggle = (id: string) => {
        setSelectedScopes((prev) =>
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
        );
    };

    const handleAccept = async () => {
        if (!accountAddress) return;
        
        setStatus('processing');
        setError(null);

        const payload = {
            user_id: accountAddress,
            organization_id: orgId,
            data_scope: selectedScopes.join(','),
            purpose: selectedPurpose,
            consent_timestamp: new Date().toISOString(),
            expiry_date: new Date(Date.now() + selectedDuration * 30 * 24 * 60 * 60 * 1000).toISOString()
        };

        try {
            // STEP 1: Build Unsigned Txn on Backend (Uses our new SDK internally)
            const buildRes = await fetch('/api/consent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const buildData = await buildRes.json();
            if (!buildData.success) {
                throw new Error(buildData.error || 'Failed to build consent transaction');
            }

            // STEP 2: Sign in Wallet
            const unsignedTxnsBase64 = buildData.txns as string[];
            const uint8ArrayTxns = unsignedTxnsBase64.map(b64 => new Uint8Array(Buffer.from(b64, 'base64')));

            let signedTxnGroups;
            try {
                signedTxnGroups = await signTransactions(uint8ArrayTxns);
            } catch (err: any) {
                throw new Error("Transaction signing failed or was rejected by user");
            }

            // STEP 3: Submit
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
            if (onSuccess) onSuccess(submitData);
        } catch (err: any) {
            const errorMsg = parseAlgorandError(err);
            setError(errorMsg);
            setStatus('pending');
            if (onError) onError(errorMsg);
        }
    };

    const handleDecline = () => {
        setSelectedScopes([]);
        setSelectedPurpose('');
        setSelectedDuration(0);
        setError(null);
    };

    if (status === 'success') {
        return <TransactionReceipt {...receiptData} />;
    }

    return (
        <div className="w-full flex flex-col items-center">
            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-4 rounded-xl mb-8 max-w-lg w-full text-center text-sm">
                    {error}
                </div>
            )}
            
            {!accountAddress && (
                <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 px-6 py-3 rounded-xl mb-8 max-w-lg w-full text-center text-sm">
                    Please connect your Wallet to continue.
                </div>
            )}

            <ConsentCard
                organizations={ORGANIZATIONS}
                dataScopes={DATA_SCOPES}
                purposes={PURPOSES}
                durations={DURATIONS}
                selectedOrganization={orgId}
                onOrganizationChange={() => {}} // Fixed for the widget
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
        </div>
    );
}
