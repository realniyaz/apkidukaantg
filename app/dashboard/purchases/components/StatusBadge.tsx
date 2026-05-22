"use client";

import { motion } from "framer-motion";

/**
 * ERP-Grade Status Badge
 * Supports DRAFT, POSTED, PAID, PARTIALLY_PAID, and CANCELLED
 */
export default function StatusBadge({ status }: { status: string }) {
  // Normalize status for resilient mapping
  const normalizedStatus = status?.toUpperCase() || "DRAFT";

  // Professional ERP Color Palette
  const statusStyles: Record<string, string> = {
    DRAFT: "bg-slate-100 text-slate-500 border-slate-200",
    POSTED: "bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm shadow-emerald-100",
    PAID: "bg-blue-50 text-blue-700 border-blue-200 shadow-sm shadow-blue-100",
    PARTIALLY_PAID: "bg-amber-50 text-amber-700 border-amber-200 shadow-sm shadow-amber-100",
    CANCELLED: "bg-red-50 text-red-700 border-red-200",
    RETURNED: "bg-orange-50 text-orange-700 border-orange-200",
  };

  const currentStyle = statusStyles[normalizedStatus] || statusStyles.DRAFT;

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`
        inline-flex items-center gap-2 
        px-4 py-1.5 rounded-full 
        text-[10px] font-black uppercase tracking-[0.15em] 
        border transition-all duration-300
        ${currentStyle}
      `}
    >
      {/* Visual Indicator Dot for Active/Settled states */}
      {(normalizedStatus === "POSTED" || normalizedStatus === "PAID") && (
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-current"></span>
        </span>
      )}
      
      {normalizedStatus.replace("_", " ")}
    </motion.span>
  );
}