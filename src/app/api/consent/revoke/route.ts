import { NextResponse } from 'next/server';
import algosdk from 'algosdk';
import { algodClient } from '@/lib/algorand';

const APP_ID = parseInt(process.env.NEXT_PUBLIC_APP_ID || '0', 10);

export async function POST(request: Request) {
    try {
        const { user_id, organization_id } = await request.json();

        if (!user_id || !organization_id) {
            return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
        }

        if (!APP_ID) {
            throw new Error("Smart Contract APP_ID is not configured.");
        }

        const suggestedParams = await algodClient.getTransactionParams().do();

        // 1. App arguments for Revocation:
        // arg0: "Revoke"
        // arg1: Key (Organization ID)
        const keyBytes = new Uint8Array(Buffer.from(organization_id));
        const appArgs = [
            new Uint8Array(Buffer.from("Revoke")),
            keyBytes
        ];

        // 2. Create NoOp Transaction
        const txn = algosdk.makeApplicationNoOpTxnFromObject({
            sender: user_id,
            appIndex: APP_ID,
            appArgs,
            suggestedParams,
        });

        // 3. Convert to base64 for the frontend to digest
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
