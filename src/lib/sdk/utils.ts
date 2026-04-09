import crypto from 'crypto';

export interface ConsentPayload {
    data_scope: string;
    purpose: string;
    expiry_date: string;
    [key: string]: any;
}

/**
 * Compresses a consent payload to fit within Algorand's 128-byte box limit.
 * Uses 1-letter keys: s (scopes), p (purpose), e (expiry as unix timestamp).
 */
export function compressPayload(payload: ConsentPayload): string {
    const expiryEpoch = new Date(payload.expiry_date).getTime();
    return JSON.stringify({
        s: payload.data_scope,
        p: payload.purpose,
        e: expiryEpoch
    });
}

/**
 * Decompresses a payload from the blockchain back into a human-readable format.
 */
export function decompressPayload(compressed: string): ConsentPayload {
    const data = JSON.parse(compressed);
    return {
        data_scope: data.s,
        purpose: data.p,
        expiry_date: new Date(data.e).toISOString()
    };
}

/**
 * Generates a SHA-256 hash of the full consent record.
 */
export function generateConsentHash(payload: any): string {
    const consentString = JSON.stringify(payload);
    return crypto.createHash('sha256').update(consentString).digest('hex');
}
