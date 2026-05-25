"use client";

import PurchaseForm from "../components/PurchaseForm";
import { motion } from "framer-motion";
import { ArrowLeft, ShoppingBag, Zap } from "lucide-react";
import Link from "next/link";

export default function CreatePurchasePage() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }} 
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto space-y-6 sm:space-y-10 p-4 sm:p-6 pb-24"
    >
      {/* HEADER NAVIGATION */}
      <header className="space-y-3 sm:space-y-4">
        <Link 
          href="/dashboard/purchases" 
          className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-all font-bold text-[10px] sm:text-xs uppercase tracking-wider group w-fit"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
          Back to Purchases
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4 sm:gap-5 min-w-0">
            <div className="p-3.5 sm:p-4 bg-slate-900 rounded-xl sm:rounded-[1.5rem] shadow-md text-lime-400 shrink-0">
              <ShoppingBag size={24} className="sm:h-8 sm:w-8" />
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight uppercase italic leading-none truncate">
                New Purchase Order
              </h1>
              <p className="text-slate-400 font-medium text-xs sm:text-sm flex items-center gap-1.5 mt-1 sm:mt-2">
                <Zap size={12} className="text-lime-500 shrink-0" />
                Record stock entry details
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* THE FORM COMPONENT */}
      <PurchaseForm />
    </motion.div>
  );
}