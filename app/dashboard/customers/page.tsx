"use client";

import { useEffect, useState, useMemo } from "react";
import { apiRequest } from "@/lib/api";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { 
  Users, UserPlus, RefreshCcw, Search, 
  Activity, Filter, Fingerprint, Heart
} from "lucide-react";
import Link from "next/link";
import CustomerTable from "./components/CustomerTable";
import CustomerStats from "./components/CustomerStats";

// ✅ SMOOTH RESPONSIVE ANIMATION VARIANTS
const containerVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  show: {
    opacity: 1,
    y: 0,
    transition: { 
      staggerChildren: 0.05, 
      duration: 0.5, 
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
      className="max-w-[1600px] mx-auto p-4 sm:p-6 md:p-10 space-y-6 sm:space-y-12 pb-24 sm:pb-40 text-slate-900 selection:bg-lime-500/30"
    >
      {/* 01. WELCOME & SEARCH HEADER */}
      <header className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-6 sm:gap-10 border-b border-slate-100 pb-8 sm:pb-16 relative">
        <div className="space-y-4 sm:space-y-6 relative z-10 w-full xl:w-auto">
          <div className="flex items-center gap-2.5 text-lime-600 font-black text-[9px] sm:text-[10px] uppercase tracking-[0.25em] bg-lime-50 w-fit px-3.5 py-1.5 rounded-full border border-lime-100">
            <Heart size={14} className="animate-pulse" /> 
            <span>Customer Retention Live</span>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-7xl xl:text-8xl font-black tracking-tighter uppercase italic leading-[0.9] text-slate-900">
              Customer <span className="text-slate-400">Directory</span>
            </h1>
            <div className="flex items-center gap-3 pt-1">
               <div className="h-[2px] w-12 sm:w-24 bg-lime-500" />
               <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px] sm:text-xs">
                 Nurturing your community relationships
               </p>
            </div>
          </div>

          <p className="text-slate-500 font-medium text-sm sm:text-xl leading-relaxed max-w-2xl">
            You are managing <span className="text-slate-900 font-black underline decoration-lime-500/40 decoration-2 sm:decoration-4 underline-offset-2 sm:underline-offset-4">{customers.length} business clients</span>. 
            All contact profiles are securely organized.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full xl:w-auto relative z-10 pt-2 xl:pt-0">
          {/* SEARCH FIELD */}
          <div className="relative group w-full sm:w-72 md:w-96">
            <div className="absolute inset-0 bg-lime-500/5 blur-xl group-focus-within:bg-lime-500/10 transition-all rounded-full pointer-events-none" />
            <Search className="absolute left-5 sm:left-7 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-lime-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Find by name, phone, or email..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border-2 border-slate-100 py-4 sm:py-6 pl-12 sm:pl-16 pr-5 sm:pr-10 rounded-[1.2rem] sm:rounded-[2.5rem] outline-none focus:border-lime-500 transition-all text-sm font-semibold shadow-md placeholder:text-slate-300"
            />
          </div>

          <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
            <button 
              onClick={() => fetchCustomers(true)} 
              disabled={refreshing}
              title="Refresh Customer List"
              className="h-12 w-12 sm:h-[72px] sm:w-[72px] bg-white border-2 border-slate-100 rounded-xl sm:rounded-[2rem] text-slate-400 hover:text-slate-900 hover:border-slate-900 transition-all active:scale-95 group flex items-center justify-center shrink-0 shadow-sm"
            >
              <RefreshCcw size={18} className={`${refreshing ? "animate-spin text-lime-500" : "group-hover:rotate-180"} transition-transform duration-1000`} />
            </button>

            <Link 
              href="/dashboard/customers/create"
              className="flex-1 sm:flex-none bg-slate-900 text-white h-12 sm:h-[72px] px-5 sm:px-8 rounded-xl sm:rounded-[2.2rem] font-black text-xs uppercase tracking-wider hover:bg-black transition-all active:scale-95 flex items-center justify-center gap-2.5 shadow-lg group"
            >
               <UserPlus size={16} className="text-lime-400 group-hover:scale-110 transition-transform shrink-0" /> 
               <span className="truncate">Add Customer</span>
            </Link>
          </div>
        </div>
      </header>

      {/* 02. CUSTOMER ANALYTICS MATRIX */}
      <section className="relative">
        <CustomerStats customers={customers} />
      </section>

      {/* 03. CUSTOMER LIST DATA */}
      <div className="space-y-4 sm:space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-2 sm:px-8">
            <div className="flex items-center gap-3">
               <div className="h-9 w-9 sm:h-10 sm:w-10 bg-slate-900 rounded-xl flex items-center justify-center text-lime-400 shadow-md shrink-0">
                  <Users size={18} />
               </div>
               <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 leading-none mb-1">
                    Client Registry
                  </h3>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest italic">Protected Records Archive</p>
               </div>
            </div>
            
            <div className="flex items-center justify-between sm:justify-start gap-4 text-[9px] font-black uppercase tracking-wider text-slate-400 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100 w-full sm:w-auto">
                <span className="flex items-center gap-1.5 text-lime-600"><Fingerprint size={14}/> Verified Profiles</span>
                <span className="h-3 w-px bg-slate-200 hidden sm:block" />
                <button className="flex items-center gap-1.5 hover:text-slate-900 transition-all"><Filter size={14}/> Sort & Filter</button>
            </div>
        </div>

        {/* Mobile Wrap Table Box */}
        <motion.div 
          layout
          className="bg-white rounded-[1.5rem] sm:rounded-[4.5rem] border border-slate-100 shadow-sm overflow-hidden p-2 sm:p-4 relative"
        >
          {/* Subtle Background Pattern */}
          <div className="absolute bottom-0 left-0 p-10 opacity-[0.01] pointer-events-none rotate-12 hidden md:block">
            <Users size={600} />
          </div>
          
          <AnimatePresence mode="wait">
            <motion.div 
              key={search}
              initial={{ opacity: 0, x: -5 }} 
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 5 }}
              transition={{ duration: 0.2 }}
              className="w-full overflow-x-auto"
            >
              <CustomerTable customers={filteredCustomers} onRefresh={() => fetchCustomers(true)} />
              
              {filteredCustomers.length === 0 && (
                <div className="py-20 sm:py-40 text-center space-y-3">
                  <div className="h-14 w-14 sm:h-20 sm:w-20 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Activity size={28} className="text-slate-200 animate-pulse" />
                  </div>
                  <h2 className="text-lg font-black italic uppercase tracking-tighter text-slate-900">No customers found</h2>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Try rechecking your search terms or filters</p>
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
    <div className="max-w-[1600px] mx-auto p-4 sm:p-10 space-y-6 sm:space-y-12 animate-pulse">
      <div className="space-y-4">
        <div className="h-6 w-32 bg-slate-100 rounded-full" />
        <div className="h-14 sm:h-24 w-11/12 sm:w-3/4 bg-slate-100 rounded-xl sm:rounded-[2.5rem]" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[1,2,3,4].map(i => <div key={i} className="h-44 sm:h-64 bg-slate-50 rounded-xl sm:rounded-[3.5rem]" />)}
      </div>
      <div className="h-[400px] sm:h-[800px] bg-slate-50 rounded-xl sm:rounded-[4.5rem]" />
    </div>
  );
}