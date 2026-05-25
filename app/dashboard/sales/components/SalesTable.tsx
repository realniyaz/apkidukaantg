"use client";

import { motion } from "framer-motion";
import { 
  User, AlertCircle, Phone, 
  Timer, CheckCircle2, Shield, Receipt
} from "lucide-react";
import { Sale } from "@/types/sales";

const STATUS_CONFIG: Record<string, { color: string; icon: any; label: string }> = {
  "POSTED": { color: "text-blue-500", icon: Timer, label: "Pending" },
  "DRAFT": { color: "text-slate-400", icon: Shield, label: "Draft" },
  "CANCELLED": { color: "text-red-500", icon: AlertCircle, label: "Void" },
  "SETTLED": { color: "text-lime-500", icon: CheckCircle2, label: "Settled" },
};

export default function SalesTable({ sales }: { sales: Sale[] }) {
  if (!sales?.length) return <EmptyState />;

  return (
    <div className="w-full overflow-hidden bg-white rounded-xl sm:rounded-[2rem] border border-slate-100 shadow-sm relative z-10">
      {/* Scroll isolation layer block to safely shield small screens from column crushing */}
      <div className="w-full overflow-x-auto">
        <table className="w-full border-separate border-spacing-0 min-w-[650px]">
          <thead>
            <tr className="bg-slate-50/80 backdrop-blur-md text-[9px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-100">
              <th className="px-6 sm:px-8 py-4 sm:py-6 text-left">Invoice Ref</th>
              <th className="px-6 sm:px-8 py-4 sm:py-6 text-left">Customer Profile</th>
              <th className="px-6 sm:px-8 py-4 sm:py-6 text-left">Payment Status</th>
              <th className="px-6 sm:px-8 py-4 sm:py-6 text-left">Order Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-50 font-semibold text-slate-700">
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
                  transition={{ delay: idx * 0.01 }}
                  className="group hover:bg-slate-50/40 transition-colors cursor-default"
                >
                  {/* INVOICE REF */}
                  <td className="px-6 sm:px-8 py-4">
                    <div className="flex flex-col">
                      <span className="font-mono text-xs font-bold text-slate-900 uppercase tracking-tight">
                        {sale.invoice_number || "Draft Invoice"}
                      </span>
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                        {sale.created_at ? sale.created_at : "Processing..."}
                      </span>
                    </div>
                  </td>

                  {/* CLIENT IDENTITY: Name & Phone */}
                  <td className="px-6 sm:px-8 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-xl bg-slate-900 flex items-center justify-center border border-slate-800 shadow-sm shrink-0">
                        <User size={14} className="text-lime-400" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-slate-900 text-sm font-bold tracking-tight truncate line-clamp-1">
                          {sale.customer_name || "Walk-in Customer"}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium tracking-wide flex items-center gap-1 font-mono italic">
                          <Phone size={10} className="text-slate-300 shrink-0" /> {sale.customer_phone || "No Mobile Added"}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* PAYMENT PROGRESS ANALYSIS */}
                  <td className="px-6 sm:px-8 py-4">
                    <div className="flex flex-col justify-center">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-slate-900 text-sm font-black tabular-nums tracking-tight italic">
                          ₹{total.toLocaleString("en-IN")}
                        </span>
                        <span className={`text-[9px] font-bold ${isFullyPaid ? 'text-lime-600' : 'text-amber-600'}`}>
                          {payPercent.toFixed(0)}%
                        </span>
                      </div>
                      <div className="h-1 w-20 bg-slate-100 rounded-full mt-1.5 overflow-hidden shadow-inner">
                         <motion.div 
                           initial={{ width: 0 }}
                           animate={{ width: `${payPercent}%` }}
                           className={`h-full transition-all ${isFullyPaid ? 'bg-lime-500 shadow-[0_0_8px_rgba(132,204,22,0.3)]' : 'bg-amber-400'}`} 
                         />
                      </div>
                    </div>
                  </td>

                  {/* STATUS PILL VECTORS */}
                  <td className="px-6 sm:px-8 py-4">
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
    <div className={`flex items-center gap-1.5 ${config.color} shrink-0`}>
      <div className={`h-1 w-1 rounded-full animate-pulse ${config.color.replace('text', 'bg')}`} />
      <Icon size={12} strokeWidth={2.5} />
      <span className="text-[10px] font-black uppercase tracking-wider italic leading-none pt-0.5">
        {config.label}
      </span>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 sm:py-40 bg-white rounded-xl sm:rounded-[3.5rem] border border-dashed border-slate-200 p-4 text-center">
      <div className="h-14 w-14 sm:h-16 sm:w-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 border border-slate-100 shrink-0">
        <Receipt size={28} className="text-slate-200" />
      </div>
      <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 animate-pulse">Syncing sales data stream...</p>
    </div>
  );
}