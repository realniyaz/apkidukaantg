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
      // Logic aligns with your new ProductCreate schema
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
      setError(err.message || "Uplink Failure: Node rejected product sequence.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xl flex items-center justify-center z-[100] p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.3)] w-full max-w-2xl overflow-hidden border border-slate-100"
      >
        {/* INDUSTRIAL HEADER */}
        <div className="bg-slate-900 p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Fingerprint size={120} />
          </div>
          
          <div className="flex justify-between items-center relative z-10">
            <div className="flex items-center gap-5">
              <div className="h-14 w-14 bg-lime-400 rounded-2xl flex items-center justify-center text-slate-900 shadow-lg shadow-lime-400/20 rotate-3">
                <PackagePlus size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-black italic tracking-tighter uppercase leading-none text-white">Initialize Asset</h2>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mt-2">Inventory Registry Node Alpha</p>
              </div>
            </div>
            <button onClick={onClose} className="p-3 hover:bg-white/10 rounded-xl transition-all text-slate-400 hover:text-white">
              <X size={20} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-8 bg-white max-h-[75vh] overflow-y-auto no-scrollbar">
          
          {/* SECTION 1: CORE IDENTITY */}
          <div className="space-y-5">
            <div className="flex items-center gap-2 mb-2 opacity-30">
              <ShieldCheck size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">Core Identity</span>
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-black text-slate-400 ml-1">Asset Nomenclature</label>
              <div className="relative group">
                <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-lime-500 transition-colors" size={18} />
                <input
                  type="text"
                  placeholder="Ex: Industrial Capacitor 400V"
                  className="w-full bg-slate-50 border-2 border-slate-50 p-4 pl-12 rounded-2xl focus:border-slate-900 focus:bg-white outline-none transition-all font-bold text-slate-800 placeholder:font-medium"
                  required
                  autoFocus
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
               <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-black text-slate-400 ml-1">Classification</label>
                  <div className="relative group">
                    <Layers className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={16} />
                    <input
                      type="text"
                      placeholder="Category..."
                      className="w-full bg-slate-50 border-2 border-slate-50 p-4 pl-12 rounded-2xl focus:border-slate-900 focus:bg-white outline-none transition-all font-bold text-slate-800 text-sm"
                      onChange={(e) => setForm({ ...form, category_name: e.target.value })}
                    />
                  </div>
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-black text-slate-400 ml-1">Universal SKU / Barcode</label>
                  <div className="relative group">
                    <Barcode className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-purple-500 transition-colors" size={16} />
                    <input
                      type="text"
                      placeholder="Scan or Type..."
                      className="w-full bg-slate-50 border-2 border-slate-50 p-4 pl-12 rounded-2xl focus:border-slate-900 focus:bg-white outline-none transition-all font-bold text-slate-800 text-sm"
                      onChange={(e) => setForm({ ...form, barcode: e.target.value })}
                    />
                  </div>
               </div>
            </div>
          </div>

          {/* SECTION 2: FISCAL PARAMETERS */}
          <div className="p-8 bg-slate-50 rounded-[2.5rem] border-2 border-slate-100/50 space-y-6">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 opacity-30">
                  <IndianRupee size={14} />
                  <span className="text-[10px] uppercase tracking-widest font-black text-slate-900">Fiscal Parameters</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Base Unit</span>
                  <select 
                    value={form.unit_name}
                    onChange={(e) => setForm({...form, unit_name: e.target.value})}
                    className="bg-white border border-slate-200 rounded-lg px-3 py-1 text-[10px] font-black outline-none"
                  >
                    <option value="PCS">PCS</option>
                    <option value="KGS">KGS</option>
                    <option value="LTR">LTR</option>
                    <option value="BOX">BOX</option>
                  </select>
                </div>
             </div>
             
             <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 ml-1 uppercase tracking-widest">Target Sale Rate</label>
                <input
                  type="number"
                  placeholder="0.00"
                  className="w-full bg-white border-2 border-slate-200 p-4 rounded-2xl focus:border-lime-500 outline-none transition-all font-black text-slate-900 text-xl tabular-nums shadow-sm"
                  required
                  onChange={(e) => setForm({ ...form, default_selling_price: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 ml-1 uppercase tracking-widest">Market MRP</label>
                <input
                  type="number"
                  placeholder="0.00"
                  className="w-full bg-white border-2 border-slate-200 p-4 rounded-2xl focus:border-slate-900 outline-none transition-all font-black text-slate-400 text-xl tabular-nums shadow-sm"
                  onChange={(e) => setForm({ ...form, printed_mrp: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: SYSTEM AUTOMATION */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
               <div className="flex items-center gap-2 opacity-30">
                  <TrendingDown size={14} />
                  <label className="text-[10px] uppercase tracking-widest font-black text-slate-900">Safeguard Protocols</label>
               </div>
               <div className="flex items-center gap-1 text-slate-400">
                  <Info size={12} />
                  <span className="text-[9px] font-black uppercase tracking-tighter italic">Low stock alert trigger</span>
               </div>
            </div>
            <div className="relative group">
              <Box className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-orange-500 transition-colors" size={18} />
              <input
                type="number"
                value={form.low_stock_threshold}
                className="w-full bg-slate-50 border-2 border-slate-50 p-4 pl-12 rounded-2xl focus:border-slate-900 focus:bg-white outline-none transition-all font-bold text-slate-800"
                required
                onChange={(e) => setForm({ ...form, low_stock_threshold: Number(e.target.value) })}
              />
              <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[9px] font-black uppercase text-slate-400 tracking-widest">Critical Units</span>
            </div>
          </div>

          {/* ERROR DISPLAY */}
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 bg-red-50 text-red-600 rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest border-2 border-red-100 flex items-center gap-4 italic"
              >
                <AlertCircle size={18} />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* ACTIONS */}
          <div className="flex items-center gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-5 text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] hover:text-slate-900 transition-all active:scale-95"
            >
              Abort Entry
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex-[2.5] bg-slate-900 hover:bg-black text-white py-5 rounded-[1.8rem] font-black text-xs uppercase tracking-[0.2em] transition-all shadow-2xl shadow-slate-200 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-30"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin text-lime-400" />
              ) : (
                <>
                  Commit Asset
                  <Zap size={16} fill="currentColor" className="text-lime-400" />
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}