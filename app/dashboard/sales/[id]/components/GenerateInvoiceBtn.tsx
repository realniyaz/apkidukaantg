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
      className="w-full h-12 sm:h-14 bg-blue-600 hover:bg-blue-500 text-white rounded-xl sm:rounded-[2rem] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all shadow-md active:scale-[0.99] disabled:opacity-50"
    >
      {isLoading ? (
        <Loader2 className="animate-spin" size={16} />
      ) : (
        <>
          <span>View Invoice</span> 
          <FileText size={16} />
        </>
      )}
    </button>
  );
}