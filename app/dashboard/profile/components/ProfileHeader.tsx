"use client";

import { motion } from "framer-motion";
import { Settings2, ShieldCheck, Zap, Fingerprint } from "lucide-react";

interface ProfileHeaderProps {
  shopName: string;
  onEdit: () => void;
}

export default function ProfileHeader({ shopName, onEdit }: ProfileHeaderProps) {
  return (
    <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-slate-100">
      
      {/* 01. IDENTITY NODE INFO */}
      <div className="flex items-center gap-6">
        <div className="relative">
          <div className="h-20 w-20 bg-slate-900 rounded-[2rem] flex items-center justify-center text-lime-500 shadow-2xl group transition-transform hover:scale-105">
            <Fingerprint size={40} className="group-hover:animate-pulse" />
          </div>
          <div className="absolute -bottom-1 -right-1 h-7 w-7 bg-white rounded-full flex items-center justify-center shadow-lg border border-slate-50">
             <ShieldCheck size={16} className="text-lime-600" />
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2 text-lime-600 font-black text-[10px] uppercase tracking-[0.3em]">
            <Zap size={14} fill="currentColor" /> System Identity
          </div>
          <h1 className="text-4xl font-black tracking-tighter uppercase italic leading-none text-slate-900">
            {shopName || "Merchant Node"}
          </h1>
          <p className="text-slate-400 font-bold text-[11px] uppercase tracking-widest flex items-center gap-2">
            Status: <span className="text-slate-900">Verified Administrator</span>
          </p>
        </div>
      </div>

      {/* 02. ACTION DOCK */}
      <div className="flex items-center gap-3 w-full md:w-auto">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onEdit}
          className="flex-1 md:flex-none bg-white border border-slate-200 px-8 py-4 rounded-2xl flex items-center justify-center gap-3 text-slate-900 font-black text-xs uppercase tracking-widest shadow-sm hover:shadow-xl hover:border-lime-500/30 transition-all group"
        >
          <Settings2 size={18} className="text-slate-400 group-hover:text-lime-600 transition-colors" />
          Modify Parameters
        </motion.button>
        
        {/* DECORATIVE INDICATOR */}
        <div className="hidden md:flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 border border-slate-100 text-slate-300">
           <p className="text-[10px] font-black italic">ID: 01</p>
        </div>
      </div>

      {/* BACKGROUND ACCENT */}
      <div className="absolute -top-10 -left-10 h-32 w-32 bg-lime-500/5 blur-[80px] rounded-full pointer-events-none" />
    </div>
  );
}