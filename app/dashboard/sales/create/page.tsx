"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";
import { Loader2, ArrowLeft, Fingerprint, Zap, User, Phone } from "lucide-react";
import Link from "next/link";
import { Sale } from "@/types/sales";

export default function CreateSalePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  const handleInitializeDraft = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || !customerName || !customerPhone) return;
    setLoading(true);

    try {
      const res = await apiRequest<Sale>("sales/", {
        method: "POST",
        body: JSON.stringify({
          customer_name: customerName,
          customer_phone: customerPhone,
        })
      });

      const targetId = res?.id || (res as any)?.sale_id;

      if (targetId) {
        router.push(`/dashboard/sales/${targetId}`);
      } else {
        throw new Error("Draft created successfully, but sales entry ID is missing.");
      }
    } catch (error: any) {
      alert(`Initialization Failed: ${error.message}`);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] p-4 sm:p-6 md:p-10 text-slate-900">
      <div className="max-w-4xl mx-auto mb-6 sm:mb-12 flex justify-between items-end">
        <div className="w-full">
          <Link href="/dashboard/sales" className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-all text-[9px] sm:text-[10px] font-black uppercase tracking-wider mb-4 group w-fit">
            <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" /> Back to Sales
          </Link>
          <h1 className="text-4xl sm:text-6xl font-black italic tracking-tighter uppercase leading-[0.9] sm:leading-[0.85]">
            Create <span className="text-slate-400">Invoice</span>
          </h1>
          <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-wider mt-2.5 sm:mt-4">
            Initialize new draft transaction
          </p>
        </div>
      </div>

      <form onSubmit={handleInitializeDraft} className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
        <section className="bg-white border border-slate-100 rounded-[1.5rem] sm:rounded-[2.5rem] p-5 sm:p-10 shadow-sm relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-slate-50 rounded-full blur-3xl opacity-50 pointer-events-none" />

          <h3 className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-slate-400 mb-6 sm:mb-8 flex items-center gap-2 relative z-10 italic">
            <Fingerprint size={14} className="text-lime-600" /> Customer Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8 relative z-10">
            {/* CUSTOMER NAME INPUT */}
            <div className="relative group w-full">
              <label className="block text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2 sm:mb-3 ml-1">
                Customer Name
              </label>
              <div className="relative">
                <div className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-lime-500 transition-colors pointer-events-none">
                  <User size={18} />
                </div>
                <input 
                  type="text"
                  placeholder="e.g. Niyaz Ahmed" 
                  value={customerName} 
                  onChange={e => setCustomerName(e.target.value)}
                  required
                  className="w-full bg-slate-50 pl-11 sm:pl-16 pr-4 sm:pr-6 py-3.5 sm:py-5 rounded-xl sm:rounded-[2rem] border-2 border-transparent focus:bg-white focus:border-lime-500 outline-none transition-all text-sm font-semibold shadow-inner text-slate-800" 
                />
              </div>
            </div>

            {/* CUSTOMER PHONE INPUT */}
            <div className="relative group w-full">
              <label className="block text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2 sm:mb-3 ml-1">
                Mobile Number
              </label>
              <div className="relative">
                <div className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-lime-500 transition-colors pointer-events-none">
                  <Phone size={18} />
                </div>
                <input 
                  type="tel"
                  placeholder="e.g. 9876543210" 
                  value={customerPhone} 
                  onChange={e => setCustomerPhone(e.target.value)}
                  required
                  className="w-full bg-slate-50 pl-11 sm:pl-16 pr-4 sm:pr-6 py-3.5 sm:py-5 rounded-xl sm:rounded-[2rem] border-2 border-transparent focus:bg-white focus:border-lime-500 outline-none transition-all text-sm font-semibold shadow-inner text-slate-800" 
                />
              </div>
            </div>
          </div>
        </section>

        <button 
          disabled={loading || !customerName || !customerPhone} 
          type="submit" 
          className="w-full h-12 sm:h-16 bg-slate-900 text-lime-400 rounded-xl sm:rounded-[2rem] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-black transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99]"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            <>Initialize Order <Zap size={14} fill="currentColor" /></>
          )}
        </button>
      </form>
    </div>
  );
}