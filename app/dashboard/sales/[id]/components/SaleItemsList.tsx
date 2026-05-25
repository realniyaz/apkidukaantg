"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Server, Trash2, IndianRupee } from "lucide-react";
import { SaleItem } from "@/types/sales";

interface SaleItemsListProps {
  items: SaleItem[];
  onRemove?: (id: string | number) => void;
}

export default function SaleItemsList({ items, onRemove }: SaleItemsListProps) {
  return (
    <section className="space-y-4 w-full">
      {/* SECTION HEADER */}
      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2 px-1 italic">
        <Server size={14} className="text-blue-500" /> Current Bill
      </h3>

      {/* COLUMN HEADERS - Perfectly aligned to grid columns */}
      <div className="grid grid-cols-12 gap-2 px-4 py-3 text-[9px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">
        <div className="col-span-6">Product</div>
        <div className="col-span-2 text-center">Qty</div>
        <div className="col-span-2 text-right">Price</div>
        <div className="col-span-2 text-right">Total</div>
      </div>

      {!items || items.length === 0 ? (
        <div className="bg-slate-50/50 rounded-2xl p-8 text-center border border-slate-100 border-dashed">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No products in cart</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
          <AnimatePresence mode="popLayout">
            {items.map((item, index) => (
              <motion.div 
                key={item.id ?? index}
                layout
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="grid grid-cols-12 gap-2 px-4 py-4 items-center border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors"
              >
                {/* Product Name */}
                <div className="col-span-6 min-w-0">
                  <p className="text-sm font-black text-slate-900 truncate tracking-tight uppercase italic">
                    {item.product_name || `Item #${item.product_id}`}
                  </p>
                </div>
                
                {/* Quantity */}
                <div className="col-span-2 text-center text-sm font-bold text-slate-600 tabular-nums">
                  {item.quantity}
                </div>
                
                {/* Price */}
                <div className="col-span-2 text-right text-sm font-bold text-slate-600 tabular-nums">
                  ₹{Number(item.selling_price || 0).toLocaleString('en-IN')}
                </div>
                
                {/* Total & Action */}
                <div className="col-span-2 text-right flex items-center justify-end gap-3">
                  <span className="text-sm font-black text-slate-900 tabular-nums italic">
                    ₹{(Number(item.quantity || 0) * Number(item.selling_price || 0)).toLocaleString('en-IN')}
                  </span>
                  {onRemove && item.id !== undefined && (
                    <button 
                      onClick={() => onRemove(item.id!)}
                      className="text-slate-300 hover:text-red-500 transition-colors p-1"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </section>
  );
}