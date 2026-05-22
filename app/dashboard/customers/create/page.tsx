"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";
import { motion } from "framer-motion";
import { 
  UserPlus, ArrowLeft, ShieldCheck, 
  Zap, Wallet, Phone, Save, Loader2 
} from "lucide-react";
import Link from "next/link";

export default function OnboardClient() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    credit_days: 7,
    credit_limit: 0,
    is_credit_allowed: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiRequest("customers/", {
        method: "POST",
        body: JSON.stringify(formData),
      });
      router.push("/dashboard/customers");
      router.refresh();
    } catch (error: any) {
      console.error("Onboarding Failed:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto p-8 pb-32 font-bold"
    >
      {/* HEADER */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 border-b border-slate-100 pb-10">
        <div className="space-y-3">
          <Link href="/dashboard/customers" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-slate-900 transition-all">
            <ArrowLeft size={14} /> Back to Registry
          </Link>
          <h1 className="text-6xl font-black tracking-tighter uppercase italic leading-none">
            Onboard <span className="text-lime-500 text-slate-800">Entity</span>
          </h1>
          <p className="text-slate-500 font-medium italic">Initialize a new fiscal node in the neural registry.</p>
        </div>
        <div className="h-16 w-16 bg-slate-900 rounded-[2rem] flex items-center justify-center text-lime-500 shadow-2xl">
          <UserPlus size={28} />
        </div>
      </header>

      {/* FORM INTERFACE */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* IDENTITY SECTION */}
        <div className="md:col-span-2 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl space-y-8">
          <div className="flex items-center gap-3 text-lime-600 font-black text-[10px] uppercase tracking-[0.3em]">
            <ShieldCheck size={14} /> Identity Authentication
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-4">Legal Name</label>
              <div className="relative">
                <input 
                  required
                  type="text"
                  placeholder="e.g. Acme Corp"
                  className="w-full bg-slate-50 border border-slate-100 p-6 rounded-2xl outline-none focus:bg-white focus:ring-8 focus:ring-lime-500/5 transition-all text-sm font-black"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-4">Uplink (Phone)</label>
              <div className="relative">
                <Phone className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  required
                  type="text"
                  placeholder="+91 00000 00000"
                  className="w-full bg-slate-50 border border-slate-100 p-6 rounded-2xl outline-none focus:bg-white focus:ring-8 focus:ring-lime-500/5 transition-all text-sm font-black tabular-nums"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
            </div>
          </div>
        </div>

        {/* CREDIT VECTOR SECTION */}
        <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-blue-600 font-black text-[10px] uppercase tracking-[0.3em]">
              <Wallet size={14} /> Fiscal Vector
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={formData.is_credit_allowed}
                onChange={(e) => setFormData({...formData, is_credit_allowed: e.target.checked})}
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-lime-500"></div>
            </label>
          </div>

          <div className={`space-y-6 transition-all duration-500 ${formData.is_credit_allowed ? 'opacity-100' : 'opacity-20 pointer-events-none grayscale'}`}>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-4">Credit Limit (₹)</label>
              <input 
                type="number"
                className="w-full bg-slate-50 border border-slate-100 p-6 rounded-2xl outline-none focus:bg-white transition-all text-sm font-black tabular-nums"
                value={formData.credit_limit}
                onChange={(e) => setFormData({...formData, credit_limit: Number(e.target.value)})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-4">Duration (Days)</label>
              <input 
                type="number"
                className="w-full bg-slate-50 border border-slate-100 p-6 rounded-2xl outline-none focus:bg-white transition-all text-sm font-black tabular-nums"
                value={formData.credit_days}
                onChange={(e) => setFormData({...formData, credit_days: Number(e.target.value)})}
              />
            </div>
          </div>
        </div>

        {/* STATUS SUMMARY PANEL */}
        <div className="bg-slate-900 p-10 rounded-[3rem] text-white flex flex-col justify-between shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-lime-500/10 blur-[60px] -mr-16 -mt-16" />
          
          <div className="space-y-6 relative z-10">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-lime-400 italic">Registration Summary</h3>
            <div className="space-y-4">
              <SummaryLine label="Account Type" value={formData.is_credit_allowed ? "Credit Account" : "Cash Only"} />
              <SummaryLine label="Initial Status" value="Active" />
              <SummaryLine label="Protocol" value="Neural Sync v4" />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-lime-500 hover:bg-lime-400 text-slate-900 py-6 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-xl shadow-lime-500/10 disabled:opacity-50 mt-12"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <><Save size={18} /> Finalize Onboarding</>}
          </button>
        </div>
      </form>
    </motion.div>
  );
}

function SummaryLine({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-white/5">
      <span className="text-[9px] font-black uppercase text-slate-500 tracking-widest">{label}</span>
      <span className="text-xs font-bold text-white italic">{value}</span>
    </div>
  );
}