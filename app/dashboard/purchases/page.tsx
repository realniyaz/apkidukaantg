"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import { motion } from "framer-motion";
import { 
  Package, 
  AlertCircle, 
  CheckCircle, 
  ArrowUpRight, 
  Clock, 
  Filter, 
  Download,
  Plus,
  TrendingUp,
  Loader2
} from "lucide-react";
import Link from "next/link";
import StatusBadge from "./components/StatusBadge";

export default function PurchasesDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await apiRequest("/purchases/dashboard");
        setStats(data);
      } catch (error) {
        console.error("Dashboard Sync Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <DashboardSkeleton />;
  if (!stats) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="max-w-7xl mx-auto p-4 sm:p-8 space-y-6 sm:space-y-10 pb-24 sm:pb-32 text-slate-900"
    >
      {/* 1. HEADER & CONTROLS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 sm:gap-6">
        <div className="space-y-1.5 sm:space-y-2">
          <div className="flex items-center gap-2 text-lime-600 font-black text-[9px] sm:text-[10px] uppercase tracking-wider">
            <TrendingUp size={14} /> Supply & Orders Live
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight uppercase italic">Purchases</h1>
          <p className="text-slate-500 font-medium text-sm sm:text-base">
            Tracking <span className="text-slate-900 font-bold">{stats.total_purchases} supplier invoices</span> this month.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto pt-2 md:pt-0">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 sm:px-6 py-3.5 sm:py-4 bg-white border border-slate-200 rounded-xl sm:rounded-2xl font-bold text-sm text-slate-600 hover:bg-slate-50 transition-all shadow-sm active:scale-95">
            <Download size={16} /> Export
          </button>
          <Link 
            href="/dashboard/purchases/create" 
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 sm:px-8 py-3.5 sm:py-4 bg-slate-900 text-white rounded-xl sm:rounded-2xl font-bold text-sm hover:bg-black transition-all shadow-lg active:scale-95 text-center"
          >
            <Plus size={16} /> New Purchase
          </Link>
        </div>
      </div>

      {/* 2. KPI GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        <StatCard 
          title="Total Spending" 
          value={`₹${Number(stats.total_purchase_amount).toLocaleString('en-IN')}`} 
          icon={<Package size={20} />} 
          color="lime" 
        />
        <StatCard 
          title="Paid Orders" 
          value={`₹${Number(stats.total_paid_amount).toLocaleString('en-IN')}`} 
          icon={<CheckCircle size={20} />} 
          color="blue" 
        />
        <StatCard 
          title="Balance Due" 
          value={`₹${Number(stats.total_unpaid_amount).toLocaleString('en-IN')}`} 
          icon={<AlertCircle size={20} />} 
          color="red" 
        />
      </div>

      {/* 3. RECENT TRANSACTIONS LEDGER */}
      <div className="bg-white rounded-[1.5rem] sm:rounded-[2.5rem] border border-slate-100 shadow-md overflow-hidden">
        <div className="px-5 sm:px-8 py-4 sm:py-6 border-b border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/30">
          <h4 className="font-bold text-slate-800 flex items-center gap-2.5 text-base sm:text-lg">
            <Clock size={18} className="text-slate-400" /> Recent Purchase Orders
          </h4>
          <div className="flex items-center gap-2">
             <button className="flex items-center gap-2 px-3.5 py-2 bg-white rounded-lg border border-slate-100 text-[11px] font-bold text-slate-500 w-full sm:w-auto justify-center">
               <Filter size={12} /> Filter Status
             </button>
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[700px] border-separate border-spacing-0">
            <thead className="bg-slate-50/50 text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-50">
              <tr>
                <th className="px-6 sm:px-8 py-4 text-left">Invoice Number</th>
                <th className="px-6 sm:px-8 py-4 text-left">Supplier / Vendor</th>
                <th className="px-6 sm:px-8 py-4 text-left">Order Date</th>
                <th className="px-6 sm:px-8 py-4 text-left">Amount</th>
                <th className="px-6 sm:px-8 py-4 text-left">Payment Status</th>
                <th className="px-6 sm:px-8 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 font-semibold text-slate-700">
              {stats.recent_purchases.map((purchase: any, i: number) => (
                <motion.tr 
                  key={purchase.id}
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="group hover:bg-slate-50/40 transition-all"
                >
                  <td className="px-6 sm:px-8 py-5 font-mono text-xs text-slate-500 group-hover:text-slate-900">
                    {purchase.purchase_number}
                  </td>
                  <td className="px-6 sm:px-8 py-5 font-bold text-slate-900">
                    {purchase.supplier?.supplier_name || "Direct Purchase"}
                  </td>
                  <td className="px-6 sm:px-8 py-5 text-slate-400 text-sm">
                    {new Date(purchase.created_at).toLocaleDateString('en-IN')}
                  </td>
                  <td className="px-6 sm:px-8 py-5 font-bold text-slate-900 tabular-nums">
                    ₹{Number(purchase.total_amount).toLocaleString('en-IN')}
                  </td>
                  <td className="px-6 sm:px-8 py-5">
                    <StatusBadge status={purchase.status} />
                  </td>
                  <td className="px-6 sm:px-8 py-5 text-right">
                    {/* Actions explicitly interactive on mobile without hovering */}
                    <Link 
                      href={`/dashboard/purchases/${purchase.id}`}
                      className="inline-flex items-center justify-center h-9 w-9 rounded-lg bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white transition-all shadow-sm active:scale-90"
                    >
                      <ArrowUpRight size={16} />
                    </Link>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}

function StatCard({ title, value, icon, color }: any) {
  const themes: any = {
    lime: "bg-lime-50 text-lime-600 border-lime-100 shadow-lime-100/30",
    blue: "bg-blue-50 text-blue-600 border-blue-100 shadow-blue-100/30",
    red: "bg-red-50 text-red-600 border-red-100 shadow-red-100/30",
  };

  return (
    <div className="bg-white p-5 sm:p-8 rounded-[1.5rem] sm:rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group">
      <div className={`h-11 w-11 sm:h-12 sm:w-12 rounded-xl flex items-center justify-center mb-4 sm:mb-6 border transition-all ${themes[color]}`}>
        {icon}
      </div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">{title}</p>
      <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight tabular-nums italic">{value}</h2>
      <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 group-hover:text-slate-900 uppercase tracking-wider mt-4 transition-colors cursor-pointer">
        View Summary <ArrowUpRight size={14} className="text-slate-300 group-hover:text-slate-900 transition-colors" />
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-8 space-y-6 sm:space-y-10 animate-pulse">
      <div className="h-16 bg-slate-100 rounded-xl w-1/2 sm:w-1/3" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        {[1, 2, 3].map(i => <div key={i} className="h-32 sm:h-44 bg-slate-50 rounded-xl sm:rounded-[2.5rem]" />)}
      </div>
      <div className="h-64 sm:h-96 bg-slate-50 rounded-xl sm:rounded-[2.5rem]" />
    </div>
  );
}