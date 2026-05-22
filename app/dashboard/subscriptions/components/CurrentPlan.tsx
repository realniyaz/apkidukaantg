"use client";

import { Subscription, SubscriptionStatus } from "../types";
import { 
  ShieldCheck, Calendar, Zap, 
  Fingerprint, Activity, Info 
} from "lucide-react";
import { motion } from "framer-motion";

export default function CurrentPlan({ subscription }: { subscription: Subscription | null }) {
  
  // 🟢 EMPTY STATE: When no node is linked to the tenant
  if (!subscription) return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border-2 border-dashed border-slate-100 rounded-[3.5rem] p-20 flex flex-col items-center justify-center text-center space-y-6 group hover:border-lime-200 transition-colors duration-700"
    >
      <div className="h-24 w-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center text-slate-200 border border-slate-100 shadow-inner group-hover:scale-110 group-hover:text-lime-400 transition-all duration-700">
        <Fingerprint size={48} strokeWidth={1.5} />
      </div>
      <div className="space-y-2">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] animate-pulse">Awaiting Neural Uplink</p>
        <h3 className="text-2xl font-black italic tracking-tighter text-slate-900 uppercase">Vault Empty</h3>
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] max-w-[320px] mx-auto leading-relaxed">
          No active subscription node detected. Select a tier below to initialize your business matrix.
        </p>
      </div>
    </motion.div>
  );

  // Status Logic Mapping
  const isHealthy = [SubscriptionStatus.ACTIVE, SubscriptionStatus.TRIALING].includes(subscription.status);
  
  const formattedDate = subscription.current_period_end 
    ? new Date(subscription.current_period_end).toLocaleDateString('en-GB', { 
        day: '2-digit', 
        month: 'long', 
        year: 'numeric' 
      })
    : "STAMP_PENDING";

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-slate-900 rounded-[3.5rem] p-12 text-white relative overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.4)]"
    >
      {/* 🟢 NEURAL DECORATORS */}
      <div className="absolute top-0 right-0 p-12 opacity-[0.04] pointer-events-none rotate-12">
        <Zap size={350} strokeWidth={1} />
      </div>
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_left,rgba(163,230,53,0.05),transparent_50%)]" />

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
        
        {/* TIER IDENTITY */}
        <div className="space-y-4">
          <div className="flex items-center gap-5">
            <div className="h-16 w-16 bg-lime-400 rounded-3xl flex items-center justify-center text-slate-900 shadow-[0_0_30px_rgba(163,230,53,0.3)]">
              <ShieldCheck size={32} />
            </div>
            <div className="flex flex-col">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] leading-none mb-2">Current Tier</p>
              <h3 className="text-4xl font-black italic tracking-tighter uppercase leading-none">
                {subscription.plan?.name || "UNNAMED_PLAN"}
              </h3>
            </div>
          </div>
        </div>

        {/* TEMPORAL METRICS */}
        <div className="flex flex-col gap-2 md:border-x border-white/5 md:px-12">
          <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">
            <Calendar size={14} className="text-lime-400" /> Cycle End
          </div>
          <p className="text-2xl font-black italic tracking-tight tabular-nums">
            {formattedDate}
          </p>
          {subscription.cancel_at_period_end && (
            <div className="flex items-center gap-2 mt-1 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-lg w-fit">
              <Info size={10} className="text-amber-500" />
              <span className="text-[8px] font-black text-amber-500 uppercase tracking-widest">
                Termination Scheduled
              </span>
            </div>
          )}
        </div>

        {/* STATUS VECTOR */}
        <div className="flex justify-end">
          <div className="flex flex-col items-end gap-3">
            <div className={`px-8 py-4 rounded-2xl border-2 font-black text-[11px] uppercase tracking-[0.4em] italic flex items-center gap-4 transition-all duration-500 ${
              isHealthy 
              ? 'border-lime-500/30 text-lime-400 bg-lime-400/5 shadow-[0_0_40px_rgba(163,230,53,0.1)]' 
              : 'border-red-500/30 text-red-500 bg-red-500/5 shadow-[0_0_40px_rgba(239,68,68,0.1)]'
            }`}>
              <div className={`h-2.5 w-2.5 rounded-full animate-pulse ${
                isHealthy ? 'bg-lime-400 shadow-[0_0_12px_#bef264]' : 'bg-red-500 shadow-[0_0_12px_#ef4444]'
              }`} />
              {subscription.status}
            </div>
            <div className="flex items-center gap-2 pr-2">
              <Activity size={10} className="text-slate-700" />
              <p className="text-[9px] font-bold text-slate-600 uppercase tracking-[0.4em]">Uplink Satisfactory</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}