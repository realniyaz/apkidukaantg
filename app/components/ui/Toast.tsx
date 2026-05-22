"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, X, Zap, Info } from "lucide-react";
import { useEffect } from "react";

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  type?: "success" | "info";
}

export default function Toast({ message, isVisible, onClose, type = "success" }: ToastProps) {
  // Auto-close logic: 4 seconds
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 4000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9, x: "-50%" }}
          animate={{ opacity: 1, y: 0, scale: 1, x: "-50%" }}
          exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
          className="fixed bottom-10 left-1/2 z-[100] min-w-[350px] pointer-events-none"
        >
          <div className="bg-slate-900 border border-white/10 rounded-[2rem] p-5 shadow-[0_30px_70px_rgba(0,0,0,0.4)] flex items-center justify-between gap-6 pointer-events-auto relative overflow-hidden group">
            
            <div className="flex items-center gap-4">
              {/* ICON NODE */}
              <div className={`h-11 w-11 rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:rotate-12 ${
                type === "success" 
                ? "bg-lime-500 text-slate-900 shadow-lime-500/20" 
                : "bg-blue-500 text-white shadow-blue-500/20"
              }`}>
                {type === "success" ? <CheckCircle2 size={22} /> : <Info size={22} />}
              </div>

              {/* TEXT CONTENT */}
              <div className="flex flex-col">
                <p className={`text-[10px] font-black uppercase tracking-[0.25em] italic flex items-center gap-1.5 ${
                  type === "success" ? "text-lime-500" : "text-blue-400"
                }`}>
                  <Zap size={10} fill="currentColor" /> System Notification
                </p>
                <p className="text-sm font-black text-white uppercase italic tracking-tighter mt-0.5">
                  {message}
                </p>
              </div>
            </div>
            
            {/* CLOSE ACTION */}
            <button 
              onClick={onClose}
              className="p-2 text-slate-500 hover:text-white hover:bg-white/5 rounded-xl transition-all active:scale-90"
            >
              <X size={18} />
            </button>
            
            {/* NEURAL PROGRESS BAR */}
            <motion.div 
              initial={{ width: "100%" }}
              animate={{ width: 0 }}
              transition={{ duration: 4, ease: "linear" }}
              className={`absolute bottom-0 left-8 right-8 h-[2px] rounded-full opacity-40 ${
                type === "success" ? "bg-lime-500" : "bg-blue-400"
              }`}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}