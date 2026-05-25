"use client";

import React, { useEffect, useState, use } from "react";
import { apiRequest } from "@/lib/api";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Box, 
  Calendar, 
  AlertCircle, 
  Zap, 
  IndianRupee, 
  Clock, 
  PackageCheck,
  ShoppingCart,Loader2
} from "lucide-react";
import Link from "next/link";

interface ReorderAnalysis {
  product_name: string;
  current_stock: number;
  average_daily_sales: number;
  supplier_lead_days: number;
  predicted_stockout_date: string | null;
  reorder_point: number;
  suggested_reorder_quantity: number;
  estimated_purchase_budget: number;
  urgency_level: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
}

export default function ReorderAnalysisResult({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [data, setData] = useState<ReorderAnalysis | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiRequest<ReorderAnalysis>(`/ai/product/${id}/reorder`)
      .then(setData)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingTerminal label="Calculating safety stock and timeline projections..." />;
  if (!data) return <div className="p-12 sm:p-20 text-center text-xs font-semibold text-slate-400 italic">Replenishment analysis records are currently unavailable for this product.</div>;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 12 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="max-w-6xl mx-auto p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8 pb-24 text-slate-900 w-full"
    >
      {/* HEADER SECTION */}
      <div className="space-y-4 w-full">
        <Link 
          href="/dashboard/ai/reorder" 
          className="inline-flex items-center gap-1.5 text-slate-400 hover:text-slate-900 font-black text-[10px] sm:text-xs uppercase tracking-wider group transition-all w-fit"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" /> Back to Predictor
        </Link>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sm:gap-6 w-full min-w-0">
          <div className="flex items-center gap-4 min-w-0">
            <div className="p-3 sm:p-4 bg-slate-900 rounded-xl sm:rounded-[1.5rem] shadow-sm text-blue-400 shrink-0">
              <Box size={24} className="sm:h-8 sm:w-8" />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase italic truncate pr-1 leading-tight">
                {data.product_name}
              </h1>
              <p className="text-slate-400 font-bold text-[10px] sm:text-xs flex items-center gap-1.5 mt-1 sm:mt-1.5 uppercase tracking-wide">
                <Zap size={12} className="text-blue-500 shrink-0" />
                Procurement & Timeline Profile
              </p>
            </div>
          </div>
          <UrgencyBadge level={data.urgency_level} />
        </div>
      </div>

      {/* CORE ANALYSIS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch w-full">
        
        {/* STOCKOUT TIMELINE PREDICTION CARD */}
        <div className="col-span-12 lg:col-span-7 bg-white border border-slate-100 rounded-xl sm:rounded-[2rem] md:rounded-[3rem] p-5 sm:p-8 md:p-10 shadow-sm flex flex-col justify-between min-h-[340px] sm:min-h-[380px] gap-6 min-w-0">
           <div className="space-y-1">
              <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-slate-400 italic">Inventory Buffer Timeline</p>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight uppercase italic">Expected Runout Date</h3>
           </div>

           <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-10 py-4 sm:py-6 w-full min-w-0 flex-1 justify-center">
              <div className="text-center shrink-0 min-w-[100px] sm:text-left">
                 <p className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 tabular-nums italic tracking-tight">{data.current_stock.toLocaleString('en-IN')}</p>
                 <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wide mt-1.5">Available Stock</p>
              </div>
              <div className="h-[2px] w-full sm:h-14 sm:w-[2px] bg-slate-100 rounded-full shrink-0" />
              <div className="min-w-0 flex-1">
                 <div className="flex items-center gap-2 mb-2">
                    <Calendar className="text-blue-500 shrink-0" size={20} />
                    <p className="text-base sm:text-lg md:text-xl font-black text-slate-800 tracking-tight italic uppercase">
                       {data.predicted_stockout_date ? new Date(data.predicted_stockout_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : "Sufficient Runway"}
                    </p>
                 </div>
                 <p className="text-xs sm:text-sm text-slate-400 font-semibold leading-relaxed">
                    Calculated against an average sales velocity of <span className="text-slate-800 font-black font-mono">{data.average_daily_sales.toFixed(1)} items / day</span>.
                 </p>
              </div>
           </div>

           <div className="bg-slate-50 rounded-xl p-4 flex items-center justify-between border border-slate-100/70 gap-4 shrink-0">
              <div className="flex items-center gap-2 min-w-0">
                 <Clock className="text-slate-400 shrink-0" size={16} />
                 <p className="text-[10px] sm:text-xs font-black text-slate-600 uppercase tracking-wider font-mono">Supplier Lead Time: {data.supplier_lead_days} Days</p>
              </div>
              <p className="text-[9px] sm:text-[10px] font-black text-blue-500 uppercase tracking-wide shrink-0 hidden sm:block">Safety buffer included</p>
           </div>
        </div>

        {/* REPLENISHMENT BUDGET CARD */}
        <div className="col-span-12 lg:col-span-5 bg-slate-900 rounded-xl sm:rounded-[2rem] md:rounded-[3rem] p-5 sm:p-8 md:p-10 text-white shadow-xl flex flex-col justify-between min-w-0">
           <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none hidden lg:block"><IndianRupee size={120} /></div>
           <div className="space-y-4 sm:space-y-6 w-full min-w-0">
              <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-slate-500 block ml-0.5">Estimated Cost</p>
              <div className="space-y-0.5 min-w-0">
                 <p className="text-[10px] sm:text-xs font-bold text-blue-400 uppercase tracking-wider">Projected Procurement Budget</p>
                 <p className="text-4xl sm:text-5xl md:text-6xl font-black tabular-nums tracking-tight italic text-white truncate pr-1">
                   ₹{data.estimated_purchase_budget.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                 </p>
              </div>
           </div>

           <div className="mt-8 space-y-3.5 sm:space-y-4 w-full shrink-0">
              <div className="flex justify-between items-center text-xs border-b border-white/5 pb-3.5">
                 <span className="text-slate-400 font-semibold uppercase text-[9px] sm:text-[10px] tracking-wider">Minimum Order Level</span>
                 <span className="font-black text-blue-400 font-mono text-sm">{data.reorder_point.toLocaleString('en-IN')} Units</span>
              </div>
              <div className="flex justify-between items-center text-xs pt-0.5">
                 <span className="text-slate-400 font-semibold uppercase text-[9px] sm:text-[10px] tracking-wider">Recommended Order Size</span>
                 <span className="font-black text-lime-400 font-mono text-sm">+{data.suggested_reorder_quantity.toLocaleString('en-IN')} Units</span>
              </div>
           </div>
        </div>
      </div>

      {/* FOOTER ACTION PANEL */}
      <div className="bg-white border border-slate-100 p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-[2.5rem] md:rounded-[3rem] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6 border-b-4 border-b-blue-500 w-full min-w-0">
         <div className="flex items-center gap-4 min-w-0">
            <div className="h-11 w-11 sm:h-14 sm:w-14 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 shadow-inner shrink-0"><PackageCheck size={24} className="sm:h-7 sm:w-7" /></div>
            <div className="min-w-0 flex-1">
              <p className="font-black text-lg sm:text-xl text-slate-900 leading-tight uppercase italic truncate">Restock Sync</p>
              <p className="text-xs text-slate-400 font-medium leading-normal mt-0.5 sm:mt-1">Generate a draft purchase order directly from these recommended quantities.</p>
            </div>
         </div>
         <Link 
           href="/dashboard/purchases/create" 
           className="w-full md:w-auto h-11 sm:h-12 px-6 sm:px-8 bg-slate-900 hover:bg-black text-white font-black rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shrink-0 shadow-sm active:scale-[0.99]"
         >
            <ShoppingCart size={14} className="shrink-0" /> 
            <span>Create Draft Purchase Order</span>
         </Link>
      </div>
    </motion.div>
  );
}

/* --- REUSABLE ADAPTIVE BADGES --- */

function UrgencyBadge({ level }: { level: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" }) {
  const styles = {
    LOW: "bg-lime-50 text-lime-600 border-lime-100/70",
    MEDIUM: "bg-amber-50 text-amber-600 border-amber-100/70",
    HIGH: "bg-orange-50 text-orange-600 border-orange-100/70",
    CRITICAL: "bg-red-50 text-red-500 border-red-100/70 animate-pulse"
  };

  return (
    <div className={`px-4 sm:px-5 h-9 rounded-xl font-black text-[10px] sm:text-xs uppercase tracking-wider border shadow-sm flex items-center justify-center gap-2 shrink-0 ${styles[level]}`}>
      <AlertCircle size={14} className="shrink-0" />
      <span className="italic">{level} Restock Urgency</span>
    </div>
  );
}

function LoadingTerminal({ label }: { label: string }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
      <Loader2 className="animate-spin text-slate-900 shrink-0" size={40} />
      <p className="mt-6 font-black text-slate-900 uppercase tracking-wider text-[10px] italic animate-pulse">{label}</p>
    </div>
  );
}