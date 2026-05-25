"use client";

import { useEffect, useState, use, useCallback } from "react";
import { apiRequest, cleanDecimal } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, IndianRupee, Zap, ShieldCheck, 
  ArrowRightLeft, LineChart, Loader2,
  RefreshCcw, Database, Target, AlertCircle
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface PricingOptimization {
  product_name: string;
  current_price: number | string;
  suggested_price: number | string;
  classification: string;
  margin_percent_after_change: number | string;
  reason: string;
}

export default function OptimizationResultPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const router = useRouter();

  const [data, setData] = useState<PricingOptimization | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  const fetchOptimization = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiRequest<PricingOptimization>(`/ai/product/${id}/optimize-price`);
      setData(response);
    } catch (error) {
      console.error("Failed to load pricing optimization models:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchOptimization(); }, [fetchOptimization]);

  const handleSyncPrice = async () => {
    if (!data) return;
    setIsSyncing(true);
    try {
      await apiRequest(`/products/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ selling_price: cleanDecimal(data.suggested_price) })
      });
      alert("Success: Product price synchronized perfectly.");
      router.push("/dashboard/products");
    } catch (err: any) {
      alert(`Update cancelled: ${err.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  if (loading) return <LoadingTerminal label="Calculating margin & demand updates..." />;
  if (!data) return <ErrorState id={id} onRetry={fetchOptimization} />;

  const current = cleanDecimal(data.current_price);
  const suggested = cleanDecimal(data.suggested_price);
  const isPriceDrop = suggested < current;
  const variance = Math.abs(((suggested - current) / current) * 100);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="max-w-[1400px] mx-auto p-4 sm:p-6 md:p-10 space-y-6 sm:space-y-8 pb-32 text-slate-900 w-full"
    >
      {/* ACTION HEADER ROW */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-6 sm:pb-8">
        <div className="space-y-3 w-full sm:w-auto min-w-0">
          <Link href="/dashboard/ai/optimization" className="inline-flex items-center gap-1.5 text-slate-400 hover:text-slate-900 font-black text-[10px] sm:text-xs uppercase tracking-wider group transition-all w-fit">
            <ArrowLeft size={12} className="group-hover:-translate-x-0.5 transition-transform" /> Optimization Hub
          </Link>
          <div className="flex items-center gap-4 min-w-0">
            <div className="h-12 w-12 sm:h-16 sm:w-16 bg-slate-900 rounded-xl sm:rounded-2xl flex items-center justify-center text-lime-400 shadow-sm shrink-0 hidden sm:flex">
               <Target size={24} className="sm:h-8 sm:w-8" />
            </div>
            <div className="min-w-0">
               <h1 className="text-xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight uppercase italic leading-none truncate pr-1">
                 Price Analysis: <span className="text-slate-400 font-mono font-medium">#{data.product_name}</span>
               </h1>
               <div className="flex items-center flex-wrap gap-2 mt-2 font-medium">
                  <span className="px-2.5 py-0.5 bg-slate-50 rounded-md text-[9px] sm:text-[10px] font-bold uppercase text-slate-500 border border-slate-100">
                    Product ID: #{id}
                  </span>
                  <div className="h-1 w-1 bg-lime-500 rounded-full" />
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide truncate">Basis: {data.reason.replace(/_/g, " ")}</span>
               </div>
            </div>
          </div>
        </div>

        <button onClick={fetchOptimization} className="h-10 w-10 sm:h-12 sm:w-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-900 transition-all shadow-sm shrink-0 active:scale-95 ml-auto sm:ml-0">
           <RefreshCcw size={16} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        
        {/* MAIN PANEL CONTENT CARDS */}
        <div className="col-span-12 lg:col-span-8 space-y-6 sm:space-y-8">
          <div className="bg-white border border-slate-100 rounded-xl sm:rounded-[2.5rem] md:rounded-[3rem] p-5 sm:p-8 md:p-12 shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[360px] sm:min-h-[420px] gap-6">
            <div className="absolute top-0 right-0 p-8 opacity-[0.015] pointer-events-none rotate-12 hidden md:block">
               <IndianRupee size={300} />
            </div>
            
            <div className="flex flex-row justify-between items-start gap-4 relative z-10 w-full">
              <div className="space-y-1">
                <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-blue-600 italic">Pricing Model</p>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight italic uppercase">Recommended Adjustments</h3>
              </div>
              <ClassificationBadge label={data.classification} />
            </div>

            {/* INTERACTIVE COMPANION RATES FLUID BLOCK */}
            <div className="flex flex-col sm:flex-row items-center justify-around py-8 sm:py-12 gap-6 sm:gap-8 relative z-10 w-full">
              <PriceNode label="Previous Price" price={current} color="text-slate-300" strike />
              <div className="flex flex-col items-center gap-2 shrink-0">
                 <ArrowRightLeft className="text-lime-500 animate-pulse hidden sm:block" size={32} />
                 <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wide ${isPriceDrop ? 'bg-red-50 text-red-500' : 'bg-lime-50 text-lime-600 border border-lime-100/50'}`}>
                    {variance.toFixed(1)}% Variance
                 </div>
              </div>
              <PriceNode label="Optimized Target" price={suggested} color="text-slate-900" isMain />
            </div>
          </div>

          {/* MARKET DEMAND CARD VISUAL */}
          <div className="bg-white border border-slate-100 rounded-xl sm:rounded-[2.5rem] md:rounded-[3rem] p-5 sm:p-8 md:p-12 shadow-sm space-y-6 sm:space-y-8 relative w-full">
            <div className="flex items-center gap-3 w-full">
              <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shadow-inner shrink-0"><LineChart size={18} /></div>
              <h4 className="text-base sm:text-lg font-black uppercase italic tracking-tight text-slate-900">Demand Elasticity Projection</h4>
            </div>

            <div className="h-48 sm:h-64 w-full bg-slate-50 rounded-xl sm:rounded-[2rem] relative flex items-end p-4 sm:p-8 border border-slate-100 overflow-hidden">
               <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
               <svg className="w-full h-full overflow-visible relative z-10" preserveAspectRatio="none" viewBox="0 0 100 40">
                  <motion.path 
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.8, ease: "easeInOut" }}
                    d="M 0 38 Q 20 35, 40 20 T 100 5" 
                    fill="none" stroke="#bef264" strokeWidth="3" strokeLinecap="round"
                  />
                  <circle cx="25" cy="32" r="3.5" fill="#cbd5e1" stroke="white" strokeWidth="2" />
                  <circle cx="70" cy="12" r="5" fill="#84cc16" className="animate-ping opacity-25" />
                  <circle cx="70" cy="12" r="3.5" fill="#84cc16" stroke="white" strokeWidth="2" />
               </svg>
               <div className="absolute left-4 sm:left-8 bottom-3 sm:bottom-4 text-[9px] font-black text-slate-300 uppercase tracking-wider">Volume Decline</div>
               <div className="absolute right-4 sm:right-8 top-3 sm:top-4 text-[9px] font-black text-lime-600 uppercase tracking-wider">Optimal Sales Yield</div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL COLUMN: CONVERSION HEALTH */}
        <div className="col-span-12 lg:col-span-4 space-y-6 sm:space-y-8">
          <div className="bg-slate-900 rounded-xl sm:rounded-[2.5rem] md:rounded-[4rem] p-5 sm:p-8 md:p-12 text-white shadow-xl flex flex-col justify-center relative overflow-hidden border border-white/5 min-w-0">
             <div className="absolute top-0 right-0 w-32 h-32 bg-lime-500/5 blur-[50px] rounded-full -mr-12 -mt-12 pointer-events-none" />
             <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-slate-500 mb-6 sm:mb-10 italic block ml-0.5">Projected Margin Health</p>
             <div className="flex items-baseline flex-wrap gap-2 mb-6 sm:mb-8 min-w-0">
                <span className="text-5xl sm:text-6xl md:text-7xl font-black text-lime-400 font-mono italic leading-none tracking-tight break-all pr-1">{cleanDecimal(data.margin_percent_after_change)}%</span>
                <p className="text-[10px] font-bold text-slate-500 uppercase italic tracking-wide leading-tight mt-1">Expected Profit<br/>Sustainability</p>
             </div>
             <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/10 shrink-0">
                 <motion.div 
                   initial={{ width: 0 }} 
                   animate={{ width: `${Math.min(100, Math.max(0, cleanDecimal(data.margin_percent_after_change)))}%` }} 
                   className="h-full bg-gradient-to-r from-lime-600 to-lime-400" 
                 />
             </div>
          </div>

          <div className="bg-white border-2 sm:border-4 border-slate-900 p-5 sm:p-8 rounded-xl sm:rounded-[2.5rem] md:rounded-[3.5rem] shadow-sm relative overflow-hidden">
             <div className="relative z-10 space-y-4 sm:space-y-6">
                <div className="flex items-center gap-3">
                   <div className="h-10 w-10 bg-slate-900 rounded-xl flex items-center justify-center text-lime-400 shrink-0 shadow-md"><ShieldCheck size={20} /></div>
                   <h4 className="text-lg sm:text-xl font-black italic tracking-tight text-slate-900 uppercase">Publish Price</h4>
                </div>
                <p className="text-xs text-slate-400 font-medium leading-relaxed">
                   Synchronize this optimized rate directly to the live store product catalog.
                </p>
                <button 
                  onClick={handleSyncPrice}
                  disabled={isSyncing}
                  className="w-full h-12 bg-slate-900 text-white font-black rounded-xl hover:bg-black transition-all shadow-md active:scale-[0.99] text-xs uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-40"
                >
                  {isSyncing ? <Loader2 className="animate-spin" size={16} /> : <><Database size={14} className="text-lime-400 shrink-0" /> Update Live Price</>}
                </button>
             </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* --- ITEM CORE REUSABLE BLOCKS --- */

interface PriceNodeProps {
  label: string;
  price: number;
  color: string;
  strike?: boolean;
  isMain?: boolean;
}

function PriceNode({ label, price, color, strike, isMain }: PriceNodeProps) {
  return (
    <div className="text-center min-w-0 max-w-full">
      <p className={`text-[9px] sm:text-[10px] font-black uppercase tracking-wider mb-2.5 sm:mb-4 ${isMain ? 'text-lime-600' : 'text-slate-400'}`}>{label}</p>
      <p className={`font-black tabular-nums tracking-tight italic break-words pr-1 ${color} ${strike ? 'line-through text-3xl sm:text-4xl opacity-35' : 'text-4xl sm:text-6xl md:text-7xl'}`}>
        <span className="text-xl sm:text-2xl md:text-3xl mr-0.5 sm:mr-1 font-bold">₹</span>{price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
      </p>
    </div>
  );
}

function ClassificationBadge({ label }: { label: string }) {
  return (
    <div className="px-3 sm:px-4 h-8 bg-slate-900 border border-slate-800 rounded-xl flex items-center gap-2 shrink-0">
      <div className="w-1.5 h-1.5 bg-lime-400 rounded-full animate-pulse" />
      <span className="text-[9px] sm:text-[10px] font-black text-white uppercase tracking-wider italic whitespace-nowrap">{label.replace(/_/g, " ")}</span>
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

function ErrorState({ id, onRetry }: { id: string, onRetry: () => void }) {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-center">
       <AlertCircle size={48} className="text-red-500 mb-4 shrink-0" />
       <h1 className="text-lg sm:text-xl font-black uppercase italic tracking-tight text-slate-900">Analysis Calculation Interrupted</h1>
       <p className="text-slate-400 text-xs max-w-xs mx-auto mt-2 leading-normal">Could not generate a live optimization calculation profile for catalog item #{id}.</p>
       <div className="flex flex-wrap items-center justify-center gap-3 mt-8 w-full">
          <button onClick={onRetry} className="h-10 px-6 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-wider active:scale-[0.98] transition-all shadow-sm">Retry Sync</button>
          <Link href="/dashboard/ai/optimization" className="h-10 px-6 bg-white border border-slate-200 text-slate-500 hover:text-slate-900 rounded-xl font-black text-[10px] uppercase tracking-wider active:scale-[0.98] transition-all shadow-sm flex items-center justify-center">Go Back</Link>
       </div>
    </div>
  );
}