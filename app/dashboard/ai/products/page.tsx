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
  Filter,
  BarChart3,
  Box,
  Clock,
  ArrowUpRight,
  TrendingDown,
  AlertCircle,
  RefreshCcw,
  ChevronRight,
  ArrowRight
} from "lucide-react";
import Link from "next/link";

interface ProductIntelligence {
  product_id: number; // Added for routing
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
      console.error("AI aggregate fetch failed:", error);
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
      item.product_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [intelList, searchQuery]);

  if (loading) return <LedgerSkeleton />;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-[1600px] mx-auto p-6 md:p-10 space-y-12 pb-40 selection:bg-lime-500/30"
    >
      {/* 01. COMMAND HEADER */}
      <header className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-8 border-b border-slate-100 pb-12">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-lime-600 font-black text-[10px] uppercase tracking-[0.5em] bg-lime-50 w-fit px-4 py-2 rounded-full border border-lime-100">
            <BrainCircuit size={14} className="animate-pulse" /> 
            Neural Inventory Audit
          </div>
          <h1 className="text-7xl font-black text-slate-900 tracking-tighter uppercase italic leading-[0.85]">
            Asset <span className="text-transparent bg-clip-text bg-gradient-to-b from-slate-200 to-slate-400">Intelligence</span>
          </h1>
          <p className="text-slate-400 font-medium italic text-lg leading-relaxed max-w-2xl">
            Synthesizing performance metrics across <span className="text-slate-900 font-black underline decoration-lime-500/40">{intelList.length} unique entities</span>.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-stretch gap-4 w-full xl:w-auto">
          {/* SEARCH TERMINAL */}
          <div className="relative group md:w-96">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-lime-500 transition-colors" size={20} />
            <input 
              type="text"
              placeholder="Search Identity Node..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border-2 border-slate-100 py-6 pl-16 pr-8 rounded-[2.5rem] outline-none focus:border-lime-500 transition-all font-black italic shadow-xl shadow-slate-200/10 text-sm"
            />
          </div>
          
          <button 
            onClick={() => fetchAllIntelligence(true)}
            disabled={refreshing}
            className="h-[72px] w-[72px] flex items-center justify-center bg-white border-2 border-slate-100 rounded-[2rem] text-slate-400 hover:text-slate-900 hover:border-slate-900 transition-all active:scale-90 shadow-lg"
          >
            <RefreshCcw size={24} className={refreshing ? "animate-spin text-lime-500" : ""} />
          </button>
        </div>
      </header>

      {/* 02. INTELLIGENCE TABLE */}
      <div className="bg-white rounded-[4rem] border border-slate-100 shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 right-0 p-20 opacity-[0.02] pointer-events-none">
          <BarChart3 size={500} />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50/30">
                <th className="px-10 py-8 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] italic">Product Identity</th>
                <th className="px-10 py-8 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] italic">Stock Health</th>
                <th className="px-10 py-8 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] italic">Neural Class</th>
                <th className="px-10 py-8 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] italic">30D Velocity</th>
                <th className="px-10 py-8 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] italic">Procurement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              <AnimatePresence mode="popLayout">
                {filteredList.map((product, idx) => {
                  const margin = cleanDecimal(product.true_margin_percent);
                  const isLowRunway = product.days_of_stock_remaining < 15;

                  return (
                    <motion.tr 
                      key={product.product_id || product.product_name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.02 }}
                      className="group hover:bg-slate-50/80 transition-all"
                    >
                      {/* Identity Row */}
                      <td className="px-10 py-8">
                        <div className="flex flex-col">
                          <Link 
                            href={`/dashboard/inventory/${product.product_id}`} 
                            className="font-black text-slate-900 text-base tracking-tighter uppercase italic group-hover:text-blue-600 transition-colors flex items-center gap-2"
                          >
                            {product.product_name}
                            <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                          </Link>
                          <span className="text-[10px] font-black text-lime-600 flex items-center gap-1 mt-2 uppercase tracking-widest">
                            <IndianRupee size={10} /> Margin: {margin > 0 ? `${margin}%` : "CALCULATING..."}
                          </span>
                        </div>
                      </td>

                      {/* Stock Runway */}
                      <td className="px-10 py-8">
                        <div className="flex flex-col">
                          <span className="text-sm font-black text-slate-700 tabular-nums italic">
                            {product.current_stock} Nodes
                          </span>
                          <div className={`flex items-center gap-2 text-[10px] font-black uppercase mt-2 px-3 py-1 rounded-full w-fit border ${
                            isLowRunway ? 'bg-red-50 text-red-500 border-red-100 animate-pulse' : 'bg-slate-50 text-slate-400 border-slate-100'
                          }`}>
                             <Clock size={10} /> {product.days_of_stock_remaining}d Runway
                          </div>
                        </div>
                      </td>

                      {/* Classification */}
                      <td className="px-10 py-8">
                        <ClassificationTag classification={product.classification} />
                      </td>

                      {/* Sales Performance */}
                      <td className="px-10 py-8">
                        <div className="flex flex-col">
                          <span className="text-sm font-black text-slate-900 tabular-nums italic">
                            {product.total_sold_last_30_days} Dispatched
                          </span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">
                             Velocity: {product.average_daily_sales.toFixed(2)}/day
                          </span>
                        </div>
                      </td>

                      {/* Suggested Reorder Action */}
                      <td className="px-10 py-8 text-right">
                         {product.suggested_reorder_quantity > 0 ? (
                           <Link 
                            href="/dashboard/purchases/create"
                            className="inline-flex flex-col items-end group/action"
                           >
                              <span className="px-5 py-2.5 bg-slate-900 text-white text-[10px] font-black rounded-xl shadow-xl group-hover/action:bg-lime-500 group-hover/action:text-slate-900 transition-all uppercase tracking-widest flex items-center gap-2">
                                REORDER +{product.suggested_reorder_quantity}
                                <Zap size={12} fill="currentColor" />
                              </span>
                              <p className="text-[9px] text-red-500 font-black mt-2 uppercase tracking-tighter italic">Critical stockout risk</p>
                           </Link>
                         ) : (
                           <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-200 ml-auto border border-slate-100 group-hover:border-lime-200 group-hover:text-lime-400 transition-colors">
                              <ShieldCheck size={20} />
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
          <div className="py-40 text-center space-y-4">
             <Box size={48} className="mx-auto text-slate-100" />
             <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em]">Zero Neural Matches Found</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* --- HELPER COMPONENTS --- */

function ClassificationTag({ classification }: { classification: string }) {
  const map: Record<string, { bg: string, text: string, icon: any, color: string }> = {
    FAST_MOVING: { bg: "bg-lime-50 border-lime-100", text: "HIGH VELOCITY", icon: TrendingUp, color: "text-lime-600" },
    MODERATE_MOVING: { bg: "bg-blue-50 border-blue-100", text: "STABLE PULL", icon: Activity, color: "text-blue-600" },
    SLOW_MOVING: { bg: "bg-orange-50 border-orange-100", text: "LOW TRACTION", icon: TrendingDown, color: "text-orange-600" },
    DEAD: { bg: "bg-red-50 border-red-100", text: "DEAD CLUSTER", icon: AlertCircle, color: "text-red-600" },
    OUT_OF_STOCK: { bg: "bg-slate-900 border-slate-800", text: "ZERO UPLINK", icon: Box, color: "text-white" },
  };

  const config = map[classification] || map.SLOW_MOVING;
  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl border text-[10px] font-black uppercase tracking-widest ${config.bg} ${config.color} shadow-sm`}>
      <Icon size={14} strokeWidth={3} />
      {config.text}
    </div>
  );
}

function ShieldCheck({ size }: { size: number }) {
  return (
    <div className="relative">
      <Activity size={size} className="animate-pulse" />
    </div>
  )
}

function LedgerSkeleton() {
  return (
    <div className="max-w-[1600px] mx-auto p-10 space-y-12 animate-pulse">
      <div className="h-32 w-1/2 bg-slate-50 rounded-[3rem]" />
      <div className="h-[700px] bg-slate-50 rounded-[4rem]" />
    </div>
  );
}