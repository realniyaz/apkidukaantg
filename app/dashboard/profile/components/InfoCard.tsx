"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface InfoCardProps {
  label: string;
  value: string | number | null | undefined;
  subValue?: string;
  icon: LucideIcon;
  variant?: "lime" | "blue" | "slate";
  delay?: number;
}

export default function InfoCard({ 
  label, 
  value, 
  subValue, 
  icon: Icon, 
  variant = "slate",
  delay = 0 
}: InfoCardProps) {
  
  // Mapping variants to professional industrial color schemes
  const themes = {
    lime: "bg-lime-50 text-lime-600 border-lime-100",
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    slate: "bg-slate-50 text-slate-400 border-slate-100",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.1, duration: 0.4 }}
      className="bg-white rounded-[2.5rem] p-7 border border-slate-100 shadow-sm flex items-center gap-6 group hover:shadow-xl hover:border-slate-200 transition-all duration-300"
    >
      {/* 01. ICON COMPARTMENT */}
      <div className={`h-16 w-16 shrink-0 rounded-[1.5rem] flex items-center justify-center border transition-transform duration-500 group-hover:rotate-6 ${themes[variant]}`}>
        <Icon size={28} />
      </div>

      {/* 02. DATA COMPARTMENT */}
      <div className="flex flex-col min-w-0">
        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 mb-1 italic">
          {label}
        </p>
        <p className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter truncate leading-tight">
          {value || "---"}
        </p>
        {subValue && (
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 opacity-70">
            {subValue}
          </p>
        )}
      </div>

      {/* DECORATIVE TERMINAL MARKER */}
      <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="h-1.5 w-1.5 bg-slate-200 rounded-full" />
      </div>
    </motion.div>
  );
}