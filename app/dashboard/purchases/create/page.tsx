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
      className="max-w-7xl mx-auto space-y-10 p-6 pb-24"
    >
      {/* HEADER NAVIGATION */}
      <header className="space-y-4">
        <Link 
          href="/dashboard/purchases" 
          className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-all font-bold text-xs uppercase tracking-widest group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Procurement
        </Link>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-slate-900 rounded-[1.5rem] shadow-xl text-lime-400">
              <ShoppingBag size={32} />
            </div>
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                New Purchase Order
              </h1>
              <p className="text-slate-500 font-medium flex items-center gap-2">
                <Zap size={14} className="text-lime-500" />
                Initialize stock replenishment voucher
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