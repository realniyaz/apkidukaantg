"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthService } from "@/lib/auth";

// Components
import CommandCenter from "./components/CommandCenter";

import {
  LayoutDashboard, Package, ShoppingCart, Warehouse,
  LogOut, ChevronRight, Bell, Search, Settings, 
  BadgeIndianRupee, ShieldAlert, BrainCircuit,
  BriefcaseBusinessIcon, BadgeIndianRupeeIcon, Menu, X,
  Zap, Command, Cpu, Store,
  User
} from "lucide-react";

const NAV_ITEMS = [
  {
    section: "Operations",
    items: [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { name: "Sales", href: "/dashboard/sales", icon: BadgeIndianRupee },
      { name: "Inventory", href: "/dashboard/inventory", icon: Warehouse },
    ]
  },
  {
    section: "Commerce",
    items: [
      { name: "Users", href: "/dashboard/users", icon: User },
      { name: "Customers", href: "/dashboard/customers", icon: UsersIconAlternative },
      { name: "Products", href: "/dashboard/products", icon: Package },
      { name: "Purchases", href: "/dashboard/purchases", icon: ShoppingCart },
    ]
  },
  {
    section: "AI Insights",
    items: [
      { name: "Business Health", href: "/dashboard/ai/summary", icon: BriefcaseBusinessIcon },
      { name: "Risk Analysis", href: "/dashboard/ai/customer", icon: ShieldAlert },
      { name: "Product Intelligence", href: "/dashboard/ai/products", icon: BrainCircuit },
      { name: "Optimization", href: "/dashboard/ai/optimization", icon: Cpu },
      { name: "Profit Models", href: "/dashboard/ai/profit", icon: BadgeIndianRupeeIcon }
    ]
  },
  {
    section: "System",
    items: [
      { name: "Profile Settings", href: "/dashboard/profile", icon: Settings },
    ]
  }
];

// Inline replacement fallback helper to guard standard execution safely
function UsersIconAlternative({ size, className }: { size: number, className?: string }) {
  return <BriefcaseBusinessIcon size={size} className={className} />;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [time, setTime] = useState(new Date());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile sidebar smoothly on route transition changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // AUTH & SYSTEM CLOCK SYNC
  useEffect(() => {
    if (!AuthService.isAuthenticated()) {
      router.push("/auth/login");
    } else {
      setIsLoading(false);
    }
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, [router]);

  const handleLogout = () => {
    AuthService.clearToken();
    localStorage.removeItem("refresh_token");
    router.push("/auth/login");
  };

  if (isLoading) return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <motion.div 
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="relative h-14 w-14 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg"
      >
         <Store className="text-lime-400" size={28} />
      </motion.div>
      <p className="mt-6 text-[10px] font-bold uppercase tracking-widest text-slate-400 animate-pulse text-center">Loading system dashboard...</p>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#FDFDFD] text-slate-900 selection:bg-lime-500/20 antialiased overflow-hidden">
      
      <CommandCenter />

      {/* --- DESKTOP SIDEBAR DRAWER --- */}
      <aside className="hidden lg:flex w-72 bg-white border-r border-slate-100 flex-col sticky top-0 h-screen z-50 shadow-sm">
        <div className="p-6 mb-2">
          <Link href="/dashboard" className="flex items-center gap-3.5 group">
            <div className="relative w-11 h-11 bg-slate-900 rounded-xl flex items-center justify-center shadow-md transition-all group-hover:rotate-6 duration-300">
               <Store className="text-lime-400" size={20} />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-tight text-slate-900 uppercase italic leading-none">Apkidukaan</span>
              <span className="text-[9px] font-bold text-lime-600 uppercase tracking-wider mt-1 flex items-center gap-1.5">
                 <div className="h-1 w-1 bg-lime-500 rounded-full animate-pulse" /> System Connected
              </span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-8 overflow-y-auto custom-scrollbar pb-4">
          {NAV_ITEMS.map((section) => (
            <div key={section.section}>
              <p className="text-[9px] uppercase tracking-wider text-slate-400 font-black mb-3 px-3 italic">
                 {section.section}
              </p>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                  return (
                    <Link key={item.href} href={item.href}>
                      <div className={`group relative flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all duration-200 cursor-pointer
                        ${isActive ? "text-white" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"}`}>
                        
                        <div className="flex items-center gap-3.5 z-10 min-w-0">
                          <item.icon size={16} className={`${isActive ? "text-lime-400" : "text-slate-400 group-hover:text-slate-900"} transition-colors shrink-0`} />
                          <span className={`text-[13px] truncate ${isActive ? "font-bold italic" : "font-medium"}`}>
                            {item.name}
                          </span>
                        </div>

                        {isActive && (
                          <motion.div 
                            layoutId="activeNav"
                            className="absolute inset-0 bg-slate-900 rounded-xl shadow-md shadow-slate-900/10"
                            transition={{ type: "spring", bounce: 0.05, duration: 0.4 }}
                          />
                        )}
                        {isActive && <ChevronRight size={12} className="text-lime-400 relative z-10 shrink-0" />}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
           <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 text-slate-400 hover:text-red-600 hover:bg-red-50/50 py-3 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all"
          >
            <LogOut size={14} /> Close Session
          </button>
        </div>
      </aside>

      {/* --- MOBILE SIDEBAR DRAWER OVERLAY --- */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.35 }}
              className="fixed inset-y-0 left-0 w-72 bg-white z-50 flex flex-col shadow-xl lg:hidden h-full"
            >
              <div className="p-5 flex items-center justify-between border-b border-slate-50">
                <Link href="/dashboard" className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-slate-900 rounded-lg flex items-center justify-center text-lime-400">
                     <Store size={18} />
                  </div>
                  <span className="text-base font-black uppercase italic tracking-tight text-slate-900">Apkidukaan</span>
                </Link>
                <button onClick={() => setIsMobileMenuOpen(false)} className="h-9 w-9 flex items-center justify-center text-slate-400 rounded-lg bg-slate-50">
                  <X size={18} />
                </button>
              </div>

              <nav className="flex-1 p-4 space-y-6 overflow-y-auto custom-scrollbar">
                {NAV_ITEMS.map((section) => (
                  <div key={section.section}>
                    <p className="text-[9px] uppercase tracking-wider text-slate-400 font-bold mb-2.5 px-2.5">
                       {section.section}
                    </p>
                    <div className="space-y-0.5">
                      {section.items.map((item) => {
                        const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                        return (
                          <Link key={item.href} href={item.href}>
                            <div className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                              isActive ? "bg-slate-900 text-white shadow-md" : "text-slate-500"
                            }`}>
                              <div className="flex items-center gap-3 min-w-0">
                                <item.icon size={16} className={isActive ? "text-lime-400" : "text-slate-400"} />
                                <span className="truncate">{item.name}</span>
                              </div>
                              {isActive && <ChevronRight size={12} className="text-lime-400" />}
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </nav>

              <div className="p-4 border-t border-slate-50">
                <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 text-slate-400 hover:text-red-600 py-3 text-xs font-bold uppercase tracking-wider">
                  <LogOut size={14} /> Close Session
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* --- CONTENT RUNTIME CONTAINER --- */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        {/* TOP COMPONENT STICKY BAR */}
        <header className="h-16 sm:h-20 bg-white/80 backdrop-blur-xl border-b border-slate-100 flex items-center justify-between px-4 sm:px-10 sticky top-0 z-40 gap-4">
          
          <div className="flex items-center gap-3 flex-1 max-w-xl">
            {/* Hamburger Button for Mobile screens */}
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden h-10 w-10 flex items-center justify-center border border-slate-100 bg-slate-50/50 rounded-xl text-slate-600 shrink-0"
            >
              <Menu size={20} />
            </button>

            <div 
              className="relative w-full cursor-pointer group" 
              onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}
            >
              <Search className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-slate-300 group-hover:text-lime-600 transition-colors" size={16} />
              <div className="bg-slate-50/50 border border-slate-100 py-2 sm:py-3 pl-10 sm:pl-12 pr-10 rounded-xl sm:rounded-2xl text-slate-400 text-xs sm:text-sm font-medium w-full shadow-inner flex items-center truncate">
                Search actions or look up fields...
              </div>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1 px-1.5 py-0.5 bg-white border border-slate-100 rounded-md shadow-sm pointer-events-none">
                 <Command size={9} className="text-slate-400" />
                 <span className="text-[9px] font-black text-slate-400">K</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 sm:gap-8 shrink-0">
            <div className="hidden md:flex flex-col items-end pr-4 sm:pr-8 border-r border-slate-100">
               <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Local Time</p>
               <p className="text-xs sm:text-sm font-semibold text-slate-700 tabular-nums">
                  {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
               </p>
            </div>

            <div className="flex items-center gap-2">
                <HeaderUtility badge><Bell size={18} /></HeaderUtility>
                <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-slate-900 flex items-center justify-center text-lime-400 shadow-md">
                   <Zap size={16} fill="currentColor" />
                </div>
            </div>
          </div>
        </header>

        {/* CONTENT INTERVIEW CONTEXT VIEWPORT */}
        <main className="flex-1 overflow-y-auto custom-scrollbar bg-[#FDFDFD]">
          <div className="p-4 sm:p-10 max-w-[1600px] mx-auto w-full min-h-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
        
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 20px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #CBD5E1; }
      `}</style>
    </div>
  );
}

function HeaderUtility({ children, badge }: { children: React.ReactNode, badge?: boolean }) {
  return (
    <button className="h-9 w-9 sm:h-10 sm:w-10 border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 bg-white transition-all relative group active:scale-95">
      {children}
      {badge && (
        <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white shadow-sm animate-pulse" />
      )}
    </button>
  );
}