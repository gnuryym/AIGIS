import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router';
import {
  Wallet,
  ShieldCheck,
  Activity,
  AlertTriangle,
  ArrowRightLeft,
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { DemoControls, GaugeChart } from '../components/SharedComponents';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function EarnPage() {
  const { isAttackMode, setIsAttackMode } = useOutletContext<{ isAttackMode: boolean, setIsAttackMode: (v: boolean) => void }>();
  const [userBalance, setUserBalance] = useState(0);
  const [attackProgress, setAttackProgress] = useState(0);

  // Simulate gauge movement during attack
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isAttackMode) {
      interval = setInterval(() => {
        setAttackProgress((prev) => {
          if (prev >= 1) {
            clearInterval(interval);
            return 1;
          }
          return prev + 0.05; // Fast spike
        });
      }, 50);
    } else {
      setAttackProgress(0);
    }
    return () => clearInterval(interval);
  }, [isAttackMode]);

  const handleDeposit = () => setUserBalance(prev => prev + 100);
  const handleWithdraw = () => setUserBalance(prev => Math.max(0, prev - 100));

  return (
    <main className="flex-1 flex flex-col lg:flex-row gap-8 p-6 lg:p-8 mt-4 lg:mt-8">
      {/* Left Column (Primary Content) */}
      <div className="flex-1 flex flex-col gap-6 w-full overflow-hidden">
        
        {/* Page Header & Notification */}
        <header className="flex flex-col gap-4 mb-2">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl md:text-4xl font-semibold text-white tracking-tight">
              AIGIS Secured Earn
            </h1>
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1A1A1A] border border-white/5 text-sm font-medium ml-auto">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Market Data
            </div>
          </div>
          
          {/* Status Banner */}
          <div className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-lg border backdrop-blur-md transition-colors duration-500",
            isAttackMode 
              ? "bg-red-500/10 border-red-500/30 text-red-400" 
              : "bg-white/5 border-white/10 text-slate-400"
          )}>
            {isAttackMode ? (
              <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
            ) : (
              <Activity className="w-5 h-5 text-[#FCD535] shrink-0" />
            )}
            <span className="text-sm font-medium tracking-wide">
              {isAttackMode 
                ? "CRITICAL ALERT: Flash-loan vector detected on primary liquidity pool. AIGIS Protection Active." 
                : "DEMO MODE ACTIVE - Normal Market Conditions"}
            </span>
          </div>
        </header>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          
          {/* Card A: Ordinary USDT Savings */}
          <div className="flex flex-col rounded-xl bg-[#0D0D0D] border border-white/10 overflow-hidden relative group transition-all hover:bg-[#111111]">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
            
            <div className="p-6 border-b border-white/5 flex justify-between items-start relative z-10">
              <div>
                <h3 className="text-lg font-medium text-white mb-1">Ordinary SOL Savings</h3>
                <p className="text-sm text-slate-500">Standard variable rate pool</p>
              </div>
              <div className="px-2.5 py-1 rounded border border-slate-700 bg-slate-800/50 text-xs font-medium text-slate-400 uppercase tracking-wider">
                Normal Risk
              </div>
            </div>

            <div className="p-6 flex flex-col gap-6 relative z-10">
              <div>
                <div className="text-sm text-slate-500 mb-1">Current APY</div>
                <div className={cn(
                  "text-3xl font-mono font-medium transition-colors duration-500",
                  isAttackMode ? "text-red-500" : "text-slate-200"
                )}>
                  {isAttackMode ? "-84.2%" : "5.10%"}
                </div>
              </div>

              <div>
                <div className="text-sm text-slate-500 mb-1">Pool Total Value Locked</div>
                <div className="text-xl font-mono text-white">$1,000,000.00</div>
              </div>

              <div className="mt-auto pt-4">
                <button className="w-full py-3 rounded-lg bg-[#1A1A1A] hover:bg-[#222222] text-white font-medium transition-colors border border-white/5">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Card B: AIGIS-Secured USDT Staking */}
          <div className={cn(
            "flex flex-col rounded-xl bg-gradient-to-b from-[#141414] to-[#0A0A0A] border overflow-hidden relative group transition-all shadow-[0_4px_30px_rgba(0,0,0,0.5)]",
            isAttackMode 
              ? "border-emerald-500/50 ring-1 ring-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.15)]"
              : "border-[#FCD535]/50 ring-1 ring-[#FCD535]/50 shadow-[0_0_30px_rgba(252,213,53,0.1)]"
          )}>
            {/* Glow Effects */}
            <div className={cn(
              "absolute -top-32 -right-32 w-64 h-64 rounded-full blur-[100px] pointer-events-none transition-colors duration-1000",
              isAttackMode ? "bg-emerald-500/20" : "bg-[#FCD535]/10"
            )} />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIvPjwvc3ZnPg==')] opacity-50" />

            <div className="p-6 border-b border-white/5 flex justify-between items-start relative z-10 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-black border border-white/10 flex items-center justify-center">
                  <ShieldCheck className={cn("w-5 h-5", isAttackMode ? "text-emerald-400" : "text-[#FCD535]")} />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white mb-0.5 flex items-center gap-2">
                    AIGIS SOL Staking
                    <span className="flex h-2 w-2 relative">
                      <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", isAttackMode ? "bg-emerald-400" : "bg-[#FCD535]")}></span>
                      <span className={cn("relative inline-flex rounded-full h-2 w-2", isAttackMode ? "bg-emerald-500" : "bg-[#FCD535]")}></span>
                    </span>
                  </h3>
                  <p className="text-sm text-slate-400">AI-Guaranteed Principal</p>
                </div>
              </div>
              <div className={cn(
                "px-2.5 py-1 rounded border text-xs font-medium uppercase tracking-wider transition-colors duration-500",
                isAttackMode 
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)]" 
                  : "border-emerald-500/20 bg-emerald-500/5 text-emerald-400"
              )}>
                {isAttackMode ? "Protection Engaged" : "AI Protection Active"}
              </div>
            </div>

            <div className="p-6 flex flex-col gap-6 relative z-10 backdrop-blur-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-slate-400 mb-1">Current APY</div>
                  <div className="text-3xl font-mono font-medium text-[#FCD535]">
                    4.80%
                  </div>
                </div>
                <div>
                  <div className="text-sm text-slate-400 mb-1">Protected TVL</div>
                  <div className="text-xl font-mono text-white">$1,000,000.00</div>
                </div>
              </div>

              {/* The AIGIS AI Monitor Panel inside the card */}
              <div className="mt-2 rounded-lg bg-black/60 border border-white/10 p-4 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
                
                <div className="flex items-center justify-between mb-4">
                  <div className="text-xs font-medium text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Activity className="w-3.5 h-3.5" />
                    AI Monitor Core
                  </div>
                  <div className={cn(
                    "text-xs font-mono px-2 py-0.5 rounded transition-colors duration-300",
                    isAttackMode ? "bg-red-500/20 text-red-400" : "bg-white/5 text-slate-300"
                  )}>
                    ID: XA-992.4
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  {/* Circular Gauge SVG */}
                  <div className="w-24 h-24 relative shrink-0 flex items-center justify-center">
                    <GaugeChart isAttackMode={isAttackMode} attackProgress={attackProgress} />
                  </div>
                  
                  {/* XAI Stats */}
                  <div className="flex-1 flex flex-col gap-2.5">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500">Status</span>
                      <span className={cn(
                        "font-medium tracking-wide transition-colors duration-300",
                        isAttackMode ? "text-red-400" : "text-emerald-400"
                      )}>
                        {isAttackMode ? "THREAT MITIGATED" : "SYSTEM STABLE"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500">Confidence</span>
                      <span className="font-mono text-white">
                        {isAttackMode ? "99.9%" : "91.4%"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500">Anomaly Score</span>
                      <span className={cn("font-mono", isAttackMode ? "text-red-400" : "text-white")}>
                        {isAttackMode ? (0.85 + (attackProgress * 0.14)).toFixed(3) : "0.012"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-auto pt-2">
                <button className={cn(
                  "w-full py-3 rounded-lg font-medium transition-all shadow-lg",
                  isAttackMode
                    ? "bg-[#1A1A1A] text-slate-500 cursor-not-allowed border border-white/5"
                    : "bg-[#FCD535] hover:bg-[#FFE066] text-black border border-transparent hover:shadow-[0_0_15px_rgba(252,213,53,0.3)]"
                )}>
                  {isAttackMode ? "Operations Paused (Securing)" : "Subscribe Protected"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column (Side Panels) */}
      <aside className="w-full lg:w-[360px] flex flex-col gap-6 shrink-0">
        
        {/* User Action Panel */}
        <div className="rounded-xl bg-[#0D0D0D] border border-white/10 p-6 flex flex-col gap-5">
          <h2 className="text-white font-medium flex items-center gap-2">
            <Wallet className="w-4 h-4 text-[#FCD535]" />
            SOL Staking Panel
          </h2>
          
          <div className="p-4 rounded-lg bg-black border border-white/5 flex flex-col items-center justify-center gap-1">
            <span className="text-sm text-slate-500">Available Balance</span>
            <span className="text-3xl font-mono text-white">
              ${userBalance.toFixed(2)}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-2">
            <button 
              onClick={handleDeposit}
              className="py-2.5 rounded bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition-colors border border-white/5 flex items-center justify-center gap-2"
            >
              <ArrowRightLeft className="w-4 h-4" />
              Deposit $100
            </button>
            <button 
              onClick={handleWithdraw}
              className="py-2.5 rounded bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition-colors border border-white/5 flex items-center justify-center gap-2"
            >
              Withdraw
            </button>
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1 min-h-[40px] hidden lg:block" />

        {/* Demo Controls Panel (For Judges) */}
        <DemoControls isAttackMode={isAttackMode} setIsAttackMode={setIsAttackMode} />

      </aside>
    </main>
  );
}
