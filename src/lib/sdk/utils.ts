export interface ConsentPayload {
    data_scope: string;
    purpose: string;
    expiry_date: string;
    consent_timestamp?: string;
    [key: string]: any;
}

/**
 * Compresses a consent payload to fit within Algorand's 128-byte box limit.
 * Uses 1-letter keys: s (scopes), p (purpose), e (expiry as unix timestamp), t (grant timestamp).
 */
export function compressPayload(payload: ConsentPayload): string {
    const expiryEpoch = new Date(payload.expiry_date).getTime();
    const grantEpoch = payload.consent_timestamp
        ? new Date(payload.consent_timestamp).getTime()
        : Date.now();
    return JSON.stringify({
        s: payload.data_scope,
        p: payload.purpose,
        e: expiryEpoch,
        t: grantEpoch
    });
}

/**
 * Decompresses a payload from the blockchain back into a human-readable format.
 */
export function decompressPayload(compressed: string): ConsentPayload {
    const data = JSON.parse(compressed);
    const expiry = data.e || data.exp;
    const timestamp = data.t || data.timestamp || data.consent_timestamp;
    
    return {
        data_scope: data.s || data.data_scope || data.scopes || '',
        purpose: data.p || data.purpose || '',
        expiry_date: expiry ? new Date(expiry).toISOString() : new Date().toISOString(),
        consent_timestamp: timestamp ? new Date(timestamp).toISOString() : undefined
    };
}

/**
 * Generates a SHA-256 hash of the full consent record.
 * Uses the universal Web Crypto API (works in both Node.js 18+ and browsers).
 */
export async function generateConsentHash(payload: any): Promise<string> {
    const consentString = JSON.stringify(payload);
    const msgBuffer = new TextEncoder().encode(consentString);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    return Array.from(new Uint8Array(hashBuffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}
