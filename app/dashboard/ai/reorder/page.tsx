"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Truck, 
  Search, 
  ArrowRight, 
  Loader2 
} from "lucide-react";

export default function ReorderHubPage() {
  const [productId, setProductId] = useState("");
  const [isRedirecting, setIsRedirecting] = useState(false);
  const router = useRouter();

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (productId.trim()) {
      setIsRedirecting(true);
      router.push(`/dashboard/ai/reorder/${productId}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto min-h-[70vh] flex flex-col items-center justify-center p-4 sm:p-6 text-center text-slate-900 w-full">
      <motion.div 
        initial={{ opacity: 0, y: 15 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="space-y-8 sm:space-y-12 w-full flex flex-col items-center"
      >
        {/* BRAND ICON WRAPPER */}
        <div className="relative inline-block shrink-0">
          <div className="absolute inset-0 bg-blue-400 blur-[80px] opacity-15 rounded-full animate-pulse pointer-events-none" />
          <div className="relative bg-slate-900 p-6 sm:p-8 rounded-xl sm:rounded-[2.5rem] text-blue-400 shadow-md border border-white/5">
            <Truck className="h-10 w-10 sm:h-14 sm:w-14" strokeWidth={1.5} />
          </div>
        </div>

        {/* TYPOGRAPHY HEADER */}
        <div className="space-y-3 sm:space-y-4 max-w-xl">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight uppercase italic leading-none">
            Procurement <span className="text-transparent bg-clip-text bg-gradient-to-b from-blue-500 to-blue-700">Predictor</span>
          </h1>
          <p className="text-slate-400 font-medium text-sm sm:text-lg md:text-xl max-w-md mx-auto leading-relaxed px-2">
            Enter a product ID to analyze automated stockout risks and compute optimal replenishment budgets.
          </p>
        </div>

        {/* INPUT & SEARCH FIELD */}
        <div className="w-full max-w-xl z-10 pt-2">
          <form onSubmit={handleAnalyze} className="w-full flex flex-col sm:flex-row gap-3 items-stretch">
            <div className="relative flex-1 min-w-0">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none shrink-0">
                <Search size={20} />
              </div>
              <input
                autoFocus
                required
                type="text"
                inputMode="numeric"
                placeholder="Type or paste product ID..."
                value={productId}
                onChange={(e) => setProductId(e.target.value.replace(/\D/g, ''))}
                className="w-full bg-white border border-slate-200 h-12 sm:h-16 pl-12 pr-4 rounded-xl sm:rounded-2xl text-base font-semibold text-slate-800 shadow-sm outline-none focus:border-blue-500 transition-all uppercase tracking-tight"
              />
            </div>

            <button
              type="submit"
              disabled={!productId || isRedirecting}
              className="h-12 sm:h-16 bg-slate-900 text-white px-6 sm:px-8 rounded-xl sm:rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md hover:bg-black transition-all active:scale-[0.99] disabled:opacity-30 shrink-0 w-full sm:w-auto"
            >
              {isRedirecting ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <>
                  <span>Predict Reorder</span> 
                  <ArrowRight size={14} className="text-blue-400 shrink-0" />
                </>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}