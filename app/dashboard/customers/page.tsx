"use client";

import { useEffect, useState, useMemo } from "react";
import { apiRequest } from "@/lib/api";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { 
  Users, UserPlus, RefreshCcw, Search, 
  Activity, Globe, Filter, 
  Database, Fingerprint, Network, Heart
} from "lucide-react";
import Link from "next/link";
import CustomerTable from "./components/CustomerTable";
import CustomerStats from "./components/CustomerStats";

// ✅ SMOOTH ANIMATION VARIANTS
const containerVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { 
      staggerChildren: 0.1, 
      duration: 0.6, 
      ease: "circOut" 
    }
  }
};

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");

  const fetchCustomers = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      const data = await apiRequest<any[]>("customers/");
      setCustomers(data || []);
    } catch (error: any) {
      console.error("Customer sync failed:", error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchCustomers(); }, []);

  const filteredCustomers = useMemo(() => {
    const term = search.toLowerCase();
    return customers.filter(c => 
      (c.name?.toLowerCase().includes(term)) || 
      (c.phone?.includes(term)) ||
      (c.email?.toLowerCase().includes(term))
    );
  }, [customers, search]);

  if (loading) return <RegistrySkeleton />;

  return (
    <motion.div 
      variants={containerVariants} 
      initial="hidden" 
      animate="show"
      className="max-w-[1600px] mx-auto p-6 md:p-10 space-y-12 pb-40 text-slate-900 selection:bg-lime-500/30"
    >
      {/* 01. WELCOME & SEARCH HEADER */}
      <header className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-10 border-b border-slate-100 pb-16 relative">
        <div className="space-y-6 relative z-10">
          <div className="flex items-center gap-3 text-lime-600 font-black text-[10px] uppercase tracking-[0.5em] bg-lime-50 w-fit px-4 py-2 rounded-full border border-lime-100">
            <Heart size={14} className="animate-pulse" /> 
            <span>Relationship Manager: Active</span>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-8xl font-black tracking-[-0.05em] uppercase italic leading-[0.8] text-slate-900">
              Customer <span className="text-transparent bg-clip-text bg-gradient-to-b from-slate-200 to-slate-400">Directory</span>
            </h1>
            <div className="flex items-center gap-4 pt-2">
               <div className="h-[2px] w-24 bg-lime-500" />
               <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-xs">
                 Growing your community, one person at a time
               </p>
            </div>
          </div>

          <p className="text-slate-500 font-medium italic text-xl leading-relaxed max-w-2xl">
            You are currently connected with <span className="text-slate-900 font-black underline decoration-lime-500/40 decoration-4 underline-offset-4">{customers.length} loyal customers</span>. 
            All profiles are <span className="text-slate-900 font-black">synchronized</span> and up to date.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 w-full xl:w-auto relative z-10">
          {/* SEARCH FIELD */}
          <div className="relative group flex-1 md:w-96">
            <div className="absolute inset-0 bg-lime-500/5 blur-xl group-focus-within:bg-lime-500/10 transition-all rounded-full" />
            <Search className="absolute left-7 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-lime-500 transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Search by name, phone, or email..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border-2 border-slate-100 py-7 pl-16 pr-10 rounded-[2.5rem] outline-none focus:border-lime-500 focus:ring-0 transition-all text-sm font-black italic shadow-xl shadow-slate-200/20 placeholder:text-slate-300"
            />
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => fetchCustomers(true)} 
              disabled={refreshing}
              title="Refresh Customer List"
              className="h-[76px] w-[76px] bg-white border-2 border-slate-100 rounded-[2rem] text-slate-400 hover:text-slate-900 hover:border-slate-900 transition-all active:scale-90 group flex items-center justify-center shadow-lg shadow-slate-100"
            >
              <RefreshCcw size={24} className={`${refreshing ? "animate-spin text-lime-500" : "group-hover:rotate-180"} transition-transform duration-1000`} />
            </button>

            <Link 
              href="/dashboard/customers/create"
              className="bg-slate-900 text-white h-[76px] px-10 rounded-[2.2rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-black hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)] hover:-translate-y-1 transition-all active:scale-95 flex items-center gap-4 shadow-2xl group"
            >
               <UserPlus size={20} className="text-lime-400 group-hover:scale-125 transition-transform" /> 
               <span>Add New Customer</span>
            </Link>
          </div>
        </div>
      </header>

      {/* 02. CUSTOMER ANALYTICS MATRIX */}
      <section className="relative">
        <CustomerStats customers={customers} />
      </section>

      {/* 03. CUSTOMER LIST DATA */}
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-8">
            <div className="flex items-center gap-4">
               <div className="h-10 w-10 bg-slate-900 rounded-xl flex items-center justify-center text-lime-400 shadow-lg">
                  <Users size={20} />
               </div>
               <div>
                  <h3 className="text-xs font-black uppercase tracking-[0.4em] text-slate-900 leading-none mb-1">
                    Customer Database
                  </h3>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest italic">Securely stored and encrypted</p>
               </div>
            </div>
            
            <div className="flex items-center gap-6 text-[9px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100">
                <span className="flex items-center gap-2 text-lime-600"><Fingerprint size={14}/> Verified Profiles</span>
                <span className="h-4 w-px bg-slate-200" />
                <button className="flex items-center gap-2 hover:text-slate-900 transition-all"><Filter size={14}/> Sort & Filter</button>
            </div>
        </div>

        <motion.div 
          layout
          className="bg-white rounded-[4.5rem] border border-slate-100 shadow-[0_40px_100px_rgba(0,0,0,0.04)] overflow-hidden p-4 relative"
        >
          {/* Subtle Background Pattern */}
          <div className="absolute bottom-0 left-0 p-10 opacity-[0.02] pointer-events-none rotate-12">
            <Users size={600} />
          </div>
          
          <AnimatePresence mode="wait">
            <motion.div 
              key={search}
              initial={{ opacity: 0, x: -10 }} 
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.3 }}
            >
              <CustomerTable customers={filteredCustomers} onRefresh={() => fetchCustomers(true)} />
              
              {filteredCustomers.length === 0 && (
                <div className="py-40 text-center space-y-4">
                  <div className="h-20 w-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <Activity size={40} className="text-slate-200 animate-pulse" />
                  </div>
                  <h2 className="text-xl font-black italic uppercase tracking-tighter text-slate-900">No customers found</h2>
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">We couldn't find anyone matching that search</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
}

function RegistrySkeleton() {
  return (
    <div className="max-w-[1600px] mx-auto p-10 space-y-12 animate-pulse">
      <div className="space-y-6">
        <div className="h-8 w-48 bg-slate-100 rounded-full" />
        <div className="h-24 w-3/4 bg-slate-100 rounded-[2.5rem]" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1,2,3,4].map(i => <div key={i} className="h-64 bg-slate-50 rounded-[3.5rem]" />)}
      </div>
      <div className="h-[800px] bg-slate-50 rounded-[4.5rem]" />
    </div>
  );
}