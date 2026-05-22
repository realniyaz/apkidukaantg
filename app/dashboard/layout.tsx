"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthService } from "@/lib/auth";

// Components
import CommandCenter from "./components/CommandCenter";


import {
  LayoutDashboard, Users, Package, ShoppingCart, Warehouse,
  LogOut, ChevronRight, Bell, Search, Settings, 
  BadgeIndianRupee, ShieldAlert, BrainCircuit,
  BriefcaseBusinessIcon, BadgeIndianRupeeIcon, PersonStanding,
  Zap, Command, Activity, Cpu, Store, Clock, Mic
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
      { name: "Client Registry", href: "/dashboard/customers", icon: PersonStanding },
      { name: "Product Manifest", href: "/dashboard/products", icon: Package },
      { name: "Procurement", href: "/dashboard/purchases", icon: ShoppingCart },
    ]
  },
  {
    section: "Neural Intel",
    items: [
      { name: "Business Health", href: "/dashboard/ai/summary", icon: BriefcaseBusinessIcon },
      { name: "Risk Assessment", href: "/dashboard/ai/customer", icon: ShieldAlert },
      { name: "Product IQ", href: "/dashboard/ai/products", icon: BrainCircuit },
      { name: "Optimization", href: "/dashboard/ai/optimization", icon: Cpu },
      { name: "Profit Vectors", href: "/dashboard/ai/profit", icon: BadgeIndianRupeeIcon }
    ]
  },
  {
    section: "System",
    items: [
      { name: "Profile", href: "/dashboard/profile", icon: Settings },
    ]
  }
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [time, setTime] = useState(new Date());
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);

  // 01. AUTH & CLOCK SYNC
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
    <div className="min-h-screen bg-white flex flex-col items-center justify-center">
      <motion.div 
        animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="relative h-16 w-16 bg-slate-900 rounded-[1.8rem] flex items-center justify-center shadow-2xl"
      >
         <Store className="text-lime-400" size={32} />
      </motion.div>
      <p className="mt-8 text-[11px] font-black uppercase tracking-[0.6em] text-slate-400 animate-pulse">Initializing Neural Engine...</p>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#FDFDFD] text-slate-900 font-sans selection:bg-lime-500/20">
      
      {/* 00. GLOBAL NEURAL COMPONENTS */}
      <CommandCenter />
      

      {/* 01. SIDEBAR */}
      <motion.aside
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-72 bg-white border-r border-slate-100 flex flex-col sticky top-0 h-screen z-50 shadow-[2px_0_25px_rgba(0,0,0,0.02)]"
      >
        <div className="p-8 mb-4">
          <Link href="/dashboard" className="flex items-center gap-4 group">
            <div className="relative w-12 h-12 bg-slate-900 rounded-[1.3rem] flex items-center justify-center shadow-2xl transition-all group-hover:rotate-12 duration-500">
               <Store className="text-lime-400" size={22} />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tighter text-slate-900 uppercase italic leading-none">Apkidukaan</span>
              <span className="text-[9px] font-black text-lime-500 uppercase tracking-[0.2em] mt-1.5 flex items-center gap-2">
                 <div className="h-1 w-1 bg-lime-500 rounded-full animate-ping" /> Node Active
              </span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-5 space-y-10 overflow-y-auto custom-scrollbar pb-6">
          {NAV_ITEMS.map((section) => (
            <div key={section.section}>
              <p className="text-[10px] uppercase tracking-[0.3em] text-slate-300 font-black mb-5 px-3 flex items-center gap-3 italic">
                 {section.section}
              </p>
              <div className="space-y-1.5">
                {section.items.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                  return (
                    <Link key={item.href} href={item.href}>
                      <div className={`group relative flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 cursor-pointer
                        ${isActive ? "text-white" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"}`}>
                        
                        <div className="flex items-center gap-4 z-10">
                          <item.icon size={18} className={`${isActive ? "text-lime-400" : "text-slate-400 group-hover:text-slate-900"} transition-all`} />
                          <span className={`text-[12px] uppercase tracking-tight ${isActive ? "font-black italic" : "font-bold"}`}>
                            {item.name}
                          </span>
                        </div>

                        {isActive && (
                          <motion.div 
                            layoutId="activeNav"
                            className="absolute inset-0 bg-slate-900 rounded-2xl shadow-xl shadow-slate-900/20"
                            transition={{ type: "spring", bounce: 0.1, duration: 0.6 }}
                          />
                        )}
                        {isActive && <ChevronRight size={14} className="text-lime-400 relative z-10" />}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-50">
           <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 text-slate-400 hover:text-red-600 hover:bg-red-50/50 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
          >
            <LogOut size={16} /> Decommission Session
          </button>
        </div>
      </motion.aside>

      {/* 02. MAIN ENGINE */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        {/* TOPBAR HEADER */}
        <header className="h-20 bg-white/80 backdrop-blur-xl border-b border-slate-100 flex items-center justify-between px-10 sticky top-0 z-40">
          
          <div className="flex items-center gap-4 group flex-1 max-w-xl">
             <div className="relative w-full cursor-pointer" onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}>
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-hover:text-lime-500 transition-colors" size={18} />
                <div className="bg-slate-50/50 border border-slate-100 py-3.5 pl-16 pr-12 rounded-2xl text-slate-400 text-sm font-bold w-full shadow-inner flex items-center">
                   Search or Execute Terminal...
                </div>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-2 py-1 bg-white border border-slate-100 rounded-lg shadow-sm">
                   <Command size={10} className="text-slate-400" />
                   <span className="text-[9px] font-black text-slate-400 tracking-tighter">K</span>
                </div>
             </div>
          </div>

          <div className="flex items-center gap-10">
            <div className="hidden xl:flex flex-col items-end pr-10 border-r border-slate-100">
               <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1 italic">Temporal Node</p>
               <p className="text-sm font-black text-slate-900 tabular-nums uppercase italic">
                  {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
               </p>
            </div>

            <div className="flex items-center gap-4">
                <HeaderUtility badge><Bell size={21} /></HeaderUtility>
                <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center text-lime-400 shadow-lg border border-slate-800">
                   <Zap size={20} fill="currentColor" />
                </div>
            </div>
          </div>
        </header>

        {/* 03. CONTENT VIEWPORT */}
        <main className="flex-1 overflow-y-auto custom-scrollbar bg-[#FDFDFD]">
          <div className="p-10 max-w-[1600px] mx-auto w-full min-h-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>

        {/* 04. GLOBAL VOICE AI TRIGGER */}
        
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
    <button className="h-12 w-12 rounded-2xl flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all relative group active:scale-95">
      {children}
      {badge && (
        <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full border-[2.5px] border-white shadow-[0_0_12px_rgba(239,68,68,0.5)] animate-pulse" />
      )}
    </button>
  );
}