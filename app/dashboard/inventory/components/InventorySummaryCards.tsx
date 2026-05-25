"use client";

import { motion } from "framer-motion";
import { Boxes, AlertTriangle, PackageX, TrendingUp } from "lucide-react";

interface InventorySummary {
  total_products: number;
  total_stock_value: number;
  low_stock_count: number;
  dead_stock_count: number;
}

export default function InventorySummaryCards({ summary }: { summary: InventorySummary }) {
  
  const cards = [
    {
      label: "Catalog Size",
      value: (summary?.total_products ?? 0).toLocaleString('en-IN'),
      subValue: "Active catalog lines",
      icon: Boxes,
      theme: "bg-slate-50 text-slate-500 border-slate-100",
    },
    {
      label: "Total Inventory Value",
      value: `₹${(summary?.total_stock_value ?? 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
      subValue: "Current asset valuation",
      icon: TrendingUp,
      theme: "bg-blue-50 text-blue-600 border-blue-100",
    },
    {
      label: "Restock Triggers",
      value: summary?.low_stock_count ?? 0,
      subValue: "Items below threshold",
      icon: AlertTriangle,
      theme: summary?.low_stock_count > 0 
        ? "bg-amber-50 text-amber-600 border-amber-200/60 animate-pulse" 
        : "bg-slate-50 text-slate-400 border-slate-100",
    },
    {
      label: "Slow Moving Items",
      value: summary?.dead_stock_count ?? 0,
      subValue: "Zero velocity over 90 days",
      icon: PackageX,
      theme: summary?.dead_stock_count > 0 
        ? "bg-red-50 text-red-500 border-red-200/60" 
        : "bg-slate-50 text-slate-400 border-slate-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 w-full text-slate-900">
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04, duration: 0.3, ease: "easeOut" }}
            className="bg-white rounded-xl sm:rounded-[2rem] p-4 sm:p-6 border border-slate-100 shadow-sm flex items-center justify-between gap-4 group hover:shadow-md hover:border-slate-200 transition-all duration-300 w-full min-w-0"
          >
            {/* TEXT LAYER */}
            <div className="flex flex-col min-w-0 flex-1">
              <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-slate-400 mb-0.5 sm:mb-1 truncate italic">
                {c.label}
              </p>
              <p className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight truncate leading-tight italic">
                {c.value}
              </p>
              <p className="text-[9px] sm:text-[10px] font-semibold text-slate-400 uppercase tracking-wide mt-1 truncate">
                {c.subValue}
              </p>
            </div>

            {/* BRANDING ICON WRAPPER */}
            <div className={`h-12 w-12 sm:h-14 sm:w-14 shrink-0 rounded-xl sm:rounded-2xl flex items-center justify-center border transition-transform duration-300 group-hover:scale-105 ${c.theme}`}>
              <Icon size={18} className="sm:h-5 sm:w-5 shrink-0" />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}