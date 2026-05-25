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
    label: "Draft",
  },
  [SaleStatus.POSTED]: {
    container: "bg-blue-50/50 text-blue-600 border-blue-100 shadow-[0_0_12px_rgba(59,130,246,0.05)]",
    dot: "bg-blue-500",
    label: "Pending",
  },
  [SaleStatus.CANCELLED]: {
    container: "bg-red-50 text-red-500 border-red-100",
    label: "Cancelled",
  },
  SETTLED: {
    container: "bg-lime-50 text-lime-600 border-lime-200 shadow-[0_0_12px_rgba(132,204,22,0.1)]",
    dot: "bg-lime-500",
    label: "Settled",
  },
  PARTIAL: {
    container: "bg-amber-50 text-amber-600 border-amber-100",
    dot: "bg-amber-500",
    label: "Part Paid",
  }
};

const StatusBadge = memo(({ status, className = "" }: StatusBadgeProps) => {
  // Normalize string and handle potential underscores from backend
  const normalized = status?.toString().toUpperCase().replace(/\s+/g, '_') || SaleStatus.DRAFT;
  
  // Fallback to DRAFT if status is not in the map
  const config = STATUS_MAP[normalized] || STATUS_MAP[SaleStatus.DRAFT];

  return (
    <motion.div
      initial={{ opacity: 0, x: -3 }}
      animate={{ opacity: 1, x: 0 }}
      className={`
        inline-flex items-center gap-1.5
        px-2.5 py-1 rounded-full 
        text-[9px] font-black uppercase tracking-wider italic
        border transition-all duration-300
        ${config.container}
        ${className}
      `}
    >
      {/* Activity Pulse Indicator */}
      {config.dot && (
        <span className="relative flex h-1 w-1 sm:h-1.5 sm:w-1.5 shrink-0">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${config.dot}`} />
          <span className={`relative inline-flex rounded-full h-1 w-1 sm:h-1.5 sm:w-1.5 ${config.dot}`} />
        </span>
      )}

      <span className="leading-none pt-0.5 whitespace-nowrap shrink-0">
        {config.label}
      </span>
    </motion.div>
  );
});

StatusBadge.displayName = "StatusBadge";

export default StatusBadge;