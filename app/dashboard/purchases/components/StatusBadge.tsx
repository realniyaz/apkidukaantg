"use client";

import { motion } from "framer-motion";

export default function StatusBadge({ status }: { status: string }) {
  // Normalize status for resilient mapping
  const normalizedStatus = status?.toUpperCase() || "DRAFT";

  // Professional Storefront Color Palette
  const statusStyles: Record<string, { styles: string; label: string }> = {
    DRAFT: { styles: "bg-slate-50 text-slate-400 border-slate-100", label: "Draft" },
    POSTED: { styles: "bg-blue-50 text-blue-600 border-blue-100 shadow-[0_0_10px_rgba(59,130,246,0.05)]", label: "Ordered" },
    PAID: { styles: "bg-lime-50 text-lime-600 border-lime-200 shadow-[0_0_10px_rgba(132,204,22,0.1)]", label: "Paid" },
    PARTIALLY_PAID: { styles: "bg-amber-50 text-amber-600 border-amber-100", label: "Part Paid" },
    CANCELLED: { styles: "bg-red-50 text-red-500 border-red-100", label: "Cancelled" },
    RETURNED: { styles: "bg-orange-50 text-orange-500 border-orange-200", label: "Returned" },
  };

  const currentConfig = statusStyles[normalizedStatus] || statusStyles.DRAFT;

  return (
    <motion.span
      initial={{ opacity: 0, x: -3 }}
      animate={{ opacity: 1, x: 1 }}
      className={`
        inline-flex items-center gap-1.5 
        px-2.5 py-1 rounded-full 
        text-[9px] font-black uppercase tracking-wider italic
        border transition-all duration-300 whitespace-nowrap shrink-0
        ${currentConfig.styles}
      `}
    >
      {/* Activity Pulse Indicator Dot */}
      {(normalizedStatus === "POSTED" || normalizedStatus === "PAID") && (
        <span className="relative flex h-1 w-1 sm:h-1.5 sm:w-1.5 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75" />
          <span className="relative inline-flex rounded-full h-1 w-1 sm:h-1.5 sm:w-1.5 bg-current" />
        </span>
      )}
      
      <span className="leading-none pt-0.5 whitespace-nowrap shrink-0">
        {currentConfig.label}
      </span>
    </motion.span>
  );
}