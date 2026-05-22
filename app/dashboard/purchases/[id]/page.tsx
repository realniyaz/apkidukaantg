"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Loader2, User, Package, TrendingUp, 
  ChevronLeft, Download, CheckCircle2, Wallet,
  Calendar, CreditCard, FileText, AlertCircle
} from "lucide-react";

import StatusBadge from "../components/StatusBadge";
import PurchaseItemsTable from "../components/PurchaseItemsTable";

// ERP Style: Robust Type Guarding
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
      console.error("ERP Data Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchPurchase(); }, [fetchPurchase]);

  // Optimized Action Handlers
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
      console.error(`Workflow ${action} failed:`, error);
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
      className="max-w-7xl mx-auto p-4 md:p-8 space-y-8"
    >
      {/* 1. ERP NAV-HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-100 pb-8">
        <div className="space-y-4">
          <button 
            onClick={() => router.back()} 
            className="group flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-all font-bold text-xs uppercase tracking-widest"
          >
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
            Back to Procurement Ledger
          </button>
          <div className="flex flex-wrap items-center gap-4">
            <div className="p-3 bg-slate-900 rounded-2xl text-white shadow-lg">
              <FileText size={24} />
            </div>
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                Voucher <span className="text-slate-400 font-mono font-medium">#{purchase.purchase_number}</span>
              </h1>
              <div className="flex items-center gap-4 mt-1 text-slate-400 text-sm">
                <span className="flex items-center gap-1.5"><Calendar size={14}/> {new Date(purchase.created_at).toLocaleDateString()}</span>
                <span className="h-1 w-1 bg-slate-300 rounded-full" />
                <span className="flex items-center gap-1.5 uppercase font-bold text-[10px] tracking-widest italic">Ledger Entry #{purchase.id}</span>
              </div>
            </div>
            <StatusBadge status={purchase.status} />
          </div>
        </div>
        
        <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl font-bold text-sm text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
              <Download size={18} /> Export PDF
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* 2. MAIN DATA CORE */}
        <div className="lg:col-span-8 space-y-8">
          {/* Supplier Master Data */}
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="h-16 w-16 bg-lime-50 rounded-2xl flex items-center justify-center text-lime-600">
                <User size={32} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Entity / Vendor</p>
                <h3 className="text-2xl font-black text-slate-900 leading-none">{purchase.supplier_name || "Direct Purchase"}</h3>
              </div>
            </div>
            <div className="hidden md:block text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Tax Method</p>
              <span className="px-3 py-1 bg-slate-100 rounded-lg text-xs font-bold text-slate-600">GST REGISTERED</span>
            </div>
          </div>

          <PurchaseItemsTable items={purchase.items} />
        </div>

        {/* 3. FINANCIAL CONTROL COLUMN */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-lime-500/10 blur-[60px] rounded-full -mr-16 -mt-16" />
            
            <h3 className="text-xl font-bold flex items-center gap-3 mb-10 relative z-10">
              <TrendingUp className="text-lime-400" size={20} /> Balance Sheet
            </h3>

            <div className="space-y-4 relative z-10">
              <div className="flex justify-between text-slate-400 text-sm font-medium">
                <span>Taxable Sub-Total</span>
                <span className="text-white font-bold tabular-nums">₹{purchase.sub_total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-400 text-sm font-medium">
                <span>Consolidated GST</span>
                <span className="text-white font-bold tabular-nums">₹{purchase.total_gst.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-400 text-sm font-medium">
                <span>Settled Amount</span>
                <span className="text-lime-400 font-bold tabular-nums">₹{purchase.paid_amount.toLocaleString()}</span>
              </div>
              
              <div className="h-[1px] bg-white/10 my-8 shadow-[0_1px_0_rgba(255,255,255,0.05)]" />
              
              <div className="flex justify-between items-end">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Net Balance Due</span>
                  {balanceDue === 0 && <p className="text-[10px] text-lime-400 font-bold mt-1 uppercase">Voucher Cleared</p>}
                </div>
                <span className={`text-4xl font-black tabular-nums tracking-tighter ${balanceDue > 0 ? 'text-white' : 'text-lime-400'}`}>
                  ₹{balanceDue.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Workflow Action Engine */}
            <div className="mt-10 space-y-3 relative z-10">
              <AnimatePresence mode="wait">
                {purchase.status === "DRAFT" && (
                  <motion.button 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    onClick={() => handleWorkflowTransition('post')} 
                    disabled={isProcessing} 
                    className="w-full py-5 bg-lime-500 hover:bg-lime-400 text-slate-900 font-black rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-lime-500/20 active:scale-[0.98]"
                  >
                    {isProcessing ? <Loader2 className="animate-spin" /> : <><CheckCircle2 size={20} /> Authorize Voucher</>}
                  </motion.button>
                )}

                {purchase.status === "POSTED" && (
                  <motion.button 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    onClick={() => handleWorkflowTransition('pay')} 
                    disabled={isProcessing} 
                    className="w-full py-5 bg-blue-500 hover:bg-blue-400 text-white font-black rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-500/20 active:scale-[0.98]"
                  >
                    {isProcessing ? <Loader2 className="animate-spin" /> : <><Wallet size={20} /> Execute Payment</>}
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
             <div className="flex items-center gap-4">
                <div className="p-3 bg-slate-50 rounded-xl text-slate-400">
                  <CreditCard size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Default Method</p>
                  <p className="text-sm font-bold text-slate-700 uppercase">A/C Payee Only</p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// --------------------------------------------------------------------------------
// ERP Style Skeleton & Error States
// --------------------------------------------------------------------------------

function PurchaseDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8 animate-pulse">
      <div className="h-24 w-full bg-slate-100 rounded-3xl" />
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-8 space-y-8">
          <div className="h-32 bg-slate-100 rounded-[2.5rem]" />
          <div className="h-96 bg-slate-100 rounded-[2.5rem]" />
        </div>
        <div className="col-span-4 h-96 bg-slate-900/10 rounded-[2.5rem]" />
      </div>
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
      <AlertCircle className="text-red-500" size={48} />
      <h2 className="text-xl font-bold">Voucher Fetch Failed</h2>
      <p className="text-slate-500">The requested procurement record could not be found.</p>
      <button onClick={onRetry} className="px-6 py-2 bg-slate-900 text-white rounded-xl font-bold">Retry Sync</button>
    </div>
  );
}