# Welcome to ConsentChain: A Friend's Guide 🧬

Hello! If you're reading this, you're curious about **ConsentChain**—a project built to give people real power over their digital data. 

Think about every time you click "Accept All Cookies" or "I Agree" on a website. Where does that permission go? Who sees it? Can you take it back easily? Usually, the answer is "Who knows?" and "No."

**ConsentChain changes that.**

---

## 🌟 The "Big Idea"
ConsentChain is a decentralized system where your "Yes" or "No" isn't just a row in a company's private database. Instead, it's a **cryptographic record** stored on the **Algorand Blockchain**.

- **You Own It:** Your permissions live in your "digital wallet," not on a random server.
- **You Control It:** You can revoke access at any time, and the website *immediately* loses its validity.
- **It's Transparent:** Anyone can verify a permission exists, but only the right people can use it.

---

## 🧩 The 3 Main Parts
To understand how it works, think of it as three different tools working together:

### 1. The Vault (Your Control Center)
This is the main website (Dashboard). It's like a settings page for your entire digital life. Here, you can see every organization you've given permission to, what they can see, and when that permission expires. If you're done with them, you click "Revoke" and it's gone from the blockchain forever.

### 2. The Sentinel (Your Guardian Angel)
This is a **Browser Extension**. While you're surfing the web, the Sentinel is working in the background. When you visit a "partner" site (like a bank or a hospital), the Sentinel checks the blockchain.
- **Green Light:** "I found your permission! You're logged in/verified automatically."
- **Red Light:** "No permission found. Access denied."

### 3. The SDK (The Bridge for Developers)
For a hospital or a bank to use ConsentChain, they need a way to talk to the blockchain. We built an **SDK (Software Development Kit)** that makes it super easy for them to ask for permission and verify it in just a few lines of code.

---

## 🛠️ The "Technical Magic" (Simplified)

If you're into the "how it works" part, here are the cool bits:

### 1. Algorand "Boxes" 📦
We use a feature of the Algorand blockchain called **Boxes**. Imagine a tiny, locked locker on the blockchain that only you and the specific organization (like a hospital) can "see" the connection between. It's super fast and can hold a tiny bit of data—just enough to say "Consent is valid until 2027."

### 2. Atomic Transactions ⚛️
When you give consent, we use an "Atomic Transaction." This means either **everything** happens or **nothing** happens. You pay a tiny fee to create the storage box and grant the permission in one single breath. No half-finished states!

### 3. Payload Compression 🤐
Blockchain storage is expensive and limited. We don't store "Full Medical History Access Granted." Instead, we compress it into tiny codes like `{"s": "med", "p": "audit", "e": 1744615532}`. This keeps it cheap and fast!

---

## 📁 Where is everything?
If you're looking at the code, here’s the map:

- `/src/app`: The main "Vault" dashboard (Next.js).
- `/src/lib/sdk`: The brain of the project. This is where the blockchain logic lives.
- `/extension`: The "Sentinel" browser extension code.
- `/contracts`: The "Smart Contracts" (the rules of the game) written in TEAL.
- `/src/app/demo`: Real-world examples of how a Hospital, Bank, or Insurance company would use this.

---

## 🚀 How to try it yourself
1. **The Setup**: Run `npm install` to get the tools ready.
2. **The Launch**: Run `./run_ecosystem.sh`. This magical script starts the Vault and all the demo sites at once!
3. **The Experience**: Open your browser and visit `localhost:3000`. Connect your Pera Wallet, and you're officially a sovereign data owner!

---

*“Data sovereignty isn’t just a buzzword; it’s a human right.”* 

If you have questions, just ask! We’re building the future of trust, one block at a time. 🧬✨
