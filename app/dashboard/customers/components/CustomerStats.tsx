"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
  CreditCard, 
  ShieldAlert, 
  Wallet,
  Zap,
  BarChart3,
  UserCheck,
  UserX,
  Activity
} from "lucide-react";
import { cleanDecimal } from "@/lib/api";

interface Customer {
  id: number;
  name: string;
  is_active: boolean;
  is_credit_allowed: boolean;
  credit_limit: string | number;
}

export default function CustomerStats({ customers = [] }: { customers: Customer[] }) {
  const [filterMode, setFilterMode] = useState<"ACTIVE" | "INACTIVE">("ACTIVE");

  const activeCount = customers.filter(c => c.is_active).length;
  const creditAllowedCount = customers.filter(c => c.is_credit_allowed).length;
  
  const totalExposure = useMemo(() => 
    customers.reduce((acc, curr) => acc + cleanDecimal(curr.credit_limit), 0),
  [customers]);

  const chartData = useMemo(() => {
    return [...customers]
      .filter(c => (filterMode === "ACTIVE" ? c.is_active : !c.is_active))
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
    <div className="space-y-6 sm:space-y-8 selection:bg-blue-500/10 text-slate-900 w-full">
      {/* KPI GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatMiniCard label="Total Accounts" value={customers.length.toLocaleString('en-IN')} sub="Active Profiles" icon={<Users size={20} />} color="slate" />
        <StatMiniCard label="Active Status" value={`${Math.round((activeCount / customers.length) * 100)}%`} sub="Verified Clean" icon={<ShieldAlert size={20} />} color="lime" />
        <StatMiniCard label="Total Credit Limit" value={`₹${(totalExposure / 1000).toFixed(1)}k`} sub="Authorized Bound" icon={<Wallet size={20} />} color="blue" />
        <StatMiniCard label="Credit Accounts" value={creditAllowedCount} sub="Active Lines" icon={<CreditCard size={20} />} color="orange" />
      </div>

      {/* CREDIT VISUALIZATION PANEL */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-slate-100 rounded-xl sm:rounded-[2.5rem] md:rounded-[3rem] p-4 sm:p-6 md:p-10 shadow-sm relative overflow-hidden"
      >
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 sm:mb-14 md:mb-16 gap-6 sm:gap-8 relative z-10 w-full">
          <div className="space-y-1 sm:space-y-2">
            <h3 className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-blue-600 flex items-center gap-1.5 italic">
              <BarChart3 size={14} /> Credit Balances
            </h3>
            <p className="text-xl sm:text-2xl md:text-3xl font-black italic uppercase tracking-tight text-slate-900">
              {filterMode === "ACTIVE" ? "Active" : "Suspended"} <span className="text-slate-400">Credit Allocations</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
            <div className="flex bg-slate-50 p-1 sm:p-1.5 rounded-xl sm:rounded-2xl border border-slate-100 shadow-inner flex-1 sm:flex-none">
              <button 
                type="button"
                onClick={() => setFilterMode("ACTIVE")}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 h-9 px-4 sm:px-6 rounded-lg sm:rounded-xl text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap ${
                  filterMode === "ACTIVE" ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"
                }`}
              >
                <UserCheck size={12} className={filterMode === "ACTIVE" ? "text-lime-500" : ""} /> Active
              </button>
              <button 
                type="button"
                onClick={() => setFilterMode("INACTIVE")}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 h-9 px-4 sm:px-6 rounded-lg sm:rounded-xl text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap ${
                  filterMode === "INACTIVE" ? "bg-slate-900 text-white shadow-sm" : "text-slate-400 hover:text-slate-600"
                }`}
              >
                <UserX size={12} className={filterMode === "INACTIVE" ? "text-red-400" : ""} /> Suspended
              </button>
            </div>

            <div className="flex items-center gap-4 h-11 px-4 sm:px-6 bg-slate-50 rounded-xl sm:rounded-2xl border border-slate-100/60 shrink-0 ml-auto sm:ml-0">
               <div className="flex flex-col">
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider leading-none mb-1">Subtotal</span>
                  <span className="text-xs sm:text-sm font-black tabular-nums italic text-slate-800">
                    ₹{chartData.reduce((a,b) => a + cleanDecimal(b.credit_limit), 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
               </div>
               <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse shrink-0" />
            </div>
          </div>
        </div>

        {/* CHART TRACK GRID CONTAINER */}
        <div className="w-full overflow-x-auto no-scrollbar pt-8">
          <div className="relative h-60 w-full flex items-end gap-3 sm:gap-4 px-2 min-w-[500px]">
            <AnimatePresence mode="wait">
              {chartData.length > 0 ? (
                <motion.div 
                  key={filterMode}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="flex w-full items-end justify-around gap-2 h-full"
                >
                  {chartData.map((c, i) => {
                    const val = cleanDecimal(c.credit_limit);
                    const percentage = (val / maxLimit) * 100;
                    return (
                      <div key={c.id} className="flex-1 flex flex-col items-center gap-2.5 group/bar h-full min-w-[32px] max-w-[60px]">
                        <div className="relative w-full flex flex-col items-center h-full justify-end">
                          <div className="absolute -top-8 opacity-0 group-hover/bar:opacity-100 transition-opacity bg-slate-900 text-white text-[9px] font-black px-2.5 py-1 rounded-md pointer-events-none z-10 whitespace-nowrap shadow-md">
                            ₹{val.toLocaleString('en-IN')}
                          </div>
                          <motion.div 
                            initial={{ height: 0 }}
                            animate={{ height: `${percentage}%` }}
                            transition={{ delay: i * 0.02, duration: 0.6, ease: "easeOut" }}
                            className={`w-full rounded-t-lg sm:rounded-t-xl transition-all duration-300 ${
                              filterMode === "ACTIVE" 
                                ? 'bg-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.15)] group-hover/bar:bg-blue-400' 
                                : 'bg-slate-200 group-hover/bar:bg-red-400'
                            }`}
                          />
                        </div>
                        <span className="text-[9px] font-black uppercase text-slate-400 truncate w-full text-center italic pt-1 block">
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
                  className="w-full h-full flex flex-col items-center justify-center border border-dashed border-slate-200 rounded-xl sm:rounded-[2rem] bg-slate-50/50 py-12"
                >
                  <Activity className="text-slate-300 mb-3 animate-pulse shrink-0" size={32} />
                  <p className="text-slate-400 font-black uppercase tracking-wider text-[10px]">No active credit limits found</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="absolute top-0 right-0 p-10 opacity-[0.02] pointer-events-none hidden md:block">
          <Zap size={300} />
        </div>
      </motion.div>
    </div>
  );
}

function StatMiniCard({ label, value, sub, icon, color }: any) {
  const themes: any = {
    slate: "bg-slate-900 text-white border-slate-800 shadow-md",
    lime: "bg-white text-slate-900 border-slate-100 shadow-sm",
    blue: "bg-white text-slate-900 border-slate-100 shadow-sm",
    orange: "bg-white text-slate-900 border-slate-100 shadow-sm"
  };

  const iconColors: any = {
    slate: "text-lime-400 bg-white/5",
    lime: "text-lime-600 bg-lime-50 border border-lime-100/50",
    blue: "text-blue-600 bg-blue-50 border border-blue-100/50",
    orange: "text-orange-600 bg-orange-50 border border-orange-100/50"
  };

  return (
    <motion.div 
      whileHover={{ y: -4 }} 
      className={`p-5 sm:p-6 md:p-8 rounded-xl sm:rounded-[2.5rem] md:rounded-[3rem] border transition-all duration-300 group relative overflow-hidden w-full ${themes[color]}`}
    >
      <div className="flex justify-between items-start mb-6 sm:mb-8 w-full">
        <div className={`h-11 w-11 sm:h-14 sm:w-14 rounded-xl sm:rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105 shrink-0 ${iconColors[color]}`}>
          {icon}
        </div>
        <div className="h-1.5 w-1.5 rounded-full bg-lime-500 animate-pulse shrink-0 mt-1" />
      </div>
      <div className="space-y-0.5 sm:space-y-1 w-full">
        <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider opacity-40 truncate">{label}</p>
        <h3 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight tabular-nums italic leading-none truncate pr-1">{value}</h3>
      </div>
      <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-slate-50 flex items-center justify-between w-full">
        <span className="text-[9px] font-bold uppercase tracking-wide opacity-50 italic truncate">{sub}</span>
        <Zap size={10} className="text-lime-500 shrink-0" />
      </div>
    </motion.div>
  );
}

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 animate-pulse w-full">
      {[1,2,3,4].map(i => <div key={i} className="h-44 sm:h-48 bg-slate-100 rounded-xl sm:rounded-[2.5rem]" />)}
    </div>
  );
}