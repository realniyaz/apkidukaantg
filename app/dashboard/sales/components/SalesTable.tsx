"use client";

import { motion } from "framer-motion";
import { 
  User, AlertCircle, Phone, 
  Timer, CheckCircle2, Shield, Receipt
} from "lucide-react";
import { Sale } from "@/types/sales";

const STATUS_CONFIG: Record<string, { color: string; icon: any; label: string }> = {
  "POSTED": { color: "text-blue-500", icon: Timer, label: "Awaiting" },
  "DRAFT": { color: "text-slate-400", icon: Shield, label: "Draft" },
  "CANCELLED": { color: "text-red-500", icon: AlertCircle, label: "Void" },
  "SETTLED": { color: "text-lime-500", icon: CheckCircle2, label: "Settled" },
};

export default function SalesTable({ sales }: { sales: Sale[] }) {
  if (!sales?.length) return <EmptyState />;

  return (
    <div className="w-full overflow-hidden bg-white rounded-[2rem] border border-slate-100 shadow-sm relative z-10">
      <div className="overflow-x-auto">
        <table className="w-full border-separate border-spacing-0">
          <thead>
            <tr className="bg-slate-50/80 backdrop-blur-md">
              <th className="px-8 py-6 text-left text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 border-b border-slate-100 uppercase">Uplink Ref</th>
              {/* 🟢 HEADER RENAMED */}
              <th className="px-8 py-6 text-left text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 border-b border-slate-100 uppercase">Client Identity</th>
              <th className="px-8 py-6 text-left text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 border-b border-slate-100 uppercase">Yield Analysis</th>
              <th className="px-8 py-6 text-left text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 border-b border-slate-100 uppercase">Status Vector</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-50">
            {sales.map((sale, idx) => {
              const total = Number(sale.total_amount) || 0;
              const paid = Number(sale.paid_amount) || 0;
              const payPercent = total > 0 ? Math.min((paid / total) * 100, 100) : 0;
              const isFullyPaid = total > 0 && payPercent >= 100;

              return (
                <motion.tr
                  layout
                  key={sale.id || idx}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.02 }}
                  className="group hover:bg-slate-50/50 transition-colors cursor-default"
                >
                  {/* INVOICE REF */}
                  <td className="px-8 py-5">
                    <div className="flex flex-col">
                      <span className="font-mono text-[11px] font-bold text-slate-900 tracking-tighter uppercase">
                        {sale.invoice_number || "DRAFT_NODE"}
                      </span>
                      <span className="text-[8px] text-slate-400 font-black uppercase tracking-widest mt-1">
                        {sale.created_at ? sale.created_at : "Processing..."}
                      </span>
                    </div>
                  </td>

                  {/* 🟢 CLIENT IDENTITY: Shows Name & Phone */}
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-2xl bg-slate-900 flex items-center justify-center border border-slate-800 shadow-lg group-hover:shadow-lime-400/20 group-hover:border-lime-400 transition-all duration-500">
                        <User size={14} className="text-lime-400" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-slate-900 text-sm font-black tracking-tight leading-none mb-1 group-hover:text-lime-600 transition-colors">
                          {sale.customer_name || "Unnamed Client"}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold tracking-tighter flex items-center gap-1.5 font-mono italic">
                          <Phone size={10} className="text-slate-300" /> {sale.customer_phone || "No Uplink Ref"}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* YIELD ANALYSIS */}
                  <td className="px-8 py-5">
                    <div className="flex flex-col">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-slate-900 text-base font-black tabular-nums tracking-tighter italic">
                          ₹{total.toLocaleString("en-IN")}
                        </span>
                        <span className={`text-[9px] font-black ${isFullyPaid ? 'text-lime-500' : 'text-amber-500'}`}>
                          {payPercent.toFixed(0)}%
                        </span>
                      </div>
                      <div className="h-1 w-24 bg-slate-100 rounded-full mt-2 overflow-hidden shadow-inner">
                         <motion.div 
                           initial={{ width: 0 }}
                           animate={{ width: `${payPercent}%` }}
                           className={`h-full transition-all ${isFullyPaid ? 'bg-lime-400 shadow-[0_0_10px_#bef264]' : 'bg-amber-400'}`} 
                         />
                      </div>
                    </div>
                  </td>

                  {/* STATUS VECTOR */}
                  <td className="px-8 py-5">
                    <StatusPill 
                      status={sale.status || "DRAFT"} 
                      isFullyPaid={isFullyPaid} 
                    />
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* --- SUB-COMPONENTS --- */

function StatusPill({ status, isFullyPaid }: { status: string, isFullyPaid: boolean }) {
  const normalizedStatus = status.toUpperCase();
  const displayStatus = (normalizedStatus === "POSTED" && isFullyPaid) ? "SETTLED" : normalizedStatus;
  const config = STATUS_CONFIG[displayStatus] || STATUS_CONFIG["DRAFT"];
  const Icon = config.icon;

  return (
    <div className={`flex items-center gap-2 ${config.color}`}>
      <div className={`h-1.5 w-1.5 rounded-full animate-pulse ${config.color.replace('text', 'bg')}`} />
      <Icon size={12} strokeWidth={3} />
      <span className="text-[10px] font-black uppercase tracking-widest italic leading-none pt-0.5">
        {config.label}
      </span>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-40 bg-white rounded-[3.5rem] border border-dashed border-slate-200">
      <div className="h-16 w-16 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-6 border border-slate-100">
        <Receipt size={32} className="text-slate-200" />
      </div>
      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 animate-pulse">Awaiting Neural Link...</p>
    </div>
  );
}