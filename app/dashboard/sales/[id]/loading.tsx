"use client";

import { Loader2, Zap } from "lucide-react";

export default function SaleControlLoading() {
  return (
    <div className="min-h-[70vh] sm:min-h-screen bg-[#FDFDFD] flex flex-col items-center justify-center p-4">
      <div className="relative">
        {/* We use standard sizes and let Tailwind classes handle responsive scaling via text dimensions */}
        <Loader2 className="animate-spin text-slate-200 h-12 w-12 sm:h-16 sm:w-16" />
        <Zap 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-lime-500 animate-pulse h-5 w-5 sm:h-6 sm:w-6" 
          fill="currentColor" 
        />
      </div>
      <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-wider sm:tracking-[0.4em] mt-6 animate-pulse text-center">
        Opening order dashboard...
      </p>
    </div>
  );
}