"use client";

import { Package, Plus } from "lucide-react";

interface AddItemFormProps {
  onAddBlankRow: () => void;
  isDisabled?: boolean;
}

export default function AddItemForm({ onAddBlankRow, isDisabled }: AddItemFormProps) {
  return (
    <div className="flex flex-row justify-between items-center px-1 sm:px-4 gap-4 w-full">
      <h3 className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-2 italic shrink-0">
        <Package size={14} className="text-amber-500 shrink-0" /> Pending Items
      </h3>
      <button 
        type="button" 
        onClick={onAddBlankRow}
        disabled={isDisabled}
        className="flex-1 sm:flex-none h-10 sm:h-11 px-4 sm:px-6 bg-white border-2 border-slate-100 text-slate-900 rounded-xl font-black text-[9px] sm:text-[10px] uppercase tracking-wider hover:border-slate-400 transition-all disabled:opacity-50 flex items-center justify-center gap-1.5 active:scale-[0.98]"
      >
        <Plus size={14} className="shrink-0" /> Add Item
      </button>
    </div>
  );
}