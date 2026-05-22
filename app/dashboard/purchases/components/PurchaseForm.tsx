"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiRequest, cleanDecimal } from "@/lib/api"; 
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, Trash2, Store, Calculator, 
  Loader2, CheckCircle2, Search, 
  ChevronDown, Box, Zap
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
        console.error("Neural Inventory Link Failure", err);
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
    if (items.length > 1) setItems(items.filter((_, i) => i !== index));
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
          supplier_name: supplierName || "Direct Vendor", 
          items: items.map(({ id_for_key, ...rest }) => rest) 
        })
      });
      router.push("/dashboard/purchases");
    } catch (err) {
      alert("Purchase Protocol Interrupted.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
      <div className="lg:col-span-2 space-y-6">
        
        {/* SUPPLIER IDENTITY */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4">
          <label className="text-[10px] uppercase tracking-[0.3em] font-black text-slate-400">Master Supplier Selection</label>
          <div className="relative group">
            <Store className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-lime-500 transition-colors" size={20} />
            <input 
              required
              placeholder="Supplier Identity..."
              className="w-full bg-slate-50 border border-slate-100 p-5 pl-14 rounded-2xl focus:border-lime-500 focus:bg-white outline-none transition-all font-bold text-sm"
              value={supplierName}
              onChange={(e) => setSupplierName(e.target.value)}
            />
          </div>
        </div>

        {/* LINE ITEMS */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-10 border-b border-slate-50 pb-6">
            <label className="text-[10px] uppercase tracking-[0.3em] font-black text-slate-400 italic">Inventory Manifest</label>
            <button type="button" onClick={addItem} className="bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest px-6 py-3.5 rounded-xl hover:bg-black transition-all flex items-center gap-2 active:scale-95">
              <Plus size={14} /> Add Entity
            </button>
          </div>

          <div className="space-y-6">
            <AnimatePresence mode="popLayout">
              {items.map((item, index) => (
                <motion.div 
                  key={item.id_for_key} 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="grid grid-cols-12 gap-4 p-6 bg-slate-50/50 rounded-[2rem] border border-slate-100 relative items-end"
                  style={{ zIndex: activeDropdown === index ? 100 : items.length - index }}
                >
                  {/* Asset Specification - Better Padding/Alignment */}
                  <div className="col-span-12 md:col-span-5 space-y-2">
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Asset Specification</span>
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                      <input 
                        required
                        placeholder="Search stock..."
                        className="w-full bg-white border border-slate-200 p-4 pl-11 rounded-xl text-xs font-bold outline-none focus:border-lime-500 transition-all shadow-sm"
                        value={item.product_name}
                        onFocus={() => setActiveDropdown(index)}
                        onChange={(e) => updateItem(index, 'product_name', e.target.value)}
                      />
                      
                      {activeDropdown === index && (
                        <div className="absolute z-[110] left-0 right-0 top-[110%] bg-white border border-slate-100 shadow-2xl rounded-2xl overflow-hidden max-h-60 overflow-y-auto border-t-4 border-t-lime-500">
                          {inventory
                            .filter(p => p.name.toLowerCase().includes(item.product_name.toLowerCase()))
                            .map((prod, pIdx) => (
                              <button
                                key={`prod-${prod.id || pIdx}-${item.id_for_key}`} 
                                type="button"
                                onClick={() => selectProduct(index, prod)}
                                className="w-full text-left p-4 hover:bg-lime-50 border-b border-slate-50 last:border-0 flex justify-between items-center transition-colors"
                              >
                                <div>
                                  <p className="font-bold text-slate-700 text-xs">{prod.name}</p>
                                  <p className="text-[9px] text-slate-400 font-black uppercase tracking-tighter italic">Stock: {prod.stock_quantity}</p>
                                </div>
                                <span className="text-xs font-black text-lime-600">₹{cleanDecimal(prod.purchase_price)}</span>
                              </button>
                            ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Volume (Quantity) - Fixed Width Alignment */}
                  <div className="col-span-3 md:col-span-2 space-y-2">
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 text-center block">Volume</span>
                    <input type="number" min="1" className="w-full bg-white border border-slate-200 p-4 rounded-xl text-xs font-black outline-none focus:border-lime-500 transition-all text-center tabular-nums" value={item.quantity} onChange={(e) => updateItem(index, 'quantity', Number(e.target.value))} />
                  </div>

                  {/* Rate (Cost Price) - Fixed Width Alignment */}
                  <div className="col-span-5 md:col-span-3 space-y-2">
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Inbound Rate</span>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] font-bold">₹</span>
                      <input type="number" step="0.01" className="w-full bg-white border border-slate-200 p-4 pl-8 rounded-xl text-xs font-black outline-none focus:border-lime-500 transition-all tabular-nums" value={item.cost_price} onChange={(e) => updateItem(index, 'cost_price', Number(e.target.value))} />
                    </div>
                  </div>

                  {/* Tax - Centered Alignment */}
                  <div className="col-span-3 md:col-span-1 space-y-2">
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 text-center block">GST%</span>
                    <input type="number" className="w-full bg-white border border-slate-200 p-4 rounded-xl text-[10px] font-bold outline-none focus:border-lime-500 transition-all text-center tabular-nums" value={item.gst_percent} onChange={(e) => updateItem(index, 'gst_percent', Number(e.target.value))} />
                  </div>

                  {/* Trash - Aligned vertically with inputs */}
                  <div className="col-span-1 flex items-center justify-center h-[52px]">
                    <button type="button" onClick={() => removeItem(index)} className="p-2.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all active:scale-75">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* SUMMARY PANEL - Polished spacing */}
      <div className="lg:col-span-1">
        <div className="sticky top-24 space-y-6">
          <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-lime-400/10 blur-3xl rounded-full" />
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] flex items-center gap-3 mb-12 text-slate-500">
              <Calculator size={16} className="text-lime-400" /> Procurement Intel
            </h3>
            
            <div className="space-y-6 relative z-10">
              <div className="flex justify-between text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                <span>Net Subtotal</span>
                <span className="text-white font-mono italic">₹{calculateSubtotal().toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                <span>Aggregated Tax</span>
                <span className="text-lime-400 font-mono italic">+ ₹{calculateTotalGST().toLocaleString()}</span>
              </div>
              <div className="h-px bg-white/10 my-8 shadow-inner" />
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 pb-2 leading-none">Gross Payable</span>
                <span className="text-5xl font-black italic tracking-tighter tabular-nums leading-none">₹{totalAmount.toLocaleString()}</span>
              </div>
              <button disabled={loading} type="submit" className="w-full mt-12 py-6 bg-lime-400 text-slate-900 font-black rounded-[1.5rem] text-[11px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-white transition-all active:scale-95 shadow-xl shadow-lime-400/20">
                {loading ? <Loader2 className="animate-spin" size={20} /> : <><Zap size={18} fill="currentColor" /> Commit Cluster</>}
              </button>
            </div>
          </div>
        </div>
      </div>

      {activeDropdown !== null && (
        <div className="fixed inset-0 z-10" onClick={() => setActiveDropdown(null)} />
      )}
    </form>
  );
}