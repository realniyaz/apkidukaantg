"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { apiRequest } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, BadgeIndianRupee, Search, RefreshCcw, 
  ReceiptText, Activity, Clock, ArrowUpRight, Terminal
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
  initial: { opacity: 0, y: 12 },
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
      console.error("Dashboard sync failed:", error.message);
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
        // 1. Convert DD-MM-YYYY to YYYY-MM-DD
        let safeDate = s.date;
        if (s.date && s.date.includes("-")) {
          const parts = s.date.split("-");
          if (parts[0].length === 2 && parts.length === 3) {
            safeDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
          }
        }

        // 2. Extract real ID or fallback via Invoice suffix
        let extractedId = s.id;
        if (!extractedId && s.invoice) {
          const invParts = s.invoice.split('-');
          const lastPart = invParts[invParts.length - 1];
          extractedId = parseInt(lastPart, 10);
        }
        const finalId = extractedId || (index + 9000);

        return {
          id: finalId,
          invoice_number: s.invoice || "Draft Invoice", 
          customer_name: s.customer_name || `Walk-in Customer #${finalId}`, 
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
      className="max-w-7xl mx-auto space-y-6 sm:space-y-8 p-4 sm:p-8 pb-24 sm:pb-32 text-slate-900"
    >
      {/* HEADER CONTROLS */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 sm:gap-6">
        <div className="space-y-1.5 sm:space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-lime-500 animate-pulse shadow-[0_0_8px_#bef264]" />
            <span className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-wider">Live Sales Monitoring</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tighter italic uppercase leading-none text-slate-900">
            Sales <span className="text-slate-400">Overview</span>
          </h1>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto bg-white p-2 rounded-xl sm:rounded-[1.5rem] border border-slate-100 shadow-sm">
          <button 
            onClick={() => fetchDashboard(true)} 
            disabled={refreshing}
            className="p-3 sm:p-4 text-slate-400 hover:text-slate-900 transition-colors disabled:opacity-50 shrink-0"
            title="Sync Records"
          >
            <RefreshCcw size={18} className={refreshing ? "animate-spin text-lime-500" : ""} />
          </button>
          <Link href="/dashboard/sales/create" className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-slate-900 hover:bg-black text-white px-5 sm:px-8 h-11 sm:h-12 rounded-xl sm:rounded-2xl font-black text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 text-center">
            <Plus size={16} /> New Sale
          </Link>
        </div>
      </header>

      {/* KPI STATS MATRIX */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <QuickStat 
          label="Total Revenue" 
          value={`₹${(dashboardData?.overview?.total_sales || 0).toLocaleString('en-IN')}`} 
          icon={<BadgeIndianRupee size={20} />} 
          trend="Gross Sales"
        />
        <QuickStat 
          label="Orders Handled" 
          value={dashboardData?.overview?.orders || 0} 
          icon={<Activity size={20} />} 
          trend="Total Orders"
        />
        <QuickStat 
          label="Settled Earnings" 
          value={`₹${(dashboardData?.overview?.paid || 0).toLocaleString('en-IN')}`} 
          icon={<Terminal size={20} />} 
          trend={`₹${(dashboardData?.overview?.pending || 0).toLocaleString('en-IN')} Due`}
        />
      </div>

      {/* FILTER AND UTILITY STRIP */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4">
           <div className="md:col-span-8 flex items-center gap-3 px-4 sm:px-8 bg-white border border-slate-100 rounded-xl sm:rounded-[2rem] shadow-sm focus-within:border-slate-400 transition-all">
              <Search size={18} className="text-slate-300 shrink-0" />
              <input 
                type="text" 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by invoice number or customer name..." 
                className="bg-transparent py-4 sm:py-6 outline-none text-sm w-full font-semibold text-slate-700 placeholder:text-slate-300"
              />
           </div>
           
           <div className="md:col-span-4 flex items-center justify-between px-5 sm:px-8 py-3 sm:py-4 bg-slate-900 text-white rounded-xl sm:rounded-[2rem] shadow-md">
             <div className="flex items-center gap-2.5">
                <Clock size={16} className="text-lime-400" />
                <span className="text-[10px] font-black uppercase tracking-wider">Live Update Stream</span>
             </div>
             <span className="text-[9px] font-mono text-lime-400 bg-lime-500/10 px-2 py-0.5 rounded-md uppercase font-bold tracking-widest">Active</span>
           </div>
        </div>

        {/* DATA LEDGER TABLE CONTAINER */}
        <div className="bg-white rounded-[1.5rem] sm:rounded-[3.5rem] border border-slate-100 shadow-sm overflow-hidden min-h-[400px] relative">
          <div className="w-full overflow-x-auto">
            <SalesTable sales={mappedSales as any} />
          </div>
          
          <AnimatePresence mode="wait">
            {mappedSales.length === 0 && (
              <div className="flex flex-col items-center justify-center py-24 sm:py-32 relative z-10 p-4 text-center">
                <div className="h-14 w-14 sm:h-20 sm:w-20 bg-slate-50 rounded-xl sm:rounded-[2rem] flex items-center justify-center mb-4 border border-slate-100 shrink-0">
                  <ReceiptText size={28} className="text-slate-200" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">No Sales Records Found</p>
                {searchQuery && (
                  <p className="text-xs font-medium text-slate-400 mt-1.5">No match found for your current search criteria.</p>
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
    <div className="bg-white p-5 sm:p-8 rounded-[1.5rem] sm:rounded-[3rem] border border-slate-100 flex flex-col justify-between group hover:shadow-md transition-all duration-300 relative overflow-hidden">
      <div className="flex items-center gap-4 sm:gap-5 mb-6 sm:mb-8">
        <div className="h-11 w-11 sm:h-12 sm:w-12 bg-slate-50 rounded-xl sm:rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-lime-400 transition-colors shadow-inner shrink-0">
          {icon}
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none mb-1 truncate">{label}</span>
          <div className="flex items-center gap-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-lime-500 shrink-0" />
            <span className="text-[9px] font-black text-lime-600 uppercase tracking-tight truncate">{trend}</span>
          </div>
        </div>
      </div>
      <div className="flex justify-between items-end relative z-10">
        <p className="text-3xl sm:text-5xl font-black text-slate-900 tabular-nums tracking-tighter italic leading-none">{value}</p>
        <div className="h-8 w-8 sm:h-10 sm:w-10 bg-slate-50 rounded-lg sm:rounded-xl flex items-center justify-center group-hover:bg-slate-900 transition-colors shrink-0">
          <ArrowUpRight size={16} className="text-slate-300 group-hover:text-lime-400" />
        </div>
      </div>
    </div>
  );
}

function SalesSkeleton() {
  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-8 space-y-6 sm:space-y-10 animate-pulse">
      <div className="h-12 sm:h-16 bg-slate-100 rounded-xl w-1/3" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        {[1, 2, 3].map(i => <div key={i} className="h-36 sm:h-48 bg-slate-50 rounded-xl sm:rounded-[2.5rem]" />)}
      </div>
      <div className="h-[400px] sm:h-[600px] bg-slate-50 rounded-xl sm:rounded-[3.5rem]" />
    </div>
  );
}