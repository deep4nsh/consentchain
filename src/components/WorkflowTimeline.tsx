'use client';
import { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { Target, Zap, Clock, CheckCircle, Shield, User, Lock, MapPin, Wallet, DollarSign, Send, Radar, Search, Briefcase, ChevronRight, Fingerprint, Database, Network } from 'lucide-react';

const FADE_UP_ANIMATION_VARIANTS = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100, damping: 20 } },
};

function DashboardApply({ progress, threshold }: any) {
  const p = progress;
  return (
    <div className="w-full h-full flex flex-col relative overflow-hidden bg-[#0A0C10]/80">
      <div className="flex items-center px-4 py-3 md:px-6 md:py-4 bg-white/[0.02] border-b border-white/10 shadow-[0_10px_20px_rgba(0,0,0,0.2)]">
        <div className="flex gap-2 mr-auto relative z-10">
          <div className="w-3 h-3 rounded-full bg-red-400/50" />
          <div className="w-3 h-3 rounded-full bg-amber-400/50" />
          <div className="w-3 h-3 rounded-full bg-green-400/50" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="px-6 py-1.5 rounded-full bg-white/5 flex items-center gap-2 border border-white/10 shadow-sm ">
            <Shield className="w-3 h-3 text-indigo-400 opacity-60" />
            <div className="w-20 h-1 z-10 bg-white/10 rounded-full" />
          </div>
        </div>
        <div className="w-8 ml-auto" />
      </div>

      <div className="p-4 md:p-6 flex-1 flex flex-col justify-center gap-5 md:gap-7">
        <motion.div style={p ? { opacity: useTransform(p, [Math.max(0, threshold - 0.2), threshold], [0, 1]), y: useTransform(p, [Math.max(0, threshold - 0.2), threshold], [30, 0]), willChange: "transform, opacity" } : {}} className="flex flex-col gap-2 transform-gpu">
          <div className="w-24 h-2 bg-white/20 rounded-full ml-1" />
          <div className="w-full h-12 md:h-14 bg-white/[0.02] border border-white/10 rounded-xl flex items-center px-4 shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]">
            <User className="w-5 h-5 mr-3 text-indigo-400" />
            <div className="w-32 h-2 bg-white/30 rounded-full" />
          </div>
        </motion.div>

        <motion.div style={p ? { opacity: useTransform(p, [Math.max(0, threshold - 0.2), threshold], [0, 1]), y: useTransform(p, [Math.max(0, threshold - 0.2), threshold], [30, 0]), willChange: "transform, opacity" } : {}} className="flex flex-col gap-2 transform-gpu">
          <div className="w-16 h-2 bg-white/20 rounded-full ml-1" />
          <div className="w-full h-12 md:h-14 bg-white/[0.02] border border-white/10 rounded-xl flex items-center px-4 shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]">
            <Lock className="w-5 h-5 mr-3 text-indigo-400" />
            <div className="flex gap-1.5">
              {[...Array(6)].map((_, i) => <div key={i} className="w-2 h-2 rounded-full bg-white/50" />)}
            </div>
          </div>
        </motion.div>

        <motion.div
          style={p ? { opacity: useTransform(p, [Math.max(0, threshold - 0.2), threshold + 0.1], [0, 1]), scale: useTransform(p, [Math.max(0, threshold - 0.2), threshold + 0.1], [0.95, 1]), willChange: "transform, opacity" } : {}}
          className="mt-2 w-full h-12 md:h-14 bg-indigo-500 text-white rounded-xl flex items-center justify-center gap-2 shadow-[0_10px_30px_rgba(99,102,241,0.3)] font-bold text-sm tracking-wider uppercase transform-gpu"
        >
          <span>Grant Consent</span>
          <Send className="w-4 h-4 ml-1" />
        </motion.div>
      </div>
    </div>
  )
}

function DashboardMatch({ progress, threshold }: any) {
  const p = progress;
  const pop1 = p ? useTransform(p, [Math.max(0, threshold - 0.2), threshold], [0, 1]) : 1;
  const pop2 = p ? useTransform(p, [threshold - 0.15, threshold + 0.05], [0, 1]) : 1;
  const pop3 = p ? useTransform(p, [threshold - 0.1, threshold + 0.1], [0, 1]) : 1;

  return (
    <div className="w-full h-full flex items-center justify-center relative overflow-hidden bg-[#0A0C10]/80">
      <div className="absolute inset-0 m-auto w-[350px] h-[350px] md:w-[500px] md:h-[500px] border border-white/10 rounded-full" />
      <div className="absolute inset-0 m-auto w-[200px] h-[200px] md:w-[320px] md:h-[320px] border border-indigo-500/30 rounded-full border-dashed" />
      <div className="absolute inset-0 m-auto w-[100px] h-[100px] md:w-[150px] md:h-[150px] border border-indigo-500/50 rounded-full" />
      <div className="absolute inset-0 m-auto w-40 h-40 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.15)_0,transparent_70%)] rounded-full -z-10" />

      <div className="absolute inset-0 m-auto w-16 h-16 md:w-20 md:h-20 bg-[#050608] border border-indigo-500/60 shadow-[0_0_20px_rgba(99,102,241,0.2)] rounded-full flex items-center justify-center z-10 box-border">
        <Radar className="w-8 h-8 text-indigo-400" />
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }} className="absolute -inset-[2px] rounded-full overflow-hidden mix-blend-screen">
          <div className="absolute inset-0" style={{ background: "conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 270deg, rgba(99, 102, 241, 0.5) 360deg)" }} />
        </motion.div>
      </div>

      <motion.div style={p ? { scale: pop1, opacity: pop1, willChange: "transform, opacity" } : {}} className="absolute top-[18%] right-[25%] w-12 h-12 md:w-16 md:h-16 bg-[#050608] rounded-full border border-indigo-500/40 flex flex-col items-center justify-center z-20 overflow-hidden group hover:scale-110 transition-transform transform-gpu">
        <div className="absolute inset-0 bg-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        <User className="w-5 h-5 md:w-7 md:h-7 text-indigo-400" />
        <div className="absolute -top-1 -right-1 w-3 h-3 md:w-4 md:h-4 bg-green-500 border-2 md:border-[3px] border-[#0A0C10] rounded-full shadow-sm" />
      </motion.div>

      <motion.div style={p ? { scale: pop2, opacity: pop2, willChange: "transform, opacity" } : {}} className="absolute bottom-[20%] left-[20%] w-12 h-12 md:w-16 md:h-16 bg-[#050608] rounded-full border border-white/10 flex items-center justify-center z-20 transform-gpu">
        <Briefcase className="w-5 h-5 md:w-7 md:h-7 text-white/50" />
        <div className="absolute -top-1 -right-1 w-3 h-3 md:w-4 md:h-4 bg-green-500 border-2 md:border-[3px] border-[#0A0C10] rounded-full" />
      </motion.div>

      <motion.div style={p ? { scale: pop3, opacity: pop3, willChange: "transform, opacity" } : {}} className="absolute top-[35%] left-[10%] w-10 h-10 bg-[#050608] rounded-full border border-white/10 flex items-center justify-center z-20 transform-gpu">
        <Search className="w-4 h-4 text-indigo-400/50" />
      </motion.div>
    </div>
  )
}

function DashboardExecute({ progress, threshold }: any) {
  const p = progress;
  return (
    <div className="w-full h-full p-4 md:p-6 flex flex-col bg-[#0A0C10]/80">
      <div className="w-full h-24 md:h-32 bg-white/[0.02] rounded-2xl border border-white/10 relative overflow-hidden mb-4 md:mb-6 flex items-center justify-center shadow-[inset_0_5px_15px_rgba(0,0,0,0.1)]">
        <div className="absolute inset-0 opacity-10 md:opacity-[0.05] bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] bg-[length:15px_15px]" />

        <div className="relative z-10 flex flex-col items-center">
          <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}>
            <Network className="w-8 h-8 text-indigo-400 drop-shadow-md" />
          </motion.div>
          <div className="w-4 h-1 bg-black/50 blur-[1px] md:blur-[2px] rounded-full mt-1" />
        </div>

        <div className="absolute top-3 right-3 px-3 py-1 bg-[#0A0C10]/90 rounded-full border border-white/10 flex items-center gap-1.5 shadow-sm">
          <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[9px] md:text-[10px] font-bold tracking-wider text-green-400">SYNCED</span>
        </div>
      </div>

      <div className="flex flex-col gap-3 flex-1 justify-center">
        {[0, 1, 2].map((i) => {
          const itemLoad = p ? useTransform(p, [Math.max(0, threshold - 0.2) + (i * 0.05), threshold + (i * 0.05)], [0, 1]) : 1;
          const itemX = p ? useTransform(p, [Math.max(0, threshold - 0.2) + (i * 0.05), threshold + (i * 0.05)], [40, 0]) : 0;
          return (
            <motion.div
              key={i}
              style={p ? { opacity: itemLoad, x: itemX, willChange: "transform, opacity" } : {}}
              className="flex items-center gap-3 md:gap-4 px-3 py-2.5 md:px-4 md:py-3 bg-white/[0.02] rounded-xl border border-white/10 shadow-sm transform-gpu"
            >
              <div className={`w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center shrink-0 border ${i === 2 ? 'bg-transparent border-white/20' : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30'}`}>
                {i !== 2 && <CheckCircle className="w-3 h-3 md:w-3.5 md:h-3.5" />}
              </div>
              <div className="flex-1 flex flex-col gap-1.5 md:gap-2">
                <div className="w-2/3 h-1.5 md:h-2 bg-white/20 rounded-full" />
                {i !== 0 && <div className="w-1/3 h-1 md:h-1.5 bg-white/10 rounded-full" />}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  )
}

function DashboardReward({ progress, threshold }: any) {
  const p = progress;
  const load = p ? useTransform(p, [Math.max(0, threshold - 0.2), threshold], [0, 1]) : 1;
  const stampScale = p ? useTransform(p, [threshold - 0.1, threshold + 0.1], [2, 1]) : 1;
  const stampOpacity = p ? useTransform(p, [threshold - 0.15, threshold + 0.05], [0, 1]) : 1;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.1),rgba(10,12,16,0.8))]">
      <motion.div
        style={p ? { scale: useTransform(p, [Math.max(0, threshold - 0.2), threshold], [0.5, 1]), opacity: load, willChange: "transform, opacity" } : {}}
        className="w-20 h-20 md:w-24 md:h-24 bg-[#050608] rounded-3xl flex items-center justify-center border border-white/10 shadow-[0_20px_40px_rgba(99,102,241,0.2)] mb-6 md:mb-8 relative z-10 transform-gpu"
      >
        <div className="absolute inset-0 bg-indigo-500/10 rounded-3xl" />
        <Database className="w-8 h-8 md:w-10 md:h-10 text-indigo-400 drop-shadow-md relative z-10" />
      </motion.div>

      <motion.div style={p ? { opacity: load, y: useTransform(p, [Math.max(0, threshold - 0.2), threshold], [30, 0]), willChange: "transform, opacity" } : {}} className="flex flex-col items-center gap-1.5 md:gap-2 z-10 transform-gpu">
        <span className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-[0.3em] font-mono">Data Flow Status</span>
        <div className="flex items-center text-white text-3xl md:text-4xl font-black tracking-tighter">
          <span className="text-indigo-400 mr-2">ZKP</span>
          <span>Verified</span>
        </div>
      </motion.div>

      <motion.div
        style={p ? { opacity: stampOpacity, scale: stampScale, willChange: "transform, opacity" } : {}}
        className="absolute bottom-5 md:bottom-8 flex items-center gap-1.5 md:gap-2 text-[10px] md:text-xs font-black text-green-500 bg-green-500/10 px-3 py-2 md:px-4 md:py-2.5 rounded-full border border-green-500/30 z-20 max-w-[90%] justify-center text-center leading-tight shadow-[0_5px_20px_rgba(34,197,94,0.2)] transform-gpu"
      >
        <CheckCircle className="w-3 h-3 md:w-4 md:h-4 shrink-0" />
        <span className="uppercase tracking-widest break-words w-full">Access Granted</span>
      </motion.div>
    </div>
  )
}

function TimelineNodeWrapper({ top, side, number, title, desc, type, scrollYProgress, threshold }: any) {
  const isLeft = side === "left";
  const nodeX = isLeft ? '20%' : '80%';
  const oppositeX = isLeft ? '80%' : '20%';

  const p = scrollYProgress;

  // The scrubbing window: activates slightly before the node is reached
  const enterRange = [Math.max(0, threshold - 0.15), threshold];

  const uiOpacity = useTransform(p, enterRange, [0, 1]);
  const textX = useTransform(p, enterRange, [isLeft ? -40 : 40, 0]);

  const cardStartX = isLeft ? 80 : -80;
  const cardX = useTransform(p, enterRange, [cardStartX, 0]);
  const cardY = useTransform(p, enterRange, [50, 0]);
  const cardScale = useTransform(p, enterRange, [0.85, 1]);

  // Deep Parallax Rotation mapped against a wider scroll range
  const rotateY = useTransform(p, [Math.max(0, threshold - 0.3), threshold + 0.1], [isLeft ? -25 : 25, isLeft ? 5 : -5]);
  const rotateX = useTransform(p, [Math.max(0, threshold - 0.3), threshold + 0.1], [20, -5]);

  return (
    <div className="absolute w-full z-10" style={{ top, transform: "translateY(-50%)", perspective: "1200px" }}>

      <div className="absolute pointer-events-auto" style={{ left: nodeX, top: "50%", transform: "translate(-50%, -50%)", zIndex: 30 }}>
        <motion.div
          style={{ scale: uiOpacity, opacity: uiOpacity }}
          className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full bg-[#0A0C10] border-[4px] border-white/20 flex items-center justify-center font-black text-xl lg:text-2xl text-white shadow-[8px_8px_0_#6366f1] hover:shadow-[4px_4px_0_#6366f1] hover:translate-y-0.5 relative transform-gpu transition-all"
        >
          {number}
        </motion.div>

      </div>

      <div
        className={`absolute flex flex-col pointer-events-auto z-20 ${isLeft ? 'items-start text-left' : 'items-end text-right'}`}
        style={{
          top: "50%",
          transform: "translateY(-50%)",
          left: isLeft ? "calc(20% + 4.5rem)" : "auto",
          right: isLeft ? "auto" : "calc(20% + 4.5rem)",
          width: "30%",
        }}
      >
        <motion.div style={{ opacity: uiOpacity, x: textX, willChange: "transform, opacity" }} className="transform-gpu bg-[#0A0C10]/80 backdrop-blur-md border-[3px] border-white/10 shadow-[8px_8px_0_#6366f1] p-6 rounded-2xl w-[300px] lg:w-[350px]">
          <h3 className="text-2xl lg:text-3xl font-black mb-3 tracking-wide uppercase text-white leading-tight">{title}</h3>
          <p className="text-sm lg:text-base text-gray-400 font-bold leading-relaxed">{desc}</p>
        </motion.div>
      </div>

      <div
        className="absolute z-10 pointer-events-none hidden md:flex items-center justify-center"
        style={{
          top: "50%",
          left: oppositeX,
          transform: "translate(-50%, -50%)",
          perspective: "1500px"
        }}
      >
        <motion.div className="w-full flex justify-center pointer-events-auto" style={{ transformStyle: "preserve-3d" }}>
          <motion.div
            style={{ opacity: uiOpacity, scale: cardScale, x: cardX, y: cardY, rotateX, rotateY, willChange: "transform, opacity" }}
            className="w-[280px] h-[280px] lg:w-[400px] lg:h-[400px] xl:w-[440px] xl:h-[440px] relative flex items-center justify-center group transform-gpu"
          >
            {/* --- NEO BRUTALIST 3D SHELL --- */}
            <div className="absolute inset-0 bg-[#050608] border-[4px] border-white/20 rounded-[2rem] lg:rounded-[3rem] shadow-[16px_16px_0_rgba(255,255,255,0.1)] overflow-hidden transition-all duration-300 flex flex-col z-0 p-3 lg:p-4 hover:shadow-[8px_8px_0_rgba(255,255,255,0.1)] hover:translate-y-2 hover:translate-x-2">

              {/* --- Inner Card Element --- */}
              <div className="flex-1 w-full h-full relative z-10 transition-transform duration-300">
                <div className="w-full h-full rounded-[1.5rem] lg:rounded-[2.25rem] overflow-hidden border-[3px] border-white/20 relative bg-[#0A0C10] shadow-[4px_4px_0_#6366f1]">
                  {type === "apply" && <DashboardApply progress={p} threshold={threshold} />}
                  {type === "match" && <DashboardMatch progress={p} threshold={threshold} />}
                  {type === "execute" && <DashboardExecute progress={p} threshold={threshold} />}
                  {type === "reward" && <DashboardReward progress={p} threshold={threshold} />}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

function MobileTimelineNode({ number, title, desc, type }: { number: string, title: string, desc: string, type: string }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "center center"] });
  const p = scrollYProgress; // Native lenis passed-through

  const uiOpacity = useTransform(p, [0, 1], [0, 1]);
  const textY = useTransform(p, [0, 1], [20, 0]);
  const cardScale = useTransform(p, [0, 1], [0.9, 1]);
  const cardY = useTransform(p, [0, 1], [30, 0]);

  return (
    <div ref={ref} className="flex gap-4 relative z-10 w-full pl-4 pb-16">
      <motion.div
        style={{ scale: uiOpacity, opacity: uiOpacity }}
        className="w-12 h-12 shrink-0 rounded-[12px] bg-[#0A0C10] border-[3px] border-white/20 flex items-center justify-center font-black text-lg text-white shadow-[4px_4px_0_#6366f1] relative z-20 transform-gpu"
      >
        {number}
      </motion.div>

      <div className="flex-1 w-full relative group">
        <motion.div style={{ opacity: uiOpacity, y: textY, willChange: "transform, opacity" }} className="transform-gpu">
          <h3 className="text-xl font-black mb-2 tracking-tight leading-tight text-white">{title}</h3>
          <p className="text-gray-400 text-sm leading-relaxed mb-6">{desc}</p>
        </motion.div>

        <motion.div
          style={{ opacity: uiOpacity, scale: cardScale, y: cardY, willChange: "transform, opacity" }}
          className="w-full aspect-square max-h-[300px] relative group transform-gpu"
        >
          {/* MOBILE PROTO BRUTALIST SHELL */}
          <div className="absolute inset-0 bg-[#0A0C10] border-[3px] border-white/20 shadow-[8px_8px_0_rgba(255,255,255,0.1)] rounded-[2rem] overflow-hidden flex flex-col p-2.5 z-10 ml-4 pb-2 transition-all">

            {/* Mobile Inner Card */}
            <div className="w-full h-full rounded-[1.2rem] overflow-hidden border-[2px] border-white/20 relative bg-[#050608] shadow-[2px_2px_0_#6366f1] z-10">
              {type === "apply" && <DashboardApply />}
              {type === "match" && <DashboardMatch />}
              {type === "execute" && <DashboardExecute />}
              {type === "reward" && <DashboardReward />}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default function WorkflowTimeline() {
  const containerRef = useRef(null);
  const { scrollYProgress: rawScrollYProgress } = useScroll({ target: containerRef, offset: ["start center", "end center"] });
  // Feather-light spring: Filters out high-freq micro-jitters without lagging behind the trackpad momentum.
  const smoothProgress = useSpring(rawScrollYProgress, { stiffness: 250, damping: 40, mass: 0.05, restDelta: 0.001 });

  // --- 🔥 ENERGY FLOW MOTION SYSTEM ---
  // Background Reactive Glow
  const bgOpacity = useTransform(smoothProgress, [0, 1], [0.1, 0.35]);
  const bgScale = useTransform(smoothProgress, [0, 1], [0.9, 1.2]);

  // Ambient Light Shift (Directional)
  const bgGradient = useTransform(
    smoothProgress,
    [0, 1],
    [
      "linear-gradient(to bottom, transparent, rgba(99,102,241, 0.02), transparent)",
      "linear-gradient(to bottom, transparent, rgba(99,102,241, 0.08), transparent)"
    ]
  );

  // Traveling Glow Pulses (6 streams now)
  const glowTop1 = useTransform(smoothProgress, [0, 1], ["-10%", "110%"]);
  const glowTop2 = useTransform(smoothProgress, [0, 1], ["-25%", "95%"]);
  const glowTop3 = useTransform(smoothProgress, [0, 1], ["-40%", "80%"]);

  // Extra Scattered Particles (Inner Ring)
  const glowTop4 = useTransform(smoothProgress, [0, 1], ["5%", "120%"]);
  const glowTop5 = useTransform(smoothProgress, [0, 1], ["-15%", "105%"]);
  const glowTop6 = useTransform(smoothProgress, [0, 1], ["-35%", "85%"]);

  // Vast Swarm Particles (Outer Field)
  const glowTop7 = useTransform(smoothProgress, [0, 1], ["-10%", "130%"]);
  const glowTop8 = useTransform(smoothProgress, [0, 1], ["20%", "90%"]);
  const glowTop9 = useTransform(smoothProgress, [0, 1], ["-50%", "110%"]);
  const glowTop10 = useTransform(smoothProgress, [0, 1], ["30%", "150%"]);
  const glowTop11 = useTransform(smoothProgress, [0, 1], ["0%", "80%"]);
  const glowTop12 = useTransform(smoothProgress, [0, 1], ["-20%", "100%"]);

  // Deep Flank Swarm (Extreme Edge Bounds)
  const glowTop13 = useTransform(smoothProgress, [0, 1], ["-60%", "140%"]);
  const glowTop14 = useTransform(smoothProgress, [0, 1], ["25%", "110%"]);
  const glowTop15 = useTransform(smoothProgress, [0, 1], ["-10%", "90%"]);
  const glowTop16 = useTransform(smoothProgress, [0, 1], ["40%", "130%"]);
  const glowTop17 = useTransform(smoothProgress, [0, 1], ["-30%", "100%"]);
  const glowTop18 = useTransform(smoothProgress, [0, 1], ["15%", "95%"]);
  const glowTop19 = useTransform(smoothProgress, [0, 1], ["-5%", "150%"]);
  const glowTop20 = useTransform(smoothProgress, [0, 1], ["50%", "120%"]);

  // --- TRAIL IMMEDIATE LEFT FLANK ---
  const glowTop27 = useTransform(smoothProgress, [0, 1], ["-15%", "115%"]);
  const glowTop28 = useTransform(smoothProgress, [0, 1], ["5%", "135%"]);
  const glowTop29 = useTransform(smoothProgress, [0, 1], ["-35%", "105%"]);
  const glowTop30 = useTransform(smoothProgress, [0, 1], ["25%", "155%"]);
  const glowTop31 = useTransform(smoothProgress, [0, 1], ["10%", "95%"]);
  const glowTop32 = useTransform(smoothProgress, [0, 1], ["-50%", "140%"]);
  const glowTop33 = useTransform(smoothProgress, [0, 1], ["0%", "120%"]);
  const glowTop34 = useTransform(smoothProgress, [0, 1], ["-20%", "85%"]);
  const glowTop35 = useTransform(smoothProgress, [0, 1], ["40%", "125%"]);
  const glowTop36 = useTransform(smoothProgress, [0, 1], ["15%", "150%"]);

  // Intensity Flicker
  const glowOpacity1 = useTransform(smoothProgress, [0, 0.5, 1], [0.1, 0.8, 0.1]);
  const glowOpacity2 = useTransform(smoothProgress, [0, 0.5, 1], [0, 0.4, 0]);
  const glowOpacity3 = useTransform(smoothProgress, [0, 0.5, 1], [0, 0.2, 0]);
  const glowOpacityExtra = useTransform(smoothProgress, [0, 0.5, 1], [0, 0.35, 0]);

  // Vertical Downward Gravity Force
  const gravityY = useTransform(smoothProgress, [0, 1], ["0px", "60px"]);

  // Animated Dash Path Offset (Fake acceleration)
  const rawDashOffset = useTransform(smoothProgress, [0, 0.7, 1], [0, -200, -600]);
  const dashOffset = useSpring(rawDashOffset, { stiffness: 200, damping: 30 });
  // -------------------------------------

  return (
    <motion.section
      className="py-32 relative overflow-hidden transform-gpu bg-[#0A0C10]"
      style={{ background: bgGradient }}
    >
      {/* 💥 Step 3 & 6: Reactive Background Glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none -z-10 flex items-center justify-center transform-gpu"
        style={{ opacity: bgOpacity, scale: bgScale, willChange: "transform, opacity" }}
      >
        <div className="w-[120%] h-[120%] rounded-full flex-shrink-0" style={{ backgroundImage: "radial-gradient(circle at center, rgba(99,102,241, 0.15), transparent 70%)" }} />
      </motion.div>

      {/* 💥 Step 4 & 5: Multiple Flow Streams (Vast Particle Field) */}
      <motion.div style={{ translateY: gravityY }} className="absolute inset-x-0 top-0 bottom-0 pointer-events-none z-0 overflow-hidden transform-gpu">

        {/* --- CORE BEAM LINE --- */}
        <motion.div
          className="absolute w-[120px] h-[120px] rounded-full blur-[40px] transform-gpu left-1/2 -translate-x-1/2"
          style={{
            top: glowTop1,
            opacity: glowOpacity1,
            backgroundImage: "radial-gradient(circle at center, rgba(99,102,241,1), transparent 60%)",
            willChange: "transform, opacity",
          }}
        />
        <motion.div
          className="absolute w-[100px] h-[100px] rounded-full blur-[30px] transform-gpu left-1/2 -translate-x-1/2"
          style={{
            top: glowTop2,
            opacity: glowOpacity2,
            backgroundImage: "radial-gradient(circle at center, rgba(99,102,241, 0.7), transparent 70%)",
            willChange: "transform, opacity",
          }}
        />
        <motion.div
          className="absolute w-[80px] h-[80px] rounded-full blur-[20px] transform-gpu left-1/2 -translate-x-1/2"
          style={{
            top: glowTop3,
            opacity: glowOpacity3,
            backgroundImage: "radial-gradient(circle at center, rgba(99,102,241, 0.5), transparent 70%)",
            willChange: "transform, opacity",
          }}
        />

        {/* --- INNER SCATTERED RING --- */}
        <motion.div
          className="absolute w-[80px] h-[80px] rounded-full blur-[20px] transform-gpu left-1/2 ml-[140px]"
          style={{ top: glowTop4, opacity: glowOpacityExtra, backgroundImage: "radial-gradient(circle at center, rgba(99,102,241,1), transparent 60%)" }}
        />
        <motion.div
          className="absolute w-[180px] h-[180px] rounded-full blur-[50px] transform-gpu left-1/2 -ml-[250px]"
          style={{ top: glowTop5, opacity: useTransform(smoothProgress, [0, 0.5, 1], [0, 0.2, 0]), backgroundImage: "radial-gradient(circle at center, rgba(99,102,241,1), transparent 70%)" }}
        />
        <motion.div
          className="absolute w-[40px] h-[40px] rounded-full blur-[10px] transform-gpu left-1/2 -ml-[90px]"
          style={{ top: glowTop6, opacity: useTransform(smoothProgress, [0, 0.5, 1], [0, 0.6, 0]), backgroundImage: "radial-gradient(circle at center, rgba(99,102,241,1), transparent 50%)" }}
        />

        {/* --- VAST OUTER PARTICLE SWARM --- */}
        <motion.div
          className="absolute w-[250px] h-[250px] rounded-full blur-[80px] transform-gpu left-[5%]"
          style={{ top: glowTop7, opacity: useTransform(smoothProgress, [0, 0.5, 1], [0, 0.15, 0]), backgroundImage: "radial-gradient(circle at center, rgba(99,102,241,1), transparent 60%)" }}
        />
        <motion.div
          className="absolute w-[50px] h-[50px] rounded-full blur-[15px] transform-gpu right-[12%]"
          style={{ top: glowTop8, opacity: useTransform(smoothProgress, [0, 0.5, 1], [0, 0.4, 0]), backgroundImage: "radial-gradient(circle at center, rgba(99,102,241,1), transparent 60%)" }}
        />
        <motion.div
          className="absolute w-[350px] h-[350px] rounded-full blur-[100px] transform-gpu left-[-10%]"
          style={{ top: glowTop9, opacity: useTransform(smoothProgress, [0, 0.5, 1], [0, 0.1, 0]), backgroundImage: "radial-gradient(circle at center, rgba(99,102,241,1), transparent 70%)" }}
        />
        <motion.div
          className="absolute w-[90px] h-[90px] rounded-full blur-[25px] transform-gpu right-[4%]"
          style={{ top: glowTop10, opacity: useTransform(smoothProgress, [0, 0.5, 1], [0, 0.25, 0]), backgroundImage: "radial-gradient(circle at center, rgba(99,102,241,1), transparent 70%)" }}
        />
        <motion.div
          className="absolute w-[30px] h-[30px] rounded-full blur-[8px] transform-gpu left-[22%]"
          style={{ top: glowTop11, opacity: useTransform(smoothProgress, [0, 0.5, 1], [0, 0.5, 0]), backgroundImage: "radial-gradient(circle at center, rgba(99,102,241,1), transparent 50%)" }}
        />
        <motion.div
          className="absolute w-[180px] h-[180px] rounded-full blur-[50px] transform-gpu right-[28%]"
          style={{ top: glowTop12, opacity: useTransform(smoothProgress, [0, 0.5, 1], [0, 0.18, 0]), backgroundImage: "radial-gradient(circle at center, rgba(99,102,241,1), transparent 70%)" }}
        />

        {/* --- EXTREME DEEP EDGE SWARM --- */}
        {/* Trail Immediate Left Flank */}
        <motion.div className="absolute w-[180px] h-[180px] rounded-full blur-[60px] transform-gpu left-[42%]" style={{ top: glowTop27, opacity: useTransform(smoothProgress, [0, 0.5, 1], [0, 0.4, 0]), backgroundImage: "radial-gradient(circle at center, rgba(99,102,241,1), transparent 60%)" }} />
        <motion.div className="absolute w-[120px] h-[120px] rounded-full blur-[40px] transform-gpu left-[35%]" style={{ top: glowTop28, opacity: useTransform(smoothProgress, [0, 0.5, 1], [0, 0.5, 0]), backgroundImage: "radial-gradient(circle at center, rgba(99,102,241,1), transparent 50%)" }} />
        <motion.div className="absolute w-[80px] h-[80px] rounded-full blur-[25px] transform-gpu left-[46%]" style={{ top: glowTop29, opacity: useTransform(smoothProgress, [0, 0.5, 1], [0, 0.7, 0]), backgroundImage: "radial-gradient(circle at center, rgba(99,102,241,1), transparent 60%)" }} />
        <motion.div className="absolute w-[220px] h-[220px] rounded-full blur-[80px] transform-gpu left-[38%]" style={{ top: glowTop30, opacity: useTransform(smoothProgress, [0, 0.5, 1], [0, 0.3, 0]), backgroundImage: "radial-gradient(circle at center, rgba(99,102,241,1), transparent 70%)" }} />
        <motion.div className="absolute w-[60px] h-[60px] rounded-full blur-[20px] transform-gpu left-[47%]" style={{ top: glowTop31, opacity: useTransform(smoothProgress, [0, 0.5, 1], [0, 0.8, 0]), backgroundImage: "radial-gradient(circle at center, rgba(99,102,241,1), transparent 50%)" }} />
        <motion.div className="absolute w-[300px] h-[300px] rounded-full blur-[100px] transform-gpu left-[30%]" style={{ top: glowTop32, opacity: useTransform(smoothProgress, [0, 0.5, 1], [0, 0.25, 0]), backgroundImage: "radial-gradient(circle at center, rgba(99,102,241,1), transparent 80%)" }} />
        <motion.div className="absolute w-[150px] h-[150px] rounded-full blur-[50px] transform-gpu left-[44%]" style={{ top: glowTop33, opacity: useTransform(smoothProgress, [0, 0.5, 1], [0, 0.45, 0]), backgroundImage: "radial-gradient(circle at center, rgba(99,102,241,1), transparent 60%)" }} />
        <motion.div className="absolute w-[40px] h-[40px] rounded-full blur-[10px] transform-gpu left-[37%]" style={{ top: glowTop34, opacity: useTransform(smoothProgress, [0, 0.5, 1], [0, 0.9, 0]), backgroundImage: "radial-gradient(circle at center, rgba(99,102,241,1), transparent 50%)" }} />
        <motion.div className="absolute w-[100px] h-[100px] rounded-full blur-[30px] transform-gpu left-[41%]" style={{ top: glowTop35, opacity: useTransform(smoothProgress, [0, 0.5, 1], [0, 0.55, 0]), backgroundImage: "radial-gradient(circle at center, rgba(99,102,241,1), transparent 50%)" }} />
        <motion.div className="absolute w-[250px] h-[250px] rounded-full blur-[80px] transform-gpu left-[33%]" style={{ top: glowTop36, opacity: useTransform(smoothProgress, [0, 0.5, 1], [0, 0.35, 0]), backgroundImage: "radial-gradient(circle at center, rgba(99,102,241,1), transparent 70%)" }} />

        {/* Far Left Gutter */}
        <motion.div className="absolute w-[400px] h-[400px] rounded-full blur-[120px] transform-gpu left-[-15%]" style={{ top: glowTop13, opacity: useTransform(smoothProgress, [0, 0.5, 1], [0, 0.12, 0]), backgroundImage: "radial-gradient(circle at center, rgba(99,102,241,1), transparent 80%)" }} />
        <motion.div className="absolute w-[20px] h-[20px] rounded-full blur-[5px] transform-gpu left-[2%]" style={{ top: glowTop14, opacity: useTransform(smoothProgress, [0, 0.5, 1], [0, 0.8, 0]), backgroundImage: "radial-gradient(circle at center, rgba(99,102,241,1), transparent 50%)" }} />
        <motion.div className="absolute w-[120px] h-[120px] rounded-full blur-[40px] transform-gpu left-[12%]" style={{ top: glowTop15, opacity: useTransform(smoothProgress, [0, 0.5, 1], [0, 0.2, 0]), backgroundImage: "radial-gradient(circle at center, rgba(99,102,241,1), transparent 60%)" }} />
        <motion.div className="absolute w-[70px] h-[70px] rounded-full blur-[20px] transform-gpu left-[-5%]" style={{ top: glowTop16, opacity: useTransform(smoothProgress, [0, 0.5, 1], [0, 0.35, 0]), backgroundImage: "radial-gradient(circle at center, rgba(99,102,241,1), transparent 50%)" }} />

        {/* Far Right Gutter */}
        <motion.div className="absolute w-[450px] h-[450px] rounded-full blur-[130px] transform-gpu right-[-20%]" style={{ top: glowTop17, opacity: useTransform(smoothProgress, [0, 0.5, 1], [0, 0.1, 0]), backgroundImage: "radial-gradient(circle at center, rgba(99,102,241,1), transparent 80%)" }} />
        <motion.div className="absolute w-[25px] h-[25px] rounded-full blur-[6px] transform-gpu right-[8%]" style={{ top: glowTop18, opacity: useTransform(smoothProgress, [0, 0.5, 1], [0, 0.6, 0]), backgroundImage: "radial-gradient(circle at center, rgba(99,102,241,1), transparent 50%)" }} />
        <motion.div className="absolute w-[140px] h-[140px] rounded-full blur-[45px] transform-gpu right-[18%]" style={{ top: glowTop19, opacity: useTransform(smoothProgress, [0, 0.5, 1], [0, 0.22, 0]), backgroundImage: "radial-gradient(circle at center, rgba(99,102,241,1), transparent 60%)" }} />
        <motion.div className="absolute w-[60px] h-[60px] rounded-full blur-[15px] transform-gpu right-[-2%]" style={{ top: glowTop20, opacity: useTransform(smoothProgress, [0, 0.5, 1], [0, 0.4, 0]), backgroundImage: "radial-gradient(circle at center, rgba(99,102,241,1), transparent 60%)" }} />

      </motion.div>
      
      <div className="max-w-5xl mx-auto px-4 lg:px-8 relative z-10 mb-16 md:mb-32 text-center">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.15 } } }}>
          <motion.div variants={FADE_UP_ANIMATION_VARIANTS} className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#050608] rounded-full mb-6 border-2 border-white/10 shadow-[4px_4px_0_rgba(99,102,241,0.5)] font-black uppercase tracking-widest text-white">
            <Zap className="h-4 w-4 text-indigo-400" />
            <span className="text-[11px] font-black text-white/90">How It Works</span>
          </motion.div>
          <motion.h2 variants={FADE_UP_ANIMATION_VARIANTS} className="text-4xl md:text-5xl lg:text-7xl font-black tracking-[-0.03em] mb-6 text-white">
            Simple But <br />Powerful Flow.
          </motion.h2>
          <motion.p variants={FADE_UP_ANIMATION_VARIANTS} className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto font-bold tracking-tight">
            A seamless, cryptographic pipeline that converts raw data into immutable on-chain proof.
          </motion.p>
        </motion.div>
      </div>

      <div ref={containerRef} className="max-w-5xl mx-auto relative w-full h-[2000px] hidden md:block">
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
          <defs>
            <linearGradient id="energyPathGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="30%" stopColor="rgba(99,102,241,0.3)" />
              <stop offset="60%" stopColor="rgba(99,102,241,1)" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>
          {/* Base Faint Track */}
          <path d="M 20 0 L 20 15 C 20 25, 80 25, 80 35 L 80 40 C 80 50, 20 50, 20 60 L 20 65 C 20 75, 80 75, 80 85 L 80 100" fill="none" stroke="rgba(99,102,241,0.1)" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />

          {/* 💥 Step 1a: Accelerated Dashed Energy Flow */}
          <motion.path
            d="M 20 0 L 20 15 C 20 25, 80 25, 80 35 L 80 40 C 80 50, 20 50, 20 60 L 20 65 C 20 75, 80 75, 80 85 L 80 100"
            fill="none"
            stroke="rgba(99,102,241,0.5)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            style={{
              strokeDasharray: "8 12",
              strokeDashoffset: dashOffset
            }}
          />

          {/* 💥 Step 1b: Directional Smooth Progress Flow */}
          <motion.path
            d="M 20 0 L 20 15 C 20 25, 80 25, 80 35 L 80 40 C 80 50, 20 50, 20 60 L 20 65 C 20 75, 80 75, 80 85 L 80 100"
            fill="none"
            stroke="url(#energyPathGradient)"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            style={{ pathLength: smoothProgress }}
          />
        </svg>
        <TimelineNodeWrapper scrollYProgress={smoothProgress} threshold={0.125} top="12.5%" side="left" number="1" title="Grant Permission" desc="Define exactly what data, who can access it, and for how long securely from your dashboard." type="apply" />
        <TimelineNodeWrapper scrollYProgress={smoothProgress} threshold={0.375} top="37.5%" side="right" number="2" title="Convert to Proof" desc="Your consent becomes an encrypted, verifiable cryptographic hash ensuring zero-knowledge privacy." type="match" />
        <TimelineNodeWrapper scrollYProgress={smoothProgress} threshold={0.625} top="62.5%" side="left" number="3" title="Controlled Access" desc="Organizations fetch metadata but can only access the raw payload if the hash aligns with constraints." type="execute" />
        <TimelineNodeWrapper scrollYProgress={smoothProgress} threshold={0.875} top="87.5%" side="right" number="4" title="Verify On-Chain" desc="The entire interaction is verified and recorded on the Algorand ledger, establishing absolute trust." type="reward" />
      </div>

      <div className="max-w-2xl mx-auto px-4 w-full relative block md:hidden space-y-12 mt-16">
        <div className="absolute left-[34px] top-0 bottom-0 w-1 bg-indigo-500/20 rounded-full" />
        <MobileTimelineNode number="1" title="Grant Permission" desc="Define exactly what data, who can access it, and for how long securely from your dashboard." type="apply" />
        <MobileTimelineNode number="2" title="Convert to Proof" desc="Your consent becomes an encrypted, verifiable cryptographic hash ensuring zero-knowledge privacy." type="match" />
        <MobileTimelineNode number="3" title="Controlled Access" desc="Organizations fetch metadata but can only access the raw payload if the hash aligns with constraints." type="execute" />
        <MobileTimelineNode number="4" title="Verify On-Chain" desc="The entire interaction is verified and recorded on the Algorand ledger, establishing absolute trust." type="reward" />
      </div>
    </motion.section>
  );
}
