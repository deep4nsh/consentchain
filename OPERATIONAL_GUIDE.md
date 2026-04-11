# ConsentChain: The Complete Operational Guide

Welcome to the ConsentChain ecosystem. This guide takes you from **Step 0 (Setup)** to **Full Automation (Sentinel)**, explaining how to use the central portal and how the system protects your data on third-party websites.

---

## 🚀 Phase 1: Setup (The User Identity)

Before you can grant or manage consent, you must establish your identity across your browser.

### 1. Install & Configure the Sentinel Extension
The **ConsentChain Sentinel** extension is your "Digital Passport." 
- Open the extension popup from your browser toolbar.
- **V2 Feature**: You don't need to copy-paste your address anymore. Proceed to the next step.

### 2. Connect & Sync Identity
- Navigate to the [ConsentChain Dashboard](https://consentchain-vert.vercel.app/dashboard).
- Connect your wallet (Pera, Defly, or Lute) using the **Connect Wallet** button.
- Once connected, click the **⚡ Sync Sentinel** button in the top right.
- **What happens?** Your wallet address is securely pushed to the extension. You will see a "Synced!" notification and a green status in the extension popup.

---

## 🔐 Phase 2: Granting Consent (On Any Partner Site)

ConsentChain is designed to be used *anywhere*. We've built three production-grade demo environments:
- [St. Mary's Digital Health (Medical)](https://medical-demo-theta.vercel.app/)
- [UltraCover Underwriting (Insurance)](https://insurance-demo-inky.vercel.app/)
- [MetaFinance Institutional Banking (Banking)](https://banking-demo-coral.vercel.app/)

### 2. Using the Consent Widget
On these pages, you will see a **Restricted Access** screen.
- Scroll down to the integrated **Consent Widget**.
- **Configure Your Privacy**:
    - Select **Data Scopes** (e.g., Vitals vs. Full History).
    - Select **Purpose** (e.g., Research vs. Service).
    - Select **Duration** (e.g., 1 Month vs. 1 Year).
- Click **Allow Consent** and sign the transaction in your wallet.
- **Blockchain Magic**: Your consent is now hashed and stored immutably on the Algorand Testnet.

---

## 🛡️ Phase 3: Automated Access (Sentinel V2)

Once you have granted consent, the "Sentinel" extension takes over, making your life easier while keeping security tight.

### 1. The "Auto-Unlock" Experience
Close your browser tab and reopen one of the partner demos (Hospital or Bank).
- **The Process**:
    1. The page loads and signals the extension.
    2. Sentinel checks the blockchain for your active consent for this specific site.
    3. **Auto-Unlock**: If verification passes, the "Access Restricted" screen automatically disappears, and your data is displayed.
- **The Badge**: Look at the bottom-right corner. A green **"SENTINEL: SECURED"** badge confirms you are protected by on-chain verification.

### 2. In-Context Actions
If your consent has expired or you haven't granted it yet:
- The badge will show a dark **"UNAUTHORIZED"** status.
- **V2 Feature**: Click the **REQUEST** button on the badge to jump directly to the grant portal.

---

## 📊 Phase 4: Monitoring & Revocation (The Vault)

The [Security Vault (Dashboard)](/src/app/dashboard) is your centralized command center for all data permissions.

### 1. The Audit Stream
- In the Dashboard, watch the **Security Audit Stream**. This live feed shows real-time blockchain events, including when you grant or revoke permissions.

### 2. The Permission Map
- The **Consent Map** provides a visual overview of every organization that has access to your data.
- **Revoking Access**: If you no longer trust an organization, click the red **Revoke Access** button. 
- **Immediate Effect**: Sentinel will immediately detect this on the next page refresh and lock the partner site back up.

---

## 🛠️ Phase 5: Verification (For Organizations)

If you are an organization wanting to verify
### 1. The Verification Portal
- Go to the [Verification Portal](https://consentchain-vert.vercel.app/verify).
- Enter the user's wallet address.
- The portal will query the blockchain and show you exactly what data you are authorized to access and for how long.

---

> [!IMPORTANT]
> **Security Reminder**: ConsentChain never stores your private data on-chain. We only store a cryptographic hash of your permission. Only the authorized organization with the correct data can "unlock" the meaning behind that hash.
