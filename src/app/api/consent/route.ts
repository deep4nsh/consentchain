import { NextResponse } from 'next/server';
import crypto from 'crypto';
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
        // Using compact keys: s (scopes), p (purpose), e (expiry as unix timestamp)
        const expiryEpoch = new Date(body.expiry_date).getTime();
        const valueStr = JSON.stringify({ s: body.data_scope, p: body.purpose, e: expiryEpoch });
        
        const valueBytes = new Uint8Array(Buffer.from(valueStr));
        if (valueBytes.length > 128) {
            throw new Error(`Consent payload too large (${valueBytes.length} bytes). Max 128 bytes allowed. Please select fewer scopes.`);
        }

        // 2. Prepare the Algorand transaction
        const suggestedParams = await algodClient.getTransactionParams().do();
        const appAddr = algosdk.getApplicationAddress(APP_ID);

        // BOX STORAGE STORAGE CALCULATION
        // MBR = 2500 + 400 * (key_size + value_size)
        // Key = User Address (32 bytes) + Org ID
        const userPubKey = algosdk.decodeAddress(userAddress).publicKey;
        const boxName = new Uint8Array([...userPubKey, ...keyBytes]);
        
        // MBR for this specific box
        const mbrMicroAlgos = 2500 + 400 * (boxName.length + valueBytes.length);

        // EXTRA: Ensure Application Address has enough balance for Box storage base MBR (100,000)
        // If the app is underfunded, we ask the first user to top it up slightly.
        let totalPaymentAmount = BigInt(mbrMicroAlgos);
        try {
            const appAccountInfo = await algodClient.accountInformation(appAddr).do();
            const minBalance = BigInt(appAccountInfo.minBalance || 100000);
            const currentBalance = BigInt(appAccountInfo.amount || 0);
            
            if (currentBalance < minBalance + BigInt(mbrMicroAlgos)) {
                // Add a small buffer (0.1 ALGO) to ensure the app stays funded for others
                const buffer = BigInt(100000); 
                const deficit = (minBalance + BigInt(mbrMicroAlgos) + buffer) - currentBalance;
                totalPaymentAmount += deficit;
                console.log(`Application address ${appAddr} is underfunded. Adding ${deficit} microAlgos top-up.`);
            }
        } catch (err) {
            console.warn("Could not check app balance, falling back to basic MBR:", err);
        }

        const txnsToSign = [];

        // Transaction 1: Payment to App Address to cover Box MBR (and initial app funding if needed)
        const payTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
            sender: userAddress,
            receiver: appAddr.toString(),
            amount: totalPaymentAmount,
            suggestedParams,
        });
        txnsToSign.push(payTxn);

        // Transaction 2: Application NoOp Call with Box reference
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
            boxes: [
                { appIndex: APP_ID, name: boxName }
            ]
        });

        txnsToSign.push(noOpTxn);

        // Atomic grouping is required
        algosdk.assignGroupID(txnsToSign);

        // Convert to base64 for the frontend to digest
        const base64Txns = txnsToSign.map(txn => Buffer.from(txn.toByte()).toString('base64'));

        return NextResponse.json({
            success: true,
            txns: base64Txns,
            consentHash,
            timestamp: new Date().toISOString(),
            mbr_paid: Number(mbrMicroAlgos) / 1_000_000 // In ALGOs for transparency
        });

    } catch (error: any) {
        console.error('Consent processing error:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Failed to process consent'
        }, { status: 500 });
    }
}
