"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Phone, ShieldCheck, ArrowUpRight, 
  Trash2, Settings2, Loader2, CreditCard, 
  UserMinus, UserCheck, AlertCircle 
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
    // Professional Confirmation
    const action = currentStatus ? "Deactivate" : "Reactivate";
    if (!confirm(`${action} this entity within the neural ledger?`)) return;

    setProcessingId(id);
    try {
      // DELETE /customers/{id} for deactivation
      await apiRequest(`customers/${id}`, { method: "DELETE" });
      onRefresh();
    } catch (error: any) {
      console.error("Neural Sync Error:", error.message);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="w-full overflow-x-auto selection:bg-lime-500/30">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-slate-100 italic">
            <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Client Identity</th>
            <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Uplink Vector</th>
            <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Fiscal Terms</th>
            <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Integrity</th>
            <th className="px-8 py-6 text-right text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Operations</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50 font-bold">
          {customers.map((c, idx) => (
            <motion.tr 
              key={c.id}
              initial={{ opacity: 0, x: -10 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ delay: idx * 0.03 }}
              className="group hover:bg-slate-50/80 transition-all duration-300"
            >
              {/* IDENTITY */}
              <td className="px-8 py-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-[1.2rem] bg-slate-900 text-lime-500 flex items-center justify-center font-black italic text-xl shadow-lg border border-slate-800 group-hover:bg-lime-500 group-hover:text-slate-900 transition-all duration-500">
                    {c.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-slate-900 uppercase italic text-base tracking-tighter leading-none mb-1">{c.name}</p>
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest flex items-center gap-1">
                      <ShieldCheck size={10} className={c.is_active ? "text-lime-500" : "text-slate-300"} /> 
                      {c.is_active ? "Verified Entity" : "Status Pending"}
                    </p>
                  </div>
                </div>
              </td>
              
              {/* CONTACT */}
              <td className="px-8 py-6">
                <div className="flex items-center gap-2 text-slate-600">
                  <Phone size={14} className="text-slate-300" />
                  <span className="text-sm font-black tabular-nums tracking-tight">{c.phone}</span>
                </div>
              </td>

              {/* CREDIT VECTOR */}
              <td className="px-8 py-6">
                <div className="flex items-center gap-3">
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center border ${c.is_credit_allowed ? 'bg-blue-50 border-blue-100 text-blue-600' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                    <CreditCard size={14} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-slate-900 text-sm font-black italic tabular-nums leading-none mb-1">
                      {c.is_credit_allowed ? `₹${Number(c.credit_limit).toLocaleString()}` : "PRE-PAID_ONLY"}
                    </span>
                    <span className="text-[9px] text-slate-400 font-black uppercase tracking-tighter">
                      {c.is_credit_allowed ? `Limit / ${c.credit_days} Days` : "Direct Settlement"}
                    </span>
                  </div>
                </div>
              </td>

              {/* INTEGRITY STATUS */}
              <td className="px-8 py-6">
                <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border italic transition-all ${
                  c.is_active 
                  ? 'bg-lime-50 text-lime-600 border-lime-100 shadow-sm shadow-lime-100' 
                  : 'bg-red-50 text-red-600 border-red-100'
                }`}>
                  <div className={`h-1.5 w-1.5 rounded-full ${c.is_active ? 'bg-lime-500' : 'bg-red-500 animate-pulse'}`} />
                  {c.is_active ? "Operational" : "Deactivated"}
                </div>
              </td>

              {/* OPERATIONS */}
              <td className="px-8 py-6 text-right">
                <div className="flex items-center justify-end gap-3">
                  {/* UPDATE LINK */}
                  <Link 
                    href={`/dashboard/customers/edit/${c.id}`}
                    className="h-10 w-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-600 transition-all shadow-sm active:scale-90"
                    title="Update Parameters"
                  >
                    <Settings2 size={18} />
                  </Link>

                  {/* DEACTIVATE TOGGLE */}
                  <button 
                    onClick={() => handleDeactivate(c.id, c.is_active)}
                    disabled={processingId === c.id}
                    className={`h-10 w-10 border rounded-xl flex items-center justify-center transition-all shadow-sm active:scale-90 ${
                      c.is_active 
                      ? 'bg-white border-slate-100 text-slate-300 hover:text-red-600 hover:border-red-200' 
                      : 'bg-red-50 border-red-100 text-red-600 hover:bg-lime-500 hover:text-white'
                    }`}
                    title={c.is_active ? "Deactivate Entity" : "Reactivate Entity"}
                  >
                    {processingId === c.id ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      c.is_active ? <UserMinus size={18} /> : <UserCheck size={18} />
                    )}
                  </button>

                  {/* EXTERNAL VIEW */}
                  <Link 
                    href={`/dashboard/customers/${c.public_id}`} 
                    className="h-10 w-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all shadow-sm"
                  >
                    <ArrowUpRight size={18} />
                  </Link>
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}