# 📊 ConsentChain Architecture Visuals

This document provides a visual representation of how data and signals flow within the ConsentChain ecosystem.

## 1. Consent Grant Flow
This flow describes the process from a user clicking "Grant" on a partner site to the state being updated on the Algorand blockchain.

```mermaid
sequenceDiagram
    participant User as User (Wallet)
    participant SDK as Consent SDK
    participant Vault as ConsentChain Vault
    participant Chain as Algorand (Box Storage)
    participant Sentinel as Sentinel Extension

    User->>SDK: Triggers "Grant Consent"
    SDK->>SDK: Compresses Payload (utils.ts)
    SDK->>User: Request Signature (Grant + MBR Pay)
    User->>Chain: Executes Atomic Transaction
    Chain-->>Vault: Emits Transaction Confirmation
    Chain-->>Chain: Creates Box (UserPubKey + OrgID)
    Note over Chain: Consent is now Immutable
    Vault-->>Sentinel: Address Sync Hook triggered
```

## 2. Sentinel Verification Flow
This describes how the browser extension automatically verifies a user's consent status when they visit a partner portal.

```mermaid
sequenceDiagram
    participant Page as Partner Portal (e.g. Medical)
    participant Sentinel as Sentinel Extension
    participant Chain as Algorand (Box Storage)

    Page->>Sentinel: Page Load (Detect Meta Tags)
    Sentinel->>Sentinel: Generate Challenge (Nonce)
    Sentinel->>Page: Post "CONSENT_CHALLENGE"
    Sentinel->>Chain: Query Box Content (UserAddress, OrgID)
    Chain-->>Sentinel: Return Encoded Payload (s, p, e, t)
    Sentinel->>Sentinel: Decode & Verify Expiry
    Sentinel->>Page: Post "SENTINEL_HANDSHAKE" (verified: true)
    Page->>Page: Reveal Sensitive Data
```

## 3. Universal Identity Sync Flow
How the Vault securely informs the extension of the current user's wallet address without requiring a specific Extension ID.

```mermaid
sequenceDiagram
    participant Vault as Vault Dashboard
    participant Browser as Browser Messaging API
    participant Sentinel as Sentinel Extension

    Vault->>Vault: User Connects Wallet
    Vault->>Browser: window.postMessage("SENTINEL_SYNC_IDENTITY", {address})
    Browser->>Sentinel: Event Listener triggered
    Sentinel->>Sentinel: Update Storage (chrome.storage.local)
    Sentinel->>Browser: window.postMessage("SENTINEL_SYNC_SUCCESS")
    Vault->>Vault: Show "Extension Synchronized" UI
```

---

## Technical Details

- **Box Storage**: Used for 1-to-N organization mapping. Each box is exactly `32 (User) + variable (OrgID)` bytes long.
- **Payload Compression**: JSON keys are mapping as follows:
  - `s`: Scopes (comma-separated string)
  - `p`: Purpose (string)
  - `e`: Expiry (Unix timestamp)
  - `t`: Timestamp (Unix timestamp of grant)
