import React, { useState } from 'react';
import { Outlet, NavLink as RouterNavLink, useNavigate } from 'react-router';
import { Search, Menu, User, ChevronDown, LogOut, Wallet } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { AuthProvider, useAuth } from './context/AuthContext';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function Layout() {
  const [isAttackMode, setIsAttackMode] = useState(false);

  return (
    <AuthProvider>
      <div className="min-h-screen bg-black text-slate-300 font-sans overflow-x-hidden relative selection:bg-[#FCD535]/30 selection:text-black pb-12">
        <BackgroundEffects />
        
        <div className="relative z-10 flex flex-col min-h-screen max-w-[1400px] mx-auto">
          <NavBar />
          
          {/* Pass the attack state to the child routes so they can share it */}
          <Outlet context={{ isAttackMode, setIsAttackMode }} />
        </div>
      </div>
    </AuthProvider>
  );
}

function NavBar() {
  const { isLoggedIn, userData, logout } = useAuth();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleConnectWallet = () => {
    navigate('/wallet');
  };

  const handleLogout = () => {
    logout();
    setShowProfileMenu(false);
  };

  const userName = userData ? `${userData.firstName} ${userData.lastName}` : 'Alex Smith';

  return (
    <nav className="h-20 border-b border-white/10 backdrop-blur-md bg-black/50 sticky top-0 z-50 px-6 lg:px-8 flex items-center justify-between">
      {/* Left: Logo & Menu */}
      <div className="flex items-center gap-10">
        <RouterNavLink to="/" className="flex items-center gap-2 cursor-pointer group">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-emerald-400 to-[#FCD535] flex items-center justify-center transform rotate-12 transition-transform group-hover:rotate-45">
            <div className="w-4 h-4 bg-black transform -rotate-12 rounded-sm group-hover:-rotate-45 transition-transform" />
          </div>
          <span className="text-2xl font-bold tracking-tighter bg-gradient-to-r from-emerald-400 via-emerald-200 to-[#FCD535] bg-clip-text text-transparent">
            AIGIS
          </span>
        </RouterNavLink>

        <div className="hidden lg:flex items-center gap-8">
          <NavLink to="/market" label="Рынки" />
          <NavLink to="/trade" label="Торговля" />
          <NavLink to="/derivatives" label="Фьючерсы" />
          <NavLink to="/" label="Earn" exact />
          <NavLink to="/finance" label="Финансы" />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-4 mr-2">
          <button className="text-slate-400 hover:text-white transition-colors p-2">
            <Search className="w-5 h-5" />
          </button>
          <div className="w-px h-5 bg-white/10" />
        </div>
        
        {isLoggedIn ? (
          /* Logged In: Profile/Wallet Avatar */
          <div className="relative">
            <button 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors group"
            >
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-slate-950/80 backdrop-blur-md border border-[#FCD535]/50 shadow-[0_0_12px_rgba(252,213,53,0.3)] flex items-center justify-center shrink-0 transition-shadow group-hover:shadow-[0_0_18px_rgba(252,213,53,0.5)]">
                <User className="w-5 h-5 text-[#FCD535]" />
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-white truncate max-w-[100px]">{userName}</p>
                <p className="text-xs text-slate-500">0x8f3a...7c2d</p>
              </div>
              <ChevronDown className={cn(
                "w-4 h-4 text-slate-400 transition-transform",
                showProfileMenu && "rotate-180"
              )} />
            </button>

            {/* Dropdown Menu */}
            {showProfileMenu && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowProfileMenu(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-64 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
                  {/* User Info Header */}
                  <div className="px-4 py-3 border-b border-white/10 bg-white/5">
                    <p className="text-sm font-medium text-white">{userName}</p>
                    <p className="text-xs text-slate-400 truncate">{userData?.email || 'user@example.com'}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                      <span className="text-xs text-emerald-400">KYC Подтвержден</span>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    <RouterNavLink 
                      to="/wallet"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <Wallet className="w-4 h-4 text-[#FCD535]" />
                      Кошелек и профиль
                    </RouterNavLink>
                    <RouterNavLink 
                      to="/wallet"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      Настройки аккаунта
                    </RouterNavLink>
                  </div>

                  {/* Logout */}
                  <div className="border-t border-white/10 py-2">
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Отключить кошелек
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          /* Logged Out: Connect Wallet Button */
          <button 
            onClick={handleConnectWallet}
            className="px-5 py-2.5 rounded-lg bg-[#FCD535] hover:bg-[#FFE066] text-black font-semibold text-sm transition-colors shadow-[0_0_10px_rgba(252,213,53,0.2)]"
          >
            Подключить кошелек
          </button>
        )}
        
        <button className="lg:hidden p-2 text-slate-400 hover:text-white">
          <Menu className="w-6 h-6" />
        </button>
      </div>
    </nav>
  );
}

function NavLink({ to, label, exact }: { to: string; label: string; exact?: boolean }) {
  return (
    <RouterNavLink 
      to={to}
      end={exact}
      className={({ isActive }) => cn(
        "text-sm font-medium transition-colors hover:text-white relative py-2",
        isActive ? "text-[#FCD535]" : "text-slate-400"
      )}
    >
      {({ isActive }) => (
        <>
          {label}
          {isActive && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#FCD535] rounded-t-full shadow-[0_0_8px_rgba(252,213,53,0.5)]" />
          )}
        </>
      )}
    </RouterNavLink>
  );
}

function BackgroundEffects() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 perspective-[1000px]">
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-900/10 blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#FCD535]/5 blur-[120px]" />
      
      <div className="absolute top-[20%] left-[-15%] w-[400px] h-[500px] bg-white/[0.01] border border-white/5 rounded-2xl p-8 flex flex-col gap-6 backdrop-blur-3xl transform rotate-y-[30deg] rotate-z-[-5deg] scale-75 opacity-20 transition-all duration-1000 hidden md:flex">
        <div className="w-32 h-6 bg-white/10 rounded" />
        <div className="space-y-4 mt-8">
          <div className="w-full h-12 border border-[#FCD535]/30 rounded bg-black/50" />
          <div className="w-full h-12 border border-white/10 rounded bg-black/50" />
        </div>
        <div className="w-full h-12 bg-[#FCD535]/20 rounded mt-auto flex items-center justify-center">
          <div className="w-24 h-4 bg-[#FCD535]/50 rounded" />
        </div>
      </div>

      <div className="absolute top-[30%] right-[-10%] w-[500px] h-[400px] bg-white/[0.01] border border-white/5 rounded-2xl p-8 flex flex-col gap-6 backdrop-blur-3xl transform -rotate-y-[20deg] rotate-z-[5deg] scale-90 opacity-20 transition-all duration-1000 hidden lg:flex">
        <div className="flex justify-between items-center">
          <div className="w-40 h-8 bg-white/10 rounded" />
          <div className="w-10 h-10 rounded-full bg-white/5" />
        </div>
        <div className="flex gap-4 mt-4">
          <div className="flex-1 h-32 rounded-xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent flex flex-col justify-end p-4">
            <div className="w-full h-16 border-b-2 border-emerald-500/30 relative">
               <div className="absolute bottom-0 w-full h-8 bg-gradient-to-t from-emerald-500/10 to-transparent" />
            </div>
          </div>
          <div className="flex-1 h-32 rounded-xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent flex items-center justify-center">
             <div className="w-20 h-20 rounded-full border-[6px] border-[#FCD535]/30 border-t-white/10" />
          </div>
        </div>
        <div className="space-y-3 mt-4">
          {[1,2,3].map(i => (
            <div key={i} className="w-full h-10 bg-white/5 rounded flex items-center px-4 justify-between">
               <div className="w-24 h-3 bg-white/10 rounded" />
               <div className="w-16 h-3 bg-white/20 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
