"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { apiRequest, cleanDecimal } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import {
  BrainCircuit,
  TrendingUp,
  Activity,
  Zap,
  IndianRupee,
  Search,
  BarChart3,
  Box,
  Clock,
  ArrowUpRight,
  TrendingDown,
  AlertCircle,
  RefreshCcw
} from "lucide-react";
import Link from "next/link";

interface ProductIntelligence {
  product_id: number;
  product_name: string;
  current_stock: number;
  total_sold_last_30_days: number;
  average_daily_sales: number;
  days_of_stock_remaining: number;
  classification: "DEAD" | "OUT_OF_STOCK" | "SLOW_MOVING" | "MODERATE_MOVING" | "FAST_MOVING";
  true_margin_percent: number | string | null;
  suggested_reorder_quantity: number;
}

export default function AllProductsIntelligencePage() {
  const [intelList, setIntelList] = useState<ProductIntelligence[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchAllIntelligence = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      
      const response = await apiRequest<ProductIntelligence[]>("/ai/products/intelligence");
      setIntelList(response || []);
    } catch (error) {
      console.error("Failed to load inventory performance records:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchAllIntelligence();
  }, [fetchAllIntelligence]);

  const filteredList = useMemo(() => {
    return intelList.filter(item => 
      item.product_name.toLowerCase().includes(searchQuery.toLowerCase().trim())
    );
  }, [intelList, searchQuery]);

  if (loading) return <LedgerSkeleton />;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8 pb-40 text-slate-900 w-full"
    >
      {/* 01. INTEL HEADER ROW */}
      <header className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-4 sm:gap-6 border-b border-slate-100 pb-6 sm:pb-8">
        <div className="space-y-2 sm:space-y-3 w-full lg:w-auto min-w-0">
          <div className="flex items-center gap-1.5 text-lime-600 font-black text-[9px] sm:text-[10px] uppercase tracking-wider bg-lime-50 w-fit px-3 py-1.5 rounded-full border border-lime-100/60">
            <BrainCircuit size={12} className="shrink-0" /> 
            AI Demand Forecasts
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight uppercase italic leading-none truncate pr-1">
            Product <span className="text-transparent bg-clip-text bg-gradient-to-b from-slate-400 to-slate-600">Intelligence</span>
          </h1>
          <p className="text-slate-400 font-medium text-xs sm:text-sm">
            Evaluating historical velocities and margins across <span className="text-slate-900 font-black font-mono">#{intelList.length} catalog items</span>.
          </p>
        </div>

        {/* CONTROLS */}
        <div className="flex flex-row items-center gap-3 w-full lg:w-auto pt-2 lg:pt-0">
          <div className="w-full sm:w-auto flex-1 sm:flex-none flex items-center gap-3 bg-white border border-slate-100 rounded-xl h-12 px-4 shadow-sm focus-within:ring-4 focus-within:ring-lime-500/5 focus-within:border-lime-500/30 transition-all group">
            <Search size={16} className="text-slate-300 group-focus-within:text-lime-500 transition-colors shrink-0" />
            <input 
              type="text"
              placeholder="Search product title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent outline-none text-sm font-semibold w-full sm:w-48 placeholder:font-normal text-slate-800 shadow-none"
            />
          </div>
          
          <button 
            onClick={() => fetchAllIntelligence(true)}
            disabled={refreshing}
            className="h-12 w-12 flex items-center justify-center bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-slate-900 hover:border-slate-400 transition-all active:scale-95 shadow-sm shrink-0"
            title="Refresh Stock Predictions"
          >
            <RefreshCcw size={16} className={refreshing ? "animate-spin text-lime-500" : ""} />
          </button>
        </div>
      </header>

      {/* 02. DATA MANIFEST CARD TABLE */}
      <div className="bg-white rounded-xl sm:rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden relative w-full">
        <div className="absolute top-0 right-0 p-10 opacity-[0.015] pointer-events-none hidden lg:block">
          <BarChart3 size={400} />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-separate border-spacing-0 min-w-[950px]">
            <thead>
              <tr className="bg-slate-50/50 text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-100 italic">
                <th className="px-5 sm:px-8 py-4 text-left">Product Details</th>
                <th className="px-5 sm:px-8 py-4 text-left w-48">Stock Runway</th>
                <th className="px-5 sm:px-8 py-4 text-left w-44">Sales Velocity</th>
                <th className="px-5 sm:px-8 py-4 text-left w-52">Turnover Rate</th>
                <th className="px-5 sm:px-8 py-4 text-right w-56">Replenishment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 font-semibold text-slate-700">
              <AnimatePresence mode="popLayout">
                {filteredList.map((product, idx) => {
                  const margin = cleanDecimal(product.true_margin_percent);
                  const isLowRunway = product.days_of_stock_remaining < 15;

                  return (
                    <motion.tr 
                      key={product.product_id || product.product_name}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.015, duration: 0.18 }}
                      className="group hover:bg-slate-50/40 transition-colors duration-150 cursor-default"
                    >
                      {/* Product Details */}
                      <td className="px-5 sm:px-8 py-4">
                        <div className="flex flex-col min-w-0 pr-2">
                          <Link 
                            href={`/dashboard/inventory/${product.product_id}`} 
                            className="font-black text-slate-900 text-sm tracking-tight uppercase italic group-hover:text-blue-600 transition-colors flex items-center gap-1 w-fit truncate"
                          >
                            {product.product_name}
                            <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                          </Link>
                          <span className="text-[9px] sm:text-[10px] font-black text-lime-600 flex items-center gap-0.5 mt-1.5 uppercase tracking-wide">
                            <IndianRupee size={11} className="shrink-0" /> Margin yield: {margin > 0 ? `${margin}%` : "CALCULATING..."}
                          </span>
                        </div>
                      </td>

                      {/* Stock Level */}
                      <td className="px-5 sm:px-8 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-700 tabular-nums italic">
                            {product.current_stock.toLocaleString('en-IN')} Units
                          </span>
                          <div className={`flex items-center gap-1 text-[9px] font-black uppercase mt-1.5 px-2.5 py-0.5 rounded-md w-fit border ${
                            isLowRunway ? 'bg-red-50 text-red-500 border-red-100/50 animate-pulse' : 'bg-slate-50 text-slate-400 border-slate-100'
                          }`}>
                             <Clock size={10} className="shrink-0" /> {product.days_of_stock_remaining} Days Left
                          </div>
                        </div>
                      </td>

                      {/* Sales Velocity */}
                      <td className="px-5 sm:px-8 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-black text-slate-900 tabular-nums italic">
                            {product.total_sold_last_30_days.toLocaleString('en-IN')} Sold
                          </span>
                          <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1.5">
                            {product.average_daily_sales.toFixed(1)} items / day
                          </span>
                        </div>
                      </td>

                      {/* Turnover Category Tag */}
                      <td className="px-5 sm:px-8 py-4">
                        <ClassificationTag classification={product.classification} />
                      </td>

                      {/* Suggested Reorder Action Trigger */}
                      <td className="px-5 sm:px-8 py-4 text-right">
                         {product.suggested_reorder_quantity > 0 ? (
                           <Link 
                            href="/dashboard/purchases/create"
                            className="inline-flex flex-col items-end group/action w-full sm:w-auto"
                           >
                              <span className="h-9 px-4 bg-slate-900 text-white text-[9px] font-black rounded-lg sm:rounded-xl shadow-sm group-hover/action:bg-lime-400 group-hover/action:text-slate-900 transition-all uppercase tracking-wide flex items-center gap-1.5 active:scale-95 whitespace-nowrap">
                                Reorder +{product.suggested_reorder_quantity}
                                <Zap size={12} fill="currentColor" className="text-lime-400 group-hover/action:text-slate-900" />
                              </span>
                              <p className="text-[9px] text-red-500 font-black mt-1.5 uppercase tracking-tight italic whitespace-nowrap">Stockout Risk Window</p>
                           </Link>
                         ) : (
                           <div className="h-9 w-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-200 ml-auto border border-slate-100 group-hover:border-lime-200 group-hover:text-lime-500 transition-colors shadow-inner">
                              <InternalStaticBadge size={16} />
                           </div>
                         )}
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {filteredList.length === 0 && (
          <div className="py-24 sm:py-32 text-center space-y-3 w-full">
             <Box size={40} className="mx-auto text-slate-200 shrink-0" />
             <p className="text-[10px] sm:text-[11px] font-black text-slate-400 uppercase tracking-wider italic">No products match your current filters</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* --- REUSABLE MATRIX LABELS --- */

function ClassificationTag({ classification }: { classification: string }) {
  const map: Record<string, { bg: string, text: string, icon: any, color: string }> = {
    FAST_MOVING: { bg: "bg-lime-50 border-lime-100/70", text: "Fast Moving", icon: TrendingUp, color: "text-lime-600" },
    MODERATE_MOVING: { bg: "bg-blue-50 border-blue-100/70", text: "Moderate", icon: Activity, color: "text-blue-600" },
    SLOW_MOVING: { bg: "bg-orange-50 border-orange-100/70", text: "Slow Moving", icon: TrendingDown, color: "text-orange-600" },
    DEAD: { bg: "bg-red-50 border-red-100/70", text: "No Velocity", icon: AlertCircle, color: "text-red-500" },
    OUT_OF_STOCK: { bg: "bg-slate-900 border-slate-800", text: "Out of Stock", icon: Box, color: "text-white" },
  };

  const config = map[classification] || map.SLOW_MOVING;
  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[9px] sm:text-[10px] font-black uppercase tracking-wider italic shrink-0 whitespace-nowrap ${config.bg} ${config.color} shadow-sm`}>
      <Icon size={12} strokeWidth={2.5} className="shrink-0" />
      <span>{config.text}</span>
    </div>
  );
}

function InternalStaticBadge({ size }: { size: number }) {
  return <Activity size={size} className="animate-pulse text-slate-300 group-hover:text-lime-500 transition-colors" />;
}

function LedgerSkeleton() {
  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-10 space-y-6 sm:space-y-8 animate-pulse w-full">
      <div className="h-20 w-1/2 bg-slate-50 rounded-xl sm:rounded-2xl" />
      <div className="h-[600px] bg-slate-50 rounded-xl sm:rounded-[2rem]" />
    </div>
  );
}