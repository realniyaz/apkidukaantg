"use client";

import { memo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, User, ReceiptText } from "lucide-react";
import StatusBadge from "./StatusBadge";

interface Purchase {
  id: number;
  purchase_number: string;
  supplier_name: string;
  total_amount: number;
  paid_amount: number;
  status: string;
  created_at: string;
}

const PurchaseTable = ({ purchases }: { purchases: Purchase[] }) => {
  
  // 1. Empty State Framework
  if (!purchases || purchases.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-20 bg-white rounded-xl sm:rounded-[2rem] border border-dashed border-slate-200 p-4 m-2 text-center"
      >
        <div className="bg-slate-50 p-4 rounded-xl mb-4 text-slate-300 shrink-0">
          <ReceiptText size={32} strokeWidth={2} />
        </div>
        <h3 className="text-slate-900 font-black text-base tracking-tight uppercase italic">No Purchase Records</h3>
        <p className="text-slate-400 text-xs max-w-[280px] mx-auto mt-1 font-semibold leading-normal">
          Start by recording your first purchase order to log new inventory arrivals.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="w-full overflow-hidden bg-white rounded-xl sm:rounded-[2rem] border border-slate-100 shadow-sm">
      <div className="w-full overflow-x-auto">
        <table className="w-full border-separate border-spacing-0 min-w-[750px]">
          <thead>
            <tr className="bg-slate-50/50 text-[9px] sm:text-[10px] uppercase tracking-wider font-black text-slate-400 border-b border-slate-100">
              <th className="sticky top-0 z-10 px-6 sm:px-8 py-4 text-left">Order Ref</th>
              <th className="sticky top-0 z-10 px-6 sm:px-8 py-4 text-left">Supplier Name</th>
              <th className="sticky top-0 z-10 px-6 sm:px-8 py-4 text-left">Total Amount</th>
              <th className="sticky top-0 z-10 px-6 sm:px-8 py-4 text-left">Status</th>
              <th className="sticky top-0 z-10 px-6 sm:px-8 py-4 text-left">Created At</th>
              <th className="sticky top-0 z-10 px-6 sm:px-8 py-4 text-right">View</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-50 font-semibold text-slate-700">
            <AnimatePresence mode="popLayout">
              {purchases.map((p, idx) => (
                <motion.tr 
                  key={p.id} 
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.15, delay: idx * 0.02 }}
                  className="group hover:bg-slate-50/40 transition-colors duration-150 cursor-default"
                >
                  {/* Voucher Reference */}
                  <td className="px-6 sm:px-8 py-4">
                    <Link 
                      href={`/dashboard/purchases/${p.id}`} 
                      className="inline-flex items-center font-mono text-xs font-bold text-slate-500 bg-slate-50 px-2.5 py-1 rounded-md group-hover:bg-slate-900 group-hover:text-white transition-all tracking-tight"
                    >
                      {p.purchase_number}
                    </Link>
                  </td>

                  {/* Supplier Entity */}
                  <td className="px-6 sm:px-8 py-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-8 w-8 rounded-xl bg-lime-50 text-lime-600 flex items-center justify-center border border-lime-100/50 shadow-sm shrink-0">
                        <User size={14} />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-black text-slate-900 text-sm tracking-tight leading-none truncate">
                          {p.supplier_name || "Direct Purchase"}
                        </span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-1">
                          Verified Vendor
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Valuation/Amount */}
                  <td className="px-6 sm:px-8 py-4">
                    <div className="flex flex-col">
                      <span className="text-slate-900 font-black text-sm tabular-nums tracking-tight">
                        ₹{p.total_amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wide mt-0.5">
                        {p.total_amount === p.paid_amount ? 'Fully Settled' : `₹${(p.total_amount - p.paid_amount).toLocaleString('en-IN')} Due`}
                      </span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-6 sm:px-8 py-4">
                    <StatusBadge status={p.status} />
                  </td>

                  {/* Date Formatting */}
                  <td className="px-6 sm:px-8 py-4">
                    <div className="flex flex-col">
                      <span className="text-slate-700 text-sm font-bold tracking-tight">
                        {new Date(p.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mt-0.5 font-mono">
                        {new Date(p.created_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-6 sm:px-8 py-4 text-right">
                    <Link 
                      href={`/dashboard/purchases/${p.id}`}
                      className="inline-flex items-center justify-center h-9 w-9 rounded-xl bg-white border border-slate-100 text-slate-400 hover:border-slate-900 hover:text-slate-900 hover:shadow-sm transition-all active:scale-95 shrink-0"
                    >
                      <ArrowUpRight size={16} />
                    </Link>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default memo(PurchaseTable);