import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Security headers for all routes
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https: https://explorer-api.walletconnect.com",
              "connect-src 'self' https://testnet-api.algonode.cloud https://testnet-idx.algonode.cloud https://consentchain-vert.vercel.app wss: wss://relay.walletconnect.com https://relay.walletconnect.com https://explorer-api.walletconnect.com https://verify.walletconnect.com https://verify.walletconnect.org",
              "frame-src 'self' https://verify.walletconnect.com https://verify.walletconnect.org",
              "object-src 'none'",
              "base-uri 'self'",
            ].join("; "),
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
      {
        // CORS headers for API routes
        source: "/api/(.*)",
        headers: [
          {
            // Public API endpoints — allow any origin.
            // These are rate-limited, read public blockchain data,
            // and don't use cookies/Authorization, so wildcard is safe.
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization",
          },
          {
            key: "Access-Control-Max-Age",
            value: "86400",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
