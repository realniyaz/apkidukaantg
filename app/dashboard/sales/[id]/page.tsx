"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calculator, Loader2, ArrowLeft, 
  ChevronDown, CreditCard, Server, User, Phone
} from "lucide-react";
import Link from "next/link";

// --- COMPONENTS ---
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
      console.error("Dashboard sync failed:", err);
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
        console.error("Inventory offline:", err);
      }
      setLoading(false);
    })();
  }, [saleId]);

  // --- HANDLERS ---
  const addPendingItem = () => {
    setPendingItems([...pendingItems, { product_id: 0, product_name: "", quantity: 1, selling_price: 0, gst_percent: 18 }]);
  };

  const removePendingItem = (index: number) => {
    setPendingItems(pendingItems.filter((_, i) => i !== index));
    if (activeSearchIndex === index) setActiveSearchIndex(null);
  };

  const updatePendingItem = (index: number, field: keyof SaleItem, value: any) => {
    const updated = [...pendingItems];
    updated[index] = { ...updated[index], [field]: value };
    setPendingItems(updated);
    if (field === "product_name") {
      setActiveSearchIndex(value.trim() !== "" ? index : null);
    }
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

  // --- ACTIONS ---
  const handleSyncManifest = async () => {
    const validItems = pendingItems.filter(i => i.product_name && i.quantity > 0);
    if (validItems.length === 0) return;

    setActionLoading("syncItems");
    try {
      await apiRequest(`sales/${saleId}/items`, {
        method: "POST",
        body: JSON.stringify({
          items: validItems.map(i => ({
            product_name: i.product_name,
            quantity: Number(i.quantity),
            selling_price: Number(i.selling_price)
          }))
        })
      });
      setPendingItems([]); 
      await fetchSaleData(); 
    } catch (err: any) {
      alert(`Sync Failed: ${err.message}`);
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
      alert(`Payment Processing Failed: ${err.message}`);
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
      router.push(`/dashboard/sales/${saleId}/invoice`);
    } catch (err: any) {
      alert(`Invoice Generation Error: ${err.message}`);
      setActionLoading(null);
    }
  };

  if (loading || !sale) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFDFD]">
        <Loader2 className="animate-spin text-lime-500" size={36} />
      </div>
    );
  }

  const isPosted = sale.status?.toLowerCase() === "posted" || sale.status?.toLowerCase() === "completed";
  const totalAmount = Number(sale.total_amount) || 0;
  const paidAmount = Number(sale.paid_amount) || 0;
  const balanceDue = totalAmount - paidAmount;

  return (
    <div className="p-4 sm:p-6 md:p-10 pb-24 text-slate-900">
      <PaymentModal 
  isOpen={isPaymentModalOpen}
  onClose={() => setIsPaymentModalOpen(false)}
  totalAmount={balanceDue}
  isProcessing={actionLoading === "payment"}
  onConfirm={handlePayment}
  // --- ADD THESE TWO LINES TO FIX THE ERROR ---
  saleId={Number(saleId)} 
  saleStatus={sale?.status || 'DRAFT'}
  // --------------------------------------------
/>

      {/* --- HEADER --- */}
      <div className="max-w-7xl mx-auto mb-8 sm:mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 sm:gap-6">
        <div className="space-y-3 sm:space-y-4 w-full md:w-auto">
          <Link href="/dashboard/sales" className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-all text-[9px] sm:text-[10px] font-black uppercase tracking-wider group w-fit">
            <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" /> Back to Sales
          </Link>
          <div className="flex flex-col gap-1 min-w-0">
            <div className="flex items-center gap-2 text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-slate-400">
               <User size={12} className="text-lime-600" /> Customer Account
            </div>
            <h1 className="text-4xl sm:text-6xl font-black italic tracking-tighter uppercase leading-[0.9] sm:leading-[0.85] truncate line-clamp-1">
              {sale.customer_name || "Walk-in Customer"}
            </h1>
            <div className="flex items-center gap-3 mt-1.5 sm:mt-2">
               <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 font-mono">
                  <Phone size={10} className="shrink-0" /> {sale.customer_phone || "No contact reference"}
               </span>
               <div className={`px-2.5 py-0.5 rounded-md flex items-center gap-1.5 border ${isPosted ? 'bg-lime-50 border-lime-100 text-lime-700' : 'bg-slate-50 border-slate-100 text-slate-500'}`}>
                <span className="text-[9px] font-black uppercase tracking-wider">{sale.status || 'DRAFT'}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="text-left md:text-right w-full md:w-auto border-t border-slate-50 md:border-none pt-3 md:pt-0">
           <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-wider mb-0.5">Invoice Reference</p>
           <p className="text-xl sm:text-3xl font-black text-slate-300 italic tracking-tighter">#{sale.id}</p>
        </div>
      </div>

      {/* --- CONTENT LAYOUT --- */}
      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-6 md:gap-10">
        <div className="col-span-12 lg:col-span-8 space-y-6 sm:space-y-12">
          
          <SaleItemsList items={sale.items || []} />

          {!isPosted && (
            <section className="space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <AddItemForm onAddBlankRow={addPendingItem} />
                {pendingItems.length > 0 && (
                  <button 
                    type="button" 
                    onClick={handleSyncManifest} 
                    disabled={actionLoading === "syncItems"}
                    className="h-11 px-5 bg-slate-900 text-lime-400 rounded-xl font-black text-[10px] uppercase tracking-wider hover:bg-black transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {actionLoading === "syncItems" ? <Loader2 size={14} className="animate-spin" /> : <><Server size={14} /> Update Bill</>}
                  </button>
                )}
              </div>

              {pendingItems.length === 0 ? (
                <div className="bg-white rounded-xl sm:rounded-[2.5rem] p-6 sm:p-10 text-center border border-slate-100 shadow-sm">
                  <p className="text-xs font-bold text-slate-300 uppercase tracking-wider">No active pending items</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <AnimatePresence mode="popLayout">
                    {pendingItems.map((item, index) => (
                      <div key={`pending-${index}`} className="relative">
                        <SaleItemRow 
                          item={item} 
                          index={index} 
                          onUpdate={updatePendingItem} 
                          onRemove={removePendingItem} 
                        />
                        
                        {/* Autocomplete Droplist Dropdown */}
                        {activeSearchIndex === index && item.product_name.trim().length > 0 && (
                          <motion.div 
                            initial={{ opacity: 0, y: -5 }} 
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            className="absolute left-0 right-0 sm:left-4 sm:right-auto sm:w-[350px] bg-white border border-slate-100 shadow-xl rounded-xl overflow-hidden z-[100] p-1.5 mt-1"
                          >
                            {inventory
                              .filter(p => p.name.toLowerCase().includes(item.product_name.toLowerCase()))
                              .slice(0, 5)
                              .map((p, pIndex) => (
                                <button
                                  key={`search-res-${p.id || pIndex}`}
                                  type="button"
                                  onClick={() => selectProduct(index, p)}
                                  className="w-full text-left p-3 hover:bg-slate-50 rounded-lg flex justify-between items-center group transition-colors"
                                >
                                  <div className="flex flex-col min-w-0 pr-2">
                                    <span className="text-xs font-bold text-slate-900 truncate">{p.name}</span>
                                    <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider mt-0.5">
                                      Stock: {p.stock_quantity} <span className="mx-1">•</span> ₹{p.selling_price}
                                    </span>
                                  </div>
                                  <ChevronDown size={14} className="text-slate-300 group-hover:text-lime-500 -rotate-90 shrink-0" />
                                </button>
                              ))}
                            {inventory.filter(p => p.name.toLowerCase().includes(item.product_name.toLowerCase())).length === 0 && (
                              <div className="p-3 text-center text-xs font-semibold text-slate-400 italic">
                                No items match query
                              </div>
                            )}
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

        {/* --- FINANCIAL BILL SUMMARY --- */}
        <div className="col-span-12 lg:col-span-4">
          <div className="lg:sticky lg:top-24 space-y-6">
            <div className="bg-slate-900 rounded-[1.5rem] sm:rounded-[3rem] p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-lime-400/5 blur-3xl rounded-full pointer-events-none" />
              <h3 className="text-[10px] font-black uppercase tracking-wider mb-8 sm:mb-12 flex items-center gap-2 text-slate-500 italic">
                <Calculator size={14} className="text-lime-400" /> Bill Summary Assessment
              </h3>

              <div className="space-y-4 sm:space-y-6 relative z-10">
                <div className="flex justify-between items-center opacity-40">
                  <span className="text-[9px] sm:text-[10px] uppercase tracking-wider">Subtotal</span>
                  <span className="font-mono text-sm">₹{(Number(sale.sub_total) || 0).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center text-lime-400">
                  <span className="text-[9px] sm:text-[10px] uppercase tracking-wider font-black">Estimated GST</span>
                  <span className="font-mono text-sm">+ ₹{(Number(sale.total_gst) || 0).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center text-blue-400 pt-2 border-t border-white/5">
                  <span className="text-[9px] sm:text-[10px] uppercase tracking-wider font-black">Amount Settled</span>
                  <span className="font-mono text-sm">- ₹{paidAmount.toLocaleString('en-IN')}</span>
                </div>
                
                <div className="h-px bg-white/5 my-6 sm:my-8" />
                
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider">Balance Outstanding</span>
                  <span className="text-3xl sm:text-5xl font-black italic tracking-tighter text-white tabular-nums">
                    ₹{balanceDue > 0 ? balanceDue.toLocaleString('en-IN') : "0"}
                  </span>
                </div>

                <div className="mt-8 sm:mt-10 space-y-3">
                  {!isPosted && balanceDue > 0 && sale.items && sale.items.length > 0 && (
                    <button 
                      onClick={() => setIsPaymentModalOpen(true)}
                      className="w-full h-12 bg-white/5 hover:bg-white/10 text-white rounded-xl sm:rounded-[2rem] font-black text-[10px] uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
                    >
                      <CreditCard size={14} /> Record Payment
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