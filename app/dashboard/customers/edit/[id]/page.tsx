"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";
import { motion } from "framer-motion";
import { 
  Settings2, ArrowLeft, ShieldCheck, 
  Zap, Wallet, Phone, Save, Loader2,
  RefreshCcw
} from "lucide-react";
import Link from "next/link";

export default function EditCustomer({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const customerId = resolvedParams.id;

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    credit_days: 7,
    credit_limit: 0,
    is_credit_allowed: true,
    is_active: true
  });

  // 01. Fetch existing account data
  useEffect(() => {
    const fetchEntity = async () => {
      try {
        const data = await apiRequest<any>(`customers/${customerId}`);
        setFormData({
          name: data.name,
          phone: data.phone,
          credit_days: data.credit_days,
          credit_limit: data.credit_limit,
          is_credit_allowed: data.is_credit_allowed,
          is_active: data.is_active
        });
      } catch (error) {
        console.error("Failed to load customer profile details:", error);
      } finally {
        loading && setLoading(false);
      }
    };
    if (customerId) fetchEntity();
  }, [customerId]);

  // 02. PUT: Synchronize Updates
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    try {
      await apiRequest(`customers/${customerId}`, {
        method: "PUT",
        body: JSON.stringify(formData),
      });
      router.push("/dashboard/customers");
      router.refresh();
    } catch (error: any) {
      console.error("Failed to save profile changes:", error.message);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return (
    <div className="min-h-[60vh] sm:min-h-screen flex flex-col items-center justify-center p-4">
      <RefreshCcw className="animate-spin text-blue-600 mb-4" size={28} />
      <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 text-center">Loading account details...</p>
    </div>
  );

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
            <ArrowLeft size={12} className="group-hover:-translate-x-0.5 transition-transform" /> Cancel Edit
          </Link>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight uppercase italic leading-none truncate pr-1">
            Edit <span className="text-blue-600">Customer</span>
          </h1>
          <p className="text-slate-400 font-medium text-xs sm:text-sm">
            Updating account and credit parameters for <span className="text-slate-700 font-black font-mono">#ID-{customerId}</span>
          </p>
        </div>
        <div className="h-12 w-12 sm:h-16 sm:w-16 bg-slate-900 rounded-xl sm:rounded-[2rem] flex items-center justify-center text-blue-400 shadow-md shrink-0 hidden sm:flex">
          <Settings2 size={24} className="sm:h-7 sm:w-7" />
        </div>
      </header>

      <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 items-stretch">
        
        {/* IDENTITY BLOCK */}
        <div className="md:col-span-2 bg-white p-4 sm:p-6 md:p-10 rounded-xl sm:rounded-[2.5rem] md:rounded-[3rem] border border-slate-100 shadow-sm space-y-6 sm:space-y-8">
          <div className="flex items-center justify-between gap-4 border-b border-slate-50 pb-3 sm:pb-4">
            <div className="flex items-center gap-2 text-slate-400 font-black text-[9px] sm:text-[10px] uppercase tracking-wider italic">
              <ShieldCheck size={14} className="shrink-0" /> Account Status
            </div>
            <div className="flex items-center gap-3 shrink-0">
               <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-slate-400">Account: {formData.is_active ? 'Active' : 'Suspended'}</span>
               <label className="relative inline-flex items-center cursor-pointer select-none">
                  <input type="checkbox" className="sr-only peer" checked={formData.is_active} onChange={(e) => setFormData({...formData, is_active: e.target.checked})} />
                  <div className="w-10 h-5.5 sm:w-11 sm:h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-4.5 sm:peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4.5 sm:after:h-5 after:w-4.5 sm:after:w-5 after:transition-all peer-checked:bg-lime-500"></div>
                </label>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-slate-400 ml-1">Customer / Company Name</label>
              <input 
                required type="text"
                placeholder="Type profile full legal name..."
                className="w-full bg-slate-50 border border-slate-100 p-3.5 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all text-sm font-semibold text-slate-800 shadow-inner"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-slate-400 ml-1">Mobile Contact</label>
              <div className="relative group">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={16} />
                <input 
                  required type="tel"
                  placeholder="Enter 10-digit number..."
                  className="w-full bg-slate-50 border border-slate-100 p-3.5 sm:p-5 md:p-6 pl-11 rounded-xl sm:rounded-2xl outline-none focus:bg-white transition-all text-sm font-black tabular-nums text-slate-800 shadow-inner"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
            </div>
          </div>
        </div>

        {/* FISCAL CREDIT BLOCK */}
        <div className="bg-white p-4 sm:p-6 md:p-10 rounded-xl sm:rounded-[2.5rem] md:rounded-[3rem] border border-slate-100 shadow-sm space-y-6 sm:space-y-8 flex flex-col justify-between">
          <div className="flex items-center justify-between gap-4 border-b border-slate-50 pb-3 sm:pb-4 shrink-0">
            <div className="flex items-center gap-2 text-blue-600 font-black text-[9px] sm:text-[10px] uppercase tracking-wider italic">
              <Wallet size={14} className="shrink-0" /> Credit Allowances
            </div>
            <label className="relative inline-flex items-center cursor-pointer select-none shrink-0">
              <input type="checkbox" className="sr-only peer" checked={formData.is_credit_allowed} onChange={(e) => setFormData({...formData, is_credit_allowed: e.target.checked})} />
              <div className="w-10 h-5.5 sm:w-11 sm:h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-4.5 sm:peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4.5 sm:after:h-5 after:w-4.5 sm:after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className={`space-y-4 sm:space-y-6 transition-all duration-300 flex-1 flex flex-col justify-center ${formData.is_credit_allowed ? 'opacity-100' : 'opacity-20 grayscale pointer-events-none'}`}>
            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-slate-400 ml-1">Maximum Credit Limit (₹)</label>
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
              <label className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-slate-400 ml-1">Credit Payment Terms (Days)</label>
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

        {/* SYSTEM STATUS PANEL */}
        <div className="bg-slate-900 p-5 sm:p-6 md:p-10 rounded-xl sm:rounded-[2.5rem] md:rounded-[3.5rem] text-white flex flex-col justify-between shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-[50px] -mr-16 -mt-16 pointer-events-none" />
          
          <div className="space-y-4 sm:space-y-6 relative z-10 w-full">
            <h3 className="text-[10px] font-black uppercase tracking-wider text-blue-400 italic border-b border-white/5 pb-2">Review Summary</h3>
            <div className="space-y-3 font-medium">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Account ID</span>
                <span className="font-bold text-white font-mono shrink-0">#{customerId}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Action Route</span>
                <span className="font-bold text-slate-400 shrink-0 uppercase tracking-tight font-mono text-[11px]">Save / Update</span>
              </div>
            </div>
          </div>

          <button 
            type="submit"
            disabled={updating}
            className="w-full h-12 sm:h-14 bg-blue-600 hover:bg-blue-500 text-white rounded-xl sm:rounded-2xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2.5 shadow-md active:scale-[0.99] disabled:opacity-40 mt-8 sm:mt-12 shrink-0"
          >
            {updating ? <Loader2 className="animate-spin" size={16} /> : <><Save size={14} /> Save Profile Changes</>}
          </button>
        </div>
      </form>
    </motion.div>
  );
}