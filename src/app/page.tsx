"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShieldCheck, Share2, FileLock2, Database, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <main className="min-h-screen pt-20 pb-12 overflow-x-hidden relative flex flex-col items-center">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-gray-950">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] right-[-10%] w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-20%] left-[20%] w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-[150px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-10 md:mt-20">
        <motion.div
          className="text-center max-w-4xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-6 shadow-lg backdrop-blur-sm">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-sm font-medium text-gray-300">Live on Algorand Testnet</span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400"
          >
            Own Your Data. <br className="hidden md:block" /> Verifiably.
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl text-gray-400 mb-10 leading-relaxed font-light max-w-3xl mx-auto"
          >
            ConsentChain is a decentralized consent management platform. It allows users to transparently grant, track, and revoke consent for their personal data, powered by the unmatched speed and security of the Algorand blockchain.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link href="/demo" className="w-full sm:w-auto px-8 py-4 bg-white text-gray-900 rounded-full font-bold text-lg shadow-[0_0_40px_-10px_rgba(255,255,255,0.5)] hover:bg-gray-100 hover:scale-105 transition-all flex items-center justify-center gap-2">
              Try the App <ArrowRight className="w-5 h-5" />
            </Link>
            <a href="#why-needed" className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 rounded-full font-semibold text-lg hover:bg-white/10 transition-all text-white flex items-center justify-center">
              Learn More
            </a>
          </motion.div>
        </motion.div>

        {/* What it does */}
        <motion.div
          id="what-it-does"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="mt-32 md:mt-48"
        >
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">What ConsentChain Does</h2>
            <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
            <p className="text-gray-400 mt-6 max-w-2xl mx-auto text-lg">
              We translate legal data consent into unbreakable cryptographic proofs, creating a zero-trust environment for data exchange.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<ShieldCheck className="w-8 h-8 text-blue-400" />}
              title="Immutable Audit Trails"
              description="Every consent grant, modification, and revocation is recorded as an immutable transaction on the Algorand blockchain."
            />
            <FeatureCard
              icon={<FileLock2 className="w-8 h-8 text-purple-400" />}
              title="Time-Bound Access"
              description="Consent is strictly duration-based. Once the expiry is met, access is cryptographically revoked—no manual intervention needed."
            />
            <FeatureCard
              icon={<Database className="w-8 h-8 text-indigo-400" />}
              title="Granular Data Scopes"
              description="Users explicitly define what data parameters they are sharing (e.g., just vitals, not entire medical history) and for what explicit purpose."
            />
          </div>
        </motion.div>

        {/* Why it is required */}
        <motion.div
          id="why-needed"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="mt-32 md:mt-48 mb-20"
        >
          <motion.div variants={itemVariants} className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 md:p-16 backdrop-blur-md relative overflow-hidden">

            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

            <div className="max-w-3xl">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white leading-tight">
                Why is ConsentChain Required?
              </h2>
              <div className="space-y-6 text-gray-300 text-lg md:text-xl font-light leading-relaxed">
                <p>
                  In today's digital economy, data breaches and unauthorized data sharing are epidemic. Traditional systems rely on trust—organizations promise to delete user data when asked, but users have no way to verify it.
                </p>
                <p>
                  ConsentChain replaces <span className="font-semibold text-white">trust</span> with <span className="font-semibold text-white">cryptographic guarantees</span>. It is fundamentally required to:
                </p>
                <ul className="space-y-4 mt-8">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 mt-1.5 mr-4 h-6 w-6 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-blue-400" />
                    </div>
                    <span>Eliminate "shadow data profiles" by forcing organizations to prove they have active consent before accessing APIs.</span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 mt-1.5 mr-4 h-6 w-6 rounded-full bg-purple-500/20 flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-purple-400" />
                    </div>
                    <span>Comply immediately with regulations like GDPR and the DPDP Act by having an unbreakable, decentralized ledger of audits.</span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 mt-1.5 mr-4 h-6 w-6 rounded-full bg-indigo-500/20 flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-indigo-400" />
                    </div>
                    <span>Return the absolute ownership of digital footprints back to the individual.</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="w-full border-t border-white/10 mt-auto py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© 2026 ConsentChain. Built for AlgoBharat.</p>
        </div>
      </footer>
    </main>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-white/[0.02] border border-white-[0.05] hover:bg-white/[0.04] hover:border-white/10 transition-all p-8 rounded-2xl group flex flex-col items-start backdrop-blur-sm">
      <div className="p-3 bg-white/5 rounded-xl mb-6 group-hover:scale-110 group-hover:bg-white/10 transition-all">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-gray-400 leading-relaxed font-light">
        {description}
      </p>
    </div>
  );
}
