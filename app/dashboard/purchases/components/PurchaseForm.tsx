"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiRequest, cleanDecimal } from "@/lib/api"; 
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, Trash2, Store, Calculator, 
  Loader2, Search, Box, Zap
} from "lucide-react";

interface Product {
  id: number;
  name: string;
  purchase_price: number | string;
  stock_quantity: number;
  gst_percent: number;
}

interface PurchaseItem {
  id_for_key: string; 
  product_name: string;
  product_id: number | null;
  quantity: number;
  cost_price: number;
  gst_percent: number;
}

export default function PurchaseForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [inventory, setInventory] = useState<Product[]>([]);
  const [supplierName, setSupplierName] = useState("");
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  
  const [items, setItems] = useState<PurchaseItem[]>([
    { id_for_key: crypto.randomUUID(), product_name: "", product_id: null, quantity: 1, cost_price: 0, gst_percent: 18 }
  ]);

  useEffect(() => {
    (async () => {
      try {
        const data = await apiRequest<Product[]>("/products/");
        setInventory(data || []);
      } catch (err) {
        console.error("Failed to load inventory:", err);
      }
    })();
  }, []);

  const calculateSubtotal = () => items.reduce((acc, item) => acc + (item.quantity * item.cost_price), 0);
  const calculateTotalGST = () => items.reduce((acc, item) => acc + (item.quantity * item.cost_price * (item.gst_percent / 100)), 0);
  const totalAmount = calculateSubtotal() + calculateTotalGST();

  const addItem = () => {
    setItems([...items, { 
      id_for_key: crypto.randomUUID(), 
      product_name: "", 
      product_id: null, 
      quantity: 1, 
      cost_price: 0, 
      gst_percent: 18 
    }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
      if (activeDropdown === index) setActiveDropdown(null);
    }
  };

  const updateItem = (index: number, field: keyof PurchaseItem, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const selectProduct = (index: number, prod: Product) => {
    const updated = [...items];
    updated[index] = {
      ...updated[index],
      product_name: prod.name,
      product_id: prod.id,
      quantity: 1,
      cost_price: cleanDecimal(prod.purchase_price),
      gst_percent: Number(prod.gst_percent || 18)
    };
    setItems(updated);
    setActiveDropdown(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      await apiRequest("/purchases/", {
        method: "POST",
        body: JSON.stringify({ 
          supplier_name: supplierName.trim() || "Direct Vendor", 
          items: items.map(({ id_for_key, ...rest }) => rest) 
        })
      });
      router.push("/dashboard/purchases");
    } catch (err) {
      alert("Could not process purchase entry. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 pb-24 text-slate-900">
      <div className="lg:col-span-2 space-y-4 sm:space-y-6">
        
        {/* SUPPLIER IDENTITY */}
        <div className="bg-white p-5 sm:p-8 rounded-xl sm:rounded-[2.5rem] border border-slate-100 shadow-sm space-y-3">
          <label className="text-[9px] sm:text-[10px] uppercase tracking-wider font-black text-slate-400 block ml-0.5">Supplier Details</label>
          <div className="relative group">
            <Store className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-lime-500 transition-colors pointer-events-none" size={18} />
            <input 
              required
              placeholder="Type supplier or vendor name..."
              className="w-full bg-slate-50 border border-slate-100 py-3.5 sm:py-5 pl-12 pr-4 rounded-xl focus:border-lime-500 focus:bg-white outline-none transition-all font-semibold text-sm text-slate-800 shadow-inner"
              value={supplierName}
              onChange={(e) => setSupplierName(e.target.value)}
            />
          </div>
        </div>

        {/* LINE ITEMS */}
        <div className="bg-white p-4 sm:p-8 rounded-xl sm:rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-slate-50 pb-4 sm:pb-6 gap-4">
            <label className="text-[9px] sm:text-[10px] uppercase tracking-wider font-black text-slate-400 italic">Items to Restock</label>
            <button 
              type="button" 
              onClick={addItem} 
              className="h-9 px-4 sm:px-6 bg-slate-900 text-white text-[9px] font-black uppercase tracking-wider rounded-lg sm:rounded-xl hover:bg-black transition-all flex items-center justify-center gap-1.5 active:scale-95 shrink-0"
            >
              <Plus size={14} /> Add Item
            </button>
          </div>

          <div className="space-y-4 sm:space-y-6">
            <AnimatePresence mode="popLayout">
              {items.map((item, index) => (
                <motion.div 
                  key={item.id_for_key} 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="grid grid-cols-12 gap-3 p-4 sm:p-6 bg-slate-50/50 rounded-xl sm:rounded-[2rem] border border-slate-100 relative items-end"
                  style={{ zIndex: activeDropdown === index ? 100 : items.length - index }}
                >
                  {/* Product Search */}
                  <div className="col-span-12 md:col-span-5 space-y-1.5 relative">
                    <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block ml-0.5">Product Name</span>
                    <div className="relative">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={14} />
                      <input 
                        required
                        placeholder="Search stock catalog..."
                        className="w-full bg-white border border-slate-200 py-2.5 sm:py-4 pl-10 pr-4 rounded-xl text-xs font-semibold outline-none focus:border-lime-500 transition-all shadow-sm text-slate-800"
                        value={item.product_name}
                        onFocus={() => setActiveDropdown(index)}
                        onChange={(e) => updateItem(index, 'product_name', e.target.value)}
                      />
                      
                      {/* Autocomplete Droplist Dropdown */}
                      {activeDropdown === index && item.product_name.trim().length > 0 && (
                        <div className="absolute z-[110] left-0 right-0 top-[110%] bg-white border border-slate-100 shadow-xl rounded-xl overflow-hidden max-h-52 overflow-y-auto mt-1 border-t-2 border-t-lime-500 p-1">
                          {inventory
                            .filter(p => p.name.toLowerCase().includes(item.product_name.toLowerCase()))
                            .map((prod, pIdx) => (
                              <button
                                key={`prod-${prod.id || pIdx}-${item.id_for_key}`} 
                                type="button"
                                onClick={() => selectProduct(index, prod)}
                                className="w-full text-left p-3 hover:bg-slate-50 rounded-lg flex justify-between items-center transition-colors border-b border-slate-50/50 last:border-0 gap-4"
                              >
                                <div className="min-w-0">
                                  <p className="font-bold text-slate-800 text-xs truncate">{prod.name}</p>
                                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wide italic mt-0.5">Current Stock: {prod.stock_quantity}</p>
                                </div>
                                <span className="text-xs font-black text-lime-600 shrink-0">₹{cleanDecimal(prod.purchase_price)}</span>
                              </button>
                            ))}
                          {inventory.filter(p => p.name.toLowerCase().includes(item.product_name.toLowerCase())).length === 0 && (
                            <div className="p-3 text-center text-xs font-semibold text-slate-400 italic">No products match query</div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Pricing Matrix Layout Segment */}
                  <div className="col-span-12 md:col-span-7 grid grid-cols-12 gap-2.5 items-end">
                    {/* Quantity */}
                    <div className="col-span-3 space-y-1.5 text-center">
                      <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">Qty</span>
                      <input type="number" min="1" className="w-full h-9 sm:h-11 bg-white border border-slate-200 px-2 rounded-xl text-xs font-black outline-none focus:border-lime-500 transition-all text-center tabular-nums text-slate-800 shadow-sm" value={item.quantity} onChange={(e) => updateItem(index, 'quantity', Number(e.target.value))} />
                    </div>

                    {/* Cost Price */}
                    <div className="col-span-5 space-y-1.5">
                      <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block text-center md:text-left md:ml-1">Cost Price</span>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] font-bold pointer-events-none">₹</span>
                        <input type="number" step="0.01" className="w-full h-9 sm:h-11 bg-white border border-slate-200 pl-6 pr-2 rounded-xl text-xs font-black outline-none focus:border-lime-500 transition-all tabular-nums text-slate-800 text-center md:text-left shadow-sm" value={item.cost_price} onChange={(e) => updateItem(index, 'cost_price', Number(e.target.value))} />
                      </div>
                    </div>

                    {/* GST % */}
                    <div className="col-span-2 space-y-1.5 text-center">
                      <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">GST%</span>
                      <input type="number" className="w-full h-9 sm:h-11 bg-white border border-slate-200 px-1 rounded-xl text-xs font-black outline-none focus:border-lime-500 transition-all text-center tabular-nums text-slate-800 shadow-sm" value={item.gst_percent} onChange={(e) => updateItem(index, 'gst_percent', Number(e.target.value))} />
                    </div>

                    {/* Remove Action Button */}
                    <div className="col-span-2 flex items-center justify-center h-9 sm:h-11">
                      <button 
                        type="button" 
                        onClick={() => removeItem(index)} 
                        disabled={items.length === 1}
                        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg sm:rounded-xl transition-all active:scale-90 disabled:opacity-30 disabled:hover:bg-transparent"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* SUMMARY PANEL */}
      <div className="lg:col-span-1">
        <div className="lg:sticky lg:top-24 space-y-6">
          <div className="bg-slate-900 rounded-[1.5rem] sm:rounded-[3rem] p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-lime-400/5 blur-3xl rounded-full pointer-events-none" />
            <h3 className="text-[10px] font-black uppercase tracking-wider flex items-center gap-2 mb-8 sm:mb-12 text-slate-500 italic">
              <Calculator size={14} className="text-lime-400" /> Cost Summary Analysis
            </h3>
            
            <div className="space-y-4 sm:space-y-6 relative z-10">
              <div className="flex justify-between text-slate-400 text-[9px] sm:text-[10px] font-black uppercase tracking-wide">
                <span>Net Subtotal</span>
                <span className="text-white font-mono italic tabular-nums">₹{calculateSubtotal().toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-slate-400 text-[9px] sm:text-[10px] font-black uppercase tracking-wide">
                <span>Total Tax Amount</span>
                <span className="text-lime-400 font-mono italic tabular-nums">+ ₹{calculateTotalGST().toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              
              <div className="h-px bg-white/5 my-6 sm:my-8" />
              
              <div className="flex justify-between items-end gap-4">
                <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wide text-slate-500 pb-1 leading-none">Gross Total</span>
                <span className="text-3xl sm:text-5xl font-black italic tracking-tighter tabular-nums leading-none">₹{totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              
              <button 
                disabled={loading} 
                type="submit" 
                className="w-full mt-8 sm:mt-12 h-12 bg-lime-400 text-slate-900 font-black rounded-xl sm:rounded-[1.5rem] text-[10px] sm:text-[11px] uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-white transition-all active:scale-[0.99] shadow-md shadow-lime-400/10 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" size={16} /> : <><Zap size={14} fill="currentColor" /> Save Purchase Order</>}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Screen Backdrop Click Shield */}
      {activeDropdown !== null && (
        <div className="fixed inset-0 z-10" onClick={() => setActiveDropdown(null)} />
      )}
    </form>
  );
}