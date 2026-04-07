import React from 'react';
import { Zap, AlertTriangle, RefreshCw } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function DemoControls({ isAttackMode, setIsAttackMode }: { isAttackMode: boolean, setIsAttackMode: (v: boolean) => void }) {
  return (
    <div className="rounded-xl bg-[#1A0505]/80 backdrop-blur-xl border border-red-500/20 p-6 flex flex-col gap-5 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 blur-[50px] pointer-events-none" />
      
      <div className="flex items-center gap-2 mb-1 border-b border-red-500/20 pb-4 relative z-10">
        <Zap className="w-4 h-4 text-red-500" />
        <h2 className="text-red-400 font-medium text-sm tracking-wider uppercase">
          Judge Demo Controls
        </h2>
      </div>

      <p className="text-xs text-slate-400 leading-relaxed relative z-10">
        Trigger a simulated flash-loan attack to observe how AIGIS protects the secured pool while ordinary pairs suffer severe cascading losses.
      </p>

      <div className="flex flex-col gap-3 relative z-10">
        <button 
          onClick={() => setIsAttackMode(true)}
          disabled={isAttackMode}
          className={cn(
            "py-3.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2",
            isAttackMode 
              ? "bg-red-950/50 text-red-800 border border-red-900 cursor-not-allowed"
              : "bg-red-500 hover:bg-red-600 text-white shadow-[0_0_15px_rgba(239,68,68,0.3)] hover:shadow-[0_0_25px_rgba(239,68,68,0.5)]"
          )}
        >
          <AlertTriangle className="w-4 h-4" />
          {isAttackMode ? "ATTACK IN PROGRESS..." : "⚠️ TRIGGER FLASH-LOAN"}
        </button>
        
        <button 
          onClick={() => setIsAttackMode(false)}
          disabled={!isAttackMode}
          className={cn(
            "py-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2",
            !isAttackMode
              ? "bg-white/5 text-slate-600 cursor-not-allowed"
              : "bg-white/10 hover:bg-white/20 text-white border border-white/10"
          )}
        >
          <RefreshCw className={cn("w-4 h-4", isAttackMode && "animate-spin-slow")} />
          🔄 RESET DEMO
        </button>
      </div>
    </div>
  )
}

export function GaugeChart({ isAttackMode, attackProgress }: { isAttackMode: boolean; attackProgress: number }) {
  // SVG Gauge calculations
  const radius = 40;
  const circumference = 2 * Math.PI * radius; // Full circle
  const arcLength = circumference * 0.75; // 270 degree arc
  const dashOffset = circumference - arcLength;
  
  // Base value (0.12) to Attack value (0.95)
  const baseValue = 0.12;
  const targetValue = 0.95;
  const currentValue = baseValue + (targetValue - baseValue) * attackProgress;
  
  // Calculate fill length based on current value (0 to 1)
  const fillLength = arcLength * currentValue;
  const fillOffset = circumference - fillLength;

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Value Display in Center */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pt-2">
        <span className={cn(
          "text-xl font-mono font-bold transition-colors duration-200",
          isAttackMode ? "text-red-500" : "text-emerald-400"
        )}>
          {(currentValue * 100).toFixed(0)}
        </span>
        <span className="text-[9px] text-slate-500 uppercase tracking-widest mt-0.5">Risk</span>
      </div>

      <svg 
        className="w-full h-full transform -rotate-[135deg]" 
        viewBox="0 0 100 100"
      >
        <defs>
          <linearGradient id="gauge-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10B981" />   {/* Emerald */}
            <stop offset="50%" stopColor="#FCD535" />  {/* Yellow */}
            <stop offset="100%" stopColor="#EF4444" /> {/* Red */}
          </linearGradient>
          
          <linearGradient id="gauge-red" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EF4444" />
            <stop offset="100%" stopColor="#991B1B" />
          </linearGradient>
        </defs>

        {/* Background Track */}
        <circle 
          cx="50" 
          cy="50" 
          r={radius} 
          fill="none" 
          stroke="#1A1A1A" 
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
        />

        {/* Value Track */}
        <circle 
          cx="50" 
          cy="50" 
          r={radius} 
          fill="none" 
          stroke={isAttackMode ? "url(#gauge-red)" : "url(#gauge-gradient)"}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={fillOffset}
          className="transition-all duration-200 ease-linear"
        />
      </svg>
    </div>
  );
}
