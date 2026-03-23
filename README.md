# ConsentChain 🧬

ConsentChain is a decentralized consent management application built for **AlgoBharat**. It empowers users to transparently grant, track, and revoke consent for their personal data, using cryptographic proofs on the Algorand blockchain.

## Live Demo
The application is configured to run on the **Algorand Testnet**. 

## Features
- **Immutable Audit Trails**: Every consent grant and revocation is recorded as a transaction on Algorand.
- **Application-Layer Expiry**: Access is duration-based. The application continuously verifies the consent timestamp against its expiry to deny access automatically when time runs out.
- **Granular Scopes**: Define explicit data scopes (e.g. `medical_history`, `vitals`) and purposes instead of blanket permissions.
- **Zero-Trust UI**: Check real-time on-chain status in the verification portal.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy environment variables:
   ```bash
   cp .env.example .env.local
   # Ensure NEXT_PUBLIC_APP_ID is set to your deployed Smart Contract ID
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

## Architectural Decisions for MVP
For this hackathon MVP, we prioritized extreme speed and simplicity over boundless scalability. 

**Algorand Local State Limits**: The TEAL smart contract stores consent mapping payloads strictly in the User's Local State. By Algorand protocol design, this inherently restricts each user's account to a maximum of **16 different organizations**. Trying to grant consent to a 17th organization will fail. For a production V2, this contract would be migrated to **Box Storage (AVM 8+)** to allow unbounded mappings.

**JSON Payload Compression**: Because Algorand Local state caps byte-slice values at exactly 128 bytes, all consent JSON payloads are heavily compressed into 1-letter keys (`s`, `p`, `e`) and Unix timestamps before submission.

## Tech Stack
- Next.js 15 (React 19)
- Tailwind CSS
- Algorand SDK (`algosdk`)
- TEAL (Smart Contracts)
- Pera Wallet Integrations
