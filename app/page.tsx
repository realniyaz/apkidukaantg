"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Zap, Sparkles, BrainCircuit, ShieldCheck, BarChart3 } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans flex flex-col">
      {/* NAVIGATION */}
      <header className="w-full max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-lime-500 rounded-lg flex items-center justify-center shadow-sm">
            <Zap size={16} className="text-white" fill="white" />
          </div>
          <span className="font-black text-sm uppercase tracking-tighter">Apkidukaan</span>
        </div>
        <Link 
          href="/auth/register" 
          className="text-[10px] font-black uppercase tracking-widest hover:text-lime-600 transition-colors"
        >
          Register
        </Link>
      </header>

      {/* HERO SECTION */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="space-y-6 max-w-2xl"
        >
          <div className="flex items-center justify-center gap-2 text-lime-600 font-black text-[9px] uppercase tracking-widest bg-lime-50 px-3 py-1 rounded-full border border-lime-100 w-fit mx-auto">
            <Sparkles size={10} /> Smart Retail Partner
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black tracking-tight uppercase italic leading-[0.9]">
            Grow your<br/> 
            <span className="text-lime-500">Sales Velocity.</span>
          </h1>
          
          <p className="text-slate-500 font-medium text-base md:text-lg max-w-md mx-auto leading-relaxed">
            Stop guessing. Start restocking smarter. Apkidukaan gives you the insights to move stock and grow profits.
          </p>

          <Link 
            href="/auth/login" 
            className="inline-flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all active:scale-[0.98] shadow-lg"
          >
            Launch Platform <ArrowRight size={14} />
          </Link>
        </motion.div>
      </main>

      {/* FOOTER FEATURES */}
      <footer className="w-full max-w-4xl mx-auto px-6 py-8 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
        <Feature label="Profit Insights" icon={<BarChart3 size={14} />} />
        <Feature label="Inventory Guards" icon={<ShieldCheck size={14} />} />
        <Feature label="Smart Demand" icon={<BrainCircuit size={14} />} />
      </footer>
    </div>
  );
}

function Feature({ label, icon }: { label: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center gap-2 text-slate-400 font-black text-[9px] uppercase tracking-widest">
      {icon} {label}
    </div>
  );
}