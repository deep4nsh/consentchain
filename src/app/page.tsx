"use client";

import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { ShieldCheck, CheckCircle2, ArrowRight, Activity, Fingerprint, Lock, Shield, Network, EyeOff, LayoutDashboard, ChevronDown, Database, Key, CheckSquare, Zap, Target, ArrowUpRight, Globe, Layers, ShieldAlert, FileText, Check, Cpu } from 'lucide-react';
import WorkflowTimeline from '@/components/WorkflowTimeline';

const FADE_UP_ANIMATION_VARIANTS = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100, damping: 20 } },
};

export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  // Mouse parallax for Hero
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // GSAP Removed. All scroll logic utilizes framer-motion below.
  

  return (
    <main ref={containerRef} className="hero-bg-dark min-h-screen text-white selection:bg-purple-500/30">
      
      {/* GLOBAL HUD EFFECTS */}
      <div className="fixed inset-0 pointer-events-none z-50 mix-blend-screen opacity-20">
        <div className="absolute inset-0 opacity-10" />
      </div>

      {/* --- HERO SECTION --- */}
      <section ref={heroRef} className="relative min-h-screen flex flex-col items-center justify-start overflow-hidden pt-40 pb-32">
        
        {/* Dynamic Deep Space Background */}
        <div className="absolute inset-0 z-0 overflow-hidden bg-[#050608]">
            {/* Looping Cinematic Data Flow Video */}
            <div className="absolute inset-0 opacity-40 mix-blend-screen mix-blend-plus-lighter">
               <video
                 autoPlay
                 loop
                 muted
                 playsInline
                 className="w-full h-full object-cover grayscale-[40%]"
               >
                 <source src="https://cdn.pixabay.com/video/2023/10/20/185732-875882596_large.mp4" type="video/mp4" />
               </video>
            </div>
            
            {/* Drifting Orbs with continuous motion + mouse parallax */}
            <motion.div 
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, 0],
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="hero-gradient-orb w-[600px] h-[600px] bg-blue-600/20 top-[-20%] left-[-10%]"
                style={{ 
                  transform: `translate(${mousePos.x * -2}px, ${mousePos.y * -2}px)`,
                  transformOrigin: "center center"
                }}
            />
            <motion.div 
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, -5, 0],
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="hero-gradient-orb w-[800px] h-[800px] bg-purple-600/20 bottom-[-30%] right-[-10%]"
                style={{ 
                  transform: `translate(${mousePos.x * 2}px, ${mousePos.y * 2}px)`,
                  transformOrigin: "center center"  
                }}
            />
            
            {/* Continuously Sliding Data Grid */}
            <div 
              className="absolute inset-0 opacity-[0.10]" 
              style={{
                backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
                animation: 'grid-pan 20s linear infinite'
              }}
            />
            
            {/* Floating Deep Space Particles */}
            <div className="absolute inset-0 pointer-events-none">
               {[...Array(30)].map((_, i) => (
                 <motion.div
                   key={`star-${i}`}
                   className="absolute bg-white rounded-full opacity-20"
                   style={{
                     width: typeof window !== 'undefined' ? Math.random() * 2 + 1 + 'px' : '2px',
                     height: typeof window !== 'undefined' ? Math.random() * 2 + 1 + 'px' : '2px',
                     left: typeof window !== 'undefined' ? `${Math.random() * 100}%` : '50%',
                     bottom: "-5%",
                   }}
                   animate={{
                     y: ["0vh", "-120vh"],
                     opacity: [0, typeof window !== 'undefined' ? Math.random() * 0.5 + 0.2 : 0.5, 0],
                   }}
                   transition={{
                     duration: typeof window !== 'undefined' ? Math.random() * 15 + 15 : 20,
                     repeat: Infinity,
                     ease: "linear",
                     delay: typeof window !== 'undefined' ? Math.random() * 10 : i * 0.5,
                   }}
                 />
               ))}
            </div>

            {/* Dark Darkening Vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(10,12,16,0.9)_80%)] pointer-events-none" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 text-center mt-12 flex flex-col items-center">
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-8 backdrop-blur-md"
            >
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span className="text-xs font-bold tracking-widest text-blue-300 uppercase shadow-blue-500/50">Algorand Mainnet Readiness</span>
            </motion.div>

            <motion.h1 
                initial={{ opacity: 0, filter: 'blur(20px)' }}
                animate={{ opacity: 1, filter: 'blur(0px)' }}
                transition={{ duration: 1.2, delay: 0.2 }}
                className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-none mb-6 flex flex-col items-center"
            >
                <div>Own Your Data.</div>
                <div className="flex items-center flex-wrap justify-center mt-2">
                   <span className="mr-3 md:mr-6">Prove It.</span> 
                   <HeroRotatingText />
                </div>
            </motion.h1>

            <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.6 }}
                className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto font-light mb-12"
            >
                Transforming data consent into immutable cryptographic proof on-chain.
            </motion.p>

            {/* CTAs */}
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8, delay: 0.9 }}
               className="flex flex-col sm:flex-row gap-6 items-center justify-center"
            >
                <Link href="/demo" className="btn-cyber-glow px-8 py-4 text-white font-bold text-lg flex items-center gap-2 group">
                    <span className="relative z-10 flex items-center gap-2">
                        Start Securing Data <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                </Link>
                <Link href="/dashboard" className="glass-panel-premium px-8 py-4 text-white font-bold text-lg hover:bg-white/10 transition-colors">
                    View Proof Dashboard
                </Link>
            </motion.div>

            {/* Trust Strip */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.5 }}
              className="mt-20 flex flex-wrap justify-center gap-8 md:gap-16 opacity-60"
            >
                <TrustIndicator icon={<Network className="w-5 h-5" />} label="Built on Algorand" />
                <TrustIndicator icon={<Lock className="w-5 h-5" />} label="End-to-End Encrypted" />
                <TrustIndicator icon={<EyeOff className="w-5 h-5" />} label="Zero-Knowledge Proofs" />
            </motion.div>
            {/* Interactive Flow Card (Now flowing naturally below Trust Strip) */}
            <InteractiveFlowCard />
        </div>

        {/* Scroll Hint */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/30 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] uppercase tracking-widest font-bold">Initiate Sequence</span>
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </section>

      {/* --- STORYTELLING SECTIONS --- */}
      <ProblemSection />
      <SolutionSection />
      <WorkflowTimeline />
      <CoreFeaturesSection />
      <UseCasesSection />
      <MVPProductsSection />
      <EmotionalCoreSection />
      <FutureVisionSection />
      <FinalCTASection />

    </main>
  );
}

// --- SUB-COMPONENTS ---

function TrustIndicator({ icon, label }: { icon: React.ReactNode, label: string }) {
  return (
    <div className="flex items-center gap-2 text-sm font-medium text-gray-400 group cursor-default">
      <div className="text-purple-400/70 group-hover:text-purple-400 group-hover:scale-110 transition-all">
        {icon}
      </div>
      <span className="group-hover:text-white transition-colors">{label}</span>
    </div>
  );
}

function MockupRow({ delay }: { delay: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className="flex items-center justify-between p-4 bg-white/[0.03] rounded-xl border border-white/5 hover:bg-white/[0.06] transition-colors"
    >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-white/10 shrink-0">
            <ShieldCheck className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <div className="font-bold text-white">Global Health Network</div>
            <div className="text-xs text-gray-500 font-mono">Expires: 30 Days</div>
          </div>
        </div>
        <div className="text-right hidden sm:block">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-xs font-bold border border-green-500/20">
            Verified On-Chain
          </div>
        </div>
    </motion.div>
  );
}

// Interactive Data Flow Component
function InteractiveFlowCard() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((prev) => (prev + 1) % 4);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  const steps = [
    { icon: <Fingerprint className="w-6 h-6" />, label: "Consent", color: "text-blue-400", bg: "bg-blue-500/20" },
    { icon: <Network className="w-6 h-6" />, label: "Hash", color: "text-purple-400", bg: "bg-purple-500/20" },
    { icon: <Database className="w-6 h-6" />, label: "Ledger", color: "text-indigo-400", bg: "bg-indigo-500/20" },
    { icon: <CheckCircle2 className="w-6 h-6" />, label: "Verify", color: "text-green-400", bg: "bg-green-500/20" }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 2, duration: 1 }}
      className="relative mt-16 z-20 glass-panel-premium p-6 md:p-8 w-full max-w-4xl hidden lg:block mx-auto"
    >
      <div className="flex items-center justify-between relative">
        {/* Connecting Lines */}
        <div className="absolute left-[10%] right-[10%] top-1/2 -translate-y-1/2 h-0.5 bg-gray-800 z-0 overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-green-500"
            initial={{ width: "0%" }}
            animate={{ width: `${(step / 3) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {/* Nodes */}
        {steps.map((s, i) => {
          const isActive = i <= step;
          const isCurrent = i === step;
          
          return (
            <div key={i} className="relative z-10 flex flex-col items-center gap-4">
              <motion.div 
                animate={{ 
                  scale: isCurrent ? 1.2 : 1,
                  boxShadow: isCurrent ? `0 0 30px var(--tw-shadow-color)` : 'none'
                }}
                className={`w-16 h-16 rounded-2xl flex items-center justify-center border transition-all duration-500 ${isActive ? s.bg + ' ' + s.color + ' border-' + s.color.split('-')[1] + '-500/50 shadow-' + s.color.split('-')[1] + '-500' : 'bg-gray-900 border-gray-800 text-gray-600'}`}
              >
                {s.icon}
              </motion.div>
              <div className={`text-sm font-bold uppercase tracking-widest transition-colors duration-500 ${isActive ? 'text-white' : 'text-gray-600'}`}>
                {s.label}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

const HERO_WORDS = ["Instantly", "Securely", "Privately", "Verifiably", "Trustlessly", "Permanently"];

function HeroRotatingText() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % HERO_WORDS.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="inline-flex items-center pb-2">
      <span className="relative flex items-center overflow-visible">
          <AnimatePresence mode="popLayout">
            <motion.span
              key={index}
              initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -30, filter: 'blur(8px)' }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-indigo-400 text-shimmer font-black whitespace-nowrap"
            >
              {HERO_WORDS[index]}
            </motion.span>
          </AnimatePresence>
      </span>
      <span className="text-purple-400 ml-1">.</span>
      <motion.span 
        animate={{ opacity: [1, 0, 1] }} 
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="inline-block w-[3px] md:w-[6px] h-[50px] md:h-[80px] lg:h-[100px] ml-4 bg-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.8)] rounded-full"
      />
    </span>
  );
}

// --- NARRATIVE SECTIONS --- //

// 1. Problem Section (The Lie)
function ProblemSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-[#050608] px-6 py-32 overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="max-w-4xl text-center z-10"
      >
        <ShieldAlert className="w-16 h-16 text-red-500/80 mx-auto mb-8" />
        <h2 className="text-5xl md:text-7xl font-black mb-8 text-white">The Internet Runs on <span className="text-red-500/80">Blind Trust.</span></h2>
        <p className="text-2xl md:text-3xl font-light text-gray-400 mb-12 leading-relaxed">
          Every time you click 'I Agree', you lose control. Your data is copied, stored, and often shared — without real accountability.
        </p>
        <div className="inline-block border border-white/10 bg-white/5 backdrop-blur-md px-8 py-4 rounded-2xl shadow-2xl">
           <span className="text-xl md:text-2xl font-bold text-white tracking-wide">Consent today is a checkbox. Not a contract.</span>
        </div>
      </motion.div>
    </section>
  );
}

// 2. Solution Section (The Shift)
function SolutionSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 py-32 overflow-hidden">
      {/* Background Shift */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050608] via-indigo-950/20 to-[#0A0C10] z-0" />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5 }}
        className="max-w-5xl text-center z-10"
      >
        <Key className="w-20 h-20 text-indigo-400 mx-auto mb-8 animate-pulse" />
        <h2 className="text-5xl md:text-7xl font-black mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">What If Consent Was Enforceable?</h2>
        <p className="text-2xl font-light text-gray-300 mb-16 leading-relaxed max-w-3xl mx-auto">
          ConsentChain transforms permission into a living digital contract — time-bound, verifiable, and impossible to fake.
        </p>
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="p-8 border border-indigo-500/30 bg-indigo-500/5 backdrop-blur-xl rounded-3xl"
        >
          <div className="text-xl md:text-2xl text-indigo-200">
            "Like a hotel key — access works only when allowed. When time ends, it stops."
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

// 4. Core Features
function CoreFeaturesSection() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center px-6 py-32 bg-[#050608] border-t border-white/5">
      {/* Pilag Parallax Glow */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto w-full relative z-10">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mb-16 md:mb-24 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0A0C10] rounded-full mb-6 border-2 border-white/10 shadow-[4px_4px_0_#6366f1] font-black uppercase tracking-widest">
            <Shield className="h-4 w-4 text-indigo-400" />
            <span className="text-[11px] font-black text-white/90">Core Features</span>
          </div>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-[-0.03em] uppercase mb-6 text-white text-center">
            The Power Layer.
          </h2>
          <p className="text-xl text-gray-400 font-bold tracking-tight max-w-2xl text-center">
            Enterprise-grade infrastructure designed to build absolute trust without relying on central authorities.
          </p>
        </motion.div>

        {/* Cyber-Brutalist Grid (CampusLink Style) */}
        <motion.div
           initial="hidden"
           whileInView="show"
           viewport={{ once: true, margin: "-100px" }}
           variants={{
             hidden: { opacity: 0 },
             show: { opacity: 1, transition: { staggerChildren: 0.15 } }
           }}
           className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 auto-rows-fr relative"
        >
          {/* Large Card */}
          <motion.div variants={FADE_UP_ANIMATION_VARIANTS} className="md:col-span-2 bg-[#0A0C10] p-10 md:p-14 rounded-[2rem] border-[3px] border-white/20 shadow-[8px_8px_0_#6366f1] hover:shadow-[4px_4px_0_#6366f1] hover:translate-y-1 transition-all duration-200 group overflow-hidden relative h-full flex flex-col justify-between transform-gpu">
             <div className="absolute -right-8 -top-8 w-64 h-64 bg-indigo-500/10 rounded-full pointer-events-none transition-colors border-[2px] border-white/10"></div>
             <div className="w-16 h-16 bg-[#050608] border-2 border-white/20 shadow-[4px_4px_0_rgba(255,255,255,0.2)] rounded-2xl flex items-center justify-center mb-8 group-hover:-translate-y-1 transition-transform">
               <Shield className="h-8 w-8 text-indigo-400" />
             </div>
             <h3 className="text-4xl font-black mb-4 text-white tracking-[-0.03em] uppercase">Security Vault</h3>
             <p className="text-lg text-gray-400 font-semibold max-w-md leading-relaxed">
               Your personal control center. Issue, revoke, and monitor real-time data access parameters directly on-chain instantly.
             </p>
          </motion.div>

          {/* Standard Card */}
          <motion.div variants={FADE_UP_ANIMATION_VARIANTS} className="bg-[#0A0C10] p-10 md:p-14 rounded-[2rem] border-[3px] border-white/20 shadow-[8px_8px_0_#6366f1] hover:shadow-[4px_4px_0_#6366f1] hover:translate-y-1 transition-all duration-200 group h-full flex flex-col justify-between relative overflow-hidden transform-gpu">
             <div className="w-16 h-16 bg-[#050608] border-2 border-white/20 shadow-[4px_4px_0_rgba(255,255,255,0.2)] rounded-2xl flex items-center justify-center mb-8 group-hover:-translate-y-1 transition-transform">
               <Zap className="h-8 w-8 text-indigo-400" />
             </div>
             <h3 className="text-3xl font-black mb-4 text-white tracking-[-0.03em] uppercase">Instant Verification</h3>
             <p className="text-base text-gray-400 font-semibold leading-relaxed">
               No network delays. Cross-check ZK proofs the moment access is requested globally.
             </p>
          </motion.div>

          {/* Standard Card 2 */}
          <motion.div variants={FADE_UP_ANIMATION_VARIANTS} className="bg-[#0A0C10] p-10 md:p-14 rounded-[2rem] border-[3px] border-white/20 shadow-[8px_8px_0_#6366f1] hover:shadow-[4px_4px_0_#6366f1] hover:translate-y-1 transition-all duration-200 group h-full flex flex-col justify-between relative overflow-hidden transform-gpu">
             <div className="w-16 h-16 bg-[#050608] border-2 border-white/20 shadow-[4px_4px_0_rgba(255,255,255,0.2)] rounded-2xl flex items-center justify-center mb-8 group-hover:-translate-y-1 transition-transform">
               <FileText className="h-8 w-8 text-indigo-400" />
             </div>
             <h3 className="text-3xl font-black mb-4 text-white tracking-[-0.03em] uppercase">Immutable Ledger</h3>
             <p className="text-base text-gray-400 font-semibold leading-relaxed">
               Every consent approval is cryptographically anchored to Algorand's permanent timeline.
             </p>
          </motion.div>

          {/* Wide Card */}
          <motion.div variants={FADE_UP_ANIMATION_VARIANTS} className="md:col-span-2 bg-indigo-600 p-10 md:p-14 rounded-[2rem] border-[3px] border-white/20 shadow-[8px_8px_0_#0A0C10] hover:shadow-[4px_4px_0_#0A0C10] hover:translate-y-1 transition-all duration-200 group relative overflow-hidden text-white flex flex-col md:flex-row items-center justify-between gap-8 h-full transform-gpu">
             <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff1a_2px,transparent_2px),linear-gradient(to_bottom,#ffffff1a_2px,transparent_2px)] bg-[size:40px_40px]"></div>
             <div className="relative z-10 max-w-md">
               <div className="w-16 h-16 bg-[#0A0C10] rounded-2xl flex items-center justify-center mb-8 group-hover:-translate-y-1 transition-transform border-2 border-white/20 shadow-[4px_4px_0_rgba(255,255,255,0.2)]">
                 <Cpu className="h-8 w-8 text-indigo-400" />
               </div>
               <h3 className="text-4xl font-black mb-4 tracking-[-0.03em] uppercase">Zero Trust Architecture</h3>
               <p className="text-white/90 text-lg font-bold leading-relaxed">
                 Data processors don't trust us. We don't trust them. Mathematical proofs enforce the exact boundaries of your consent contract.
               </p>
             </div>
             <div className="relative z-10 w-full md:w-auto flex justify-center">
               <div className="w-40 h-40 bg-[#0A0C10] rounded-full flex items-center justify-center border-[3px] border-indigo-400 shadow-[8px_8px_0_rgba(255,255,255,0.1)] group-hover:scale-[1.03] transition-transform duration-300">
                 <Fingerprint className="w-16 h-16 text-indigo-400" />
               </div>
             </div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}

// 5. Use Cases
function UseCasesSection() {
  const cases = [
    { title: "Healthcare", desc: "Patient-controlled health records. Hospitals only see what's needed.", icon: <Activity className="w-8 h-8"/> },
    { title: "Finance", desc: "Instant KYC validation without permanent data storage.", icon: <Database className="w-8 h-8"/> },
    { title: "Education", desc: "Verifiable credentials and academic history on demand.", icon: <Globe className="w-8 h-8"/> },
    { title: "Enterprise", desc: "B2B compliance frameworks automated by smart contracts.", icon: <Layers className="w-8 h-8"/> }
  ];

  return (
    <section className="relative min-h-screen flex flex-col justify-center px-6 py-32 bg-[#0A0C10]">
      <div className="max-w-7xl mx-auto w-full relative z-10">
        <h2 className="text-4xl md:text-6xl font-black mb-16 border-b border-white/10 pb-10 text-white">Real World Impact</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cases.map((c, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="bg-[#050608] border-[3px] border-white/20 shadow-[6px_6px_0_#6366f1] hover:shadow-[3px_3px_0_#6366f1] hover:translate-y-1 rounded-[1.5rem] p-8 transition-all cursor-default group"
            >
               <div className="w-16 h-16 bg-[#0A0C10] border-2 border-white/20 shadow-[4px_4px_0_rgba(255,255,255,0.1)] rounded-xl flex items-center justify-center mb-6 group-hover:-translate-y-1 transition-transform">
                 <div className="text-indigo-400">{c.icon}</div>
               </div>
               <h3 className="text-2xl font-black mb-3 text-white tracking-wide uppercase">{c.title}</h3>
               <p className="text-gray-400 font-medium text-sm leading-relaxed">{c.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// 6. MVP Products
function MVPProductsSection() {
  const products = [
    { title: "Security Vault", desc: "The end-user dashboard for managing and revoking data access in real-time.", link: "/dashboard" },
    { title: "Demo Portals", desc: "The B2B portal where partners request access via cryptographic handshakes.", link: "/demo" },
    { title: "Consent Ledger", desc: "The underlying Algorand smart contracts enforcing temporal access control.", link: "/verify" }
  ];

  return (
    <section className="relative min-h-[80vh] flex flex-col justify-center px-6 py-32 bg-[#050608]">
      <div className="max-w-6xl mx-auto w-full relative z-10">
        <div className="flex items-center gap-3 mb-12">
          <div className="h-[1px] w-12 bg-indigo-500"></div>
          <span className="text-indigo-400 font-bold tracking-widest uppercase text-sm">What You've Built</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((p, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.2 }}
            >
              <Link href={p.link} className="bg-[#0A0C10] block p-8 flex flex-col justify-between h-full group border-[3px] border-white/20 shadow-[8px_8px_0_#6366f1] hover:shadow-[4px_4px_0_#6366f1] rounded-[2rem] hover:translate-y-1 transition-all">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-xs font-black tracking-widest uppercase border border-green-500/20 mb-6">
                    Available Now
                  </div>
                  <h3 className="text-3xl font-black mb-4 uppercase tracking-[-0.03em]">{p.title}</h3>
                  <p className="text-gray-400 font-medium">{p.desc}</p>
                </div>
                <div className="w-12 h-12 bg-[#050608] border-2 border-white/20 rounded-full flex items-center justify-center mt-8 group-hover:bg-indigo-600 transition-colors shadow-[4px_4px_0_rgba(255,255,255,0.1)]">
                   <ArrowUpRight className="w-6 h-6 text-white" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// 7. Why It Matters
function EmotionalCoreSection() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center px-6 py-32 bg-[#0A0C10]">
      {/* Pilag foundation style glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.1),transparent_70%)] pointer-events-none mix-blend-screen" />
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-200px" }}
        transition={{ duration: 2 }}
        className="max-w-4xl text-center relative z-10"
      >
        <h2 className="text-5xl md:text-7xl font-black mb-10 text-gray-100">This Isn't About Data.<br/><span className="text-indigo-500">It's About Control.</span></h2>
        <p className="text-2xl md:text-3xl text-gray-500 font-light mb-16 leading-relaxed">
          For decades, organizations controlled your digital identity. ConsentChain returns that control to you.
        </p>
        <div className="inline-block px-8 py-5 border-[3px] border-white/20 shadow-[8px_8px_0_#6366f1] bg-[#050608] rounded-[1.5rem]">
          <div className="text-2xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 pb-2">
            You don't give data anymore. You grant access.
          </div>
        </div>
      </motion.div>
    </section>
  );
}

// 8. Future Vision
function FutureVisionSection() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center px-6 py-32 bg-[#050608]">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5 }}
        className="max-w-5xl text-center bg-[#0A0C10] border-[3px] border-white/20 shadow-[12px_12px_0_#6366f1] p-16 rounded-[3rem] w-full"
      >
        <h2 className="text-3xl md:text-4xl text-gray-600 font-light mb-16 tracking-wide">A world where:</h2>
        <ul className="text-4xl md:text-7xl font-black space-y-8 mb-24">
          <li className="text-white hover:scale-105 transition-transform cursor-default">Data breaches don't exist.</li>
          <li className="text-indigo-300 hover:text-white transition-colors cursor-default">Consent is programmable.</li>
          <li className="text-indigo-600 hover:text-white transition-colors cursor-default">Trust is replaced by proof.</li>
        </ul>
        <div className="inline-block px-6 py-3 border-2 border-indigo-500/50 rounded-full bg-indigo-500/10 text-xl md:text-2xl uppercase tracking-[0.4em] font-black text-indigo-400">
          This is digital sovereignty.
        </div>
      </motion.div>
    </section>
  );
}

// 9. Final CTA
function FinalCTASection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0A0C10]">
      {/* Cinematic Final Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-indigo-600/10 rounded-full blur-[150px] z-0 pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="relative z-10 text-center px-6 max-w-4xl"
      >
        <h2 className="text-5xl md:text-8xl font-black mb-12 text-white">
          The Internet is Changing.<br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Be Early.</span>
        </h2>
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-16">
          <Link href="/demo" className="bg-[#050608] border-[3px] border-white/20 shadow-[6px_6px_0_#6366f1] hover:shadow-[3px_3px_0_#6366f1] hover:translate-y-1 rounded-[1.5rem] inline-flex px-10 py-5 text-white font-black text-xl items-center gap-3 transition-all duration-300">
            Start Securing Data <Target className="w-5 h-5" />
          </Link>
          <Link href="/dashboard" className="px-10 py-5 font-bold text-xl text-gray-400 hover:text-white border-[3px] border-transparent hover:border-white/10 rounded-[1.5rem] transition-all">
            Explore Dashboard
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
