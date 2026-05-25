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
    e.stopPropagation();
    
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
      console.error("Failed to update profile details:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div 
          key="profile-edit-overlay"
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
        >
          {/* BACKDROP */}
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
          
          <motion.div 
            key="profile-edit-modal"
            initial={{ scale: 0.96, opacity: 0, y: 15 }} 
            animate={{ scale: 1, opacity: 1, y: 0 }} 
            exit={{ scale: 0.96, opacity: 0, y: 15 }}
            className="relative w-full max-w-xl bg-white rounded-xl sm:rounded-[2.5rem] shadow-xl overflow-hidden flex flex-col font-bold my-auto max-h-[90vh]"
          >
            {/* HEADER */}
            <div className="p-5 sm:p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/40">
              <h2 className="text-xl font-black uppercase italic tracking-tight text-slate-900">Edit <span className="text-lime-600">Store Details</span></h2>
              <button onClick={onClose} className="text-slate-300 hover:text-red-500 transition-colors p-1">
                <X size={20} />
              </button>
            </div>

            {/* FORM AREA */}
            <form 
              id="update-profile-form"
              onSubmit={handleSubmit} 
              className="p-5 sm:p-8 space-y-4 sm:space-y-6 overflow-y-auto max-h-[55vh] custom-scrollbar"
            >
              <InputBlock label="Store Name" value={formData.shop_name} onChange={(v: string) => setFormData({...formData, shop_name: v})} icon={<Store size={16}/>} />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <InputBlock label="Mobile Number" type="tel" value={formData.phone} onChange={(v: string) => setFormData({...formData, phone: v})} icon={<Phone size={16}/>} />
                <InputBlock label="GSTIN Number" value={formData.gst_number} onChange={(v: string) => setFormData({...formData, gst_number: v})} icon={<Hash size={16}/>} />
              </div>

              <InputBlock label="Street Address" value={formData.address_line} onChange={(v: string) => setFormData({...formData, address_line: v})} icon={<MapPin size={16}/>} />
              
              <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
                <InputBlock label="City" value={formData.city} onChange={(v: string) => setFormData({...formData, city: v})} />
                <InputBlock label="State" value={formData.state} onChange={(v: string) => setFormData({...formData, state: v})} />
                <InputBlock label="Pincode" type="numeric" value={formData.pincode} onChange={(v: string) => setFormData({...formData, pincode: v})} />
              </div>
            </form>

            {/* FOOTER ACTION BUTTONS */}
            <div className="p-4 sm:p-8 border-t border-slate-100 bg-white flex gap-3 sm:gap-4 items-center">
              <button 
                type="button" 
                onClick={onClose} 
                className="flex-1 text-slate-400 hover:text-slate-900 transition-colors uppercase text-xs tracking-wider font-black py-3"
              >
                Discard
              </button>
              
              <button 
                type="submit" 
                form="update-profile-form"
                disabled={loading}
                className="flex-[2] bg-slate-900 text-white h-11 sm:h-12 rounded-xl font-black uppercase text-xs tracking-wider flex items-center justify-center gap-2 hover:bg-black transition-all shadow-md disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" size={16}/> : <><Save size={16}/> Save Changes</>}
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

interface InputBlockProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  icon?: React.ReactNode;
  type?: string;
}

function InputBlock({ label, value, onChange, icon, type = "text" }: InputBlockProps) {
  return (
    <div className="space-y-1.5 sm:space-y-2 w-full">
      <label className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-slate-400 ml-1 block">{label}</label>
      <div className="relative group">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-lime-500 transition-colors pointer-events-none shrink-0">
            {icon}
          </div>
        )}
        <input 
          type={type} 
          value={value || ""} 
          onChange={(e) => onChange(e.target.value)}
          className={`w-full bg-slate-50 border border-slate-100 py-2.5 sm:py-4 ${icon ? 'pl-11' : 'pl-4'} pr-4 rounded-xl outline-none focus:bg-white focus:ring-4 focus:ring-lime-500/5 transition-all text-sm font-semibold text-slate-800 shadow-inner`}
        />
      </div>
    </div>
  );
}