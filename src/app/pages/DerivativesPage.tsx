import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Star, 
  ChevronDown,
  Clock,
  Settings,
  Maximize2,
  Camera,
  BarChart3,
  LineChart,
  CandlestickChart,
  Minus,
  Plus,
  AlertTriangle,
  Info,
  X
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import solIcon from '@/assets/SOL.png';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Mock Data for Perpetual Futures
const perpInfo = {
  pair: "SOL-PERP",
  type: "Perpetual",
  markPrice: 145.20,
  indexPrice: 145.18,
  lastPrice: 145.20,
  priceChange: 8.45,
  high24h: 152.00,
  low24h: 138.50,
  volume24h: "245.8M",
  openInterest: "89.2M",
  fundingRate: 0.0100,
  fundingCountdown: { hours: 7, minutes: 45, seconds: 12 }
};

const generateOrderBookData = (basePrice: number, count: number, type: 'ask' | 'bid') => {
  const data = [];
  for (let i = 0; i < count; i++) {
    const offset = type === 'ask' ? (i + 1) * (Math.random() * 0.015 + 0.005) : -(i + 1) * (Math.random() * 0.015 + 0.005);
    const price = basePrice + offset;
    const amount = Math.random() * 50000 + 1000;
    const total = price * amount;
    data.push({ 
      price: price.toFixed(4), 
      amount: amount.toFixed(0), 
      total: total.toFixed(2),
      depth: Math.random() * 100 
    });
  }
  return type === 'ask' ? data.reverse() : data;
};

const asks = generateOrderBookData(145.20, 12, 'ask');
const bids = generateOrderBookData(145.20, 12, 'bid');

const positions = [
  { 
    id: 1, 
    symbol: "SOL-PERP", 
    side: "Long", 
    size: "150.0", 
    entryPrice: "135.00", 
    markPrice: "145.20",
    liqPrice: "105.00",
    marginRatio: "12.5%",
    margin: "1,012.50",
    unrealizedPnl: "+1,530.00",
    pnlPercent: "+151.11%",
    isProfit: true
  },
  { 
    id: 2, 
    symbol: "BTC/USDT", 
    side: "Short", 
    size: "0.5", 
    entryPrice: "69,450.00", 
    markPrice: "68,421.20",
    liqPrice: "75,200.00",
    marginRatio: "8.2%",
    margin: "3,472.50",
    unrealizedPnl: "+514.40",
    pnlPercent: "+1.48%",
    isProfit: true
  },
  { 
    id: 3, 
    symbol: "ETH/USDT", 
    side: "Long", 
    size: "5.0", 
    entryPrice: "3,520.00", 
    markPrice: "3,451.90",
    liqPrice: "2,800.00",
    marginRatio: "15.8%",
    margin: "1,760.00",
    unrealizedPnl: "-340.50",
    pnlPercent: "-1.94%",
    isProfit: false
  },
];

const openOrders = [
  { id: 1, symbol: "SOL-PERP", type: "Limit", side: "Long", price: "138.00", amount: "50.0", leverage: "20x", time: "2026-04-02 10:30:22" },
  { id: 2, symbol: "BTC/USDT", type: "Stop-Market", side: "Short", price: "70,000.00", amount: "0.25", leverage: "10x", time: "2026-04-02 09:15:45" },
];

const tradeHistory = [
  { price: "145.20", amount: "20.5", time: "10:45:22", side: "buy" },
  { price: "145.18", amount: "51.2", time: "10:45:20", side: "sell" },
  { price: "145.25", amount: "89.0", time: "10:45:18", side: "buy" },
  { price: "145.10", amount: "125.0", time: "10:45:15", side: "sell" },
  { price: "145.22", amount: "34.0", time: "10:45:12", side: "buy" },
  { price: "145.08", amount: "67.8", time: "10:45:10", side: "sell" },
  { price: "145.30", amount: "21.5", time: "10:45:08", side: "buy" },
  { price: "145.05", amount: "89.0", time: "10:45:05", side: "sell" },
];

const TIME_FRAMES = ["1m", "5m", "15m", "1H", "4H", "1D", "1W"];
const ORDER_TABS = ["Limit", "Market", "Stop-Market"];
const BOTTOM_TABS = ["Positions", "Open Orders", "Trade History"];

export function DerivativesPage() {
  const [selectedTimeFrame, setSelectedTimeFrame] = useState("1H");
  const [orderType, setOrderType] = useState("Limit");
  const [bottomTab, setBottomTab] = useState("Positions");
  const [sliderValue, setSliderValue] = useState(0);
  const [leverage, setLeverage] = useState(20);
  const [marginMode, setMarginMode] = useState<'cross' | 'isolated'>('cross');
  const [price, setPrice] = useState("145.20");
  const [amount, setAmount] = useState("");
  const [countdown, setCountdown] = useState(perpInfo.fundingCountdown);

  const isPositive = perpInfo.priceChange >= 0;

  // Funding countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return perpInfo.fundingCountdown;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <main className="flex-1 flex flex-col w-full bg-slate-950">
      {/* Top Bar */}
      <TopBar data={perpInfo} isPositive={isPositive} countdown={countdown} />

      {/* Main Trading Area */}
      <div className="flex flex-col lg:flex-row flex-1 gap-px bg-slate-800/50">
        
        {/* Left Column - Order Book (20%) */}
        <div className="w-full lg:w-[20%] bg-slate-950 flex flex-col min-h-[400px] lg:min-h-0">
          <OrderBook asks={asks} bids={bids} lastPrice={perpInfo.markPrice} />
        </div>

        {/* Center Column - Chart (55%) */}
        <div className="w-full lg:w-[55%] bg-slate-950 flex flex-col min-h-[400px] lg:min-h-0">
          <ChartSection 
            selectedTimeFrame={selectedTimeFrame} 
            setSelectedTimeFrame={setSelectedTimeFrame} 
          />
        </div>

        {/* Right Column - Order Entry (25%) */}
        <div className="w-full lg:w-[25%] bg-slate-950 flex flex-col">
          <FuturesOrderForm
            orderType={orderType}
            setOrderType={setOrderType}
            price={price}
            setPrice={setPrice}
            amount={amount}
            setAmount={setAmount}
            sliderValue={sliderValue}
            setSliderValue={setSliderValue}
            leverage={leverage}
            setLeverage={setLeverage}
            marginMode={marginMode}
            setMarginMode={setMarginMode}
          />
        </div>
      </div>

      {/* Bottom Section - Positions & Orders Tables */}
      <div className="bg-slate-950 border-t border-slate-800">
        <BottomTables 
          activeTab={bottomTab} 
          setActiveTab={setBottomTab}
          positions={positions}
          openOrders={openOrders}
          tradeHistory={tradeHistory}
        />
      </div>
    </main>
  );
}

// --- Components ---

function TopBar({ data, isPositive, countdown }: { 
  data: typeof perpInfo; 
  isPositive: boolean;
  countdown: { hours: number; minutes: number; seconds: number };
}) {
  const formatTime = (n: number) => n.toString().padStart(2, '0');

  return (
    <div className="flex flex-wrap items-center gap-4 lg:gap-8 px-4 py-3 bg-slate-950 border-b border-slate-800">
      {/* Trading Pair */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div>
            <div className="flex items-center gap-2">
              {data.pair.startsWith('SOL') && (
                <img src={solIcon} alt="SOL" className="w-6 h-6 rounded-full inline-block" />
              )}
              <span className="text-white font-semibold text-lg">{data.pair}</span>
              <span className="px-1.5 py-0.5 text-[10px] font-medium bg-[#FCD535]/20 text-[#FCD535] rounded">
                {data.type}
              </span>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </div>
          </div>
        </div>
        <button className="text-slate-500 hover:text-[#FCD535] transition-colors">
          <Star className="w-4 h-4" />
        </button>
      </div>

      {/* Divider */}
      <div className="hidden sm:block w-px h-10 bg-slate-800" />

      {/* Price Info */}
      <div className="flex flex-wrap items-center gap-4 lg:gap-8">
        {/* Mark Price */}
        <div>
          <div className="text-xs text-slate-500 mb-1">Mark Price</div>
          <div className="text-lg font-mono font-bold text-white">
            {data.markPrice.toFixed(4)}
          </div>
        </div>

        {/* Index Price */}
        <div>
          <div className="text-xs text-slate-500 mb-1">Index Price</div>
          <div className="font-mono text-sm text-slate-300">
            {data.indexPrice.toFixed(4)}
          </div>
        </div>

        {/* Funding Rate */}
        <div className="bg-slate-900/50 px-3 py-2 rounded-lg border border-slate-800">
          <div className="text-xs text-slate-500 mb-1 flex items-center gap-1">
            Funding Rate
            <Info className="w-3 h-3" />
          </div>
          <div className="flex items-center gap-3">
            <span className={cn(
              "font-mono text-sm font-medium",
              data.fundingRate > 0 ? "text-emerald-400" : "text-red-400"
            )}>
              {data.fundingRate > 0 ? "+" : ""}{data.fundingRate.toFixed(4)}%
            </span>
            <span className="font-mono text-sm text-[#FCD535]">
              {formatTime(countdown.hours)}:{formatTime(countdown.minutes)}:{formatTime(countdown.seconds)}
            </span>
          </div>
        </div>

        {/* 24h Change */}
        <div>
          <div className="text-xs text-slate-500 mb-1">24h Change</div>
          <div className={cn(
            "font-medium text-sm flex items-center gap-1",
            isPositive ? "text-emerald-400" : "text-red-400"
          )}>
            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {isPositive ? "+" : ""}{data.priceChange}%
          </div>
        </div>

        {/* 24h High */}
        <div>
          <div className="text-xs text-slate-500 mb-1">24h High</div>
          <div className="font-mono text-sm text-white">
            {data.high24h.toFixed(4)}
          </div>
        </div>

        {/* 24h Low */}
        <div>
          <div className="text-xs text-slate-500 mb-1">24h Low</div>
          <div className="font-mono text-sm text-white">
            {data.low24h.toFixed(4)}
          </div>
        </div>

        {/* 24h Volume */}
        <div>
          <div className="text-xs text-slate-500 mb-1">24h Volume</div>
          <div className="font-mono text-sm text-white">{data.volume24h}</div>
        </div>

        {/* Open Interest */}
        <div>
          <div className="text-xs text-slate-500 mb-1">Open Interest</div>
          <div className="font-mono text-sm text-white">{data.openInterest}</div>
        </div>
      </div>
    </div>
  );
}

function OrderBook({ asks, bids, lastPrice }: { asks: any[]; bids: any[]; lastPrice: number }) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-slate-800">
        <span className="text-sm font-medium text-white">Order Book</span>
        <div className="flex items-center gap-2">
          <button className="p-1 text-slate-500 hover:text-white transition-colors">
            <BarChart3 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Column Headers */}
      <div className="grid grid-cols-3 text-xs text-slate-500 px-3 py-2 border-b border-slate-800/50">
        <span>Price(USDT)</span>
        <span className="text-right">Size</span>
        <span className="text-right">Total</span>
      </div>

      {/* Asks (Sells) - Red */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col">
          {asks.map((order, idx) => (
            <div 
              key={`ask-${idx}`} 
              className="grid grid-cols-3 text-xs px-3 py-1 hover:bg-slate-900/50 cursor-pointer relative"
            >
              <div 
                className="absolute inset-0 bg-red-500/10 pointer-events-none" 
                style={{ width: `${order.depth}%`, right: 0, left: 'auto' }} 
              />
              <span className="text-red-400 font-mono relative z-10">{order.price}</span>
              <span className="text-slate-300 font-mono text-right relative z-10">{Number(order.amount).toLocaleString()}</span>
              <span className="text-slate-500 font-mono text-right relative z-10">{Number(order.total).toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Spread / Mark Price */}
      <div className="px-3 py-2 border-y border-slate-800 bg-slate-900/50">
        <div className="flex items-center justify-between">
          <span className="text-lg font-mono font-bold text-emerald-400">
            {lastPrice.toFixed(4)}
          </span>
          <span className="text-xs text-slate-500">
            Mark Price
          </span>
        </div>
      </div>

      {/* Bids (Buys) - Green */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col">
          {bids.map((order, idx) => (
            <div 
              key={`bid-${idx}`} 
              className="grid grid-cols-3 text-xs px-3 py-1 hover:bg-slate-900/50 cursor-pointer relative"
            >
              <div 
                className="absolute inset-0 bg-emerald-500/10 pointer-events-none" 
                style={{ width: `${order.depth}%`, right: 0, left: 'auto' }} 
              />
              <span className="text-emerald-400 font-mono relative z-10">{order.price}</span>
              <span className="text-slate-300 font-mono text-right relative z-10">{Number(order.amount).toLocaleString()}</span>
              <span className="text-slate-500 font-mono text-right relative z-10">{Number(order.total).toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ChartSection({ selectedTimeFrame, setSelectedTimeFrame }: { 
  selectedTimeFrame: string; 
  setSelectedTimeFrame: (tf: string) => void;
}) {
  return (
    <div className="flex flex-col h-full">
      {/* Chart Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800">
        {/* Left - Time Frames */}
        <div className="flex items-center gap-1">
          <button className="p-1.5 text-slate-400 hover:text-white transition-colors">
            <Clock className="w-4 h-4" />
          </button>
          {TIME_FRAMES.map((tf) => (
            <button
              key={tf}
              onClick={() => setSelectedTimeFrame(tf)}
              className={cn(
                "px-2.5 py-1 text-xs font-medium rounded transition-colors",
                selectedTimeFrame === tf 
                  ? "bg-[#FCD535] text-black" 
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              )}
            >
              {tf}
            </button>
          ))}
        </div>

        {/* Right - Chart Controls */}
        <div className="flex items-center gap-2">
          <button className="p-1.5 text-slate-400 hover:text-white transition-colors">
            <CandlestickChart className="w-4 h-4" />
          </button>
          <button className="p-1.5 text-slate-400 hover:text-white transition-colors">
            <LineChart className="w-4 h-4" />
          </button>
          <div className="w-px h-4 bg-slate-700 mx-1" />
          <button className="p-1.5 text-slate-400 hover:text-white transition-colors">
            <Settings className="w-4 h-4" />
          </button>
          <button className="p-1.5 text-slate-400 hover:text-white transition-colors">
            <Camera className="w-4 h-4" />
          </button>
          <button className="p-1.5 text-slate-400 hover:text-white transition-colors">
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Chart Placeholder */}
      <div className="flex-1 relative bg-slate-950 min-h-[300px]">
        {/* Grid lines */}
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full">
            <defs>
              <pattern id="grid-deriv" width="60" height="40" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 40" fill="none" stroke="#334155" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-deriv)" />
          </svg>
        </div>

        {/* Mock Candlestick Chart */}
        <div className="absolute inset-4 flex items-end justify-around gap-1">
          {Array.from({ length: 40 }).map((_, i) => {
            const isGreen = Math.random() > 0.4;
            const height = Math.random() * 60 + 20;
            const wickTop = Math.random() * 15;
            const wickBottom = Math.random() * 15;
            
            return (
              <div key={i} className="flex flex-col items-center" style={{ height: `${height + wickTop + wickBottom}%` }}>
                {/* Top Wick */}
                <div 
                  className={cn("w-px", isGreen ? "bg-emerald-500" : "bg-red-500")}
                  style={{ height: `${wickTop}%` }}
                />
                {/* Body */}
                <div 
                  className={cn(
                    "w-2 lg:w-3 rounded-sm",
                    isGreen ? "bg-emerald-500" : "bg-red-500"
                  )}
                  style={{ height: `${height}%` }}
                />
                {/* Bottom Wick */}
                <div 
                  className={cn("w-px", isGreen ? "bg-emerald-500" : "bg-red-500")}
                  style={{ height: `${wickBottom}%` }}
                />
              </div>
            );
          })}
        </div>

        {/* Price Scale (Right) */}
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-slate-950/80 border-l border-slate-800 flex flex-col justify-between py-4 text-xs font-mono text-slate-500">
          <span className="px-2">160.00</span>
          <span className="px-2">155.00</span>
          <span className="px-2">150.00</span>
          <span className="px-2">145.20</span>
          <span className="px-2">140.00</span>
          <span className="px-2">135.00</span>
          <span className="px-2">130.00</span>
          <span className="px-2">125.00</span>
        </div>

        {/* Current Price Line */}
        <div className="absolute left-0 right-16 top-[45%] border-t border-dashed border-emerald-500/50 pointer-events-none">
          <span className="absolute right-0 -top-2.5 bg-emerald-500 text-black text-xs font-mono px-2 py-0.5 rounded-l">
            145.20
          </span>
        </div>

        {/* Liquidation Price Line (for demo) */}
        <div className="absolute left-0 right-16 top-[75%] border-t border-dashed border-red-500/50 pointer-events-none">
          <span className="absolute right-0 -top-2.5 bg-red-500 text-white text-xs font-mono px-2 py-0.5 rounded-l">
            Liq: 105.00
          </span>
        </div>

        {/* TradingView Branding Placeholder */}
        <div className="absolute bottom-4 left-4 text-slate-600 text-xs font-medium">
          TradingView Chart
        </div>
      </div>
    </div>
  );
}

function FuturesOrderForm({ 
  orderType, 
  setOrderType, 
  price, 
  setPrice, 
  amount, 
  setAmount,
  sliderValue,
  setSliderValue,
  leverage,
  setLeverage,
  marginMode,
  setMarginMode
}: {
  orderType: string;
  setOrderType: (type: string) => void;
  price: string;
  setPrice: (price: string) => void;
  amount: string;
  setAmount: (amount: string) => void;
  sliderValue: number;
  setSliderValue: (value: number) => void;
  leverage: number;
  setLeverage: (value: number) => void;
  marginMode: 'cross' | 'isolated';
  setMarginMode: (mode: 'cross' | 'isolated') => void;
}) {
  const total = price && amount ? (parseFloat(price) * parseFloat(amount)).toFixed(2) : "0.00";
  const LEVERAGE_MARKS = [1, 5, 10, 25, 50, 75, 100];

  return (
    <div className="flex flex-col h-full">
      {/* Margin Mode Toggle */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
        <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-lg">
          <button
            onClick={() => setMarginMode('cross')}
            className={cn(
              "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
              marginMode === 'cross'
                ? "bg-[#FCD535] text-black"
                : "text-slate-400 hover:text-white"
            )}
          >
            Cross
          </button>
          <button
            onClick={() => setMarginMode('isolated')}
            className={cn(
              "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
              marginMode === 'isolated'
                ? "bg-[#FCD535] text-black"
                : "text-slate-400 hover:text-white"
            )}
          >
            Isolated
          </button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Leverage</span>
          <span className="px-2 py-1 bg-slate-900 border border-slate-700 rounded text-sm font-mono text-[#FCD535]">
            {leverage}x
          </span>
        </div>
      </div>

      {/* Leverage Slider */}
      <div className="px-4 py-3 border-b border-slate-800">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-slate-500">Leverage</span>
          <span className="text-sm font-mono text-white">{leverage}x</span>
        </div>
        <div className="relative">
          <input
            type="range"
            min="1"
            max="100"
            value={leverage}
            onChange={(e) => setLeverage(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#FCD535]"
            style={{
              background: `linear-gradient(to right, #FCD535 0%, #FCD535 ${leverage}%, #1e293b ${leverage}%, #1e293b 100%)`
            }}
          />
          <div className="flex justify-between mt-2">
            {LEVERAGE_MARKS.map((mark) => (
              <button
                key={mark}
                onClick={() => setLeverage(mark)}
                className={cn(
                  "text-[10px] font-mono px-1 py-0.5 rounded transition-colors",
                  leverage === mark 
                    ? "text-[#FCD535] bg-[#FCD535]/10" 
                    : "text-slate-500 hover:text-slate-300"
                )}
              >
                {mark}x
              </button>
            ))}
          </div>
        </div>
        {leverage >= 50 && (
          <div className="flex items-center gap-1.5 mt-2 px-2 py-1.5 bg-red-500/10 border border-red-500/30 rounded text-xs text-red-400">
            <AlertTriangle className="w-3 h-3" />
            High leverage risk
          </div>
        )}
      </div>

      {/* Order Type Tabs */}
      <div className="flex border-b border-slate-800">
        {ORDER_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setOrderType(tab)}
            className={cn(
              "flex-1 py-3 text-sm font-medium transition-colors relative",
              orderType === tab 
                ? "text-white" 
                : "text-slate-500 hover:text-slate-300"
            )}
          >
            {tab}
            {orderType === tab && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FCD535]" />
            )}
          </button>
        ))}
      </div>

      {/* Order Form */}
      <div className="flex-1 p-4 flex flex-col gap-4 overflow-y-auto">
        {/* Available Balance */}
        <div className="flex justify-between text-xs">
          <span className="text-slate-500">Available</span>
          <span className="text-slate-300">10,000.00 <span className="text-slate-500">USDT</span></span>
        </div>

        {/* Price Input */}
        {orderType !== "Market" && (
          <div className="space-y-1.5">
            <label className="text-xs text-slate-500">Price (USDT)</label>
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg overflow-hidden focus-within:border-[#FCD535]/50 transition-colors">
              <button 
                onClick={() => setPrice((parseFloat(price) - 0.01).toFixed(4))}
                className="p-3 text-slate-500 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="flex-1 bg-transparent text-center text-white font-mono text-sm py-3 outline-none"
              />
              <button 
                onClick={() => setPrice((parseFloat(price) + 0.01).toFixed(4))}
                className="p-3 text-slate-500 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Size Input */}
        <div className="space-y-1.5">
          <label className="text-xs text-slate-500">Size (SOL)</label>
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg overflow-hidden focus-within:border-[#FCD535]/50 transition-colors">
            <button 
              onClick={() => setAmount(Math.max(0, (parseFloat(amount) || 0) - 10).toString())}
              className="p-3 text-slate-500 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className="flex-1 bg-transparent text-center text-white font-mono text-sm py-3 outline-none placeholder:text-slate-600"
            />
            <button 
              onClick={() => setAmount(((parseFloat(amount) || 0) + 10).toString())}
              className="p-3 text-slate-500 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Percentage Slider */}
        <div className="space-y-2">
          <input
            type="range"
            min="0"
            max="100"
            value={sliderValue}
            onChange={(e) => setSliderValue(parseInt(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#FCD535]"
            style={{
              background: `linear-gradient(to right, #FCD535 0%, #FCD535 ${sliderValue}%, #1e293b ${sliderValue}%, #1e293b 100%)`
            }}
          />
          <div className="flex justify-between">
            {[0, 25, 50, 75, 100].map((val) => (
              <button
                key={val}
                onClick={() => setSliderValue(val)}
                className={cn(
                  "text-[10px] font-medium px-2 py-1 rounded transition-colors",
                  sliderValue === val 
                    ? "bg-[#FCD535]/20 text-[#FCD535]" 
                    : "text-slate-500 hover:text-slate-300"
                )}
              >
                {val}%
              </button>
            ))}
          </div>
        </div>

        {/* Order Info */}
        <div className="space-y-2 py-2 border-t border-slate-800/50">
          <div className="flex justify-between text-xs">
            <span className="text-slate-500">Cost</span>
            <span className="text-slate-300 font-mono">{(parseFloat(total) / leverage).toFixed(2)} USDT</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-slate-500">Max Position</span>
            <span className="text-slate-300 font-mono">{(10000 * leverage / 145.20).toFixed(0)} SOL</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-auto pt-2">
          <button className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg transition-colors">
            Open Long
          </button>
          <button className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors">
            Open Short
          </button>
        </div>
      </div>
    </div>
  );
}

function BottomTables({ 
  activeTab, 
  setActiveTab,
  positions,
  openOrders,
  tradeHistory
}: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  positions: any[];
  openOrders: any[];
  tradeHistory: any[];
}) {
  return (
    <div className="flex flex-col">
      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800">
        <div className="flex">
          {BOTTOM_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-4 py-3 text-sm font-medium transition-colors relative",
                activeTab === tab 
                  ? "text-white" 
                  : "text-slate-500 hover:text-slate-300"
              )}
            >
              {tab}
              {tab === "Positions" && positions.length > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 text-[10px] bg-[#FCD535] text-black rounded-full">
                  {positions.length}
                </span>
              )}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FCD535]" />
              )}
            </button>
          ))}
        </div>
        {activeTab === "Positions" && positions.length > 0 && (
          <button className="mr-4 px-3 py-1.5 text-xs font-medium text-red-400 hover:text-red-300 border border-red-500/30 hover:border-red-500/50 rounded transition-colors">
            Close All
          </button>
        )}
      </div>

      {/* Table Content */}
      <div className="max-h-[200px] overflow-y-auto">
        {activeTab === "Positions" && (
          <table className="w-full">
            <thead className="sticky top-0 bg-slate-950">
              <tr className="text-xs text-slate-500">
                <th className="text-left px-4 py-3 font-medium">Symbol</th>
                <th className="text-left px-4 py-3 font-medium">Side</th>
                <th className="text-right px-4 py-3 font-medium">Size</th>
                <th className="text-right px-4 py-3 font-medium">Entry Price</th>
                <th className="text-right px-4 py-3 font-medium">Mark Price</th>
                <th className="text-right px-4 py-3 font-medium">Liq. Price</th>
                <th className="text-right px-4 py-3 font-medium">Margin Ratio</th>
                <th className="text-right px-4 py-3 font-medium">Margin</th>
                <th className="text-right px-4 py-3 font-medium">Unrealized PNL</th>
                <th className="text-center px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {positions.map((position) => (
                <tr key={position.id} className="text-sm hover:bg-slate-900/30">
                  <td className="px-4 py-3 text-white font-medium">{position.symbol}</td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      "px-2 py-0.5 text-xs font-medium rounded",
                      position.side === "Long" 
                        ? "bg-emerald-500/20 text-emerald-400" 
                        : "bg-red-500/20 text-red-400"
                    )}>
                      {position.side}
                    </span>
                  </td>
                  <td className="text-right px-4 py-3 font-mono text-slate-300">{position.size}</td>
                  <td className="text-right px-4 py-3 font-mono text-slate-300">{position.entryPrice}</td>
                  <td className="text-right px-4 py-3 font-mono text-slate-300">{position.markPrice}</td>
                  <td className="text-right px-4 py-3 font-mono text-red-400">{position.liqPrice}</td>
                  <td className="text-right px-4 py-3 font-mono text-slate-300">{position.marginRatio}</td>
                  <td className="text-right px-4 py-3 font-mono text-slate-300">{position.margin}</td>
                  <td className="text-right px-4 py-3">
                    <div className={cn("font-mono", position.isProfit ? "text-emerald-400" : "text-red-400")}>
                      {position.unrealizedPnl}
                      <span className="text-xs ml-1 opacity-75">{position.pnlPercent}</span>
                    </div>
                  </td>
                  <td className="text-center px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button className="px-2 py-1 text-xs text-slate-400 hover:text-white border border-slate-700 hover:border-slate-600 rounded transition-colors">
                        TP/SL
                      </button>
                      <button className="px-2 py-1 text-xs text-red-400 hover:text-red-300 border border-red-500/30 hover:border-red-500/50 rounded transition-colors">
                        Close
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === "Open Orders" && (
          <table className="w-full">
            <thead className="sticky top-0 bg-slate-950">
              <tr className="text-xs text-slate-500">
                <th className="text-left px-4 py-3 font-medium">Symbol</th>
                <th className="text-left px-4 py-3 font-medium">Type</th>
                <th className="text-left px-4 py-3 font-medium">Side</th>
                <th className="text-right px-4 py-3 font-medium">Price</th>
                <th className="text-right px-4 py-3 font-medium">Amount</th>
                <th className="text-right px-4 py-3 font-medium">Leverage</th>
                <th className="text-right px-4 py-3 font-medium">Time</th>
                <th className="text-center px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {openOrders.map((order) => (
                <tr key={order.id} className="text-sm hover:bg-slate-900/30">
                  <td className="px-4 py-3 text-white font-medium">{order.symbol}</td>
                  <td className="px-4 py-3 text-slate-300">{order.type}</td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      "px-2 py-0.5 text-xs font-medium rounded",
                      order.side === "Long" 
                        ? "bg-emerald-500/20 text-emerald-400" 
                        : "bg-red-500/20 text-red-400"
                    )}>
                      {order.side}
                    </span>
                  </td>
                  <td className="text-right px-4 py-3 font-mono text-slate-300">{order.price}</td>
                  <td className="text-right px-4 py-3 font-mono text-slate-300">{order.amount}</td>
                  <td className="text-right px-4 py-3 font-mono text-[#FCD535]">{order.leverage}</td>
                  <td className="text-right px-4 py-3 text-slate-500 text-xs">{order.time}</td>
                  <td className="text-center px-4 py-3">
                    <button className="p-1 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === "Trade History" && (
          <table className="w-full">
            <thead className="sticky top-0 bg-slate-950">
              <tr className="text-xs text-slate-500">
                <th className="text-left px-4 py-3 font-medium">Price (USDT)</th>
                <th className="text-right px-4 py-3 font-medium">Size</th>
                <th className="text-right px-4 py-3 font-medium">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {tradeHistory.map((trade, idx) => (
                <tr key={idx} className="text-sm hover:bg-slate-900/30">
                  <td className={cn(
                    "px-4 py-2 font-mono",
                    trade.side === "buy" ? "text-emerald-400" : "text-red-400"
                  )}>
                    {trade.price}
                  </td>
                  <td className="text-right px-4 py-2 font-mono text-slate-300">{trade.amount}</td>
                  <td className="text-right px-4 py-2 text-slate-500 text-xs">{trade.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Empty States */}
        {activeTab === "Positions" && positions.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-slate-500">
            <BarChart3 className="w-8 h-8 mb-2 opacity-50" />
            <span className="text-sm">No open positions</span>
          </div>
        )}
        {activeTab === "Open Orders" && openOrders.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-slate-500">
            <Clock className="w-8 h-8 mb-2 opacity-50" />
            <span className="text-sm">No open orders</span>
          </div>
        )}
      </div>
    </div>
  );
}
