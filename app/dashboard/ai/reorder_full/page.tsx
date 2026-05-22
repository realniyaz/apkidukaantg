"use client";

import { useState, useEffect } from "react";
import { apiRequest } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BrainCircuit, Zap, Loader2, TrendingDown, 
  AlertTriangle, PackageSearch, ArrowRight,
  ShieldAlert, ShoppingCart, Timer, Activity
} from "lucide-react";

export default function ReorderIntelligencePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchIntelligence = async () => {
    setLoading(true);
    try {
      // Hitting the 6th layer endpoint
      const response = await apiRequest<any[]>("ai/reorder/intelligence", { method: "GET" });
      setProducts(response || []);
    } catch (error: any) {
      console.error("Neural Sync Failure:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIntelligence();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="relative">
        <Loader2 className="animate-spin text-lime-500" size={60} strokeWidth={1} />
        <BrainCircuit className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-900" size={24} />
      </div>
      <p className="mt-6 font-black text-slate-400 uppercase tracking-[0.4em] text-[10px]">Assembling Neural Analysis...</p>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
      className="max-w-7xl mx-auto p-6 space-y-10 pb-24 text-slate-900"
    >
      {/* HEADER */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-100 pb-10">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-lime-600 font-black text-[10px] uppercase tracking-[0.2em]">
            <Zap size={14} fill="currentColor" /> Layer 06 Intelligence
          </div>
          <h1 className="text-6xl font-black tracking-tight italic uppercase leading-none">Reorder Intel</h1>
          <p className="text-slate-500 font-medium italic">Autonomous shop reorder parameters via velocity-decay analysis.</p>
        </div>

        <button 
          onClick={fetchIntelligence}
          className="flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-2xl active:scale-95"
        >
          <BrainCircuit size={18} /> Refresh Neural State
        </button>
      </header>

      {/* RISK SUMMARY CARDS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden border border-white/5">
          <div className="absolute top-0 right-0 w-48 h-48 bg-lime-500/10 blur-[60px] rounded-full -mr-16 -mt-16" />
          <ShieldAlert className="text-lime-400 mb-8" size={32} />
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2">Neural Risk Matrix</p>
          <h2 className="text-7xl font-black tabular-nums tracking-tighter italic">
            {products.filter(p => p.urgency_level === 'CRITICAL').length}
          </h2>
          <p className="mt-4 text-lime-400 font-bold uppercase text-[10px] italic tracking-widest">Critical Reorder Events Detected</p>
        </div>

        <div className="lg:col-span-2 bg-white rounded-[3rem] p-10 border border-slate-100 shadow-xl shadow-slate-200/40 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-6">
            <PackageSearch className="text-lime-500" size={24} />
            <h3 className="text-sm font-black uppercase tracking-widest">AI Command Context</h3>
          </div>
          <p className="text-3xl font-black text-slate-900 leading-tight tracking-tight uppercase italic">
            {products.length > 0 
              ? `Initiate reorder sequence for ${products.length} vulnerable SKU(s) to prevent stockout decay.`
              : "Neural state optimized. No immediate stock vulnerabilities identified."}
          </p>
        </div>
      </div>

      {/* NEURAL ANALYSIS TABLE */}
      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="p-8 text-[10px] font-black uppercase tracking-widest text-slate-400">Product Specification</th>
              <th className="p-8 text-[10px] font-black uppercase tracking-widest text-slate-400">Current / Reorder Pt</th>
              <th className="p-8 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Lead Time</th>
              <th className="p-8 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Suggested Qty</th>
              <th className="p-8 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Urgency</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {products.map((item, idx) => (
              <motion.tr 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.05 }}
                key={idx} className="group hover:bg-slate-50/50 transition-colors"
              >
                <td className="p-8">
                  <p className="font-black text-slate-900 uppercase italic tracking-tight">{item.product_name}</p>
                  <div className="flex items-center gap-2 mt-1 text-[10px] font-bold text-slate-400">
                    <Activity size={12} /> Velocity: {item.average_daily_sales} Units/Day
                  </div>
                </td>
                <td className="p-8">
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-black tabular-nums ${item.current_stock === 0 ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-600'}`}>
                      {item.current_stock}
                    </span>
                    <ArrowRight size={14} className="text-slate-300" />
                    <span className="text-xs font-bold text-slate-400 tabular-nums">{item.reorder_point}</span>
                  </div>
                </td>
                <td className="p-8 text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-xl text-blue-600 text-[10px] font-black uppercase tracking-tighter">
                    <Timer size={14} /> {item.supplier_lead_days} Days
                  </div>
                </td>
                <td className="p-8 text-right">
                  <p className="text-lg font-black text-slate-900 tabular-nums tracking-tighter">{item.suggested_reorder_quantity}</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase">Est. Budget: ₹{item.estimated_purchase_budget.toLocaleString()}</p>
                </td>
                <td className="p-8 text-right">
                   <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest italic ${
                     item.urgency_level === 'CRITICAL' 
                     ? 'bg-red-500 text-white shadow-lg shadow-red-200 animate-pulse' 
                     : 'bg-orange-100 text-orange-600'
                   }`}>
                    {item.urgency_level}
                   </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <footer className="pt-10 flex justify-center">
         <button className="flex items-center gap-3 bg-slate-900 text-white px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-2xl group">
            <ShoppingCart size={20} className="text-lime-400" />
            Proceed to Bulk Purchase Generation
            <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
         </button>
      </footer>
    </motion.div>
  );
}