"use client";

import { useState, useEffect, useCallback } from "react";
import { apiRequest, cleanDecimal } from "@/lib/api";
import { motion } from "framer-motion";
import { 
  TrendingUp, Zap, Loader2, Package, AlertCircle, Activity,
  DollarSign, HeartPulse, BrainCircuit, ArrowRight,
  ShieldCheck, RefreshCcw, BarChart3, Flame, Ghost, Timer
} from "lucide-react";
import Link from "next/link";

interface BusinessSummary {
  revenue_last_30_days: number;
  estimated_profit_last_30_days: number;
  total_products: number;
  fast_moving_products: number;
  slow_moving_products: number;
  dead_products: number;
  critical_reorders: number;
  business_health_score: number;
}

export default function BusinessSummaryPage() {
  const [data, setData] = useState<BusinessSummary | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSummary = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiRequest<BusinessSummary>("/ai/business/summary");
      setData(response);
    } catch (error: any) {
      console.error("Neural Summary Sync Failure:", error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSummary(); }, [fetchSummary]);

  if (loading) return <LoadingTerminal label="Establishing Fiscal Link..." />;
  if (!data) return <ErrorState onRetry={fetchSummary} />;

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
      className="max-w-[1600px] mx-auto p-4 md:p-10 space-y-10 pb-40 selection:bg-lime-500/30"
    >
      {/* 01. EXECUTIVE HEADER */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 border-b border-slate-100 pb-12">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-lime-600 font-black text-[10px] uppercase tracking-[0.5em] bg-lime-50 w-fit px-4 py-2 rounded-full border border-lime-100">
            <BrainCircuit size={14} className="animate-pulse" /> 
            Intelligence Node: Business Health
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
            Fiscal <span className="text-transparent bg-clip-text bg-gradient-to-b from-slate-200 to-slate-400">Velocity</span>
          </h1>
        </div>

        <div className="flex items-center gap-4 w-full lg:w-auto">
           <button 
             onClick={fetchSummary}
             className="flex-1 lg:flex-none h-16 px-8 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all shadow-xl flex items-center justify-center gap-4 group"
           >
             <RefreshCcw size={18} className="group-hover:rotate-180 transition-transform duration-700" />
             Refresh Pulse
           </button>
        </div>
      </header>

      {/* 02. CORE STATS GRID - Responsive text sizing fixed here */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="30D Revenue" 
          value={`₹${cleanDecimal(data.revenue_last_30_days).toLocaleString('en-IN')}`} 
          sub="Neural Revenue Flow"
          icon={<DollarSign size={20} />} 
          color="lime" 
        />
        <StatCard 
          label="Net Profit" 
          value={`₹${cleanDecimal(data.estimated_profit_last_30_days).toLocaleString('en-IN')}`} 
          sub="Estimated Surplus"
          icon={<TrendingUp size={20} />} 
          color="blue" 
        />
        <StatCard 
          label="Asset Cluster" 
          value={data.total_products} 
          sub="Unique SKUs Tracked"
          icon={<Package size={20} />} 
          color="slate" 
        />
        <HealthGauge value={data.business_health_score} />
      </div>

      {/* 03. VELOCITY & CRITICALITY */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 bg-white rounded-[3rem] border border-slate-100 p-8 md:p-12 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 space-y-10">
            <div className="flex items-center gap-4">
               <div className="h-12 w-12 rounded-2xl bg-slate-900 flex items-center justify-center text-lime-400">
                  <Activity size={24} />
               </div>
               <h3 className="text-xl font-black uppercase italic tracking-tighter text-slate-900">Velocity Analysis</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <VelocityMetric label="Fast Moving" count={data.fast_moving_products} total={data.total_products} color="bg-lime-500" icon={<Flame size={16}/>} />
              <VelocityMetric label="Slow Moving" count={data.slow_moving_products} total={data.total_products} color="bg-orange-500" icon={<Timer size={16}/>} />
              <VelocityMetric label="Dead Stock" count={data.dead_products} total={data.total_products} color="bg-red-500" icon={<Ghost size={16}/>} />
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
               <p className="text-slate-500 font-medium italic text-sm leading-relaxed">
                "Neural identification of <span className="text-slate-900 font-black">{data.slow_moving_products} slow units</span> requiring stock-turn optimization."
               </p>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl flex flex-col justify-between relative overflow-hidden">
          <div className="space-y-6 relative z-10">
            <div className="flex items-center gap-4 text-red-500">
              <AlertCircle size={24} />
              <h3 className="text-sm font-black uppercase tracking-widest italic">Criticality</h3>
            </div>
            <div>
              <h2 className="text-8xl font-black italic tracking-tighter tabular-nums leading-none">{data.critical_reorders}</h2>
              <p className="text-slate-500 font-black uppercase text-[9px] tracking-[0.4em] mt-4 italic">Restock protocol required</p>
            </div>
          </div>
          <Link href="/dashboard/inventory" className="mt-10 flex items-center justify-between bg-white text-slate-900 p-6 rounded-2xl hover:bg-lime-400 transition-all active:scale-95 shadow-xl">
              <span className="font-black text-[10px] uppercase tracking-widest">Execute Restock</span>
              <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

/* --- REUSABLE COMPONENTS WITH BREAKING FIXES --- */

function StatCard({ label, value, sub, icon, color }: any) {
  const colors: any = {
    lime: "text-lime-500 bg-lime-50 border-lime-100",
    blue: "text-blue-500 bg-blue-50 border-blue-100",
    slate: "text-slate-500 bg-slate-50 border-slate-100",
  };

  return (
    <div className="bg-white p-7 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between min-h-[220px]">
      <div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 border shadow-inner ${colors[color]}`}>
          {icon}
        </div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">{label}</p>
        {/* ✅ FIX: Dynamic sizing & overflow prevention */}
        <p className="text-3xl xl:text-4xl font-black text-slate-900 tabular-nums tracking-tighter italic break-words leading-none">
          {value}
        </p>
      </div>
      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-4 opacity-60 italic border-t border-slate-50 pt-4">
        {sub}
      </p>
    </div>
  );
}

function HealthGauge({ value }: { value: number }) {
  return (
    <div className="bg-white p-7 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col items-center justify-center min-h-[220px]">
       <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6">Integrity Score</p>
       <div className="relative">
          <svg className="w-24 h-24 transform -rotate-90">
             <circle cx="48" cy="48" r="42" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-50" />
             <motion.circle 
               cx="48" cy="48" r="42" stroke="currentColor" strokeWidth="8" fill="transparent" 
               strokeDasharray={263.8}
               initial={{ strokeDashoffset: 263.8 }}
               animate={{ strokeDashoffset: 263.8 - (263.8 * value) / 100 }}
               transition={{ duration: 1.5 }}
               className={value > 70 ? "text-lime-500" : "text-orange-500"}
             />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
             <span className="text-2xl font-black italic tabular-nums text-slate-900">{value}%</span>
          </div>
       </div>
    </div>
  );
}

function VelocityMetric({ label, count, total, color, icon }: any) {
  const percent = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-end">
        <div className="flex items-center gap-2">
           {icon}
           <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
        </div>
        <span className="text-lg font-black italic tabular-nums">{count}</span>
      </div>
      <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
         <motion.div 
           initial={{ width: 0 }} 
           animate={{ width: `${percent}%` }} 
           className={`h-full ${color}`} 
         />
      </div>
    </div>
  );
}

function LoadingTerminal({ label }: { label: string }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <Loader2 className="animate-spin text-slate-900 mb-4" size={40} />
      <p className="font-black text-slate-400 uppercase tracking-[0.4em] text-[10px] italic animate-pulse">{label}</p>
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
       <AlertCircle size={48} className="text-red-500 mb-4" />
       <button onClick={onRetry} className="px-8 py-3 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl">Retry Sync</button>
    </div>
  );
}