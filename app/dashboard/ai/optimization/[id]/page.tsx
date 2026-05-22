"use client";

import { useEffect, useState, use, useCallback } from "react";
import { apiRequest, cleanDecimal } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, IndianRupee, Zap, ShieldCheck, 
  ArrowRightLeft, TrendingUp, TrendingDown, 
  LineChart, BarChart4, Loader2, Sparkles,
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
      console.error("Neural Modeling Failure:", error);
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
      alert("Neural Overwrite Successful: Product rate synchronized.");
      router.push("/dashboard/inventory");
    } catch (err: any) {
      alert(`Sync Aborted: ${err.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  if (loading) return <LoadingTerminal />;
  if (!data) return <ErrorState id={id} onRetry={fetchOptimization} />;

  const current = cleanDecimal(data.current_price);
  const suggested = cleanDecimal(data.suggested_price);
  const isPriceDrop = suggested < current;
  const variance = Math.abs(((suggested - current) / current) * 100);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-[1400px] mx-auto p-6 md:p-10 space-y-10 pb-32">
      
      {/* EXECUTIVE ACTION HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 border-b border-slate-100 pb-10">
        <div className="space-y-4">
          <Link href="/dashboard/ai/optimization" className="inline-flex items-center gap-3 text-slate-400 hover:text-slate-900 font-black text-[10px] uppercase tracking-[0.3em] group transition-all">
            <ArrowLeft size={14} className="group-hover:-translate-x-2 transition-transform" /> Neural Hub
          </Link>
          <div className="flex items-center gap-6">
            <div className="h-20 w-20 bg-slate-900 rounded-[2rem] flex items-center justify-center text-lime-400 shadow-2xl rotate-3">
               <Target size={36} />
            </div>
            <div>
               <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
                 Optimization: <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-600 to-lime-400">{data.product_name}</span>
               </h1>
               <div className="flex items-center gap-3 mt-3">
                  <span className="px-4 py-1 bg-slate-100 rounded-full text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 border border-slate-200 italic">
                    Node ID: {id}
                  </span>
                  <div className="h-1.5 w-1.5 rounded-full bg-lime-500 animate-pulse" />
                  <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Logic: {data.reason.replace(/_/g, " ")}</span>
               </div>
            </div>
          </div>
        </div>

        <button onClick={fetchOptimization} className="h-14 w-14 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-900 transition-all active:scale-90 shadow-sm">
           <RefreshCcw size={20} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-10">
          <div className="bg-white border border-slate-100 rounded-[4rem] p-12 shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[420px]">
            <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none rotate-12">
               <IndianRupee size={350} />
            </div>
            
            <div className="flex justify-between items-start relative z-10">
              <div className="space-y-2">
                <p className="text-[11px] font-black uppercase tracking-[0.4em] text-blue-600 italic">Displacement Model</p>
                <h3 className="text-3xl font-black text-slate-900 tracking-tighter italic uppercase">Suggested Rate Correction</h3>
              </div>
              <ClassificationBadge label={data.classification} />
            </div>

            <div className="flex flex-col md:flex-row items-center justify-around py-16 gap-12 relative z-10">
              <PriceNode label="Legacy Value" price={current} color="text-slate-200" strike />
              <div className="flex flex-col items-center gap-4">
                 <ArrowRightLeft className="text-lime-500 animate-pulse" size={48} />
                 <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${isPriceDrop ? 'bg-red-50 text-red-500' : 'bg-lime-50 text-lime-500'}`}>
                    {variance.toFixed(1)}% Variance
                 </div>
              </div>
              <PriceNode label="Optimized Target" price={suggested} color="text-slate-900" isMain />
            </div>
          </div>

          {/* ELASTICITY VISUALIZATION */}
          <div className="bg-white border border-slate-100 rounded-[4rem] p-12 shadow-xl space-y-10 relative">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-4">
                 <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-inner"><LineChart size={24} /></div>
                 <h4 className="text-lg font-black uppercase italic tracking-tighter text-slate-900">Demand Elasticity Projection</h4>
               </div>
            </div>

            {/* ✅ FIXED: Corrected style property 'backgroundSize' */}
            <div className="h-64 w-full bg-slate-50 rounded-[3rem] relative flex items-end p-10 border border-slate-100 overflow-hidden">
               <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
               <svg className="w-full h-full overflow-visible relative z-10" preserveAspectRatio="none" viewBox="0 0 100 40">
                  <motion.path 
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2.5, ease: "easeInOut" }}
                    d="M 0 38 Q 20 35, 40 20 T 100 5" 
                    fill="none" stroke="#bef264" strokeWidth="4" strokeLinecap="round"
                  />
                  <circle cx="25" cy="32" r="4" fill="#cbd5e1" stroke="white" strokeWidth="2" />
                  <circle cx="70" cy="12" r="6" fill="#84cc16" className="animate-ping opacity-30" />
                  <circle cx="70" cy="12" r="4" fill="#84cc16" stroke="white" strokeWidth="2" />
               </svg>
               <div className="absolute left-10 bottom-6 text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">Volume Decay</div>
               <div className="absolute right-10 top-6 text-[9px] font-black text-lime-500 uppercase tracking-[0.3em]">Optimal Yield Peak</div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-10">
          <div className="bg-slate-900 rounded-[4rem] p-12 text-white shadow-2xl flex flex-col justify-center relative overflow-hidden border border-white/5">
             <div className="absolute top-0 right-0 w-48 h-48 bg-lime-500/10 blur-[100px] rounded-full -mr-24 -mt-24" />
             <p className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-500 mb-10 italic">Projected Margin Health</p>
             <div className="flex items-end gap-5 mb-12">
                <span className="text-8xl font-black text-lime-400 tabular-nums tracking-tighter leading-none">{cleanDecimal(data.margin_percent_after_change)}%</span>
                <p className="text-xs font-bold text-slate-500 mb-2 leading-tight uppercase italic">Post-Correction<br/>Sustainability</p>
             </div>
             <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/10">
                 <motion.div 
                   initial={{ width: 0 }} 
                   animate={{ width: `${cleanDecimal(data.margin_percent_after_change)}%` }} 
                   className="h-full bg-gradient-to-r from-lime-600 to-lime-300" 
                 />
             </div>
          </div>

          <div className="bg-white border-4 border-slate-900 p-8 rounded-[3.5rem] shadow-2xl relative overflow-hidden">
             <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-4">
                   <div className="h-12 w-12 bg-slate-900 rounded-2xl flex items-center justify-center text-lime-400 shadow-xl"><ShieldCheck size={28} /></div>
                   <h4 className="text-xl font-black italic tracking-tighter text-slate-900">Master Sync</h4>
                </div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wide leading-relaxed">
                   Synchronize this optimized rate directly to the production registry.
                </p>
                <button 
                  onClick={handleSyncPrice}
                  disabled={isSyncing}
                  className="w-full py-6 bg-slate-900 text-white font-black rounded-3xl hover:bg-black transition-all shadow-2xl active:scale-95 text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-4"
                >
                  {isSyncing ? <Loader2 className="animate-spin" size={20} /> : <><Database size={18} className="text-lime-400" /> Commit New Rate</>}
                </button>
             </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* --- UI HELPERS --- */

function PriceNode({ label, price, color, strike, isMain }: any) {
  return (
    <div className="text-center">
      <p className={`text-[10px] font-black uppercase tracking-[0.4em] mb-4 ${isMain ? 'text-lime-600' : 'text-slate-400'}`}>{label}</p>
      <p className={`font-black tabular-nums tracking-tighter ${color} ${strike ? 'line-through text-5xl opacity-40' : 'text-8xl'}`}>
        <span className="text-3xl mr-1 italic">₹</span>{price.toLocaleString('en-IN')}
      </p>
    </div>
  );
}

function ClassificationBadge({ label }: { label: string }) {
  return (
    <div className="px-6 py-2.5 bg-slate-900 border border-slate-800 rounded-2xl flex items-center gap-3">
      <div className="w-2 h-2 bg-lime-400 rounded-full animate-ping" />
      <span className="text-[10px] font-black text-white uppercase tracking-[0.3em] italic">{label.replace(/_/g, " ")}</span>
    </div>
  );
}

function LoadingTerminal() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDFDFD]">
      <Loader2 className="animate-spin text-slate-900" size={64} />
      <p className="mt-10 font-black text-slate-900 uppercase tracking-[0.6em] text-[11px] italic animate-pulse">Computing Price Elasticity Vectors...</p>
    </div>
  );
}

function ErrorState({ id, onRetry }: { id: string, onRetry: () => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-12">
       <AlertCircle size={80} className="text-red-500 mb-8" />
       <h1 className="text-4xl font-black uppercase italic tracking-tighter text-slate-900">Modeling Sync Failed</h1>
       <div className="flex gap-4 mt-10">
          <button onClick={onRetry} className="px-12 py-5 bg-lime-500 text-slate-900 rounded-[2rem] font-black text-[10px] uppercase tracking-widest shadow-xl">Retry</button>
          <Link href="/dashboard/ai/optimization" className="px-12 py-5 bg-slate-900 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-widest shadow-xl">Abort</Link>
       </div>
    </div>
  );
}