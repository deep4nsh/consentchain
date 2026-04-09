import { NextResponse } from 'next/server';
import { ConsentChainSDK } from '@/lib/sdk/core';
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

        // Initialize SDK
        const sdk = new ConsentChainSDK(algodClient, indexerClient, APP_ID);
        
        // Use SDK to list consents
        const consents = await sdk.listUserConsents(userId);

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
