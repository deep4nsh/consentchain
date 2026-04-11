import { NextResponse } from 'next/server';
import algosdk from 'algosdk';
import { algodClient } from '@/lib/algorand';
import rateLimit from '@/lib/rateLimit';

const APP_ID = parseInt(process.env.NEXT_PUBLIC_APP_ID || '0', 10);

export async function POST(request: Request) {
    // Basic Rate Limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const rateLimitResult = rateLimit(ip, 10, 60000); // 10 requests per minute
    if (!rateLimitResult.success) {
        return NextResponse.json({ success: false, error: 'Too many requests' }, { status: 429 });
    }

    try {
        const { user_id, organization_id } = await request.json();

        if (!user_id || !organization_id) {
            return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
        }

        // Bug #3: Validate Algorand address format
        try {
            algosdk.decodeAddress(user_id);
        } catch {
            return NextResponse.json({ success: false, error: 'Invalid Algorand wallet address.' }, { status: 400 });
        }

        if (!APP_ID) {
            throw new Error("Smart Contract APP_ID is not configured.");
        }

        const suggestedParams = await algodClient.getTransactionParams().do();

        // Bug #6 fixed: Include box reference so the AVM can find the box to delete
        const orgIdBytes = new Uint8Array(Buffer.from(organization_id));
        const userPubKey = algosdk.decodeAddress(user_id).publicKey;
        const boxName = new Uint8Array([...userPubKey, ...orgIdBytes]);

        const appArgs = [
            new Uint8Array(Buffer.from("Revoke")),
            orgIdBytes
        ];

        const txn = algosdk.makeApplicationNoOpTxnFromObject({
            sender: user_id,
            appIndex: APP_ID,
            appArgs,
            suggestedParams,
            boxes: [
                { appIndex: APP_ID, name: boxName }
            ]
        });

        // Convert to base64 for the frontend to digest
        const base64Txns = [Buffer.from(txn.toByte()).toString('base64')];

        return NextResponse.json({
            success: true,
            txns: base64Txns,
            organization_id,
            timestamp: new Date().toISOString(),
        });

    } catch (error: any) {
        console.error('Revocation processing error:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Failed to process revocation'
        }, { status: 500 });
    }
}
