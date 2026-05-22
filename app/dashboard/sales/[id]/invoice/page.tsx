"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";
import { motion } from "framer-motion";
import { 
  Printer, ArrowLeft, ShieldCheck, 
  Globe, Phone, Mail, MapPin, Store 
} from "lucide-react";
import Link from "next/link";
import { Sale } from "@/types/sales";

export default function PrintableInvoice() {
  const { id } = useParams();
  const [sale, setSale] = useState<Sale | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const data = await apiRequest<Sale>(`sales/${id}`, { method: "GET" });
        setSale(data);
      } catch (error) {
        console.error("Assembly Failure:", error);
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
    <div className="h-screen flex items-center justify-center font-black animate-pulse uppercase tracking-[0.5em] text-slate-400">
      Syncing Neural Invoice...
    </div>
  );

  // 🟢 Financial Logic
  const cgst = sale.total_gst / 2;
  const sgst = sale.total_gst / 2;
  const netDue = sale.total_amount - sale.paid_amount;

  return (
    <div className="min-h-screen bg-slate-50 md:p-10 pb-40 print:bg-white print:p-0">
      
      {/* 🟢 ACTION BAR (Hidden during Print) */}
      <div className="max-w-4xl mx-auto mb-8 flex justify-between items-center print:hidden px-4 md:px-0">
        <Link href={`/dashboard/sales/${id}`} className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-all text-[10px] font-black uppercase tracking-[0.4em]">
          <ArrowLeft size={12} /> Return to Control
        </Link>
        <button 
          onClick={handlePrint}
          className="flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-2xl active:scale-95"
        >
          <Printer size={14} /> Print / Export PDF
        </button>
      </div>

      {/* 🟢 THE INVOICE DOCUMENT */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto bg-white shadow-[0_40px_100px_rgba(0,0,0,0.05)] md:rounded-[3.5rem] overflow-hidden border border-slate-100 print:shadow-none print:border-none print:m-0 print:rounded-none"
        id="invoice-document"
      >
        {/* HEADER BRANDING */}
        <div className="bg-slate-900 p-12 text-white flex justify-between items-center print:bg-slate-900 print:text-white">
          <div className="space-y-4">
             <div className="flex items-center gap-4">
               <div className="h-12 w-12 bg-lime-400 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(163,230,53,0.3)]">
                 <ShieldCheck size={28} className="text-slate-900" />
               </div>
               <div>
                <h1 className="text-3xl font-black italic tracking-tighter uppercase leading-none">
                  APKIDUKAAN <span className="text-slate-500 font-normal">CORP</span>
                </h1>
                <p className="text-[8px] font-black uppercase tracking-[0.5em] text-lime-400 mt-1">Official Neural Invoice</p>
               </div>
             </div>
          </div>
          <div className="text-right">
             <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-1">Voucher ID</p>
             <h2 className="text-4xl font-black italic tracking-tighter tabular-nums leading-none">#{sale.id.toString().slice(-6).toUpperCase()}</h2>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">{sale.invoice_number}</p>
          </div>
        </div>

        <div className="p-12 space-y-12">
          {/* BILING ADDRESS GRID */}
          <div className="grid grid-cols-2 gap-20 border-b border-slate-50 pb-12">
              <div className="space-y-6">
                 <div>
                   <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-300 mb-3">Origin Store</p>
                   <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                     <Store size={18} className="text-lime-500" /> {process.env.NEXT_PUBLIC_STORE_NAME || "Niyaz Ahmed Store"}
                   </h3>
                   <div className="mt-2 space-y-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                     <p>Greater Noida, Uttar Pradesh, 201310</p>
                     <p>GSTIN: 09XXXXX1234X1Z5</p>
                   </div>
                 </div>
                 
                 <div className="pt-4">
                   <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-300 mb-2">Recipient</p>
                   <h3 className="text-lg font-black text-slate-900 tracking-tight uppercase">{sale.customer_name}</h3>
                   <p className="text-xs font-bold text-slate-500 italic mt-1">{sale.customer_phone}</p>
                 </div>
              </div>

              <div className="text-right flex flex-col justify-between">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-300 mb-2">Settlement Date</p>
                  <p className="text-sm font-black text-slate-900">{new Date(sale.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                </div>
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 print:bg-white">
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 mb-1">Transaction Mode</p>
                  <p className="text-xs font-black text-slate-900 uppercase tracking-widest">Digital Transfer (Paid)</p>
                </div>
              </div>
          </div>

          {/* ITEM MANIFEST */}
          <table className="w-full text-left">
            <thead>
              <tr className="border-b-2 border-slate-900">
                <th className="py-4 text-[10px] font-black uppercase tracking-widest text-slate-900">Manifest Description</th>
                <th className="py-4 text-center text-[10px] font-black uppercase tracking-widest text-slate-900">Qty</th>
                <th className="py-4 text-right text-[10px] font-black uppercase tracking-widest text-slate-900">Unit Cost</th>
                <th className="py-4 text-right text-[10px] font-black uppercase tracking-widest text-slate-900">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sale.items?.map((item, idx) => (
                <tr key={idx}>
                  <td className="py-6 font-bold text-slate-900 text-sm">{item.product_name}</td>
                  <td className="py-6 text-center text-xs font-bold text-slate-500">{item.quantity}</td>
                  <td className="py-6 text-right text-xs font-bold text-slate-500">₹{item.selling_price?.toLocaleString()}</td>
                  <td className="py-6 text-right font-black text-slate-900 text-sm">
                    ₹{(item.quantity * item.selling_price).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* TAXATION & SUMMARY */}
          <div className="flex justify-end pt-12">
            <div className="w-full max-w-xs space-y-3">
               <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                 <span>Gross Total</span>
                 <span className="text-slate-900">₹{sale.sub_total?.toLocaleString()}</span>
               </div>
               
               {/* 🟢 GST BREAKDOWN */}
               <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-slate-400 italic">
                 <span>CGST (9%)</span>
                 <span className="text-slate-600">₹{cgst.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
               </div>
               <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-slate-400 italic">
                 <span>SGST (9%)</span>
                 <span className="text-slate-600">₹{sgst.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
               </div>

               <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-100 print:bg-white">
                 <span>Neural Credit (Paid)</span>
                 <span className="font-mono">-₹{sale.paid_amount?.toLocaleString()}</span>
               </div>

               <div className="flex justify-between items-center border-t-2 border-slate-900 pt-6 mt-4">
                  <span className="text-[12px] font-black uppercase tracking-[0.3em] text-slate-900 italic">Balance Due</span>
                  <span className="text-3xl font-black text-slate-900 italic tracking-tighter tabular-nums">
                    ₹{netDue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
               </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-12 bg-slate-50 border-t border-slate-100 text-center print:bg-white">
           <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.5em] mb-2">Authored by Apkidukaan Neural Engine</p>
           <p className="text-[8px] font-bold text-slate-300 uppercase tracking-widest">This is a system generated document. No physical signature is required under IT Act 2000.</p>
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
          .print\:bg-slate-900 { background-color: #0f172a !important; -webkit-print-color-adjust: exact; }
          .print\:text-white { color: white !important; -webkit-print-color-adjust: exact; }
          @page { margin: 0; }
        }
      `}</style>
    </div>
  );
}