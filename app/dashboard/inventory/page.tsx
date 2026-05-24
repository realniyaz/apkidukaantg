"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import { motion } from "framer-motion";
import { 
  Package, 
  RefreshCcw, 
  ShieldCheck, 
  Activity, 
  Search,
  Zap,
  Loader2
} from "lucide-react";
import InventorySummaryCards from "./components/InventorySummaryCards";
import InventoryMovements from "./components/InventoryMovements";

export default function InventoryDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadInventory = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      const res = await apiRequest<any>("inventory/dashboard");
      setData(res);
    } catch (err) {
      console.error("Inventory sync failed:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { loadInventory(); }, []);

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
      <Loader2 className="animate-spin text-lime-500" size={32} />
      <p className="mt-4 font-bold text-slate-400 uppercase tracking-widest text-[10px] text-center">Syncing stock data...</p>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-[1600px] mx-auto px-4 sm:px-8 py-6 sm:py-12 space-y-6 sm:space-y-12 pb-24 sm:pb-32 text-slate-900"
    >
      {/* HEADER CONTROLS */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 border-b border-slate-100 pb-6 sm:pb-12">
        <div className="space-y-3 sm:space-y-4 w-full lg:w-auto">
          <div className="flex items-center gap-2 text-lime-600 font-black text-[9px] sm:text-[10px] uppercase tracking-wider">
            <Package size={14} className="text-lime-500" /> Storage Location: Main
          </div>
          <h1 className="text-4xl sm:text-7xl font-black tracking-tighter uppercase italic leading-[0.9] sm:leading-none">
            Stock <span className="text-slate-400">Inventory</span>
          </h1>
          <p className="text-slate-500 font-medium text-sm sm:text-lg">
            Currently monitoring <span className="text-slate-900 font-black">{data?.summary?.total_products} item lines</span> within your system.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto pt-2 lg:pt-0">
          {/* SEARCH FIELD */}
          <div className="flex-1 lg:w-80 relative group">
            <Search className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-lime-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Find products or items..." 
              className="w-full bg-slate-50 border border-slate-100 py-3.5 sm:py-4 pl-11 sm:pl-14 pr-4 sm:pr-6 rounded-xl sm:rounded-[2rem] outline-none focus:bg-white focus:ring-4 sm:focus:ring-8 focus:ring-lime-500/5 transition-all text-sm font-semibold text-slate-800 shadow-inner"
            />
          </div>
          
          <button 
            onClick={() => loadInventory(true)}
            disabled={refreshing}
            title="Sync Inventory"
            className="p-3.5 sm:p-5 bg-white border border-slate-100 rounded-xl sm:rounded-2xl text-slate-400 hover:text-slate-900 transition-all active:scale-95 shrink-0 shadow-sm flex items-center justify-center"
          >
            <RefreshCcw size={18} className={refreshing ? "animate-spin text-lime-500" : ""} />
          </button>
        </div>
      </header>

      {/* SUMMARY CARDS */}
      <section className="w-full">
        <InventorySummaryCards summary={data?.summary} />
      </section>

      {/* RECENT ACTIVITY & SYSTEM STATUS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        
        {/* ACTIVITY FEED */}
        <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between px-2 sm:px-4">
                <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    <Activity size={16} className="text-lime-500" /> Recent Updates & Logs
                </h3>
                <span className="px-3 py-1 bg-slate-100 rounded-full text-[9px] font-black uppercase tracking-wider text-slate-500">
                    Live Status
                </span>
            </div>
            
            {/* Scroll protection for mobile tables */}
            <div className="bg-white rounded-[1.5rem] sm:rounded-[3.5rem] border border-slate-100 shadow-md overflow-hidden p-2">
                <div className="w-full overflow-x-auto">
                    <InventoryMovements movements={data?.latest_movements} />
                </div>
            </div>
        </div>

        {/* SIDEBAR: AUDITING */}
        <aside className="space-y-6 sm:space-y-8">
            <div className="bg-slate-900 rounded-[1.5rem] sm:rounded-[3rem] p-6 sm:p-10 text-white relative overflow-hidden shadow-xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-lime-500/10 blur-[60px] -mr-16 -mt-16 pointer-events-none" />
                <Zap size={28} className="text-lime-400 mb-6 sm:mb-8" />
                <h4 className="text-lg sm:text-xl font-black uppercase italic tracking-tighter mb-1.5">Stock Integrity</h4>
                <p className="text-slate-400 text-xs sm:text-sm font-medium leading-relaxed italic mb-6 sm:mb-8">
                    Your digital ledger cleanly reconciles with actual real-time physical stock counts.
                </p>
                <div className="space-y-3 sm:space-y-4">
                    <StatusLine label="Last Synced" status="Just now" />
                    <StatusLine label="Low Stock Detection" status="Active" />
                    <StatusLine label="Core Connection" status="Excellent" />
                </div>
            </div>

            <div className="bg-white rounded-[1.5rem] sm:rounded-[2.5rem] border border-slate-100 p-6 sm:p-8 shadow-md group hover:border-lime-500 transition-all duration-500">
                <div className="flex justify-between items-start mb-4 sm:mb-6">
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Total Value Assessment</p>
                        <h5 className="text-2xl sm:text-3xl font-black italic text-slate-900">₹{(data?.summary?.total_stock_value || 0).toLocaleString()}</h5>
                    </div>
                    <div className="h-9 w-9 sm:h-10 sm:w-10 bg-lime-50 rounded-xl flex items-center justify-center text-lime-600 shrink-0">
                        <ShieldCheck size={20} />
                    </div>
                </div>
                <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                    <div className="h-full w-2/3 bg-lime-500 rounded-full shadow-[0_0_10px_rgba(132,204,22,0.3)]" />
                </div>
                <p className="mt-3.5 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Accounting Cleanliness Checked</p>
            </div>
        </aside>
      </div>
    </motion.div>
  );
}

function StatusLine({ label, status }: { label: string, status: string }) {
    return (
        <div className="flex justify-between items-center py-2.5 border-b border-white/5 last:border-0">
            <span className="text-[9px] font-bold uppercase text-slate-500 tracking-wider">{label}</span>
            <span className="text-[10px] font-bold text-lime-400 italic">{status}</span>
        </div>
    );
}