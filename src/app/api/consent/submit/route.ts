import { NextResponse } from 'next/server';
import algosdk from 'algosdk';
import { algodClient } from '@/lib/algorand';
import rateLimit from '@/lib/rateLimit';

export async function POST(request: Request) {
    // Rate limit: 5 submissions per minute per IP
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const rateLimitResult = rateLimit(ip, 5, 60000);
    if (!rateLimitResult.success) {
        return NextResponse.json({ success: false, error: 'Too many requests. Please wait before submitting again.' }, { status: 429 });
    }

    try {
        const body = await request.json();
        const { signedTxns, consentHash } = body;

        if (!signedTxns || !Array.isArray(signedTxns) || signedTxns.length === 0) {
            throw new Error("Invalid or empty signedTxns array provided");
        }

        // Guard against oversized transaction groups
        if (signedTxns.length > 16) {
            return NextResponse.json({ success: false, error: 'Transaction group too large.' }, { status: 400 });
        }

        // Convert base64 signed transactions back to Uint8Arrays
        const decodedSignedTxns = signedTxns.map((b64: string) => new Uint8Array(Buffer.from(b64, 'base64')));

        // Submit the transactions to the network
        const sendTxnResult = await algodClient.sendRawTransaction(decodedSignedTxns).do();

        // Support both old and new SDK versions
        const txIdStr = (sendTxnResult as any).txId || sendTxnResult.txid;

        // Wait for confirmation (optional, but good for returning guaranteed results)
        const confirmation = await algosdk.waitForConfirmation(algodClient, txIdStr, 4);

        return NextResponse.json({
            success: true,
            transactionId: txIdStr,
            round: Number(confirmation.confirmedRound),
            consentHash,
            timestamp: new Date().toISOString(),
        });

    } catch (error: any) {
        console.error('Consent submission error:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Failed to submit signed consent transaction'
        }, { status: 500 });
    }
}
