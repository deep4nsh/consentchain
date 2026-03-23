import { NextResponse } from 'next/server';
import { algodClient, indexerClient } from '@/lib/algorand';

const APP_ID = parseInt(process.env.NEXT_PUBLIC_APP_ID || '0', 10);

export async function GET(
    request: Request,
    context: { params: Promise<{ user_id: string }> }
) {
    try {
        const { user_id: userId } = await context.params;

        if (!userId) {
            return NextResponse.json({ success: false, error: 'User ID is required' }, { status: 400 });
        }

        if (!APP_ID) {
            throw new Error("Smart Contract APP_ID is not configured.");
        }

        // 1. Fetch Current Local State from Algod (Source of Truth for "Current" permission)
        let appState;
        try {
            appState = await algodClient.accountApplicationInformation(userId, APP_ID).do();
        } catch (e: any) {
            if (e.status === 404 || e.message?.includes('not found') || e.message?.includes('does not exist')) {
                return NextResponse.json({ success: true, user_id: userId, consents: [], total: 0 });
            }
            throw e;
        }

        const localState = appState.appLocalState;
        if (!localState || !localState.keyValue) {
            return NextResponse.json({ success: true, user_id: userId, consents: [], total: 0 });
        }

        // 2. Fetch Transaction History from Indexer to recover actual TxIDs
        // We look for NoOp transactions to this app by this user
        let txHistory: any[] = [];
        try {
            const txRes = await indexerClient
                .searchForTransactions()
                .address(userId)
                .applicationID(APP_ID)
                .txType('appl') // application transactions
                .do();
            txHistory = txRes.transactions || [];
        } catch (idxErr) {
            console.warn("Indexer lookup failed, falling back to basic display:", idxErr);
        }

        const kvPairs = localState.keyValue;
        const consents = [];

        for (const kv of kvPairs) {
            const orgId = Buffer.from(kv.key).toString('utf8');
            const valueBytes = kv.value.bytes;

            if (!valueBytes) continue;

            const valueStr = Buffer.from(valueBytes).toString('utf8');

            try {
                const payload = JSON.parse(valueStr);
                const expiry = payload.e ? new Date(payload.e) : new Date(payload.exp);
                const isExpired = expiry < new Date();

                // Find the latest transaction for this organization
                // Application args are: [ "Grant", orgId, payload ]
                let transactionId: string = 'SmartContractState'; // Default if no matching transaction is found

                const txnsResponse: any = await indexerClient.searchForTransactions()
                    .address(userId)
                    .applicationID(APP_ID)
                    .txType('appl') // Application calls only
                    .do();

                const matchingTxn = txnsResponse.transactions?.find((t: any) => {
                    // algosdk v3+ uses camelCase for the API response objects
                    const appTransaction = t.applicationTransaction || t['application-transaction'];
                    const appArgs = appTransaction?.applicationArgs || appTransaction?.['application-args'] || [];
                    
                    if (appArgs.length < 2) return false;

                    // In algosdk v3+, args are already Uint8Array or Buffer
                    try {
                        const callType = Buffer.from(appArgs[0]).toString();
                        const orgArg = appArgs[1]; // organization_id
                        const orgValue = Buffer.from(orgArg).toString();
                        
                        return callType === 'Grant' && orgValue === orgId;
                    } catch (e) {
                        return false;
                    }
                });

                if (matchingTxn) {
                    transactionId = matchingTxn.id;
                }

                consents.push({
                    transactionId: transactionId,
                    organization_id: orgId,
                    data_scope: payload.s || payload.scopes || '',
                    purpose: payload.p || payload.purpose || '',
                    consent_timestamp: payload.timestamp || (matchingTxn ? new Date(Number(matchingTxn.roundTime || matchingTxn['round-time']) * 1000).toISOString() : new Date().toISOString()),
                    expiry_date: expiry.toISOString(),
                    status: isExpired ? 'expired' : 'active'
                });
            } catch (err) {
                console.error("Error parsing local state value JSON", valueStr, err);
                consents.push({
                    transactionId: 'CorruptedState',
                    organization_id: orgId,
                    data_scope: 'CORRUPTED DATA',
                    purpose: 'CORRUPTED DATA',
                    consent_timestamp: new Date().toISOString(),
                    expiry_date: new Date().toISOString(),
                    status: 'expired'
                });
            }
        }

        return NextResponse.json({
            success: true,
            user_id: userId,
            consents,
            total: consents.length
        });

    } catch (error: any) {
        console.error('Error fetching consents:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Failed to fetch consent history'
        }, { status: 500 });
    }
}
