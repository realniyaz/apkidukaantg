"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Server } from "lucide-react";
import { SaleItem } from "@/types/sales";

interface SaleItemsListProps {
  items: SaleItem[];
}

export default function SaleItemsList({ items }: SaleItemsListProps) {
  return (
    <section className="space-y-3 sm:space-y-4">
      <h3 className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-2 px-2 sm:px-4 italic">
        <Server size={14} className="text-blue-500 shrink-0" /> Added Items
      </h3>

      {!items || items.length === 0 ? (
        <div className="bg-slate-50 rounded-xl sm:rounded-[2.5rem] p-6 sm:p-10 text-center border-2 border-dashed border-slate-200">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">No products added to this order yet</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-100 rounded-xl sm:rounded-[2.5rem] p-2 sm:p-4 shadow-sm">
          <AnimatePresence mode="popLayout">
            {items.map((item, index) => (
              <motion.div 
                key={item.id || index}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-between p-3 sm:p-4 hover:bg-slate-50/50 rounded-xl transition-colors border-b border-slate-50 last:border-0 gap-4"
              >
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-black text-slate-900 truncate tracking-tight">
                    {item.product_name || `Item #${item.product_id}`}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5 sm:mt-1 font-mono">
                    {item.quantity} × ₹{(item.selling_price || 0).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="text-right flex flex-col items-end gap-1 shrink-0">
                  <span className="text-sm font-bold text-slate-900 tabular-nums italic">
                    ₹{((Number(item.quantity) || 0) * (Number(item.selling_price) || 0)).toLocaleString('en-IN')}
                  </span>
                  <span className="text-[8px] font-black text-lime-600 bg-lime-50/60 px-2 py-0.5 rounded-md uppercase tracking-wider font-sans">
                    Saved
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </section>
  );
}