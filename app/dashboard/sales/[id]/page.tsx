"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calculator, Loader2, ArrowLeft, 
  ChevronDown, CreditCard, Server, ShieldCheck, AlertTriangle, User, Phone
} from "lucide-react";
import Link from "next/link";

// --- IMPORTED MODULAR COMPONENTS ---
import PaymentModal from "./components/PaymentModal";
import SaleItemRow from "./components/SaleItemRow";
import SaleItemsList from "./components/SaleItemsList";
import AddItemForm from "./components/AddItemForm";
import PostSaleButton from "./components/PostSaleButton";
import GenerateInvoiceBtn from "./components/GenerateInvoiceBtn";

import { Sale, SaleItem } from "@/types/sales";

interface InventoryProduct {
  id: number;
  name: string;
  selling_price: number;
  gst_percent: number;
  stock_quantity: number;
}

export default function SaleControlCenter() {
  const params = useParams();
  const router = useRouter();
  const saleId = params.id as string;

  const [sale, setSale] = useState<Sale | null>(null);
  const [inventory, setInventory] = useState<InventoryProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [pendingItems, setPendingItems] = useState<SaleItem[]>([]);
  const [activeSearchIndex, setActiveSearchIndex] = useState<number | null>(null);

  // --- DATA FETCHING ---
  const fetchSaleData = async () => {
    try {
      const data = await apiRequest<Sale>(`sales/${saleId}`, { method: "GET" });
      setSale(data);
    } catch (err) {
      console.error("Neural Sync Failure", err);
    }
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      await fetchSaleData();
      try {
        const invData = await apiRequest<InventoryProduct[]>("products", { method: "GET" });
        setInventory(invData || []);
      } catch (err) {
        console.error("Inventory Offline", err);
      }
      setLoading(false);
    })();
  }, [saleId]);

  // --- PENDING MANIFEST HANDLERS ---
  const addPendingItem = () => {
    setPendingItems([...pendingItems, { product_id: 0, product_name: "", quantity: 1, selling_price: 0, gst_percent: 18 }]);
  };

  const removePendingItem = (index: number) => {
    setPendingItems(pendingItems.filter((_, i) => i !== index));
  };

  const updatePendingItem = (index: number, field: keyof SaleItem, value: any) => {
    const updated = [...pendingItems];
    updated[index] = { ...updated[index], [field]: value };
    setPendingItems(updated);
    if (field === "product_name") setActiveSearchIndex(index);
  };

  const selectProduct = (index: number, prod: InventoryProduct) => {
    const updated = [...pendingItems];
    updated[index] = {
      product_id: prod.id,
      product_name: prod.name,
      quantity: 1,
      selling_price: Number(prod.selling_price) || 0,
      gst_percent: Number(prod.gst_percent) || 0
    };
    setPendingItems(updated);
    setActiveSearchIndex(null);
  };

  // --- API ACTIONS ---
  const handleSyncManifest = async () => {
    const validItems = pendingItems.filter(i => i.product_name && i.quantity > 0);
    if (validItems.length === 0) return;

    setActionLoading("syncItems");
    try {
      // ✅ FIXED: Matches Swagger expectation of { "items": [...] }
      await apiRequest(`sales/${saleId}/items`, {
        method: "POST",
        body: JSON.stringify({
          items: validItems.map(i => ({
            product_name: i.product_name,
            quantity: Number(i.quantity),
            selling_price: Number(i.selling_price)
            // Note: Add gst_percent if your backend schema supports it in /items
          }))
        })
      });
      setPendingItems([]); 
      await fetchSaleData(); 
    } catch (err: any) {
      alert(`Manifest Sync Error: ${err.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  const handlePayment = async (paymentData: { amount: number; mode: string }) => {
    setActionLoading("payment");
    try {
      await apiRequest(`sales/${saleId}/payment`, {
        method: "POST",
        body: JSON.stringify({ mode: paymentData.mode, amount: paymentData.amount })
      });
      setIsPaymentModalOpen(false);
      await fetchSaleData();
    } catch (err: any) {
      alert(`Settlement Error: ${err.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleFinalizeSale = async () => {
    setActionLoading("finalize");
    try {
      await apiRequest(`sales/${saleId}/post`, { method: "POST" });
      await fetchSaleData();
    } catch (err: any) {
      alert(`Finalization Error: ${err.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleGenerateInvoice = async () => {
    setActionLoading("invoice");
    try {
      await apiRequest(`sales/${saleId}/invoice`, { method: "POST" });
      // Redirect to the actual printable page
      router.push(`/dashboard/sales/${saleId}/invoice`);
    } catch (err: any) {
      alert(`Invoice Generation Error: ${err.message}`);
      setActionLoading(null);
    }
  };

  if (loading || !sale) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFDFD]">
        <Loader2 className="animate-spin text-lime-500" size={48} />
      </div>
    );
  }

  const isPosted = sale.status?.toLowerCase() === "posted" || sale.status?.toLowerCase() === "completed";
  const totalAmount = Number(sale.total_amount) || 0;
  const paidAmount = Number(sale.paid_amount) || 0;
  const balanceDue = totalAmount - paidAmount;

  return (
    <div className="p-4 md:p-10 pb-24">
      <PaymentModal 
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        totalAmount={balanceDue}
        isProcessing={actionLoading === "payment"}
        onConfirm={handlePayment}
      />

      {/* --- HEADER --- */}
      <div className="max-w-7xl mx-auto mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-4">
          <Link href="/dashboard/sales" className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-all text-[10px] font-black uppercase tracking-[0.4em] group">
            <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" /> Return to Cluster
          </Link>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
               <User size={12} className="text-lime-500" /> Uplinked Entity
            </div>
            <h1 className="text-6xl font-black italic tracking-tighter uppercase leading-[0.85] text-slate-900">
              {sale.customer_name || "Guest Node"}
            </h1>
            <div className="flex items-center gap-4 mt-2">
               <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5">
                  <Phone size={10} /> {sale.customer_phone || "No Reference"}
               </span>
               <div className={`px-3 py-1 rounded-lg flex items-center gap-2 border ${isPosted ? 'bg-lime-50 border-lime-100 text-lime-700' : 'bg-slate-50 border-slate-100 text-slate-500'}`}>
                <span className="text-[9px] font-black uppercase tracking-widest">{sale.status || 'DRAFT'}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="text-right">
           <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] mb-1">Sale Sequence</p>
           <p className="text-3xl font-black text-slate-200 italic tracking-tighter">#{sale.id}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-10">
        <div className="col-span-12 lg:col-span-8 space-y-12">
          
          {/* SECURED MANIFEST */}
          <SaleItemsList items={sale.items || []} />

          {!isPosted && (
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <AddItemForm onAddBlankRow={addPendingItem} />
                {pendingItems.length > 0 && (
                  <button 
                    type="button" 
                    onClick={handleSyncManifest} 
                    disabled={actionLoading === "syncItems"}
                    className="px-6 py-3 bg-slate-900 text-lime-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl flex items-center gap-2 disabled:opacity-50"
                  >
                    {actionLoading === "syncItems" ? <Loader2 size={14} className="animate-spin" /> : <><Server size={14} /> Sync to Core</>}
                  </button>
                )}
              </div>

              {pendingItems.length === 0 ? (
                <div className="bg-white rounded-[2.5rem] p-10 text-center border border-slate-100 shadow-sm mt-4">
                  <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">Awaiting local inputs...</p>
                </div>
              ) : (
                <div className="space-y-4 mt-4">
                  <AnimatePresence mode="popLayout">
                    {pendingItems.map((item, index) => (
                      <div key={`pending-${index}`} className="relative">
                        <SaleItemRow 
                          item={item} 
                          index={index} 
                          onUpdate={updatePendingItem} 
                          onRemove={removePendingItem} 
                        />
                        {activeSearchIndex === index && item.product_name.length > 0 && (
                          <motion.div 
                            initial={{ opacity: 0, y: -10 }} 
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute left-10 top-[60%] w-[350px] bg-white border border-slate-100 shadow-2xl rounded-2xl overflow-hidden z-[100] p-2"
                          >
                            {inventory
                              .filter(p => p.name.toLowerCase().includes(item.product_name.toLowerCase()))
                              .slice(0, 5)
                              .map((p, pIndex) => (
                                <button
                                  key={`search-res-${p.id || pIndex}`}
                                  type="button"
                                  onClick={() => selectProduct(index, p)}
                                  className="w-full text-left p-4 hover:bg-slate-50 rounded-xl flex justify-between items-center group transition-colors"
                                >
                                  <div className="flex flex-col">
                                    <span className="text-xs font-black text-slate-900">{p.name}</span>
                                    <span className="text-[9px] text-slate-400 uppercase font-bold tracking-widest mt-1">
                                      Stock: {p.stock_quantity} <span className="mx-1">•</span> ₹{p.selling_price}
                                    </span>
                                  </div>
                                  <ChevronDown size={14} className="text-slate-300 group-hover:text-lime-500 -rotate-90" />
                                </button>
                              ))}
                          </motion.div>
                        )}
                      </div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </section>
          )}
        </div>

        {/* --- RIGHT COLUMN: FINANCIAL SUMMARY --- */}
        <div className="col-span-12 lg:col-span-4">
          <div className="sticky top-10 space-y-6">
            <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-lime-400/10 blur-3xl rounded-full" />
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] mb-12 flex items-center gap-3 text-slate-500">
                <Calculator size={16} className="text-lime-400" /> Core Database Yield
              </h3>

              <div className="space-y-6 relative z-10">
                <div className="flex justify-between items-center opacity-40">
                  <span className="text-[10px] uppercase tracking-widest">Gross Base</span>
                  <span className="font-mono text-sm">₹{(Number(sale.sub_total) || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-lime-400">
                  <span className="text-[10px] uppercase tracking-widest font-black">Neural Tax</span>
                  <span className="font-mono text-sm">+ ₹{(Number(sale.total_gst) || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-blue-400 pt-2 border-t border-white/10">
                  <span className="text-[10px] uppercase tracking-widest font-black">Settled Capital</span>
                  <span className="font-mono text-sm">- ₹{paidAmount.toLocaleString()}</span>
                </div>
                
                <div className="h-px bg-white/10 my-8 shadow-inner" />
                
                <div className="flex flex-col gap-2">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.5em]">Outstanding Debt</span>
                  <span className="text-5xl font-black italic tracking-tighter text-white">
                    ₹{balanceDue > 0 ? balanceDue.toLocaleString() : "0"}
                  </span>
                </div>

                <div className="mt-10 space-y-3">
                  {!isPosted && balanceDue > 0 && sale.items && sale.items.length > 0 && (
                    <button 
                      onClick={() => setIsPaymentModalOpen(true)}
                      className="w-full py-4 bg-white/10 hover:bg-white/20 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                    >
                      <CreditCard size={16} /> Execute Settlement
                    </button>
                  )}

                  {!isPosted && (
                    <PostSaleButton 
                      onPost={handleFinalizeSale}
                      isLoading={actionLoading === "finalize"}
                      isDisabled={sale.items?.length === 0 || pendingItems.length > 0}
                      tooltipMsg={pendingItems.length > 0 ? "Sync pending items first" : ""}
                    />
                  )}

                  {isPosted && (
                    <GenerateInvoiceBtn 
                      onGenerate={handleGenerateInvoice}
                      isLoading={actionLoading === "invoice"}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}