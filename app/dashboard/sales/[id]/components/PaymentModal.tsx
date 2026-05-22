"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, Wallet, CheckCircle, Loader2, AlertCircle, 
  Banknote, CreditCard, Smartphone, Landmark, Zap 
} from "lucide-react";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: { amount: number; mode: string }) => void;
  totalAmount: number; 
  isProcessing: boolean;
}

const MODES = [
  { id: 'CASH', icon: Banknote, label: 'Cash' },
  { id: 'UPI', icon: Smartphone, label: 'UPI' },
  { id: 'CARD', icon: CreditCard, label: 'Card' },
  { id: 'BANK', icon: Landmark, label: 'Bank' }, 
];

export default function PaymentModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  totalAmount, 
  isProcessing 
}: PaymentModalProps) {
  const [amountStr, setAmountStr] = useState<string>(totalAmount.toString());
  const [mode, setMode] = useState("CASH");

  const currentAmountNum = parseFloat(amountStr) || 0;

  useEffect(() => {
    if (isOpen) {
      setAmountStr(totalAmount.toString());
      setMode("CASH");
    }
  }, [totalAmount, isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const isOverpaying = currentAmountNum > (totalAmount + 0.01); 
  const canConfirm = currentAmountNum > 0 && !isOverpaying && !isProcessing;

  // --- 🟢 FIX: Sanitizing data for Backend API ---
  const handleFinalConfirm = () => {
    // Backend expects 'cash', 'upi', 'card', or 'bank' (All lowercase)
    const sanitizedMode = mode.toLowerCase();
    onConfirm({ 
      amount: currentAmountNum, 
      mode: sanitizedMode 
    });
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[200] p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.3)] w-full max-w-md overflow-hidden border border-slate-100"
          >
            {/* HEADER */}
            <div className="bg-slate-900 p-10 text-white relative overflow-hidden">
              <div className="absolute -top-10 -right-10 h-40 w-40 bg-lime-400/10 rounded-full blur-3xl" />
              <button 
                onClick={onClose} 
                className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors z-10"
              >
                <X size={20} />
              </button>
              
              <div className="flex items-center gap-5 relative z-10">
                <div className="h-14 w-14 bg-lime-400 rounded-2xl flex items-center justify-center shadow-lg shadow-lime-400/20 rotate-3">
                  <Wallet size={28} className="text-slate-900" />
                </div>
                <div>
                  <h2 className="text-2xl font-black italic tracking-tighter uppercase leading-none">Record Yield</h2>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mt-2 text-wrap">Settlement Protocol Alpha</p>
                </div>
              </div>
            </div>

            {/* BODY */}
            <div className="p-10 space-y-8">
              <div className="space-y-3">
                <div className="flex justify-between items-end px-1">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Input Amount (₹)</p>
                  <button 
                    type="button"
                    onClick={() => setAmountStr(totalAmount.toString())} 
                    className="text-[9px] font-black text-lime-600 uppercase tracking-widest hover:text-lime-500 transition-colors"
                  >
                    Set Max: ₹{totalAmount.toLocaleString()}
                  </button>
                </div>
                <div className="relative group">
                  <input
                    type="number"
                    step="0.01"
                    value={amountStr}
                    onChange={(e) => setAmountStr(e.target.value)}
                    placeholder="0.00"
                    className={`w-full bg-slate-50 border-2 rounded-3xl px-8 py-6 text-3xl font-black italic tracking-tighter outline-none transition-all tabular-nums shadow-inner ${
                      isOverpaying 
                      ? 'border-red-200 text-red-600 focus:border-red-500' 
                      : 'border-slate-100 text-slate-900 focus:border-lime-500 focus:bg-white'
                    }`}
                  />
                </div>
              </div>

              {/* MODE SELECTOR */}
              <div className="space-y-4">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Uplink Mode</p>
                <div className="grid grid-cols-4 gap-3">
                  {MODES.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setMode(m.id)}
                      className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-300 ${
                        mode === m.id 
                        ? 'border-slate-900 bg-slate-900 scale-105 shadow-xl shadow-slate-900/20' 
                        : 'border-slate-50 bg-slate-50 hover:border-slate-200'
                      }`}
                    >
                      <m.icon size={20} className={mode === m.id ? 'text-lime-400' : 'text-slate-400'} />
                      <span className={`text-[8px] font-black mt-2 tracking-widest leading-none ${mode === m.id ? 'text-white' : 'text-slate-400'}`}>
                        {m.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isProcessing}
                  className="flex-1 py-5 text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] hover:text-slate-900 transition-all active:scale-95 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleFinalConfirm} // ✅ Using our new sanitizing function
                  disabled={!canConfirm}
                  className="flex-[2.5] bg-slate-900 hover:bg-black text-white py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] transition-all shadow-2xl flex items-center justify-center gap-3 active:scale-95 disabled:opacity-30 disabled:grayscale"
                >
                  {isProcessing ? (
                    <Loader2 className="animate-spin text-lime-400" size={18} />
                  ) : (
                    <>
                      Confirm Entry
                      <Zap size={16} fill="currentColor" className="text-lime-400" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}