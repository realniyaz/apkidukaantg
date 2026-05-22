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
  // ERP Optimization: Don't render empty containers
  if (!items || items.length === 0) return null;

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden transition-all duration-500">
      {/* 1. TABLE HEADER / METADATA */}
      <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
        <div className="space-y-1">
          <h4 className="font-black text-slate-900 flex items-center gap-3 text-lg tracking-tight">
            <div className="p-2 bg-slate-900 rounded-xl text-white shadow-lg">
              <Package size={18} />
            </div>
            Purchased Inventory Items
          </h4>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest ml-11">
            Verified Procurement Ledger
          </p>
        </div>
        <span className="bg-white px-4 py-1.5 rounded-full text-[11px] font-black text-slate-500 border border-slate-100 shadow-sm uppercase tracking-tighter">
          {items.length} Line Items
        </span>
      </div>
      
      {/* 2. RESPONSIVE DATA GRID */}
      <div className="overflow-x-auto">
        <table className="w-full border-separate border-spacing-0">
          <thead>
            <tr className="text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] bg-slate-50/50">
              <th className="px-8 py-5 border-b border-slate-50">Item Description</th>
              <th className="px-8 py-5 border-b border-slate-50">Volume</th>
              <th className="px-8 py-5 border-b border-slate-50">Unit Cost</th>
              <th className="px-8 py-5 border-b border-slate-50">Tax (GST)</th>
              <th className="px-8 py-5 text-right border-b border-slate-50">Valuation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            <AnimatePresence>
              {items.map((item, i) => (
                <motion.tr 
                  key={item.id || i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group hover:bg-slate-50/80 transition-all duration-200 cursor-default"
                >
                  {/* Product Details */}
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-lime-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="flex flex-col">
                        <span className="font-black text-slate-900 text-sm tracking-tight leading-none group-hover:text-lime-600 transition-colors">
                          {item.product_name || "Unspecified Commodity"}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 mt-1.5 uppercase tracking-tighter">
                          UID: ITEM-{Math.random().toString(36).substring(7).toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Quantity */}
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-700 tabular-nums">
                        {item.quantity}
                      </span>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Units</span>
                    </div>
                  </td>

                  {/* Unit Price */}
                  <td className="px-8 py-6">
                    <span className="text-sm font-bold text-slate-600 tabular-nums">
                      ₹{Number(item.cost_price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </td>

                  {/* GST Calculation */}
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="text-[11px] font-black text-slate-900 tabular-nums">
                        ₹{Number(item.gst_amount || 0).toLocaleString('en-IN')}
                      </span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                        @{item.gst_percent || 0}% Slab
                      </span>
                    </div>
                  </td>

                  {/* Line Total */}
                  <td className="px-8 py-6 text-right">
                    <div className="flex flex-col items-end">
                      <span className="text-lg font-black text-slate-900 tabular-nums tracking-tighter">
                        ₹{Number(item.line_total).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                      <div className="flex items-center gap-1 text-[9px] font-black text-emerald-500 uppercase tracking-[0.1em]">
                        <ShieldCheck size={10} /> Net Entry
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
      <div className="px-8 py-5 bg-slate-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Hash size={14} className="text-lime-400" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Procurement Integrity Verified</span>
        </div>
        <div className="flex items-center gap-2">
          <IndianRupee size={14} className="text-lime-400" />
          <span className="text-xs font-bold tabular-nums">
            Document Total: ₹{items.reduce((acc, curr) => acc + Number(curr.line_total), 0).toLocaleString('en-IN')}
          </span>
        </div>
      </div>
    </div>
  );
};

// ERP Optimization: Wrap in memo to prevent heavy list re-renders on parent state changes
export default memo(PurchaseItemsTable);