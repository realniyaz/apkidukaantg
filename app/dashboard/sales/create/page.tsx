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
  
  // 🟢 FIXED: Now tracking Name and Phone as per new Swagger schema
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  const handleInitializeDraft = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || !customerName || !customerPhone) return;
    setLoading(true);

    try {
      // Step 1: Create the draft shell using the new body structure
      const res = await apiRequest<Sale>("sales/", {
        method: "POST",
        body: JSON.stringify({
          customer_name: customerName,
          customer_phone: customerPhone,
        })
      });

      // Step 2: Redirect to Control Center using the returned ID
      const targetId = res?.id || (res as any)?.sale_id;

      if (targetId) {
        router.push(`/dashboard/sales/${targetId}`);
      } else {
        throw new Error("Neural Link established but Node ID missing from response.");
      }
    } catch (error: any) {
      alert(`Initialization Failed: ${error.message}`);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] p-4 md:p-10">
      <div className="max-w-4xl mx-auto mb-12 flex justify-between items-end">
        <div>
          <Link href="/dashboard/sales" className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-all text-[10px] font-black uppercase tracking-[0.4em] mb-4 group">
            <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" /> Return to Cluster
          </Link>
          <h1 className="text-6xl font-black italic tracking-tighter uppercase leading-[0.85] text-slate-900">
            Secure <span className="text-slate-200">Transaction</span>
          </h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-4">
            Deployment Protocol Alpha
          </p>
        </div>
      </div>

      <form onSubmit={handleInitializeDraft} className="max-w-4xl mx-auto space-y-8">
        <section className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-sm relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-slate-50 rounded-full blur-3xl opacity-50 pointer-events-none" />

          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-8 flex items-center gap-2 relative z-10">
            <Fingerprint size={14} className="text-lime-500" /> Identity Matrix
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
            {/* 🟢 CUSTOMER NAME INPUT */}
            <div className="relative group">
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 ml-2">
                Entity Name
              </label>
              <div className="relative">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-lime-500 transition-colors">
                  <User size={20} />
                </div>
                <input 
                  type="text"
                  placeholder="e.g. Niyaz Ahmed" 
                  value={customerName} 
                  onChange={e => setCustomerName(e.target.value)}
                  required
                  className="w-full bg-slate-50 pl-16 pr-6 py-6 rounded-[2rem] border-2 border-transparent focus:bg-white focus:border-lime-500 outline-none transition-all text-sm font-bold shadow-inner" 
                />
              </div>
            </div>

            {/* 🟢 CUSTOMER PHONE INPUT */}
            <div className="relative group">
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 ml-2">
                Uplink Reference (Phone)
              </label>
              <div className="relative">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-lime-500 transition-colors">
                  <Phone size={20} />
                </div>
                <input 
                  type="tel"
                  placeholder="e.g. 9876543210" 
                  value={customerPhone} 
                  onChange={e => setCustomerPhone(e.target.value)}
                  required
                  className="w-full bg-slate-50 pl-16 pr-6 py-6 rounded-[2rem] border-2 border-transparent focus:bg-white focus:border-lime-500 outline-none transition-all text-sm font-bold shadow-inner" 
                />
              </div>
            </div>
          </div>
        </section>

        <button 
          disabled={loading || !customerName || !customerPhone} 
          type="submit" 
          className="w-full py-6 bg-slate-900 text-lime-400 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-black transition-all shadow-xl shadow-slate-900/20 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <>Initialize Draft <Zap size={18} fill="currentColor" /></>
          )}
        </button>
      </form>
    </div>
  );
}