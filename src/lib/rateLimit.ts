const rateLimitMap = new Map<string, { count: number; lastReset: number }>();

export default function rateLimit(ip: string, limit: number, windowMs: number) {
    const now = Date.now();
    const record = rateLimitMap.get(ip);

    if (!record) {
        rateLimitMap.set(ip, { count: 1, lastReset: now });
        return { success: true };
    }

    if (now - record.lastReset > windowMs) {
        // Reset the window
        rateLimitMap.set(ip, { count: 1, lastReset: now });
        return { success: true };
    }

    if (record.count >= limit) {
        return { success: false };
    }

    record.count += 1;
    return { success: true };
}
