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

  // Fetch Inventory Catalog
  useEffect(() => {
    (async () => {
      try {
        const data = await apiRequest<Product[]>("/products/");
        setInventory(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to sync inventory catalog records:", err);
      }
    })();
  }, []);

  const filteredResults = useMemo(() => {
    if (!query || query.length < 1 || selectedId) return [];
    
    const term = query.toLowerCase().trim();
    return inventory
      .filter(p => {
        if (!p || p.id === undefined || p.id === null) return false;
        
        const nameMatch = p.name?.toLowerCase().includes(term);
        const idMatch = p.id.toString().includes(query);
        return nameMatch || idMatch;
      })
      .slice(0, 5);
  }, [inventory, query, selectedId]);

  const handleLaunch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
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
    <div className="max-w-5xl mx-auto min-h-[75vh] flex flex-col items-center justify-center p-4 sm:p-6 text-center text-slate-900 w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8 sm:space-y-12 w-full flex flex-col items-center"
      >
        {/* CORE ANALYTICS BRANDING ICON */}
        <div className="relative inline-block shrink-0">
          <div className="absolute inset-0 bg-lime-400 blur-[80px] opacity-15 rounded-full animate-pulse pointer-events-none" />
          <motion.div 
            animate={{ rotate: [0, 3, -3, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            className="relative bg-slate-900 p-6 sm:p-10 rounded-xl sm:rounded-[3rem] text-lime-400 shadow-md border border-white/5"
          >
            <Target className="h-10 w-10 sm:h-16 sm:w-16" strokeWidth={1.5} />
            <div className="absolute -bottom-1 -right-1 h-7 w-7 sm:h-9 sm:w-9 bg-lime-50 rounded-lg sm:rounded-xl flex items-center justify-center text-slate-900 shadow-md border-2 sm:border-4 border-slate-900">
               <Zap size={14} fill="currentColor" />
            </div>
          </motion.div>
        </div>

        <div className="space-y-2 sm:space-y-4 max-w-2xl">
          <div className="flex items-center justify-center gap-2 text-lime-600 font-black text-[9px] sm:text-[10px] uppercase tracking-wider italic">
             <BrainCircuit size={14} className="shrink-0" /> AI Pricing Assistant Active
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-black text-slate-900 tracking-tight uppercase italic leading-none">
            Price <span className="text-transparent bg-clip-text bg-gradient-to-b from-slate-400 to-slate-600">Optimizer</span>
          </h1>
          <p className="text-slate-400 font-medium text-sm sm:text-lg md:text-xl max-w-xl mx-auto leading-relaxed px-2">
            Calculate optimized profit margins and retail pricing points using live customer demand models.
          </p>
        </div>

        {/* SEARCH ENGINE FORM CONTAINER */}
        <div className="relative max-w-2xl mx-auto w-full z-50 pt-2">
          <form onSubmit={handleLaunch} className="relative w-full flex flex-col sm:flex-row gap-3 items-stretch">
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none shrink-0" size={20} />
              <input
                type="text"
                placeholder="Type product title or catalogue ID..."
                value={query}
                onFocus={() => setShowDropdown(true)}
                onChange={(e) => { 
                  setQuery(e.target.value); 
                  setSelectedId(null);
                }}
                className="w-full bg-white border border-slate-200 h-12 sm:h-16 pl-12 pr-4 rounded-xl sm:rounded-2xl text-base font-semibold text-slate-800 shadow-sm outline-none focus:border-lime-500 transition-all uppercase tracking-tight"
              />
            </div>

            <button
              type="submit"
              disabled={isAnalyzing || (!selectedId && !query.match(/^\d+$/))}
              className="h-12 sm:h-16 bg-slate-900 text-white px-6 sm:px-8 rounded-xl sm:rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md hover:bg-black transition-all active:scale-[0.99] disabled:opacity-30 shrink-0 w-full sm:w-auto"
            >
              {isAnalyzing ? (
                <Loader2 size={16} className="animate-spin text-lime-400" />
              ) : (
                <>
                  <span>Optimize Smart</span>
                  <ArrowRight size={14} className="text-lime-400 shrink-0" />
                </>
              )}
            </button>
          </form>

          {/* AUTOCOMPLETE DROPDOWN */}
          <AnimatePresence>
            {showDropdown && filteredResults.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="absolute top-full mt-2 left-0 right-0 bg-white border border-slate-100 shadow-xl rounded-xl sm:rounded-2xl overflow-hidden p-1.5 border-t-2 border-t-lime-500 text-left"
              >
                {filteredResults.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => selectProduct(p)}
                    className="w-full flex items-center justify-between p-3.5 sm:p-4 hover:bg-slate-50 rounded-lg sm:rounded-xl transition-all group gap-4 min-w-0 text-slate-900"
                  >
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                       <div className="h-10 w-10 bg-slate-900 rounded-lg flex items-center justify-center text-lime-400 shrink-0 shadow-sm">
                          <Box size={16} />
                       </div>
                       <div className="min-w-0 flex-1">
                          <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-wide leading-none mb-1">Product ID: #{p.id}</p>
                          <p className="text-sm sm:text-base font-black text-slate-800 uppercase italic leading-none truncate pr-2">{p.name}</p>
                       </div>
                    </div>
                    <div className="h-7 w-7 bg-lime-500/10 rounded-md flex items-center justify-center text-lime-600 opacity-0 group-hover:opacity-100 transition-all shrink-0">
                        <ArrowRight size={14} />
                    </div>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* CORE PLATFORM BENEFITS SECTION */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 pt-8 sm:pt-12 border-t border-slate-100 w-full">
          <FeatureTag icon={<TrendingUp size={14}/>} text="Margin Protection" />
          <FeatureTag icon={<Fingerprint size={14}/>} text="Inventory Sync" />
          <FeatureTag icon={<Sparkles size={14}/>} text="Smart Adjustments" />
        </div>
      </motion.div>

      {showDropdown && (
        <div className="fixed inset-0 -z-10" onClick={() => setShowDropdown(false)} />
      )}
    </div>
  );
}

interface FeatureTagProps {
  icon: React.ReactNode;
  text: string;
}

function FeatureTag({ icon, text }: FeatureTagProps) {
  return (
    <div className="flex items-center gap-2 sm:gap-3 text-slate-400 font-black text-[10px] sm:text-xs uppercase tracking-wider group cursor-default max-w-xs truncate">
      <div className="h-9 w-9 sm:h-10 sm:w-10 bg-slate-50 rounded-lg sm:rounded-xl flex items-center justify-center text-slate-300 group-hover:text-lime-600 group-hover:bg-lime-50 transition-all border border-slate-100 shrink-0">
        {icon}
      </div>
      <span className="group-hover:text-slate-900 transition-colors truncate">{text}</span>
    </div>
  );
}