import { NextResponse } from 'next/server';
import { indexerClient, getSponsorAccount } from '@/lib/algorand';

export async function GET(
    request: Request,
    context: { params: Promise<{ user_id: string }> }
) {
    try {
        const { user_id: userId } = await context.params;
        const sponsor = getSponsorAccount();

        // Query the indexer for transactions sent to the sponsor account
        // We look for both "ConsentChain:" and "ConsentChain_Revoke:" notes
        const response = await indexerClient
            .searchForTransactions()
            .address(sponsor.addr)
            // .notePrefix() is limited to one prefix, so we fetch all txns and filter manually
            // Optimally in prod, an indexer would index specific app calls, but for notes we filter in-memory.
            .limit(1000)
            .do();

        // 1. Identify all revocations first
        const revokedTxIds = new Set<string>();
        response.transactions.forEach((tx: any) => {
            if (tx.note) {
                try {
                    const decodedNote = Buffer.from(tx.note, 'base64').toString('utf8');
                    if (decodedNote.startsWith('ConsentChain_Revoke:')) {
                        const originalId = decodedNote.replace('ConsentChain_Revoke:', '').trim();
                        revokedTxIds.add(originalId);
                    }
                } catch (e) {
                    // ignore parse errors
                }
            }
        });

        // 2. Process and decode the consent transactions
        const consents = response.transactions.map((tx: any) => {
            try {
                if (!tx.note) return null;

                // Decode base64 note to string
                const decodedNote = Buffer.from(tx.note, 'base64').toString('utf8');

                if (!decodedNote.startsWith('ConsentChain:')) return null;

                // Strip the "ConsentChain:" prefix
                const jsonStr = decodedNote.replace('ConsentChain:', '');
                const payload = JSON.parse(jsonStr);

                // Filter by the requested user ID
                if (payload.user_id !== userId) return null;

                const isRevoked = revokedTxIds.has(tx.id);
                const isExpired = new Date(payload.expiry_date) < new Date();

                let status = 'active';
                if (isRevoked) status = 'revoked';
                else if (isExpired) status = 'expired';

                return {
                    transactionId: tx.id,
                    timestamp: tx['round-time'] ? new Date(tx['round-time'] * 1000).toISOString() : payload.consent_timestamp,
                    ...payload,
                    status
                };
            } catch (e) {
                console.error("Error decoding transaction note:", e);
                return null;
            }
        }).filter(Boolean); // Remove nulls

        // Sort descending by timestamp
        consents.sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

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
