"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, ShieldCheck, ArrowRight, Loader2, Info } from "lucide-react";
import Link from "next/link";

interface LowStockProduct {
  product_public_id: string;
  name: string;
  available_stock: number;
  threshold: number;
}

export default function LowStockPage() {
  const [products, setProducts] = useState<LowStockProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await apiRequest<LowStockProduct[]>("/inventory/low-stock");
        setProducts(data || []);
      } catch (err) {
        console.error("Failed to load low stock metrics:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6">
        <Loader2 className="animate-spin text-orange-500" size={32} />
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mt-4 animate-pulse">
          Scanning inventory alert points...
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-8 text-slate-900">
      
      {/* HEADER SECTION */}
      <div className="flex items-center gap-3.5 pb-2 border-b border-slate-100">
        <div className="p-2.5 bg-orange-500 text-white rounded-xl shadow-md shadow-orange-500/10 shrink-0">
          <AlertTriangle size={20} />
        </div>
        <div>
          <h1 className="text-xl sm:text-3xl font-black tracking-tight uppercase italic leading-none">
            Stock Runout Alerts
          </h1>
          <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1.5">
            Products sitting below standard safety limits
          </p>
        </div>
      </div>

      {/* CONDITIONAL RENDER CHASSIS */}
      <AnimatePresence mode="wait">
        {products.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-20 bg-white rounded-xl sm:rounded-[2rem] border border-dashed border-slate-200 p-4 text-center"
          >
            <div className="bg-lime-50 text-lime-600 p-4 rounded-xl mb-4 shrink-0 border border-lime-100/50 shadow-sm">
              <ShieldCheck size={28} />
            </div>
            <h3 className="text-slate-900 font-black text-base tracking-tight uppercase italic">Inventory Fully Stocked</h3>
            <p className="text-slate-400 text-xs max-w-[280px] mx-auto mt-1 font-semibold leading-normal">
              All active product numbers currently clear your custom minimum stock thresholds.
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full overflow-hidden bg-white rounded-xl sm:rounded-[2rem] border border-slate-100 shadow-sm"
          >
            <div className="w-full overflow-x-auto">
              <table className="w-full border-separate border-spacing-0 min-w-[600px]">
                <thead>
                  <tr className="bg-slate-50/50 text-[9px] sm:text-[10px] uppercase tracking-wider font-black text-slate-400 border-b border-slate-100">
                    <th className="px-6 sm:px-8 py-4 text-left">Product Details</th>
                    <th className="px-6 sm:px-8 py-4 text-center w-36">Current Stock</th>
                    <th className="px-6 sm:px-8 py-4 text-center w-36">Safety Limit</th>
                    <th className="px-6 sm:px-8 py-4 text-center w-40">Status Summary</th>
                    <th className="px-6 sm:px-8 py-4 text-right w-24">Restock</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 font-semibold text-slate-700">
                  {products.map((p, idx) => (
                    <motion.tr
                      key={p.product_public_id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.02 }}
                      className="group hover:bg-slate-50/40 transition-colors duration-150 cursor-default"
                    >
                      {/* Product Name */}
                      <td className="px-6 sm:px-8 py-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="h-1.5 w-1.5 rounded-full bg-orange-500 shrink-0 hidden sm:block animate-pulse" />
                          <div className="flex flex-col min-w-0">
                            <span className="font-black text-slate-900 text-sm tracking-tight truncate leading-none">
                              {p.name}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400 mt-1.5 uppercase tracking-tighter">
                              SKU: {p.product_public_id?.slice(0, 10).toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Current Stock */}
                      <td className="px-6 sm:px-8 py-4 text-center tabular-nums text-red-600 font-black text-sm">
                        {p.available_stock} Units
                      </td>

                      {/* Safety Limit Threshold */}
                      <td className="px-6 sm:px-8 py-4 text-center tabular-nums text-slate-500 text-xs font-bold">
                        {p.threshold} Units
                      </td>

                      {/* Status Explanation */}
                      <td className="px-6 sm:px-8 py-4 text-center">
                        <div className="inline-flex items-center gap-1 bg-red-50 text-red-600 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider">
                          <Info size={10} className="shrink-0" />
                          Short by {p.threshold - p.available_stock}
                        </div>
                      </td>

                      {/* Quick Restock Link */}
                      <td className="px-6 sm:px-8 py-4 text-right">
                        <Link
                          href="/dashboard/purchases/create"
                          className="inline-flex items-center justify-center h-8 w-8 rounded-lg bg-slate-50 border border-slate-100 text-slate-400 hover:border-orange-500 hover:bg-orange-50 hover:text-orange-600 hover:shadow-sm transition-all active:scale-95 shrink-0"
                          title="Create Restock Purchase Order"
                        >
                          <ArrowRight size={14} />
                        </Link>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}