"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { apiRequest } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, UserPlus, Search, BrainCircuit, 
  Mail, Phone, ChevronRight, Activity, 
  Fingerprint, Database, Zap, Loader2
} from "lucide-react";
import Link from "next/link";

export default function AICustomersManifest() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiRequest<any[]>("/customers/");
      setCustomers(data || []);
    } catch (err) {
      console.error("Registry Sync Failure:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCustomers(); }, [fetchCustomers]);

  const filteredNodes = useMemo(() => {
    const term = searchQuery.toLowerCase();
    return customers.filter(c => 
      c.name.toLowerCase().includes(term) ||
      c.phone?.includes(term)
    );
  }, [customers, searchQuery]);

  if (loading) return <LoadingTerminal label="Establishing Neural Link to Client Registry..." />;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-[1600px] mx-auto p-6 md:p-10 space-y-12 pb-32 selection:bg-lime-500/30">
      
      {/* EXECUTIVE HEADER */}
      <header className="flex flex-col xl:flex-row justify-between items-end gap-8 border-b border-slate-100 pb-12">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-lime-600 font-black text-[10px] uppercase tracking-[0.4em] bg-lime-50 w-fit px-4 py-2 rounded-full border border-lime-100">
            <BrainCircuit size={14} className="animate-pulse" /> 
            Intelligence Node: Risk Manifest
          </div>
          <h1 className="text-7xl font-black text-slate-900 tracking-tighter uppercase italic leading-[0.85]">
            Client <span className="text-slate-200">Analysis</span>
          </h1>
          <p className="text-slate-400 font-medium italic text-lg leading-relaxed max-w-2xl">
            Registry holds <span className="text-slate-900 font-black">{customers.length} identities</span>. 
            Ready for individual Trust Vector deep-scans.
          </p>
        </div>

        <div className="flex items-center gap-4 w-full xl:w-auto">
          <div className="flex-1 xl:flex-none flex items-center gap-4 bg-white border border-slate-100 rounded-[2rem] px-8 py-5 shadow-xl shadow-slate-200/20 group focus-within:ring-4 focus-within:ring-lime-500/5 transition-all">
            <Search size={20} className="text-slate-300 group-focus-within:text-lime-500 transition-colors" />
            <input 
              type="text" placeholder="Search Identity Node..." 
              value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent outline-none text-sm font-black italic w-full xl:w-64 uppercase tracking-tighter" 
            />
          </div>
          <Link href="/dashboard/customers/create" className="bg-slate-900 text-white px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-2xl active:scale-95 flex items-center gap-3">
             <UserPlus size={18} className="text-lime-400" /> Provision Node
          </Link>
        </div>
      </header>

      {/* REGISTRY TABLE */}
      <div className="bg-white rounded-[4rem] border border-slate-100 shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 right-0 p-20 opacity-[0.02] pointer-events-none">
          <Database size={500} />
        </div>

        <div className="p-10 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
          <h4 className="text-[11px] font-black uppercase tracking-[0.5em] text-slate-400 italic">Active Personnel Nodes ({filteredNodes.length})</h4>
          <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-xl border border-slate-100 shadow-sm">
             <div className="h-2 w-2 bg-lime-500 rounded-full animate-ping" />
             <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none">Uplink Stable</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/20 border-b border-slate-50">
                <th className="px-12 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] italic">Identity Node</th>
                <th className="px-12 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] italic">Contact Link</th>
                <th className="px-12 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] italic text-center">Risk Vector</th>
                <th className="px-12 py-8 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] italic">Terminal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredNodes.map((node) => (
                <tr key={node.id} className="group hover:bg-slate-50/80 transition-all duration-300">
                  <td className="px-12 py-10">
                    <div className="flex items-center gap-6">
                      <div className="h-16 w-16 rounded-[1.5rem] bg-slate-900 flex items-center justify-center text-lime-400 text-xl font-black border-4 border-slate-800 shadow-2xl group-hover:rotate-3 transition-transform uppercase italic">
                        {node.name.slice(0, 2)}
                      </div>
                      <div className="space-y-1">
                        <Link href={`/dashboard/customers/${node.id}`} className="font-black text-slate-900 uppercase italic tracking-tighter text-xl hover:text-lime-600 transition-colors block">
                          {node.name}
                        </Link>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                           <Fingerprint size={12}/> UUID: NODE-{node.id}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-12 py-10">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-3 text-slate-700 font-bold text-sm"><Phone size={14} className="text-slate-300"/> {node.phone || "UNLINKED"}</div>
                      <div className="flex items-center gap-3 text-slate-400 font-medium text-xs lowercase italic"><Mail size={14} className="text-slate-300"/> {node.email}</div>
                    </div>
                  </td>
                  <td className="px-12 py-10 text-center">
                    <Link href={`/dashboard/ai/customer/${node.id}`} className="inline-flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl hover:bg-lime-500 hover:text-slate-900 transition-all group/ai shadow-xl active:scale-95">
                      <BrainCircuit size={18} className="text-lime-400 group-hover/ai:text-slate-900" />
                      <span className="text-[11px] font-black uppercase tracking-widest">Execute Deep Scan</span>
                    </Link>
                  </td>
                  <td className="px-12 py-10 text-right">
                    <Link href={`/dashboard/ai/customer/${node.id}`} className="h-14 w-14 bg-white border border-slate-100 shadow-md rounded-2xl inline-flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-900 transition-all group-hover:translate-x-2">
                      <ChevronRight size={24} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}

function LoadingTerminal({ label }: { label: string }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDFDFD]">
      <div className="relative">
        <Loader2 className="animate-spin text-slate-900" size={60} />
        <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-lime-500" size={24} />
      </div>
      <p className="mt-8 font-black text-slate-900 uppercase tracking-[0.5em] text-[11px] italic animate-pulse">{label}</p>
    </div>
  );
}