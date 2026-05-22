"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { apiRequest } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, BadgeIndianRupee, Search, RefreshCcw, 
  ReceiptText, Zap, BrainCircuit, Activity, 
  Terminal, Clock, ArrowUpRight 
} from "lucide-react";
import SalesTable from "./components/SalesTable";

// --- STRICT TYPES FOR PRODUCTION JSON ---
interface DashboardResponse {
  overview: {
    total_sales: number;
    orders: number;
    paid: number;
    pending: number;
  };
  trend: { date: string; sales: number }[];
  top_products: { product: string | null; quantity: number }[];
  payment_summary: { mode: string; amount: number }[];
  recent_sales: { 
    id?: number; 
    invoice: string | null; 
    amount: number; 
    date: string; 
    customer_name?: string;
  }[];
}

const fader = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { type: "spring", stiffness: 300, damping: 30 }
} as const;

export default function SalesDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // --- LIVE API CONNECTION ---
  const fetchDashboard = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      
      const data = await apiRequest<DashboardResponse>("sales/dashboard", { method: "GET" });
      setDashboardData(data);
    } catch (error: any) {
      console.error("Neural Sync Failure:", error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { 
    fetchDashboard(); 
  }, [fetchDashboard]);

  // --- SECURE DATA MAPPING WITH DATE & ID FIXES ---
  const mappedSales = useMemo(() => {
    if (!dashboardData?.recent_sales) return [];
    
    return dashboardData.recent_sales
      .filter((sale) => {
        const query = searchQuery.toLowerCase();
        const invoiceMatch = sale.invoice?.toLowerCase().includes(query) || false;
        const customerMatch = sale.customer_name?.toLowerCase().includes(query) || false;
        return invoiceMatch || customerMatch; 
      })
      .map((s, index) => {
        // 1. 🟢 TEMPORAL PATCH: Convert DD-MM-YYYY to YYYY-MM-DD
        let safeDate = s.date;
        if (s.date && s.date.includes("-")) {
          const parts = s.date.split("-");
          // If it's DD-MM-YYYY (parts[0] is 2 chars)
          if (parts[0].length === 2 && parts.length === 3) {
            safeDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
          }
        }

        // 2. 🟢 TERMINAL PATCH: Extract real ID or fallback via Invoice suffix
        let extractedId = s.id;
        if (!extractedId && s.invoice) {
          const invParts = s.invoice.split('-');
          const lastPart = invParts[invParts.length - 1];
          extractedId = parseInt(lastPart, 10);
        }
        const finalId = extractedId || (index + 9000);

        return {
          id: finalId,
          invoice_number: s.invoice || "DRAFT_NODE", // Visual fallback for drafts
          // 3. 🟢 IDENTITY PATCH: Fallback for "Unknown Entity"
          customer_name: s.customer_name || `Node Link #${finalId}`, 
          total_amount: Number(s.amount) || 0,
          paid_amount: s.invoice ? Number(s.amount) : 0, 
          status: s.invoice ? "POSTED" : "DRAFT",
          created_at: safeDate 
        };
      });
  }, [dashboardData, searchQuery]);

  if (loading) return <SalesSkeleton />;

  return (
    <motion.div 
      initial={fader.initial}
      animate={fader.animate}
      transition={fader.transition}
      className="max-w-7xl mx-auto space-y-8 p-4 md:p-8 pb-32"
    >
      {/* 🟢 TOP COMMAND STRIP */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-lime-500 animate-pulse shadow-[0_0_10px_#bef264]" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Sales: Active</span>
          </div>
          <h1 className="text-6xl font-black tracking-tighter italic uppercase leading-none text-slate-900">
            Sales <span className="text-slate-200"></span>
          </h1>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto bg-white p-2 rounded-[1.5rem] border border-slate-100 shadow-sm">
          <button 
            onClick={() => fetchDashboard(true)} 
            disabled={refreshing}
            className="p-4 text-slate-400 hover:text-slate-900 transition-colors disabled:opacity-50"
            title="Force Neural Sync"
          >
            <RefreshCcw size={20} className={refreshing ? "animate-spin text-lime-500" : ""} />
          </button>
          <Link href="/dashboard/sales/create" className="flex-1 md:flex-none flex items-center justify-center gap-3 bg-slate-900 hover:bg-black text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl active:scale-95">
            <Plus size={18} /> New Entry
          </Link>
        </div>
      </header>

      {/* 🟢 KPI MATRIX */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <QuickStat 
          label="Total Yield" 
          value={`₹${(dashboardData?.overview?.total_sales || 0).toLocaleString('en-IN')}`} 
          icon={<BadgeIndianRupee size={22} />} 
          trend="Gross Revenue"
        />
        <QuickStat 
          label="Processed Vouchers" 
          value={dashboardData?.overview?.orders || 0} 
          icon={<Activity size={22} />} 
          trend="Total Volume"
        />
        <QuickStat 
          label="Capital Settled" 
          value={`₹${(dashboardData?.overview?.paid || 0).toLocaleString('en-IN')}`} 
          icon={<Terminal size={22} />} 
          trend={`₹${(dashboardData?.overview?.pending || 0).toLocaleString('en-IN')} Pending`}
        />
      </div>

      {/* 🟢 FEED CONTROLS & SEARCH */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
           <div className="md:col-span-8 flex items-center gap-4 px-8 bg-white border border-slate-100 rounded-[2rem] shadow-sm focus-within:border-lime-500 transition-all">
              <Search size={18} className="text-slate-300" />
              <input 
                type="text" 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Execute search by Invoice sequence or Entity..." 
                className="bg-transparent py-6 outline-none text-sm w-full font-bold text-slate-700 placeholder:text-slate-300 italic"
              />
           </div>
           
           <div className="md:col-span-4 flex items-center justify-between px-8 py-4 bg-slate-900 text-white rounded-[2rem] shadow-xl">
             <div className="flex items-center gap-3">
                <Clock size={16} className="text-lime-400" />
                <span className="text-[10px] font-black uppercase tracking-widest">Temporal Feed</span>
             </div>
             <span className="text-[10px] font-mono text-lime-400 animate-pulse">STABLE</span>
           </div>
        </div>

        {/* 🟢 TABLE CONTAINER */}
        <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)] overflow-hidden min-h-[500px] relative">
          <div className="absolute top-0 right-0 p-10 opacity-[0.02] pointer-events-none">
            <BrainCircuit size={300} />
          </div>
          
          <AnimatePresence mode="wait">
            {mappedSales.length > 0 ? (
              <motion.div key="table" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <SalesTable sales={mappedSales as any} />
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center py-40 relative z-10">
                <div className="h-20 w-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-6 border border-slate-100">
                  <ReceiptText size={32} className="text-slate-200" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Voucher Ledger Idle</p>
                {searchQuery && (
                  <p className="text-xs font-bold text-slate-300 mt-2">No nodes matched your query.</p>
                )}
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

// --- SUB COMPONENTS ---

interface QuickStatProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend: string;
}

function QuickStat({ label, value, icon, trend }: QuickStatProps) {
  return (
    <div className="bg-white p-8 rounded-[3rem] border border-slate-100 flex flex-col justify-between group hover:shadow-2xl hover:border-lime-200 transition-all duration-500 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-10 transition-opacity">
        <ArrowUpRight size={80} className="text-slate-900" />
      </div>
      <div className="flex items-center gap-5 mb-8">
        <div className="h-12 w-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-lime-400 transition-colors shadow-inner group-hover:shadow-none">
          {icon}
        </div>
        <div className="flex flex-col">
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{label}</span>
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-lime-500" />
            <span className="text-[9px] font-bold text-lime-600 uppercase tracking-tighter">{trend}</span>
          </div>
        </div>
      </div>
      <div className="flex justify-between items-end relative z-10">
        <p className="text-5xl font-black text-slate-900 tabular-nums tracking-tighter italic leading-none">{value}</p>
        <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center group-hover:bg-slate-900 transition-colors">
          <ArrowUpRight size={20} className="text-slate-300 group-hover:text-lime-400" />
        </div>
      </div>
    </div>
  );
}

function SalesSkeleton() {
  return (
    <div className="max-w-7xl mx-auto p-8 space-y-10 animate-pulse">
      <div className="h-20 bg-slate-100 rounded-[2rem] w-1/3" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[1, 2, 3].map(i => <div key={i} className="h-56 bg-slate-50 rounded-[3rem] border border-slate-100" />)}
      </div>
      <div className="h-[600px] bg-slate-50 rounded-[4rem] border border-slate-100" />
    </div>
  );
}