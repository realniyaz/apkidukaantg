"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { SaleStatus } from "@/types/sales";

interface StatusBadgeProps {
  status: string | SaleStatus;
  className?: string;
}

const STATUS_MAP: Record<string, { container: string; dot?: string; label: string }> = {
  [SaleStatus.DRAFT]: {
    container: "bg-slate-50 text-slate-400 border-slate-100",
    label: "Draft Protocol",
  },
  [SaleStatus.POSTED]: {
    container: "bg-blue-50/50 text-blue-600 border-blue-100 shadow-[0_0_12px_rgba(59,130,246,0.1)]",
    dot: "bg-blue-500",
    label: "Uplink Active",
  },
  [SaleStatus.CANCELLED]: {
    container: "bg-red-50 text-red-500 border-red-100",
    label: "Voided / Null",
  },
  // Matches the logic in your SalesTable for 100% paid sales
  SETTLED: {
    container: "bg-lime-50 text-lime-600 border-lime-200 shadow-[0_0_12px_rgba(132,204,22,0.15)]",
    dot: "bg-lime-500",
    label: "Settled Yield",
  },
  // Matches the logic for partially paid sales
  PARTIAL: {
    container: "bg-amber-50 text-amber-600 border-amber-100",
    dot: "bg-amber-500",
    label: "Partial Data",
  }
};

const StatusBadge = memo(({ status, className = "" }: StatusBadgeProps) => {
  // Normalize string and handle potential underscores from backend
  const normalized = status?.toString().toUpperCase().replace(/\s+/g, '_') || SaleStatus.DRAFT;
  
  // Fallback to DRAFT if status is not in the map
  const config = STATUS_MAP[normalized] || STATUS_MAP[SaleStatus.DRAFT];

  return (
    <motion.div
      initial={{ opacity: 0, x: -5 }}
      animate={{ opacity: 1, x: 0 }}
      className={`
        inline-flex items-center gap-2
        px-3 py-1.5 rounded-full 
        text-[9px] font-black uppercase tracking-[0.2em] italic
        border transition-all duration-500
        ${config.container}
        ${className}
      `}
    >
      {/* Neural Link Indicator */}
      {config.dot && (
        <span className="relative flex h-1.5 w-1.5">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${config.dot}`} />
          <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${config.dot}`} />
        </span>
      )}

      <span className="leading-none pt-0.5 whitespace-nowrap">
        {config.label}
      </span>
    </motion.div>
  );
});

StatusBadge.displayName = "StatusBadge";

export default StatusBadge;