"use client";

import { useEffect, useState, useCallback } from "react";
import { apiRequest, cleanDecimal } from "@/lib/api";
import { motion } from "framer-motion";
import { 
  TrendingUp, 
  Zap, 
  Loader2, 
  BrainCircuit, 
  ArrowRight,
  TrendingDown,
  Percent,
  Coins,
  RefreshCcw,
  Sparkles,
  Target,
  Activity 
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
      console.error("Failed to load profit analytics data:", error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchProfitIntelligence();
  }, [fetchProfitIntelligence]);

  if (loading) return <LoadingTerminal label="Analyzing profit margins..." />;
  if (!data) return <ErrorState onRetry={() => fetchProfitIntelligence()} />;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8 pb-40 text-slate-900 w-full"
    >
      {/* 01. COMMAND HEADER */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-6 sm:pb-8">
        <div className="space-y-2 sm:space-y-3 w-full sm:w-auto min-w-0">
          <div className="flex items-center gap-1.5 text-lime-600 font-black text-[9px] sm:text-[10px] uppercase tracking-wider bg-lime-50 w-fit px-3 py-1.5 rounded-full border border-lime-100/60">
            <BrainCircuit size={12} className="shrink-0" /> 
            AI Profitability Report
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight uppercase italic leading-none truncate pr-1">
            Profit & Margin <span className="text-transparent bg-clip-text bg-gradient-to-b from-slate-400 to-slate-600">Analysis</span>
          </h1>
        </div>

        <div className="w-full sm:w-auto shrink-0 pt-2 sm:pt-0">
           <button 
             onClick={() => fetchProfitIntelligence(true)}
             disabled={refreshing}
             className="w-full sm:w-auto h-12 px-6 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-wider hover:bg-black transition-all shadow-sm flex items-center justify-center gap-2 active:scale-[0.99] group shrink-0"
           >
             <RefreshCcw size={14} className={refreshing ? "animate-spin text-lime-400" : "group-hover:rotate-180 transition-transform duration-500"} />
             <span>Update Report</span>
           </button>
        </div>
      </header>

      {/* 02. CORE STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 w-full">
        <MetricCard 
          label="Net Profit (30D)" 
          value={`₹${cleanDecimal(data.profit_last_30_days).toLocaleString('en-IN')}`} 
          sub="Net earnings past 30 days"
          icon={<Coins size={18} />} 
          color="lime" 
        />
        <MetricCard 
          label="Gross Margin Average" 
          value={`${data.gross_margin_percent}%`} 
          sub="Overall margin efficiency"
          icon={<Percent size={18} />} 
          color="blue" 
        />
        <MetricCard 
          label="Profit Concentration" 
          value={`${data.profit_concentration_percent}%`} 
          sub="Share from top products"
          icon={<Target size={18} />} 
          color="orange" 
        />
        <MetricCard 
          label="Total Revenue" 
          value={`₹${cleanDecimal(data.revenue_last_30_days).toLocaleString('en-IN')}`} 
          sub="Gross sales past 30 days"
          icon={<TrendingUp size={18} />} 
          color="slate" 
        />
      </div>

      {/* 03. COMPOSITION & INSIGHTS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch w-full">
        {/* TOP PERFORMERS CARD CONTAINER */}
        <div className="col-span-12 lg:col-span-7 bg-white rounded-xl sm:rounded-[2rem] border border-slate-100 p-5 sm:p-8 shadow-sm flex flex-col justify-between min-w-0">
          <div className="w-full min-w-0">
            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-50 mb-6 sm:mb-8">
              <div className="h-9 w-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-lime-600 shrink-0 shadow-inner">
                <TrendingUp size={16} />
              </div>
              <h3 className="text-base sm:text-lg font-black uppercase italic tracking-tight text-slate-900">Top Profit Drivers</h3>
            </div>

            <div className="space-y-3 sm:space-y-4 w-full">
              {data.top_profit_products.map((item, idx) => (
                <div key={idx} className="group flex items-center justify-between p-4 sm:p-5 bg-slate-50 border border-slate-100/70 rounded-xl hover:bg-white hover:shadow-sm transition-all duration-300 w-full min-w-0 gap-4">
                  <div className="flex items-center gap-4 sm:gap-6 min-w-0 flex-1">
                    <div className="h-10 w-10 sm:h-12 sm:w-12 bg-white rounded-lg border border-slate-100 flex items-center justify-center font-black font-mono text-sm sm:text-base text-slate-800 shadow-inner shrink-0">
                      {idx + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-black text-sm sm:text-base text-slate-900 uppercase italic tracking-tight truncate leading-tight">{item.product}</p>
                      <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wide mt-1 flex items-center gap-1 truncate">
                        <Sparkles size={11} className="text-lime-500 shrink-0" /> Core Margin Driver
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-base sm:text-lg font-black text-lime-600 tabular-nums tracking-tight italic">₹{cleanDecimal(item.profit).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI INSIGHTS SIDEBAR PANEL */}
        <div className="col-span-12 lg:col-span-5 bg-slate-900 rounded-xl sm:rounded-[2rem] p-5 sm:p-8 text-white shadow-xl flex flex-col justify-between border border-white/5 min-w-0">
          <div className="w-full min-w-0 flex-1">
            <div className="flex items-center gap-3 pb-4 border-b border-white/5 mb-6 sm:mb-8 w-full">
              <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl bg-lime-400 flex items-center justify-center text-slate-900 shrink-0">
                <BrainCircuit size={18} />
              </div>
              <h3 className="text-base sm:text-lg font-black uppercase italic tracking-tight">AI Strategy Stream</h3>
            </div>
            
            <div className="space-y-3.5 sm:space-y-4 w-full font-medium">
              {data.ai_insights.map((insight, idx) => (
                <div key={idx} className="flex gap-3 p-4 sm:p-5 bg-white/5 rounded-xl border border-white/5 italic leading-relaxed text-lime-100/90 text-xs sm:text-sm">
                  <ArrowRight className="text-lime-400 shrink-0 mt-0.5" size={16} strokeWidth={2.5} />
                  <span>"{insight}"</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-white/5 shrink-0 w-full">
             <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-red-400 italic">
                  <TrendingDown size={16} className="shrink-0" />
                  <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider">Unprofitable Products</p>
                </div>
                <span className="h-5 px-2.5 bg-red-500/10 border border-red-500/20 rounded-md text-[9px] sm:text-[10px] font-black font-mono text-red-400 flex items-center justify-center shrink-0">
                  {data.loss_making_products.length} Items
                </span>
             </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* --- REUSABLE STAT CARD COMPONENT --- */
interface MetricCardProps {
  label: string;
  value: string;
  sub: string;
  icon: React.ReactNode;
  color: "lime" | "blue" | "slate" | "orange";
}

function MetricCard({ label, value, sub, icon, color }: MetricCardProps) {
  const themes = {
    lime: "text-lime-600 bg-lime-50 border-lime-100/70",
    blue: "text-blue-600 bg-blue-50 border-blue-100/70",
    slate: "text-slate-500 bg-slate-50 border-slate-100/70",
    orange: "text-orange-600 bg-orange-50 border-orange-100/70",
  };

  return (
    <div className="bg-white p-5 sm:p-6 md:p-8 rounded-xl sm:rounded-[2rem] border border-slate-100/80 shadow-sm flex flex-col justify-between min-h-[200px] sm:min-h-[220px] md:min-h-[240px] w-full min-w-0 group hover:shadow-md hover:border-slate-200 transition-all duration-300">
      <div className="w-full min-w-0">
        <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center mb-4 sm:mb-6 border shadow-inner transition-transform group-hover:scale-102 duration-300 ${themes[color]}`}>
          {icon}
        </div>
        <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1 truncate">{label}</p>
        <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 tracking-tight tabular-nums italic break-words leading-none truncate pr-1">
          {value}
        </h3>
      </div>
      <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wide mt-4 sm:mt-6 opacity-60 border-t border-slate-50 pt-3 sm:pt-4 flex items-center gap-1.5 truncate">
        <Zap size={10} className="text-lime-500 shrink-0" /> {sub}
      </p>
    </div>
  );
}

function LoadingTerminal({ label }: { label: string }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
      <Loader2 className="animate-spin text-slate-900 shrink-0" size={40} />
      <p className="mt-6 font-black text-slate-400 uppercase tracking-wider text-[10px] italic animate-pulse">{label}</p>
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-center">
       <Activity size={48} className="text-red-500 mb-4 shrink-0 animate-pulse" />
       <h1 className="text-base sm:text-lg font-black uppercase text-slate-900 tracking-tight">Handshake Connection Interrupted</h1>
       <p className="text-slate-400 text-xs max-w-xs mx-auto mt-2 mb-6 leading-normal">Could not establish a stable connection with the profit analytics database feed.</p>
       <button onClick={onRetry} className="h-10 px-6 bg-slate-900 hover:bg-black text-white rounded-xl font-black text-[10px] uppercase tracking-wider active:scale-[0.98] transition-all shadow-sm">
         Retry Sync
       </button>
    </div>
  );
}