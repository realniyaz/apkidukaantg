"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
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

  // ERP Calculation: Paid vs Unpaid Percentage
  const paymentProgress = (stats.total_paid_amount / stats.total_purchase_amount) * 100;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="max-w-7xl mx-auto p-4 md:p-8 space-y-10"
    >
      {/* 1. ERP ACTION HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-lime-600 font-black text-[10px] uppercase tracking-[0.2em]">
            <TrendingUp size={14} /> Procurement Intelligence
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tight">Purchases</h1>
          <p className="text-slate-500 font-medium">Monitoring {stats.total_purchases} procurement vouchers in this cycle.</p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-white border border-slate-200 rounded-2xl font-bold text-sm text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
            <Download size={18} /> Export Ledger
          </button>
          <Link 
            href="/dashboard/purchases/create" 
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-black transition-all shadow-xl shadow-slate-200"
          >
            <Plus size={18} /> New Voucher
          </Link>
        </div>
      </div>

      {/* 2. KPI GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Total Liability" 
          value={`₹${Number(stats.total_purchase_amount).toLocaleString()}`} 
          icon={<Package size={22} />} 
          color="lime" 
        />
        <StatCard 
          title="Settled Amount" 
          value={`₹${Number(stats.total_paid_amount).toLocaleString()}`} 
          icon={<CheckCircle size={22} />} 
          color="blue" 
        />
        <StatCard 
          title="Total Unpaid" 
          value={`₹${Number(stats.total_unpaid_amount).toLocaleString()}`} 
          icon={<AlertCircle size={22} />} 
          color="red" 
        />
      </div>

      {/* 3. RECENT TRANSACTIONS LEDGER */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/30">
          <h4 className="font-bold text-slate-800 flex items-center gap-3 text-lg">
            <Clock size={20} className="text-slate-400" /> Recent Procurement Ledger
          </h4>
          <div className="flex items-center gap-2">
             <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-slate-100 text-xs font-bold text-slate-500">
               <Filter size={14} /> Filter Status
             </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
              <tr>
                <th className="px-8 py-5 text-left">Voucher #</th>
                <th className="px-8 py-5 text-left">Entity / Supplier</th>
                <th className="px-8 py-5 text-left">Filing Date</th>
                <th className="px-8 py-5 text-left">Total Value</th>
                <th className="px-8 py-5 text-left">Status</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {stats.recent_purchases.map((purchase: any, i: number) => (
                <motion.tr 
                  key={purchase.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group hover:bg-slate-50/80 transition-all"
                >
                  <td className="px-8 py-6 font-mono font-medium text-slate-500 text-sm group-hover:text-slate-900 transition-colors">
                    {purchase.purchase_number}
                  </td>
                  <td className="px-8 py-6 font-black text-slate-900">
                    {purchase.supplier?.supplier_name || "Direct Purchase"}
                  </td>
                  <td className="px-8 py-6 text-slate-500 text-sm font-bold">
                    {new Date(purchase.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-8 py-6 font-black text-slate-900 tabular-nums">
                    ₹{Number(purchase.total_amount).toLocaleString()}
                  </td>
                  <td className="px-8 py-6">
                    <StatusBadge status={purchase.status} />
                  </td>
                  <td className="px-8 py-6 text-right">
                    <Link 
                      href={`/dashboard/purchases/${purchase.id}`}
                      className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                    >
                      <ArrowUpRight size={18} />
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
    lime: "bg-lime-50 text-lime-600 border-lime-100 shadow-lime-100/50",
    blue: "bg-blue-50 text-blue-600 border-blue-100 shadow-blue-100/50",
    red: "bg-red-50 text-red-600 border-red-100 shadow-red-100/50",
  };

  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
      <div className={`h-14 w-14 rounded-2xl flex items-center justify-center mb-6 shadow-lg border transition-all group-hover:scale-110 ${themes[color]}`}>
        {icon}
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{title}</p>
      <h2 className="text-4xl font-black text-slate-900 tracking-tighter tabular-nums">{value}</h2>
      <div className="flex items-center gap-1.5 text-[10px] font-black text-lime-500 uppercase tracking-widest mt-4 group-hover:translate-x-1 transition-transform cursor-pointer">
        Analyze Trends <ArrowUpRight size={14} />
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="max-w-7xl mx-auto p-8 space-y-10 animate-pulse">
      <div className="h-24 bg-slate-100 rounded-3xl w-2/3" />
      <div className="grid grid-cols-3 gap-6">
        {[1, 2, 3].map(i => <div key={i} className="h-44 bg-slate-50 rounded-[2.5rem]" />)}
      </div>
      <div className="h-96 bg-slate-50 rounded-[2.5rem]" />
    </div>
  );
}