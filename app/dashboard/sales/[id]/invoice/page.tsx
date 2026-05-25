"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";
import { motion } from "framer-motion";
import { 
  Printer, ArrowLeft, ShieldCheck, Store 
} from "lucide-react";
import Link from "next/link";
import { Sale } from "@/types/sales";

export default function PrintableInvoice() {
  const { id } = useParams();
  const router = useRouter();
  const [sale, setSale] = useState<Sale | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const data = await apiRequest<Sale>(`sales/${id}`, { method: "GET" });
        setSale(data);
      } catch (error) {
        console.error("Invoice assembly failed:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoice();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (loading || !sale) return (
    <div className="h-screen flex items-center justify-center font-bold animate-pulse uppercase tracking-wider text-slate-400 p-4 text-center text-xs">
      Generating invoice print layout...
    </div>
  );

  // Financial Breakdown calculations
  const cgst = (sale.total_gst || 0) / 2;
  const sgst = (sale.total_gst || 0) / 2;
  const netDue = (sale.total_amount || 0) - (sale.paid_amount || 0);

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 md:p-10 pb-24 print:bg-white print:p-0 text-slate-900">
      
      {/* ACTION BAR (Hidden during Print layout view) */}
      <div className="max-w-4xl mx-auto mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <Link 
          href={`/dashboard/sales/${id}`} 
          className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-all text-[10px] font-black uppercase tracking-wider group"
        >
          <ArrowLeft size={12} className="group-hover:-translate-x-0.5 transition-transform" /> Back to Order Summary
        </Link>
        <button 
          onClick={handlePrint}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-3.5 rounded-xl font-black text-xs uppercase tracking-wider hover:bg-black transition-all shadow-md active:scale-[0.99]"
        >
          <Printer size={14} /> Print Invoice
        </button>
      </div>

      {/* THE INVOICE DOCUMENT A4 CANVAS BOX */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto bg-white rounded-xl sm:rounded-[2rem] md:rounded-[3rem] overflow-hidden border border-slate-100 print:shadow-none print:border-none print:m-0 print:rounded-none shadow-sm shadow-slate-200/50"
        id="invoice-document"
      >
        {/* HEADER SECTION */}
        <div className="bg-slate-900 p-6 sm:p-10 md:p-12 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 print:bg-slate-900 print:text-white">
          <div className="flex items-center gap-3.5">
            <div className="h-10 w-10 sm:h-12 sm:w-12 bg-lime-400 rounded-xl flex items-center justify-center shrink-0 shadow-md">
              <ShieldCheck size={24} className="text-slate-900" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black italic tracking-tighter uppercase leading-none">
                APKIDUKAAN <span className="text-slate-500 font-normal">CORP</span>
              </h1>
              <p className="text-[8px] font-black uppercase tracking-widest text-lime-400 mt-1">Tax Invoice</p>
            </div>
          </div>
          <div className="text-left sm:text-right w-full sm:w-auto border-t border-white/5 sm:border-none pt-4 sm:pt-0">
             <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-0.5">Invoice ID</p>
             <h2 className="text-2xl sm:text-3xl font-black italic tracking-tighter tabular-nums leading-none">
               #{sale.id.toString().slice(-6).toUpperCase()}
             </h2>
             <p className="text-[10px] font-mono text-slate-400 tracking-tight mt-1.5 break-all">{sale.invoice_number || "Draft Profile"}</p>
          </div>
        </div>

        <div className="p-6 sm:p-10 md:p-12 space-y-8 sm:space-y-12">
          {/* BILLING ADDRESS DETAILS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-16 border-b border-slate-100 pb-8 sm:pb-12">
              <div className="space-y-6">
                 <div>
                   <p className="text-[9px] font-black uppercase tracking-wider text-slate-400 mb-2">Merchant details</p>
                   <h3 className="text-base sm:text-lg font-bold text-slate-900 uppercase tracking-tight flex items-center gap-2">
                     <Store size={16} className="text-lime-600 shrink-0" /> {process.env.NEXT_PUBLIC_STORE_NAME || "Niyaz Ahmed Store"}
                   </h3>
                   <div className="mt-1.5 space-y-0.5 text-xs text-slate-500 font-medium tracking-tight">
                     <p>Greater Noida, Uttar Pradesh, 201310</p>
                     <p className="font-mono text-[11px] text-slate-400">GSTIN: 09XXXXX1234X1Z5</p>
                   </div>
                 </div>
                 
                 <div className="pt-2">
                   <p className="text-[9px] font-black uppercase tracking-wider text-slate-400 mb-1.5">Billed To</p>
                   <h3 className="text-base font-bold text-slate-900 uppercase tracking-tight">{sale.customer_name || "Walk-in Customer"}</h3>
                   <p className="text-xs font-semibold text-slate-400 font-mono mt-1">{sale.customer_phone || "No contact reference"}</p>
                 </div>
              </div>

              <div className="flex flex-col justify-between items-start sm:items-end text-left sm:text-right gap-4">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-wider text-slate-400 mb-1">Issue Date</p>
                  <p className="text-sm font-bold text-slate-900">
                    {sale.created_at ? new Date(sale.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }) : "---"}
                  </p>
                </div>
                <div className="bg-slate-50 p-4 sm:p-5 rounded-xl border border-slate-100 w-full sm:w-auto text-left sm:text-right print:border-none print:p-0">
                  <p className="text-[9px] font-black uppercase tracking-wider text-slate-400 mb-0.5">Method of Payment</p>
                  <p className="text-xs font-bold text-slate-900 uppercase tracking-wider">Digital Transfer (Paid)</p>
                </div>
              </div>
          </div>

          {/* ITEM MANIFEST ACCORDION CONTAINER */}
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left min-w-[500px] border-separate border-spacing-0">
              <thead>
                <tr className="border-b border-slate-900">
                  <th className="pb-3 text-[9px] font-black uppercase tracking-wider text-slate-900 border-b-2 border-slate-900">Item Description</th>
                  <th className="pb-3 text-center text-[9px] font-black uppercase tracking-wider text-slate-900 border-b-2 border-slate-900 w-16">Qty</th>
                  <th className="pb-3 text-right text-[9px] font-black uppercase tracking-wider text-slate-900 border-b-2 border-slate-900 w-28">Unit Price</th>
                  <th className="pb-3 text-right text-[9px] font-black uppercase tracking-wider text-slate-900 border-b-2 border-slate-900 w-32">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                {sale.items?.map((item, idx) => (
                  <tr key={idx} className="align-middle">
                    <td className="py-4 text-sm font-bold text-slate-900 pr-4">{item.product_name}</td>
                    <td className="py-4 text-center text-xs font-medium text-slate-500 tabular-nums">{item.quantity}</td>
                    <td className="py-4 text-right text-xs font-medium text-slate-500 tabular-nums">₹{item.selling_price?.toLocaleString('en-IN')}</td>
                    <td className="py-4 text-right text-sm font-bold text-slate-900 tabular-nums">
                      ₹{(item.quantity * item.selling_price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* TAXATION SUMMARY BREAKDOWN */}
          <div className="flex justify-end pt-4 border-t border-slate-50">
            <div className="w-full max-w-xs space-y-3 font-semibold text-slate-600">
               <div className="flex justify-between items-center text-[10px] uppercase tracking-wide">
                 <span>Subtotal</span>
                 <span className="text-slate-900 tabular-nums">₹{sale.sub_total?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
               </div>
               
               <div className="flex justify-between items-center text-[10px] uppercase tracking-wide italic text-slate-400">
                 <span>CGST (9%)</span>
                 <span className="tabular-nums">₹{cgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
               </div>
               <div className="flex justify-between items-center text-[10px] uppercase tracking-wide italic text-slate-400">
                 <span>SGST (9%)</span>
                 <span className="tabular-nums">₹{sgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
               </div>

               <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wide text-emerald-600 bg-emerald-50/60 px-3 py-2 rounded-lg border border-emerald-100/50 print:bg-white print:p-0 print:border-none">
                 <span>Amount Paid</span>
                 <span className="font-mono tabular-nums">-₹{sale.paid_amount?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
               </div>

               <div className="flex justify-between items-center border-t border-slate-900 pt-4 mt-2">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-900 italic">Balance Due</span>
                  <span className="text-2xl font-black text-slate-900 italic tracking-tight tabular-nums">
                    ₹{netDue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
               </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-6 sm:p-10 md:p-12 bg-slate-50/50 border-t border-slate-100 text-center print:bg-white print:border-t-2 print:border-slate-100">
           <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Generated via Apkidukaan Invoicing System</p>
           <p className="text-[8px] font-medium text-slate-400 uppercase tracking-normal max-w-xl mx-auto leading-normal">
             This is a digital document generated directly from store transactions. No physical signature is required under the IT Act 2000.
           </p>
        </div>
      </motion.div>

      <style jsx global>{`
        @media print {
          body { background: white !important; }
          body * { visibility: hidden; }
          #invoice-document, #invoice-document * { visibility: visible; }
          #invoice-document {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 0;
            border: none;
            box-shadow: none !important;
          }
          .print\:bg-slate-900 { background-color: #0f172a !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .print\:text-white { color: white !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          @page { margin: 1.5cm; }
        }
      `}</style>
    </div>
  );
}