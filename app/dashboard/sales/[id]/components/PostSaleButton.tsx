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
      className="w-full h-12 sm:h-14 bg-lime-400 hover:bg-lime-500 text-slate-900 rounded-xl sm:rounded-[2rem] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all shadow-md active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed"
    >
      {isLoading ? (
        <Loader2 className="animate-spin text-slate-900" size={16} />
      ) : (
        <>
          <span>Complete Order</span> 
          <CheckCircle size={16} />
        </>
      )}
    </button>
  );
}