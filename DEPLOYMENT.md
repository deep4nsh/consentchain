# ConsentChain — Deployment Guide

Complete guide to deploying the ConsentChain ecosystem for DoraHacks or any production environment.

---

## Prerequisites

- **Node.js** ≥ 18 (for Web Crypto API support)
- **Vercel** account (free tier works)
- **Algorand Testnet** wallet (Pera or Defly) with test ALGO
- **Chrome/Brave** browser (for Sentinel extension)

---

## 1. Main Application (Next.js)

### Vercel Deployment

```bash
# From the consentchain/ directory
vercel --prod
```

### Environment Variables (set on Vercel Dashboard → Settings → Environment Variables)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NEXT_PUBLIC_APP_ID` | ✅ | `758027210` | Deployed TEAL contract App ID |
| `NEXT_PUBLIC_ALGOD_SERVER` | ❌ | `https://testnet-api.algonode.cloud` | Algorand node URL |
| `NEXT_PUBLIC_INDEXER_SERVER` | ❌ | `https://testnet-idx.algonode.cloud` | Algorand indexer URL |

> **Note**: All values have working defaults baked into the code. If you don't set any env vars, the app will work with the official testnet deployment.

### Verify Deployment

```
https://consentchain-vert.vercel.app/api/consents/YOUR_WALLET_ADDRESS
```
Should return `{ "success": true, "consents": [...] }`.

---

## 2. Demo Sites (3 Static Sites)

Each demo is a standalone HTML/CSS/JS site deployed separately on Vercel.

### Deploy Each Demo

```bash
# Medical
cd /path/to/medical-demo && vercel --prod

# Banking  
cd /path/to/banking-demo && vercel --prod

# Insurance
cd /path/to/insurance-demo && vercel --prod
```

### Verify Each Demo

- **Medical**: https://medical-demo-theta.vercel.app
- **Banking**: https://banking-demo-coral.vercel.app
- **Insurance**: https://insurance-demo-inky.vercel.app

Each should show a locked screen with "Authorize via ConsentChain" prompt.

### Update URLs If Redeploying

If your Vercel domains change, update the extension's `ALLOWED_ORIGINS` in `extension/content.js` (line 11).

---

## 3. Sentinel Browser Extension

### Install as Unpacked Extension

1. Open Chrome → `chrome://extensions`
2. Enable **Developer Mode** (top right toggle)
3. Click **Load Unpacked**
4. Select the `extension/` directory from the repo

### First-Time Setup

1. Open the extension popup (click the Sentinel icon in toolbar)
2. Navigate to https://consentchain-vert.vercel.app/dashboard
3. Connect your wallet
4. Click **⚡ Sync Sentinel** — this pushes your wallet address to the extension
5. Visit any demo site → the extension should auto-verify

---

## 4. Smart Contract

The TEAL contract is already deployed at App ID `758027210` on Algorand Testnet.

### If You Need to Redeploy

```bash
cd consentchain/
node contracts/deploy.js
```

This requires the Algorand SDK and a funded deployer account. The new App ID must be updated in:
- `.env.local` → `NEXT_PUBLIC_APP_ID`
- Vercel Dashboard env vars
- All 9 demo HTML files → `<meta name="consentchain-app-id" content="NEW_ID">`
- `extension/popup/popup.js` and `extension/background.js` (if hardcoded)

---

## 5. End-to-End Verification Checklist

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Open https://consentchain-vert.vercel.app | Landing page loads |
| 2 | Click "Connect Wallet" → connect Pera/Defly | Address shows in navbar |
| 3 | Go to `/demo` → click Apollo Hospital → Grant consent | Transaction receipt shows |
| 4 | Go to `/dashboard` | New consent visible in list |
| 5 | Install Sentinel → Sync Identity | Extension popup shows address |
| 6 | Visit https://medical-demo-theta.vercel.app | Auto-unlocks if consent is active |
| 7 | Go to Dashboard → Revoke Access | Consent removed |
| 8 | Refresh medical demo | Locks again |

---

## Architecture

```
consentchain-vert.vercel.app (Next.js)
├── Frontend: Landing, Dashboard, Demo Hub, Blog, Verify
├── API: /api/consent, /api/consent/submit, /api/consent/revoke, /api/consents/[user_id]
└── Smart Contract: Algorand Testnet App #758027210

medical-demo-theta.vercel.app (Static)
banking-demo-coral.vercel.app (Static)
insurance-demo-inky.vercel.app (Static)
└── All call consentchain API for verification

Sentinel Extension (Chrome MV3)
└── Bridges wallet identity across all sites
```
