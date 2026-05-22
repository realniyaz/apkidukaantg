"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, Command, X, ArrowRight, 
  Zap, Package, Users, BadgeIndianRupee, 
  Settings, User 
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function CommandCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const router = useRouter();

  // 01. HOTKEY LISTENER (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") setIsOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const navigateTo = (path: string) => {
    router.push(path);
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh] px-4">
          
          {/* BACKDROP */}
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
          />

          {/* SEARCH TERMINAL */}
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: -20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: -20 }}
            className="relative w-full max-w-2xl bg-white shadow-[0_50px_100px_rgba(0,0,0,0.4)] rounded-[2.5rem] overflow-hidden border border-slate-100 font-bold"
          >
            {/* INPUT FIELD */}
            <div className="p-6 border-b border-slate-100 flex items-center gap-4 bg-slate-50/50">
              <Search className="text-lime-500" size={24} />
              <input 
                autoFocus
                type="text" 
                placeholder="Type a command or search records..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-lg font-black uppercase italic tracking-tighter text-slate-900 placeholder:text-slate-300"
              />
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-xl shadow-sm text-[10px] text-slate-400 font-black">
                ESC
              </div>
            </div>

            {/* QUICK ACTIONS FEED */}
            <div className="p-4 max-h-[400px] overflow-y-auto custom-scrollbar">
              <p className="px-4 pt-2 pb-4 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic">Neural Shortcuts</p>
              
              <div className="space-y-2">
                <CommandItem 
                  label="Merchant Identity" 
                  sub="View or modify shop parameters" 
                  icon={User} 
                  onClick={() => navigateTo("/dashboard/profile")} 
                />
                <CommandItem 
                  label="System Inventory" 
                  sub="Manage catalog and SKUs" 
                  icon={Package} 
                  onClick={() => navigateTo("/dashboard/products")} 
                />
                <CommandItem 
                  label="Revenue Node" 
                  sub="Analyze sales and invoices" 
                  icon={BadgeIndianRupee} 
                  onClick={() => navigateTo("/dashboard/sales")} 
                />
                <CommandItem 
                  label="Personnel Registry" 
                  sub="Manage team access nodes" 
                  icon={Users} 
                  onClick={() => navigateTo("/dashboard/users")} 
                />
              </div>
            </div>

            {/* FOOTER HINT */}
            <div className="p-5 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
               <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <span className="p-1.5 bg-white border border-slate-200 rounded-lg text-[9px] text-slate-500 font-black">↑↓</span>
                    <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Navigate</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="p-1.5 bg-white border border-slate-200 rounded-lg text-[9px] text-slate-500 font-black">ENTER</span>
                    <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Execute</span>
                  </div>
               </div>
               <div className="flex items-center gap-2 text-lime-600">
                  <Zap size={12} fill="currentColor" />
                  <span className="text-[9px] font-black uppercase tracking-[0.2em]">Alpha-Terminal v1.0</span>
               </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function CommandItem({ label, sub, icon: Icon, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 group transition-all"
    >
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-lime-600 group-hover:border-lime-500/20 shadow-sm transition-all">
          <Icon size={20} />
        </div>
        <div className="text-left">
          <p className="text-sm font-black text-slate-900 uppercase italic tracking-tight">{label}</p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{sub}</p>
        </div>
      </div>
      <ArrowRight size={16} className="text-slate-200 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all" />
    </button>
  );
}