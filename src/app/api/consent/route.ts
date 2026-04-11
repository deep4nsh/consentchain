import { NextResponse } from 'next/server';
import algosdk from 'algosdk';
import { algodClient, indexerClient } from '@/lib/algorand';
import rateLimit from '@/lib/rateLimit';
import { ConsentChainSDK } from '@/lib/sdk';

const APP_ID = parseInt(process.env.NEXT_PUBLIC_APP_ID || '758027210', 10);

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

        // Bug #3: Validate Algorand address format
        try {
            algosdk.decodeAddress(userAddress);
        } catch {
            return NextResponse.json({ success: false, error: 'Invalid Algorand wallet address.' }, { status: 400 });
        }

        if (!APP_ID) {
            throw new Error("Smart Contract APP_ID is not configured.");
        }

        // Bug #13: Server enforces timestamps to prevent client spoofing
        const serverTimestamp = new Date().toISOString();
        const durationMonths = body.duration_months || 1;
        const maxDurationMonths = 12;
        const safeDuration = Math.min(Math.max(durationMonths, 1), maxDurationMonths);
        const serverExpiry = new Date(Date.now() + safeDuration * 30 * 24 * 60 * 60 * 1000).toISOString();

        const serverPayload = {
            ...body,
            consent_timestamp: serverTimestamp,
            expiry_date: serverExpiry, // ALWAYS use server-calculated expiry — never trust client
        };

        // Use SDK to prepare the grant transactions
        const { txns, consentHash, mbr_microalgos } = await sdk.prepareGrant(userAddress, orgId, serverPayload);

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

