"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import { motion } from "framer-motion";
import { 
  Package, 
  RefreshCcw, 
  Boxes, 
  Zap, 
  ShieldCheck, 
  Activity, 
  Search,
  Plus,
  Loader2
} from "lucide-react";
import Link from "next/link";
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <Loader2 className="animate-spin text-lime-500" size={40} />
      <p className="mt-4 font-black text-slate-400 uppercase tracking-[0.3em] text-[10px]">Updating Stock Records...</p>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-[1600px] mx-auto p-8 space-y-12 pb-32 text-slate-900 font-bold"
    >
      {/* HEADER: ACTION STRIP */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 border-b border-slate-100 pb-12">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-lime-600 font-black text-[10px] uppercase tracking-[0.4em]">
            <Package size={14} fill="currentColor" /> Main Warehouse
          </div>
          <h1 className="text-7xl font-black tracking-tighter uppercase italic leading-none">
            Stock <span className="text-slate-400 opacity-50">Inventory</span>
          </h1>
          <p className="text-slate-500 font-medium italic text-lg">
            Currently tracking <span className="text-slate-900 font-black">{data?.summary?.total_products} unique products</span> in your catalog.
          </p>
        </div>

        <div className="flex items-center gap-4 w-full lg:w-auto">
          {/* SEARCH FIELD */}
          <div className="flex-1 lg:w-80 relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-lime-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search by product name or SKU..." 
              className="w-full bg-slate-50 border border-slate-100 py-5 pl-14 pr-6 rounded-[2rem] outline-none focus:bg-white focus:ring-8 focus:ring-lime-500/5 transition-all text-sm font-bold"
            />
          </div>
          
          <button 
            onClick={() => loadInventory(true)}
            title="Refresh Stock"
            className="p-5 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-slate-900 transition-all active:scale-90"
          >
            <RefreshCcw size={20} className={refreshing ? "animate-spin text-lime-500" : ""} />
          </button>

          <Link href="/dashboard/inventory/create" className="bg-slate-900 text-white px-8 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-2xl flex items-center gap-3">
             <Plus size={18} /> Add New Product
          </Link>
        </div>
      </header>

      {/* SUMMARY CARDS */}
      <section className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="xl:col-span-12">
            <InventorySummaryCards summary={data.summary} />
        </div>
      </section>

      {/* RECENT ACTIVITY & SYSTEM STATUS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* ACTIVITY FEED */}
        <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between px-4">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <Activity size={16} className="text-lime-500" /> Recent Stock Movements
                </h3>
                <span className="px-4 py-1.5 bg-slate-100 rounded-full text-[9px] font-black uppercase tracking-widest text-slate-500">
                    Live Feed
                </span>
            </div>
            
            <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-xl overflow-hidden p-2">
                <InventoryMovements movements={data.latest_movements} />
            </div>
        </div>

        {/* SIDEBAR: SYSTEM HEALTH */}
        <aside className="space-y-8">
            <div className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-lime-500/10 blur-[60px] -mr-16 -mt-16" />
                <Zap size={32} className="text-lime-400 mb-8" />
                <h4 className="text-xl font-black uppercase italic tracking-tighter mb-2">Inventory Audit</h4>
                <p className="text-slate-400 text-sm font-medium leading-relaxed italic mb-8">
                    Your digital records perfectly match your physical stock levels.
                </p>
                <div className="space-y-4">
                    <StatusLine label="Last Data Sync" status="Just now" />
                    <StatusLine label="Low Stock Alerts" status="Active" />
                    <StatusLine label="Server Connection" status="Excellent" />
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm group hover:border-lime-500 transition-all duration-500">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Inventory Value</p>
                        <h5 className="text-3xl font-black italic">₹{(data.summary.total_stock_value || 0).toLocaleString()}</h5>
                    </div>
                    <div className="h-10 w-10 bg-lime-50 rounded-xl flex items-center justify-center text-lime-600">
                        <ShieldCheck size={20} />
                    </div>
                </div>
                <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                    <div className="h-full w-2/3 bg-lime-500 rounded-full shadow-[0_0_12px_rgba(132,204,22,0.4)]" />
                </div>
                <p className="mt-4 text-[9px] font-bold text-slate-300 uppercase italic">Financial Security Verified</p>
            </div>
        </aside>
      </div>
    </motion.div>
  );
}

function StatusLine({ label, status }: { label: string, status: string }) {
    return (
        <div className="flex justify-between items-center py-3 border-b border-white/5 last:border-0">
            <span className="text-[9px] font-black uppercase text-slate-500 tracking-widest">{label}</span>
            <span className="text-[10px] font-bold text-lime-400 italic">{status}</span>
        </div>
    );
}