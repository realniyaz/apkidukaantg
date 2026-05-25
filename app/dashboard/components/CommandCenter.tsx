"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, ArrowRight, Zap, Package, 
  Users, BadgeIndianRupee, User, X 
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function CommandCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const router = useRouter();

  // 01. DESKTOP HOTKEY TRIGGER LISTENER (Cmd+K / Ctrl+K)
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
    <AnimatePresence mode="wait">
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[8vh] sm:pt-[15vh] px-4 overflow-y-auto">
          
          {/* CLOSING BACKDROP BACKGROUND */}
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
          />

          {/* SEARCH CONSOLE MODAL CHASSIS */}
          <motion.div 
            initial={{ scale: 0.97, opacity: 0, y: -10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.97, opacity: 0, y: -10 }}
            className="relative w-full max-w-2xl bg-white shadow-xl rounded-xl sm:rounded-[2.5rem] overflow-hidden border border-slate-100 font-bold z-10 my-auto sm:my-0 max-h-[85vh] flex flex-col"
          >
            {/* SEARCH INPUT BAR */}
            <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center gap-3 sm:gap-4 bg-slate-50/40 shrink-0">
              <Search className="text-lime-500 shrink-0" size={20} />
              <input 
                autoFocus
                type="text" 
                placeholder="Search menus, orders, or shortcut settings..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-base sm:text-lg font-black uppercase italic tracking-tight text-slate-900 placeholder:text-slate-300"
              />
              <button 
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center h-7 px-2.5 bg-white border border-slate-200 rounded-lg shadow-sm text-[9px] text-slate-400 font-black tracking-wider uppercase active:scale-95 transition-all"
              >
                <span className="hidden sm:inline">ESC</span>
                <X size={12} className="sm:hidden text-slate-400" />
              </button>
            </div>

            {/* MODULAR SHORTCUT LIST FEED */}
            <div className="p-3 sm:p-4 overflow-y-auto custom-scrollbar flex-1 max-h-[350px]">
              <p className="px-3 sm:px-4 pt-2 pb-3 text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-slate-400 italic">Quick Access Menu</p>
              
              <div className="space-y-1">
                <CommandItem 
                  label="Store Settings" 
                  sub="Manage account parameters and company data" 
                  icon={User} 
                  onClick={() => navigateTo("/dashboard/profile")} 
                />
                <CommandItem 
                  label="Product Catalog" 
                  sub="Track item arrivals, categories, and SKUs" 
                  icon={Package} 
                  onClick={() => navigateTo("/dashboard/products")} 
                />
                <CommandItem 
                  label="Sales Ledger" 
                  sub="Review merchant logs and customer invoices" 
                  icon={BadgeIndianRupee} 
                  onClick={() => navigateTo("/dashboard/sales")} 
                />
                <CommandItem 
                  label="Team Management" 
                  sub="Configure partner permissions and access settings" 
                  icon={Users} 
                  onClick={() => navigateTo("/dashboard/users")} 
                />
              </div>
            </div>

            {/* DASHBOARD ACTION FOOTER HELPER */}
            <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 flex flex-row justify-between items-center gap-4 shrink-0">
               <div className="flex items-center gap-3 sm:gap-4 text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <span className="px-1.5 py-0.5 bg-white border border-slate-200 rounded-md text-[9px] text-slate-500 font-mono font-black shadow-sm">↑↓</span>
                    <span className="text-[9px] font-black uppercase tracking-wider hidden sm:inline">Select</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="px-1.5 py-0.5 bg-white border border-slate-200 rounded-md text-[9px] text-slate-500 font-mono font-black shadow-sm">ENTER</span>
                    <span className="text-[9px] font-black uppercase tracking-wider hidden sm:inline">Open</span>
                  </div>
               </div>
               <div className="flex items-center gap-1.5 text-lime-600 font-mono">
                  <Zap size={11} fill="currentColor" className="shrink-0" />
                  <span className="text-[9px] font-black uppercase tracking-wider">Console Terminal v1.0</span>
               </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

/* --- REUSABLE BUTTON SHORTCUT ITEM --- */
interface CommandItemProps {
  label: string;
  sub: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  onClick: () => void;
}

function CommandItem({ label, sub, icon: Icon, onClick }: CommandItemProps) {
  return (
    <button 
      onClick={onClick}
      className="w-full flex items-center justify-between p-3 sm:p-4 rounded-xl sm:rounded-2xl hover:bg-slate-50 group transition-all gap-4 text-slate-900"
    >
      <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
        <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-lime-600 group-hover:border-lime-500/20 shadow-sm shrink-0 transition-colors duration-200">
          <Icon size={18} className="sm:h-5 sm:w-5" />
        </div>
        <div className="text-left min-w-0 flex-1">
          <p className="text-sm font-black text-slate-900 uppercase italic tracking-tight truncate leading-tight mb-0.5 sm:mb-1">{label}</p>
          <p className="text-[9px] sm:text-[10px] font-semibold text-slate-400 uppercase tracking-wide truncate">{sub}</p>
        </div>
      </div>
      <ArrowRight size={14} className="text-slate-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all shrink-0 hidden sm:block" />
    </button>
  );
}