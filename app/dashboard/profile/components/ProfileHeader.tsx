"use client";

import { motion } from "framer-motion";
import { Settings2, ShieldCheck, Zap, Fingerprint } from "lucide-react";

interface ProfileHeaderProps {
  shopName: string;
  onEdit: () => void;
}

export default function ProfileHeader({ shopName, onEdit }: ProfileHeaderProps) {
  return (
    <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sm:gap-6 pb-6 border-b border-slate-100 text-slate-900">
      
      {/* 01. ACCOUNT IDENTITY WRAPPER */}
      <div className="flex items-center gap-4 sm:gap-6 min-w-0">
        <div className="relative shrink-0">
          <div className="h-16 w-16 sm:h-20 sm:w-20 bg-slate-900 rounded-xl sm:rounded-[2rem] flex items-center justify-center text-lime-400 shadow-md group transition-transform hover:scale-105">
            <Fingerprint className="h-8 w-8 sm:h-10 sm:w-10 group-hover:animate-pulse" />
          </div>
          <div className="absolute -bottom-1 -right-1 h-6 w-6 sm:h-7 sm:w-7 bg-white rounded-full flex items-center justify-center shadow-md border border-slate-50">
             <ShieldCheck size={14} className="text-lime-600 sm:h-4 sm:w-4" />
          </div>
        </div>

        <div className="space-y-0.5 sm:space-y-1 min-w-0">
          <div className="flex items-center gap-1.5 text-lime-600 font-black text-[9px] sm:text-[10px] uppercase tracking-wider">
            <Zap size={12} fill="currentColor" className="shrink-0" /> Account Identity
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight uppercase italic leading-none text-slate-900 truncate pr-2">
            {shopName || "Store Profile"}
          </h1>
          <p className="text-slate-400 font-bold text-[10px] sm:text-[11px] uppercase tracking-wide flex items-center gap-1.5 truncate">
            Role: <span className="text-slate-700 font-black">Verified Administrator</span>
          </p>
        </div>
      </div>

      {/* 02. ACTION ROW TRIGGER */}
      <div className="flex items-center gap-3 w-full md:w-auto border-t border-slate-50 md:border-none pt-4 md:pt-0">
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={onEdit}
          className="flex-1 md:flex-none bg-white border border-slate-200 px-5 sm:px-8 h-12 rounded-xl sm:rounded-2xl flex items-center justify-center gap-2.5 text-slate-900 font-black text-xs uppercase tracking-wider shadow-sm hover:shadow-md hover:border-lime-500/30 transition-all group"
        >
          <Settings2 size={16} className="text-slate-400 group-hover:text-lime-600 transition-colors shrink-0" />
          Edit Store Settings
        </motion.button>
        
        {/* DECORATIVE ACCOUNT BADGE */}
        <div className="hidden md:flex h-12 w-14 items-center justify-center rounded-2xl bg-slate-50 border border-slate-100 text-slate-400 shrink-0">
           <p className="text-[10px] font-black italic">ID: 01</p>
        </div>
      </div>

      {/* AMBIENT BACKGROUND ACCENT */}
      <div className="absolute -top-10 -left-10 h-32 w-32 bg-lime-500/5 blur-[80px] rounded-full pointer-events-none" />
    </div>
  );
}