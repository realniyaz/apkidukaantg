"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { apiRequest } from "@/lib/api";
import { motion } from "framer-motion";
import { 
  Users, UserPlus, Search, BrainCircuit, 
  Mail, Phone, ChevronRight, Fingerprint, 
  Database, Zap, Loader2
} from "lucide-react";
import Link from "next/link";

interface CustomerNode {
  id: number;
  name: string;
  phone?: string;
  email?: string;
}

export default function CustomersManifest() {
  const [customers, setCustomers] = useState<CustomerNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiRequest<CustomerNode[]>("/customers/");
      setCustomers(data || []);
    } catch (err) {
      console.error("Failed to sync customer profile records:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCustomers(); }, [fetchCustomers]);

  const filteredNodes = useMemo(() => {
    const term = searchQuery.toLowerCase().trim();
    return customers.filter(c => 
      c.name.toLowerCase().includes(term) ||
      (c.phone && c.phone.includes(term))
    );
  }, [customers, searchQuery]);

  if (loading) return <LoadingTerminal label="Loading customer directory records..." />;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8 pb-32 text-slate-900 w-full"
    >
      {/* EXECUTIVE HEADER */}
      <header className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-4 sm:gap-6 border-b border-slate-100 pb-6 sm:pb-8">
        <div className="space-y-2 sm:space-y-3 w-full lg:w-auto min-w-0">
          <div className="flex items-center gap-1.5 text-lime-600 font-black text-[9px] sm:text-[10px] uppercase tracking-wider bg-lime-50 w-fit px-3 py-1.5 rounded-full border border-lime-100/60">
            <BrainCircuit size={12} className="shrink-0" /> 
            AI-Powered Insights
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight uppercase italic leading-none truncate pr-1">
            Customer <span className="text-slate-300">Directory</span>
          </h1>
          <p className="text-slate-400 font-medium text-xs sm:text-sm">
            Managing <span className="text-slate-900 font-black font-mono">#{customers.length} verified customer profiles</span>. Ready for deep credit velocity analysis.
          </p>
        </div>

        {/* CONTROLS AREA */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto pt-2 lg:pt-0">
          <div className="w-full sm:w-auto flex-1 sm:flex-none flex items-center gap-3 bg-white border border-slate-100 rounded-xl sm:rounded-2xl h-12 px-4 shadow-sm focus-within:ring-4 focus-within:ring-lime-500/5 focus-within:border-lime-500/30 transition-all group">
            <Search size={16} className="text-slate-300 group-focus-within:text-lime-500 transition-colors shrink-0" />
            <input 
              type="text" 
              placeholder="Search by name or number..." 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent outline-none text-sm font-semibold w-full sm:w-48 placeholder:font-normal text-slate-800 shadow-none" 
            />
          </div>
          <Link 
            href="/dashboard/customers/create" 
            className="w-full sm:w-auto bg-slate-900 text-white h-12 px-6 rounded-xl font-black text-xs uppercase tracking-wider hover:bg-black transition-all shadow-md flex items-center justify-center gap-2 shrink-0 active:scale-[0.99]"
          >
             <UserPlus size={16} className="text-lime-400 shrink-0" /> New Customer
          </Link>
        </div>
      </header>

      {/* REGISTRY CARD DATA CORE */}
      <div className="bg-white rounded-xl sm:rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden relative w-full">
        <div className="absolute top-0 right-0 p-10 opacity-[0.01] pointer-events-none hidden lg:block">
          <Database size={400} />
        </div>

        <div className="p-4 sm:p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/40 gap-4 shrink-0">
          <h4 className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-slate-400 italic truncate">Registered Accounts ({filteredNodes.length})</h4>
          <div className="flex items-center gap-2 px-2.5 py-1 bg-white rounded-md border border-slate-100 shadow-sm shrink-0">
             <div className="h-1.5 w-1.5 bg-lime-500 rounded-full animate-pulse shrink-0" />
             <span className="text-[9px] sm:text-[10px] font-bold text-slate-700 uppercase font-mono tracking-tight">Database Synced</span>
          </div>
        </div>

        {/* SCROLL CONTAINER SHIELD */}
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-0 min-w-[900px]">
            <thead>
              <tr className="bg-slate-50/20 text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-100 italic">
                <th className="px-6 sm:px-8 py-4">Customer Details</th>
                <th className="px-6 sm:px-8 py-4 w-60">Contact Insets</th>
                <th className="px-6 sm:px-8 py-4 text-center w-52">AI Analytics</th>
                <th className="px-6 sm:px-8 py-4 text-right w-24">Profile</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 font-semibold text-slate-700">
              {filteredNodes.map((node, idx) => (
                <tr key={node.id} className="group hover:bg-slate-50/40 transition-colors duration-150 cursor-default">
                  {/* IDENTITY */}
                  <td className="px-6 sm:px-8 py-4">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-xl bg-slate-900 text-lime-400 flex items-center justify-center text-sm font-black border border-slate-800 shadow-sm shrink-0 transition-transform duration-300 group-hover:scale-102 uppercase italic font-mono">
                        {node.name ? node.name.slice(0, 2) : "??"}
                      </div>
                      <div className="min-w-0">
                        <Link 
                          href={`/dashboard/customers/${node.id}`} 
                          className="font-black text-slate-900 uppercase italic tracking-tight text-sm hover:text-lime-600 transition-colors block truncate pr-2"
                        >
                          {node.name}
                        </Link>
                        <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1.5 mt-1 truncate">
                           <Fingerprint size={12} className="text-slate-300 shrink-0"/> ID: #{node.id}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* CONTACT GROUPS */}
                  <td className="px-6 sm:px-8 py-4">
                    <div className="flex flex-col gap-1 min-w-0 shrink-0">
                      <div className="flex items-center gap-2 text-slate-700 font-bold text-xs truncate">
                        <Phone size={12} className="text-slate-300 shrink-0"/> 
                        <span className="font-mono tabular-nums">{node.phone || "---"}</span>
                      </div>
                      {node.email && (
                        <div className="flex items-center gap-2 text-slate-400 font-medium text-[11px] truncate lowercase">
                          <Mail size={12} className="text-slate-300 shrink-0"/> 
                          <span>{node.email}</span>
                        </div>
                      )}
                    </div>
                  </td>

                  {/* AI RESTOCK REPORT ANALYSIS INSIGHTS */}
                  <td className="px-6 sm:px-8 py-4 text-center">
                    <Link 
                      href={`/dashboard/ai/customer/${node.id}`} 
                      className="inline-flex items-center justify-center gap-2 h-9 px-4 bg-slate-900 text-white rounded-lg hover:bg-lime-500 hover:text-slate-900 transition-all group/ai shadow-sm font-sans text-[10px] uppercase tracking-wider shrink-0 active:scale-[0.98]"
                    >
                      <BrainCircuit size={14} className="text-lime-400 group-hover/ai:text-slate-900 shrink-0" />
                      <span>Credit Insights</span>
                    </Link>
                  </td>

                  {/* NAV-FORWARD ELEMENT BUTTON */}
                  <td className="px-6 sm:px-8 py-4 text-right">
                    <Link 
                      href={`/dashboard/customers/${node.id}`} 
                      className="h-8 w-8 bg-slate-50 border border-slate-100 shadow-inner rounded-lg inline-flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-400 transition-all shrink-0 group-hover:translate-x-0.5"
                    >
                      <ChevronRight size={16} />
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
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="relative shrink-0">
        <Loader2 className="animate-spin text-slate-900" size={44} />
        <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-lime-500" size={16} />
      </div>
      <p className="mt-5 font-black text-slate-900 uppercase tracking-wider text-[10px] italic animate-pulse">{label}</p>
    </div>
  );
}