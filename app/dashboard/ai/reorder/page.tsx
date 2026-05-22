"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Truck, 
  Search, 
  ArrowRight, 
  Box, 
  Clock, 
  BrainCircuit,
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
    <div className="max-w-4xl mx-auto min-h-[75vh] flex flex-col items-center justify-center p-6 text-center">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10 w-full">
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-blue-400 blur-[60px] opacity-20 rounded-full animate-pulse" />
          <div className="relative bg-slate-900 p-8 rounded-[2.5rem] text-blue-400 shadow-2xl border border-white/5">
            <Truck size={56} strokeWidth={1.5} />
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-6xl font-black text-slate-900 tracking-tight">
            Supply <span className="text-blue-500">Intelligence</span>
          </h1>
          <p className="text-slate-500 font-medium text-xl max-w-lg mx-auto leading-relaxed">
            Neural stockout prediction and automated procurement budgeting for your inventory.
          </p>
        </div>

        <form onSubmit={handleAnalyze} className="relative max-w-xl mx-auto group">
          <div className="absolute left-7 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-all">
            <Search size={28} />
          </div>
          <input
            autoFocus
            type="text"
            placeholder="Reference Product ID..."
            value={productId}
            onChange={(e) => setProductId(e.target.value.replace(/\D/g, ''))}
            className="w-full bg-white border-2 border-slate-100 p-8 pl-16 pr-44 rounded-[2.5rem] text-2xl font-black text-slate-800 shadow-2xl outline-none focus:border-blue-500 transition-all"
          />
          <button
            type="submit"
            disabled={!productId || isRedirecting}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-slate-900 text-white px-8 py-4 rounded-[1.5rem] font-black text-sm uppercase tracking-widest hover:bg-black transition-all flex items-center gap-3 disabled:opacity-20 shadow-xl"
          >
            {isRedirecting ? <Loader2 className="animate-spin" size={20} /> : <>Analyze <ArrowRight size={18} /></>}
          </button>
        </form>
      </motion.div>
    </div>
  );
}