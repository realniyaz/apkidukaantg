"use client";

import { useState } from "react";
import { apiRequest } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, PackagePlus, IndianRupee, Tag, AlertCircle, 
  Loader2, Info, TrendingDown, Barcode, Layers, 
  Zap, Box, ShieldCheck, Fingerprint
} from "lucide-react";

export default function CreateProductModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [form, setForm] = useState({
    name: "",
    category_name: "",
    brand_name: "",
    unit_name: "PCS",
    sku: "",
    barcode: "",
    default_selling_price: "",
    printed_mrp: "",
    low_stock_threshold: 5,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await apiRequest("/products/", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          default_selling_price: Number(form.default_selling_price),
          printed_mrp: Number(form.printed_mrp) || null,
          low_stock_threshold: Number(form.low_stock_threshold),
        }),
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to add product. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4 overflow-y-auto">
      {/* BACKGROUND CLICK CLOSING SHIELD */}
      <div className="absolute inset-0" onClick={onClose} />

      <motion.div 
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        className="bg-white rounded-xl sm:rounded-[2.5rem] md:rounded-[3rem] shadow-xl w-full max-w-2xl overflow-hidden border border-slate-100 my-auto max-h-[92vh] flex flex-col relative z-10"
      >
        {/* HEADER */}
        <div className="bg-slate-900 p-5 sm:p-8 text-white relative overflow-hidden shrink-0">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none hidden sm:block">
            <Fingerprint size={100} />
          </div>
          
          <div className="flex justify-between items-center relative z-10">
            <div className="flex items-center gap-4">
              <div className="h-11 w-11 sm:h-14 sm:w-14 bg-lime-400 rounded-xl sm:rounded-2xl flex items-center justify-center text-slate-900 shadow-md shrink-0">
                <PackagePlus size={22} className="sm:h-6 sm:w-6" />
              </div>
              <div>
                <h2 className="text-lg sm:text-2xl font-black italic tracking-tight uppercase leading-none text-white">Add New Product</h2>
                <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-wider mt-1.5 sm:mt-2">Inventory Registry Node</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-all text-slate-400 hover:text-white shrink-0">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* SCROLLABLE FORM BODY */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-8 md:p-10 space-y-6 sm:space-y-8 bg-white overflow-y-auto custom-scrollbar flex-1">
          
          {/* SECTION 1: CORE IDENTITY */}
          <div className="space-y-4">
            <div className="flex items-center gap-1.5 opacity-40 pb-1 border-b border-slate-50">
              <ShieldCheck size={14} className="text-slate-900" />
              <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-slate-900">Basic Information</span>
            </div>
            
            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-[9px] sm:text-[10px] uppercase tracking-wider font-black text-slate-400 ml-0.5">Product Title</label>
              <div className="relative group">
                <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-lime-500 transition-colors pointer-events-none" size={16} />
                <input
                  type="text"
                  placeholder="Ex: Premium Wireless Earbuds"
                  className="w-full bg-slate-50 border border-slate-100 py-3 sm:py-4 pl-11 pr-4 rounded-xl focus:border-lime-500 focus:bg-white outline-none transition-all font-semibold text-slate-800 shadow-inner text-sm"
                  required
                  autoFocus
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              <div className="space-y-1.5 sm:space-y-2">
                <label className="text-[9px] sm:text-[10px] uppercase tracking-wider font-black text-slate-400 ml-0.5">Category</label>
                <div className="relative group">
                  <Layers className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors pointer-events-none" size={16} />
                  <input
                    type="text"
                    placeholder="Electronics, Apparel, etc..."
                    className="w-full bg-slate-50 border border-slate-100 py-3 sm:py-4 pl-11 pr-4 rounded-xl focus:border-lime-500 focus:bg-white outline-none transition-all font-semibold text-slate-800 text-sm shadow-inner"
                    value={form.category_name}
                    onChange={(e) => setForm({ ...form, category_name: e.target.value })}
                  />
                </div>
              </div>

              {/* ✅ FIXED MISTAKE: Restored missing Brand field item row input handler */}
              <div className="space-y-1.5 sm:space-y-2">
                <label className="text-[9px] sm:text-[10px] uppercase tracking-wider font-black text-slate-400 ml-0.5">Brand Name</label>
                <div className="relative group">
                  <Box className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors pointer-events-none" size={16} />
                  <input
                    type="text"
                    placeholder="Manufacturer or Brand..."
                    className="w-full bg-slate-50 border border-slate-100 py-3 sm:py-4 pl-11 pr-4 rounded-xl focus:border-lime-500 focus:bg-white outline-none transition-all font-semibold text-slate-800 text-sm shadow-inner"
                    value={form.brand_name}
                    onChange={(e) => setForm({ ...form, brand_name: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              {/* ✅ FIXED MISTAKE: Restored missing SKU data item input wrapper field */}
              <div className="space-y-1.5 sm:space-y-2">
                <label className="text-[9px] sm:text-[10px] uppercase tracking-wider font-black text-slate-400 ml-0.5">Custom SKU Reference</label>
                <div className="relative group">
                  <Barcode className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-purple-500 transition-colors pointer-events-none" size={16} />
                  <input
                    type="text"
                    placeholder="Ex: ELEC-EAR-01"
                    className="w-full bg-slate-50 border border-slate-100 py-3 sm:py-4 pl-11 pr-4 rounded-xl focus:border-lime-500 focus:bg-white outline-none transition-all font-semibold text-slate-800 text-sm shadow-inner"
                    value={form.sku}
                    onChange={(e) => setForm({ ...form, sku: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <label className="text-[9px] sm:text-[10px] uppercase tracking-wider font-black text-slate-400 ml-0.5">Barcode / EAN</label>
                <div className="relative group">
                  <Barcode className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-purple-500 transition-colors pointer-events-none" size={16} />
                  <input
                    type="text"
                    placeholder="Scan or type barcode barcode..."
                    className="w-full bg-slate-50 border border-slate-100 py-3 sm:py-4 pl-11 pr-4 rounded-xl focus:border-lime-500 focus:bg-white outline-none transition-all font-semibold text-slate-800 text-sm shadow-inner"
                    value={form.barcode}
                    onChange={(e) => setForm({ ...form, barcode: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: PRICING DETAILS */}
          <div className="p-4 sm:p-6 md:p-8 bg-slate-50 rounded-xl sm:rounded-[2rem] border border-slate-100 space-y-4 sm:space-y-6">
             <div className="flex flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-1.5 opacity-40">
                  <IndianRupee size={14} className="text-slate-900" />
                  <span className="text-[9px] sm:text-[10px] uppercase tracking-wider font-black text-slate-900">Pricing & Units</span>
                </div>
                <div className="flex items-center gap-2.5 shrink-0">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Unit Measurement</span>
                  <select 
                    value={form.unit_name}
                    onChange={(e) => setForm({...form, unit_name: e.target.value})}
                    className="bg-white border border-slate-200 rounded-md px-2 py-1 text-[10px] font-black outline-none cursor-pointer text-slate-700"
                  >
                    <option value="PCS">PCS</option>
                    <option value="KGS">KGS</option>
                    <option value="LTR">LTR</option>
                    <option value="BOX">BOX</option>
                  </select>
                </div>
             </div>
             
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-1.5 sm:space-y-2">
                <label className="text-[9px] sm:text-[10px] font-bold text-slate-400 ml-0.5 uppercase tracking-wider">Selling Price (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  className="w-full bg-white border border-slate-200 p-3 sm:p-4 rounded-xl focus:border-lime-500 outline-none transition-all font-black text-slate-900 text-lg sm:text-xl tabular-nums shadow-sm"
                  required
                  value={form.default_selling_price}
                  onChange={(e) => setForm({ ...form, default_selling_price: e.target.value })}
                />
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <label className="text-[9px] sm:text-[10px] font-bold text-slate-400 ml-0.5 uppercase tracking-wider">Printed MRP (Option)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  className="w-full bg-white border border-slate-200 p-3 sm:p-4 rounded-xl focus:border-lime-500 outline-none transition-all font-black text-slate-400 text-lg sm:text-xl tabular-nums shadow-sm"
                  value={form.printed_mrp}
                  onChange={(e) => setForm({ ...form, printed_mrp: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: INVENTORY TRACKING SAFEGUARDS */}
          <div className="space-y-3">
            <div className="flex flex-row items-center justify-between gap-4 px-0.5">
               <div className="flex items-center gap-1.5 opacity-40">
                  <TrendingDown size={14} className="text-slate-900" />
                  <label className="text-[9px] sm:text-[10px] uppercase tracking-wider font-black text-slate-900">Stock Alerts</label>
               </div>
               <div className="flex items-center gap-1 text-slate-400 shrink-0">
                  <Info size={11} />
                  <span className="text-[9px] font-bold uppercase tracking-tight italic">Low stock alert point</span>
               </div>
            </div>
            <div className="relative group">
              <Box className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-orange-500 transition-colors pointer-events-none" size={16} />
              <input
                type="number"
                min="0"
                value={form.low_stock_threshold}
                className="w-full bg-slate-50 border border-slate-100 py-3 sm:py-4 pl-11 pr-24 rounded-xl focus:border-lime-500 focus:bg-white outline-none transition-all font-black text-slate-800 text-sm shadow-inner"
                required
                onChange={(e) => setForm({ ...form, low_stock_threshold: Number(e.target.value) })}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-black uppercase text-slate-400 tracking-wider">Units Floor</span>
            </div>
          </div>

          {/* ERROR RENDER TRAP */}
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="p-4 bg-red-50 text-red-600 rounded-xl text-xs font-semibold border border-red-100 flex items-center gap-3 italic"
              >
                <AlertCircle size={16} className="shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </form>

        {/* FOOTER CALLS */}
        <div className="p-4 sm:p-6 md:p-8 border-t border-slate-100 bg-white flex gap-3 sm:gap-4 items-center shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 text-slate-400 font-black text-[10px] sm:text-xs uppercase tracking-wider hover:text-slate-900 transition-all active:scale-95"
          >
            Cancel
          </button>

          <button
            type="submit"
            form="settings-form"
            onClick={handleSubmit}
            disabled={loading}
            className="flex-[2] bg-slate-900 hover:bg-black text-white h-11 sm:h-12 rounded-xl font-black text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-40"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin text-lime-400" />
            ) : (
              <>
                <span>Save Product</span>
                <Zap size={14} fill="currentColor" className="text-lime-400" />
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}