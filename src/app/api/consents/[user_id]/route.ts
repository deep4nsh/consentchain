import { NextResponse } from 'next/server';
import algosdk from 'algosdk';
import { ConsentChainSDK } from '@/lib/sdk/core';
import { algodClient, indexerClient } from '@/lib/algorand';

const APP_ID = parseInt(process.env.NEXT_PUBLIC_APP_ID || '0', 10);

export async function GET(
    request: Request,
    context: { params: Promise<{ user_id: string }> }
) {
    try {
        const { user_id: userId } = await context.params;
        const { searchParams } = new URL(request.url);
        const queryAppId = searchParams.get('app_id');
        const effectiveAppId = queryAppId ? parseInt(queryAppId, 10) : APP_ID;

        if (!userId) {
            return NextResponse.json({ success: false, error: 'User ID is required' }, { status: 400 });
        }

        // Bug #3: Validate Algorand address format
        try {
            algosdk.decodeAddress(userId);
        } catch {
            return NextResponse.json({ success: false, error: 'Invalid Algorand wallet address.' }, { status: 400 });
        }

        if (!effectiveAppId) {
            throw new Error("Smart Contract APP_ID is not configured.");
        }

        // Initialize SDK with the effective App ID
        const sdk = new ConsentChainSDK(algodClient, indexerClient, effectiveAppId);
        
        // Use SDK to list consents
        const consents = await sdk.listUserConsents(userId);

        return NextResponse.json({
            success: true,
            user_id: userId,
            app_id: effectiveAppId,
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
