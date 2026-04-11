'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { ConsentChainSDK } from '@/lib/sdk/core';
import { algodClient, indexerClient } from '@/lib/algorand';
import { Shield, Lock, CheckCircle, CreditCard, PieChart, TrendingUp, History, User, Search, Fingerprint, AlertTriangle } from 'lucide-react';

const APP_ID = parseInt(process.env.NEXT_PUBLIC_APP_ID || '758027210', 10);

export default function BankPortal() {
  const [isLocked, setIsLocked] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [userAddress, setUserAddress] = useState('');
  const [status, setStatus] = useState<'idle' | 'verified' | 'denied'>('idle');
  const [sentinelActive, setSentinelActive] = useState(false);

  const sdk = useMemo(() => new ConsentChainSDK(algodClient, indexerClient, APP_ID), []);
  const ORG_ID = 'finsentinel-demo';

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Only accept messages from our own origin
      if (event.origin !== window.location.origin) return;

      if (event.data?.type === 'CONSENT_CHALLENGE') {
        setSentinelActive(true);
      }
      
      // Extension sends SENTINEL_HANDSHAKE with { verified, orgId, address }
      if (event.data?.type === 'SENTINEL_HANDSHAKE' && event.data?.verified) {
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

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-emerald-500/30">
      {/* Sleek Dark Header */}
      <nav className="bg-[#020617]/80 backdrop-blur-xl border-b border-white/5 px-8 py-5 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-tr from-emerald-600 to-teal-400 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-emerald-500/20 rotate-3 group-hover:rotate-0 transition-transform">
            <Fingerprint size={28} />
          </div>
          <div>
            <h1 className="text-xl font-black italic tracking-tighter text-white">META FINANCE</h1>
            <p className="text-[10px] uppercase tracking-[0.3em] text-emerald-500 font-black leading-tight">Private Tier Banking</p>
          </div>
        </div>
        
        <div className="flex items-center gap-8">
          <div className="hidden lg:flex items-center gap-6 text-sm font-bold text-slate-400">
            <span className="hover:text-emerald-400 cursor-pointer transition-colors">Portfolios</span>
            <span className="hover:text-emerald-400 cursor-pointer transition-colors">Yield Terminal</span>
            <span className="hover:text-emerald-400 cursor-pointer transition-colors">Vaults</span>
          </div>
          <div className="h-8 w-[1px] bg-white/10" />
          <div className="flex items-center gap-3 px-5 py-2.5 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all cursor-pointer">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold tracking-wide">0x992...F2C1</span>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-8 lg:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Context */}
          <div className="lg:col-span-4 space-y-12">
            <div className="space-y-4">
              <h2 className="text-5xl font-black leading-tight tracking-tighter bg-gradient-to-br from-white to-slate-500 bg-clip-text text-transparent">
                Secure Ledger <br /> Access.
              </h2>
              <p className="text-slate-400 text-lg font-medium leading-relaxed">
                Unlock your institutional-grade transaction logs and derivative positions via de-centralized consent verification.
              </p>
            </div>

            <div className="p-8 bg-gradient-to-br from-slate-900 to-[#020617] rounded-[2rem] border border-white/5 relative overflow-hidden group">
               <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all" />
               <Shield size={32} className="text-emerald-500 mb-6" />
               <h3 className="text-lg font-bold mb-3 text-white">Zero-Knowledge Protocol</h3>
               <p className="text-sm text-slate-400 leading-relaxed mb-6">Your financial fingerprint remains private. We only verify the on-chain permission hash.</p>
               
               <div className={`flex items-center gap-3 p-4 rounded-2xl ${sentinelActive ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-slate-800/50 border border-white/5'}`}>
                  <div className={`w-3 h-3 rounded-full ${sentinelActive ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]' : 'bg-slate-600'}`} />
                  <span className={`text-xs font-black tracking-widest uppercase ${sentinelActive ? 'text-emerald-400' : 'text-slate-500'}`}>
                    {sentinelActive ? 'Sentinel Protection: ACTIVE' : 'Sentinel Protection: OFFLINE'}
                  </span>
               </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                 <div className="p-6 bg-white/5 rounded-3xl border border-white/10 hover:border-emerald-500/30 transition-all">
                    <TrendingUp size={20} className="text-emerald-500 mb-2" />
                    <p className="text-2xl font-black text-white">+12.4%</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Portfolio 24h</p>
                 </div>
                 <div className="p-6 bg-white/5 rounded-3xl border border-white/10 hover:border-amber-500/30 transition-all">
                    <PieChart size={20} className="text-amber-500 mb-2" />
                    <p className="text-2xl font-black text-white">0.02</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Risk Index</p>
                 </div>
            </div>
          </div>

          {/* Right Column: Portal Content */}
          <div className="lg:col-span-8">
            {isLocked ? (
              <div className="bg-gradient-to-b from-slate-900/50 to-transparent rounded-[3rem] border border-white/10 p-1 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
                <div className="bg-[#020617] rounded-[2.8rem] p-12 lg:p-16 flex flex-col items-center justify-center min-h-[600px] border border-white/5 shadow-2xl relative overflow-hidden">
                  
                  {/* Digital Grid Backdrop */}
                  <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#1e293b 1px, transparent 0)', backgroundSize: '40px 40px' }} />
                  
                  <div className="relative z-10 w-full max-w-sm text-center space-y-10">
                    <div className="relative inline-block group">
                      <div className="w-24 h-24 bg-emerald-500/10 border border-emerald-500/20 rounded-3xl rotate-45 flex items-center justify-center text-emerald-500 group-hover:rotate-0 transition-all duration-700">
                        <Lock size={40} className="-rotate-45 group-hover:rotate-0 transition-transform duration-700" />
                      </div>
                      <div className="absolute -top-4 -right-4 w-12 h-12 bg-[#020617] border border-white/10 rounded-2xl flex items-center justify-center text-amber-500 animate-pulse">
                        <Shield size={20} />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-3xl font-black text-white tracking-tighter">AUTHENTICATION REQUIRED</h3>
                      <p className="text-slate-500 font-medium">Data transmission is halted. Please authenticate via the ConsentChain protocol to decrypt logs.</p>
                    </div>

                    <div className="space-y-6">
                      <div className="relative">
                        <input 
                          type="text" 
                          placeholder="Client Identity Address"
                          className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-3xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none font-mono text-sm text-center placeholder:text-slate-700 hover:bg-white/10"
                          value={userAddress}
                          onChange={(e) => setUserAddress(e.target.value)}
                        />
                        {status === 'denied' && (
                          <div className="mt-4 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl animate-shake">
                            <p className="text-xs text-rose-500 font-black flex items-center gap-2 justify-center italic">
                              <AlertTriangle size={14} /> SECURITY CLEARANCE DENIED: NO ON-CHAIN RECORD FOUND
                            </p>
                          </div>
                        )}
                      </div>

                      <button 
                        onClick={handleManualVerify}
                        disabled={isVerifying || !userAddress}
                        className="w-full bg-white text-[#020617] py-5 rounded-3xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-emerald-400 hover:scale-[1.02] transition-all disabled:opacity-20 disabled:scale-100 shadow-[0_20px_40px_rgba(255,255,255,0.1)] active:scale-95"
                      >
                        {isVerifying ? (
                          <>
                            <div className="w-5 h-5 border-4 border-[#020617]/20 border-t-[#020617] rounded-full animate-spin" />
                            Decrypting...
                          </>
                        ) : (
                          <>
                            <CreditCard size={20} />
                            Initiate Access
                          </>
                        )}
                      </button>
                      
                      <div className="pt-6">
                        <p className="text-[10px] text-slate-600 font-black tracking-widest uppercase">
                          Passive Scanning Enabled via <span className="text-emerald-500 underline decoration-emerald-800/50">Sentinel V3 Extension</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-1000">
                 {/* Premium Header after Unlock */}
                 <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-3">
                         <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500" />
                         <div>
                            <p className="text-sm font-black text-white">VIP CLEARANCE</p>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Lvl 4 Access Granted</p>
                         </div>
                      </div>
                    </div>
                    {status === 'verified' && (
                      <div className="flex items-center gap-3 px-6 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                         <CheckCircle size={20} className="text-emerald-500" />
                         <span className="text-sm font-black text-emerald-400 tracking-tighter uppercase italic">Verified On-Chain</span>
                      </div>
                    )}
                 </div>

                 {/* Transaction Table */}
                 <div className="bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden backdrop-blur-sm">
                    <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                       <h4 className="flex items-center gap-3 font-black tracking-tighter text-xl">
                          <History size={20} className="text-emerald-500" />
                          TRANSACTION LEDGER
                       </h4>
                       <span className="text-xs font-bold text-slate-500 bg-white/5 px-4 py-2 rounded-full border border-white/10 tracking-widest">OCT 2026</span>
                    </div>
                    <div className="p-4">
                       {[
                         { title: 'Global Equity Buy', amount: '-$12,402.00', date: 'Oct 04, 14:22', status: 'Completed' },
                         { title: 'Custodial Inflow', amount: '+$405,000.00', date: 'Oct 03, 09:15', status: 'Verified' },
                         { title: 'Vault Sweeping', amount: '-$1,200.00', date: 'Oct 01, 18:45', status: 'Legacy' },
                         { title: 'Dividend Auto-Collect', amount: '+$482.90', date: 'Sept 28, 12:00', status: 'Completed' },
                       ].map((tx, i) => (
                         <div key={i} className="flex items-center justify-between p-6 hover:bg-white/[0.03] transition-colors rounded-3xl group border-l-4 border-transparent hover:border-emerald-500">
                            <div className="flex items-center gap-5">
                               <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-white transition-colors">
                                  {tx.amount.startsWith('+') ? <TrendingUp size={20} /> : <CreditCard size={20} />}
                               </div>
                               <div>
                                  <p className="text-base font-bold text-white tracking-tight">{tx.title}</p>
                                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{tx.date}</p>
                               </div>
                            </div>
                            <div className="text-right">
                               <p className={`text-lg font-black tracking-tighter ${tx.amount.startsWith('+') ? 'text-emerald-400' : 'text-white'}`}>{tx.amount}</p>
                               <span className="text-[10px] text-slate-500 font-bold bg-white/5 px-2 py-0.5 rounded border border-white/5 uppercase tracking-tighter font-mono">{tx.status}</span>
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-6px); }
          75% { transform: translateX(6px); }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out 0s 2;
        }
      `}</style>
    </div>
  );
}
