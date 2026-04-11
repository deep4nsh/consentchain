# 🚀 ConsentChain: Developer Onboarding Guide

Welcome to the **ConsentChain Ecosystem**. This guide is designed to help you understand how the different components (Vault, Extension, and Demo Portals) interact and how to set them up for local development.

---

## 🗺️ The Ecosystem Map

ConsentChain is not just one app; it is a distributed network of tools working together:

1.  **The Vault (Hub)**: The main Next.js application (`consentchain`). This is where users manage their identity, view audits, and revoke consent.
2.  **The Sentinel Extension**: A browser extension (`consentchain/extension`) that acts as a bridge between the blockchain and partner sites.
3.  **The Demos (Spokes)**: Independent portals (`medical-demo`, `banking-demo`, `insurance-demo`) that demonstrate real-world integration of the Consent SDK.

---

## 🤝 The Invisible Handshaking Protocol

The core of ConsentChain's magic is the **Sentinel Handshake**. Here is how a partner site (like the Medical Portal) interacts with the system:

### 1. Detection
The partner site includes meta tags in its HTML:
```html
<meta name="consentchain-org-id" content="medical_portal_v1">
<meta name="consentchain-app-id" content="12345678">
```

### 2. Challenge & Signal
When the page loads, the **Sentinel Extension** detects these tags and sends a `CONSENT_CHALLENGE`. It then queries the Algorand blockchain to see if the browsing user has granted consent to `medical_portal_v1`.

### 3. Verification Result
The extension posts a message back to the page:
```javascript
window.postMessage({ 
  type: 'SENTINEL_HANDSHAKE', 
  verified: true,
  address: "USER_WALLET_ADDRESS",
  ...
}, window.location.origin);
```

---

## 🛠️ Local Environment Matrix

To run the full ecosystem locally, ensure your `.env.local` in `consentchain` has the following:

| Variable | Description | Source |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_ALGOD_SERVER` | Algorand Node URL | (e.g. Testnet Indexer) |
| `NEXT_PUBLIC_APP_ID` | Your deployed Smart Contract ID | From `scripts/deploy.ts` |
| `ALGORAND_MNEMONIC` | Admin key for contract deployments | (Keep Secret) |

---

## 🚀 Quick Start Checklist

1.  **Clone all repositories** into a single parent folder if they aren't already.
2.  **Run `npm install`** in the `consentchain` directory.
3.  **Start the vault**: `npm run dev` (defaults to http://localhost:3000).
4.  **Load the Extension**:
    - Open Chrome -> `chrome://extensions`
    - Enable "Developer Mode"
    - Click "Load unpacked" and select the `consentchain/extension` folder.
5.  **Run the Demos**: Use the `run_ecosystem.sh` script (see `run_ecosystem.sh` for details).

---

## 🧪 Testing Your Setup

1.  Open Chrome and navigate to `http://localhost:3000`.
2.  Connect your Pera Wallet or local account.
3.  Sync your address with the **Sentinel Extension** (click the "Sync" button in the Vault dashboard).
4.  Navigate to `http://localhost:3001` (Medical Demo).
5.  Observe the **Sentinel Badge** in the bottom right. It should turn green if consent is granted!

---

> [!NOTE]
> **Debugging postMessage**: Use the Chrome DevTools Console and filter for `[Sentinel]` to see real-time handshake logs.
