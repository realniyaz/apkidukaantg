"use client";

import { useEffect, useState, use } from "react";
import { apiRequest } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import {
  BrainCircuit,
  TrendingUp,
  ArrowLeft,
  Activity,
  Zap,
  IndianRupee,
  BarChart3,
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
        console.error("AI intelligence fetch failed:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchIntelligence();
  }, [productId]);

  if (loading) return <IntelligenceSkeleton />;
  if (!data) return <div className="p-20 text-center text-slate-400">Neural analysis unavailable for this entity.</div>;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto p-6 md:p-10 space-y-10 pb-24"
    >
      {/* 1. ERP NAVIGATION & HEADER */}
      <div className="space-y-6">
        <Link 
          href={`/dashboard/ai/product`}
          className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-900 font-bold text-xs uppercase tracking-widest transition-all group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Neural Hub
        </Link>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-slate-900 rounded-[1.5rem] shadow-xl text-lime-400">
              <BrainCircuit size={32} />
            </div>
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight capitalize">
                {data.product_name}
              </h1>
              <p className="text-slate-500 font-medium flex items-center gap-2">
                <Activity size={14} className="text-lime-500" />
                Real-time AI Performance Audit
              </p>
            </div>
          </div>
          <ClassificationBadge classification={data.classification} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* 2. RUNWAY GAUGE (Days of Stock Remaining) */}
        <div className="lg:col-span-4 bg-slate-900 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden flex flex-col items-center justify-center text-white">
          <div className="absolute top-0 right-0 w-32 h-32 bg-lime-500/10 blur-3xl rounded-full" />
          
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-10 text-center">Operational Runway</p>
          
          <div className="relative flex items-center justify-center">
            <svg className="w-44 h-44 transform -rotate-90">
              <circle cx="88" cy="88" r="80" stroke="rgba(255,255,255,0.05)" strokeWidth="12" fill="transparent" />
              <motion.circle
                cx="88" cy="88" r="80" stroke="#bef264" strokeWidth="12" fill="transparent"
                strokeDasharray={502}
                initial={{ strokeDashoffset: 502 }}
                animate={{ strokeDashoffset: 502 - Math.min((data.days_of_stock_remaining / 365) * 502, 502) }}
                transition={{ duration: 1.5, ease: "circOut" }}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center text-center">
              <span className="text-5xl font-black tabular-nums tracking-tighter">{data.days_of_stock_remaining}</span>
              <span className="text-[9px] font-black text-lime-500/60 uppercase tracking-[0.2em]">Days Remaining</span>
            </div>
          </div>

          <div className="mt-10 w-full p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between">
             <div className="flex items-center gap-2">
               <Box size={16} className="text-lime-400" />
               <p className="text-xs font-bold text-slate-300 tracking-tight">Stock Level: {data.current_stock}</p>
             </div>
             <p className="text-[10px] font-black text-slate-500">Units</p>
          </div>
        </div>

        {/* 3. PERFORMANCE GRID */}
        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard 
              label="30D Velocity" 
              value={data.total_sold_last_30_days} 
              icon={<TrendingUp size={18}/>} 
              desc="Units sold"
              color="lime"
            />
            <StatCard 
              label="Daily Avg" 
              value={data.average_daily_sales.toFixed(2)} 
              icon={<Clock size={18}/>} 
              desc="Pull rate"
              color="blue"
            />
             <StatCard 
              label="True Margin" 
              value={`${data.true_margin_percent}%`} 
              icon={<Coins size={18}/>} 
              desc="Net profit"
              color="lime"
            />
          </div>

          {/* AI STRATEGY CARD */}
          <div className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/40 flex items-start gap-6 relative group overflow-hidden">
            <div className="h-14 w-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-900 shrink-0 border border-slate-100 group-hover:bg-slate-900 group-hover:text-white transition-colors duration-500">
              <Zap size={28} />
            </div>
            <div className="space-y-4 relative z-10">
              <div>
                <span className="px-2 py-0.5 bg-lime-100 text-lime-700 text-[10px] font-black uppercase rounded">Smart optimization</span>
                <h3 className="text-xl font-black text-slate-900 tracking-tight mt-1">Neural Procurement Strategy</h3>
              </div>
              
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 min-w-[180px]">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">Suggested Reorder</p>
                  <p className="text-2xl font-black text-slate-900 tabular-nums">
                    {data.suggested_reorder_quantity} <span className="text-xs text-slate-400">Units</span>
                  </p>
                </div>
                <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-sm">
                  {data.suggested_reorder_quantity > 0 
                    ? "Neural models detect stock-out risk. Replenish immediately to maintain consistent service levels."
                    : "Inventory runway is extensive. Neural logic suggests halting procurement to preserve liquid capital."}
                </p>
              </div>

              <div className="pt-2 flex gap-3">
                 <button className="px-6 py-3 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all active:scale-95 shadow-lg shadow-slate-200">
                   Execute Purchase Order
                 </button>
                 <Link href="/dashboard/sales" className="px-6 py-3 bg-slate-50 text-slate-500 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-100 transition-all border border-slate-200 flex items-center gap-2">
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

/* --- REUSABLE ERP COMPONENTS --- */

function ClassificationBadge({ classification }: { classification: string }) {
  const isSlow = classification.includes("SLOW");
  return (
    <div className={`px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-[0.2em] border-b-4 shadow-lg flex items-center gap-3 ${
      isSlow ? "bg-slate-100 text-slate-600 border-slate-200" : "bg-lime-500 text-slate-900 border-lime-600"
    }`}>
      {isSlow ? <TrendingDown size={16} /> : <TrendingUp size={16} />}
      {classification.replace("_", " ")}
    </div>
  );
}

function StatCard({ label, value, icon, desc, color }: any) {
  const themes: any = {
    lime: "border-lime-100 group-hover:bg-lime-500",
    blue: "border-blue-100 group-hover:bg-blue-500"
  };
  return (
    <div className="bg-white p-6 border border-slate-100 rounded-[1.5rem] shadow-sm group hover:shadow-xl transition-all duration-500">
      <div className={`p-2.5 bg-slate-50 rounded-xl border inline-flex mb-4 transition-colors duration-500 ${themes[color]}`}>
        <div className="group-hover:text-white text-slate-900 transition-colors">{icon}</div>
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{label}</p>
      <h2 className="text-2xl font-black text-slate-900 tabular-nums mb-1">{value}</h2>
      <p className="text-[10px] text-slate-400 font-bold uppercase">{desc}</p>
    </div>
  );
}

function IntelligenceSkeleton() {
  return (
    <div className="max-w-6xl mx-auto p-10 space-y-10 animate-pulse">
      <div className="h-20 bg-slate-100 rounded-3xl" />
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-4 h-96 bg-slate-900/5 rounded-[3rem]" />
        <div className="col-span-8 h-96 bg-slate-100 rounded-[3rem]" />
      </div>
    </div>
  );
}