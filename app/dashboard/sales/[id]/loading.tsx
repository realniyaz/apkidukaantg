import { Loader2, Zap } from "lucide-react";

export default function SaleControlLoading() {
  return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col items-center justify-center">
      <div className="relative">
        <Loader2 className="animate-spin text-slate-200" size={64} />
        <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-lime-400 animate-pulse" size={24} fill="currentColor" />
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-6 animate-pulse">
        Establishing Node Link...
      </p>
    </div>
  );
}