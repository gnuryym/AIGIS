import React, { useState } from 'react';
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
  Plus
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import solIcon from '@/assets/SOL.png';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Mock Data
const tradingPairInfo = {
  pair: "SOL/USDT",
  lastPrice: 145.20,
  priceChange: 8.45,
  high24h: 152.00,
  low24h: 138.50,
  volume24h: "1.8B",
  volumeQuote: "260.5B"
};

const generateOrderBookData = (basePrice: number, count: number, type: 'ask' | 'bid') => {
  const data = [];
  for (let i = 0; i < count; i++) {
    const offset = type === 'ask' ? (i + 1) * (Math.random() * 15 + 5) : -(i + 1) * (Math.random() * 15 + 5);
    const price = basePrice + offset;
    const amount = Math.random() * 2 + 0.1;
    const total = price * amount;
    data.push({ 
      price: price.toFixed(2), 
      amount: amount.toFixed(4), 
      total: total.toFixed(2),
      depth: Math.random() * 100 
    });
  }
  return type === 'ask' ? data.reverse() : data;
};

const asks = generateOrderBookData(145.20, 12, 'ask');
const bids = generateOrderBookData(145.20, 12, 'bid');

const openOrders = [
  { id: 1, pair: "SOL/USDT", type: "Limit", side: "Buy", price: "140.00", amount: "50.00", filled: "0%", total: "7000.00", time: "2026-04-02 10:30:22" },
  { id: 2, pair: "SOL/USDT", type: "Stop-Limit", side: "Sell", price: "160.00", amount: "25.00", filled: "0%", total: "4000.00", time: "2026-04-02 09:15:45" },
];

const orderHistory = [
  { id: 1, pair: "SOL/USDT", type: "Limit", side: "Buy", price: "135.00", amount: "100.00", status: "Filled", total: "13500.00", time: "2026-04-01 14:22:10" },
  { id: 2, pair: "ETH/USDT", type: "Market", side: "Sell", price: "3451.90", amount: "2.0000", status: "Filled", total: "6,903.80", time: "2026-04-01 12:05:33" },
  { id: 3, pair: "BTC/USDT", type: "Limit", side: "Buy", price: "66800.00", amount: "0.1500", status: "Cancelled", total: "10,020.00", time: "2026-03-31 18:44:55" },
];

const tradeHistory = [
  { price: "145.20", amount: "123.5", time: "10:45:22", side: "buy" },
  { price: "145.18", amount: "45.2", time: "10:45:20", side: "sell" },
  { price: "145.25", amount: "89.0", time: "10:45:18", side: "buy" },
  { price: "145.15", amount: "350.0", time: "10:45:15", side: "sell" },
  { price: "145.22", amount: "67.8", time: "10:45:12", side: "buy" },
  { price: "145.10", amount: "125.4", time: "10:45:10", side: "sell" },
  { price: "145.30", amount: "21.5", time: "10:45:08", side: "buy" },
  { price: "145.05", amount: "89.0", time: "10:45:05", side: "sell" },
];

const TIME_FRAMES = ["1m", "5m", "15m", "1H", "4H", "1D", "1W"];
const ORDER_TABS = ["Limit", "Market", "Stop-Limit"];
const BOTTOM_TABS = ["Открытые ордера", "История ордеров", "История торгов"];

export function TradePage() {
  const [selectedTimeFrame, setSelectedTimeFrame] = useState("1H");
  const [orderType, setOrderType] = useState("Limit");
  const [bottomTab, setBottomTab] = useState("Открытые ордера");
  const [sliderValue, setSliderValue] = useState(0);
  const [price, setPrice] = useState("145.20");
  const [amount, setAmount] = useState("");

  const isPositive = tradingPairInfo.priceChange >= 0;

  return (
    <main className="flex-1 flex flex-col w-full bg-slate-950">
      {/* Top Bar */}
      <TopBar data={tradingPairInfo} isPositive={isPositive} />

      {/* Main Trading Area */}
      <div className="flex flex-col lg:flex-row flex-1 gap-px bg-slate-800/50">
        
        {/* Left Column - Order Book (20%) */}
        <div className="w-full lg:w-[20%] bg-slate-950 flex flex-col min-h-[400px] lg:min-h-0">
          <OrderBook asks={asks} bids={bids} lastPrice={tradingPairInfo.lastPrice} />
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
          <OrderEntryForm
            orderType={orderType}
            setOrderType={setOrderType}
            price={price}
            setPrice={setPrice}
            amount={amount}
            setAmount={setAmount}
            sliderValue={sliderValue}
            setSliderValue={setSliderValue}
          />
        </div>
      </div>

      {/* Bottom Section - Orders Tables */}
      <div className="bg-slate-950 border-t border-slate-800">
        <BottomTables 
          activeTab={bottomTab} 
          setActiveTab={setBottomTab}
          openOrders={openOrders}
          orderHistory={orderHistory}
          tradeHistory={tradeHistory}
        />
      </div>
    </main>
  );
}

// --- Components ---

function TopBar({ data, isPositive }: { data: typeof tradingPairInfo; isPositive: boolean }) {
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
      <div className="flex flex-wrap items-center gap-6 lg:gap-10">
        {/* Last Price */}
        <div>
          <div className={cn(
            "text-2xl font-mono font-bold",
            isPositive ? "text-emerald-400" : "text-red-400"
          )}>
            {data.lastPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-slate-500">
            ≈ ${data.lastPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
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
            {data.high24h.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
        </div>

        {/* 24h Low */}
        <div>
          <div className="text-xs text-slate-500 mb-1">24h Low</div>
          <div className="font-mono text-sm text-white">
            {data.low24h.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
        </div>

        {/* 24h Volume */}
        <div>
          <div className="text-xs text-slate-500 mb-1">24h Volume(SOL)</div>
          <div className="font-mono text-sm text-white">{data.volume24h}</div>
        </div>

        {/* 24h Volume Quote */}
        <div>
          <div className="text-xs text-slate-500 mb-1">24h Volume(USDT)</div>
          <div className="font-mono text-sm text-white">{data.volumeQuote}</div>
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
        <span className="text-sm font-medium text-white">Книга ордеров</span>
        <div className="flex items-center gap-2">
          <button className="p-1 text-slate-500 hover:text-white transition-colors">
            <BarChart3 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Column Headers */}
      <div className="grid grid-cols-3 text-xs text-slate-500 px-3 py-2 border-b border-slate-800/50">
        <span>Цена(USDT)</span>
        <span className="text-right">Кол-во(SOL)</span>
        <span className="text-right">Всего</span>
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
              <span className="text-slate-300 font-mono text-right relative z-10">{order.amount}</span>
              <span className="text-slate-500 font-mono text-right relative z-10">{Number(order.total).toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Spread / Last Price */}
      <div className="px-3 py-2 border-y border-slate-800 bg-slate-900/50">
        <div className="flex items-center justify-between">
          <span className="text-lg font-mono font-bold text-emerald-400">
            {lastPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
          <span className="text-xs text-slate-500">
            Спред: 0.01%
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
              <span className="text-slate-300 font-mono text-right relative z-10">{order.amount}</span>
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
              <pattern id="grid" width="60" height="40" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 40" fill="none" stroke="#334155" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Mock Candlestick Chart */}
        <div className="absolute inset-4 flex items-end justify-around gap-1">
          {Array.from({ length: 40 }).map((_, i) => {
            const isGreen = Math.random() > 0.45;
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
          <span className="px-2">156.00</span>
          <span className="px-2">152.00</span>
          <span className="px-2">148.00</span>
          <span className="px-2 text-emerald-400">145.20</span>
          <span className="px-2">142.00</span>
          <span className="px-2">139.00</span>
          <span className="px-2">135.00</span>
        </div>

        {/* Current Price Line */}
        <div className="absolute left-0 right-16 top-[45%] border-t border-dashed border-emerald-500/50 pointer-events-none">
          <span className="absolute right-0 -top-2.5 bg-emerald-500 text-black text-xs font-mono px-2 py-0.5 rounded-l">
            145.20
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

function OrderEntryForm({ 
  orderType, 
  setOrderType, 
  price, 
  setPrice, 
  amount, 
  setAmount,
  sliderValue,
  setSliderValue
}: {
  orderType: string;
  setOrderType: (type: string) => void;
  price: string;
  setPrice: (price: string) => void;
  amount: string;
  setAmount: (amount: string) => void;
  sliderValue: number;
  setSliderValue: (value: number) => void;
}) {
  const total = price && amount ? (parseFloat(price) * parseFloat(amount)).toFixed(2) : "0.00";

  return (
    <div className="flex flex-col h-full">
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
      <div className="flex-1 p-4 flex flex-col gap-4">
        {/* Available Balance */}
        <div className="flex justify-between text-xs">
          <span className="text-slate-500">Доступно</span>
          <span className="text-slate-300">10,000.00 <span className="text-slate-500">USDT</span></span>
        </div>

        {/* Price Input */}
        {orderType !== "Market" && (
          <div className="space-y-1.5">
            <label className="text-xs text-slate-500">Цена (USDT)</label>
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg overflow-hidden focus-within:border-[#FCD535]/50 transition-colors">
              <button 
                onClick={() => setPrice((parseFloat(price) - 10).toFixed(2))}
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
                onClick={() => setPrice((parseFloat(price) + 10).toFixed(2))}
                className="p-3 text-slate-500 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Stop Price for Stop-Limit */}
        {orderType === "Stop-Limit" && (
          <div className="space-y-1.5">
            <label className="text-xs text-slate-500">Stop Цена (USDT)</label>
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg overflow-hidden focus-within:border-[#FCD535]/50 transition-colors">
              <input
                type="text"
                placeholder="0.00"
                className="flex-1 bg-transparent text-center text-white font-mono text-sm py-3 outline-none px-4"
              />
            </div>
          </div>
        )}

        {/* Amount Input */}
        <div className="space-y-1.5">
          <label className="text-xs text-slate-500">Количество (SOL)</label>
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg overflow-hidden focus-within:border-[#FCD535]/50 transition-colors">
            <button 
              onClick={() => setAmount((Math.max(0, parseFloat(amount || "0") - 1)).toFixed(2))}
              className="p-3 text-slate-500 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.0000"
              className="flex-1 bg-transparent text-center text-white font-mono text-sm py-3 outline-none"
            />
            <button 
              onClick={() => setAmount((parseFloat(amount || "0") + 1).toFixed(2))}
              className="p-3 text-slate-500 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Percentage Slider */}
        <div className="space-y-3">
          <input
            type="range"
            min="0"
            max="100"
            value={sliderValue}
            onChange={(e) => setSliderValue(parseInt(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-full appearance-none cursor-pointer
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:w-4
              [&::-webkit-slider-thumb]:h-4
              [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:bg-[#FCD535]
              [&::-webkit-slider-thumb]:cursor-pointer
              [&::-webkit-slider-thumb]:border-2
              [&::-webkit-slider-thumb]:border-slate-950
              [&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(252,213,53,0.5)]"
          />
          <div className="flex justify-between">
            {[0, 25, 50, 75, 100].map((pct) => (
              <button
                key={pct}
                onClick={() => setSliderValue(pct)}
                className={cn(
                  "text-xs px-2 py-1 rounded transition-colors",
                  sliderValue === pct 
                    ? "bg-[#FCD535]/20 text-[#FCD535]" 
                    : "text-slate-500 hover:text-white"
                )}
              >
                {pct}%
              </button>
            ))}
          </div>
        </div>

        {/* Total */}
        <div className="flex justify-between text-sm py-2 border-t border-slate-800">
          <span className="text-slate-500">Всего</span>
          <span className="text-white font-mono">{parseFloat(total).toLocaleString()} USDT</span>
        </div>

        <div className="flex gap-3 mt-auto pt-2">
          <button className="flex-1 py-3.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-sm transition-colors shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:shadow-[0_0_25px_rgba(16,185,129,0.4)]">
            Купить SOL
          </button>
          <button className="flex-1 py-3.5 rounded-lg bg-red-500 hover:bg-red-400 text-white font-semibold text-sm transition-colors shadow-[0_0_15px_rgba(239,68,68,0.2)] hover:shadow-[0_0_25px_rgba(239,68,68,0.4)]">
            Продать SOL
          </button>
        </div>
      </div>
    </div>
  );
}

function BottomTables({ 
  activeTab, 
  setActiveTab, 
  openOrders, 
  orderHistory, 
  tradeHistory 
}: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openOrders: any[];
  orderHistory: any[];
  tradeHistory: any[];
}) {
  return (
    <div className="flex flex-col">
      {/* Tabs */}
      <div className="flex items-center gap-6 px-4 border-b border-slate-800">
        {BOTTOM_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "py-3 text-sm font-medium transition-colors relative",
              activeTab === tab 
                ? "text-white" 
                : "text-slate-500 hover:text-slate-300"
            )}
          >
            {tab}
            {tab === "Открытые ордера" && openOrders.length > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 bg-[#FCD535]/20 text-[#FCD535] text-xs rounded">
                {openOrders.length}
              </span>
            )}
            {activeTab === tab && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FCD535]" />
            )}
          </button>
        ))}
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto max-h-[200px] overflow-y-auto">
        {activeTab === "Открытые ордера" && (
          <table className="w-full text-xs">
            <thead className="sticky top-0 bg-slate-950">
              <tr className="text-slate-500 border-b border-slate-800">
                <th className="text-left py-3 px-4 font-medium">Дата</th>
                <th className="text-left py-3 px-4 font-medium">Пара</th>
                <th className="text-left py-3 px-4 font-medium">Тип</th>
                <th className="text-left py-3 px-4 font-medium">Сторона</th>
                <th className="text-right py-3 px-4 font-medium">Цена</th>
                <th className="text-right py-3 px-4 font-medium">Кол-во</th>
                <th className="text-right py-3 px-4 font-medium">Исполнено</th>
                <th className="text-right py-3 px-4 font-medium">Всего</th>
                <th className="text-center py-3 px-4 font-medium">Действие</th>
              </tr>
            </thead>
            <tbody>
              {openOrders.map((order) => (
                <tr key={order.id} className="border-b border-slate-800/50 hover:bg-slate-900/50 transition-colors">
                  <td className="py-3 px-4 text-slate-400">{order.time}</td>
                  <td className="py-3 px-4 text-white">{order.pair}</td>
                  <td className="py-3 px-4 text-slate-300">{order.type}</td>
                  <td className={cn("py-3 px-4 font-medium", order.side === "Buy" ? "text-emerald-400" : "text-red-400")}>
                    {order.side}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-white">{order.price}</td>
                  <td className="py-3 px-4 text-right font-mono text-slate-300">{order.amount}</td>
                  <td className="py-3 px-4 text-right text-slate-500">{order.filled}</td>
                  <td className="py-3 px-4 text-right font-mono text-white">{order.total}</td>
                  <td className="py-3 px-4 text-center">
                    <button className="text-red-400 hover:text-red-300 transition-colors">Отменить</button>
                  </td>
                </tr>
              ))}
              {openOrders.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-500">Нет открытых ордеров</td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        {activeTab === "История ордеров" && (
          <table className="w-full text-xs">
            <thead className="sticky top-0 bg-slate-950">
              <tr className="text-slate-500 border-b border-slate-800">
                <th className="text-left py-3 px-4 font-medium">Дата</th>
                <th className="text-left py-3 px-4 font-medium">Пара</th>
                <th className="text-left py-3 px-4 font-medium">Тип</th>
                <th className="text-left py-3 px-4 font-medium">Сторона</th>
                <th className="text-right py-3 px-4 font-medium">Цена</th>
                <th className="text-right py-3 px-4 font-medium">Кол-во</th>
                <th className="text-right py-3 px-4 font-medium">Всего</th>
                <th className="text-center py-3 px-4 font-medium">Статус</th>
              </tr>
            </thead>
            <tbody>
              {orderHistory.map((order) => (
                <tr key={order.id} className="border-b border-slate-800/50 hover:bg-slate-900/50 transition-colors">
                  <td className="py-3 px-4 text-slate-400">{order.time}</td>
                  <td className="py-3 px-4 text-white">{order.pair}</td>
                  <td className="py-3 px-4 text-slate-300">{order.type}</td>
                  <td className={cn("py-3 px-4 font-medium", order.side === "Buy" ? "text-emerald-400" : "text-red-400")}>
                    {order.side}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-white">{order.price}</td>
                  <td className="py-3 px-4 text-right font-mono text-slate-300">{order.amount}</td>
                  <td className="py-3 px-4 text-right font-mono text-white">{order.total}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={cn(
                      "px-2 py-1 rounded text-xs",
                      order.status === "Filled" ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-700 text-slate-400"
                    )}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === "История торгов" && (
          <table className="w-full text-xs">
            <thead className="sticky top-0 bg-slate-950">
              <tr className="text-slate-500 border-b border-slate-800">
                <th className="text-left py-3 px-4 font-medium">Время</th>
                <th className="text-right py-3 px-4 font-medium">Цена(USDT)</th>
                <th className="text-right py-3 px-4 font-medium">Кол-во(SOL)</th>
              </tr>
            </thead>
            <tbody>
              {tradeHistory.map((trade, idx) => (
                <tr key={idx} className="border-b border-slate-800/50 hover:bg-slate-900/50 transition-colors">
                  <td className="py-2 px-4 text-slate-400">{trade.time}</td>
                  <td className={cn(
                    "py-2 px-4 text-right font-mono",
                    trade.side === "buy" ? "text-emerald-400" : "text-red-400"
                  )}>
                    {trade.price}
                  </td>
                  <td className="py-2 px-4 text-right font-mono text-slate-300">{trade.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
