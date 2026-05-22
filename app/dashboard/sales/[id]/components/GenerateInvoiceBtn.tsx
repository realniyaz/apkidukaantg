"use client";

import { Loader2, FileText } from "lucide-react";

interface GenerateInvoiceBtnProps {
  onGenerate: () => void;
  isLoading: boolean;
}

export default function GenerateInvoiceBtn({ onGenerate, isLoading }: GenerateInvoiceBtnProps) {
  return (
    <button 
      onClick={onGenerate}
      disabled={isLoading}
      className="w-full py-6 bg-blue-500 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-blue-400 transition-all shadow-xl shadow-blue-500/20 active:scale-[0.98] disabled:opacity-50"
    >
      {isLoading ? (
        <Loader2 className="animate-spin" size={20} />
      ) : (
        <>Generate Invoice <FileText size={18} /></>
      )}
    </button>
  );
}