"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save, Loader2, Globe, BadgeIndianRupee, BellRing, ShieldCheck, Zap } from "lucide-react";
import { apiRequest } from "@/lib/api";

interface SettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialSettings: any;
  onSuccess: () => void;
}

export default function SettingsDrawer({ isOpen, onClose, initialSettings, onSuccess }: SettingsDrawerProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    currency: "INR",
    language: "English",
    timezone: "UTC",
    gst_enabled: true,
    low_stock_alert_enabled: true,
  });

  useEffect(() => {
    if (isOpen && initialSettings) {
      setFormData({
        currency: initialSettings.currency || "INR",
        language: initialSettings.language || "English",
        timezone: initialSettings.timezone || "UTC",
        gst_enabled: initialSettings.gst_enabled ?? true,
        low_stock_alert_enabled: initialSettings.low_stock_alert_enabled ?? true,
      });
    }
  }, [isOpen, initialSettings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiRequest("shop/settings", {
        method: "PATCH",
        body: JSON.stringify(formData),
      });
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to sync settings:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div 
          key="settings-overlay-wrapper"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6"
        >
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
          
          <motion.div 
            key="settings-modal-container"
            initial={{ scale: 0.96, opacity: 0, y: 15 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.96, opacity: 0, y: 15 }}
            className="relative w-full max-w-xl bg-white rounded-xl sm:rounded-[2.5rem] shadow-xl overflow-hidden flex flex-col font-bold my-auto max-h-[90vh]"
          >
            {/* HEADER */}
            <div className="p-5 sm:p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/40">
              <div className="space-y-1">
                <p className="text-[9px] sm:text-[10px] font-black text-lime-600 uppercase tracking-wider flex items-center gap-1.5">
                  <Zap size={12} fill="currentColor" className="shrink-0" /> Configuration
                </p>
                <h2 className="text-xl sm:text-2xl font-black uppercase italic tracking-tight text-slate-900">
                  Store <span className="text-slate-400">Settings</span>
                </h2>
              </div>
              <button onClick={onClose} className="text-slate-300 hover:text-red-500 transition-colors p-1"><X size={20} /></button>
            </div>

            {/* FORM CONTAINER */}
            <form id="settings-form" onSubmit={handleSubmit} className="p-5 sm:p-8 space-y-6 sm:space-y-8 overflow-y-auto max-h-[55vh] custom-scrollbar">
              
              <div className="space-y-4 sm:space-y-6">
                <SettingsSelect 
                  label="Primary Currency" 
                  value={formData.currency} 
                  options={["INR", "USD", "EUR", "GBP"]}
                  onChange={(v: string) => setFormData({...formData, currency: v})} 
                  icon={<BadgeIndianRupee size={16}/>} 
                />
                <SettingsSelect 
                  label="System Language" 
                  value={formData.language} 
                  options={["English", "Hindi", "Spanish", "French"]}
                  onChange={(v: string) => setFormData({...formData, language: v})} 
                  icon={<Globe size={16}/>} 
                />
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-100">
                <ToggleBlock 
                  label="GST Calculations" 
                  description="Enable automated tax calculations on orders"
                  isActive={formData.gst_enabled} 
                  onToggle={(v: boolean) => setFormData({...formData, gst_enabled: v})} 
                  icon={<ShieldCheck size={18}/>} 
                />
                <ToggleBlock 
                  label="Low Stock Alerts" 
                  description="Receive alerts for items hitting critical levels"
                  isActive={formData.low_stock_alert_enabled} 
                  onToggle={(v: boolean) => setFormData({...formData, low_stock_alert_enabled: v})} 
                  icon={<BellRing size={18}/>} 
                />
              </div>
            </form>

            {/* FOOTER ACTIONS */}
            <div className="p-4 sm:p-8 border-t border-slate-100 flex gap-3 sm:gap-4 bg-white items-center">
              <button type="button" onClick={onClose} className="flex-1 text-slate-400 uppercase text-xs tracking-wider font-black hover:text-slate-900 transition-colors py-3">Cancel</button>
              <button 
                type="submit" form="settings-form" disabled={loading}
                className="flex-[2] bg-slate-900 text-white h-11 sm:h-12 rounded-xl sm:rounded-[1.8rem] font-black uppercase text-xs tracking-wider flex items-center justify-center gap-2 hover:bg-black shadow-md transition-all active:scale-[0.99]"
              >
                {loading ? <Loader2 className="animate-spin" size={16}/> : <><Save size={16}/> Save Settings</>}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 20px; }
      `}</style>
    </AnimatePresence>
  );
}

/* --- REUSABLE FIELD CONTROLS --- */

interface SelectProps {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
  icon: React.ReactNode;
}

function SettingsSelect({ label, value, options, onChange, icon }: SelectProps) {
  return (
    <div className="space-y-1.5 sm:space-y-2">
      <label className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-slate-400 ml-1 block">{label}</label>
      <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-lime-500 transition-colors pointer-events-none shrink-0">{icon}</div>
        <select 
          value={value} 
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-slate-50 border border-slate-100 py-3.5 sm:py-4 pl-12 pr-6 rounded-xl outline-none focus:bg-white focus:ring-4 focus:ring-lime-500/5 transition-all text-sm font-semibold appearance-none cursor-pointer text-slate-800 shadow-inner"
        >
          {options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </div>
    </div>
  );
}

interface ToggleProps {
  label: string;
  description: string;
  isActive: boolean;
  onToggle: (v: boolean) => void;
  icon: React.ReactNode;
}

function ToggleBlock({ label, description, isActive, onToggle, icon }: ToggleProps) {
  return (
    <div className="flex items-center justify-between p-3.5 sm:p-4 bg-slate-50/50 rounded-xl border border-slate-100 group hover:bg-white hover:border-lime-500/20 transition-all gap-4">
      <div className="flex gap-3 sm:gap-4 items-center min-w-0">
        <div className={`h-9 w-9 sm:h-10 sm:w-10 rounded-xl flex items-center justify-center transition-colors shrink-0 ${isActive ? 'bg-lime-50 text-lime-600' : 'bg-slate-100 text-slate-400'}`}>
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-xs sm:text-sm font-black text-slate-900 uppercase italic leading-none mb-1 sm:mb-1.5 truncate">{label}</p>
          <p className="text-[9px] sm:text-[10px] font-medium text-slate-400 leading-tight line-clamp-2">{description}</p>
        </div>
      </div>
      <button 
        type="button"
        onClick={() => onToggle(!isActive)}
        className={`w-10 h-5.5 sm:w-12 sm:h-6 rounded-full p-0.5 transition-colors duration-200 shrink-0 ${isActive ? 'bg-lime-500' : 'bg-slate-200'}`}
      >
        <div className={`h-4 w-4 bg-white rounded-full transition-transform duration-200 ${isActive ? 'translate-x-4.5 sm:translate-x-6' : 'translate-x-0'}`} />
      </button>
    </div>
  );
}