"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  BrainCircuit, 
  Sparkles, 
  ArrowRight, 
  PackageSearch,
  Loader2 
} from "lucide-react";

export default function ProductAISelectionPage() {
  const [productId, setProductId] = useState("");
  const [isRedirecting, setIsRedirecting] = useState(false);
  const router = useRouter();

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (productId.trim()) {
      setIsRedirecting(true);
      // Navigates to your dynamic [id] route under the AI directory
      router.push(`/dashboard/ai/product/${productId}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto min-h-[75vh] flex flex-col items-center justify-center p-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-10 w-full"
      >
        {/* Visual Brand Icon */}
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-lime-400 blur-[60px] opacity-20 rounded-full animate-pulse" />
          <div className="relative bg-slate-900 p-8 rounded-[2.5rem] text-lime-400 shadow-2xl border border-white/5">
            <BrainCircuit size={56} strokeWidth={1.5} />
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-6xl font-black text-slate-900 tracking-tight leading-none">
            Product <span className="text-lime-500 underline decoration-slate-200 underline-offset-8">Neural Hub</span>
          </h1>
          <p className="text-slate-500 font-medium text-xl max-w-lg mx-auto leading-relaxed">
            Enter a Product ID to initiate a deep-learning performance audit and inventory forecast.
          </p>
        </div>

        {/* Neural Search Input */}
        <form onSubmit={handleAnalyze} className="relative max-w-xl mx-auto group">
          <div className="absolute left-7 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-lime-500 transition-all duration-300">
            <PackageSearch size={28} />
          </div>
          
          <input
            autoFocus
            required
            type="text"
            inputMode="numeric"
            placeholder="Reference Product ID..."
            value={productId}
            onChange={(e) => setProductId(e.target.value.replace(/\D/g, ''))} // Strictly numeric IDs
            className="w-full bg-white border-2 border-slate-100 p-8 pl-16 pr-44 rounded-[2.5rem] text-2xl font-black text-slate-800 shadow-2xl shadow-slate-200/60 outline-none focus:border-lime-500 focus:ring-8 focus:ring-lime-500/5 transition-all placeholder:text-slate-200"
          />

          <button
            type="submit"
            disabled={!productId || isRedirecting}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-slate-900 text-white px-8 py-4 rounded-[1.5rem] font-black text-sm uppercase tracking-[0.15em] hover:bg-black hover:scale-[1.02] transition-all flex items-center gap-3 disabled:opacity-20 disabled:grayscale disabled:cursor-not-allowed shadow-xl shadow-slate-900/20"
          >
            {isRedirecting ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                Analyze <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        {/* Data Benchmarks Visualization */}
        <div className="flex flex-wrap items-center justify-center gap-8 pt-8">
          <Badge text="Velocity Check" />
          <div className="w-1.5 h-1.5 bg-slate-200 rounded-full" />
          <Badge text="Margin Health" />
          <div className="w-1.5 h-1.5 bg-slate-200 rounded-full" />
          <Badge text="Runway Forecast" />
        </div>
      </motion.div>
    </div>
  );
}

function Badge({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2.5 text-slate-400 font-black text-[11px] uppercase tracking-[0.2em] px-4 py-2 bg-slate-50 rounded-full border border-slate-100">
      <Sparkles size={14} className="text-lime-500" />
      {text}
    </div>
  );
}