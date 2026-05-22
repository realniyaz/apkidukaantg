"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import { motion, Variants } from "framer-motion";
import {
  Mail, Fingerprint, Package, AlertTriangle, 
  TrendingUp, Wallet, ArrowUpRight, 
  RefreshCcw, Activity, Zap, IndianRupee, 
  Target, BarChart3, Globe, Layers, Cpu, Copy, Check
} from "lucide-react";
import Link from "next/link";

/* --- ANIMATION VARIANTS --- */
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring", stiffness: 300, damping: 24 } 
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

  const fetchGlobalIntelligence = async () => {
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
      console.error("System sync failed:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchGlobalIntelligence(); }, []);

  if (loading) return <DashboardSkeleton />;

  return (
    <motion.div 
      variants={containerVariants} 
      initial="hidden" 
      animate="show"
      className="max-w-[1600px] mx-auto px-8 py-12 space-y-12 pb-32 text-slate-900 selection:bg-lime-500/30 font-bold"
    >
      
      {/* 01. WELCOME HEADER */}
      <motion.header variants={itemVariants} className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 border-b border-slate-100 pb-12">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-6 w-6 rounded-full bg-slate-900 border-2 border-white flex items-center justify-center">
                    <div className="h-1 w-1 rounded-full bg-lime-400 animate-pulse" />
                  </div>
                ))}
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-lime-600">System Status: Connected</span>
          </div>
          <h1 className="text-7xl font-black tracking-tighter uppercase italic leading-[0.8] transition-all">
            Store <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-500 text-slate-800">Overview</span>
          </h1>
          <p className="text-slate-400 font-medium text-lg max-w-2xl leading-relaxed">
            Welcome back, <span className="text-slate-900 font-black italic">{data?.user?.name || "Merchant"}</span>. 
            Your shop is currently running at <span className="text-lime-600 font-black">{data?.aiSummary?.business_health_score || 0}%</span> of its sales potential.
          </p>
        </div>

        <div className="flex items-center gap-4">
            <div className="hidden xl:flex flex-col text-right pr-6 border-r border-slate-100">
                <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Network Uptime</span>
                <span className="text-sm font-bold tabular-nums">99.9%</span>
            </div>
            <button 
              onClick={fetchGlobalIntelligence}
              disabled={refreshing}
              className="bg-slate-900 hover:bg-black text-white p-6 rounded-[2.5rem] shadow-2xl transition-all active:scale-95 flex items-center gap-3 group"
            >
              <RefreshCcw size={20} className={`${refreshing ? 'animate-spin' : 'group-hover:rotate-180'} transition-transform duration-1000`} />
              <span className="text-[10px] font-black uppercase tracking-widest pr-2">Refresh Data</span>
            </button>
        </div>
      </motion.header>

      {/* 02. PRIMARY STATS MATRIX */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <GlassCard label="Daily Revenue" value={`₹${(data?.sales?.today_summary?.revenue_today || 0).toLocaleString()}`} sub="Total Earnings Today" icon={<IndianRupee />} trend="+12.4%" color="lime" />
        <GlassCard label="Stock Value" value={`₹${((data?.valuation?.total_stock_value || 0) / 1000).toFixed(1)}k`} sub="Total Asset Worth" icon={<Wallet />} trend="Stable" color="blue" />
        <GlassCard label="Restock Alerts" value={data?.aiSummary?.critical_reorders || 0} sub="Items Needing Attention" icon={<AlertTriangle />} trend="Action Required" color="red" isAlert={(data?.aiSummary?.critical_reorders || 0) > 0} />
        <GlassCard label="Store Health" value={`${data?.aiSummary?.business_health_score || 0}%`} sub="Overall Performance" icon={<Target />} trend="Optimal" color="slate" />
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* 03. SALES & TRENDS ANALYSIS */}
        <motion.div variants={itemVariants} className="xl:col-span-8 space-y-8">
          <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-2xl p-12 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-1000">
                <Globe size={300} />
            </div>
            
            <div className="flex justify-between items-start mb-12">
                <div className="space-y-1">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-lime-600 flex items-center gap-2">
                        <Activity size={14} /> Performance Trends
                    </h3>
                    <p className="text-3xl font-black italic uppercase tracking-tighter">Inventory Activity</p>
                </div>
                <div className="flex gap-2">
                    {['24H', '7D', '30D'].map(t => (
                        <button key={t} className="px-4 py-2 rounded-xl text-[9px] font-black border border-slate-100 hover:bg-slate-900 hover:text-white transition-all">{t}</button>
                    ))}
                </div>
            </div>

            <div className="h-64 w-full flex items-end gap-3 mb-12">
                {[40, 70, 45, 90, 65, 80, 100, 85, 95, 110, 90, 120].map((h, i) => (
                    <motion.div 
                        key={i}
                        initial={{ height: 0 }} animate={{ height: `${h}%` }}
                        transition={{ delay: i * 0.05, duration: 1 }}
                        className={`flex-1 rounded-t-xl transition-all duration-500 ${i === 11 ? 'bg-lime-500 shadow-lg shadow-lime-500/20' : 'bg-slate-100 group-hover:bg-slate-200'}`}
                    />
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-slate-50 pt-12">
              <VelocityStat label="Best Sellers" count={data?.aiSummary?.fast_moving_products} desc="Moving within 48 hours" color="text-lime-600" />
              <VelocityStat label="Slow Moving" count={data?.aiSummary?.slow_moving_products} desc="Consider a promotion" color="text-orange-500" />
              <VelocityStat label="No Sales" count={data?.aiSummary?.dead_products} desc="Review for clearance" color="text-red-500" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <LinkCard href="/dashboard/ai/reorder" title="Smart Reordering" icon={<Cpu />} />
             <LinkCard href="/dashboard/ai/profit" title="Profit Insights" icon={<Layers />} />
             <LinkCard href="/dashboard/inventory" title="View Inventory" icon={<Package />} />
          </div>
        </motion.div>

        {/* 04. USER PROFILE & QUICK ACTIONS */}
        <motion.div variants={itemVariants} className="xl:col-span-4 space-y-8">
            <div className="bg-slate-900 rounded-[3.5rem] p-12 text-white relative overflow-hidden shadow-2xl min-h-[600px] flex flex-col justify-between group">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,#84cc1610,transparent_50%)]" />
                
                <div className="space-y-12 relative z-10">
                    <div className="flex items-center gap-6">
                        <div className="h-24 w-24 rounded-[2.5rem] bg-gradient-to-br from-lime-400 to-lime-600 p-1">
                            <div className="h-full w-full bg-slate-900 rounded-[2.3rem] flex items-center justify-center overflow-hidden border border-slate-800">
                                <span className="text-4xl font-black italic text-lime-500">{data?.user?.name?.charAt(0) || "U"}</span>
                            </div>
                        </div>
                        <div>
                            <h4 className="text-3xl font-black tracking-tighter uppercase italic">{data?.user?.name || "User"}</h4>
                            <span className="inline-block px-4 py-1.5 bg-lime-500 text-slate-900 text-[10px] font-black uppercase tracking-widest rounded-full mt-2">
                                {data?.user?.role || "Store Owner"}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-10">
                        <ProfileField icon={<Mail size={16} />} label="Contact Email" value={data?.user?.email} />
                        <div className="space-y-2">
                             <div className="flex items-center justify-between">
                                <span className="text-[9px] font-black uppercase text-slate-500 tracking-[0.2em] flex items-center gap-2 italic">
                                    <Fingerprint size={14}/> Unique Account ID
                                </span>
                                <button onClick={() => copyId(data?.user?.public_id)} className="text-lime-500 hover:text-white transition-colors">
                                    {copied ? <Check size={14}/> : <Copy size={14}/>}
                                </button>
                             </div>
                             <p className="font-mono text-[10px] text-slate-400 break-all bg-white/5 p-4 rounded-2xl border border-white/5 tabular-nums">
                                {data?.user?.public_id || "ID_PENDING_SYNC"}
                             </p>
                        </div>
                    </div>
                </div>

                <div className="space-y-4 relative z-10">
                    <Link href="/dashboard/sales/create" className="w-full py-6 bg-white text-slate-900 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] text-center hover:bg-lime-500 transition-all flex items-center justify-center gap-3">
                        <Zap size={16} fill="currentColor"/> New Sale Entry
                    </Link>
                    <p className="text-center text-[9px] font-black uppercase tracking-widest text-slate-600">Secure Access Active</p>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 flex items-center justify-between shadow-lg">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-lime-500/10 rounded-2xl flex items-center justify-center text-lime-600 shadow-inner">
                        <BarChart3 size={24} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Orders Today</p>
                        <p className="text-2xl font-black text-slate-900 tabular-nums">{data?.sales?.today_summary?.orders_today || 0}</p>
                    </div>
                </div>
                <Link href="/dashboard/sales" className="h-10 w-10 border border-slate-100 rounded-full flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all shadow-sm">
                    <ArrowUpRight size={18} />
                </Link>
            </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* --- REUSABLE UI COMPONENTS --- */

function GlassCard({ label, value, sub, icon, trend, color, isAlert }: any) {
  const styles: any = {
    lime: "text-lime-600 bg-lime-500/5 border-lime-100 shadow-lime-500/5",
    red: "text-red-600 bg-red-500/5 border-red-100 shadow-red-500/5",
    blue: "text-blue-600 bg-blue-500/5 border-blue-100 shadow-blue-500/5",
    slate: "text-slate-600 bg-slate-500/5 border-slate-200 shadow-slate-500/5"
  };

  return (
    <div className={`bg-white p-10 rounded-[3.5rem] border border-slate-50 shadow-sm hover:shadow-2xl transition-all duration-500 group relative overflow-hidden ${isAlert ? 'ring-2 ring-red-500/20' : ''}`}>
      <div className={`h-16 w-16 rounded-[2rem] flex items-center justify-center mb-8 border transition-transform group-hover:rotate-[15deg] shadow-inner ${styles[color]}`}>
        {icon}
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">{label}</p>
      <h2 className="text-5xl font-black text-slate-900 tracking-tighter mb-4 tabular-nums italic leading-none">{value}</h2>
      <div className="flex justify-between items-center mt-6">
        <span className="text-[9px] font-black uppercase text-slate-300 tracking-widest">{sub}</span>
        <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-lg ${isAlert ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-100 text-slate-500'}`}>
            {trend}
        </span>
      </div>
    </div>
  );
}

function VelocityStat({ label, count, desc, color }: any) {
    return (
        <div className="space-y-4">
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
                <div className="flex items-baseline gap-2">
                    <span className={`text-5xl font-black tabular-nums ${color}`}>{count || 0}</span>
                    <span className="text-[10px] font-bold text-slate-300 uppercase italic">Items</span>
                </div>
            </div>
            <p className="text-[11px] font-medium text-slate-400 leading-relaxed italic">{desc}</p>
        </div>
    );
}

function LinkCard({ href, title, icon }: any) {
    return (
        <Link href={href} className="flex flex-col items-center justify-center p-10 bg-white rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all group gap-4">
            <div className="h-16 w-16 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-400 group-hover:bg-lime-500 group-hover:text-slate-900 transition-all shadow-inner">
                {icon}
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] group-hover:text-slate-900 transition-colors">{title}</span>
        </Link>
    );
}

function ProfileField({ icon, label, value }: any) {
    return (
        <div className="space-y-3">
            <span className="text-[9px] font-black uppercase text-slate-500 tracking-[0.2em] flex items-center gap-2 italic">
                {icon} {label}
            </span>
            <p className="text-base font-bold text-white tracking-tight leading-none">{value || "Not Set"}</p>
        </div>
    );
}

function DashboardSkeleton() {
  return (
    <div className="max-w-[1600px] mx-auto px-8 py-12 space-y-12 animate-pulse">
      <div className="h-32 w-1/2 bg-slate-100 rounded-[3rem]" />
      <div className="grid grid-cols-4 gap-6">
        {[1,2,3,4].map(i => <div key={i} className="h-64 bg-slate-50 rounded-[3.5rem]" />)}
      </div>
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-8 h-[600px] bg-slate-50 rounded-[3.5rem]" />
        <div className="col-span-4 h-[600px] bg-slate-900/10 rounded-[3.5rem]" />
      </div>
    </div>
  );
}