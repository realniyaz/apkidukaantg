"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Save, Loader2, Zap, Package, RefreshCw, AlertCircle, Fingerprint, Activity, Layers, ShieldCheck } from "lucide-react";
import { apiRequest } from "@/lib/api";

export default function EditProductModal({ product, onClose, onSuccess }: any) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category_name: "",
    sku: "",
    barcode: "",
    printed_mrp: 0,
    default_selling_price: 0,
    low_stock_threshold: 0,
    current_stock: 0, 
    adjustment_units: 0, 
    adjustment_reason: "Manual Correction"
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        category_name: product.category?.name || product.category_name || "",
        sku: product.sku || "",
        barcode: product.barcode || "",
        printed_mrp: Number(product.printed_mrp) || 0,
        default_selling_price: Number(product.selling_price || product.default_selling_price) || 0,
        low_stock_threshold: Number(product.low_stock_threshold) || 0,
        current_stock: Number(product.available_stock) || 0,
        adjustment_units: 0,
        adjustment_reason: "Manual Correction"
      });
    }
  }, [product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Update Product Metadata (Matches your PATCH Schema)
      const metadataPayload = {
        name: formData.name,
        category_name: formData.category_name,
        sku: formData.sku,
        barcode: formData.barcode,
        printed_mrp: formData.printed_mrp,
        default_selling_price: formData.default_selling_price,
        low_stock_threshold: formData.low_stock_threshold,
        is_active: true
      };

      await apiRequest(`/products/${product.public_id}`, {
        method: "PATCH",
        body: JSON.stringify(metadataPayload),
      });

      // 2. 🟢 STOCK UPDATE LOGIC
      // If units were changed, we must hit the ledger/adjustment endpoint 
      // because your PATCH schema doesn't support 'stock_adjustment'
      if (formData.adjustment_units !== 0) {
        await apiRequest(`/inventory/adjust`, {
          method: "POST",
          body: JSON.stringify({
            product_id: product.id || product.public_id,
            adjustment_qty: formData.adjustment_units,
            reason: formData.adjustment_reason
          }),
        });
      }

      onSuccess(); // Triggers the page refresh with cache-buster
      onClose();
    } catch (error: any) {
      alert(`Calibration Failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 md:p-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={onClose} className="absolute inset-0 bg-slate-950/40 backdrop-blur-xl" />
      
      <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100">
        <div className="p-8 bg-slate-900 text-white flex justify-between items-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-10"><Fingerprint size={100} /></div>
          <div className="flex items-center gap-4 relative z-10">
             <div className="h-12 w-12 bg-lime-400 rounded-2xl flex items-center justify-center text-slate-900 shadow-lg shadow-lime-400/20 rotate-3"><Activity size={24} /></div>
             <div>
                <h2 className="text-xl font-black uppercase italic tracking-tighter">Calibrate Asset</h2>
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mt-1">Ref: {product?.public_id?.slice(0, 12)}</p>
             </div>
          </div>
          <button onClick={onClose} className="h-10 w-10 flex items-center justify-center rounded-xl hover:bg-white/10 text-slate-400 transition-all z-10"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-8 overflow-y-auto max-h-[70vh] no-scrollbar">
          <div className="grid grid-cols-2 gap-6">
            <Input label="Designation" value={formData.name} onChange={(v: string) => setFormData({...formData, name: v})} />
            <Input label="Category" value={formData.category_name} onChange={(v: string) => setFormData({...formData, category_name: v})} icon={<Layers size={14}/>} />
            <Input label="SKU" value={formData.sku} onChange={(v: string) => setFormData({...formData, sku: v})} />
            <Input label="Barcode" value={formData.barcode} onChange={(v: string) => setFormData({...formData, barcode: v})} />
          </div>

          <div className="grid grid-cols-2 gap-6 p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
            <Input label="Sale Rate" type="number" value={formData.default_selling_price} onChange={(v: any) => setFormData({...formData, default_selling_price: parseFloat(v)})} isCurrency />
            <Input label="Market MRP" type="number" value={formData.printed_mrp} onChange={(v: any) => setFormData({...formData, printed_mrp: parseFloat(v)})} isCurrency />
            <div className="col-span-2">
               <Input label="Low Stock Safeguard" type="number" value={formData.low_stock_threshold} onChange={(v: any) => setFormData({...formData, low_stock_threshold: parseInt(v)})} />
            </div>
          </div>

          {/* STOCK MODULE */}
          <div className="space-y-6">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase tracking-[0.2em]"><Package size={14} /> Stock Correction</div>
                <div className="px-3 py-1 bg-blue-50 rounded-lg border border-blue-100"><span className="text-[10px] font-black text-blue-600 uppercase italic">Live: {formData.current_stock}</span></div>
             </div>

             <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                   <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Delta (+/-)</label>
                   <input type="number" placeholder="Add or Subtract" onChange={(e) => setFormData({...formData, adjustment_units: parseInt(e.target.value) || 0})} className="w-full bg-slate-50 border-2 border-slate-50 py-4 px-6 rounded-2xl outline-none focus:border-blue-500 focus:bg-white transition-all text-sm font-black text-blue-600 tabular-nums shadow-inner" />
                </div>
                <div className="space-y-2">
                   <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Reason</label>
                   <select value={formData.adjustment_reason} onChange={(e) => setFormData({...formData, adjustment_reason: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-50 py-4 px-6 rounded-2xl outline-none focus:border-blue-500 focus:bg-white transition-all text-sm font-bold text-slate-700">
                     <option value="Manual Correction">Manual Correction</option>
                     <option value="Restock">Bulk Replenishment</option>
                     <option value="Damaged">Waste/Damaged</option>
                     <option value="Returned">Inventory Return</option>
                   </select>
                </div>
             </div>

             <motion.div animate={{ backgroundColor: formData.adjustment_units !== 0 ? 'rgba(59, 130, 246, 0.05)' : 'transparent' }} className="flex items-center gap-4 p-5 rounded-2xl border border-dashed border-slate-200">
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${formData.adjustment_units >= 0 ? 'bg-lime-100 text-lime-600' : 'bg-red-100 text-red-600'}`}><Zap size={18} fill="currentColor" /></div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Projection</p>
                  <p className="text-lg font-black text-slate-900 tabular-nums">
                    {formData.current_stock} {formData.adjustment_units >= 0 ? '+' : ''}{formData.adjustment_units} = <span className="underline decoration-blue-500">{formData.current_stock + formData.adjustment_units} Units</span>
                  </p>
                </div>
             </motion.div>
          </div>

          <div className="flex gap-4 pt-4">
            <button type="button" onClick={onClose} className="flex-1 py-5 text-slate-400 font-black uppercase text-[10px] tracking-[0.2em]">Discard</button>
            <button type="submit" disabled={loading} className="flex-[2.5] bg-slate-900 text-white py-5 rounded-[1.8rem] font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-black shadow-2xl active:scale-95 disabled:opacity-30">
              {loading ? <Loader2 className="animate-spin" size={18}/> : <><Zap size={18} fill="currentColor" className="text-lime-400" /> Apply Correction</>}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

function Input({ label, value, onChange, type = "text", icon, isCurrency }: any) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 ml-2">{icon}<label className="text-[9px] font-black uppercase tracking-widest text-slate-400">{label}</label></div>
      <div className="relative group">
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className={`w-full bg-slate-50 border-2 border-slate-50 py-4 px-6 rounded-2xl outline-none focus:border-slate-900 focus:bg-white transition-all text-sm font-black text-slate-800 ${isCurrency ? 'pl-10' : ''}`} />
        {isCurrency && <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>}
      </div>
    </div>
  );
}