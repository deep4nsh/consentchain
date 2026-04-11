import React from 'react';
import { Shield } from 'lucide-react';

export default function PartnersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#07090d] text-slate-100 font-sans selection:bg-blue-500/30">
      {/* Partner Brand Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 border-b border-white/5 bg-[#07090d]/80 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight text-white shrink-0">Partner Portal <span className="text-gray-500 font-normal ml-2 hidden sm:inline">Secure Access</span></span>
          
          {/* Portal Switcher */}
          <div className="ml-8 flex items-center bg-white/5 p-1 rounded-xl border border-white/10 self-center">
            <a 
              href="/partners/metafinance" 
              className="px-4 py-1.5 rounded-lg text-xs font-bold transition-all hover:bg-white/5 active:scale-95 text-emerald-500"
            >
              Meta Finance
            </a>
          </div>
        </div>
        
        <div className="flex items-center space-x-4 text-sm text-gray-400">
          <div className="hidden lg:flex items-center px-4 py-1.5 rounded-xl bg-white/[0.03] border border-white/5 text-[10px] font-bold uppercase tracking-widest text-gray-500">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2 animate-pulse"></span>
            Protocol v1.0 Active
          </div>
          <span className="flex items-center px-3 py-1.5 rounded-xl bg-green-500/10 text-green-400 border border-green-500/20 text-xs font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 mr-2"></span>
            Testnet Mode
          </span>
          <a href="/" className="hover:text-white transition-colors font-bold text-xs">Exit Portal</a>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="pt-24 pb-12">
        {children}
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-white/5 text-center text-xs text-gray-600">
        <p>© 2026 Secured by <span className="font-semibold text-gray-400">ConsentChain Protocol v1.0</span></p>
      </footer>
    </div>
  );
}
