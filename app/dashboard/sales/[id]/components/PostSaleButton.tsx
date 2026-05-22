"use client";

import { Loader2, CheckCircle } from "lucide-react";

interface PostSaleButtonProps {
  onPost: () => void;
  isLoading: boolean;
  isDisabled: boolean;
  tooltipMsg?: string;
}

export default function PostSaleButton({ onPost, isLoading, isDisabled, tooltipMsg }: PostSaleButtonProps) {
  return (
    <button 
      onClick={onPost}
      disabled={isDisabled || isLoading}
      title={tooltipMsg}
      className="w-full py-6 bg-lime-400 text-slate-900 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-white transition-all shadow-xl shadow-lime-400/20 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
    >
      {isLoading ? (
        <Loader2 className="animate-spin" size={20} />
      ) : (
        <>Post Transaction <CheckCircle size={18} /></>
      )}
    </button>
  );
}