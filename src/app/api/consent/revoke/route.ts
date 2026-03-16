import { NextResponse } from 'next/server';
import algosdk from 'algosdk';
import { algodClient, getSponsorAccount } from '@/lib/algorand';

export async function POST(request: Request) {
    try {
        const { originalTxId, user_id } = await request.json();

        if (!originalTxId || !user_id) {
            return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
        }

        const sponsor = getSponsorAccount();
        const suggestedParams = await algodClient.getTransactionParams().do();

        // Construct the revocation note referencing the original transaction
        const noteString = `ConsentChain_Revoke:${originalTxId}`;
        const note = new TextEncoder().encode(noteString);

        // Create a 0-ALGO payment transaction
        const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
            sender: sponsor.addr,
            receiver: sponsor.addr,
            amount: 0,
            note,
            suggestedParams,
        });

        // Sign the transaction
        const signedTxn = txn.signTxn(sponsor.sk);

        // Submit the transaction
        const sendTxnResult = await algodClient.sendRawTransaction(signedTxn).do();

        // Wait for confirmation
        const confirmation = await algosdk.waitForConfirmation(algodClient, sendTxnResult.txid, 4);

        return NextResponse.json({
            success: true,
            transactionId: sendTxnResult.txid,
            originalTxId,
            round: Number(confirmation.confirmedRound),
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
