"use client";

import { useEffect, useState, use } from "react";
import { apiRequest } from "@/lib/api";
import { motion } from "framer-motion";
import { Printer, ShieldCheck, User, Phone } from "lucide-react";
import Link from "next/link";
import { Sale } from "@/types/sales";

interface ShopDashboard {
  shop_profile: {
    shop_name: string;
    address_line: string;
    city: string;
    pincode: string;
    gst_number: string;
  };
}

export default function PrintableInvoice({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [sale, setSale] = useState<Sale | null>(null);
  const [shop, setShop] = useState<ShopDashboard["shop_profile"] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const [saleData, shopData] = await Promise.all([
          apiRequest<Sale>(`sales/${id}`, { method: "GET" }),
          apiRequest<ShopDashboard>(`/shop/dashboard`)
        ]);
        setSale(saleData);
        setShop(shopData.shop_profile);
      } catch (error) {
        console.error("Assembly Failed:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, [id]);

  if (loading || !sale) {
    return <div className="h-screen flex items-center justify-center animate-pulse text-[10px] font-black uppercase tracking-widest text-slate-400">Assembling invoice...</div>;
  }

  const netDue = (sale.total_amount || 0) - (sale.paid_amount || 0);

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-10 print:bg-white print:p-0">
      
      {/* ACTION BAR */}
      <div className="max-w-4xl mx-auto mb-6 flex justify-between items-center print:hidden">
        <Link href={`/dashboard/sales/${id}`} className="text-[9px] font-black uppercase tracking-widest flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors">
          ← Back to Order
        </Link>
        <button onClick={() => window.print()} className="bg-slate-900 text-white px-6 py-3 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-black shadow-md flex items-center gap-2">
          <Printer size={14} /> Print Invoice
        </button>
      </div>

      {/* A4 CANVAS */}
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="max-w-4xl mx-auto bg-white p-8 sm:p-16 shadow-lg border border-slate-100 print:shadow-none print:border-none print:w-full"
        id="invoice-document"
      >
        {/* HEADER */}
        <header className="flex justify-between border-b border-slate-900 pb-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck size={18} className="text-lime-500" />
              <h1 className="text-sm font-black uppercase italic">Tax Invoice</h1>
            </div>
            <p className="text-2xl font-black uppercase tracking-tighter">{shop?.shop_name || "Apkidukaan Store"}</p>
            <p className="text-[9px] text-slate-500 max-w-[220px] leading-tight mt-1">
              {shop?.address_line}, {shop?.city} - {shop?.pincode}
            </p>
            <p className="text-[9px] font-mono text-slate-500 mt-1">GSTIN: {shop?.gst_number || "---"}</p>
          </div>
          <div className="text-right">
            <p className="text-[9px] font-black uppercase text-slate-400">Invoice ID</p>
            <p className="text-xl font-black tabular-nums tracking-tight">#{id.slice(-6).toUpperCase()}</p>
            <p className="text-[10px] font-bold text-slate-500 mt-1">{new Date().toLocaleDateString('en-GB')}</p>
          </div>
        </header>

        {/* CUSTOMER SECTION */}
        <div className="grid grid-cols-2 gap-8 mb-10 border-t border-slate-50 pt-8">
          <div>
            <p className="text-[9px] font-black uppercase text-slate-400 mb-3 tracking-widest">Customer Information</p>
            <div className="flex items-start gap-2 mb-1">
              <User size={14} className="text-slate-400 mt-0.5" />
              <p className="font-black text-sm uppercase text-slate-900">
                {sale.customer_name || "Valued Customer"}
              </p>
            </div>
            <div className="flex items-start gap-2">
              <Phone size={14} className="text-slate-400 mt-0.5" />
              <p className="font-mono text-xs text-slate-600">
                {sale.customer_phone ? `+91 ${sale.customer_phone}` : "No contact provided"}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[9px] font-black uppercase text-slate-400 mb-3 tracking-widest">Payment Status</p>
            <div className={`inline-block px-3 py-1 rounded text-[9px] font-black uppercase ${netDue <= 0 ? 'bg-lime-50 text-lime-600' : 'bg-red-50 text-red-600'}`}>
              {netDue <= 0 ? "Paid in Full" : `Pending: ₹${netDue.toLocaleString()}`}
            </div>
          </div>
        </div>

        {/* ITEMS TABLE */}
        <table className="w-full text-left mb-10">
          <thead>
            <tr className="border-b border-slate-900">
              <th className="py-2 text-[9px] font-black uppercase">Description</th>
              <th className="py-2 text-center text-[9px] font-black uppercase w-12">Qty</th>
              <th className="py-2 text-right text-[9px] font-black uppercase w-24">Rate</th>
              <th className="py-2 text-right text-[9px] font-black uppercase w-24">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {sale.items?.map((item, idx) => (
              <tr key={idx}>
                <td className="py-4 font-bold text-xs">{item.product_name}</td>
                <td className="py-4 text-center font-mono text-xs">{item.quantity}</td>
                <td className="py-4 text-right font-mono text-xs">₹{Number(item.selling_price).toLocaleString()}</td>
                <td className="py-4 text-right font-black font-mono text-xs">₹{(item.quantity * item.selling_price).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* TOTALS */}
        <div className="flex justify-end">
          <div className="w-64 space-y-2 text-[10px]">
            <div className="flex justify-between"><span>Subtotal</span> <span>₹{sale.sub_total?.toLocaleString()}</span></div>
            <div className="flex justify-between border-t border-slate-900 pt-3 mt-2">
              <span className="font-black uppercase">Balance Due</span>
              <span className="font-black text-xl tabular-nums italic">₹{netDue.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <footer className="mt-20 pt-8 border-t border-slate-100 text-center">
          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest italic">
            Secured by <a href="https://triarchgroup.in" target="_blank" className="text-slate-900 underline">Triarch Group</a>
          </p>
        </footer>
      </motion.div>

      <style jsx global>{`
        @media print {
          body * { visibility: hidden; }
          #invoice-document, #invoice-document * { visibility: visible; }
          #invoice-document { position: absolute; left: 0; top: 0; width: 100%; }
        }
      `}</style>
    </div>
  );
}