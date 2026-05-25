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
      console.error("Failed to add new customer profile:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8 pb-32 font-bold text-slate-900"
    >
      {/* HEADER SECTION */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sm:gap-6 mb-8 sm:mb-12 border-b border-slate-100 pb-6 sm:pb-8">
        <div className="space-y-2 sm:space-y-3 w-full md:w-auto min-w-0">
          <Link href="/dashboard/customers" className="inline-flex items-center gap-1.5 text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-slate-400 hover:text-slate-900 transition-all group w-fit">
            <ArrowLeft size={12} className="group-hover:-translate-x-0.5 transition-transform" /> Back to Customers
          </Link>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight uppercase italic leading-none truncate pr-1">
            Add New <span className="text-lime-600">Customer</span>
          </h1>
          <p className="text-slate-400 font-medium text-xs sm:text-sm">
            Register a new customer account to log invoices and credit parameters.
          </p>
        </div>
        <div className="h-12 w-12 sm:h-16 sm:w-16 bg-slate-900 rounded-xl sm:rounded-[2rem] flex items-center justify-center text-lime-400 shadow-md shrink-0 hidden sm:flex">
          <UserPlus size={24} className="sm:h-7 sm:w-7" />
        </div>
      </header>

      {/* FORM CANVASES */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 items-stretch">
        
        {/* IDENTITY BLOCK */}
        <div className="md:col-span-2 bg-white p-4 sm:p-6 md:p-10 rounded-xl sm:rounded-[2.5rem] md:rounded-[3rem] border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center gap-2 text-slate-400 font-black text-[9px] sm:text-[10px] uppercase tracking-wider italic pb-3 border-b border-slate-50">
            <ShieldCheck size={14} className="text-lime-600 shrink-0" /> Basic Information
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-slate-400 ml-1">Customer / Legal Entity Name</label>
              <input 
                required
                type="text"
                placeholder="e.g. Acme Corporation"
                className="w-full bg-slate-50 border border-slate-100 p-3.5 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-lime-500/5 transition-all text-sm font-semibold text-slate-800 shadow-inner"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-slate-400 ml-1">Contact Phone</label>
              <div className="relative group">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={16} />
                <input 
                  required
                  type="tel"
                  placeholder="Enter 10-digit mobile number..."
                  className="w-full bg-slate-50 border border-slate-100 p-3.5 sm:p-5 md:p-6 pl-11 rounded-xl sm:rounded-2xl outline-none focus:bg-white transition-all text-sm font-black tabular-nums text-slate-800 shadow-inner"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
            </div>
          </div>
        </div>

        {/* CREDIT ALLOWANCES */}
        <div className="bg-white p-4 sm:p-6 md:p-10 rounded-xl sm:rounded-[2.5rem] md:rounded-[3rem] border border-slate-100 shadow-sm space-y-6 flex flex-col justify-between">
          <div className="flex items-center justify-between gap-4 border-b border-slate-50 pb-3 sm:pb-4 shrink-0">
            <div className="flex items-center gap-2 text-blue-600 font-black text-[9px] sm:text-[10px] uppercase tracking-wider italic">
              <Wallet size={14} className="shrink-0" /> Credit Settings
            </div>
            <label className="relative inline-flex items-center cursor-pointer select-none shrink-0">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={formData.is_credit_allowed}
                onChange={(e) => setFormData({...formData, is_credit_allowed: e.target.checked})} 
              />
              <div className="w-10 h-5.5 sm:w-11 sm:h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-4.5 sm:peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4.5 sm:after:h-5 after:w-4.5 sm:after:w-5 after:transition-all peer-checked:bg-lime-500"></div>
            </label>
          </div>

          <div className={`space-y-4 sm:space-y-6 transition-all duration-300 flex-1 flex flex-col justify-center ${formData.is_credit_allowed ? 'opacity-100' : 'opacity-20 pointer-events-none grayscale'}`}>
            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-slate-400 ml-1">Allowed Credit Limit (₹)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs pointer-events-none">₹</span>
                <input 
                  type="number"
                  min="0"
                  placeholder="0.00"
                  className="w-full bg-slate-50 border border-slate-100 p-3.5 sm:p-5 md:p-6 pl-9 rounded-xl sm:rounded-2xl outline-none focus:bg-white transition-all text-sm font-black tabular-nums text-slate-800 shadow-inner"
                  value={formData.credit_limit}
                  onChange={(e) => setFormData({...formData, credit_limit: Number(e.target.value)})}
                />
              </div>
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-slate-400 ml-1">Payment Credit Terms (Days)</label>
              <input 
                type="number"
                min="0"
                placeholder="7"
                className="w-full bg-slate-50 border border-slate-100 p-3.5 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl outline-none focus:bg-white transition-all text-sm font-black tabular-nums text-slate-800 shadow-inner"
                value={formData.credit_days}
                onChange={(e) => setFormData({...formData, credit_days: Number(e.target.value)})}
              />
            </div>
          </div>
        </div>

        {/* SUMMARY INSIGHT PANEL */}
        <div className="bg-slate-900 p-5 sm:p-6 md:p-10 rounded-xl sm:rounded-[2.5rem] md:rounded-[3.5rem] text-white flex flex-col justify-between shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-lime-500/5 blur-[50px] -mr-16 -mt-16 pointer-events-none" />
          
          <div className="space-y-4 sm:space-y-6 relative z-10 w-full">
            <h3 className="text-[10px] font-black uppercase tracking-wider text-lime-400 italic border-b border-white/5 pb-2">Profile Overview</h3>
            <div className="space-y-3 font-medium">
              <SummaryLine label="Account Class" value={formData.is_credit_allowed ? "Credit Account" : "Cash Account Base"} />
              <SummaryLine label="Initial Status" value="Active Store Hub" />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full h-12 sm:h-14 bg-lime-400 text-slate-900 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2.5 shadow-md active:scale-[0.99] disabled:opacity-40 mt-8 sm:mt-12 shrink-0"
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : <><Save size={14} /> Save Customer Profile</>}
          </button>
        </div>
      </form>
    </motion.div>
  );
}

function SummaryLine({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex justify-between items-center text-xs py-1">
      <span className="text-[9px] font-black uppercase text-slate-500 tracking-wider">{label}</span>
      <span className="font-bold text-white italic tracking-tight">{value}</span>
    </div>
  );
}