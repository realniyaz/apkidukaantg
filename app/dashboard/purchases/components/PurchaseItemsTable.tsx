"use client";

import { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Package, Hash, IndianRupee, ShieldCheck } from "lucide-react";

/* ------------------------------------------------ */
/* TYPES (Aligned with PurchaseItemResponse schema) */
/* ------------------------------------------------ */
interface PurchaseItem {
  id: number;
  product_name: string;
  quantity: number;
  cost_price: number;
  gst_percent: number;
  gst_amount: number;
  line_total: number;
}

const PurchaseItemsTable = ({ items }: { items: PurchaseItem[] }) => {
  // Prevent empty container footprints completely
  if (!items || items.length === 0) return null;

  return (
    <div className="bg-white rounded-xl sm:rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden w-full">
      {/* 1. TABLE HEADER / METADATA */}
      <div className="px-4 sm:px-8 py-4 sm:py-6 border-b border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/40">
        <div className="space-y-1">
          <h4 className="font-black text-slate-900 flex items-center gap-2.5 text-base sm:text-lg tracking-tight uppercase italic">
            <div className="p-2 bg-slate-900 rounded-lg sm:rounded-xl text-white shadow-sm shrink-0">
              <Package size={16} />
            </div>
            Purchased Products
          </h4>
          <p className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-wider sm:ml-10">
            Verified Stock History Ledger
          </p>
        </div>
        <span className="w-fit bg-white px-3.5 py-1 rounded-full text-[10px] sm:text-[11px] font-black text-slate-500 border border-slate-100 shadow-sm uppercase tracking-wider shrink-0">
          {items.length} {items.length === 1 ? 'Item' : 'Items'}
        </span>
      </div>
      
      {/* 2. RESPONSIVE DATA GRID */}
      <div className="w-full overflow-x-auto">
        <table className="w-full border-separate border-spacing-0 min-w-[700px]">
          <thead>
            <tr className="text-left text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-wider bg-slate-50/50">
              <th className="px-5 sm:px-8 py-4 border-b border-slate-50">Product Details</th>
              <th className="px-5 sm:px-8 py-4 border-b border-slate-50">Quantity</th>
              <th className="px-5 sm:px-8 py-4 border-b border-slate-50">Cost Price</th>
              <th className="px-5 sm:px-8 py-4 border-b border-slate-50">Tax Breakdown</th>
              <th className="px-5 sm:px-8 py-4 text-right border-b border-slate-50">Total Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 font-semibold text-slate-700">
            <AnimatePresence mode="popLayout">
              {items.map((item, i) => (
                <motion.tr 
                  key={item.id || i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.02 }}
                  className="group hover:bg-slate-50/40 transition-colors cursor-default"
                >
                  {/* Product Details */}
                  <td className="px-5 sm:px-8 py-4 sm:py-5">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-1.5 w-1.5 rounded-full bg-lime-500 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block" />
                      <div className="flex flex-col min-w-0">
                        <span className="font-black text-slate-900 text-sm tracking-tight leading-none truncate group-hover:text-lime-600 transition-colors">
                          {item.product_name || "Unnamed Product"}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 mt-1.5 uppercase tracking-tighter">
                          ID: PRD-{item.id ? item.id : 'NEW'}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Quantity */}
                  <td className="px-5 sm:px-8 py-4 sm:py-5">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-sm font-bold text-slate-700 tabular-nums">
                        {item.quantity}
                      </span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">units</span>
                    </div>
                  </td>

                  {/* Unit Price */}
                  <td className="px-5 sm:px-8 py-4 sm:py-5">
                    <span className="text-sm font-bold text-slate-600 tabular-nums">
                      ₹{Number(item.cost_price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </td>

                  {/* GST Calculation */}
                  <td className="px-5 sm:px-8 py-4 sm:py-5">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-900 tabular-nums">
                        ₹{Number(item.gst_amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                        {item.gst_percent || 0}% Rate
                      </span>
                    </div>
                  </td>

                  {/* Line Total */}
                  <td className="px-5 sm:px-8 py-4 sm:py-5 text-right">
                    <div className="flex flex-col items-end">
                      <span className="text-sm sm:text-base font-black text-slate-900 tabular-nums tracking-tight italic">
                        ₹{Number(item.line_total).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                      <div className="flex items-center gap-1 text-[9px] font-black text-emerald-600 uppercase tracking-wide mt-0.5">
                        <ShieldCheck size={10} className="shrink-0" /> Saved
                      </div>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* 3. FOOTER / SUMMARY INDICATOR */}
      <div className="px-4 sm:px-8 py-4 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
        <div className="flex items-center gap-2">
          <Hash size={14} className="text-lime-400 shrink-0" />
          <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-slate-400">Inventory Records Completed</span>
        </div>
        <div className="flex items-center gap-2 sm:justify-end">
          <IndianRupee size={14} className="text-lime-400 shrink-0" />
          <span className="text-xs sm:text-sm font-bold tabular-nums">
            Grand Total: ₹{items.reduce((acc, curr) => acc + Number(curr.line_total), 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default memo(PurchaseItemsTable);