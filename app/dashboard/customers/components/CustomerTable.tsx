"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Phone, ShieldCheck, ArrowUpRight, 
  Settings2, Loader2, CreditCard, 
  UserMinus, UserCheck
} from "lucide-react";
import Link from "next/link";
import { apiRequest } from "@/lib/api";

interface CustomerTableProps {
  customers: any[];
  onRefresh: () => void;
}

export default function CustomerTable({ customers, onRefresh }: CustomerTableProps) {
  const [processingId, setProcessingId] = useState<number | null>(null);

  const handleDeactivate = async (id: number, currentStatus: boolean) => {
    const action = currentStatus ? "Deactivate" : "Reactivate";
    if (!confirm(`Are you sure you want to ${action.toLowerCase()} this customer account?`)) return;

    setProcessingId(id);
    try {
      // DELETE /customers/{id} toggles structural status rules
      await apiRequest(`customers/${id}`, { method: "DELETE" });
      onRefresh();
    } catch (error: any) {
      console.error("Failed to update customer status:", error.message);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="w-full overflow-hidden bg-white rounded-xl sm:rounded-[2rem] border border-slate-100 shadow-sm">
      <div className="w-full overflow-x-auto selection:bg-lime-500/10">
        <table className="w-full border-separate border-spacing-0 min-w-[800px]">
          <thead>
            <tr className="bg-slate-50/50 text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-100 italic">
              <th className="px-5 sm:px-8 py-4 text-left">Customer Details</th>
              <th className="px-5 sm:px-8 py-4 text-left w-44">Phone Number</th>
              <th className="px-5 sm:px-8 py-4 text-left w-52">Credit Framework</th>
              <th className="px-5 sm:px-8 py-4 text-left w-36">Account Status</th>
              <th className="px-5 sm:px-8 py-4 text-right w-44">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 font-semibold text-slate-700">
            {customers.map((c, idx) => (
              <motion.tr 
                key={c.id}
                initial={{ opacity: 0, y: 6 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: idx * 0.02, duration: 0.2 }}
                className="group hover:bg-slate-50/40 transition-colors duration-150 cursor-default"
              >
                {/* CUSTOMER PROFILE IDENTITY */}
                <td className="px-5 sm:px-8 py-4">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="h-11 w-11 rounded-xl bg-slate-900 text-lime-400 flex items-center justify-center font-black italic text-lg shadow-sm shrink-0 transition-colors group-hover:bg-lime-500 group-hover:text-slate-900 duration-300">
                      {c.name ? c.name.charAt(0).toUpperCase() : "?"}
                    </div>
                    <div className="min-w-0">
                      <p className="text-slate-900 font-black text-sm tracking-tight uppercase italic truncate leading-none mb-1.5">{c.name}</p>
                      <p className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1 truncate">
                        <ShieldCheck size={11} className={c.is_active ? "text-lime-600 shrink-0" : "text-slate-300 shrink-0"} /> 
                        {c.is_active ? "Verified Profile" : "Awaiting Review"}
                      </p>
                    </div>
                  </div>
                </td>
                
                {/* MOBILE CONTACT */}
                <td className="px-5 sm:px-8 py-4">
                  <div className="flex items-center gap-2 text-slate-600 shrink-0">
                    <Phone size={13} className="text-slate-300 shrink-0" />
                    <span className="text-sm font-bold tabular-nums tracking-tight">{c.phone || "---"}</span>
                  </div>
                </td>

                {/* CREDIT SYSTEM POLICIES */}
                <td className="px-5 sm:px-8 py-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center border shrink-0 ${c.is_credit_allowed ? 'bg-blue-50 border-blue-100 text-blue-600' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                      <CreditCard size={13} />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-slate-900 text-sm font-black italic tabular-nums tracking-tight leading-none mb-1">
                        {c.is_credit_allowed ? `₹${Number(c.credit_limit).toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : "Cash Terms Only"}
                      </span>
                      <span className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-wide">
                        {c.is_credit_allowed ? `Limit / ${c.credit_days} Days Payment` : "Upfront Settlement"}
                      </span>
                    </div>
                  </div>
                </td>

                {/* VISUAL STATUS PILL */}
                <td className="px-5 sm:px-8 py-4">
                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border italic shrink-0 transition-colors duration-300 ${
                    c.is_active 
                      ? 'bg-lime-50 text-lime-600 border-lime-100 shadow-sm' 
                      : 'bg-red-50 text-red-500 border-red-100'
                  }`}>
                    <div className={`h-1.5 w-1.5 rounded-full ${c.is_active ? 'bg-lime-500' : 'bg-red-500 animate-pulse'}`} />
                    {c.is_active ? "Active" : "Suspended"}
                  </div>
                </td>

                {/* ACTION CONSOLES */}
                <td className="px-5 sm:px-8 py-4 text-right">
                  <div className="flex items-center justify-end gap-2.5 shrink-0">
                    {/* UPDATE RECORD LINK */}
                    <Link 
                      href={`/dashboard/customers/edit/${c.id}`}
                      className="h-9 w-9 bg-white border border-slate-100 rounded-lg flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-600 transition-all shadow-sm active:scale-95 shrink-0"
                      title="Edit Customer Profile"
                    >
                      <Settings2 size={16} />
                    </Link>

                    {/* STATUS LIFECYCLE TOGGLE BUTTON */}
                    <button 
                      onClick={() => handleDeactivate(c.id, c.is_active)}
                      disabled={processingId === c.id}
                      className={`h-9 w-9 border rounded-lg flex items-center justify-center transition-all shadow-sm active:scale-95 shrink-0 ${
                        c.is_active 
                          ? 'bg-white border-slate-100 text-slate-300 hover:text-red-500 hover:border-red-200' 
                          : 'bg-red-50 border-red-100 text-red-600 hover:bg-lime-500 hover:text-white'
                      }`}
                      title={c.is_active ? "Deactivate Customer" : "Reactivate Customer"}
                    >
                      {processingId === c.id ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        c.is_active ? <UserMinus size={16} /> : <UserCheck size={16} />
                      )}
                    </button>

                    {/* DEEP ACCOUNT DASHBOARD REDIRECT LINK */}
                    <Link 
                      href={`/dashboard/customers/${c.public_id}`} 
                      className="h-9 w-9 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all shadow-sm shrink-0 active:scale-95"
                      title="View Detailed Balance History"
                    >
                      <ArrowUpRight size={16} />
                    </Link>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}