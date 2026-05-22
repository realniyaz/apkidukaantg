"use client";

import { useState, useEffect, useCallback } from "react";
import { apiRequest, cleanDecimal } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { 
  TrendingUp, 
  Zap, 
  Loader2, 
  PieChart, 
  BrainCircuit, 
  ArrowRight,
  TrendingDown,
  Percent,
  Coins,
  ShieldCheck,
  RefreshCcw,
  Sparkles,
  Target,
  Activity // ✅ FIXED: Added missing import
} from "lucide-react";

interface ProfitSummary {
  revenue_last_30_days: number;
  profit_last_30_days: number;
  gross_margin_percent: number;
  profit_concentration_percent: number;
  top_profit_products: {
    product: string;
    profit: number;
  }[];
  loss_making_products: any[];
  ai_insights: string[];
}

export default function ProfitSummaryPage() {
  const [data, setData] = useState<ProfitSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProfitIntelligence = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const response = await apiRequest<ProfitSummary>("ai/profit/summary");
      setData(response);
    } catch (error: any) {
      console.error("Neural Profit Sync Failed:", error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchProfitIntelligence();
  }, [fetchProfitIntelligence]);

  if (loading) return <LoadingTerminal label="Analyzing Profit Vectors..." />;
  if (!data) return <ErrorState onRetry={() => fetchProfitIntelligence()} />;

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="max-w-[1600px] mx-auto p-6 md:p-10 space-y-12 pb-40 selection:bg-lime-500/30"
    >
      {/* 01. COMMAND HEADER */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 border-b border-slate-100 pb-12">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-lime-600 font-black text-[10px] uppercase tracking-[0.5em] bg-lime-50 w-fit px-4 py-2 rounded-full border border-lime-100">
            <BrainCircuit size={14} className="animate-pulse" /> 
            Intelligence Node: Margin Analysis
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter uppercase italic leading-[0.8]">
            Yield <span className="text-transparent bg-clip-text bg-gradient-to-b from-slate-200 to-slate-400">Analysis</span>
          </h1>
        </div>

        <div className="flex items-center gap-4 w-full lg:w-auto">
           <button 
             onClick={() => fetchProfitIntelligence(true)}
             disabled={refreshing}
             className="flex-1 lg:flex-none h-[72px] px-10 bg-slate-900 text-white rounded-[2.2rem] font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-2xl flex items-center justify-center gap-4 group"
           >
             <RefreshCcw size={20} className={refreshing ? "animate-spin text-lime-400" : "group-hover:rotate-180 transition-transform duration-700"} />
             Refresh Pulse
           </button>
        </div>
      </header>

      {/* 02. CORE STATS GRID - UI CONSISTENCY FIXED */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <MetricCard 
          label="Net Profit (30D)" 
          value={`₹${cleanDecimal(data.profit_last_30_days).toLocaleString('en-IN')}`} 
          sub="30D Neural Yield"
          icon={<Coins size={22} />} 
          color="lime" 
        />
        <MetricCard 
          label="Gross Margin" 
          value={`${data.gross_margin_percent}%`} 
          sub="Efficiency Factor"
          icon={<Percent size={22} />} 
          color="blue" 
        />
        <MetricCard 
          label="Concentration" 
          value={`${data.profit_concentration_percent}%`} 
          sub="Core Performance %"
          icon={<Target size={22} />} 
          color="orange" 
        />
        <MetricCard 
          label="Total Revenue" 
          value={`₹${cleanDecimal(data.revenue_last_30_days).toLocaleString('en-IN')}`} 
          sub="Gross Throughput"
          icon={<TrendingUp size={22} />} 
          color="slate" 
        />
      </div>

      {/* 03. COMPOSITION & INSIGHTS */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        <div className="xl:col-span-2 bg-white rounded-[4rem] border border-slate-100 p-12 shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-12">
               <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-slate-900 flex items-center justify-center text-lime-400 shadow-xl">
                    <TrendingUp size={24} />
                  </div>
                  <h3 className="text-xl font-black uppercase italic tracking-tighter text-slate-900">Yield Engines</h3>
               </div>
            </div>

            <div className="space-y-6">
              {data.top_profit_products.map((item, idx) => (
                <div key={idx} className="group flex items-center justify-between p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 hover:bg-white hover:shadow-xl transition-all duration-500">
                  <div className="flex items-center gap-8">
                    <div className="h-16 w-16 bg-white rounded-3xl flex items-center justify-center font-black text-2xl text-slate-900 shadow-sm border border-slate-100">
                      {idx + 1}
                    </div>
                    <div className="max-w-[200px] md:max-w-md">
                      <p className="font-black text-2xl text-slate-900 uppercase italic tracking-tight truncate">{item.product}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 flex items-center gap-2">
                        <Sparkles size={12} className="text-lime-500" /> Primary Contributor
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl md:text-3xl font-black text-lime-600 tabular-nums tracking-tighter italic">₹{cleanDecimal(item.profit).toLocaleString('en-IN')}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-slate-900 rounded-[4rem] p-12 text-white shadow-2xl flex flex-col relative overflow-hidden border border-white/5">
          <div className="relative z-10 flex-1">
            <div className="flex items-center gap-4 mb-12">
              <div className="h-14 w-14 rounded-2xl bg-lime-400 flex items-center justify-center text-slate-900">
                <BrainCircuit size={28} />
              </div>
              <h3 className="text-2xl font-black uppercase italic tracking-tighter">AI Pulse</h3>
            </div>
            
            <div className="space-y-6">
              {data.ai_insights.map((insight, idx) => (
                <div key={idx} className="flex gap-5 p-8 bg-white/5 rounded-[2rem] border border-white/10 italic font-medium leading-relaxed text-lime-100/90 text-base">
                  <ArrowRight className="text-lime-400 shrink-0 mt-1" size={20} />
                  "{insight}"
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 mt-12 pt-12 border-t border-white/5">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-red-400">
                  <TrendingDown size={20} />
                  <p className="text-[11px] font-black uppercase tracking-[0.4em]">Loss Tracking</p>
                </div>
                <span className="px-4 py-1 bg-red-500/10 border border-red-500/20 rounded-full text-xs font-black text-red-500">
                  {data.loss_making_products.length} Assets
                </span>
             </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function MetricCard({ label, value, sub, icon, color }: any) {
  const themes: any = {
    lime: "text-lime-500 bg-lime-50 border-lime-100",
    blue: "text-blue-500 bg-blue-50 border-blue-100",
    slate: "text-slate-500 bg-slate-50 border-slate-100",
    orange: "text-orange-500 bg-orange-50 border-orange-100",
  };

  return (
    <div className="bg-white p-8 rounded-[2.5rem] border-2 border-slate-50 shadow-sm flex flex-col justify-between min-h-[240px]">
      <div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 border shadow-inner ${themes[color]}`}>
          {icon}
        </div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-2">{label}</p>
        <p className="text-3xl xl:text-4xl font-black text-slate-900 tabular-nums tracking-tighter italic break-words leading-none">
          {value}
        </p>
      </div>
      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-6 opacity-60 italic border-t border-slate-50 pt-4 flex items-center gap-2">
        <Zap size={10} className="text-lime-500" /> {sub}
      </p>
    </div>
  );
}

function LoadingTerminal({ label }: { label: string }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <Loader2 className="animate-spin text-slate-900 mb-4" size={48} />
      <p className="font-black text-slate-400 uppercase tracking-[0.4em] text-[10px] italic animate-pulse">{label}</p>
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
       <Activity size={64} className="text-red-500 mb-6" />
       <button onClick={onRetry} className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl">Retry Sync</button>
    </div>
  );
}