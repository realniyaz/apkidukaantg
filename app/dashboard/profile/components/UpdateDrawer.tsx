"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save, Loader2, Store, Phone, Hash, MapPin } from "lucide-react";
import { apiRequest } from "@/lib/api";

interface UpdateDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: any;
  onSuccess: () => void;
}

export default function UpdateDrawer({ isOpen, onClose, initialData, onSuccess }: UpdateDrawerProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    shop_name: "",
    phone: "",
    gst_number: "",
    address_line: "",
    city: "",
    state: "",
    pincode: "",
  });

  useEffect(() => {
    if (isOpen && initialData) {
      setFormData({
        shop_name: initialData.shop_profile?.shop_name || "",
        phone: initialData.shop_profile?.phone || "",
        gst_number: initialData.shop_profile?.gst_number || "",
        address_line: initialData.shop_profile?.address_line || "",
        city: initialData.shop_profile?.city || "",
        state: initialData.shop_profile?.state || "",
        pincode: initialData.shop_profile?.pincode || "",
      });
    }
  }, [isOpen, initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Prevents the click from bubbling up to the backdrop
    
    setLoading(true);
    try {
      await apiRequest("shop/profile", {
        method: "PATCH",
        body: JSON.stringify({
          shop_name: formData.shop_name,
          phone: formData.phone,
          gst_number: formData.gst_number,
          address_line: formData.address_line,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode
        }),
      });
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Update Sync Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div 
          key="identity-sync-overlay"
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-6"
        >
          {/* BACKDROP */}
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />
          
          <motion.div 
            key="identity-sync-modal"
            initial={{ scale: 0.9, opacity: 0, y: 20 }} 
            animate={{ scale: 1, opacity: 1, y: 0 }} 
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-xl bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col font-bold"
          >
            {/* HEADER */}
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-xl font-black uppercase italic tracking-tighter">Modify <span className="text-lime-600">Parameters</span></h2>
              <button onClick={onClose} className="text-slate-300 hover:text-red-500 transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* FORM - Added ID here */}
            <form 
              id="update-profile-form"
              onSubmit={handleSubmit} 
              className="p-8 space-y-8 overflow-y-auto max-h-[60vh] custom-scrollbar"
            >
              <InputBlock label="Shop Name" value={formData.shop_name} onChange={(v: string) => setFormData({...formData, shop_name: v})} icon={<Store size={18}/>} />
              <div className="grid grid-cols-2 gap-6">
                <InputBlock label="Phone" value={formData.phone} onChange={(v: string) => setFormData({...formData, phone: v})} icon={<Phone size={18}/>} />
                <InputBlock label="GST" value={formData.gst_number} onChange={(v: string) => setFormData({...formData, gst_number: v})} icon={<Hash size={18}/>} />
              </div>
              <InputBlock label="Address" value={formData.address_line} onChange={(v: string) => setFormData({...formData, address_line: v})} icon={<MapPin size={18}/>} />
              <div className="grid grid-cols-3 gap-4">
                <InputBlock label="City" value={formData.city} onChange={(v: string) => setFormData({...formData, city: v})} />
                <InputBlock label="State" value={formData.state} onChange={(v: string) => setFormData({...formData, state: v})} />
                <InputBlock label="Pincode" value={formData.pincode} onChange={(v: string) => setFormData({...formData, pincode: v})} />
              </div>
            </form>

            {/* FOOTER */}
            <div className="p-8 border-t border-slate-100 bg-white flex gap-4">
              <button 
                type="button" 
                onClick={onClose} 
                className="flex-1 text-slate-400 hover:text-slate-900 transition-colors uppercase text-xs tracking-widest"
              >
                Discard
              </button>
              
              {/* BUTTON FIX: Linked to form ID 'update-profile-form' */}
              <button 
                type="submit" 
                form="update-profile-form"
                disabled={loading}
                className="flex-[2] bg-slate-900 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3 hover:bg-black transition-all shadow-xl disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" size={18}/> : <><Save size={18}/> Commit Changes</>}
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

function InputBlock({ label, value, onChange, icon }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-2">{label}</label>
      <div className="relative group">
        {icon && <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-lime-500 transition-colors pointer-events-none">{icon}</div>}
        <input 
          type="text" 
          value={value || ""} 
          onChange={(e) => onChange(e.target.value)}
          className={`w-full bg-slate-50 border border-slate-100 py-4 ${icon ? 'pl-14' : 'pl-6'} pr-6 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-lime-500/5 transition-all text-sm font-bold text-slate-800 shadow-inner`}
        />
      </div>
    </div>
  );
}