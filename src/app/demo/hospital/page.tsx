'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { ConsentChainSDK } from '@/lib/sdk/core';
import { algodClient, indexerClient } from '@/lib/algorand';
import { Shield, Lock, CheckCircle, Activity, FileText, User, Search, Play, AlertCircle, X, Key, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getPatientIdentity } from '@/lib/demoUtils';
import ConsentWidget from '@/components/ConsentWidget';

const APP_ID = parseInt(process.env.NEXT_PUBLIC_APP_ID || '758027210', 10);

export default function HospitalPortal() {
  const [isLocked, setIsLocked] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [userAddress, setUserAddress] = useState('');
  const [status, setStatus] = useState<'idle' | 'verified' | 'denied'>('idle');
  const [sentinelActive, setSentinelActive] = useState(false);
  const [activeTab, setActiveTab] = useState<'records' | 'vitals' | 'prescriptions'>('records');
  const [showGrantWidget, setShowGrantWidget] = useState(false);

  const sdk = useMemo(() => new ConsentChainSDK(algodClient, indexerClient, APP_ID), []);
  const ORG_ID = 'health-vault-demo';

  // Listen for Sentinel Extension signals
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Only accept messages from our own origin
      if (event.origin !== window.location.origin) return;

      if (event.data?.type === 'CONSENT_CHALLENGE') {
        const { nonce } = event.data;
        setSentinelActive(true);
        // Reply with ACK and the nonce
        window.postMessage({ type: 'CONSENT_ACK', nonce }, window.location.origin);
      }
      
      // Extension sends SENTINEL_HANDSHAKE with { verified, orgId, address }
      if (event.data?.type === 'SENTINEL_HANDSHAKE' && event.data?.verified) {
        setUserAddress(event.data.address || ''); // Sync context with extension identity
        setIsLocked(false);
        setStatus('verified');
        setSentinelActive(true);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleManualVerify = async () => {
    if (!userAddress) return;
    setIsVerifying(true);
    try {
      const result = await sdk.verifyConsent(userAddress, ORG_ID);
      if (result.isActive) {
        setIsLocked(false);
        setStatus('verified');
      } else {
        setStatus('denied');
      }
    } catch (error) {
      console.error('Verification failed', error);
      setStatus('denied');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleGrantSuccess = () => {
    setShowGrantWidget(false);
    setIsLocked(false);
    setStatus('verified');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-sky-100">
      {/* Premium Header */}
      <nav className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-sky-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-sky-200">
            <Activity size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800">St. Mary's Digital Health</h1>
            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold leading-tight">Patient Portal Central</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-1 text-slate-500 text-sm font-medium">
            <Search size={16} />
            <span>Search Records</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full border border-slate-200">
            <User size={16} className="text-slate-400" />
            <span className="text-xs font-semibold text-slate-600">Dr. Sarah Jenkins</span>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar Navigation */}
        <aside className="lg:col-span-3 space-y-2">
          <button 
            onClick={() => setActiveTab('records')}
            className={`w-full text-left p-4 rounded-2xl flex items-center gap-3 transition-all ${activeTab === 'records' ? 'bg-sky-500 text-white shadow-md shadow-sky-100' : 'hover:bg-white hover:shadow-sm text-slate-500'}`}
          >
            <FileText size={20} />
            <span className="font-semibold">Patient Records</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('vitals')}
            className={`w-full text-left p-4 rounded-2xl flex items-center gap-3 transition-all ${activeTab === 'vitals' ? 'bg-sky-500 text-white shadow-md shadow-sky-100' : 'hover:bg-white hover:shadow-sm text-slate-500'}`}
          >
            <Activity size={20} />
            <span className="font-medium">Vitals History</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('prescriptions')}
            className={`w-full text-left p-4 rounded-2xl flex items-center gap-3 transition-all ${activeTab === 'prescriptions' ? 'bg-sky-500 text-white shadow-md shadow-sky-100' : 'hover:bg-white hover:shadow-sm text-slate-500'}`}
          >
            <AlertCircle size={20} />
            <span className="font-medium">Prescriptions</span>
          </button>
          
          <div className="mt-12 p-6 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
              <Shield size={80} />
            </div>
            <h3 className="text-sm font-bold mb-2">ConsentChain Protection</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">Your records are protected. Access requires on-chain verification.</p>
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${sentinelActive ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-700 text-slate-400'}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${sentinelActive ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
              {sentinelActive ? 'Sentinel Active' : 'Sentinel Inactive'}
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <div className="lg:col-span-9 space-y-6">
          <header className="flex justify-between items-end mb-4">
            <div>
              <h2 className="text-3xl font-black text-slate-800 mb-2">
                {activeTab === 'records' && "Health Records"}
                {activeTab === 'vitals' && "Physiological Monitor"}
                {activeTab === 'prescriptions' && "Pharmacy Enclave"}
              </h2>
              <p className="text-slate-500 max-w-lg">
                {activeTab === 'records' && "Access encrypted patient historical data, lab results, and genomic signatures."}
                {activeTab === 'vitals' && "Real-time telemetry and historically significant vitals synced from internal blockchain state."}
                {activeTab === 'prescriptions' && "Verified medication history and dispensing logs secured via ConsentChain."}
              </p>
            </div>
            {status === 'verified' && (
              <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100 animate-in fade-in slide-in-from-right-4 duration-500">
                <CheckCircle size={18} />
                <span className="text-sm font-bold uppercase tracking-tight">On-Chain Verified</span>
              </div>
            )}
          </header>

          {isLocked ? (
            <div className="relative rounded-3xl overflow-hidden border border-slate-200 bg-white min-h-[500px] flex flex-col items-center justify-center p-12 shadow-xl shadow-slate-200/50">
              {/* Mock Blurred Content */}
              <div className="absolute inset-0 opacity-10 pointer-events-none select-none filter blur-md p-12 space-y-8">
                <div className="h-8 w-1/3 bg-slate-300 rounded-lg" />
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-32 bg-slate-200 rounded-2xl" />
                  <div className="h-32 bg-slate-200 rounded-2xl" />
                  <div className="h-32 bg-slate-200 rounded-2xl" />
                </div>
                <div className="h-64 bg-slate-100 rounded-3xl" />
              </div>

              {/* Lock Overlay */}
              <div className="relative z-10 w-full max-w-md text-center space-y-8">
                <div className="relative inline-block">
                  <div className="w-24 h-24 bg-sky-50 rounded-[40%] flex items-center justify-center text-sky-500 animate-bounce transition-all duration-1000">
                    <Lock size={40} />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-amber-500 rounded-full border-2 border-white flex items-center justify-center text-white">
                    <Shield size={12} fill="currentColor" />
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-slate-800 tracking-tight">Access Restricted</h3>
                  <p className="text-slate-500 leading-relaxed">Please provide the patient's wallet address to verify on-chain medical consent.</p>
                </div>

                <div className="space-y-4">
                  <div className="relative group">
                    <input 
                      type="text" 
                      placeholder="Enter Patient Address (0x... or Algorand)"
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 transition-all outline-none font-mono text-sm group-hover:bg-white"
                      value={userAddress}
                      onChange={(e) => setUserAddress(e.target.value)}
                    />
                    {status === 'denied' && (
                      <div className="mt-4 space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                        <p className="text-xs text-rose-500 font-semibold flex items-center gap-1 justify-center animate-shake">
                          <AlertCircle size={12} /> Verification failed. No consent found.
                        </p>
                        
                        <button 
                          onClick={() => setShowGrantWidget(true)}
                          className="w-full group flex items-center justify-between p-4 bg-sky-50 border border-sky-100 rounded-2xl hover:bg-sky-100 transition-all"
                        >
                          <div className="flex items-center gap-3 text-left">
                            <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-600">
                              <Key size={16} />
                            </div>
                            <div>
                              <p className="text-xs font-black text-slate-800">GRANT ACCESS</p>
                              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Issue Digital Medical Release</p>
                            </div>
                          </div>
                          <ArrowRight size={16} className="text-slate-300 group-hover:text-sky-500 transition-colors" />
                        </button>
                      </div>
                    )}
                  </div>

                  <button 
                    onClick={handleManualVerify}
                    disabled={isVerifying || !userAddress}
                    className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 shadow-lg shadow-slate-200"
                  >
                    {isVerifying ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Verifying Blockchain...
                      </>
                    ) : (
                      <>
                        <Shield size={20} />
                        Verify Permission
                      </>
                    )}
                  </button>
                  
                  <div className="pt-4 flex items-center justify-center gap-3">
                    <div className="h-[1px] flex-grow bg-slate-200" />
                    <span className="text-[10px] uppercase font-black text-slate-300 tracking-widest">or</span>
                    <div className="h-[1px] flex-grow bg-slate-200" />
                  </div>
                  
                  <p className="text-[11px] text-slate-400 font-medium">
                    Install <span className="text-sky-500 font-bold">Sentinel Extension</span> for <span className="text-slate-700 font-bold underline decoration-sky-300">Automated One-Click Access</span>.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xl shadow-slate-200/40 animate-in zoom-in-95 duration-700 relative overflow-hidden">
               {/* Decorative background */}
               <div className="absolute top-0 right-0 w-64 h-64 bg-sky-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-50" />
               
               <div className="relative z-10">
                  {/* Identity Header */}
                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-white rounded-2xl border border-slate-200 flex items-center justify-center text-slate-300">
                        <User size={32} />
                      </div>
                      <div>
                        {/* Dynamic Identity seeded from User Address */}
                        <p className="text-lg font-bold text-slate-800 uppercase tracking-tight">
                          {userAddress ? getPatientIdentity(userAddress).name : "Unknown Subject"}
                        </p>
                        <p className="text-sm text-slate-500 font-mono tracking-tighter">
                          {userAddress ? getPatientIdentity(userAddress).id : "#00000"} • Patient Identity Verified
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Blood Type</p>
                        <p className="font-black text-sky-500 italic">{userAddress ? getPatientIdentity(userAddress).bloodType : "--"}</p>
                      </div>
                      <div className="text-right border-l border-slate-200 pl-6">
                        <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">D.O.B</p>
                        <p className="font-bold text-slate-700">{userAddress ? getPatientIdentity(userAddress).dob : "--"}</p>
                      </div>
                    </div>
                  </div>

                  <AnimatePresence mode="wait">
                    {activeTab === 'records' && (
                      <motion.div 
                        key="records" 
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-8"
                      >
                        <section className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100 text-emerald-900">
                          <div className="flex justify-between items-start mb-4">
                            <h4 className="text-xs uppercase font-black opacity-60 tracking-widest">Active Vitals</h4>
                            <Activity size={16} className="text-emerald-500" />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-2xl font-black italic">72 <span className="text-[10px] font-bold not-italic font-sans opacity-50">BPM</span></p>
                              <p className="text-[10px] font-bold uppercase opacity-40 leading-none">Heart Rate</p>
                            </div>
                            <div>
                              <p className="text-2xl font-black italic">98.6 <span className="text-[10px] font-bold not-italic font-sans opacity-50">°F</span></p>
                              <p className="text-[10px] font-bold uppercase opacity-40 leading-none">Temperature</p>
                            </div>
                          </div>
                        </section>

                        <section className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
                           <h4 className="text-xs uppercase font-black text-slate-400 tracking-widest mb-4">Upcoming Appointments</h4>
                           <div className="space-y-3">
                             {[1, 2].map(i => (
                               <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                                  <div className="flex flex-col">
                                    <span className="text-sm font-bold text-slate-700">MRI Cardiovascular</span>
                                    <span className="text-[10px] text-slate-400 font-medium italic">Oct 12, 2026 • 10:30 AM</span>
                                  </div>
                                  <Play size={12} className="text-sky-500 fill-sky-500" />
                               </div>
                             ))}
                           </div>
                        </section>
                      </motion.div>
                    )}

                    {activeTab === 'vitals' && (
                      <motion.div 
                        key="vitals" 
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                      >
                        <div className="p-8 bg-slate-900 rounded-3xl border border-white/5 text-white flex flex-col items-center justify-center min-h-[300px] overflow-hidden relative">
                           <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_0)] [background-size:20px_20px]" />
                           <Activity size={48} className="text-sky-400 mb-6 animate-pulse" />
                           <h4 className="text-xl font-black tracking-widest uppercase mb-2">Telemetry Online</h4>
                           <p className="text-sky-300/50 text-xs font-mono uppercase tracking-tighter">SECURE WEARABLE SYNC ESTABLISHED</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                           <div className="p-6 bg-white border border-slate-100 rounded-2xl shadow-sm">
                             <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Glucose Level</p>
                             <p className="text-3xl font-black text-slate-800">94 <span className="text-xs font-medium text-slate-400">mg/dL</span></p>
                           </div>
                           <div className="p-6 bg-white border border-slate-100 rounded-2xl shadow-sm">
                             <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Oxygen (SpO2)</p>
                             <p className="text-3xl font-black text-slate-800">98 <span className="text-xs font-medium text-slate-400">%</span></p>
                           </div>
                           <div className="p-6 bg-white border border-slate-100 rounded-2xl shadow-sm">
                             <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Sleep Score</p>
                             <p className="text-3xl font-black text-sky-500">88 <span className="text-xs font-medium text-slate-400">/ 100</span></p>
                           </div>
                        </div>
                      </motion.div>
                    )}

                    {activeTab === 'prescriptions' && (
                      <motion.div 
                        key="prescriptions" 
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                        className="space-y-4"
                      >
                         {[
                           { name: "Lisinopril Hub-A", dose: "10mg Tablet, Once Daily", type: "Cardio" },
                           { name: "Metformin Enclave", dose: "500mg, Twice Daily", type: "Metabolic" },
                           { name: "Atorvastatin Sync", dose: "20mg, Evening", type: "Lipid" }
                         ].map((med, i) => (
                           <div key={i} className="p-5 bg-white border border-slate-100 rounded-2xl flex justify-between items-center group hover:border-sky-200 transition-all">
                             <div className="flex items-center gap-4">
                               <div className="w-10 h-10 bg-sky-50 rounded-xl flex items-center justify-center text-sky-500 group-hover:bg-sky-500 group-hover:text-white transition-all">
                                 <AlertCircle size={20} />
                               </div>
                               <div>
                                 <p className="text-sm font-black text-slate-800 uppercase tracking-tight">{med.name}</p>
                                 <p className="text-xs text-slate-500 font-medium">{med.dose}</p>
                               </div>
                             </div>
                             <div className="text-right">
                               <span className="text-[10px] font-black text-slate-400 uppercase border border-slate-200 px-3 py-1 rounded-full">{med.type}</span>
                             </div>
                           </div>
                         ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
               </div>
            </div>
          )}
        </div>
      </main>

      {/* Styled toast for verification */}
      <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out 0s 2;
        }
      `}</style>

      {/* Grant Consent Modal/Overlay */}
      {showGrantWidget && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setShowGrantWidget(false)} />
          
          <div className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="absolute top-0 right-0 p-8 z-10">
              <button 
                onClick={() => setShowGrantWidget(false)}
                className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-800 transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-12">
              <div className="mb-8">
                <h3 className="text-2xl font-black text-slate-800 tracking-tighter mb-2">GRANT MEDICAL ACCESS</h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">You are issuing a decentralized medical consent for St. Mary's Digital Health.</p>
              </div>

              <div className="bg-slate-50 rounded-3xl border border-slate-100 p-1">
                 <ConsentWidget 
                   orgId={ORG_ID} 
                   onSuccess={handleGrantSuccess}
                 />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
