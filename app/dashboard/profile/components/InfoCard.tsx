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
  
  // Clean, modern minimal branding theme tokens
  const themes = {
    lime: "bg-lime-50 text-lime-600 border-lime-100/70",
    blue: "bg-blue-50 text-blue-600 border-blue-100/70",
    slate: "bg-slate-50 text-slate-400 border-slate-100/70",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.05, duration: 0.35, ease: "easeOut" }}
      className="bg-white rounded-xl sm:rounded-[2rem] p-4 sm:p-6 border border-slate-100 shadow-sm flex items-center gap-4 sm:gap-6 group hover:shadow-md hover:border-slate-200 transition-all duration-300 w-full min-w-0"
    >
      {/* CARD ICON WRAPPER */}
      <div className={`h-12 w-12 sm:h-16 sm:w-16 shrink-0 rounded-xl sm:rounded-[1.25rem] flex items-center justify-center border transition-transform duration-300 group-hover:scale-105 ${themes[variant]}`}>
        <Icon size={20} className="sm:h-6 sm:w-6" />
      </div>

      {/* METRIC CONTENT LAYER */}
      <div className="flex flex-col min-w-0 flex-1">
        <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-slate-400 mb-0.5 sm:mb-1 truncate italic">
          {label}
        </p>
        <p className="text-xl sm:text-2xl font-black text-slate-900 uppercase italic tracking-tight truncate leading-tight">
          {value || "---"}
        </p>
        {subValue && (
          <p className="text-[9px] sm:text-[10px] font-semibold text-slate-400 uppercase tracking-wide mt-0.5 sm:mt-1 truncate">
            {subValue}
          </p>
        )}
      </div>

      {/* DECORATIVE CORNER DOT */}
      <div className="hidden sm:block ml-auto opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        <div className="h-1.5 w-1.5 bg-slate-200 rounded-full" />
      </div>
    </motion.div>
  );
}