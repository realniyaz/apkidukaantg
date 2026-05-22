"use client";

import { memo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, ChevronRight, User, ArrowUpRight, ReceiptText } from "lucide-react";
import StatusBadge from "./StatusBadge";

// Optimized Types matching your backend schema
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
  
  // 1. Empty State Optimization
  if (!purchases || purchases.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-24 bg-white rounded-[2.5rem] border border-dashed border-slate-200 m-4"
      >
        <div className="bg-slate-50 p-5 rounded-[1.5rem] mb-4 text-slate-300">
          <ReceiptText size={40} strokeWidth={1.5} />
        </div>
        <h3 className="text-slate-900 font-black text-lg tracking-tight">No Procurement Records</h3>
        <p className="text-slate-400 text-sm max-w-[280px] text-center mt-1 font-medium">
          Start by creating your first purchase voucher to track inventory growth.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="w-full overflow-hidden bg-white rounded-[2.5rem] border border-slate-100 shadow-sm">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full border-separate border-spacing-0">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="sticky top-0 z-10 border-b border-slate-100 px-8 py-5 text-left text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">
                Voucher Ref
              </th>
              <th className="sticky top-0 z-10 border-b border-slate-100 px-8 py-5 text-left text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">
                Entity
              </th>
              <th className="sticky top-0 z-10 border-b border-slate-100 px-8 py-5 text-left text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">
                Valuation
              </th>
              <th className="sticky top-0 z-10 border-b border-slate-100 px-8 py-5 text-left text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">
                Lifecycle
              </th>
              <th className="sticky top-0 z-10 border-b border-slate-100 px-8 py-5 text-left text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">
                Filing Date
              </th>
              <th className="sticky top-0 z-10 border-b border-slate-100 px-8 py-5 text-right text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-50">
            <AnimatePresence mode="popLayout">
              {purchases.map((p, idx) => (
                <motion.tr 
                  key={p.id} 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.2, delay: idx * 0.04 }}
                  className="group hover:bg-slate-50/60 transition-colors duration-200 cursor-default"
                >
                  {/* Voucher Reference */}
                  <td className="px-8 py-6">
                    <Link 
                      href={`/dashboard/purchases/${p.id}`} 
                      className="inline-flex items-center font-mono text-[13px] font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg group-hover:bg-slate-900 group-hover:text-white transition-all"
                    >
                      {p.purchase_number}
                    </Link>
                  </td>

                  {/* Supplier Entity */}
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-2xl bg-lime-50 text-lime-600 flex items-center justify-center border border-lime-100 shadow-sm transition-transform group-hover:scale-110">
                        <User size={16} />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-black text-slate-900 text-sm tracking-tight leading-tight">
                          {p.supplier_name || "Direct Procurement"}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                          Verified Vendor
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Valuation/Amount */}
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="text-slate-900 font-black text-sm tabular-nums">
                        ₹{p.total_amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-500 uppercase mt-0.5">
                        {p.total_amount === p.paid_amount ? 'Fully Settled' : `₹${(p.total_amount - p.paid_amount).toLocaleString()} Due`}
                      </span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-8 py-6">
                    <StatusBadge status={p.status} />
                  </td>

                  {/* Date Formatting */}
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="text-slate-700 text-sm font-bold tracking-tight">
                        {new Date(p.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">
                        {new Date(p.created_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-8 py-6 text-right">
                    <Link 
                      href={`/dashboard/purchases/${p.id}`}
                      className="inline-flex items-center justify-center h-10 w-10 rounded-2xl bg-white border border-slate-100 text-slate-400 hover:border-slate-900 hover:text-slate-900 hover:shadow-lg hover:shadow-slate-200/50 transition-all active:scale-90"
                    >
                      <ArrowUpRight size={20} />
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