"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Trash2, Hash } from "lucide-react";
import { SaleItem } from "@/types/sales";

interface SaleItemRowProps {
  item: SaleItem;
  index: number;
  onUpdate: (index: number, field: keyof SaleItem, value: any) => void;
  onRemove: (index: number) => void;
}

export default function SaleItemRow({ item, index, onUpdate, onRemove }: SaleItemRowProps) {
  // Memoized calculation for the local UI display
  const { lineTotal } = useMemo(() => {
    const qty = Number(item.quantity) || 0;
    const price = Number(item.selling_price) || 0;
    const gstPercent = Number(item.gst_percent) || 0;

    const base = qty * price;
    const gst = (base * gstPercent) / 100;
    
    return {
      lineTotal: base + gst
    };
  }, [item.quantity, item.selling_price, item.gst_percent]);

  // --- 🟢 FIX: Safe formatting to prevent NaN attribute errors in React ---
  const formatValue = (val: any) => {
    if (val === "" || val === null || val === undefined || isNaN(Number(val))) {
      return "";
    }
    return val;
  };

  // Safe number handler to allow smooth backspacing
  const handleNumberInput = (field: keyof SaleItem, value: string) => {
    if (value === "") {
      onUpdate(index, field, ""); // Allow empty string for clean UX
      return;
    }
    const parsed = parseFloat(value);
    if (!isNaN(parsed)) {
      onUpdate(index, field, parsed);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
      className="group relative flex flex-col md:flex-row items-stretch md:items-end gap-4 p-6 bg-white border border-slate-100 rounded-[2rem] hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 mb-4"
    >
      {/* Visual Index Decorator */}
      <div className="absolute -left-3 top-1/2 -translate-y-1/2 h-8 w-8 bg-slate-900 rounded-xl flex items-center justify-center border-4 border-white shadow-lg z-10 hidden md:flex">
        <span className="text-[10px] font-black text-lime-400 font-mono">
          {(index + 1).toString().padStart(2, '0')}
        </span>
      </div>

      {/* Product Description */}
      <div className="flex-[3] space-y-2">
        <label className="text-[9px] font-black uppercase text-slate-400 ml-1 flex items-center gap-1.5 tracking-widest">
          <Hash size={10} strokeWidth={3} /> Uplink Entity Name
        </label>
        <input
          required
          placeholder="Enter product description..."
          className="w-full bg-slate-50 border-2 border-transparent p-4 rounded-2xl text-xs font-bold outline-none focus:border-lime-500 focus:bg-white transition-all placeholder:text-slate-300 shadow-inner"
          value={item.product_name || ""}
          onChange={(e) => onUpdate(index, "product_name", e.target.value)}
        />
      </div>

      {/* Numerical Matrix Controls */}
      <div className="flex-[4] grid grid-cols-3 gap-3">
        {/* Quantity */}
        <div className="space-y-2 text-center">
          <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Qty</label>
          <input
            required
            type="number"
            min="1"
            placeholder="0"
            className="w-full bg-slate-50 border-2 border-transparent p-4 rounded-2xl text-xs font-black outline-none focus:border-lime-500 focus:bg-white transition-all tabular-nums text-center shadow-inner"
            value={formatValue(item.quantity)} // ✅ FIXED
            onChange={(e) => handleNumberInput("quantity", e.target.value)}
          />
        </div>

        {/* Selling Price */}
        <div className="space-y-2">
          <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest flex justify-center gap-1">
            Price (₹)
          </label>
          <input
            required
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            className="w-full bg-slate-50 border-2 border-transparent p-4 rounded-2xl text-xs font-black outline-none focus:border-lime-500 focus:bg-white transition-all tabular-nums text-center shadow-inner"
            value={formatValue(item.selling_price)} // ✅ FIXED
            onChange={(e) => handleNumberInput("selling_price", e.target.value)}
          />
        </div>

        {/* GST % */}
        <div className="space-y-2 text-center">
          <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest flex justify-center gap-1">
            GST %
          </label>
          <input
            type="number"
            min="0"
            placeholder="0"
            className="w-full bg-slate-50 border-2 border-transparent p-4 rounded-2xl text-xs font-black outline-none focus:border-lime-500 focus:bg-white transition-all tabular-nums text-center shadow-inner"
            value={formatValue(item.gst_percent)} // ✅ FIXED
            onChange={(e) => handleNumberInput("gst_percent", e.target.value)}
          />
        </div>
      </div>

      {/* Yield Result (Line Total) */}
      <div className="flex-[1.5] flex flex-col items-center md:items-end justify-end pb-1 space-y-1">
        <span className="text-[8px] font-black text-slate-300 uppercase tracking-tighter italic">Line Yield</span>
        <div className="flex items-baseline gap-1">
          <span className="text-xs font-black text-slate-900 tabular-nums italic">
            ₹{lineTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
        </div>
        <div className="h-1 w-12 bg-slate-100 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: lineTotal > 0 ? '100%' : '0%' }}
            className="h-full bg-lime-400"
          />
        </div>
      </div>

      {/* Terminal Action */}
      <div className="flex items-end pb-1.5 pl-2">
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="h-10 w-10 flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all active:scale-90"
          title="Void Item"
        >
          <Trash2 size={16} strokeWidth={2.5} />
        </button>
      </div>
    </motion.div>
  );
}