"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { apiRequest } from "@/lib/api";
import { 
  Zap, 
  Search, 
  ArrowRight, 
  Sparkles, 
  TrendingUp, 
  BrainCircuit,
  Box,
  Fingerprint,
  ChevronRight,
  Target,
  Loader2
} from "lucide-react";

interface Product {
  id: number;
  name: string;
  selling_price: number;
}

export default function PriceOptimizationHub() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [inventory, setInventory] = useState<Product[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();

  // Fetch Inventory
  useEffect(() => {
    (async () => {
      try {
        const data = await apiRequest<Product[]>("/products/");
        // ✅ Ensure we only set a valid array
        setInventory(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Neural Sync Failure", err);
      }
    })();
  }, []);

  const filteredResults = useMemo(() => {
    // ✅ Logic Fix: Don't filter if query is empty or an item is already selected
    if (!query || query.length < 1 || selectedId) return [];
    
    const term = query.toLowerCase();
    return inventory
      .filter(p => {
        // ✅ CRITICAL FIX: Optional chaining and existence check for p.id
        if (!p || p.id === undefined || p.id === null) return false;
        
        const nameMatch = p.name?.toLowerCase().includes(term);
        const idMatch = p.id.toString().includes(query);
        return nameMatch || idMatch;
      })
      .slice(0, 5);
  }, [inventory, query, selectedId]);

  const handleLaunch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    // Accept selection or a pure numeric manual input
    const finalId = selectedId || (query.match(/^\d+$/) ? query : null);
    
    if (finalId) {
      setIsAnalyzing(true);
      router.push(`/dashboard/ai/optimization/${finalId}`);
    }
  };

  const selectProduct = (p: Product) => {
    setQuery(p.name);
    setSelectedId(p.id);
    setShowDropdown(false);
  };

  return (
    <div className="max-w-5xl mx-auto min-h-[80vh] flex flex-col items-center justify-center p-6 text-center selection:bg-lime-500/30">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-12 w-full"
      >
        {/* NEURAL CORE ICON */}
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-lime-400 blur-[100px] opacity-20 rounded-full animate-pulse" />
          <motion.div 
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ repeat: Infinity, duration: 6 }}
            className="relative bg-slate-900 p-10 rounded-[3.5rem] text-lime-400 shadow-2xl border border-white/5"
          >
            <Target size={64} strokeWidth={1.5} />
            <div className="absolute -bottom-2 -right-2 h-10 w-10 bg-lime-50 rounded-2xl flex items-center justify-center text-slate-900 shadow-xl border-4 border-slate-900">
               <Zap size={18} fill="currentColor" />
            </div>
          </motion.div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-center gap-3 text-lime-600 font-black text-[10px] uppercase tracking-[0.5em] mb-4 italic">
             <BrainCircuit size={16} /> Neural Model v2.4 Active
          </div>
          <h1 className="text-7xl font-black text-slate-900 tracking-tighter uppercase italic leading-[0.85]">
            Price <span className="text-transparent bg-clip-text bg-gradient-to-b from-slate-200 to-slate-400">Optimizer</span>
          </h1>
          <p className="text-slate-500 font-medium text-xl max-w-xl mx-auto leading-relaxed italic">
            Compute mathematically ideal price points using market elasticity algorithms.
          </p>
        </div>

        {/* DYNAMIC SEARCH & EXECUTION ENGINE */}
        <div className="relative max-w-2xl mx-auto w-full z-50">
          <form onSubmit={handleLaunch} className="relative group">
            <div className="absolute left-7 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-lime-500 transition-all duration-500">
              <Search size={28} />
            </div>
            
            <input
              type="text"
              placeholder="Search Asset Name or ID..."
              value={query}
              onFocus={() => { setShowDropdown(true); }}
              onChange={(e) => { 
                setQuery(e.target.value); 
                setSelectedId(null); // Reset selection if typing starts
              }}
              className="w-full bg-white border-2 border-slate-100 p-8 pl-16 pr-52 rounded-[2.5rem] text-2xl font-black text-slate-800 shadow-xl outline-none focus:border-lime-500 focus:ring-8 focus:ring-lime-500/5 transition-all uppercase tracking-tighter italic"
            />

            <button
              type="submit"
              disabled={isAnalyzing || (!selectedId && !query.match(/^\d+$/))}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-slate-900 text-white px-8 py-5 rounded-[1.8rem] font-black text-xs uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-black transition-all shadow-xl disabled:opacity-20 disabled:grayscale"
            >
              {isAnalyzing ? (
                <Loader2 size={18} className="animate-spin text-lime-400" />
              ) : (
                <>
                  Model Node
                  <ArrowRight size={18} className="text-lime-400" />
                </>
              )}
            </button>
          </form>

          {/* DROPDOWN */}
          <AnimatePresence>
            {showDropdown && filteredResults.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full mt-4 left-0 right-0 bg-white border border-slate-100 shadow-2xl rounded-[2.5rem] overflow-hidden p-3 border-t-4 border-t-lime-500"
              >
                {filteredResults.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => selectProduct(p)}
                    className="w-full flex items-center justify-between p-6 hover:bg-slate-50 rounded-2xl transition-all group"
                  >
                    <div className="flex items-center gap-5">
                       <div className="h-12 w-12 bg-slate-900 rounded-xl flex items-center justify-center text-lime-400 group-hover:scale-110 transition-transform shadow-lg">
                          <Box size={20} />
                       </div>
                       <div className="text-left">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Node ID: {p.id}</p>
                          <p className="text-lg font-black text-slate-900 uppercase italic leading-none">{p.name}</p>
                       </div>
                    </div>
                    <div className="h-8 w-8 bg-lime-500/10 rounded-lg flex items-center justify-center text-lime-600 opacity-0 group-hover:opacity-100 transition-all">
                        <ArrowRight size={16} />
                    </div>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* FEATURE ARCHITECTURE */}
        <div className="flex flex-wrap items-center justify-center gap-10 pt-12 border-t border-slate-50">
          <FeatureTag icon={<TrendingUp size={16}/>} text="Margin Guard" />
          <FeatureTag icon={<Fingerprint size={16}/>} text="Identity Sync" />
          <FeatureTag icon={<Sparkles size={16}/>} text="AI Correction" />
        </div>
      </motion.div>

      {showDropdown && (
        <div className="fixed inset-0 -z-10" onClick={() => setShowDropdown(false)} />
      )}
    </div>
  );
}

function FeatureTag({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-3 text-slate-400 font-black text-xs uppercase tracking-[0.3em] group cursor-default">
      <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-300 group-hover:text-lime-500 group-hover:bg-lime-50 transition-all border border-slate-100">
        {icon}
      </div>
      <span className="group-hover:text-slate-900 transition-colors">{text}</span>
    </div>
  );
}