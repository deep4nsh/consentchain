# ConsentChain 🧬

### Immutable Data Sovereignty. Cryptographic Trust. Seamless Integration.

ConsentChain is a comprehensive **Decentralized Consent Management Ecosystem**. It empowers users to transparently grant, track, and revoke consent for their personal data using cryptographic proofs on the Algorand blockchain.

> [!IMPORTANT]
> **New to the project?** Start with the [Developer Onboarding Guide](file:///Users/deepansh/consentchain/DEVELOPER_ONBOARDING.md) for a full walkthrough of the ecosystem architecture.

## Live Demo
The application is live on the **Algorand Testnet**:
- **Main Vault**: [https://consentchain-vert.vercel.app](https://consentchain-vert.vercel.app)
- **Banking Portal**: [https://banking-demo-coral.vercel.app](https://banking-demo-coral.vercel.app)
- **Medical Portal**: [https://medical-demo-theta.vercel.app](https://medical-demo-theta.vercel.app)
- **Insurance Portal**: [https://insurance-demo-inky.vercel.app](https://insurance-demo-inky.vercel.app)

## Features
- **Immutable Audit Trails**: Every consent grant and revocation is recorded as a transaction on Algorand.
- **Contextual Kill Switch**: Revoke data access for any partner site directly from the **Sentinel Extension** with one click.
- **Application-Layer Expiry**: Access is duration-based. The application continuously verifies the consent timestamp against its expiry to deny access automatically when time runs out.
- **Multi-Portal Integration**: Demonstrates seamless cross-sector protection (Medical, Banking, Insurance) using a unified on-chain identity.
- **Granular Scopes**: Define explicit data scopes (e.g. `medical_history`, `vitals`) and purposes instead of blanket permissions.
- **Zero-Trust UI**: Check real-time on-chain status in the verification portal.

## 🗺️ Ecosystem Components

ConsentChain consists of multiple moving parts that work in harmony:
1.  **[The Vault](https://consentchain-vert.vercel.app)**: The central dashboard for consent management.
2.  **[The Sentinel Extension](file:///Users/deepansh/consentchain/extension)**: The browser bridge that verifies on-chain records for partner sites.
3.  **The Demos**: Real-world integrations for [Medical](https://medical-demo-theta.vercel.app), [Banking](https://banking-demo-coral.vercel.app), and [Insurance](https://insurance-demo-inky.vercel.app).

---

## 🚀 Quick Local Setup

1.  **Clone all repositories** into a single folder.
2.  **Dependencies**: Run `npm install` in this directory.
3.  **Run Everything**: Execute the orchestrator script:
    ```bash
    chmod +x run_ecosystem.sh
    ./run_ecosystem.sh
    ```
    *This will launch the Vault (3000), Medical (3001), Banking (3002), and Insurance (3003) demos in parallel.*

---

## 📋 Documentation Hub

- **[Developer Onboarding Guide](file:///Users/deepansh/consentchain/DEVELOPER_ONBOARDING.md)**: Architecture, Handshakes, and Setup.
- **[Architecture Visuals](file:///Users/deepansh/consentchain/architecture_visuals.md)**: Sequence diagrams of internal flows.
- **[Project Master Spec](file:///Users/deepansh/consentchain/Project%20Master%20Spec.md)**: Core vision and pillars.

---

## Features
For this hackathon MVP, we prioritized extreme speed and simplicity over boundless scalability. 

**Algorand Local State Limits**: The TEAL smart contract stores consent mapping payloads strictly in the User's Local State. By Algorand protocol design, this inherently restricts each user's account to a maximum of **16 different organizations**. Trying to grant consent to a 17th organization will fail. For a production V2, this contract would be migrated to **Box Storage (AVM 8+)** to allow unbounded mappings.

**JSON Payload Compression**: Because Algorand Local state caps byte-slice values at exactly 128 bytes, all consent JSON payloads are heavily compressed into 1-letter keys (`s`, `p`, `e`) and Unix timestamps before submission.

## 🛠️ How to Integrate (For Organizations)

One of ConsentChain's core strengths is its ease of integration for other websites and organizations.

### 1. Zero-Trust Web Widget (React/Next.js)
If you are building a React-based application, you can integrate the consent flow with just one line of code using our `ConsentWidget`:

```tsx
import ConsentWidget from '@/components/ConsentWidget';

// In your page:
<ConsentWidget 
    orgId="your_org_id" 
    onSuccess={(receipt) => {
        console.log("Consent granted and verified on-chain!", receipt);
    }} 
/>
```

### 2. Developer SDK (Programmatic)
For deeper integrations, use the `ConsentChainSDK` from `@/lib/sdk`:

```typescript
import { ConsentChainSDK } from '@/lib/sdk';
import { algodClient, indexerClient } from '@/lib/algorand';

const sdk = new ConsentChainSDK(algodClient, indexerClient, APP_ID);

// Verify consent on your backend
const status = await sdk.verifyConsent(userAddress, orgId);
if (status.exists && !status.isExpired) {
    // Process user data safely
}
```

## 🏗️ Technical Architecture

### Consent SDK Core
The logic for interacting with the Algorand blockchain is encapsulated in `src/lib/sdk`.
- **`prepareGrant`**: Builds the atomic transaction group (MBR Payment + App NoOp).
- **`verifyConsent`**: Queries the blockchain directly (Boxes) to retrieve and decode consent status.
- **`utils.ts`**: Handles JSON payload compression to ensure records stay under the 128-byte storage limit.

### Smart Contract (TEAL)
- **Box Storage**: Used for unbounded, scalable mapping of `(User + Org)` to consent data.
- **Minimum Balance Requirement (MBR)**: Automatically calculated and handled by the SDK during the `Grant` process.

## Tech Stack
- Next.js 15 (React 19)
- Tailwind CSS
- Algorand SDK (`algosdk`)
- TEAL (Smart Contracts)
- Pera Wallet Integrations
