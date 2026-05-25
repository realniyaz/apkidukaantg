"use client";

import { motion } from "framer-motion";
import { 
  ArrowDownLeft, 
  ArrowUpRight, 
  Package, 
  Clock, 
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
      <div className="py-20 text-center opacity-40 bg-white rounded-xl sm:rounded-[2rem] border border-slate-100">
        <Box size={40} className="mx-auto mb-3 text-slate-300" />
        <p className="font-black uppercase tracking-wider text-[10px] text-slate-400">No stock movements recorded</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden bg-white rounded-xl sm:rounded-[2rem] border border-slate-100 shadow-sm">
      <div className="w-full overflow-x-auto">
        <table className="w-full border-separate border-spacing-0 min-w-[600px]">
          <thead>
            <tr className="bg-slate-50/50 text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-100 italic">
              <th className="px-5 sm:px-8 py-4 text-left">Activity Type</th>
              <th className="px-5 sm:px-8 py-4 text-left">Quantity</th>
              <th className="px-5 sm:px-8 py-4 text-left w-32">Direction</th>
              <th className="px-5 sm:px-8 py-4 text-right w-36">Timestamp</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-50 font-semibold text-slate-700">
            {movements.map((m, idx) => {
              const isIncoming = m.direction === "IN";
              
              return (
                <motion.tr
                  key={m.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03, duration: 0.2 }}
                  className="group hover:bg-slate-50/40 transition-colors duration-150 cursor-default"
                >
                  {/* MOVEMENT TYPE */}
                  <td className="px-5 sm:px-8 py-4">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className={`h-9 w-9 rounded-xl flex items-center justify-center border shrink-0 transition-transform duration-300 group-hover:scale-105 ${
                        isIncoming ? 'bg-lime-50 border-lime-100/70 text-lime-600' : 'bg-red-50 border-red-100/70 text-red-500'
                      }`}>
                        <Package size={16} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-slate-900 font-black text-sm tracking-tight uppercase italic truncate">{m.movement_type}</p>
                        <p className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Stock Adjustment</p>
                      </div>
                    </div>
                  </td>

                  {/* QUANTITY */}
                  <td className="px-5 sm:px-8 py-4">
                    <div className="flex flex-col">
                      <span className={`text-base sm:text-lg font-black tabular-nums tracking-tight italic ${
                        isIncoming ? 'text-lime-600' : 'text-red-500'
                      }`}>
                        {isIncoming ? "+" : "-"}{m.quantity}
                      </span>
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wide">Units</span>
                    </div>
                  </td>

                  {/* DIRECTION VECTOR */}
                  <td className="px-5 sm:px-8 py-4">
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-wider italic shrink-0 ${
                      isIncoming 
                        ? 'bg-lime-50 text-lime-600 border-lime-200/60' 
                        : 'bg-slate-900 text-white border-slate-800'
                    }`}>
                      {isIncoming ? <ArrowDownLeft size={12} strokeWidth={2.5} /> : <ArrowUpRight size={12} strokeWidth={2.5} />}
                      {isIncoming ? 'Inbound' : 'Outbound'}
                    </div>
                  </td>

                  {/* TIMESTAMP */}
                  <td className="px-5 sm:px-8 py-4 text-right">
                    <div className="flex flex-col items-end shrink-0 font-medium">
                      <div className="flex items-center gap-1.5 text-slate-900">
                        <Clock size={12} className="text-slate-300 shrink-0" />
                        <span className="text-sm font-bold tabular-nums italic">
                          {new Date(m.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wide mt-0.5 font-mono">
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
    </div>
  );
}