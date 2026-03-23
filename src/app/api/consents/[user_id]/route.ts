import { NextResponse } from 'next/server';
import { algodClient } from '@/lib/algorand';

const APP_ID = parseInt(process.env.NEXT_PUBLIC_APP_ID || '0', 10);

export async function GET(
    request: Request,
    context: { params: Promise<{ user_id: string }> }
) {
    try {
        const { user_id: userId } = await context.params;

        if (!APP_ID) {
            throw new Error("Smart Contract APP_ID is not configured.");
        }

        let appState;
        try {
            appState = await algodClient.accountApplicationInformation(userId, APP_ID).do();
        } catch (e: any) {
            if (e.status === 404 || e.message?.includes('not found') || e.message?.includes('does not exist')) {
                // User has not opted into the contract, or contract doesn't exist
                return NextResponse.json({
                    success: true,
                    user_id: userId,
                    consents: [],
                    total: 0
                });
            }
            throw e;
        }

        const localState = appState.appLocalState;
        if (!localState || !localState.keyValue) {
            return NextResponse.json({
                success: true,
                user_id: userId,
                consents: [],
                total: 0
            });
        }

        const kvPairs = localState.keyValue;
        const consents = [];

        for (const kv of kvPairs) {
            const orgId = Buffer.from(kv.key).toString('utf8');
            const valueBytesB64 = kv.value.bytes;

            if (!valueBytesB64) continue;

            const valueStr = Buffer.from(valueBytesB64).toString('utf8');

            try {
                const payload = JSON.parse(valueStr);

                // Handle both old and compact (new) payload formats
                const expiry = payload.e ? new Date(payload.e) : new Date(payload.exp);
                const isExpired = expiry < new Date();

                consents.push({
                    transactionId: 'SmartContractState', // No specific TX ID since it's current state
                    organization_id: orgId,
                    data_scope: payload.s || payload.scopes || '',
                    purpose: payload.p || payload.purpose || '',
                    consent_timestamp: payload.timestamp || new Date().toISOString(), // Since we overwrite state, we might not have the original grant time if not stored.
                    expiry_date: expiry.toISOString(),
                    status: isExpired ? 'expired' : 'active'
                });
            } catch (err) {
                console.error("Error parsing local state value JSON", valueStr);
                // Return a corrupted record so the user can easily see it and revoke it
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
        console.error('Error fetching consens from Smart Contract state:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Failed to fetch consent history'
        }, { status: 500 });
    }
}
