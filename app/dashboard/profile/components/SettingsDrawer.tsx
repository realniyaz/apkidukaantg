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
      console.error("Settings Sync Failure:", error);
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
          className="fixed inset-0 z-[110] flex items-center justify-center p-6"
        >
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />
          
          <motion.div 
            key="settings-modal-container"
            initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-xl bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col font-bold"
          >
            {/* HEADER */}
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-lime-600 uppercase tracking-widest flex items-center gap-2">
                  <Zap size={12} fill="currentColor" /> System Protocols
                </p>
                <h2 className="text-2xl font-black uppercase italic tracking-tighter text-slate-900">
                  Global <span className="text-slate-400">Settings</span>
                </h2>
              </div>
              <button onClick={onClose} className="text-slate-300 hover:text-red-500 transition-colors"><X size={24} /></button>
            </div>

            {/* FORM */}
            <form id="settings-form" onSubmit={handleSubmit} className="p-8 space-y-10 overflow-y-auto max-h-[60vh] custom-scrollbar">
              
              <div className="space-y-6">
                <SettingsSelect 
                  label="Primary Currency" 
                  value={formData.currency} 
                  options={["INR", "USD", "EUR", "GBP"]}
                  onChange={(v: string) => setFormData({...formData, currency: v})} 
                  icon={<BadgeIndianRupee size={18}/>} 
                />
                <SettingsSelect 
                  label="System Language" 
                  value={formData.language} 
                  options={["English", "Hindi", "Spanish", "French"]}
                  onChange={(v: string) => setFormData({...formData, language: v})} 
                  icon={<Globe size={18}/>} 
                />
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-50">
                <ToggleBlock 
                  label="GST Integration" 
                  description="Enable automated tax calculations"
                  isActive={formData.gst_enabled} 
                  onToggle={(v: boolean) => setFormData({...formData, gst_enabled: v})} 
                  icon={<ShieldCheck size={20}/>} 
                />
                <ToggleBlock 
                  label="Low Stock Alerts" 
                  description="Notifications for critical levels"
                  isActive={formData.low_stock_alert_enabled} 
                  onToggle={(v: boolean) => setFormData({...formData, low_stock_alert_enabled: v})} 
                  icon={<BellRing size={20}/>} 
                />
              </div>
            </form>

            {/* FOOTER */}
            <div className="p-8 border-t border-slate-100 flex gap-4 bg-white">
              <button type="button" onClick={onClose} className="flex-1 text-slate-400 uppercase text-xs tracking-widest font-black hover:text-slate-900 transition-colors">Abort</button>
              <button 
                type="submit" form="settings-form" disabled={loading}
                className="flex-[2] bg-slate-900 text-white py-5 rounded-[1.8rem] font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-black shadow-xl transition-all"
              >
                {loading ? <Loader2 className="animate-spin" size={18}/> : <><Save size={18}/> Deploy Settings</>}
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

/* --- HELPERS --- */

interface SelectProps {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
  icon: React.ReactNode;
}

function SettingsSelect({ label, value, options, onChange, icon }: SelectProps) {
  return (
    <div className="space-y-2">
      <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-2">{label}</label>
      <div className="relative group">
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-lime-500 transition-colors pointer-events-none">{icon}</div>
        <select 
          value={value} 
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-slate-50 border border-slate-100 py-4 pl-14 pr-6 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-lime-500/5 transition-all text-sm font-bold appearance-none cursor-pointer text-slate-800"
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
    <div className="flex items-center justify-between p-5 bg-slate-50/50 rounded-2xl border border-slate-100 group hover:bg-white hover:border-lime-500/20 transition-all">
      <div className="flex gap-4 items-center">
        <div className={`h-10 w-10 rounded-xl flex items-center justify-center transition-colors ${isActive ? 'bg-lime-50 text-lime-600' : 'bg-slate-100 text-slate-400'}`}>
          {icon}
        </div>
        <div>
          <p className="text-sm font-black text-slate-900 uppercase italic leading-none mb-1">{label}</p>
          <p className="text-[10px] font-bold text-slate-400 leading-none">{description}</p>
        </div>
      </div>
      <button 
        type="button"
        onClick={() => onToggle(!isActive)}
        className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${isActive ? 'bg-lime-500' : 'bg-slate-200'}`}
      >
        <div className={`h-4 w-4 bg-white rounded-full transition-transform duration-300 ${isActive ? 'translate-x-6' : 'translate-x-0'}`} />
      </button>
    </div>
  );
}