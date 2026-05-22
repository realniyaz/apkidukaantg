"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Server } from "lucide-react";
import { SaleItem } from "@/types/sales";

interface SaleItemsListProps {
  items: SaleItem[];
}

export default function SaleItemsList({ items }: SaleItemsListProps) {
  return (
    <section className="space-y-4">
      <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 flex items-center gap-2 px-4">
        <Server size={14} className="text-blue-500" /> Secured Manifest
      </h3>

      {!items || items.length === 0 ? (
        <div className="bg-slate-50 rounded-[2.5rem] p-10 text-center border-2 border-dashed border-slate-200">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No entities in core database</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-100 rounded-[2.5rem] p-4 shadow-sm">
          <AnimatePresence mode="popLayout">
            {items.map((item, index) => (
              <motion.div 
                key={item.id || index}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-colors border-b border-slate-50 last:border-0"
              >
                <div className="flex flex-col">
                  <span className="text-sm font-black text-slate-900">{item.product_name || `Entity #${item.product_id}`}</span>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Qty: {item.quantity} × ₹{item.selling_price || 0}</span>
                </div>
                <div className="text-right flex flex-col items-end gap-1">
                  <span className="text-sm font-mono font-bold text-slate-900">
                    ₹{((Number(item.quantity) || 0) * (Number(item.selling_price) || 0)).toLocaleString()}
                  </span>
                  <span className="text-[8px] font-black text-lime-500 uppercase tracking-widest bg-lime-50 px-2 py-1 rounded-md">Synced</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </section>
  );
}