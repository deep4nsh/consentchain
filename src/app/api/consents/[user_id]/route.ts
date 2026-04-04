import algosdk from 'algosdk';
import { NextResponse } from 'next/server';
import { algodClient, indexerClient } from '@/lib/algorand';

const APP_ID = parseInt(process.env.NEXT_PUBLIC_APP_ID || '0', 10);

export async function GET(
    request: Request,
    context: { params: Promise<{ user_id: string }> }
) {
    try {
        const { user_id: userId } = await context.params;

        if (!userId) {
            return NextResponse.json({ success: false, error: 'User ID is required' }, { status: 400 });
        }

        if (!APP_ID) {
            throw new Error("Smart Contract APP_ID is not configured.");
        }

        const consents = [];

        // --- STEP 1: Fetch Legacy Local State Consents ---
        try {
            const accountInfo = await algodClient.accountApplicationInformation(userId, APP_ID).do();
            const localState = accountInfo.appLocalState?.keyValue || [];
            
            for (const kv of localState) {
                const orgId = Buffer.from(kv.key as Uint8Array).toString('utf8');
                const valueStr = Buffer.from(kv.value.bytes as Uint8Array).toString('utf8');
                
                try {
                    const payload = JSON.parse(valueStr);
                    const expiry = payload.e ? new Date(payload.e) : new Date(payload.exp);
                    const isExpired = expiry < new Date();
                    
                    consents.push({
                        transactionId: 'LegacyLocalState',
                        organization_id: orgId,
                        data_scope: payload.s || payload.scopes || '',
                        purpose: payload.p || payload.purpose || '',
                        consent_timestamp: payload.timestamp || new Date().toISOString(),
                        expiry_date: expiry.toISOString(),
                        status: isExpired ? 'expired' : 'active'
                    });
                } catch (pErr) {
                    console.warn(`Skipping invalid local state record for ${orgId}`);
                }
            }
        } catch (localErr) {
            console.log("No local state found for this user/app combo - common for new Box-only users.");
        }

        // --- STEP 2: Fetch ALL Boxes for this Application from Algod ---
        // Box Name = User Address (32 bytes) + OrgID string
        const userPubKey = algosdk.decodeAddress(userId).publicKey;
        
        try {
            const boxesResponse = await algodClient.getApplicationBoxes(APP_ID).do();
            const allBoxes = boxesResponse.boxes || [];

            // Filter boxes belonging to this user
            const userBoxes = allBoxes.filter((box: any) => {
                const name = box.name;
                if (name.length < 32) return false;
                
                // Check if first 32 bytes match the user's public key
                for (let i = 0; i < 32; i++) {
                    if (name[i] !== userPubKey[i]) return false;
                }
                return true;
            });

            // Fetch contents for each user box (Batching for performance)
            for (const box of userBoxes) {
                try {
                    const boxNameObj = box.name;
                    const orgIdBytes = boxNameObj.slice(32);
                    const orgId = Buffer.from(orgIdBytes).toString('utf8');

                    const boxContentRes = await algodClient.getApplicationBoxByName(APP_ID, boxNameObj).do();
                    const valueStr = Buffer.from(boxContentRes.value).toString('utf8');
                    
                    const payload = JSON.parse(valueStr);
                    const expiry = payload.e ? new Date(payload.e) : new Date(payload.exp);
                    const isExpired = expiry < new Date();

                    consents.push({
                        transactionId: 'BoxVerified',
                        organization_id: orgId,
                        data_scope: payload.s || payload.scopes || '',
                        purpose: payload.p || payload.purpose || '',
                        consent_timestamp: payload.timestamp || new Date().toISOString(),
                        expiry_date: expiry.toISOString(),
                        status: isExpired ? 'expired' : 'active'
                    });
                } catch (boxErr) {
                    console.error("Error reading box content:", boxErr);
                }
            }
        } catch (err) {
            console.error("Error fetching boxes:", err);
        }

        return NextResponse.json({
            success: true,
            user_id: userId,
            consents,
            total: consents.length
        });

    } catch (error: any) {
        console.error('Error fetching consents:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Failed to fetch consent history'
        }, { status: 500 });
    }
}
