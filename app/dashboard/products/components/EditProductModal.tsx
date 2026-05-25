"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
      // 1. Update Product Metadata (PATCH Schema Alignment)
      const metadataPayload = {
        name: formData.name.trim(),
        category_name: formData.category_name.trim(),
        sku: formData.sku.trim(),
        barcode: formData.barcode.trim(),
        printed_mrp: formData.printed_mrp,
        default_selling_price: formData.default_selling_price,
        low_stock_threshold: formData.low_stock_threshold,
        is_active: true
      };

      await apiRequest(`/products/${product.public_id}`, {
        method: "PATCH",
        body: JSON.stringify(metadataPayload),
      });

      // 2. STOCK ADJUSTMENT ROUTE LOGIC
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

      onSuccess(); 
      onClose();
    } catch (error: any) {
      alert(`Failed to update product settings: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 overflow-y-auto">
      {/* CLOSING SHIELD BACKDROP */}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        onClick={onClose} 
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" 
      />
      
      <motion.div 
        initial={{ scale: 0.96, opacity: 0, y: 15 }} 
        animate={{ scale: 1, opacity: 1, y: 0 }} 
        className="relative w-full max-w-2xl bg-white rounded-xl sm:rounded-[2.5rem] md:rounded-[3rem] shadow-xl overflow-hidden border border-slate-100 my-auto max-h-[92vh] flex flex-col z-10"
      >
        {/* HEADER */}
        <div className="p-5 sm:p-8 bg-slate-900 text-white flex justify-between items-center relative overflow-hidden shrink-0">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none hidden sm:block">
            <Fingerprint size={90} />
          </div>
          <div className="flex items-center gap-3.5 relative z-10">
             <div className="h-11 w-11 sm:h-12 sm:w-12 bg-lime-400 rounded-xl flex items-center justify-center text-slate-900 shadow-md shrink-0">
               <Activity size={20} />
             </div>
             <div>
                <h2 className="text-lg sm:text-2xl font-black uppercase italic tracking-tight text-white leading-none">Edit Product</h2>
                <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-wider mt-1.5 font-mono">Ref ID: {product?.public_id?.slice(0, 12).toUpperCase()}</p>
             </div>
          </div>
          <button onClick={onClose} className="h-9 w-9 flex items-center justify-center rounded-xl hover:bg-white/10 text-slate-400 transition-all z-10 p-1 shrink-0">
            <X size={18} />
          </button>
        </div>

        {/* FORM CONTAINER BODY */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-8 md:p-10 space-y-6 sm:space-y-8 overflow-y-auto flex-1 custom-scrollbar">
          
          {/* CATALOG SPECIFICATIONS SECTION */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <Input label="Product Title" value={formData.name} onChange={(v: string) => setFormData({...formData, name: v})} />
            <Input label="Category" value={formData.category_name} onChange={(v: string) => setFormData({...formData, category_name: v})} icon={<Layers size={12} className="text-slate-400 shrink-0" />} />
            <Input label="SKU Reference" value={formData.sku} onChange={(v: string) => setFormData({...formData, sku: v})} />
            <Input label="Barcode / EAN" value={formData.barcode} onChange={(v: string) => setFormData({...formData, barcode: v})} />
          </div>

          {/* PRICING & ALERT CONFIGS CARD */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 p-4 sm:p-6 md:p-8 bg-slate-50 rounded-xl sm:rounded-[2rem] border border-slate-100/60">
            <Input label="Selling Price" type="number" value={formData.default_selling_price} onChange={(v: any) => setFormData({...formData, default_selling_price: parseFloat(v) || 0})} isCurrency />
            <Input label="Printed MRP" type="number" value={formData.printed_mrp} onChange={(v: any) => setFormData({...formData, printed_mrp: parseFloat(v) || 0})} isCurrency />
            <div className="sm:col-span-2">
               <Input label="Low Stock Safeguard Limit" type="number" value={formData.low_stock_threshold} onChange={(v: any) => setFormData({...formData, low_stock_threshold: parseInt(v) || 0})} />
            </div>
          </div>

          {/* STOCK ADJUSTMENT MODULE */}
          <div className="space-y-4 sm:space-y-5">
             <div className="flex items-center justify-between gap-4 px-0.5">
                <div className="flex items-center gap-1.5 text-blue-600 font-black text-[9px] sm:text-[10px] uppercase tracking-wider italic">
                  <Package size={14} className="shrink-0" /> Stock Adjustment
                </div>
                <div className="px-2.5 py-0.5 bg-blue-50 border border-blue-100/50 rounded-md shrink-0">
                  <span className="text-[9px] sm:text-[10px] font-black text-blue-600 uppercase font-mono">Current Inventory: {formData.current_stock}</span>
                </div>
             </div>

             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-1.5 sm:space-y-2">
                   <label className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-slate-400 ml-0.5">Quantity Change (+ / -)</label>
                   <input 
                     type="number" 
                     placeholder="Ex: 10 or -5" 
                     onChange={(e) => setFormData({...formData, adjustment_units: parseInt(e.target.value) || 0})} 
                     className="w-full bg-slate-50 border border-slate-100 py-3 sm:py-4 px-4 sm:px-6 rounded-xl outline-none focus:border-blue-500 focus:bg-white transition-all text-sm font-black text-blue-600 tabular-nums shadow-inner" 
                   />
                </div>
                <div className="space-y-1.5 sm:space-y-2">
                   <label className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-slate-400 ml-0.5">Reason for Adjustment</label>
                   <select 
                     value={formData.adjustment_reason} 
                     onChange={(e) => setFormData({...formData, adjustment_reason: e.target.value})} 
                     className="w-full bg-slate-50 border border-slate-100 py-3 sm:py-4 px-4 sm:px-6 rounded-xl outline-none focus:border-blue-500 focus:bg-white transition-all text-sm font-semibold text-slate-700 cursor-pointer shadow-inner"
                   >
                     <option value="Manual Correction">Manual Correction</option>
                     <option value="Restock">Fresh Stock Arrival</option>
                     <option value="Damaged">Damaged / Expired Goods</option>
                     <option value="Returned">Customer Returns</option>
                   </select>
                </div>
             </div>

             {/* CALCULATION PROJECTION PANEL */}
             <motion.div 
               animate={{ backgroundColor: formData.adjustment_units !== 0 ? 'rgba(59, 130, 246, 0.04)' : 'rgba(248, 250, 252, 0.5)' }} 
               className="flex items-center gap-3.5 p-4 sm:p-5 rounded-xl border border-dashed border-slate-200"
             >
                <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-200 ${formData.adjustment_units >= 0 ? 'bg-lime-50 text-lime-600' : 'bg-red-50 text-red-500'}`}>
                  <Zap size={16} fill="currentColor" />
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-wider leading-none mb-1">New Stock Projection</p>
                  <p className="text-base sm:text-lg font-black text-slate-900 tabular-nums truncate italic">
                    {formData.current_stock} {formData.adjustment_units >= 0 ? '+' : ''}{formData.adjustment_units} = <span className="underline decoration-blue-500 underline-offset-4">{formData.current_stock + formData.adjustment_units} Units</span>
                  </p>
                </div>
             </motion.div>
          </div>

          {/* CTA FOOTER CONTROLS */}
          <div className="flex gap-4 pt-2 border-t border-slate-50 items-center">
            <button type="button" onClick={onClose} className="flex-1 py-3 text-slate-400 font-black uppercase text-[10px] sm:text-xs tracking-wider hover:text-slate-900 transition-all active:scale-95">Discard</button>
            <button type="submit" disabled={loading} className="flex-[2.5] bg-slate-900 hover:bg-black text-white h-11 sm:h-12 rounded-xl font-black uppercase text-xs tracking-wider flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.99] disabled:opacity-40">
              {loading ? <Loader2 className="animate-spin" size={16}/> : <><Save size={14} /> Update Product</>}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

/* --- SUB-INPUT ATOM FRAMEWORK --- */
function Input({ label, value, onChange, type = "text", icon, isCurrency }: any) {
  return (
    <div className="space-y-1.5 sm:space-y-2 w-full">
      <div className="flex items-center gap-1.5 ml-1">
        {icon}
        <label className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-slate-400 block">{label}</label>
      </div>
      <div className="relative group">
        <input 
          type={type} 
          value={value} 
          step={type === "number" ? "any" : undefined}
          onChange={(e) => onChange(e.target.value)} 
          className={`w-full bg-slate-50 border border-slate-100 py-2.5 sm:py-3.5 px-4 sm:px-6 rounded-xl outline-none focus:border-slate-900 focus:bg-white transition-all text-sm font-semibold text-slate-800 shadow-inner ${isCurrency ? 'pl-9' : ''}`} 
        />
        {isCurrency && <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs pointer-events-none">₹</span>}
      </div>
    </div>
  );
}