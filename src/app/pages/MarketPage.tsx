import React, { useState } from 'react';
import {
  TrendingUp,
  Star,
  Search,
  ArrowUpDown,
  ArrowDownUp,
  ChevronRight
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import solIcon from '@/assets/SOL.png';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Mock Data
const topPerformers = [
  { 
    pair: "SOL/USDT", 
    name: "Solana", 
    price: 145.20, 
    change: 8.45, 
    volume: "1.8B", 
    sparkline: [135, 138, 137, 140, 141, 142, 144, 145.20] 
  },
  { 
    pair: "BTC/USDT", 
    name: "Bitcoin", 
    price: 68421.20, 
    change: 2.45, 
    volume: "1.24B", 
    sparkline: [66000, 66500, 66200, 67000, 67800, 67500, 68100, 68421.20] 
  },
  { 
    pair: "ETH/USDT", 
    name: "Ethereum", 
    price: 3451.90, 
    change: 1.82, 
    volume: "845M", 
    sparkline: [3300, 3350, 3320, 3400, 3390, 3420, 3440, 3451.90] 
  }
];

const marketPairs = [
  { pair: "SOL/USDT", name: "Solana", price: 145.20, change: 8.45, volume: "1.8B", marketCap: "65B" },
  { pair: "AIGIS/USDT", name: "Aigis Token", price: 1.24, change: 5.2, volume: "420.5M", marketCap: "1.2B" },
  { pair: "BTC/USDT", name: "Bitcoin", price: 68421.20, change: 2.4, volume: "1.2B", marketCap: "1.3T" },
  { pair: "ETH/USDT", name: "Ethereum", price: 3451.90, change: 1.8, volume: "845.2M", marketCap: "415B" },
  { pair: "BNB/USDT", name: "BNB", price: 590.50, change: 0.5, volume: "215.8M", marketCap: "88B" },
  { pair: "XRP/USDT", name: "Ripple", price: 0.58, change: -0.1, volume: "150.4M", marketCap: "32B" },
  { pair: "DOGE/USDT", name: "Dogecoin", price: 0.15, change: 4.2, volume: "450.9M", marketCap: "21B" },
  { pair: "ADA/USDT", name: "Cardano", price: 0.45, change: -0.8, volume: "120.5M", marketCap: "16B" },
  { pair: "AVAX/USDT", name: "Avalanche", price: 35.20, change: 1.5, volume: "180.2M", marketCap: "13B" },
  { pair: "DOT/USDT", name: "Polkadot", price: 7.20, change: -2.1, volume: "95.4M", marketCap: "10B" },
  { pair: "LINK/USDT", name: "Chainlink", price: 14.30, change: 3.4, volume: "88.2M", marketCap: "8.4B" },
  { pair: "MATIC/USDT", name: "Polygon", price: 0.95, change: -0.5, volume: "105.7M", marketCap: "9.3B" },
];

const TABS = ["Избранное", "Все", "Spot", "Futures", "Новые листинги", "Лидеры роста"];

export function MarketPage() {
  const [activeTab, setActiveTab] = useState("All");

  return (
    <main className="flex-1 flex flex-col gap-8 p-6 lg:p-8 mt-4 w-full max-w-[1400px] mx-auto pb-20">
      
      {/* Page Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl md:text-4xl font-semibold text-white tracking-tight flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-[#FCD535]" />
            Обзор рынков
          </h1>
        </div>
        
        {/* Search Bar */}
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-[#FCD535] transition-colors" />
            <input 
              type="text" 
              placeholder="Поиск монеты..." 
              className="pl-10 pr-4 py-2.5 bg-[#0D0D0D] border border-white/10 rounded-lg text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-[#FCD535]/50 transition-colors w-full md:w-64"
            />
          </div>
        </div>
      </header>

      {/* Top Performers Cards Grid - Full Width */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {topPerformers.map((data, idx) => (
          <HighlightCard key={idx} data={data} />
        ))}
      </div>

      {/* Main Section Split: Left (Table) and Right (Quick Trade) */}
      <div className="flex flex-col xl:flex-row gap-8 items-start mt-2">
        
        {/* LEFT COLUMN: Enhanced Market Table (70%) */}
        <div className="flex-1 w-full xl:w-[70%] flex flex-col rounded-2xl bg-[#0D0D0D]/80 backdrop-blur-xl border border-white/10 overflow-hidden shadow-2xl">
          
          {/* Enhanced Navigation Tabs */}
          <div className="flex items-center gap-8 px-6 pt-6 pb-0 border-b border-white/5 overflow-x-auto no-scrollbar">
            {TABS.map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "text-sm font-medium pb-4 relative transition-all duration-300 whitespace-nowrap",
                    isActive 
                      ? "text-white [text-shadow:_0_0_12px_rgba(255,255,255,0.6)]" 
                      : "text-slate-400 hover:text-[#FCD535]"
                  )}
                >
                  {tab === "Favorites" && <Star className={cn("w-3.5 h-3.5 inline-block mr-1.5 -mt-0.5", isActive ? "fill-white" : "")} />}
                  {tab}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[#FCD535] shadow-[0_0_8px_rgba(252,213,53,0.8)] rounded-t-full" />
                  )}
                </button>
              )
            })}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap min-w-[800px]">
              <thead>
                <tr className="border-b border-white/5 text-xs text-slate-500 bg-black/40">
                  <th className="py-4 px-6 font-medium tracking-wide">
                    <div className="flex items-center gap-1 cursor-pointer hover:text-white transition-colors">
                      Торговая пара <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="py-4 px-6 font-medium tracking-wide text-right">
                    <div className="flex items-center justify-end gap-1 cursor-pointer hover:text-white transition-colors">
                      Цена <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="py-4 px-6 font-medium tracking-wide text-right">
                    <div className="flex items-center justify-end gap-1 cursor-pointer hover:text-white transition-colors">
                      Изменение за 24ч <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="py-4 px-6 font-medium tracking-wide text-right">
                    <div className="flex items-center justify-end gap-1 cursor-pointer hover:text-white transition-colors">
                      Объем за 24ч <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="py-4 px-6 font-medium tracking-wide text-right">
                    <div className="flex items-center justify-end gap-1 cursor-pointer hover:text-white transition-colors">
                      Рыночная капитализация <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="py-4 px-6 font-medium tracking-wide text-center">Действие</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {marketPairs.map((pair, idx) => (
                  <MarketRow key={idx} data={pair} />
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination Footer */}
          <div className="py-4 px-6 border-t border-white/5 flex items-center justify-between text-sm text-slate-500 bg-black/20">
            <span>Показано 1-12 из 342 рынков</span>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 rounded hover:bg-white/5 transition-colors disabled:opacity-50">Назад</button>
              <button className="px-3 py-1.5 rounded bg-white/10 text-white transition-colors">1</button>
              <button className="px-3 py-1.5 rounded hover:bg-white/5 transition-colors">2</button>
              <button className="px-3 py-1.5 rounded hover:bg-white/5 transition-colors">3</button>
              <span>...</span>
              <button className="px-3 py-1.5 rounded hover:bg-white/5 transition-colors">Вперед</button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Quick Trade Panel (30%) */}
        <div className="w-full xl:w-[30%] shrink-0 sticky top-28">
          <QuickTradePanel />
        </div>

      </div>
    </main>
  );
}

// --- Components ---

function HighlightCard({ data }: { data: any }) {
  const isPositive = data.change >= 0;
  
  return (
    <div className="flex flex-col rounded-2xl bg-gradient-to-br from-[#141414] to-[#0A0A0A] border border-white/10 overflow-hidden relative p-6 transition-all duration-300 hover:border-white/20 hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)] group">
       <div className="flex justify-between items-start mb-4 relative z-10">
         <div className="flex items-center gap-3">
           <div>
             <div className="text-white font-semibold flex items-center gap-2 text-lg">
               {data.pair.startsWith('SOL') && (
                 <img src={solIcon} alt="SOL" className="w-6 h-6 rounded-full inline-block" />
               )}
               {data.pair}
               <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-[#FCD535] transition-colors" />
             </div>
             <div className="text-sm text-slate-500">{data.name}</div>
           </div>
         </div>
       </div>

       <div className="flex items-baseline gap-3 relative z-10 mt-2">
         <span className="text-3xl font-mono font-bold text-white tracking-tight">
           ${data.price.toLocaleString(undefined, { minimumFractionDigits: data.price < 10 ? 4 : 2, maximumFractionDigits: data.price < 10 ? 4 : 2 })}
         </span>
         <span className={cn(
           "text-sm font-medium px-2 py-0.5 rounded-md", 
           isPositive ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
         )}>
           {isPositive ? "+" : ""}{data.change.toFixed(2)}%
         </span>
       </div>

       <div className="flex items-center gap-4 mt-8 relative z-10">
         <div className="flex-1">
           <SimpleSparkline data={data.sparkline} isPositive={isPositive} />
         </div>
         <div className="text-right">
           <div className="text-xs text-slate-500 mb-0.5 uppercase tracking-wider">24h Vol</div>
           <div className="text-sm font-mono text-slate-300">{data.volume}</div>
         </div>
       </div>
    </div>
  )
}

function SimpleSparkline({ data, isPositive }: { data: number[], isPositive: boolean }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 95 - (((val - min) / range) * 90);
    return `${x},${y}`;
  }).join(' ');
  
  const color = isPositive ? '#10B981' : '#EF4444';
  const gradientId = `spark-grad-${Math.random().toString(36).substr(2, 5)}`;
  
  return (
    <div className="w-full h-12 relative">
      <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible" preserveAspectRatio="none">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <polyline 
          fill="none" 
          stroke={color} 
          strokeWidth="3" 
          points={points} 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          vectorEffect="non-scaling-stroke"
        />
        <path 
          d={`M 0 100 L ${points.split(' ')[0].split(',')[0]} ${points.split(' ')[0].split(',')[1]} L ${points} L 100 100 Z`} 
          fill={`url(#${gradientId})`} 
        />
      </svg>
    </div>
  )
}

function MarketRow({ data }: { data: any }) {
  const isPositive = data.change >= 0;

  return (
    <tr className="hover:bg-slate-900/50 transition-colors group cursor-pointer">
      <td className="py-4 px-6">
        <div className="flex items-center gap-4">
          <button className="text-slate-600 hover:text-[#FCD535] transition-colors focus:outline-none">
            <Star className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-3">
            <div>
              <div className="text-white font-medium flex items-center gap-2 text-sm group-hover:text-[#FCD535] transition-colors">
                {data.pair.startsWith('SOL') && (
                  <img src={solIcon} alt="SOL" className="w-5 h-5 rounded-full inline-block" />
                )}
                {data.pair}
              </div>
              <div className="text-xs text-slate-500">{data.name}</div>
            </div>
          </div>
        </div>
      </td>
      <td className="py-4 px-6 text-right">
        <span className="font-mono text-sm text-white font-medium">
          ${data.price.toLocaleString(undefined, { minimumFractionDigits: data.price < 10 ? 4 : 2, maximumFractionDigits: data.price < 10 ? 4 : 2 })}
        </span>
      </td>
      <td className="py-4 px-6 text-right">
        <span className={cn(
          "font-medium text-sm", 
          isPositive ? "text-emerald-400" : "text-red-400"
        )}>
          {isPositive ? "+" : ""}{data.change.toFixed(2)}%
        </span>
      </td>
      <td className="py-4 px-6 text-right text-slate-300 font-mono text-sm">
        {data.volume}
      </td>
      <td className="py-4 px-6 text-right text-slate-300 font-mono text-sm">
        {data.marketCap}
      </td>
      <td className="py-4 px-6 text-center">
        <button className="px-5 py-1.5 rounded bg-[#FCD535]/10 border border-[#FCD535]/20 text-[#FCD535] text-xs font-semibold transition-all hover:bg-[#FCD535] hover:text-black hover:shadow-[0_0_15px_rgba(252,213,53,0.4)]">
          Торговля
        </button>
      </td>
    </tr>
  )
}

function QuickTradePanel() {
  return (
    <div className="rounded-2xl bg-[#0D0D0D]/80 backdrop-blur-xl border border-white/10 p-6 flex flex-col gap-2 shadow-2xl relative">
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none rounded-2xl" />
      
      <h2 className="text-lg font-semibold text-white mb-3 relative z-10 flex items-center gap-2">
        Быстрая торговля
      </h2>

      {/* Pay Input */}
      <div className="bg-black border border-white/10 rounded-xl p-3.5 relative z-10 transition-colors focus-within:border-[#FCD535]/50 group">
        <div className="flex justify-between text-xs text-slate-500 mb-2">
          <span className="font-medium">Отдаете</span>
          <span>Баланс: 10,000.00 USDT</span>
        </div>
        <div className="flex items-center gap-3">
          <input 
            type="text" 
            placeholder="0.00" 
            className="bg-transparent text-white font-mono text-xl outline-none w-full placeholder:text-slate-700" 
          />
          <button className="px-2 py-1 rounded bg-white/5 text-[#FCD535] text-[10px] font-bold uppercase tracking-wider hover:bg-white/10 transition-colors shrink-0">
            Max
          </button>
          <div className="flex items-center gap-1.5 pl-3 border-l border-white/10 shrink-0 cursor-pointer hover:bg-white/5 p-1 rounded transition-colors">
            <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 text-xs font-bold">₮</div>
            <span className="text-white font-medium">USDT</span>
            <ChevronRight className="w-3 h-3 text-slate-500" />
          </div>
        </div>
      </div>

      {/* Swap Icon */}
      <div className="relative h-2 flex items-center justify-center z-10 my-1">
        <button className="w-8 h-8 rounded-full bg-[#1A1A1A] border border-white/10 flex items-center justify-center hover:border-[#FCD535]/50 hover:text-[#FCD535] text-slate-400 transition-all absolute group">
          <ArrowDownUp className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
        </button>
      </div>

      {/* Receive Input */}
      <div className="bg-black border border-white/10 rounded-xl p-3.5 relative z-10 transition-colors focus-within:border-[#FCD535]/50 group">
        <div className="flex justify-between text-xs text-slate-500 mb-2">
          <span className="font-medium">Получаете</span>
          <span>Баланс: 0.00 AIGIS</span>
        </div>
        <div className="flex items-center gap-3">
          <input 
            type="text" 
            placeholder="0.00" 
            className="bg-transparent text-white font-mono text-xl outline-none w-full placeholder:text-slate-700" 
            readOnly
          />
          <button className="px-2 py-1 rounded bg-white/5 text-[#FCD535] text-[10px] font-bold uppercase tracking-wider hover:bg-white/10 transition-colors shrink-0">
            Max
          </button>
          <div className="flex items-center gap-1.5 pl-3 border-l border-white/10 shrink-0 cursor-pointer hover:bg-white/5 p-1 rounded transition-colors">
            <div className="w-5 h-5 rounded-full bg-[#FCD535]/20 flex items-center justify-center text-[#FCD535] text-xs font-bold">A</div>
            <span className="text-white font-medium">AIGIS</span>
            <ChevronRight className="w-3 h-3 text-slate-500" />
          </div>
        </div>
      </div>

      {/* Exchange Rate Info */}
      <div className="flex justify-between items-center text-xs text-slate-500 mt-2 mb-1 px-1 relative z-10">
        <span>Обменный курс</span>
        <span className="font-mono text-slate-300">1 AIGIS = 1.24 USDT</span>
      </div>

      {/* Action Button */}
      <button className="w-full py-4 mt-2 rounded-xl bg-[#FCD535] hover:bg-[#FFE066] text-black font-bold text-sm transition-all shadow-[0_0_15px_rgba(252,213,53,0.15)] hover:shadow-[0_0_25px_rgba(252,213,53,0.3)] relative z-10">
        Купить / Long AIGIS
      </button>
    </div>
  )
}
