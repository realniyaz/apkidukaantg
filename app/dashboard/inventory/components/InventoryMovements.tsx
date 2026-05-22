"use client";

import { motion } from "framer-motion";
import { 
  ArrowDownLeft, 
  ArrowUpRight, 
  Package, 
  Clock, 
  Activity,
  Box
} from "lucide-react";

interface Movement {
  id: number;
  movement_type: string;
  quantity: number;
  direction: "IN" | "OUT";
  created_at: string;
}

export default function InventoryMovements({ movements }: { movements: Movement[] }) {
  if (!movements || movements.length === 0) {
    return (
      <div className="py-20 text-center opacity-20">
        <Box size={48} className="mx-auto mb-4" />
        <p className="font-black uppercase tracking-widest text-[10px]">No Neural Movements Detected</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-slate-100 italic">
            <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Log Identifier</th>
            <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Volume</th>
            <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Vector</th>
            <th className="px-8 py-6 text-right text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Timestamp</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-50 font-bold">
          {movements.map((m, idx) => {
            const isIncoming = m.direction === "IN";
            
            return (
              <motion.tr
                key={m.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group hover:bg-slate-50/80 transition-all duration-300"
              >
                {/* MOVEMENT TYPE */}
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center border transition-transform group-hover:rotate-12 ${
                      isIncoming ? 'bg-lime-50 border-lime-100 text-lime-600' : 'bg-red-50 border-red-100 text-red-600'
                    }`}>
                      <Package size={18} />
                    </div>
                    <div>
                      <p className="text-slate-900 uppercase italic tracking-tight">{m.movement_type}</p>
                      <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Neural Transaction</p>
                    </div>
                  </div>
                </td>

                {/* QUANTITY */}
                <td className="px-8 py-6">
                  <div className="flex flex-col">
                    <span className="text-xl font-black tabular-nums tracking-tighter text-slate-900">
                      {isIncoming ? "+" : "-"}{m.quantity}
                    </span>
                    <span className="text-[9px] text-slate-400 font-black uppercase">Units</span>
                  </div>
                </td>

                {/* DIRECTION VECTOR */}
                <td className="px-8 py-6">
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-[10px] font-black uppercase tracking-widest ${
                    isIncoming 
                      ? 'bg-lime-500 text-white border-lime-600 shadow-lg shadow-lime-500/20' 
                      : 'bg-slate-900 text-white border-slate-800'
                  }`}>
                    {isIncoming ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} />}
                    {m.direction}
                  </div>
                </td>

                {/* TIMESTAMP */}
                <td className="px-8 py-6 text-right">
                  <div className="flex flex-col items-end">
                    <div className="flex items-center gap-2 text-slate-900">
                      <Clock size={12} className="text-slate-300" />
                      <span className="text-sm font-black tabular-nums italic">
                        {new Date(m.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <span className="text-[9px] text-slate-400 font-black uppercase tracking-tighter">
                      {new Date(m.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                    </span>
                  </div>
                </td>
              </motion.tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}