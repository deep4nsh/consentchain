import { NextResponse } from 'next/server';
import algosdk from 'algosdk';
import { algodClient } from '@/lib/algorand';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { signedTxns, consentHash } = body;

        if (!signedTxns || !Array.isArray(signedTxns)) {
            throw new Error("Invalid signedTxns array provided");
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
