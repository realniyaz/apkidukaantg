"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
  CreditCard, 
  ShieldAlert, 
  Wallet,
  Zap,
  TrendingUp,
  BarChart3,
  Filter,
  UserCheck,
  UserX,
  Activity
} from "lucide-react";
import { cleanDecimal } from "@/lib/api"; // Reusing our decimal cleaner

interface Customer {
  id: number;
  name: string;
  is_active: boolean;
  is_credit_allowed: boolean;
  credit_limit: string | number;
}

export default function CustomerStats({ customers = [] }: { customers: Customer[] }) {
  const [filterMode, setFilterMode] = useState<"ACTIVE" | "INACTIVE">("ACTIVE");

  // 01. Neural Metric Calculations
  const activeCount = customers.filter(c => c.is_active).length;
  const creditAllowedCount = customers.filter(c => c.is_credit_allowed).length;
  
  // ✅ FIX: Use cleanDecimal to handle long backend strings or commas
  const totalExposure = useMemo(() => 
    customers.reduce((acc, curr) => acc + cleanDecimal(curr.credit_limit), 0),
  [customers]);

  // 02. Filtered Data for Ledger Chart
  const chartData = useMemo(() => {
    return [...customers]
      .filter(c => (filterMode === "ACTIVE" ? c.is_active : !c.is_active))
      // ✅ FIX: Ensure we parse the limit correctly before filtering
      .filter(c => cleanDecimal(c.credit_limit) > 0)
      .sort((a, b) => cleanDecimal(b.credit_limit) - cleanDecimal(a.credit_limit))
      .slice(0, 10);
  }, [customers, filterMode]);

  const maxLimit = useMemo(() => {
    const limits = chartData.map(c => cleanDecimal(c.credit_limit));
    return Math.max(...limits, 1000);
  }, [chartData]);

  if (!customers || customers.length === 0) {
    return <StatsSkeleton />;
  }

  return (
    <div className="space-y-8 selection:bg-blue-500/20">
      {/* KPI GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatMiniCard label="Total Entities" value={customers.length} sub="Nodes Active" icon={<Users />} color="slate" />
        <StatMiniCard label="Integrity" value={`${Math.round((activeCount / customers.length) * 100)}%`} sub="Verified" icon={<ShieldAlert />} color="lime" />
        <StatMiniCard label="Exposure" value={`₹${(totalExposure / 1000).toFixed(1)}k`} sub="Authorized" icon={<Wallet />} color="blue" />
        <StatMiniCard label="Vectors" value={creditAllowedCount} sub="Accounts" icon={<CreditCard />} color="orange" />
      </div>

      {/* CREDIT LEDGER VISUALIZATION */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-slate-100 rounded-[3.5rem] p-10 shadow-2xl relative overflow-hidden"
      >
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-16 gap-8 relative z-10">
          <div className="space-y-2">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600 flex items-center gap-2 italic">
              <BarChart3 size={14} /> Fiscal Ledger
            </h3>
            <p className="text-3xl font-black italic uppercase tracking-tighter text-slate-900">
                {filterMode} <span className="text-slate-400">Risk Distribution</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex bg-slate-100 p-1.5 rounded-[1.5rem] border border-slate-200 shadow-inner">
                <button 
                    type="button"
                    onClick={() => setFilterMode("ACTIVE")}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                        filterMode === "ACTIVE" ? "bg-white text-slate-900 shadow-md" : "text-slate-400 hover:text-slate-600"
                    }`}
                >
                    <UserCheck size={14} className={filterMode === "ACTIVE" ? "text-lime-500" : ""} /> Verified
                </button>
                <button 
                    type="button"
                    onClick={() => setFilterMode("INACTIVE")}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                        filterMode === "INACTIVE" ? "bg-slate-900 text-white shadow-lg" : "text-slate-400 hover:text-slate-600"
                    }`}
                >
                    <UserX size={14} className={filterMode === "INACTIVE" ? "text-red-400" : ""} /> Suspended
                </button>
            </div>

            <div className="flex items-center gap-6 px-6 py-3 bg-slate-50 rounded-2xl border border-slate-100">
               <div className="flex flex-col">
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Exposure</span>
                  <span className="text-sm font-black tabular-nums italic">₹{chartData.reduce((a,b)=>a+cleanDecimal(b.credit_limit),0).toLocaleString()}</span>
               </div>
               <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
            </div>
          </div>
        </div>

        {/* CHART AREA */}
        <div className="relative h-64 w-full flex items-end gap-4 group px-4">
          <AnimatePresence mode="wait">
            {chartData.length > 0 ? (
                <motion.div 
                    key={filterMode}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex w-full items-end justify-around gap-2 h-full"
                >
                    {chartData.map((c, i) => {
                        const val = cleanDecimal(c.credit_limit);
                        const percentage = (val / maxLimit) * 100;
                        return (
                          <div key={c.id} className="flex-1 flex flex-col items-center gap-4 group/bar h-full">
                              <div className="relative w-full flex flex-col items-center h-full justify-end">
                                <div className="absolute -top-10 opacity-0 group-hover/bar:opacity-100 transition-all bg-slate-900 text-white text-[9px] font-black px-3 py-1.5 rounded-lg pointer-events-none z-10 whitespace-nowrap">
                                    ₹{val.toLocaleString()}
                                </div>
                                <motion.div 
                                    initial={{ height: 0 }}
                                    animate={{ height: `${percentage}%` }}
                                    transition={{ delay: i * 0.04, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                    className={`w-full max-w-[50px] rounded-t-3xl transition-all duration-500 ${
                                    filterMode === "ACTIVE" 
                                    ? 'bg-blue-600 shadow-[0_0_30px_rgba(37,99,235,0.2)] group-hover/bar:bg-blue-400' 
                                    : 'bg-slate-300 group-hover/bar:bg-red-500'
                                    }`}
                                />
                              </div>
                              <span className="text-[9px] font-black uppercase text-slate-400 truncate max-w-[80px] italic pt-2">
                                {c.name}
                              </span>
                          </div>
                        );
                    })}
                </motion.div>
            ) : (
                <motion.div 
                    key="empty" 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="w-full h-full flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-[3rem] bg-slate-50/30"
                >
                    <Activity className="text-slate-200 mb-4 animate-pulse" size={48} />
                    <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px]">No Neural Data Detected</p>
                </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="absolute top-0 right-0 p-20 opacity-[0.03] pointer-events-none">
          <Zap size={400} />
        </div>
      </motion.div>
    </div>
  );
}

function StatMiniCard({ label, value, sub, icon, color }: any) {
  const themes: any = {
    slate: "bg-slate-900 text-white border-slate-800 shadow-2xl",
    lime: "bg-white text-slate-900 border-slate-100",
    blue: "bg-white text-slate-900 border-slate-100",
    orange: "bg-white text-slate-900 border-slate-100"
  };

  const iconColors: any = {
    slate: "text-lime-400 bg-white/5",
    lime: "text-lime-600 bg-lime-50",
    blue: "text-blue-600 bg-blue-50",
    orange: "text-orange-600 bg-orange-50"
  };

  return (
    <motion.div whileHover={{ y: -8 }} className={`p-8 rounded-[3rem] border transition-all duration-500 group relative overflow-hidden ${themes[color]}`}>
      <div className="flex justify-between items-start mb-8">
        <div className={`h-14 w-14 rounded-2xl flex items-center justify-center transition-all group-hover:rotate-12 ${iconColors[color]}`}>
          {icon}
        </div>
        <div className="h-2 w-2 rounded-full bg-lime-500 animate-ping" />
      </div>
      <div className="space-y-1">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">{label}</p>
        <h3 className="text-5xl font-black tracking-tighter tabular-nums italic leading-none">{value}</h3>
      </div>
      <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
        <span className="text-[9px] font-black uppercase tracking-widest opacity-60 italic">{sub}</span>
        <Zap size={10} className="text-lime-500" />
      </div>
    </motion.div>
  );
}

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-4 gap-6 animate-pulse">
      {[1,2,3,4].map(i => <div key={i} className="h-48 bg-slate-100 rounded-[3rem]" />)}
    </div>
  );
}