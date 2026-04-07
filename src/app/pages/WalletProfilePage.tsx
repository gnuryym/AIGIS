import React, { useState } from 'react';
import { 
  Eye, 
  EyeOff, 
  Shield, 
  CheckCircle, 
  LogOut, 
  ArrowDownToLine, 
  ArrowUpFromLine, 
  ArrowLeftRight,
  Wallet,
  CreditCard,
  Lock,
  User,
  Mail,
  Calendar,
  Loader2,
  ChevronDown,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useAuth } from '../context/AuthContext';
import solIcon from '@/assets/SOL.png';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Mock asset data
const assets = [
  { 
    symbol: 'SOL', 
    name: 'Solana', 
    balance: 6887.05, 
    usdValue: 1000000.00,
    change24h: 8.45,
    icon: null
  },
  { 
    symbol: 'USDT', 
    name: 'Tether USD', 
    balance: 25000.00, 
    usdValue: 25000.00,
    change24h: 0.01,
    icon: null
  },
  { 
    symbol: 'BTC', 
    name: 'Bitcoin', 
    balance: 0.36538, 
    usdValue: 25000.00,
    change24h: 2.34,
    icon: null
  },
];

export function WalletProfilePage() {
  const { isLoggedIn, login, logout, userData } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showBalance, setShowBalance] = useState(true);
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('register');
  
  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    age: '',
  });

  const handleRegister = async () => {
    setIsLoading(true);
    // Simulate KYC verification
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    login({
      firstName: formData.firstName || 'Alex',
      lastName: formData.lastName || 'Smith',
      email: formData.email || 'alex.smith@example.com'
    });
  };

  const handleDisconnect = () => {
    logout();
    setFormData({
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      age: '',
    });
  };

  const totalBalance = assets.reduce((sum, asset) => sum + asset.usdValue, 0);

  if (isLoggedIn) {
    return <LoggedInView 
      showBalance={showBalance} 
      setShowBalance={setShowBalance}
      totalBalance={totalBalance}
      assets={assets}
      onDisconnect={handleDisconnect}
      userName={userData ? `${userData.firstName} ${userData.lastName}` : 'Alex Smith'}
    />;
  }

  return (
    <LoggedOutView 
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      formData={formData}
      setFormData={setFormData}
      isLoading={isLoading}
      onRegister={handleRegister}
    />
  );
}

// ============================================
// LOGGED OUT VIEW - Registration & KYC Flow
// ============================================

interface LoggedOutViewProps {
  activeTab: 'login' | 'register';
  setActiveTab: (tab: 'login' | 'register') => void;
  formData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    age: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<{
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    age: string;
  }>>;
  isLoading: boolean;
  onRegister: () => void;
}

function LoggedOutView({ 
  activeTab, 
  setActiveTab, 
  formData, 
  setFormData,
  isLoading,
  onRegister 
}: LoggedOutViewProps) {
  return (
    <div className="flex-1 flex items-center justify-center p-6 min-h-[calc(100vh-80px)]">
      {/* Glassmorphism Card */}
      <div className="w-full max-w-md">
        <div className="relative">
          {/* Glow effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-[#FCD535]/20 via-emerald-500/20 to-[#FCD535]/20 rounded-2xl blur-xl opacity-50" />
          
          <div className="relative bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-400 to-[#FCD535] flex items-center justify-center transform rotate-12">
                  <div className="w-5 h-5 bg-black transform -rotate-12 rounded-sm" />
                </div>
                <span className="text-2xl font-bold tracking-tighter bg-gradient-to-r from-emerald-400 via-emerald-200 to-[#FCD535] bg-clip-text text-transparent">
                  AIGIS
                </span>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 p-1 bg-black/50 rounded-lg mb-6">
              {(['login', 'register'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "flex-1 py-2.5 text-sm font-medium rounded-md transition-all",
                    activeTab === tab 
                      ? "bg-slate-800 text-white shadow" 
                      : "text-slate-400 hover:text-white"
                  )}
                >
                  {tab === 'login' ? 'Вход' : 'Регистрация'}
                </button>
              ))}
            </div>

            {activeTab === 'login' ? (
              <LoginForm formData={formData} setFormData={setFormData} onSubmit={onRegister} isLoading={isLoading} />
            ) : (
              <RegisterForm formData={formData} setFormData={setFormData} onSubmit={onRegister} isLoading={isLoading} />
            )}
          </div>
        </div>

        {/* Footer text */}
        <p className="text-center text-slate-500 text-xs mt-6">
          Продолжая, вы соглашаетесь с Условиями использования и Политикой конфиденциальности AIGIS
        </p>
      </div>
    </div>
  );
}

interface FormProps {
  formData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    age: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<{
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    age: string;
  }>>;
  onSubmit: () => void;
  isLoading: boolean;
}

function LoginForm({ formData, setFormData, onSubmit, isLoading }: FormProps) {
  return (
    <div className="space-y-4">
      <InputField 
        icon={<Mail className="w-4 h-4" />}
        placeholder="Адрес электронной почты"
        type="email"
        value={formData.email}
        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
      />
      <InputField 
        icon={<Lock className="w-4 h-4" />}
        placeholder="Пароль"
        type="password"
        value={formData.password}
        onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
      />
      
      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
          <input type="checkbox" className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-[#FCD535] focus:ring-[#FCD535]/50" />
          Запомнить меня
        </label>
        <button className="text-[#FCD535] hover:text-[#FFE066] transition-colors">
          Забыли пароль?
        </button>
      </div>

      <button
        onClick={onSubmit}
        disabled={isLoading}
        className="w-full py-3.5 rounded-lg bg-[#FCD535] hover:bg-[#FFE066] text-black font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(252,213,53,0.3)] hover:shadow-[0_0_30px_rgba(252,213,53,0.5)] flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Вход...
          </>
        ) : (
          'Вход'
        )}
      </button>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/10" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="px-2 bg-slate-900 text-slate-500">или продолжите через</span>
        </div>
      </div>

      <Web3WalletButton />
    </div>
  );
}

function RegisterForm({ formData, setFormData, onSubmit, isLoading }: FormProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <InputField 
          icon={<User className="w-4 h-4" />}
          placeholder="Имя"
          value={formData.firstName}
          onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
        />
        <InputField 
          placeholder="Фамилия"
          value={formData.lastName}
          onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
        />
      </div>
      
      <InputField 
        icon={<Mail className="w-4 h-4" />}
        placeholder="Адрес электронной почты"
        type="email"
        value={formData.email}
        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
      />
      
      <InputField 
        icon={<Lock className="w-4 h-4" />}
        placeholder="Создайте пароль"
        type="password"
        value={formData.password}
        onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
      />
      
      <InputField 
        icon={<Calendar className="w-4 h-4" />}
        placeholder="Возраст"
        type="number"
        value={formData.age}
        onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
      />

      {/* Payment Linking Section */}
      <div className="pt-4 border-t border-white/10">
        <p className="text-xs text-slate-400 mb-3">Привязать способ оплаты</p>
        
        {/* Card Input Mock */}
        <div className="relative mb-3">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
            <CreditCard className="w-4 h-4" />
          </div>
          <input 
            type="text"
            placeholder="4242 4242 4242 4242"
            className="w-full pl-10 pr-20 py-3 bg-black/50 border border-white/10 rounded-lg text-white placeholder:text-slate-600 focus:outline-none focus:border-[#FCD535]/50 focus:ring-1 focus:ring-[#FCD535]/20 text-sm font-mono"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
            <div className="w-8 h-5 bg-gradient-to-r from-blue-600 to-blue-400 rounded text-[6px] text-white flex items-center justify-center font-bold">VISA</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <input 
            type="text"
            placeholder="MM/YY"
            className="px-3 py-3 bg-black/50 border border-white/10 rounded-lg text-white placeholder:text-slate-600 focus:outline-none focus:border-[#FCD535]/50 text-sm font-mono"
          />
          <input 
            type="text"
            placeholder="CVC"
            className="px-3 py-3 bg-black/50 border border-white/10 rounded-lg text-white placeholder:text-slate-600 focus:outline-none focus:border-[#FCD535]/50 text-sm font-mono"
          />
        </div>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-2 bg-slate-900 text-slate-500">или</span>
          </div>
        </div>

        <Web3WalletButton />
      </div>

      {/* KYC Notice */}
      <div className="flex items-start gap-2 p-3 bg-[#FCD535]/5 border border-[#FCD535]/20 rounded-lg">
        <Shield className="w-4 h-4 text-[#FCD535] mt-0.5 flex-shrink-0" />
        <p className="text-xs text-slate-400">
          <span className="text-[#FCD535] font-medium">Требуется KYC</span> - Ваша личность будет мгновенно проверена для доступа ко всем функциям торговли.
        </p>
      </div>

      <button
        onClick={onSubmit}
        disabled={isLoading}
        className="w-full py-3.5 rounded-lg bg-[#FCD535] hover:bg-[#FFE066] text-black font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(252,213,53,0.3)] hover:shadow-[0_0_30px_rgba(252,213,53,0.5)] flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Проверка KYC...
          </>
        ) : (
          <>
            <Shield className="w-4 h-4" />
            Пройти KYC и зарегистрироваться
          </>
        )}
      </button>
    </div>
  );
}

function InputField({ 
  icon, 
  placeholder, 
  type = 'text', 
  value, 
  onChange 
}: { 
  icon?: React.ReactNode; 
  placeholder: string; 
  type?: string; 
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="relative">
      {icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
          {icon}
        </div>
      )}
      <input 
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={cn(
          "w-full py-3 bg-black/50 border border-white/10 rounded-lg text-white placeholder:text-slate-600 focus:outline-none focus:border-[#FCD535]/50 focus:ring-1 focus:ring-[#FCD535]/20 text-sm transition-all",
          icon ? "pl-10 pr-4" : "px-4"
        )}
      />
    </div>
  );
}

function Web3WalletButton() {
  return (
    <button className="w-full py-3 rounded-lg border border-white/10 hover:border-[#FCD535]/50 bg-black/30 text-white font-medium text-sm transition-all flex items-center justify-center gap-3 group">
      <Wallet className="w-4 h-4 text-[#FCD535] group-hover:scale-110 transition-transform" />
      Подключить Web3 кошелек
      <ChevronDown className="w-4 h-4 text-slate-500" />
    </button>
  );
}

// ============================================
// LOGGED IN VIEW - Wallet & Profile Dashboard
// ============================================

interface LoggedInViewProps {
  showBalance: boolean;
  setShowBalance: (show: boolean) => void;
  totalBalance: number;
  assets: typeof assets;
  onDisconnect: () => void;
  userName: string;
}

function LoggedInView({ 
  showBalance, 
  setShowBalance, 
  totalBalance, 
  assets: assetList,
  onDisconnect,
  userName
}: LoggedInViewProps) {
  return (
    <div className="flex-1 p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Top Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="w-14 h-14 rounded-full bg-slate-950/80 backdrop-blur-md border border-[#FCD535]/60 shadow-[0_0_20px_rgba(252,213,53,0.35)] flex items-center justify-center shrink-0">
              <User className="w-7 h-7 text-[#FCD535]" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-white">{userName}</h1>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="flex items-center gap-1 px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs font-medium rounded-full">
                  <CheckCircle className="w-3 h-3" />
                  KYC Подтвержден
                </span>
                <span className="text-slate-500 text-xs">UID: 847291034</span>
              </div>
            </div>
          </div>
          
          <button 
            onClick={onDisconnect}
            className="flex items-center gap-2 px-4 py-2 border border-white/10 hover:border-red-500/50 rounded-lg text-slate-400 hover:text-red-400 text-sm transition-all"
          >
            <LogOut className="w-4 h-4" />
            Отключить
          </button>
        </div>

        {/* Main Balance Card */}
        <div className="relative mb-6">
          <div className="absolute -inset-1 bg-gradient-to-r from-[#FCD535]/10 via-emerald-500/10 to-[#FCD535]/10 rounded-2xl blur-xl opacity-50" />
          
          <div className="relative bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 lg:p-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
                  <span>Общий баланс</span>
                  <button 
                    onClick={() => setShowBalance(!showBalance)}
                    className="p-1 hover:bg-white/10 rounded transition-colors"
                  >
                    {showBalance ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl lg:text-5xl font-bold text-white tracking-tight">
                    {showBalance ? `$${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '••••••••'}
                  </span>
                  {showBalance && (
                    <span className="text-emerald-400 text-sm font-medium flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      +2.34%
                    </span>
                  )}
                </div>
                <p className="text-slate-500 text-sm mt-2">
                  {showBalance ? '≈ 14.89 BTC' : '••••'}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <ActionButton icon={<ArrowDownToLine className="w-4 h-4" />} label="Пополнение" primary />
                <ActionButton icon={<ArrowUpFromLine className="w-4 h-4" />} label="Вывод" />
                <ActionButton icon={<ArrowLeftRight className="w-4 h-4" />} label="Перевод" />
              </div>
            </div>
          </div>
        </div>

        {/* Asset Breakdown */}
        <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Ваши активы</h2>
            <button className="text-[#FCD535] text-sm hover:text-[#FFE066] transition-colors">
              Все активы
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-slate-500 border-b border-white/5">
                  <th className="px-6 py-3 font-medium">Актив</th>
                  <th className="px-6 py-3 font-medium text-right">Баланс</th>
                  <th className="px-6 py-3 font-medium text-right hidden sm:table-cell">Стоимость в USD</th>
                  <th className="px-6 py-3 font-medium text-right hidden md:table-cell">Изменение за 24ч</th>
                  <th className="px-6 py-3 font-medium text-right">Действие</th>
                </tr>
              </thead>
              <tbody>
                {assetList.map((asset, index) => (
                  <tr 
                    key={asset.symbol}
                    className={cn(
                      "hover:bg-white/5 transition-colors",
                      index !== assetList.length - 1 && "border-b border-white/5"
                    )}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="font-medium text-white flex items-center">
                            {asset.symbol === 'SOL' && (
                              <img src={solIcon} alt="SOL" className="w-6 h-6 rounded-full inline-block mr-2" />
                            )}
                            {asset.symbol}
                          </p>
                          <p className="text-xs text-slate-500">{asset.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-white font-medium">
                        {showBalance ? asset.balance.toLocaleString('en-US', { 
                          minimumFractionDigits: asset.symbol === 'USDT' ? 2 : asset.symbol === 'AIGIS' ? 0 : 5 
                        }) : '••••'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right hidden sm:table-cell">
                      <span className="text-slate-300">
                        {showBalance ? `$${asset.usdValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '••••'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right hidden md:table-cell">
                      <span className={cn(
                        "flex items-center justify-end gap-1 text-sm font-medium",
                        asset.change24h >= 0 ? "text-emerald-400" : "text-red-400"
                      )}>
                        {asset.change24h >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {asset.change24h >= 0 ? '+' : ''}{asset.change24h}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="px-3 py-1.5 text-xs font-medium text-[#FCD535] hover:bg-[#FCD535]/10 rounded transition-colors">
                          Торговля
                        </button>
                        <button className="px-3 py-1.5 text-xs font-medium text-slate-400 hover:bg-white/10 rounded transition-colors">
                          Детали
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <StatCard label="Spot Баланс" value={showBalance ? '$875,000' : '••••'} />
          <StatCard label="Futures Баланс" value={showBalance ? '$125,000' : '••••'} />
          <StatCard label="Earn Баланс" value={showBalance ? '$50,000' : '••••'} />
          <StatCard label="PnL за сегодня" value={showBalance ? '+$2,340' : '••••'} positive />
        </div>
      </div>
    </div>
  );
}

function ActionButton({ 
  icon, 
  label, 
  primary 
}: { 
  icon: React.ReactNode; 
  label: string; 
  primary?: boolean;
}) {
  return (
    <button className={cn(
      "flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-all",
      primary 
        ? "bg-[#FCD535] hover:bg-[#FFE066] text-black shadow-[0_0_15px_rgba(252,213,53,0.2)]"
        : "border border-[#FCD535]/50 text-[#FCD535] hover:bg-[#FCD535]/10"
    )}>
      {icon}
      {label}
    </button>
  );
}

function StatCard({ 
  label, 
  value, 
  positive 
}: { 
  label: string; 
  value: string; 
  positive?: boolean;
}) {
  return (
    <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-xl p-4">
      <p className="text-slate-500 text-xs mb-1">{label}</p>
      <p className={cn(
        "text-lg font-semibold",
        positive ? "text-emerald-400" : "text-white"
      )}>
        {value}
      </p>
    </div>
  );
}
