"use client";

import { motion } from "framer-motion";
import { Shield, Lock, Database, UserCheck, ArrowRight, Activity, Globe, Key, Zap, CheckCircle2, AlertTriangle, Layers } from "lucide-react";
import Link from "next/link";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-50 pt-24 pb-20 overflow-hidden font-sans selection:bg-purple-500/30">
      
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/10 blur-[120px]" />
        <div className="absolute top-[40%] right-[-10%] w-[30%] h-[30%] rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] rounded-full bg-indigo-600/5 blur-[150px]" />
      </div>

      <div className="max-w-4xl mx-auto px-6 lg:px-8 relative z-10">
        
        {/* HERO SECTION */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="text-center mb-24 pt-12"
        >
          <motion.div variants={fadeIn} className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-6">
            <Activity className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-medium text-purple-200 tracking-wide uppercase">Deep Dive</span>
          </motion.div>
          <motion.h1 variants={fadeIn} className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
            Rethinking Digital <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-400 to-blue-400">
              Identity & Consent
            </span>
          </motion.h1>
          <motion.p variants={fadeIn} className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            The internet's original sin was failing to build an identity and consent layer. ConsentChain is fixing that using cryptographic proofs on the Algorand blockchain.
          </motion.p>
        </motion.div>

        {/* SECTION 1: THE PROBLEM */}
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="mb-32 relative"
        >
          <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-red-500/50 to-transparent rounded-full" />
          <motion.h2 variants={fadeIn} className="text-3xl font-bold mb-8 flex items-center">
            <AlertTriangle className="w-8 h-8 mr-4 text-red-400" />
            The Problem Statement
          </motion.h2>
          
          <div className="space-y-6 text-lg text-gray-300 leading-relaxed">
            <motion.p variants={fadeIn}>
              In the current digital ecosystem, user data is treated as a commodity rather than a personal asset. When you sign up for a service, your data is siloed into centralized databases over which you have zero visibility and control.
            </motion.p>
            <motion.p variants={fadeIn}>
              <strong className="text-white">Shadow Profiles & Data Brokers:</strong> Your digital footprint is aggregated and sold without explicit, granular consent. "Accept All Cookies" banners are largely performative, leading to consent fatigue while hiding deeply invasive tracking mechanisms.
            </motion.p>
            <motion.p variants={fadeIn}>
              Once data leaves your device, tracking its lifecycle becomes impossible. Even when companies suffer data breaches, users are often the last to know, and they have no cryptographic guarantee that their data was actually deleted when they clicked "Delete Account."
            </motion.p>
          </div>

          <motion.div variants={fadeIn} className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            {[
              { title: "Centralized Honeypots", desc: "Massive databases that become lucrative targets for hackers." },
              { title: "Opaque Usage", desc: "Users don't know who has their data or what it is being used for." },
              { title: "Irrevocable Access", desc: "Revoking consent often requires navigating complex, hidden menus." }
            ].map((item, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-gray-400">{item.desc}</p>
              </div>
            ))}
          </motion.div>
        </motion.section>

        {/* SECTION 2: WHAT WE DO (THE VISION) */}
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="mb-32 relative"
        >
          <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500/50 to-transparent rounded-full" />
          <motion.h2 variants={fadeIn} className="text-3xl font-bold mb-8 flex items-center">
            <Globe className="w-8 h-8 mr-4 text-purple-400" />
            What We Do
          </motion.h2>
          
          <div className="space-y-6 text-lg text-gray-300 leading-relaxed">
            <motion.p variants={fadeIn}>
              ConsentChain shifts the paradigm from "trust us with your data" to <strong>"verify our access mathematically."</strong> We are building a decentralized consent management system where data permissions are recorded on a public, immutable ledger.
            </motion.p>
            <motion.p variants={fadeIn}>
              We do not store the personal data itself on the blockchain. Instead, we store <em>cryptographic proofs of consent</em>. When an organization wants to access your email, read your health records, or process a payment, they must first check the Algorand blockchain to verify if they hold a valid, unexpired consent token from you.
            </motion.p>
          </div>
        </motion.section>

        {/* SECTION 3: THE SOLUTION */}
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="mb-32 relative"
        >
          <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-500/50 to-transparent rounded-full" />
          <motion.h2 variants={fadeIn} className="text-3xl font-bold mb-8 flex items-center">
            <Shield className="w-8 h-8 mr-4 text-emerald-400" />
            The Solution
          </motion.h2>
          
          <motion.p variants={fadeIn} className="text-lg text-gray-300 leading-relaxed mb-10">
            We utilize Algorand's blistering fast transaction speed and low fees to write consent records directly to the blockchain's Local State. Here is how our architecture breaks down:
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div variants={fadeIn} className="group relative bg-gradient-to-br from-gray-900 to-gray-950 border border-white/10 p-8 rounded-3xl hover:border-emerald-500/30 transition-all duration-300">
              <div className="bg-emerald-500/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-emerald-400 group-hover:scale-110 transition-transform">
                <Database className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Immutable Audit Trails</h3>
              <p className="text-gray-400 leading-relaxed">Every time consent is granted or revoked, a transaction is signed by the user's wallet. This creates a provable, unalterable timeline of data access rights that regulators and users can trust.</p>
            </motion.div>

            <motion.div variants={fadeIn} className="group relative bg-gradient-to-br from-gray-900 to-gray-950 border border-white/10 p-8 rounded-3xl hover:border-blue-500/30 transition-all duration-300">
              <div className="bg-blue-500/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-blue-400 group-hover:scale-110 transition-transform">
                <Layers className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Granular Scopes</h3>
              <p className="text-gray-400 leading-relaxed">Consent isn't all-or-nothing. Users grant specific scopes (e.g., `read:email`, `write:profile`). Organizations only receive access to the precise data scopes explicitly requested and approved.</p>
            </motion.div>

            <motion.div variants={fadeIn} className="group relative bg-gradient-to-br from-gray-900 to-gray-950 border border-white/10 p-8 rounded-3xl hover:border-purple-500/30 transition-all duration-300">
              <div className="bg-purple-500/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-purple-400 group-hover:scale-110 transition-transform">
                <Zap className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Time-Bound Expirations</h3>
              <p className="text-gray-400 leading-relaxed">We compress consent data to fit within smart contract memory limits. Expiration timestamps automatically invalidate consent at the application layer once the agreed-upon timeframe passes.</p>
            </motion.div>

            <motion.div variants={fadeIn} className="group relative bg-gradient-to-br from-gray-900 to-gray-950 border border-white/10 p-8 rounded-3xl hover:border-fuchsia-500/30 transition-all duration-300">
              <div className="bg-fuchsia-500/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-fuchsia-400 group-hover:scale-110 transition-transform">
                <Lock className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Zero-Trust Verification</h3>
              <p className="text-gray-400 leading-relaxed">Organizations do not have to blindly trust their databases. They can query the Algorand blockchain in real-time to verify if a user's wallet still authorizes their access.</p>
            </motion.div>
          </div>
        </motion.section>

        {/* SECTION 4: HOW TO USE */}
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="mb-20"
        >
          <motion.h2 variants={fadeIn} className="text-3xl font-bold mb-12 text-center">
            How People Can Use ConsentChain
          </motion.h2>

          <div className="space-y-16">
            {/* For Users */}
            <motion.div variants={fadeIn}>
              <h3 className="text-2xl font-semibold text-white mb-6 flex items-center">
                <UserCheck className="w-6 h-6 mr-3 text-purple-400" />
                For Everyday Users
              </h3>
              <div className="bg-gray-900 border border-white/10 rounded-2xl overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10">
                  <div className="p-6">
                    <div className="text-4xl font-black text-white/5 mb-4 border-b border-white/5 pb-4">01</div>
                    <h4 className="text-white font-medium mb-2">Connect Wallet</h4>
                    <p className="text-sm text-gray-400">Head to the Portal and link your Pera, Defly, or generic Algorand wallet securely.</p>
                  </div>
                  <div className="p-6 bg-gradient-to-b from-transparent to-purple-900/10">
                    <div className="text-4xl font-black text-white/5 mb-4 border-b border-white/5 pb-4">02</div>
                    <h4 className="text-white font-medium mb-2">Review Scopes</h4>
                    <p className="text-sm text-gray-400">When an app requests access, review exactly what scopes they want (e.g., Marketing, Essential) and the active duration.</p>
                  </div>
                  <div className="p-6">
                    <div className="text-4xl font-black text-white/5 mb-4 border-b border-white/5 pb-4">03</div>
                    <h4 className="text-white font-medium mb-2">Sign & Revoke</h4>
                    <p className="text-sm text-gray-400">Sign the transaction to grant access. Changed your mind? Go to the Dashboard and click <strong>"Revoke"</strong> to cleanly sever access with absolute cryptographic certainty.</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* For Organizations */}
            <motion.div variants={fadeIn}>
              <h3 className="text-2xl font-semibold text-white mb-6 flex items-center">
                <Key className="w-6 h-6 mr-3 text-blue-400" />
                For Organizations & Developers
              </h3>
              <div className="bg-gray-900 border border-white/10 rounded-2xl p-8">
                <p className="text-gray-300 mb-6">
                  ConsentChain integrates seamlessly into any backend infrastructure. Instead of storing complex consent preferences locally, your application utilizes our verification portal.
                </p>
                <ul className="space-y-4">
                  {[
                    "Direct users to the ConsentChain portal to generate an immutable consent token.",
                    "Save the user's Algorand Wallet Address in your local database.",
                    "Before sending an email or accessing sensitive user API routes, query the ConsentChain Verification endpoint with the user's wallet address and your Organization ID.",
                    "If the record returns 'Active' and scopes match, proceed. If 'Revoked' or 'Expired', cleanly reject the action."
                  ].map((step, i) => (
                    <li key={i} className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 mr-3 flex-shrink-0" />
                      <span className="text-gray-400">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* CTA */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-10 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay"></div>
          <h2 className="text-3xl font-bold text-white mb-4 relative z-10">Stop Trusting. Start Verifying.</h2>
          <p className="text-purple-100 mb-8 max-w-xl mx-auto relative z-10">
            Take control of your digital identity today or integrate transparent consent into your organization's infrastructure.
          </p>
          <Link href="/demo" className="relative z-10 inline-flex items-center justify-center bg-white text-purple-600 px-8 py-3 rounded-full font-bold hover:shadow-lg hover:shadow-white/20 transition-all hover:-translate-y-1">
            Launch Portal
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </motion.div>

      </div>
    </div>
  );
}
