"use client";

import { useEffect, useState, use, useCallback } from "react";
import { apiRequest } from "@/lib/api";
import { motion } from "framer-motion";
import { 
  ArrowLeft, BrainCircuit, ShieldAlert, Activity, 
  ArrowUpRight, Fingerprint, Zap, Loader2,
  TrendingUp, Scale, AlertTriangle, CheckCircle2,
  BarChart3, Layers, Wallet
} from "lucide-react";
import Link from "next/link";

interface RiskAnalysis {
  customer_name: string;
  credit_limit: number;
  outstanding: number;
  credit_utilization_percent: number;
  total_invoices: number;
  delayed_invoices: number;
  average_delay_days: number;
  installment_pattern_count: number;
  risk_score: number;
  risk_level: "LOW" | "MEDIUM" | "HIGH";
}

export default function IndividualRiskAnalysis({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const customerId = resolvedParams.id;

  const [analysis, setAnalysis] = useState<RiskAnalysis | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchRiskData = useCallback(async () => {
    try {
      setLoading(true);
      // ✅ ENDPOINT SYNC: /ai/customer/{id}/risk
      const data = await apiRequest<RiskAnalysis>(`/ai/customer/${customerId}/risk`);
      setAnalysis(data);
    } catch (err) {
      console.error("Critical Analysis Uplink Failure:", err);
    } finally {
      setLoading(false);
    }
  }, [customerId]);

  useEffect(() => {
    if (customerId) fetchRiskData();
  }, [customerId, fetchRiskData]);

  if (loading) return <LoadingTerminal label={`Extracting Risk DNA for Node ${customerId}...`} />;
  if (!analysis) return <ErrorState id={customerId} onRetry={fetchRiskData} />;

  const isHighRisk = analysis.risk_level === "HIGH";
  const trustPercentage = Math.max(0, 100 - analysis.risk_score);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto p-6 md:p-10 space-y-12 pb-32">
      
      {/* 01. NAVIGATION HEADER */}
      <div className="flex justify-between items-center">
        <Link href="/dashboard/ai/customer" className="inline-flex items-center gap-3 text-slate-400 hover:text-slate-900 font-black text-[11px] uppercase tracking-[0.3em] group transition-all">
          <ArrowLeft size={16} className="group-hover:-translate-x-2 transition-transform" /> Back to Registry
        </Link>
        <div className="bg-slate-900 px-6 py-2 rounded-full border border-slate-800 flex items-center gap-3 shadow-2xl">
           <Zap size={14} className="text-lime-400 animate-pulse" />
           <span className="text-[10px] font-black text-white uppercase tracking-widest">Neural Sync Status: Verified</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* 02. LEFT PANEL: IDENTITY & TRUST CIRCLE */}
        <div className="lg:col-span-4 space-y-8">
           <div className="bg-white rounded-[4rem] border border-slate-100 p-12 shadow-2xl relative overflow-hidden h-full flex flex-col items-center justify-center">
              <div className="absolute top-0 right-0 p-10 opacity-[0.03] text-slate-900 pointer-events-none rotate-12"><Fingerprint size={280} /></div>
              
              <div className="relative text-center space-y-6 mb-12">
                <div className="h-40 w-40 bg-slate-900 rounded-[3.5rem] flex items-center justify-center text-lime-400 text-6xl font-black mx-auto shadow-2xl border-8 border-slate-800 italic">
                  {analysis.customer_name.slice(0, 2).toUpperCase()}
                </div>
                <div className="space-y-2">
                   <h2 className="text-4xl font-black uppercase italic tracking-tighter text-slate-900 leading-none">{analysis.customer_name}</h2>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] bg-slate-50 px-4 py-1.5 rounded-full inline-block">Node: {customerId}</p>
                </div>
              </div>

              {/* INTEGRITY GAUGE */}
              <div className="relative pt-10 border-t border-slate-50 w-full flex flex-col items-center">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-8 italic">Integrity Spectrum</p>
                 <div className="relative">
                    <svg className="w-56 h-56 transform -rotate-90">
                       <circle cx="112" cy="112" r="95" stroke="currentColor" strokeWidth="18" fill="transparent" className="text-slate-50" />
                       <motion.circle 
                         cx="112" cy="112" r="95" stroke="currentColor" strokeWidth="18" fill="transparent" 
                         strokeDasharray={596.9}
                         initial={{ strokeDashoffset: 596.9 }}
                         animate={{ strokeDashoffset: 596.9 - (596.9 * trustPercentage) / 100 }}
                         transition={{ duration: 1.5, ease: "circOut" }}
                         className={isHighRisk ? "text-red-500" : analysis.risk_level === "MEDIUM" ? "text-amber-500" : "text-lime-500"}
                       />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                       <span className="text-7xl font-black italic tracking-tighter text-slate-900 leading-none">{trustPercentage}</span>
                       <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest pt-2">Trust %</span>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* 03. RIGHT PANEL: FULL METRIC MAPPING */}
        <div className="lg:col-span-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Row 1: Credit & Utilization */}
              <MetricBox 
                label="Credit Limit" 
                value={`₹${analysis.credit_limit.toLocaleString()}`} 
                sub="Max Authorized Uplink" 
                icon={<Wallet />} color="slate" 
              />
              <MetricBox 
                label="Utilization" 
                value={`${analysis.credit_utilization_percent}%`} 
                sub={`${((analysis.credit_utilization_percent / 100) * analysis.credit_limit).toLocaleString()} Active`} 
                icon={<TrendingUp />} color={analysis.credit_utilization_percent > 80 ? "red" : "blue"} 
              />
              
              {/* Row 2: Invoices & Delays */}
              <MetricBox 
                label="Manifest Count" 
                value={analysis.total_invoices} 
                sub="Lifetime Invoices" 
                icon={<BarChart3 />} color="slate" 
              />
              <MetricBox 
                label="Latency Factor" 
                value={`${analysis.average_delay_days}d`} 
                sub={`${analysis.delayed_invoices} Delayed Clusters`} 
                icon={<Activity />} color={analysis.average_delay_days > 7 ? "red" : "lime"} 
              />

              {/* Row 3: Installments & Patterns */}
              <MetricBox 
                label="Installment Health" 
                value={analysis.installment_pattern_count} 
                sub="Segmented Repayments" 
                icon={<Layers />} color="blue" 
              />
              <MetricBox 
                label="Risk Score" 
                value={analysis.risk_score} 
                sub={`Status: ${analysis.risk_level}`} 
                icon={<ShieldAlert />} color={isHighRisk ? "red" : "lime"} 
              />
            </div>

            {/* 04. ADVISORY CONTROL CONSOLE */}
            <div className="bg-slate-900 rounded-[4rem] p-12 text-white shadow-2xl relative overflow-hidden border border-white/5">
              <div className="absolute top-0 right-0 p-16 opacity-10 pointer-events-none"><BrainCircuit size={200} className="text-lime-400" /></div>
              
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-6 relative z-10">
                <div className="space-y-2">
                   <h3 className="text-2xl font-black uppercase italic tracking-tighter flex items-center gap-4">
                      <ShieldAlert size={28} className={isHighRisk ? "text-red-500" : "text-lime-400"} /> AI Risk Analysis
                   </h3>
                   <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em]">Automated Credit Protocol Advisory</p>
                </div>
                <div className={`px-8 py-3 border-2 rounded-2xl text-xs font-black uppercase tracking-[0.3em] ${isHighRisk ? 'bg-red-500/10 border-red-500/30 text-red-500' : 'bg-lime-500/10 border-lime-500/30 text-lime-400'}`}>
                   RISK LEVEL: {analysis.risk_level}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-20 relative z-10">
                 <div className="space-y-6">
                    <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.5em]">Outstanding Liability</p>
                    <div>
                      <p className={`text-8xl font-black italic tracking-tighter tabular-nums leading-none ${analysis.outstanding > 0 ? 'text-white' : 'text-lime-400'}`}>
                        ₹{analysis.outstanding.toLocaleString()}
                      </p>
                      <div className="mt-8 flex items-center gap-4">
                         <div className={`h-1.5 flex-1 rounded-full bg-white/5 overflow-hidden`}>
                            <motion.div 
                              initial={{ width: 0 }} 
                              animate={{ width: `${(analysis.outstanding / analysis.credit_limit) * 100}%` }} 
                              className="h-full bg-lime-400"
                            />
                         </div>
                         <span className="text-[10px] font-black text-slate-500 italic uppercase">Limit Exposure</span>
                      </div>
                    </div>
                 </div>

                 <div className="space-y-8 flex flex-col justify-center">
                    <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.5em]">Protocol Decisions</p>
                    <div className="space-y-6">
                       <AdvisoryRow text={isHighRisk ? "CREDIT EXTENSION DENIED" : "APPROVED FOR INCREMENT"} success={!isHighRisk} />
                       <AdvisoryRow text={analysis.average_delay_days < 3 ? "HIGH SETTLEMENT VELOCITY" : "SUBOPTIMAL COLLECTION SPEED"} success={analysis.average_delay_days < 3} />
                       <AdvisoryRow text={analysis.credit_utilization_percent < 50 ? "NOMINAL RESOURCE USAGE" : "HEAVY UPLINK CONGESTION"} success={analysis.credit_utilization_percent < 50} />
                    </div>
                 </div>
              </div>
            </div>
        </div>
      </div>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/* SUB-COMPONENTS */
/* -------------------------------------------------------------------------- */

function MetricBox({ label, value, sub, icon, color }: any) {
  const variants: any = {
    slate: "bg-slate-50/50 border-slate-100",
    blue: "bg-blue-50/50 border-blue-100",
    lime: "bg-lime-50/50 border-lime-100",
    red: "bg-red-50/50 border-red-100",
  };
  
  const iconColors: any = {
    slate: "text-slate-400 bg-white shadow-slate-100",
    blue: "text-blue-600 bg-white shadow-blue-100",
    lime: "text-lime-600 bg-white shadow-lime-100",
    red: "text-red-600 bg-white shadow-red-100",
  };

  return (
    <motion.div whileHover={{ y: -5, scale: 1.01 }} className={`p-10 border-2 rounded-[3.5rem] flex items-start gap-8 transition-all hover:bg-white hover:shadow-2xl ${variants[color]}`}>
       <div className={`h-16 w-16 rounded-2xl flex items-center justify-center shadow-xl border border-slate-50 ${iconColors[color]}`}>
         {icon}
       </div>
       <div className="space-y-1">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">{label}</p>
          <p className="text-4xl font-black italic tracking-tighter text-slate-900 leading-none">{value}</p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-3 whitespace-nowrap">{sub}</p>
       </div>
    </motion.div>
  );
}

function AdvisoryRow({ text, success }: { text: string, success: boolean }) {
  return (
    <div className="flex items-center gap-4 group">
       <div className={`h-10 w-10 rounded-xl border flex items-center justify-center transition-colors ${success ? 'border-lime-500/20 bg-lime-500/5 text-lime-500' : 'border-red-500/20 bg-red-500/5 text-red-500'}`}>
          {success ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
       </div>
       <span className="text-[13px] font-black italic uppercase tracking-widest text-slate-200 group-hover:text-white transition-colors">{text}</span>
    </div>
  );
}

function LoadingTerminal({ label }: { label: string }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDFDFD]">
      <div className="relative">
        <Loader2 className="animate-spin text-slate-900" size={80} />
        <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-lime-500" size={32} />
      </div>
      <p className="mt-10 font-black text-slate-900 uppercase tracking-[0.6em] text-xs italic animate-pulse">{label}</p>
    </div>
  );
}

function ErrorState({ id, onRetry }: { id: string, onRetry: () => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-12 text-center">
       <ShieldAlert size={80} className="text-red-500 mb-8" />
       <h1 className="text-4xl font-black uppercase italic tracking-tighter text-slate-900 leading-none">Neural Link Disrupted</h1>
       <p className="text-slate-400 font-black uppercase text-xs tracking-[0.4em] mt-6 max-w-sm">Failed to establish risk handshake for node: {id}</p>
       <div className="flex gap-6 mt-12">
          <button onClick={onRetry} className="px-12 py-5 bg-lime-500 text-slate-900 rounded-[2rem] font-black text-[10px] uppercase tracking-widest shadow-xl active:scale-95 transition-all">Re-Sync Node</button>
          <Link href="/dashboard/ai/customer" className="px-12 py-5 bg-slate-900 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-widest shadow-xl active:scale-95 transition-all">Return</Link>
       </div>
    </div>
  );
}