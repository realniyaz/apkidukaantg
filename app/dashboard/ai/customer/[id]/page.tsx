"use client";

import { useEffect, useState, use, useCallback } from "react";
import { apiRequest } from "@/lib/api";
import { motion } from "framer-motion";
import { 
  ArrowLeft, BrainCircuit, ShieldAlert, Activity, 
  Fingerprint, Zap, Loader2,
  TrendingUp, AlertTriangle, CheckCircle2,
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
      const data = await apiRequest<RiskAnalysis>(`/ai/customer/${customerId}/risk`);
      setAnalysis(data);
    } catch (err) {
      console.error("Failed to load customer risk assessment:", err);
    } finally {
      setLoading(false);
    }
  }, [customerId]);

  useEffect(() => {
    if (customerId) fetchRiskData();
  }, [customerId, fetchRiskData]);

  if (loading) return <LoadingTerminal label="Analyzing customer credit profile..." />;
  if (!analysis) return <ErrorState id={customerId} onRetry={fetchRiskData} />;

  const isHighRisk = analysis.risk_level === "HIGH";
  const trustPercentage = Math.max(0, 100 - analysis.risk_score);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8 pb-32 text-slate-900 w-full"
    >
      {/* 01. NAVIGATION HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100">
        <Link 
          href="/dashboard/ai/customer" 
          className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-900 font-black text-[10px] sm:text-xs uppercase tracking-wider group transition-all w-fit"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Customers
        </Link>
        <div className="w-fit bg-slate-900 px-4 py-1.5 rounded-full border border-slate-800 flex items-center gap-2 shadow-md shrink-0">
           <Zap size={12} className="text-lime-400" />
           <span className="text-[9px] sm:text-[10px] font-black text-white uppercase tracking-wider">AI Assessment Model Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        
        {/* 02. LEFT PANEL: IDENTITY & CREDIBILITY SPECTRUM */}
        <div className="col-span-12 lg:col-span-4">
           <div className="bg-white rounded-xl sm:rounded-[2.5rem] md:rounded-[3rem] border border-slate-100 p-6 sm:p-8 md:p-12 shadow-sm relative overflow-hidden flex flex-col items-center justify-center min-w-0">
              <div className="absolute top-0 right-0 p-4 opacity-[0.015] text-slate-900 pointer-events-none rotate-12 hidden sm:block">
                <Fingerprint size={240} />
              </div>
              
              <div className="relative text-center space-y-4 mb-8 sm:mb-12 w-full min-w-0">
                <div className="h-28 w-28 sm:h-36 sm:h-40 sm:w-40 bg-slate-900 rounded-xl sm:rounded-[3rem] flex items-center justify-center text-lime-400 text-4xl sm:text-6xl font-black mx-auto shadow-md border-4 sm:border-8 border-slate-800 italic shrink-0">
                  {analysis.customer_name ? analysis.customer_name.slice(0, 2).toUpperCase() : "??"}
                </div>
                <div className="space-y-1 min-w-0">
                   <h2 className="text-xl sm:text-3xl font-black uppercase italic tracking-tight text-slate-900 leading-tight truncate px-2">{analysis.customer_name}</h2>
                   <p className="text-[9px] sm:text-[10px] font-mono text-slate-400 uppercase tracking-wider bg-slate-50 px-3 py-1 rounded-full inline-block">ID: #{customerId}</p>
                </div>
              </div>

              {/* INTEGRITY GAUGE */}
              <div className="relative pt-6 sm:pt-8 border-t border-slate-100 w-full flex flex-col items-center">
                 <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-wider mb-6 sm:mb-8 italic">Credibility Score</p>
                 <div className="relative w-44 h-44 sm:w-52 sm:h-52 md:w-56 md:h-56 shrink-0">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 224 224">
                       <circle cx="112" cy="112" r="95" stroke="currentColor" strokeWidth="16" fill="transparent" className="text-slate-50" />
                       <motion.circle 
                         cx="112" cy="112" r="95" stroke="currentColor" strokeWidth="16" fill="transparent" 
                         strokeDasharray={596.9}
                         initial={{ strokeDashoffset: 596.9 }}
                         animate={{ strokeDashoffset: 596.9 - (596.9 * trustPercentage) / 100 }}
                         transition={{ duration: 1.2, ease: "easeOut" }}
                         className={isHighRisk ? "text-red-500" : analysis.risk_level === "MEDIUM" ? "text-amber-500" : "text-lime-500"}
                       />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center min-w-0">
                       <span className="text-5xl sm:text-6xl md:text-7xl font-black italic tracking-tighter text-slate-900 leading-none">{trustPercentage}</span>
                       <span className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-wider pt-1.5">Trust Weight</span>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* 03. RIGHT PANEL: CORE METRIC DASHBOARD */}
        <div className="col-span-12 lg:col-span-8 space-y-6 sm:space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <MetricBox 
                label="Credit Limit" 
                value={`₹${analysis.credit_limit.toLocaleString('en-IN')}`} 
                sub="Maximum Approved Limit" 
                icon={<Wallet size={18} />} color="slate" 
              />
              <MetricBox 
                label="Credit Utilization" 
                value={`${analysis.credit_utilization_percent}%`} 
                sub={`₹${((analysis.credit_utilization_percent / 100) * analysis.credit_limit).toLocaleString('en-IN')} Currently Used`} 
                icon={<TrendingUp size={18} />} color={analysis.credit_utilization_percent > 80 ? "red" : "blue"} 
              />
              <MetricBox 
                label="Total Billing Lines" 
                value={analysis.total_invoices} 
                sub="Lifetime Issued Invoices" 
                icon={<BarChart3 size={18} />} color="slate" 
              />
              <MetricBox 
                label="Payment Delay Average" 
                value={`${analysis.average_delay_days} Days`} 
                sub={`${analysis.delayed_invoices} Overdue Invoices`} 
                icon={<Activity size={18} />} color={analysis.average_delay_days > 7 ? "red" : "lime"} 
              />
              <MetricBox 
                label="Installment Consistency" 
                value={analysis.installment_pattern_count} 
                sub="Segmented Repayments" 
                icon={<Layers size={18} />} color="blue" 
              />
              <MetricBox 
                label="Risk Evaluation" 
                value={analysis.risk_score} 
                sub={`Category: ${analysis.risk_level} RISK`} 
                icon={<ShieldAlert size={18} />} color={isHighRisk ? "red" : "lime"} 
              />
            </div>

            {/* 04. AI AUTOMATED RISK ADVISORY CARD */}
            <div className="bg-slate-900 rounded-xl sm:rounded-[2.5rem] md:rounded-[4rem] p-5 sm:p-8 md:p-12 text-white shadow-xl relative overflow-hidden border border-white/5">
              <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none hidden md:block">
                <BrainCircuit size={180} className="text-lime-400" />
              </div>
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 sm:mb-12 md:mb-16 gap-4 relative z-10 w-full">
                <div className="space-y-1">
                   <h3 className="text-xl sm:text-2xl font-black uppercase italic tracking-tight flex items-center gap-2.5">
                      <ShieldAlert size={24} className={isHighRisk ? "text-red-500 shrink-0" : "text-lime-400 shrink-0"} /> AI Credit Analysis
                   </h3>
                   <p className="text-[9px] sm:text-[10px] font-black text-slate-500 uppercase tracking-wider">Automated Settlement Advisory Policy</p>
                </div>
                <div className={`px-4 sm:px-6 h-9 flex items-center justify-center border-2 rounded-xl text-[10px] font-black uppercase tracking-wider shrink-0 ${isHighRisk ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-lime-500/10 border-lime-500/30 text-lime-400'}`}>
                   RISK RANK: {analysis.risk_level}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14 relative z-10 items-stretch">
                 <div className="space-y-4 flex flex-col justify-between min-w-0">
                    <p className="text-[9px] sm:text-[10px] font-black text-slate-500 uppercase tracking-wider block ml-0.5">Outstanding Balance</p>
                    <div className="min-w-0 flex-1 flex flex-col justify-center">
                      <p className={`text-4xl sm:text-6xl md:text-7xl font-black italic tracking-tight tabular-nums leading-none truncate ${analysis.outstanding > 0 ? 'text-white' : 'text-lime-400'}`}>
                        ₹{analysis.outstanding.toLocaleString('en-IN')}
                      </p>
                      <div className="mt-6 flex items-center gap-3 w-full">
                         <div className="h-1.5 flex-1 rounded-full bg-white/5 overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }} 
                              animate={{ width: `${Math.min(100, (analysis.outstanding / Math.max(1, analysis.credit_limit)) * 100)}%` }} 
                              className={`h-full ${isHighRisk ? 'bg-red-500' : 'bg-lime-400'}`}
                            />
                         </div>
                         <span className="text-[9px] sm:text-[10px] font-black text-slate-500 italic uppercase tracking-wide shrink-0">Exposure Ratio</span>
                      </div>
                    </div>
                 </div>

                 {/* DECISION MATRIX */}
                 <div className="space-y-4 sm:space-y-5 flex flex-col justify-center border-t border-white/5 md:border-none pt-6 md:pt-0">
                    <p className="text-[9px] sm:text-[10px] font-black text-slate-500 uppercase tracking-wider block ml-0.5">Policy Decisions</p>
                    <div className="space-y-3.5 sm:space-y-4 font-semibold">
                       <AdvisoryRow text={isHighRisk ? "CREDIT EXTENSION SUSPENDED" : "ELIGIBLE FOR LIMIT INCREMENT"} success={!isHighRisk} />
                       <AdvisoryRow text={analysis.average_delay_days < 5 ? "EXCELLENT REPAYMENT VELOCITY" : "SUBOPTIMAL COLLECTION SPEED"} success={analysis.average_delay_days < 5} />
                       <AdvisoryRow text={analysis.credit_utilization_percent < 60 ? "NOMINAL CAPITAL EXPOSURE" : "HIGH BALANCES OUTSTANDING"} success={analysis.credit_utilization_percent < 60} />
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
/* ATOMIC METRIC DISPLAY CONTAINERS */
/* -------------------------------------------------------------------------- */

interface MetricBoxProps {
  label: string;
  value: string | number;
  sub: string;
  icon: React.ReactNode;
  color: "slate" | "blue" | "lime" | "red";
}

function MetricBox({ label, value, sub, icon, color }: MetricBoxProps) {
  const variants = {
    slate: "bg-slate-50/50 border-slate-100/80",
    blue: "bg-blue-50/40 border-blue-100/80",
    lime: "bg-lime-50/40 border-lime-100/80",
    red: "bg-red-50/40 border-red-100/80",
  };
  
  const iconColors = {
    slate: "text-slate-400 bg-white",
    blue: "text-blue-600 bg-white",
    lime: "text-lime-600 bg-white",
    red: "text-red-500 bg-white",
  };

  return (
    <motion.div 
      whileHover={{ y: -3 }} 
      className={`p-4 sm:p-6 md:p-8 border rounded-xl sm:rounded-[2rem] md:rounded-[2.5rem] flex items-center gap-4 sm:gap-6 transition-all hover:bg-white hover:shadow-sm w-full min-w-0 ${variants[color]}`}
    >
       <div className={`h-11 w-11 sm:h-14 sm:w-14 rounded-xl flex items-center justify-center shadow-sm border border-slate-100 shrink-0 ${iconColors[color]}`}>
         {icon}
       </div>
       <div className="space-y-1 min-w-0 flex-1">
          <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-slate-400 truncate">{label}</p>
          <p className="text-xl sm:text-2xl md:text-3xl font-black italic tracking-tight text-slate-900 leading-none truncate pr-1">{value}</p>
          <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wide mt-1 sm:mt-2 truncate">{sub}</p>
       </div>
    </motion.div>
  );
}

function AdvisoryRow({ text, success }: { text: string, success: boolean }) {
  return (
    <div className="flex items-center gap-3 group/row min-w-0">
       <div className={`h-8 w-8 rounded-lg border flex items-center justify-center shrink-0 transition-colors ${success ? 'border-lime-500/20 bg-lime-500/5 text-lime-400' : 'border-red-500/20 bg-red-500/5 text-red-400'}`}>
          {success ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />}
       </div>
       <span className="text-[11px] sm:text-xs font-black italic uppercase tracking-wider text-slate-300 group-hover/row:text-white transition-colors truncate flex-1">{text}</span>
    </div>
  );
}

function LoadingTerminal({ label }: { label: string }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="relative shrink-0">
        <Loader2 className="animate-spin text-slate-900" size={44} />
        <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-lime-500" size={16} />
      </div>
      <p className="mt-6 font-black text-slate-900 uppercase tracking-wider text-[10px] italic animate-pulse">{label}</p>
    </div>
  );
}

function ErrorState({ id, onRetry }: { id: string, onRetry: () => void }) {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-center">
       <ShieldAlert size={48} className="text-red-500 mb-4 shrink-0" />
       <h1 className="text-lg sm:text-xl font-black uppercase italic tracking-tight text-slate-900">Analysis Loading Interrupted</h1>
       <p className="text-slate-400 font-semibold text-xs max-w-xs mx-auto mt-2 leading-normal">Failed to sync secure credit risk assessment data for account profile #{id}.</p>
       <div className="flex flex-wrap items-center justify-center gap-3 mt-8 w-full">
          <button onClick={onRetry} className="h-10 px-6 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-wider active:scale-[0.98] transition-all shadow-sm">Retry Load</button>
          <Link href="/dashboard/ai/customer" className="h-10 px-6 bg-white border border-slate-200 text-slate-500 hover:text-slate-900 rounded-xl font-black text-[10px] uppercase tracking-wider active:scale-[0.98] transition-all shadow-sm flex items-center justify-center">Go Back</Link>
       </div>
    </div>
  );
}