"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";
import { Loader2, ArrowLeft, Fingerprint, Zap, User, Phone, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { Sale } from "@/types/sales";

export default function CreateSalePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  const handleInitializeDraft = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || !customerName || !customerPhone) return;
    
    setLoading(true);
    setErrorMsg(null);

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
        throw new Error("Server created sale but returned no ID.");
      }
    } catch (error: any) {
      console.error("DEBUG ERROR:", error);
      setErrorMsg(error.message || "Failed to connect to Triarch Engine. Check database logs.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] p-4 sm:p-10 text-slate-900">
      <div className="max-w-4xl mx-auto mb-10">
        <Link href="/dashboard/sales" className="flex items-center gap-2 text-slate-400 hover:text-slate-900 text-[10px] font-black uppercase tracking-widest mb-6">
          <ArrowLeft size={12} /> Back to Sales
        </Link>
        <h1 className="text-5xl sm:text-7xl font-black italic tracking-tighter uppercase leading-[0.8]">
          New <span className="text-slate-300">Invoice</span>
        </h1>
      </div>

      <form onSubmit={handleInitializeDraft} className="max-w-4xl mx-auto space-y-6">
        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3">
            <AlertTriangle size={16} /> {errorMsg}
          </div>
        )}

        <section className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-8 flex items-center gap-2 italic">
            <Fingerprint size={14} className="text-lime-600" /> Customer Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">Customer Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  type="text" placeholder="e.g. Niyaz Ahmed" value={customerName} 
                  onChange={e => setCustomerName(e.target.value)} required
                  className="w-full bg-slate-50 pl-12 pr-6 py-4 rounded-xl border-2 border-transparent focus:border-lime-500 outline-none font-bold text-sm" 
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">Mobile Number</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  type="tel" placeholder="e.g. 9876543210" value={customerPhone} 
                  onChange={e => setCustomerPhone(e.target.value)} required
                  className="w-full bg-slate-50 pl-12 pr-6 py-4 rounded-xl border-2 border-transparent focus:border-lime-500 outline-none font-bold text-sm" 
                />
              </div>
            </div>
          </div>
        </section>

        <button 
          disabled={loading} 
          type="submit" 
          className="w-full h-16 bg-slate-900 text-lime-400 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-black transition-all shadow-xl active:scale-[0.98]"
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : <>Initialize Order <Zap size={14} /></>}
        </button>
      </form>
    </div>
  );
}