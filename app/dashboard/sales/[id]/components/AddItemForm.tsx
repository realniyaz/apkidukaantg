"use client";

import { Package, Plus } from "lucide-react";

interface AddItemFormProps {
  onAddBlankRow: () => void;
  isDisabled?: boolean;
}

export default function AddItemForm({ onAddBlankRow, isDisabled }: AddItemFormProps) {
  return (
    <div className="flex justify-between items-center px-4">
      <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 flex items-center gap-2">
        <Package size={14} className="text-amber-500" /> Pending Manifest
      </h3>
      <button 
        type="button" 
        onClick={onAddBlankRow}
        disabled={isDisabled}
        className="px-6 py-3 bg-white border-2 border-slate-100 text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-slate-900 transition-all disabled:opacity-50 flex items-center gap-2"
      >
        <Plus size={14} /> Add Entity
      </button>
    </div>
  );
}