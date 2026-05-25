"use client";

import { useEffect, useState } from "react";
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
      const response = await apiRequest<any[]>("ai/reorder/intelligence", { method: "GET" });
      setProducts(response || []);
    } catch (error: any) {
      console.error("Failed to load global reorder predictions:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIntelligence();
  }, []);

  if (loading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="relative shrink-0">
        <Loader2 className="animate-spin text-slate-900" size={44} />
        <BrainCircuit className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-lime-500" size={18} />
      </div>
      <p className="mt-5 font-black text-slate-900 uppercase tracking-wider text-[10px] italic animate-pulse">Calculating reorder points & velocity trends...</p>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8 pb-24 text-slate-900 w-full"
    >
      {/* HEADER ROW */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-6 sm:pb-8">
        <div className="space-y-2 w-full sm:w-auto min-w-0">
          <div className="flex items-center gap-1.5 text-lime-600 font-black text-[9px] sm:text-[10px] uppercase tracking-wider bg-lime-50 w-fit px-3 py-1.5 rounded-full border border-lime-100/60">
            <Zap size={12} fill="currentColor" className="shrink-0" /> AI-Powered Procurement
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight uppercase italic leading-none truncate pr-1">Automated Restocking</h1>
          <p className="text-slate-400 font-medium text-xs sm:text-sm">Predictive purchase indicators mapped against actual sales velocity and safety thresholds.</p>
        </div>

        <button 
          onClick={fetchIntelligence}
          className="w-full sm:w-auto h-12 px-6 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-wider hover:bg-black transition-all shadow-sm flex items-center justify-center gap-2 shrink-0 active:scale-[0.99]"
        >
          <BrainCircuit size={16} className="shrink-0" /> Recalculate Restock Priorities
        </button>
      </header>

      {/* RISK SUMMARY PANEL CARDS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 items-stretch w-full">
        <div className="bg-slate-900 rounded-xl sm:rounded-[2rem] md:rounded-[3rem] p-5 sm:p-8 md:p-10 text-white relative overflow-hidden shadow-md shrink-0 min-w-0 flex flex-col justify-center">
          <div className="absolute top-0 right-0 w-32 h-32 bg-lime-500/5 blur-[50px] rounded-full pointer-events-none" />
          <ShieldAlert className="text-red-400 mb-4 sm:mb-8 shrink-0" size={28} />
          <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">Risk Summary</p>
          <h2 className="text-4xl sm:text-6xl md:text-7xl font-black tabular-nums tracking-tight italic leading-none truncate break-all pr-1">
            {products.filter(p => p.urgency_level === 'CRITICAL').length}
          </h2>
          <p className="mt-3.5 text-red-400 font-bold uppercase text-[9px] sm:text-[10px] italic tracking-wide">Critical Stockout Alerts Active</p>
        </div>

        <div className="lg:col-span-2 bg-white rounded-xl sm:rounded-[2rem] md:rounded-[3rem] p-5 sm:p-8 md:p-10 border border-slate-100 shadow-sm flex flex-col justify-center min-w-0 w-full">
          <div className="flex items-center gap-2 mb-4 shrink-0">
            <PackageSearch className="text-lime-600 shrink-0" size={20} />
            <h3 className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-slate-400 block ml-0.5">AI Procurement Summary</h3>
          </div>
          <p className="text-xl sm:text-2xl md:text-3xl font-black text-slate-800 leading-tight tracking-tight uppercase italic max-w-xl">
            {products.length > 0 
              ? `Review suggested purchase quantities across ${products.length} low-stock lines to secure your store shelves.`
              : "All catalog items are securely stocked. No immediate inventory thresholds breached."}
          </p>
        </div>
      </div>

      {/* GLOBAL REORDER ANALYSIS TABLE */}
      <div className="bg-white rounded-xl sm:rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden w-full">
        <div className="w-full overflow-x-auto">
          <table className="w-full border-separate border-spacing-0 min-w-[950px]">
            <thead>
              <tr className="bg-slate-50/50 text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-100 italic">
                <th className="px-5 sm:px-8 py-4 text-left">Product Details</th>
                <th className="px-5 sm:px-8 py-4 text-left w-52">Current Stock vs safety trigger</th>
                <th className="px-5 sm:px-8 py-4 text-center w-40">Supplier Lead Time</th>
                <th className="px-5 sm:px-8 py-4 text-right w-64">Suggested Reorder Size</th>
                <th className="px-5 sm:px-8 py-4 text-right w-36">Urgency Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 font-semibold text-slate-700">
              {products.map((item, idx) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 6 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: idx * 0.015, duration: 0.18 }}
                  key={idx} 
                  className="group hover:bg-slate-50/40 transition-colors duration-150 cursor-default"
                >
                  {/* Product Specification */}
                  <td className="px-5 sm:px-8 py-4">
                    <div className="min-w-0 pr-2 flex flex-col">
                      <p className="font-black text-slate-900 text-sm tracking-tight uppercase italic truncate">{item.product_name}</p>
                      <div className="flex items-center gap-1.5 mt-1.5 text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                        <Activity size={12} className="shrink-0" /> Sales Velocity: {item.average_daily_sales.toFixed(1)} units / day
                      </div>
                    </div>
                  </td>

                  {/* Stock Progress vs Reorder Point */}
                  <td className="px-5 sm:px-8 py-4">
                    <div className="flex items-center gap-2.5 shrink-0">
                      <span className={`px-2.5 py-0.5 rounded-md text-xs font-black tabular-nums border ${
                        item.current_stock === 0 
                          ? 'bg-red-50 text-red-500 border-red-100/50 animate-pulse' 
                          : 'bg-slate-50 text-slate-700 border-slate-100'
                      }`}>
                        {item.current_stock.toLocaleString('en-IN')} Units
                      </span>
                      <ArrowRight size={12} className="text-slate-300 shrink-0" />
                      <span className="text-xs font-bold text-slate-400 tabular-nums font-mono" title="Reorder Threshold Point">Trigger: {item.reorder_point.toLocaleString('en-IN')}</span>
                    </div>
                  </td>

                  {/* Supplier Lead Time */}
                  <td className="px-5 sm:px-8 py-4 text-center">
                    <div className="inline-flex items-center gap-1 bg-blue-50 border border-blue-100/40 px-2.5 py-0.5 rounded-md text-blue-600 text-[9px] sm:text-[10px] font-black uppercase tracking-wide font-mono shrink-0">
                      <Timer size={12} className="shrink-0" /> {item.supplier_lead_days} Days
                    </div>
                  </td>

                  {/* Suggested Quantity & Estimated Cost */}
                  <td className="px-5 sm:px-8 py-4 text-right">
                    <div className="flex flex-col items-end shrink-0">
                      <p className="text-base sm:text-lg font-black text-slate-900 tabular-nums tracking-tight italic">+{item.suggested_reorder_quantity.toLocaleString('en-IN')} Units</p>
                      <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wide mt-1">Est. Budget: ₹{item.estimated_purchase_budget.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
                    </div>
                  </td>

                  {/* Urgency Badge */}
                  <td className="px-5 sm:px-8 py-4 text-right">
                     <span className={`inline-flex items-center justify-center px-3 py-1 rounded-md text-[9px] sm:text-[10px] font-black uppercase tracking-wider italic border shrink-0 transition-all ${
                       item.urgency_level === 'CRITICAL' 
                         ? 'bg-red-50 text-red-500 border-red-100 shadow-sm animate-pulse' 
                         : 'bg-orange-50 text-orange-600 border-orange-100/70'
                     }`}>
                      {item.urgency_level}
                     </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FINAL BULK PROCUREMENT TRIGGER ACTION BAR */}
      <footer className="pt-4 flex justify-center w-full shrink-0">
         <button className="w-full sm:w-auto h-12 px-8 sm:px-10 bg-slate-900 text-white font-black rounded-xl text-xs uppercase tracking-wider hover:bg-black transition-all shadow-md flex items-center justify-center gap-2 group active:scale-[0.99]">
            <ShoppingCart size={16} className="text-lime-400 shrink-0" />
            <span>Generate Group Purchase Order</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform shrink-0" />
         </button>
      </footer>
    </motion.div>
  );
}

/* --- ADAPTIVE LOADING SKELETON PLACEHOLDER --- */
function LedgerSkeleton() {
  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-10 space-y-6 sm:space-y-8 animate-pulse w-full">
      <div className="h-16 sm:h-20 w-1/2 bg-slate-50 rounded-xl sm:rounded-2xl" />
      <div className="h-[600px] bg-slate-50 rounded-xl sm:rounded-[2rem]" />
    </div>
  );
}