import React, { useState, useEffect, useRef } from 'react';
import { useOutletContext } from 'react-router';
import {
  ShieldCheck,
  Activity,
  AlertTriangle,
  Zap,
  RefreshCw,
  TrendingUp,
  Lock,
  Coins,
  Terminal,
  Clock,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Terminal Log Entry Type
interface LogEntry {
  timestamp: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
}

// Risk Score Gauge Component
function RiskScoreGauge({ score, isAttackMode }: { score: number; isAttackMode: boolean }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const arcLength = circumference * 0.75;
  const fillLength = arcLength * Math.min(score, 1);
  const fillOffset = circumference - fillLength;
  
  const getColor = () => {
    if (score > 0.7) return '#EF4444';
    if (score > 0.4) return '#F59E0B';
    return '#10B981';
  };

  return (
    <div className="relative w-32 h-32 flex items-center justify-center">
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pt-3">
        <span className={cn(
          "text-2xl font-mono font-bold transition-colors duration-300",
          score > 0.7 ? "text-red-500" : score > 0.4 ? "text-amber-500" : "text-emerald-400"
        )}>
          {score.toFixed(2)}
        </span>
        <span className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Risk Score</span>
      </div>

      <svg 
        className="w-full h-full transform -rotate-[135deg]" 
        viewBox="0 0 120 120"
      >
        <defs>
          <linearGradient id="risk-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="50%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#EF4444" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Background Track */}
        <circle 
          cx="60" 
          cy="60" 
          r={radius} 
          fill="none" 
          stroke="#1A1A1A" 
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - arcLength}
        />

        {/* Value Track */}
        <circle 
          cx="60" 
          cy="60" 
          r={radius} 
          fill="none" 
          stroke={getColor()}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={fillOffset}
          filter={isAttackMode ? "url(#glow)" : undefined}
          className="transition-all duration-300 ease-out"
        />
      </svg>
    </div>
  );
}

// Terminal Log Component
function TerminalLog({ logs }: { logs: LogEntry[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const getLogColor = (type: LogEntry['type']) => {
    switch (type) {
      case 'error': return 'text-red-400';
      case 'warning': return 'text-amber-400';
      case 'success': return 'text-emerald-400';
      default: return 'text-slate-400';
    }
  };

  const getLogPrefix = (type: LogEntry['type']) => {
    switch (type) {
      case 'error': return '[ERROR]';
      case 'warning': return '[WARN]';
      case 'success': return '[OK]';
      default: return '[INFO]';
    }
  };

  return (
    <div className="rounded-lg bg-black border border-white/10 overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-2 bg-white/5 border-b border-white/10">
        <Terminal className="w-3.5 h-3.5 text-slate-500" />
        <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">AIGIS System Log</span>
        <div className="ml-auto flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
        </div>
      </div>
      <div 
        ref={scrollRef}
        className="h-40 overflow-y-auto p-3 font-mono text-xs leading-relaxed scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10"
      >
        {logs.map((log, i) => (
          <div key={i} className="flex gap-2 mb-1">
            <span className="text-slate-600 shrink-0">{log.timestamp}</span>
            <span className={cn("shrink-0", getLogColor(log.type))}>{getLogPrefix(log.type)}</span>
            <span className={getLogColor(log.type)}>{log.message}</span>
          </div>
        ))}
        <span className="inline-block w-2 h-4 bg-[#FCD535] animate-pulse" />
      </div>
    </div>
  );
}

export function FinancePage() {
  const { isAttackMode, setIsAttackMode } = useOutletContext<{ isAttackMode: boolean, setIsAttackMode: (v: boolean) => void }>();
  const [riskScore, setRiskScore] = useState(0.12);
  const [logs, setLogs] = useState<LogEntry[]>([
    { timestamp: '00:00:01', message: 'AIGIS Core v2.4.1 initialized', type: 'info' },
    { timestamp: '00:00:02', message: 'Neural risk model loaded (98.7% accuracy)', type: 'success' },
    { timestamp: '00:00:03', message: 'Connected to 47 liquidity pools', type: 'info' },
    { timestamp: '00:00:04', message: 'Monitoring active - All systems nominal', type: 'success' },
  ]);

  const getTimestamp = () => {
    const now = new Date();
    return now.toLocaleTimeString('en-US', { hour12: false });
  };

  const addLog = (message: string, type: LogEntry['type']) => {
    setLogs(prev => [...prev.slice(-50), { timestamp: getTimestamp(), message, type }]);
  };

  // Attack simulation effect
  useEffect(() => {
    if (isAttackMode) {
      // Phase 1: Detection
      addLog('ANOMALY DETECTED: Unusual transaction pattern in Pool #7', 'warning');
      
      const t1 = setTimeout(() => {
        addLog('Flash-loan signature identified (0x7f3a...)', 'error');
        setRiskScore(0.45);
      }, 500);

      const t2 = setTimeout(() => {
        addLog('CRITICAL: Attack vector confirmed - Flash-loan exploit', 'error');
        setRiskScore(0.78);
      }, 1000);

      const t3 = setTimeout(() => {
        addLog('Initiating AIGIS Shield Protocol...', 'warning');
        setRiskScore(0.92);
      }, 1500);

      const t4 = setTimeout(() => {
        addLog('Liquidity routes rerouted to secure vaults', 'success');
        setRiskScore(0.85);
      }, 2000);

      const t5 = setTimeout(() => {
        addLog('Principal protection activated for AIGIS Secured Vault', 'success');
        setRiskScore(0.65);
      }, 2500);

      const t6 = setTimeout(() => {
        addLog('Standard pools suffered 84.2% drawdown', 'error');
        addLog('AIGIS Secured Vault: 0% loss - Principal protected', 'success');
        setRiskScore(0.35);
      }, 3000);

      const t7 = setTimeout(() => {
        addLog('Threat neutralized. System stabilizing...', 'success');
        setRiskScore(0.18);
      }, 4000);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
        clearTimeout(t4);
        clearTimeout(t5);
        clearTimeout(t6);
        clearTimeout(t7);
      };
    }
  }, [isAttackMode]);

  // Reset handler
  const handleReset = () => {
    setIsAttackMode(false);
    setRiskScore(0.12);
    setLogs([
      { timestamp: getTimestamp(), message: 'System reset initiated', type: 'info' },
      { timestamp: getTimestamp(), message: 'AIGIS Core v2.4.1 reinitialized', type: 'success' },
      { timestamp: getTimestamp(), message: 'Monitoring active - All systems nominal', type: 'success' },
    ]);
  };

  const handleTriggerAttack = () => {
    setIsAttackMode(true);
  };

  return (
    <main className="flex-1 flex flex-col lg:flex-row gap-6 p-4 lg:p-6 bg-black min-h-screen">
      
      {/* Left Section - AIGIS Earn Products (70%) */}
      <div className="flex-1 lg:w-[70%] flex flex-col gap-6">
        
        {/* Header */}
        <header className="flex flex-col gap-4">
          <div className="flex items-center gap-4 flex-wrap">
            <h1 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">
              AIGIS Finance Products
            </h1>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-slate-400">Live</span>
            </div>
          </div>
          
          {/* Alert Banner */}
          <div className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-lg border backdrop-blur-md transition-all duration-500",
            isAttackMode 
              ? "bg-red-500/10 border-red-500/30" 
              : "bg-white/5 border-white/10"
          )}>
            {isAttackMode ? (
              <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 animate-pulse" />
            ) : (
              <Activity className="w-5 h-5 text-[#FCD535] shrink-0" />
            )}
            <span className={cn(
              "text-sm font-medium",
              isAttackMode ? "text-red-400" : "text-slate-400"
            )}>
              {isAttackMode 
                ? "CRITICAL: Flash-loan attack detected. AIGIS Shield Protocol engaged." 
                : "Normal market conditions. All vaults operating nominally."}
            </span>
          </div>
        </header>

        {/* Product Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Card 1: Standard USDT Staking */}
          <div className="flex flex-col rounded-xl bg-slate-950 border border-white/10 overflow-hidden relative group hover:border-white/20 transition-colors">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
            
            <div className="p-5 border-b border-white/5 flex justify-between items-start relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-800 border border-white/10 flex items-center justify-center">
                  <Coins className="w-5 h-5 text-slate-400" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white">Standard SOL Staking</h3>
                  <p className="text-sm text-slate-500">Variable rate pool</p>
                </div>
              </div>
              <div className="px-2.5 py-1 rounded border border-slate-700 bg-slate-800/50 text-xs font-medium text-slate-400 uppercase tracking-wider">
                Normal Risk
              </div>
            </div>

            <div className="p-5 flex flex-col gap-5 relative z-10">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-slate-500 mb-1 uppercase tracking-wider">Current APY</div>
                  <div className={cn(
                    "text-3xl font-mono font-medium transition-colors duration-500",
                    isAttackMode ? "text-red-500" : "text-white"
                  )}>
                    {isAttackMode ? "-84.2%" : "5.10%"}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1 uppercase tracking-wider">Total TVL</div>
                  <div className="text-xl font-mono text-white">$2.4M</div>
                </div>
              </div>

              {/* Status */}
              <div className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-500",
                isAttackMode ? "bg-red-500/10 border border-red-500/20" : "bg-white/5 border border-white/5"
              )}>
                {isAttackMode ? (
                  <>
                    <XCircle className="w-4 h-4 text-red-500" />
                    <span className="text-sm text-red-400">Liquidity Drained</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-slate-500" />
                    <span className="text-sm text-slate-400">Operating Normally</span>
                  </>
                )}
              </div>

              <div className="mt-auto pt-2">
                <button 
                  disabled={isAttackMode}
                  className={cn(
                    "w-full py-3 rounded-lg font-medium transition-all",
                    isAttackMode 
                      ? "bg-slate-800 text-slate-600 cursor-not-allowed"
                      : "bg-white/10 hover:bg-white/15 text-white border border-white/10"
                  )}
                >
                  {isAttackMode ? "Pool Compromised" : "Subscribe"}
                </button>
              </div>
            </div>
          </div>

          {/* Card 2: AIGIS Secured Vault - HIGHLIGHTED */}
          <div className={cn(
            "flex flex-col rounded-xl bg-gradient-to-b from-slate-900 to-slate-950 border-2 overflow-hidden relative group transition-all duration-500",
            isAttackMode 
              ? "border-emerald-500 shadow-[0_0_40px_rgba(16,185,129,0.25)]"
              : "border-[#FCD535] shadow-[0_0_40px_rgba(252,213,53,0.15)]"
          )}>
            {/* Glow Effect */}
            <div className={cn(
              "absolute -top-20 -right-20 w-40 h-40 rounded-full blur-[80px] pointer-events-none transition-colors duration-1000",
              isAttackMode ? "bg-emerald-500/30" : "bg-[#FCD535]/20"
            )} />
            <div className={cn(
              "absolute -bottom-20 -left-20 w-40 h-40 rounded-full blur-[80px] pointer-events-none transition-colors duration-1000",
              isAttackMode ? "bg-emerald-500/20" : "bg-[#FCD535]/10"
            )} />
            
            <div className="p-5 border-b border-white/10 flex justify-between items-start relative z-10">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-lg border flex items-center justify-center transition-colors duration-500",
                  isAttackMode 
                    ? "bg-emerald-500/10 border-emerald-500/30" 
                    : "bg-[#FCD535]/10 border-[#FCD535]/30"
                )}>
                  <ShieldCheck className={cn(
                    "w-5 h-5 transition-colors duration-500",
                    isAttackMode ? "text-emerald-400" : "text-[#FCD535]"
                  )} />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white flex items-center gap-2">
                    AIGIS SOL Secured Vault
                    <span className="flex h-2 w-2 relative">
                      <span className={cn(
                        "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
                        isAttackMode ? "bg-emerald-400" : "bg-[#FCD535]"
                      )} />
                      <span className={cn(
                        "relative inline-flex rounded-full h-2 w-2",
                        isAttackMode ? "bg-emerald-500" : "bg-[#FCD535]"
                      )} />
                    </span>
                  </h3>
                  <p className="text-sm text-slate-400">AI-Protected Principal</p>
                </div>
              </div>
              <div className={cn(
                "px-2.5 py-1 rounded border text-xs font-medium uppercase tracking-wider flex items-center gap-1.5 transition-all duration-500",
                isAttackMode 
                  ? "border-emerald-500/50 bg-emerald-500/20 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]" 
                  : "border-[#FCD535]/30 bg-[#FCD535]/10 text-[#FCD535]"
              )}>
                <ShieldCheck className="w-3 h-3" />
                AI Protection Active
              </div>
            </div>

            <div className="p-5 flex flex-col gap-5 relative z-10">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-slate-400 mb-1 uppercase tracking-wider">Current APY</div>
                  <div className="text-3xl font-mono font-medium text-[#FCD535]">4.80%</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400 mb-1 uppercase tracking-wider">Protected TVL</div>
                  <div className="text-xl font-mono text-white">$8.7M</div>
                </div>
              </div>

              {/* User Balance */}
              <div className="flex items-center justify-between px-4 py-3 rounded-lg bg-black/40 border border-white/10">
                <div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider">Your Balance</div>
                  <div className="text-lg font-mono text-white">$12,500.00</div>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-emerald-500" />
                  <span className="text-xs text-emerald-400 font-medium">PROTECTED</span>
                </div>
              </div>

              {/* Status */}
              <div className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-500",
                isAttackMode 
                  ? "bg-emerald-500/10 border border-emerald-500/30"
                  : "bg-white/5 border border-white/5"
              )}>
                {isAttackMode ? (
                  <>
                    <ShieldCheck className="w-4 h-4 text-emerald-500 animate-pulse" />
                    <span className="text-sm text-emerald-400 font-medium">Shield Active - Principal Secured</span>
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-4 h-4 text-[#FCD535]" />
                    <span className="text-sm text-slate-400">Earning {'>'}4.8% APY</span>
                  </>
                )}
              </div>

              <div className="mt-auto pt-2">
                <button className={cn(
                  "w-full py-3 rounded-lg font-medium transition-all",
                  isAttackMode
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-default"
                    : "bg-[#FCD535] hover:bg-[#FFE066] text-black shadow-[0_0_20px_rgba(252,213,53,0.2)] hover:shadow-[0_0_30px_rgba(252,213,53,0.4)]"
                )}>
                  {isAttackMode ? "Assets Protected" : "Subscribe Protected"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="rounded-xl bg-slate-950 border border-white/10 overflow-hidden">
          <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
            <h3 className="text-white font-medium">Product Comparison</h3>
            <div className={cn(
              "text-xs font-medium px-2 py-1 rounded transition-colors duration-500",
              isAttackMode ? "bg-red-500/20 text-red-400" : "bg-white/5 text-slate-500"
            )}>
              {isAttackMode ? "Attack Scenario Active" : "Normal Conditions"}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left text-slate-500 font-medium px-5 py-3 uppercase text-xs tracking-wider">Feature</th>
                  <th className="text-center text-slate-500 font-medium px-5 py-3 uppercase text-xs tracking-wider">Standard Pool</th>
                  <th className="text-center font-medium px-5 py-3 uppercase text-xs tracking-wider text-[#FCD535]">AIGIS Secured</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-white/5">
                  <td className="px-5 py-3 text-slate-400">Base APY</td>
                  <td className="px-5 py-3 text-center text-white font-mono">5.10%</td>
                  <td className="px-5 py-3 text-center text-[#FCD535] font-mono">4.80%</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="px-5 py-3 text-slate-400">AI Protection</td>
                  <td className="px-5 py-3 text-center text-red-400">No</td>
                  <td className="px-5 py-3 text-center text-emerald-400">Yes</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="px-5 py-3 text-slate-400">Flash-Loan Defense</td>
                  <td className="px-5 py-3 text-center text-red-400">Vulnerable</td>
                  <td className="px-5 py-3 text-center text-emerald-400">Protected</td>
                </tr>
                <tr className={cn(
                  "transition-colors duration-500",
                  isAttackMode ? "bg-red-500/5" : ""
                )}>
                  <td className="px-5 py-3 text-slate-400">Attack Outcome</td>
                  <td className={cn(
                    "px-5 py-3 text-center font-mono font-medium transition-colors duration-500",
                    isAttackMode ? "text-red-500" : "text-slate-500"
                  )}>
                    {isAttackMode ? "-84.2%" : "N/A"}
                  </td>
                  <td className={cn(
                    "px-5 py-3 text-center font-mono font-medium transition-colors duration-500",
                    isAttackMode ? "text-emerald-400" : "text-slate-500"
                  )}>
                    {isAttackMode ? "0% Loss" : "N/A"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Right Section - Demo Controls (30%) */}
      <aside className="w-full lg:w-[30%] lg:min-w-[340px] flex flex-col gap-4">
        
        {/* AIGIS System Admin Panel */}
        <div className="rounded-xl bg-gradient-to-br from-red-950/40 via-purple-950/30 to-slate-950 backdrop-blur-xl border border-red-500/20 p-5 flex flex-col gap-5 relative overflow-hidden">
          {/* Backdrop glow */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-red-500/10 blur-[60px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-500/10 blur-[60px] pointer-events-none" />
          
          {/* Header */}
          <div className="flex items-center gap-2 border-b border-red-500/20 pb-4 relative z-10">
            <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <Zap className="w-4 h-4 text-red-500" />
            </div>
            <div>
              <h2 className="text-white font-medium text-sm">AIGIS System Admin</h2>
              <p className="text-[10px] text-red-400/70 uppercase tracking-widest">Hackathon Demo Panel</p>
            </div>
          </div>

          {/* AI Risk Score Gauge */}
          <div className="flex flex-col items-center gap-3 py-4 relative z-10">
            <div className="text-xs text-slate-500 uppercase tracking-widest">AI Risk Score</div>
            <RiskScoreGauge score={riskScore} isAttackMode={isAttackMode} />
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-slate-500">Safe</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="text-slate-500">Warning</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <span className="text-slate-500">Critical</span>
              </div>
            </div>
          </div>

          {/* Terminal Log */}
          <div className="relative z-10">
            <TerminalLog logs={logs} />
          </div>

          {/* Demo Buttons */}
          <div className="flex flex-col gap-3 relative z-10 mt-2">
            <button 
              onClick={handleTriggerAttack}
              disabled={isAttackMode}
              className={cn(
                "py-4 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2",
                isAttackMode 
                  ? "bg-red-950/50 text-red-800 border border-red-900/50 cursor-not-allowed"
                  : "bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)] hover:shadow-[0_0_30px_rgba(239,68,68,0.6)]"
              )}
            >
              <AlertTriangle className="w-4 h-4" />
              {isAttackMode ? "ATTACK IN PROGRESS..." : "TRIGGER FLASH-LOAN ATTACK"}
            </button>
            
            <button 
              onClick={handleReset}
              className={cn(
                "py-3.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2",
                "bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
              )}
            >
              <RefreshCw className={cn("w-4 h-4", isAttackMode && "animate-spin")} />
              RESET DEMO
            </button>
          </div>

          {/* Timestamp */}
          <div className="flex items-center justify-center gap-2 pt-2 border-t border-white/5 relative z-10">
            <Clock className="w-3 h-3 text-slate-600" />
            <span className="text-xs font-mono text-slate-600">
              {new Date().toLocaleTimeString('en-US', { hour12: false })}
            </span>
          </div>
        </div>

        {/* Instructions Card */}
        <div className="rounded-xl bg-slate-950 border border-white/10 p-5">
          <h3 className="text-white font-medium text-sm mb-3 flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#FCD535]" />
            Demo Instructions
          </h3>
          <ol className="text-xs text-slate-400 space-y-2 list-decimal list-inside">
            <li>Observe the two SOL staking products above</li>
            <li>Click <span className="text-red-400 font-medium">"Trigger Flash-Loan Attack"</span></li>
            <li>Watch the AI Risk Score spike in real-time</li>
            <li>Observe how AIGIS protects the secured vault</li>
            <li>Compare outcomes: Standard (-84%) vs AIGIS (0%)</li>
          </ol>
        </div>
      </aside>
    </main>
  );
}
