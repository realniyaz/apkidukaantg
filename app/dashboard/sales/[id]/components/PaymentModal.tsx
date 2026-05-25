"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, Wallet, Loader2, Zap,
  Banknote, CreditCard, Smartphone, Landmark 
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

  const handleFinalConfirm = () => {
    const sanitizedMode = mode.toLowerCase();
    onConfirm({ 
      amount: currentAmountNum, 
      mode: sanitizedMode 
    });
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[200] p-4 overflow-y-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 15 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="bg-white rounded-2xl sm:rounded-[3rem] shadow-xl w-full max-w-md overflow-hidden border border-slate-100 my-auto"
          >
            {/* HEADER */}
            <div className="bg-slate-900 p-5 sm:p-10 text-white relative overflow-hidden">
              <div className="absolute -top-10 -right-10 h-40 w-40 bg-lime-400/5 rounded-full blur-3xl pointer-events-none" />
              <button 
                onClick={onClose} 
                className="absolute top-5 sm:top-8 right-5 sm:right-8 text-slate-500 hover:text-white transition-colors z-10 p-1"
              >
                <X size={18} />
              </button>
              
              <div className="flex items-center gap-4 sm:gap-5 relative z-10">
                <div className="h-11 w-11 sm:h-14 sm:w-14 bg-lime-400 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 shadow-md">
                  <Wallet size={22} className="text-slate-900" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-2xl font-black italic tracking-tighter uppercase leading-none">Record Payment</h2>
                  <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-wider mt-1.5 sm:mt-2">Process transaction settlement</p>
                </div>
              </div>
            </div>

            {/* BODY */}
            <div className="p-5 sm:p-10 space-y-5 sm:space-y-8">
              <div className="space-y-1.5 sm:space-y-3">
                <div className="flex justify-between items-end px-0.5">
                  <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider">Payment Amount (₹)</p>
                  <button 
                    type="button"
                    onClick={() => setAmountStr(totalAmount.toString())} 
                    className="text-[9px] sm:text-[10px] font-black text-lime-600 uppercase tracking-wider hover:text-lime-500 transition-colors"
                  >
                    Use Max: ₹{totalAmount.toLocaleString('en-IN')}
                  </button>
                </div>
                <div className="relative group">
                  <input
                    type="number"
                    step="0.01"
                    value={amountStr}
                    onChange={(e) => setAmountStr(e.target.value)}
                    placeholder="0.00"
                    className={`w-full bg-slate-50 border-2 rounded-xl sm:rounded-2xl px-4 sm:px-6 py-3.5 sm:py-5 text-xl sm:text-3xl font-black italic tracking-tight outline-none transition-all tabular-nums shadow-inner ${
                      isOverpaying 
                      ? 'border-red-200 text-red-600 focus:border-red-500' 
                      : 'border-slate-100 text-slate-900 focus:border-lime-500 focus:bg-white'
                    }`}
                  />
                </div>
              </div>

              {/* MODE SELECTOR */}
              <div className="space-y-2.5 sm:space-y-4">
                <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider px-0.5">Payment Method</p>
                <div className="grid grid-cols-4 gap-2 sm:gap-3">
                  {MODES.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setMode(m.id)}
                      className={`flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl border-2 transition-all duration-200 ${
                        mode === m.id 
                        ? 'border-slate-900 bg-slate-900 shadow-md' 
                        : 'border-slate-50 bg-slate-50 hover:border-slate-200'
                      }`}
                    >
                      <m.icon size={18} className={mode === m.id ? 'text-lime-400' : 'text-slate-400'} />
                      <span className={`text-[8px] font-black mt-1.5 tracking-wider leading-none ${mode === m.id ? 'text-white' : 'text-slate-400'}`}>
                        {m.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex gap-3 sm:gap-4 pt-2 border-t border-slate-50">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isProcessing}
                  className="flex-1 py-3 text-slate-400 font-black text-[10px] uppercase tracking-wider hover:text-slate-900 transition-all active:scale-95 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleFinalConfirm}
                  disabled={!canConfirm}
                  className="flex-[2.5] bg-slate-900 hover:bg-black text-white py-3 h-11 sm:h-12 rounded-xl font-black text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 active:scale-95 disabled:opacity-30 disabled:grayscale"
                >
                  {isProcessing ? (
                    <Loader2 className="animate-spin text-lime-400" size={16} />
                  ) : (
                    <>
                      <span>Confirm Payment</span>
                      <Zap size={14} fill="currentColor" className="text-lime-400" />
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