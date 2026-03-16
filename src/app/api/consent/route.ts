import { NextResponse } from 'next/server';
import crypto from 'crypto';
import algosdk from 'algosdk';
import { algodClient, getSponsorAccount } from '@/lib/algorand';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // 1. Generate a cryptographic hash of the consent record
        const consentString = JSON.stringify(body);
        const consentHash = crypto.createHash('sha256').update(consentString).digest('hex');

        // 2. Prepare the Algorand transaction
        const sponsor = getSponsorAccount();
        const suggestedParams = await algodClient.getTransactionParams().do();

        // Convert the hash to uint8array for the note field
        const note = new TextEncoder().encode(`ConsentChain Hash: ${consentHash}`);

        // Create a 0-ALGO payment transaction to oneself just to store the note
        const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
            sender: sponsor.addr,
            receiver: sponsor.addr,
            amount: 0,
            note,
            suggestedParams,
        });

        // 3. Sign the transaction
        const signedTxn = txn.signTxn(sponsor.sk);

        // 4. Submit the transaction
        const sendTxnResult = await algodClient.sendRawTransaction(signedTxn).do();

        // Wait for confirmation (optional, but good for returning guaranteed results)
        const confirmation = await algosdk.waitForConfirmation(algodClient, sendTxnResult.txid, 4);

        return NextResponse.json({
            success: true,
            transactionId: sendTxnResult.txid,
            round: Number(confirmation.confirmedRound),
            consentHash,
            timestamp: new Date().toISOString(),
        });

    } catch (error: any) {
        console.error('Consent processing error:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Failed to process consent'
        }, { status: 500 });
    }
}
