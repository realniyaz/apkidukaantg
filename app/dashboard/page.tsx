"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import { motion, Variants } from "framer-motion";
import {
  Mail, Fingerprint, Package, AlertTriangle, 
  Wallet, ArrowUpRight, RefreshCcw, Activity, 
  Zap, IndianRupee, Target, BarChart3, Globe, 
  Layers, Cpu, Copy, Check
} from "lucide-react";
import Link from "next/link";

/* --- ANIMATION VARIANTS --- */
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring", stiffness: 300, damping: 25 } 
  }
};

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyId = (id: string) => {
    if (!id) return;
    navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const fetchDashboardData = async () => {
    try {
      setRefreshing(true);
      const [user, inventory, valuation, lowStock, aiSummary, sales] = await Promise.all([
        apiRequest<any>("users/me"),
        apiRequest<any>("inventory/dashboard"),
        apiRequest<any>("inventory/valuation"),
        apiRequest<any>("inventory/low-stock"),
        apiRequest<any>("ai/business/summary"),
        apiRequest<any>("sales/dashboard"),
      ]);

      setData({ user, inventory, valuation, lowStock, aiSummary, sales });
    } catch (error) {
      console.error("Dashboard sync failed:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchDashboardData(); }, []);

  if (loading) return <DashboardSkeleton />;

  return (
    <motion.div 
      variants={containerVariants} 
      initial="hidden" 
      animate="show"
      className="max-w-[1600px] mx-auto px-4 sm:px-8 py-6 sm:py-12 space-y-6 sm:space-y-12 pb-24 sm:pb-32 text-slate-900 selection:bg-lime-500/30"
    >
      
      {/* 01. WELCOME HEADER */}
      <motion.header variants={itemVariants} className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 border-b border-slate-100 pb-6 sm:pb-12">
        <div className="space-y-3 sm:space-y-4 w-full lg:w-auto">
          <div className="flex items-center gap-2.5">
            <div className="flex -space-x-1.5">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-5 w-5 rounded-full bg-slate-900 border-2 border-white flex items-center justify-center">
                    <div className="h-1 w-1 rounded-full bg-lime-400 animate-pulse" />
                  </div>
                ))}
            </div>
            <span className="text-[9px] font-black uppercase tracking-[0.25em] text-lime-600">Live Connection Active</span>
          </div>
          <h1 className="text-4xl sm:text-7xl font-black tracking-tighter uppercase italic leading-[0.9] sm:leading-[0.8]">
            Store <span className="text-slate-400">Overview</span>
          </h1>
          <p className="text-slate-400 font-medium text-sm sm:text-lg max-w-2xl leading-relaxed">
            Welcome back, <span className="text-slate-900 font-black italic">{data?.user?.name || "Merchant"}</span>. 
            Your shop is currently operating at <span className="text-lime-600 font-black">{data?.aiSummary?.business_health_score || 0}%</span> performance capacity.
          </p>
        </div>

        <div className="flex items-center justify-between w-full lg:w-auto gap-4 pt-2 lg:pt-0">
            <div className="flex flex-col text-left lg:text-right lg:pr-6 lg:border-r lg:border-slate-100">
                <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">System Uptime</span>
                <span className="text-xs sm:text-sm font-semibold tabular-nums text-slate-600">99.9% Operational</span>
            </div>
            <button 
              onClick={fetchDashboardData}
              disabled={refreshing}
              className="bg-slate-900 hover:bg-black text-white p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2.5rem] shadow-xl transition-all active:scale-95 flex items-center gap-2.5 group"
            >
              <RefreshCcw size={18} className={`${refreshing ? 'animate-spin' : 'group-hover:rotate-180'} transition-transform duration-1000`} />
              <span className="text-[10px] font-black uppercase tracking-wider pr-1">Sync</span>
            </button>
        </div>
      </motion.header>

      {/* 02. PRIMARY STATS MATRIX */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <GlassCard label="Daily Revenue" value={``} rawVal={data?.sales?.today_summary?.revenue_today || 0} sub="Total Earnings Today" icon={<IndianRupee />} trend="+12.4%" color="lime" isCurrency />
        <GlassCard label="Stock Value" value={`₹${((data?.valuation?.total_stock_value || 0) / 1000).toFixed(1)}k`} sub="Total Asset Worth" icon={<Wallet />} trend="Stable" color="blue" />
        <GlassCard label="Restock Alerts" value={data?.aiSummary?.critical_reorders || 0} sub="Items Needing Attention" icon={<AlertTriangle />} trend="Action Required" color="red" isAlert={(data?.aiSummary?.critical_reorders || 0) > 0} />
        <GlassCard label="Store Health" value={`${data?.aiSummary?.business_health_score || 0}%`} sub="Overall Performance" icon={<Target />} trend="Optimal" color="slate" />
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 sm:gap-8">
        
        {/* 03. SALES & TRENDS ANALYSIS */}
        <motion.div variants={itemVariants} className="xl:col-span-8 space-y-4 sm:space-y-8">
          <div className="bg-white rounded-[2rem] sm:rounded-[3.5rem] border border-slate-100 shadow-xl p-5 sm:p-12 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity duration-1000 pointer-events-none">
                <Globe size={300} />
            </div>
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 sm:mb-12">
                <div className="space-y-0.5">
                    <h3 className="text-[10px] font-black uppercase tracking-wider text-lime-600 flex items-center gap-2">
                        <Activity size={14} /> Sales Momentum
                    </h3>
                    <p className="text-xl sm:text-3xl font-black italic uppercase tracking-tighter">Inventory Velocity</p>
                </div>
                <div className="flex gap-1.5 bg-slate-50 p-1 rounded-xl w-full sm:w-auto justify-center">
                    {['24H', '7D', '30D'].map(t => (
                        <button key={t} className="flex-1 sm:flex-none px-4 py-2 rounded-lg text-[9px] font-black transition-all hover:bg-white hover:shadow-sm">{t}</button>
                    ))}
                </div>
            </div>

            {/* Chart Container wrapped for horizontal overflow scrolling on mobile viewport screens */}
            <div className="w-full overflow-x-auto no-scrollbar -mx-2 px-2">
              <div className="h-48 sm:h-64 min-w-[440px] flex items-end gap-2 sm:gap-3 mb-6 sm:mb-12 pt-4">
                  {[40, 70, 45, 90, 65, 80, 100, 85, 95, 110, 90, 120].map((h, i) => (
                      <motion.div 
                          key={i}
                          initial={{ height: 0 }} animate={{ height: `${h}%` }}
                          transition={{ delay: i * 0.03, duration: 0.8 }}
                          className={`flex-1 rounded-t-lg sm:rounded-t-xl transition-all duration-500 relative group/bar ${i === 11 ? 'bg-lime-500 shadow-md shadow-lime-500/20' : 'bg-slate-100 group-hover:bg-slate-200'}`}
                      >
                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-bold text-slate-400 opacity-0 group-hover/bar:opacity-100 transition-opacity tabular-nums">
                          {h}
                        </span>
                      </motion.div>
                  ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-12 border-t border-slate-50 pt-6 sm:pt-12">
              <VelocityStat label="Fast Moving" count={data?.aiSummary?.fast_moving_products} desc="Products turning over under 48 hours" color="text-lime-600" />
              <VelocityStat label="Slow Moving" count={data?.aiSummary?.slow_moving_products} desc="Consider standard promotions" color="text-orange-500" />
              <VelocityStat label="Inactive Inventory" count={data?.aiSummary?.dead_products} desc="Review items for potential clearance" color="text-red-500" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
             <LinkCard href="/dashboard/ai/reorder" title="Smart Restock" icon={<Cpu />} />
             <LinkCard href="/dashboard/ai/profit" title="Margin Insights" icon={<Layers />} />
             <LinkCard href="/dashboard/inventory" title="Manage Stock" icon={<Package />} />
          </div>
         </motion.div>

        {/* 04. USER PROFILE & QUICK ACTIONS */}
        <motion.div variants={itemVariants} className="xl:col-span-4 space-y-4 sm:space-y-8">
            <div className="bg-slate-900 rounded-[2rem] sm:rounded-[3.5rem] p-6 sm:p-12 text-white relative overflow-hidden shadow-xl sm:shadow-2xl min-h-[500px] sm:min-h-[600px] flex flex-col justify-between group">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,#84cc1608,transparent_50%)] pointer-events-none" />
                
                <div className="space-y-8 sm:space-y-12 relative z-10">
                    <div className="flex items-center gap-4 sm:gap-6">
                        <div className="h-16 w-16 sm:h-24 sm:w-24 shrink-0 rounded-[1.2rem] sm:rounded-[2.5rem] bg-gradient-to-br from-lime-400 to-lime-600 p-0.5">
                            <div className="h-full w-full bg-slate-900 rounded-[1.1rem] sm:rounded-[2.3rem] flex items-center justify-center overflow-hidden border border-slate-800">
                                <span className="text-2xl sm:text-4xl font-black italic text-lime-500">{data?.user?.name?.charAt(0) || "M"}</span>
                            </div>
                        </div>
                        <div>
                            <h4 className="text-xl sm:text-3xl font-black tracking-tighter uppercase italic line-clamp-1">{data?.user?.name || "Merchant"}</h4>
                            <span className="inline-block px-3 py-1 bg-lime-500 text-slate-900 text-[9px] font-black uppercase tracking-wider rounded-full mt-1.5">
                                {data?.user?.role || "Store Administrator"}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-6 sm:space-y-10">
                        <ProfileField icon={<Mail size={16} />} label="Registered Email" value={data?.user?.email} />
                        <div className="space-y-2">
                             <div className="flex items-center justify-between">
                                <span className="text-[9px] font-black uppercase text-slate-500 tracking-wider flex items-center gap-2 italic">
                                    <Fingerprint size={14}/> Merchant Reference Key
                                </span>
                                <button onClick={() => copyId(data?.user?.public_id)} className="text-lime-500 hover:text-white p-1 transition-colors">
                                    {copied ? <Check size={14}/> : <Copy size={14}/>}
                                </button>
                             </div>
                             <p className="font-mono text-[10px] text-slate-400 break-all bg-white/5 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-white/5 tabular-nums">
                                {data?.user?.public_id || "SYNCING_ACCOUNT_ID"}
                             </p>
                        </div>
                    </div>
                </div>

                <div className="space-y-4 relative z-10 pt-8 sm:pt-0">
                    <Link href="/dashboard/sales/create" className="w-full py-4 sm:py-6 bg-white text-slate-900 rounded-[1.2rem] sm:rounded-[2rem] font-black text-xs uppercase tracking-wider text-center hover:bg-lime-400 transition-all flex items-center justify-center gap-2.5 shadow-lg active:scale-[0.98]">
                        <Zap size={16} fill="currentColor"/> Record New Sale
                    </Link>
                    <p className="text-center text-[9px] font-bold uppercase tracking-widest text-slate-600">Enterprise Encrypted Link</p>
                </div>
            </div>

            <div className="bg-white rounded-[1.5rem] sm:rounded-[2.5rem] border border-slate-100 p-5 sm:p-8 flex items-center justify-between shadow-md">
                <div className="flex items-center gap-3.5">
                    <div className="h-11 w-11 sm:h-12 sm:w-12 bg-lime-500/10 rounded-xl sm:rounded-2xl flex items-center justify-center text-lime-600 shadow-inner shrink-0">
                        <BarChart3 size={22} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Orders Handled Today</p>
                        <p className="text-xl sm:text-2xl font-black text-slate-900 tabular-nums">{data?.sales?.today_summary?.orders_today || 0}</p>
                    </div>
                </div>
                <Link href="/dashboard/sales" className="h-9 w-9 sm:h-10 sm:w-10 border border-slate-100 rounded-full flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all shadow-sm shrink-0">
                    <ArrowUpRight size={16} />
                </Link>
            </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* --- REUSABLE UI COMPONENTS --- */

function GlassCard({ label, value, rawVal, sub, icon, trend, color, isAlert, isCurrency }: any) {
  const styles: any = {
    lime: "text-lime-600 bg-lime-500/5 border-lime-100 shadow-lime-500/5",
    red: "text-red-600 bg-red-500/5 border-red-100 shadow-red-500/5",
    blue: "text-blue-600 bg-blue-500/5 border-blue-100 shadow-blue-500/5",
    slate: "text-slate-600 bg-slate-500/5 border-slate-200 shadow-slate-500/5"
  };

  const displayValue = isCurrency ? `₹${(rawVal || 0).toLocaleString()}` : value;

  return (
    <div className={`bg-white p-6 sm:p-10 rounded-[2rem] sm:rounded-[3.5rem] border border-slate-50 shadow-sm hover:shadow-xl transition-all duration-500 group relative overflow-hidden ${isAlert ? 'ring-2 ring-red-500/20' : ''}`}>
      <div className={`h-12 w-12 sm:h-16 sm:w-16 rounded-xl sm:rounded-[2rem] flex items-center justify-center mb-5 sm:mb-8 border transition-transform group-hover:rotate-[12deg] shadow-inner ${styles[color]}`}>
        {icon}
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">{label}</p>
      <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tighter mb-2 sm:mb-4 tabular-nums italic leading-none">{displayValue}</h2>
      <div className="flex justify-between items-center mt-4 sm:mt-6">
        <span className="text-[9px] font-black uppercase text-slate-300 tracking-wider">{sub}</span>
        <span className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-md ${isAlert ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-100 text-slate-500'}`}>
            {trend}
        </span>
      </div>
    </div>
  );
}

function VelocityStat({ label, count, desc, color }: any) {
    return (
        <div className="space-y-2">
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-0.5">{label}</p>
                <div className="flex items-baseline gap-1.5">
                    <span className={`text-3xl sm:text-5xl font-black tabular-nums ${color}`}>{count || 0}</span>
                    <span className="text-[9px] font-bold text-slate-300 uppercase italic">Products</span>
                </div>
            </div>
            <p className="text-[11px] font-medium text-slate-400 leading-relaxed italic">{desc}</p>
        </div>
    );
}

function LinkCard({ href, title, icon }: any) {
    return (
        <Link href={href} className="flex sm:flex-col items-center sm:justify-center p-4 sm:p-10 bg-white rounded-[1.5rem] sm:rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-xl hover:sm:-translate-y-1.5 transition-all group gap-4">
            <div className="h-12 w-12 sm:h-16 sm:w-16 bg-slate-50 rounded-xl sm:rounded-3xl flex items-center justify-center text-slate-400 group-hover:bg-lime-500 group-hover:text-slate-900 transition-all shadow-inner shrink-0">
                {icon}
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider group-hover:text-slate-900 transition-colors">{title}</span>
        </Link>
    );
}

function ProfileField({ icon, label, value }: any) {
    return (
        <div className="space-y-1.5">
            <span className="text-[9px] font-black uppercase text-slate-500 tracking-wider flex items-center gap-2 italic">
                {icon} {label}
            </span>
            <p className="text-sm sm:text-base font-bold text-white tracking-tight leading-none break-all">{value || "Unset"}</p>
        </div>
    );
}

function DashboardSkeleton() {
  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-8 py-6 sm:py-12 space-y-6 sm:space-y-12 animate-pulse">
      <div className="h-20 sm:h-32 w-2/3 sm:w-1/2 bg-slate-100 rounded-2xl sm:rounded-[3rem]" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[1,2,3,4].map(i => <div key={i} className="h-40 sm:h-64 bg-slate-50 rounded-2xl sm:rounded-[3.5rem]" />)}
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 sm:gap-8">
        <div className="xl:col-span-8 h-[400px] sm:h-[600px] bg-slate-50 rounded-2xl sm:rounded-[3.5rem]" />
        <div className="xl:col-span-4 h-[400px] sm:h-[600px] bg-slate-900/5 rounded-2xl sm:rounded-[3.5rem]" />
      </div>
    </div>
  );
}