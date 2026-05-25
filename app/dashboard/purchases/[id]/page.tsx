"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Loader2, User, TrendingUp, 
  ChevronLeft, Download, CheckCircle2, Wallet,
  Calendar, CreditCard, FileText, AlertCircle
} from "lucide-react";

import StatusBadge from "../components/StatusBadge";
import PurchaseItemsTable from "../components/PurchaseItemsTable";

interface PurchaseDetail {
  id: number;
  purchase_number: string;
  status: "DRAFT" | "POSTED" | "PAID";
  supplier_name?: string;
  total_amount: number;
  paid_amount: number;
  total_gst: number;
  sub_total: number;
  created_at: string;
  items: any[];
}

export default function PurchaseDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [purchase, setPurchase] = useState<PurchaseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchPurchase = useCallback(async () => {
    try {
      const data = await apiRequest<PurchaseDetail>(`/purchases/${id}`);
      setPurchase(data);
    } catch (error) {
      console.error("Failed to fetch purchase details:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchPurchase(); }, [fetchPurchase]);

  const handleWorkflowTransition = async (action: 'post' | 'pay') => {
    setIsProcessing(true);
    try {
      const endpoint = action === 'post' ? `/purchases/${id}/post` : `/purchases/${id}/pay`;
      const body = action === 'pay' ? { 
        amount: purchase?.total_amount, 
        payment_method: "direct_bank" 
      } : undefined;

      await apiRequest(endpoint, { 
        method: "POST", 
        body: body ? JSON.stringify(body) : undefined 
      });
      
      await fetchPurchase();
    } catch (error) {
      console.error(`Workflow action '${action}' failed:`, error);
    } finally {
      setIsProcessing(false);
    }
  };

  const balanceDue = useMemo(() => 
    (purchase?.total_amount ?? 0) - (purchase?.paid_amount ?? 0), 
  [purchase]);

  if (loading) return <PurchaseDetailSkeleton />;
  if (!purchase) return <ErrorState onRetry={fetchPurchase} />;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8 text-slate-900"
    >
      {/* 1. NAV-HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 sm:gap-6 border-b border-slate-100 pb-6 sm:pb-8">
        <div className="space-y-3 sm:space-y-4 w-full md:w-auto">
          <button 
            onClick={() => router.back()} 
            className="group flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-all font-bold text-[10px] sm:text-xs uppercase tracking-wider w-fit"
          >
            <ChevronLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" /> 
            Back to Purchases
          </button>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 min-w-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2.5 bg-slate-900 rounded-xl text-white shadow-md shrink-0">
                <FileText size={20} className="sm:h-6 sm:w-6" />
              </div>
              <div className="min-w-0">
                <h1 className="text-xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight uppercase italic truncate leading-none">
                  Order <span className="text-slate-400 font-mono font-medium">#{purchase.purchase_number}</span>
                </h1>
                <div className="flex items-center gap-2 mt-1.5 text-slate-400 text-xs font-medium">
                  <span className="flex items-center gap-1"><Calendar size={12}/> {new Date(purchase.created_at).toLocaleDateString('en-GB')}</span>
                  <span className="h-1 w-1 bg-slate-200 rounded-full" />
                  <span className="uppercase font-bold text-[9px] tracking-wider italic">ID: #{purchase.id}</span>
                </div>
              </div>
            </div>
            <div className="w-fit sm:mt-0">
              <StatusBadge status={purchase.status} />
            </div>
          </div>
        </div>
        
        <div className="w-full md:w-auto border-t border-slate-50 md:border-none pt-4 md:pt-0">
          <button className="w-full md:w-auto flex items-center justify-center gap-2 h-11 px-5 bg-white border border-slate-200 rounded-xl font-bold text-xs text-slate-600 hover:bg-slate-50 transition-all shadow-sm active:scale-[0.99]">
            <Download size={16} /> Export PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        {/* 2. MAIN SPECIFICATION DATA CARD */}
        <div className="col-span-12 lg:col-span-8 space-y-6 sm:space-y-8">
          {/* Supplier Vendor card alignment */}
          <div className="bg-white p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-[2rem] border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 sm:h-16 sm:w-16 bg-lime-50 rounded-xl sm:rounded-2xl flex items-center justify-center text-lime-600 shrink-0">
                <User size={24} className="sm:h-8 sm:w-8" />
              </div>
              <div className="min-w-0">
                <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Supplier Details</p>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight uppercase italic truncate">{purchase.supplier_name || "Direct Purchase"}</h3>
              </div>
            </div>
            <div className="text-left sm:text-right border-t border-slate-50 sm:border-none pt-3 sm:pt-0 shrink-0">
              <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Tax Framework</p>
              <span className="px-2.5 py-1 bg-slate-50 rounded-md text-[10px] font-bold text-slate-500 border border-slate-100">GST REGISTERED</span>
            </div>
          </div>

          <PurchaseItemsTable items={purchase.items} />
        </div>

        {/* 3. FINANCIAL CONTROL BILL SUMMARY */}
        <div className="col-span-12 lg:col-span-4 space-y-4 sm:space-y-6">
          <div className="bg-slate-900 rounded-xl sm:rounded-[2.5rem] p-5 sm:p-8 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-lime-500/5 blur-[50px] rounded-full -mr-16 -mt-16 pointer-events-none" />
            
            <h3 className="text-lg sm:text-xl font-bold flex items-center gap-2 mb-8 sm:mb-10 relative z-10 italic">
              <TrendingUp className="text-lime-400" size={18} /> Cost Breakdown Analysis
            </h3>

            <div className="space-y-4 relative z-10">
              <div className="flex justify-between text-slate-400 text-xs font-semibold">
                <span>Subtotal</span>
                <span className="text-white font-bold font-mono tabular-nums">₹{purchase.sub_total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-slate-400 text-xs font-semibold">
                <span>Total GST Tax</span>
                <span className="text-white font-bold font-mono tabular-nums">₹{purchase.total_gst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-slate-400 text-xs font-semibold">
                <span>Amount Paid</span>
                <span className="text-lime-400 font-bold font-mono tabular-nums">₹{purchase.paid_amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              
              <div className="h-px bg-white/5 my-6 sm:my-8" />
              
              <div className="flex justify-between items-end gap-4">
                <div className="min-w-0">
                  <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-slate-500 block">Balance Outstanding</span>
                  {balanceDue === 0 && <p className="text-[9px] text-lime-400 font-bold mt-1 uppercase tracking-wider">Account Settled</p>}
                </div>
                <span className={`text-2xl sm:text-4xl font-black tabular-nums tracking-tight italic ${balanceDue > 0 ? 'text-white' : 'text-lime-400'}`}>
                  ₹{balanceDue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* Workflow Action Buttons */}
            <div className="mt-8 sm:mt-10 relative z-10">
              <AnimatePresence mode="wait">
                {purchase.status === "DRAFT" && (
                  <motion.button 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    onClick={() => handleWorkflowTransition('post')} 
                    disabled={isProcessing} 
                    className="w-full h-12 bg-lime-400 text-slate-900 font-black rounded-xl sm:rounded-2xl transition-all flex items-center justify-center gap-2 font-sans text-xs uppercase tracking-wider shadow-md active:scale-[0.99] disabled:opacity-50"
                  >
                    {isProcessing ? <Loader2 className="animate-spin" size={16} /> : <><CheckCircle2 size={16} /> Complete Order</>}
                  </motion.button>
                )}

                {purchase.status === "POSTED" && (
                  <motion.button 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    onClick={() => handleWorkflowTransition('pay')} 
                    disabled={isProcessing} 
                    className="w-full h-12 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-xl sm:rounded-2xl transition-all flex items-center justify-center gap-2 font-sans text-xs uppercase tracking-wider shadow-md active:scale-[0.99] disabled:opacity-50"
                  >
                    {isProcessing ? <Loader2 className="animate-spin" size={16} /> : <><Wallet size={16} /> Record Payment</>}
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-xl sm:rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
             <div className="flex items-center gap-3.5">
                <div className="p-2.5 bg-slate-50 rounded-xl text-slate-400 shrink-0">
                  <CreditCard size={16} />
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-wider">Default Mode</p>
                  <p className="text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-tight">Bank Account Transfer</p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Skeletons & Errors

function PurchaseDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8 animate-pulse">
      <div className="h-20 sm:h-24 w-full bg-slate-100 rounded-xl sm:rounded-3xl" />
      <div className="grid grid-cols-12 gap-6 sm:gap-8">
        <div className="col-span-12 lg:col-span-8 space-y-6 sm:space-y-8">
          <div className="h-24 sm:h-32 bg-slate-100 rounded-xl sm:rounded-[2rem]" />
          <div className="h-64 sm:h-96 bg-slate-100 rounded-xl sm:rounded-[2rem]" />
        </div>
        <div className="col-span-12 lg:col-span-4 h-80 sm:h-96 bg-slate-900/5 rounded-xl sm:rounded-[2.5rem]" />
      </div>
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="min-h-[50vh] sm:min-h-[60vh] flex flex-col items-center justify-center space-y-4 p-4 text-center">
      <AlertCircle className="text-red-500 shrink-0" size={40} />
      <h2 className="text-lg sm:text-xl font-bold text-slate-900">Order Missing</h2>
      <p className="text-slate-400 text-sm max-w-xs">The requested stock purchase record could not be loaded or found.</p>
      <button onClick={onRetry} className="h-10 px-5 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-wider active:scale-[0.98] transition-all shadow-sm">Retry Sync</button>
    </div>
  );
}