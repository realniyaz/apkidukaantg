"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Wallet, Loader2, Zap, Banknote, CreditCard, Smartphone, Landmark } from "lucide-react";
import { apiRequest } from "@/lib/api";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: { amount: number; mode: string }) => void;
  totalAmount: number;
  isProcessing: boolean;
  saleId: number | undefined;
  saleStatus: string | undefined;
}

const MODES = [
  { id: 'CASH', icon: Banknote, label: 'Cash' },
  { id: 'UPI', icon: Smartphone, label: 'UPI' },
  { id: 'CARD', icon: CreditCard, label: 'Card' },
  { id: 'BANK', icon: Landmark, label: 'Bank' }, 
];

export default function PaymentModal({ 
  isOpen, onClose, onConfirm, totalAmount, isProcessing, saleId, saleStatus 
}: PaymentModalProps) {
  const [amountStr, setAmountStr] = useState((totalAmount || 0).toString());
  const [mode, setMode] = useState("CASH");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setAmountStr((totalAmount || 0).toString());
      setMode("CASH");
    }
  }, [totalAmount, isOpen]);

  const handleConfirm = async () => {
    if (!saleId) return;
    setLoading(true);
    
    try {
      // 1. SMART WORKFLOW: If draft, post it first
      const status = (saleStatus || 'DRAFT').toLowerCase();
      if (status === 'draft') {
        await apiRequest(`sales/${saleId}/post`, { method: "POST" });
      }
      
      // 2. RECORD PAYMENT
      await onConfirm({ 
        amount: parseFloat(amountStr) || 0, 
        mode: mode.toLowerCase() 
      });
      
      onClose();
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-[200] p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl relative z-10">
            <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
              <h2 className="text-sm font-black uppercase tracking-widest">Record Payment</h2>
              <button onClick={onClose}><X size={18} /></button>
            </div>
            <div className="p-6 space-y-6">
              <input type="number" value={amountStr} onChange={(e) => setAmountStr(e.target.value)} className="w-full bg-slate-50 text-2xl font-black p-4 rounded-xl outline-none" />
              <div className="grid grid-cols-4 gap-2">
                {MODES.map((m) => (
                  <button key={m.id} onClick={() => setMode(m.id)} className={`p-3 rounded-xl border-2 ${mode === m.id ? 'bg-slate-900 text-lime-400' : 'bg-slate-50'}`}>
                    <m.icon size={18} className="mx-auto" />
                  </button>
                ))}
              </div>
              <button onClick={handleConfirm} disabled={loading} className="w-full py-4 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest">
                {loading ? <Loader2 className="animate-spin mx-auto" size={16} /> : "Confirm Payment"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}