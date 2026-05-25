"use client";

import { useEffect, useState, useCallback } from "react";
import { apiRequest, cleanDecimal } from "@/lib/api";
import { motion } from "framer-motion";
import { 
  TrendingUp, Zap, Loader2, Package, AlertCircle, Activity,
  DollarSign, BrainCircuit, ArrowRight,
  RefreshCcw, Flame, Ghost, Timer
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
      console.error("Failed to load shop performance summary:", error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { clientFetch(); }, [fetchSummary]);

  const clientFetch = () => {
    fetchSummary();
  };

  if (loading) return <LoadingTerminal label="Loading overview metrics..." />;
  if (!data) return <ErrorState onRetry={fetchSummary} />;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8 pb-40 text-slate-900 w-full"
    >
      {/* 01. EXECUTIVE HEADER ROW */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-6 sm:pb-8">
        <div className="space-y-2 sm:space-y-3 w-full sm:w-auto min-w-0">
          <div className="flex items-center gap-1.5 text-lime-600 font-black text-[9px] sm:text-[10px] uppercase tracking-wider bg-lime-50 w-fit px-3 py-1.5 rounded-full border border-lime-100/60">
            <BrainCircuit size={12} className="shrink-0" /> 
            AI Sales Intelligence
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight uppercase italic leading-none truncate pr-1">
            Store <span className="text-transparent bg-clip-text bg-gradient-to-b from-slate-400 to-slate-600">Overview</span>
          </h1>
        </div>

        <div className="w-full sm:w-auto shrink-0 pt-2 sm:pt-0">
           <button 
             onClick={clientFetch}
             className="w-full sm:w-auto h-12 px-6 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-wider hover:bg-black transition-all shadow-sm flex items-center justify-center gap-2 active:scale-[0.99] group shrink-0"
           >
             <RefreshCcw size={14} className="group-hover:rotate-180 transition-transform duration-500" />
             <span>Update Report</span>
           </button>
        </div>
      </header>

      {/* 02. CORE METRICS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 w-full">
        <StatCard 
          label="Gross Revenue (30D)" 
          value={`₹${cleanDecimal(data.revenue_last_30_days).toLocaleString('en-IN')}`} 
          sub="Total storefront sales volume"
          icon={<DollarSign size={18} />} 
          color="lime" 
        />
        <StatCard 
          label="Estimated Profit" 
          value={`₹${cleanDecimal(data.estimated_profit_last_30_days).toLocaleString('en-IN')}`} 
          sub="Calculated take-home yield"
          icon={<TrendingUp size={18} />} 
          color="blue" 
        />
        <StatCard 
          label="Active Catalog Lines" 
          value={data.total_products.toLocaleString('en-IN')} 
          sub="Unique SKUs active in stock"
          icon={<Package size={18} />} 
          color="slate" 
        />
        <HealthGauge value={data.business_health_score} />
      </div>

      {/* 03. VELOCITY MATRIX & RESTOCK PANELS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch w-full">
        
        {/* STOCK TURNOVER ROW PROGRESS LINES */}
        <div className="col-span-12 lg:col-span-8 bg-white rounded-xl sm:rounded-[2rem] md:rounded-[3rem] p-5 sm:p-8 md:p-12 shadow-sm flex flex-col justify-between min-w-0">
          <div className="space-y-6 sm:space-y-8 w-full min-w-0">
            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-50 mb-4">
               <div className="h-9 w-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-lime-600 shrink-0 shadow-inner">
                  <Activity size={16} />
               </div>
               <h3 className="text-base sm:text-lg font-black uppercase italic tracking-tight text-slate-900">Stock Turnover Velocity</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 w-full">
              <VelocityMetric label="Fast Moving" count={data.fast_moving_products} total={data.total_products} color="bg-lime-500" icon={<Flame size={14} className="shrink-0"/>} />
              <VelocityMetric label="Slow Moving" count={data.slow_moving_products} total={data.total_products} color="bg-orange-500" icon={<Timer size={14} className="shrink-0"/>} />
              <VelocityMetric label="No Velocity" count={data.dead_products} total={data.total_products} color="bg-red-500" icon={<Ghost size={14} className="shrink-0"/>} />
            </div>

            <div className="bg-slate-50 p-4 sm:p-5 rounded-xl border border-slate-100/70 shrink-0 mt-4">
               <p className="text-slate-400 font-semibold text-xs sm:text-sm leading-relaxed">
                 AI analysis flags <span className="text-slate-800 font-black">{data.slow_moving_products} low-velocity items</span> that could benefit from price adjust optimizations.
               </p>
            </div>
          </div>
        </div>

        {/* REORDER BLOCK ALERTS */}
        <div className="col-span-12 lg:col-span-4 bg-slate-900 rounded-xl sm:rounded-[2rem] md:rounded-[3rem] p-5 sm:p-8 md:p-10 text-white shadow-xl flex flex-col justify-between min-w-0">
          <div className="space-y-4 sm:space-y-6 w-full min-w-0">
            <div className="flex items-center gap-2.5 text-red-400 font-bold shrink-0">
              <AlertCircle size={20} className="shrink-0" />
              <h3 className="text-[10px] sm:text-xs font-black uppercase tracking-wider italic">Restock Alerts</h3>
            </div>
            <div className="min-w-0">
              <h2 className="text-5xl sm:text-6xl md:text-7xl font-black italic tracking-tight tabular-nums leading-none truncate break-all pr-1">{data.critical_reorders}</h2>
              <p className="text-slate-500 font-black uppercase text-[9px] tracking-wider mt-2.5 sm:mt-4 italic">Items breaching safety thresholds</p>
            </div>
          </div>
          <Link 
            href="/dashboard/inventory" 
            className="mt-8 sm:mt-10 h-12 bg-white hover:bg-lime-400 text-slate-900 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md active:scale-[0.99] shrink-0"
          >
              <span>Manage Replenishment</span>
              <ArrowRight size={14} className="shrink-0" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

/* --- ATOMIC DISPLAY PANELS --- */

interface StatCardProps {
  label: string;
  value: string | number;
  sub: string;
  icon: React.ReactNode;
  color: "lime" | "blue" | "slate";
}

function StatCard({ label, value, sub, icon, color }: StatCardProps) {
  const colors = {
    lime: "text-lime-600 bg-lime-50 border-lime-100/70",
    blue: "text-blue-600 bg-blue-50 border-blue-100/70",
    slate: "text-slate-500 bg-slate-50 border-slate-100/70",
  };

  return (
    <div className="bg-white p-5 sm:p-6 md:p-8 rounded-xl sm:rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-between min-h-[200px] sm:min-h-[220px] w-full min-w-0 group hover:shadow-md hover:border-slate-200 transition-all duration-300">
      <div className="w-full min-w-0">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 sm:mb-6 border shadow-inner transition-transform group-hover:scale-102 duration-300 ${colors[color]}`}>
          {icon}
        </div>
        <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1 truncate">{label}</p>
        <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 tracking-tight tabular-nums italic leading-none truncate pr-1">
          {value}
        </h3>
      </div>
      <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wide mt-4 opacity-60 italic truncate">
        {sub}
      </p>
    </div>
  );
}

function HealthGauge({ value }: { value: number }) {
  return (
    <div className="bg-white p-5 sm:p-6 md:p-8 rounded-xl sm:rounded-[2rem] border border-slate-100 shadow-sm flex flex-col items-center justify-center min-h-[200px] sm:min-h-[220px] w-full shrink-0 group hover:shadow-md transition-all duration-300">
       <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-wider mb-4 sm:mb-6">Catalog Health Score</p>
       <div className="relative w-20 h-20 sm:w-24 sm:h-24 shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 96 96">
             <circle cx="48" cy="48" r="42" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-slate-50" />
             <motion.circle 
               cx="48" cy="48" r="42" stroke="currentColor" strokeWidth="6" fill="transparent" 
               strokeDasharray={263.8}
               initial={{ strokeDashoffset: 263.8 }}
               animate={{ strokeDashoffset: 263.8 - (263.8 * value) / 100 }}
               transition={{ duration: 1.2, ease: "easeOut" }}
               className={value > 70 ? "text-lime-500" : "text-orange-500"}
             />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center min-w-0">
             <span className="text-lg sm:text-xl font-black italic tabular-nums text-slate-800">{value}%</span>
          </div>
       </div>
    </div>
  );
}

interface VelocityMetricProps {
  label: string;
  count: number;
  total: number;
  color: string;
  icon: React.ReactNode;
}

function VelocityMetric({ label, count, total, color, icon }: VelocityMetricProps) {
  const percent = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="space-y-2 w-full min-w-0">
      <div className="flex justify-between items-end gap-4 w-full">
        <div className="flex items-center gap-1.5 min-w-0">
           {icon}
           <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-wider truncate">{label}</p>
        </div>
        <span className="text-base sm:text-lg font-black italic tabular-nums text-slate-800 shrink-0">{count.toLocaleString('en-IN')}</span>
      </div>
      <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100/80 shrink-0">
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
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center bg-white">
      <Loader2 className="animate-spin text-slate-900 mb-4 shrink-0" size={36} />
      <p className="font-black text-slate-400 uppercase tracking-wider text-[10px] italic animate-pulse">{label}</p>
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-center">
       <AlertCircle size={48} className="text-red-500 mb-4 shrink-0 animate-pulse" />
       <button onClick={onRetry} className="h-10 px-6 bg-slate-900 hover:bg-black text-white rounded-xl font-black text-[10px] uppercase tracking-wider active:scale-[0.98] transition-all shadow-sm">
         Retry Load
       </button>
    </div>
  );
}