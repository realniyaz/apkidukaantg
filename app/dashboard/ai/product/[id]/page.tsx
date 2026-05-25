"use client";

import React, { useEffect, useState, use } from "react";
import { apiRequest } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import {
  BrainCircuit,
  TrendingUp,
  ArrowLeft,
  Activity,
  Zap,
  ShoppingCart,
  TrendingDown,
  Box,
  Clock,
  Coins
} from "lucide-react";
import Link from "next/link";

interface ProductIntelligence {
  product_name: string;
  current_stock: number;
  total_sold_last_30_days: number;
  average_daily_sales: number;
  days_of_stock_remaining: number;
  classification: "SLOW_MOVING" | "MODERATE_MOVING" | "FAST_MOVING";
  true_margin_percent: number;
  suggested_reorder_quantity: number;
}

export default function ProductIntelligencePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const productId = resolvedParams.id;

  const [data, setData] = useState<ProductIntelligence | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIntelligence = async () => {
      try {
        const response = await apiRequest<ProductIntelligence>(
          `/ai/product/${productId}/intelligence`
        );
        setData(response);
      } catch (error) {
        console.error("Failed to load inventory performance metrics:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchIntelligence();
  }, [productId]);

  if (loading) return <IntelligenceSkeleton />;
  if (!data) return <div className="p-12 sm:p-20 text-center text-xs font-semibold text-slate-400 italic">Inventory analysis metrics are currently unavailable for this product.</div>;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8 pb-24 text-slate-900 w-full"
    >
      {/* 1. HEADER SECTION */}
      <div className="space-y-4 w-full">
        <Link 
          href={`/dashboard/ai/product`}
          className="inline-flex items-center gap-1.5 text-slate-400 hover:text-slate-900 font-black text-[10px] sm:text-xs uppercase tracking-wider transition-all group w-fit"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
          Back to Product Insights
        </Link>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6 w-full min-w-0">
          <div className="flex items-center gap-4 min-w-0">
            <div className="p-3 sm:p-4 bg-slate-900 rounded-xl sm:rounded-[1.5rem] shadow-sm text-lime-400 shrink-0">
              <BrainCircuit size={24} className="sm:h-8 sm:w-8" />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase italic truncate pr-1 leading-tight">
                {data.product_name}
              </h1>
              <p className="text-slate-400 font-bold text-[10px] sm:text-xs flex items-center gap-1.5 mt-1 sm:mt-1.5 uppercase tracking-wide">
                <Activity size={12} className="text-lime-500 shrink-0" />
                Live Performance Analysis
              </p>
            </div>
          </div>
          <ClassificationBadge classification={data.classification} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
        
        {/* 2. OPERATIONAL RUNWAY SECTOR */}
        <div className="col-span-12 lg:col-span-4 bg-slate-900 rounded-xl sm:rounded-[2rem] md:rounded-[3rem] p-6 sm:p-8 md:p-10 shadow-md relative overflow-hidden flex flex-col items-center justify-center text-white min-w-0">
          <div className="absolute top-0 right-0 w-32 h-32 bg-lime-500/5 blur-[50px] rounded-full pointer-events-none" />
          
          <p className="text-[9px] sm:text-[10px] font-black text-slate-500 uppercase tracking-wider mb-6 sm:mb-10 text-center">Stock Runway Forecast</p>
          
          <div className="relative flex items-center justify-center w-40 h-40 sm:w-44 sm:h-44 shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 176 176">
              <circle cx="88" cy="88" r="80" stroke="rgba(255,255,255,0.04)" strokeWidth="10" fill="transparent" />
              <motion.circle
                cx="88" cy="88" r="80" stroke="#bef264" strokeWidth="10" fill="transparent"
                strokeDasharray={502}
                initial={{ strokeDashoffset: 502 }}
                animate={{ strokeDashoffset: 502 - Math.min((data.days_of_stock_remaining / 180) * 502, 502) }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center min-w-0">
              <span className="text-4xl sm:text-5xl font-black tabular-nums tracking-tight italic leading-none">{data.days_of_stock_remaining}</span>
              <span className="text-[9px] sm:text-[10px] font-black text-lime-400 uppercase tracking-wider pt-1">Days Left</span>
            </div>
          </div>

          <div className="mt-6 sm:mt-10 w-full p-3.5 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between gap-4 shrink-0">
             <div className="flex items-center gap-2 min-w-0">
               <Box size={14} className="text-lime-400 shrink-0" />
               <p className="text-xs font-bold text-slate-300 tracking-tight truncate">Current Inventory: {data.current_stock}</p>
             </div>
             <p className="text-[9px] sm:text-[10px] font-black text-slate-500 uppercase tracking-wide shrink-0">Units</p>
          </div>
        </div>

        {/* 3. PERFORMANCE MATRIX GRID */}
        <div className="col-span-12 lg:col-span-8 flex flex-col justify-between gap-6 sm:gap-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
            <StatCard 
              label="30-Day Velocity" 
              value={data.total_sold_last_30_days.toLocaleString('en-IN')} 
              icon={<TrendingUp size={16}/>} 
              desc="Units sold total"
              color="lime"
            />
            <StatCard 
              label="Daily Avg Sales" 
              value={data.average_daily_sales.toLocaleString('en-IN', { maximumFractionDigits: 1 })} 
              icon={<Clock size={16}/>} 
              desc="Average pull rate"
              color="blue"
            />
             <StatCard 
              label="Net Profit Margin" 
              value={`${data.true_margin_percent}%`} 
              icon={<Coins size={16}/>} 
              desc="Realized margin yield"
              color="lime"
            />
          </div>

          {/* AI OPTIMIZATION PANEL */}
          <div className="bg-white border border-slate-100 p-5 sm:p-8 rounded-xl sm:rounded-[2.5rem] shadow-sm flex flex-col sm:flex-row items-start gap-4 sm:gap-6 relative group overflow-hidden w-full min-w-0 flex-1 justify-center">
            <div className="h-11 w-11 sm:h-14 sm:w-14 bg-slate-50 rounded-xl flex items-center justify-center text-slate-900 shrink-0 border border-slate-100 group-hover:bg-slate-900 group-hover:text-white transition-colors duration-300">
              <Zap size={22} />
            </div>
            <div className="space-y-4 sm:space-y-6 flex-1 min-w-0 w-full">
              <div className="space-y-0.5">
                <span className="px-2 py-0.5 bg-lime-50 border border-lime-100 text-lime-700 text-[9px] font-black uppercase rounded tracking-wide inline-block">Smart Optimization</span>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight uppercase italic">Restock Recommendation</h3>
              </div>
              
              <div className="flex flex-col md:flex-row md:items-center gap-4 w-full">
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl min-w-[160px] shrink-0">
                  <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-wider leading-none mb-2">Suggested Order</p>
                  <p className="text-xl sm:text-2xl font-black text-slate-800 tabular-nums italic">
                    {data.suggested_reorder_quantity.toLocaleString('en-IN')} <span className="text-xs font-bold text-slate-400 not-italic uppercase tracking-wide">Units</span>
                  </p>
                </div>
                <p className="text-xs sm:text-sm text-slate-400 font-semibold leading-relaxed max-w-sm">
                  {data.suggested_reorder_quantity > 0 
                    ? "Current items are clearing at a velocity that hazards an impending stockout. Order replenishment stock promptly."
                    : "Available stock runtime satisfies active demand pools beautifully. No immediate orders required; preserve liquid store capital."}
                </p>
              </div>

              <div className="pt-1 flex flex-wrap gap-2.5 sm:gap-3 w-full">
                 <Link href="/dashboard/purchases/create" className="h-10 px-5 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-wider hover:bg-black transition-all active:scale-[0.99] flex items-center justify-center shadow-sm shrink-0">
                    Create Purchase Order
                 </Link>
                 <Link href="/dashboard/sales" className="h-10 px-5 bg-slate-50 text-slate-500 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-slate-100 transition-all border border-slate-200 flex items-center justify-center gap-1.5 shrink-0">
                   <ShoppingCart size={14} /> Sales History
                 </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* --- REUSABLE UI BLOCKS --- */

function ClassificationBadge({ classification }: { classification: string }) {
  const isSlow = classification.includes("SLOW");
  const labelText = classification.replace("_", " ");
  return (
    <div className={`px-4 sm:px-5 h-9 rounded-xl font-black text-[10px] sm:text-xs uppercase tracking-wider border-b-2 shadow-sm flex items-center justify-center gap-2 shrink-0 ${
      isSlow ? "bg-slate-50 text-slate-500 border-slate-200" : "bg-lime-400 text-slate-900 border-lime-500"
    }`}>
      {isSlow ? <TrendingDown size={14} className="shrink-0" /> : <TrendingUp size={14} className="shrink-0" />}
      <span className="italic">{labelText}</span>
    </div>
  );
}

function StatCard({ label, value, icon, desc, color }: any) {
  const themes: any = {
    lime: "border-lime-100 group-hover:bg-lime-400",
    blue: "border-blue-100 group-hover:bg-blue-500"
  };
  return (
    <div className="bg-white p-4 sm:p-5 md:p-6 border border-slate-100 rounded-xl sm:rounded-[1.5rem] shadow-sm group hover:shadow-md transition-all duration-300 w-full min-w-0">
      <div className={`p-2 bg-slate-50 rounded-lg border inline-flex mb-3 sm:mb-4 transition-colors duration-300 ${themes[color]}`}>
        <div className="group-hover:text-slate-900 text-slate-800 transition-colors shrink-0">{icon}</div>
      </div>
      <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-slate-400 leading-none mb-1 truncate">{label}</p>
      <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight tabular-nums mb-0.5 truncate italic">{value}</h2>
      <p className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase truncate">{desc}</p>
    </div>
  );
}

function IntelligenceSkeleton() {
  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 md:p-10 space-y-6 sm:space-y-8 animate-pulse w-full">
      <div className="h-16 sm:h-20 bg-slate-100 rounded-xl sm:rounded-3xl w-full" />
      <div className="grid grid-cols-12 gap-6 sm:gap-8">
        <div className="col-span-12 lg:col-span-4 h-80 sm:h-96 bg-slate-900/5 rounded-xl sm:rounded-[2rem]" />
        <div className="col-span-12 lg:col-span-8 h-80 sm:h-96 bg-slate-100 rounded-xl sm:rounded-[2rem]" />
      </div>
    </div>
  );
}