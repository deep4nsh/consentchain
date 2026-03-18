import { NextResponse } from 'next/server';
import crypto from 'crypto';
import algosdk from 'algosdk';
import { algodClient } from '@/lib/algorand';

const APP_ID = parseInt(process.env.NEXT_PUBLIC_APP_ID || '0', 10);

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const userAddress = body.user_id;

        if (!APP_ID) {
            throw new Error("Smart Contract APP_ID is not configured.");
        }

        // 1. Generate a cryptographic hash of the consent record
        const consentString = JSON.stringify(body);
        const consentHash = crypto.createHash('sha256').update(consentString).digest('hex');

        // Note: The maximum length for local state key is 64 bytes.
        // We will use the Organization ID as the key, and the JSON payload as the value.
        // Wait, local state max value is 128 bytes. The payload might be larger.
        // If it's larger, we might need to store just the hash in the state, or multiple keys.
        // Let's ensure the payload fits in 128 bytes, or just store the hash if it's too big.
        // Actually, for this demo, we can store a compressed version or just the hash.
        // Let's store the JSON. If it's too long, we will truncate and rely on the hash.
        const orgIdStr = body.organization_id || 'UNKNOWN_ORG';
        const keyBytes = new Uint8Array(Buffer.from(orgIdStr));

        // Ensure value is <= 128 bytes
        let valueStr = JSON.stringify({ scopes: body.data_scope, purpose: body.purpose, exp: body.expiry_date });
        if (valueStr.length > 128) valueStr = valueStr.substring(0, 128); // Truncate if necessary (rare for this simple data)
        const valueBytes = new Uint8Array(Buffer.from(valueStr));

        // 2. Prepare the Algorand transaction
        const suggestedParams = await algodClient.getTransactionParams().do();

        let needsOptIn = false;
        try {
            const accountInfo = await algodClient.accountApplicationInformation(userAddress, APP_ID).do();
            // If this succeeds, user is opted in.
        } catch (e: any) {
            // If 404, the user has not opted into this app yet.
            if (e.status === 404) {
                needsOptIn = true;
            } else {
                throw e; // some other error
            }
        }

        const txnsToSign = [];

        if (needsOptIn) {
            const optInTxn = algosdk.makeApplicationOptInTxnFromObject({
                sender: userAddress,
                appIndex: APP_ID,
                suggestedParams,
            });
            txnsToSign.push(optInTxn);
        }

        // App arguments for our simple TEAL contract:
        // arg0: "Grant"
        // arg1: Key (Organization ID)
        // arg2: Value (Consent JSON Payload)
        const appArgs = [
            new Uint8Array(Buffer.from("Grant")),
            keyBytes,
            valueBytes
        ];

        const noOpTxn = algosdk.makeApplicationNoOpTxnFromObject({
            sender: userAddress,
            appIndex: APP_ID,
            appArgs,
            suggestedParams,
        });

        txnsToSign.push(noOpTxn);

        // If multiple transactions, atomic grouping is required
        if (txnsToSign.length > 1) {
            algosdk.assignGroupID(txnsToSign);
        }

        // Convert to base64 for the frontend to digest
        const base64Txns = txnsToSign.map(txn => Buffer.from(txn.toByte()).toString('base64'));

        return NextResponse.json({
            success: true,
            txns: base64Txns,
            consentHash, // return so frontend can record it
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
