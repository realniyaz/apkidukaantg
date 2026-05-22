"use client";

import { useState, useEffect } from "react";
import { 
  Search, Bell, Settings, Globe, Command, 
  Zap, LogOut, Shield, User, Clock, 
  ChevronDown, X, MessageSquare, AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function TopBar() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [time, setTime] = useState(new Date());

  // 01. LIVE CLOCK SYNC
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="h-20 w-full border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-[80] px-8 flex items-center justify-between">
      
      {/* 01. INTELLIGENT SEARCH COMMANDER */}
      <div className="flex-1 max-w-xl">
        <div className="relative group">
          <div className="absolute left-5 top-1/2 -translate-y-1/2 flex items-center gap-2 text-slate-300 group-focus-within:text-lime-500 transition-colors">
            <Search size={18} />
          </div>
          <input 
            type="text" 
            placeholder="Search records or execute commands..." 
            className="w-full bg-slate-50 border border-slate-100 py-3.5 pl-14 pr-12 rounded-2xl outline-none focus:bg-white focus:ring-8 focus:ring-lime-500/5 transition-all text-sm font-bold text-slate-700 placeholder:text-slate-300 shadow-inner"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-1 px-2 py-1 bg-white border border-slate-100 rounded-lg shadow-sm">
            <Command size={10} className="text-slate-400" />
            <span className="text-[9px] font-black text-slate-400 uppercase">K</span>
          </div>
        </div>
      </div>

      {/* 02. SYSTEM UTILITIES & TEMPORAL DATA */}
      <div className="flex items-center gap-6">
        
        {/* TEMPORAL CLOCK (Live) */}
        <div className="hidden lg:flex flex-col items-end pr-6 border-r border-slate-100">
           <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 italic">
              <Clock size={10} className="text-blue-500" /> System Time
           </div>
           <p className="text-sm font-black text-slate-900 tabular-nums uppercase italic">
              {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
           </p>
        </div>

        {/* ACTION CLUSTER */}
        <div className="flex items-center gap-3">
          {/* Notifications Dropdown */}
          <div className="relative">
            <UtilityButton 
              badge={true} 
              active={activeMenu === 'notif'} 
              onClick={() => setActiveMenu(activeMenu === 'notif' ? null : 'notif')}
            >
              <Bell size={20} />
            </UtilityButton>
            <DropdownMenu 
              isOpen={activeMenu === 'notif'} 
              title="Intelligence Feed" 
              items={[
                { icon: <AlertCircle size={16} className="text-orange-500"/>, label: "Stock depletion in Node-04", time: "2m ago" },
                { icon: <MessageSquare size={16} className="text-blue-500"/>, label: "Customer inquiry received", time: "15m ago" },
              ]}
            />
          </div>

          {/* Settings Dropdown */}
          <div className="relative">
            <UtilityButton 
              active={activeMenu === 'settings'} 
              onClick={() => setActiveMenu(activeMenu === 'settings' ? null : 'settings')}
            >
              <Settings size={20} />
            </UtilityButton>
            <DropdownMenu 
              isOpen={activeMenu === 'settings'} 
              title="System Protocols" 
              items={[
                { icon: <Shield size={16} />, label: "Security Encryption", status: "Active" },
                { icon: <Globe size={16} />, label: "Region Routing", status: "North India" },
              ]}
            />
          </div>
        </div>

        {/* USER NEURAL HUB */}
        <div className="flex items-center gap-4 pl-6 border-l border-slate-100 group cursor-pointer">
           <div className="flex flex-col items-end">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Commander</p>
              <p className="text-sm font-black text-slate-900 uppercase italic tracking-tighter">Kalu Admin</p>
           </div>
           <div className="relative">
              <div className="h-11 w-11 rounded-[1rem] bg-slate-900 flex items-center justify-center text-lime-500 shadow-xl border border-slate-800 transition-transform group-hover:scale-105 group-active:scale-95">
                <Zap size={20} fill="currentColor" />
              </div>
              <div className="absolute -top-1 -right-1 h-3 w-3 bg-lime-500 rounded-full border-2 border-white animate-pulse" />
           </div>
        </div>
      </div>

    </header>
  );
}

/* --- REUSABLE COMPONENTS --- */

function UtilityButton({ children, badge, active, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={`h-11 w-11 rounded-xl flex items-center justify-center transition-all relative group ${
        active ? 'bg-slate-900 text-lime-500 shadow-lg' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'
      }`}
    >
      {children}
      {badge && !active && (
        <span className="absolute top-2.5 right-2.5 h-2 w-2 bg-red-500 rounded-full border-2 border-white shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
      )}
    </button>
  );
}

function DropdownMenu({ isOpen, title, items }: any) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          className="absolute right-0 mt-4 w-72 bg-white border border-slate-100 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden font-bold"
        >
          <div className="p-5 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic">{title}</span>
            <div className="h-1.5 w-1.5 bg-lime-500 rounded-full" />
          </div>
          <div className="p-2">
            {items.map((item: any, idx: number) => (
              <button key={idx} className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors group text-left">
                <div className="h-10 w-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-lime-600 transition-colors">
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-black text-slate-800 uppercase italic truncate">{item.label}</p>
                  {item.time && <p className="text-[9px] text-slate-400 uppercase mt-0.5">{item.time}</p>}
                  {item.status && <p className="text-[9px] text-lime-600 uppercase mt-0.5 tracking-widest">{item.status}</p>}
                </div>
              </button>
            ))}
          </div>
          <div className="p-4 border-t border-slate-50">
            <button className="w-full py-3 rounded-xl bg-slate-900 text-white text-[9px] font-black uppercase tracking-[0.2em] hover:bg-black transition-colors">
              View All Systems
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}