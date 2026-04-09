import { NextResponse } from 'next/server';
import { algodClient, indexerClient } from '@/lib/algorand';
import rateLimit from '@/lib/rateLimit';
import { ConsentChainSDK } from '@/lib/sdk';

const APP_ID = parseInt(process.env.NEXT_PUBLIC_APP_ID || '0', 10);

// Initialize SDK instance
const sdk = new ConsentChainSDK(algodClient, indexerClient, APP_ID);

export async function POST(request: Request) {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const rateLimitResult = rateLimit(ip, 12, 60000); 
    if (!rateLimitResult.success) {
        return NextResponse.json({ success: false, error: 'Too many requests' }, { status: 429 });
    }

    try {
        const body = await request.json();
        const userAddress = body.user_id;
        const orgId = body.organization_id || 'UNKNOWN_ORG';

        if (!APP_ID) {
            throw new Error("Smart Contract APP_ID is not configured.");
        }

        // Use SDK to prepare the grant transactions
        const { txns, consentHash, mbr_microalgos } = await sdk.prepareGrant(userAddress, orgId, body);

        // Convert to base64 for the frontend to digest
        const base64Txns = txns.map(txn => Buffer.from(txn.toByte()).toString('base64'));

        return NextResponse.json({
            success: true,
            txns: base64Txns,
            consentHash,
            timestamp: new Date().toISOString(),
            mbr_paid: mbr_microalgos / 1_000_000 
        });

    } catch (error: any) {
        console.error('Consent processing error:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Failed to process consent'
        }, { status: 500 });
    }
}

