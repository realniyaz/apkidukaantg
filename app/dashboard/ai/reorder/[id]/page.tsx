"use client";

import { useEffect, useState, use } from "react";
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
  TrendingUp,
  ShoppingCart
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

  if (loading) return <div className="p-20 text-center animate-pulse font-black text-slate-400">Neural Logistics Engine Computing...</div>;
  if (!data) return <div className="p-20 text-center">Analysis Record Unavailable.</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-6xl mx-auto p-6 md:p-10 space-y-10 pb-24">
      {/* HEADER */}
      <div className="space-y-6">
        <Link href="/dashboard/ai/reorder" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-900 font-bold text-xs uppercase tracking-widest transition-all group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Hub
        </Link>
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-slate-900 rounded-[1.5rem] shadow-xl text-blue-400"><Box size={32} /></div>
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight capitalize">{data.product_name}</h1>
              <p className="text-slate-500 font-medium flex items-center gap-2 italic">Neural Procurement Profile</p>
            </div>
          </div>
          <UrgencyBadge level={data.urgency_level} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* STOCKOUT PREDICTION CARD */}
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[380px]">
           <div className="space-y-2">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Inventory Runway</p>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Predicted Exhaustion</h3>
           </div>

           <div className="flex items-center gap-10 py-8">
              <div className="text-center">
                 <p className="text-6xl font-black text-slate-900 tabular-nums">{data.current_stock}</p>
                 <p className="text-[10px] font-bold text-slate-400 uppercase mt-2">Current Units</p>
              </div>
              <div className="h-16 w-[2px] bg-slate-100 rounded-full" />
              <div className="flex-1">
                 <div className="flex items-center gap-3 mb-2">
                    <Calendar className="text-blue-500" size={24} />
                    <p className="text-xl font-black text-slate-800">
                       {data.predicted_stockout_date ? new Date(data.predicted_stockout_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : "Infinity"}
                    </p>
                 </div>
                 <p className="text-sm text-slate-500 font-medium tracking-tight leading-relaxed">
                    Based on an average daily sale of <span className="text-slate-900 font-bold">{data.average_daily_sales.toFixed(2)} units</span>.
                 </p>
              </div>
           </div>

           <div className="bg-slate-50 rounded-2xl p-6 flex items-center justify-between border border-slate-100">
              <div className="flex items-center gap-3">
                 <Clock className="text-slate-400" size={20} />
                 <p className="text-xs font-bold text-slate-600 uppercase tracking-widest">Lead Time: {data.supplier_lead_days} Days</p>
              </div>
              <p className="text-[10px] font-black text-blue-500 uppercase">Buffer stock included</p>
           </div>
        </div>

        {/* PROCUREMENT BUDGET CARD */}
        <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-xl relative overflow-hidden flex flex-col justify-between">
           <div className="absolute top-0 right-0 p-8 opacity-10"><IndianRupee size={100} /></div>
           <div className="space-y-6">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Projected Budget</p>
              <div className="space-y-1">
                 <p className="text-xs font-bold text-blue-400 uppercase tracking-tighter">Est. Purchase Cost</p>
                 <p className="text-6xl font-black tabular-nums tracking-tighter text-white">₹{data.estimated_purchase_budget.toLocaleString()}</p>
              </div>
           </div>

           <div className="mt-10 space-y-4">
              <div className="flex justify-between items-center text-sm border-b border-white/5 pb-4">
                 <span className="text-slate-400 font-medium uppercase text-[10px] tracking-widest">Target Reorder Point</span>
                 <span className="font-black text-blue-400 tabular-nums">{data.reorder_point} Units</span>
              </div>
              <div className="flex justify-between items-center text-sm pt-2">
                 <span className="text-slate-400 font-medium uppercase text-[10px] tracking-widest">Suggested Volume</span>
                 <span className="font-black text-lime-400 tabular-nums">+{data.suggested_reorder_quantity} Units</span>
              </div>
           </div>
        </div>
      </div>

      {/* FINAL ACTION BAR */}
      <div className="bg-white border border-slate-100 p-8 rounded-[3rem] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 border-b-8 border-b-blue-500">
         <div className="flex items-center gap-6">
            <div className="h-16 w-16 bg-blue-50 rounded-[1.5rem] flex items-center justify-center text-blue-600 shadow-inner"><PackageCheck size={36} /></div>
            <div>
              <p className="font-black text-2xl text-slate-900 leading-none tracking-tight">Neural Purchase Sync</p>
              <p className="text-sm text-slate-400 font-bold uppercase mt-1 tracking-wide">Generate a draft purchase order based on AI suggestions.</p>
            </div>
         </div>
         <Link href="/dashboard/purchases/create" className="w-full md:w-auto px-12 py-5 bg-slate-900 text-white font-black rounded-3xl hover:bg-black transition-all shadow-xl active:scale-95 text-sm uppercase tracking-widest flex items-center gap-3">
            <ShoppingCart size={20} /> Create Draft PO
         </Link>
      </div>
    </motion.div>
  );
}

/* --- REUSABLE UTILITIES --- */

function UrgencyBadge({ level }: { level: string }) {
  const styles: any = {
    LOW: "bg-lime-50 text-lime-600 border-lime-100",
    MEDIUM: "bg-amber-50 text-amber-600 border-amber-100",
    HIGH: "bg-orange-50 text-orange-600 border-orange-100",
    CRITICAL: "bg-red-50 text-red-600 border-red-100 animate-pulse"
  };

  return (
    <div className={`px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-[0.2em] border shadow-sm flex items-center gap-3 ${styles[level]}`}>
      <AlertCircle size={16} />
      {level} URGENCY
    </div>
  );
}