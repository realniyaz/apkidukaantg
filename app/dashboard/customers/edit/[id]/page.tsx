"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";
import { motion } from "framer-motion";
import { 
  Settings2, ArrowLeft, ShieldCheck, 
  Zap, Wallet, Phone, Save, Loader2,
  RefreshCcw, ToggleLeft
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

  // 01. Fetch existing entity data
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
        console.error("Entity Retrieval Failure:", error);
      } finally {
        setLoading(false);
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
      console.error("Synchronization Failed:", error.message);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <RefreshCcw className="animate-spin text-blue-500 mb-4" size={32} />
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Retrieving Entity Specs...</p>
    </div>
  );

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
            <ArrowLeft size={14} /> Abort Update
          </Link>
          <h1 className="text-6xl font-black tracking-tighter uppercase italic leading-none">
            Modify <span className="text-blue-600">Entity</span>
          </h1>
          <p className="text-slate-500 font-medium italic">Adjusting fiscal parameters for <span className="text-slate-900 font-black">ID-{customerId}</span></p>
        </div>
        <div className="h-16 w-16 bg-slate-900 rounded-[2rem] flex items-center justify-center text-blue-400 shadow-2xl">
          <Settings2 size={28} />
        </div>
      </header>

      <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* IDENTITY BLOCK */}
        <div className="md:col-span-2 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-slate-400 font-black text-[10px] uppercase tracking-[0.3em]">
              <ShieldCheck size={14} /> Entity Integrity
            </div>
            <div className="flex items-center gap-3">
               <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Status: {formData.is_active ? 'Active' : 'Suspended'}</span>
               <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={formData.is_active} onChange={(e) => setFormData({...formData, is_active: e.target.checked})} />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-lime-500"></div>
                </label>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-4">Update Legal Name</label>
              <input 
                required type="text"
                className="w-full bg-slate-50 border border-slate-100 p-6 rounded-2xl outline-none focus:bg-white focus:ring-8 focus:ring-blue-500/5 transition-all text-sm font-black"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-4">Secure Uplink</label>
              <div className="relative">
                <Phone className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  required type="text"
                  className="w-full bg-slate-50 border border-slate-100 p-6 rounded-2xl outline-none focus:bg-white transition-all text-sm font-black tabular-nums"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
            </div>
          </div>
        </div>

        {/* FISCAL VECTOR BLOCK */}
        <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-blue-600 font-black text-[10px] uppercase tracking-[0.3em]">
              <Wallet size={14} /> Credit Vector
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={formData.is_credit_allowed} onChange={(e) => setFormData({...formData, is_credit_allowed: e.target.checked})} />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className={`space-y-6 transition-all duration-500 ${formData.is_credit_allowed ? 'opacity-100' : 'opacity-20 grayscale'}`}>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-4">Revised Limit (₹)</label>
              <input 
                type="number"
                className="w-full bg-slate-50 border border-slate-100 p-6 rounded-2xl outline-none focus:bg-white transition-all text-sm font-black tabular-nums"
                value={formData.credit_limit}
                onChange={(e) => setFormData({...formData, credit_limit: Number(e.target.value)})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-4">Terms (Days)</label>
              <input 
                type="number"
                className="w-full bg-slate-50 border border-slate-100 p-6 rounded-2xl outline-none focus:bg-white transition-all text-sm font-black tabular-nums"
                value={formData.credit_days}
                onChange={(e) => setFormData({...formData, credit_days: Number(e.target.value)})}
              />
            </div>
          </div>
        </div>

        {/* SYSTEM STATUS PANEL */}
        <div className="bg-slate-900 p-10 rounded-[3.5rem] text-white flex flex-col justify-between shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[60px] -mr-16 -mt-16" />
          
          <div className="space-y-6 relative z-10">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-blue-400 italic">Pre-Sync Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-[9px] font-black uppercase text-slate-500 tracking-widest">Target ID</span>
                <span className="text-xs font-bold text-white italic">#{customerId}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-[9px] font-black uppercase text-slate-500 tracking-widest">Protocol</span>
                <span className="text-xs font-bold text-white italic uppercase">PUT_UPDATE</span>
              </div>
            </div>
          </div>

          <button 
            type="submit"
            disabled={updating}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-6 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-500/10 mt-12"
          >
            {updating ? <Loader2 className="animate-spin" size={18} /> : <><Save size={18} /> Commit Changes</>}
          </button>
        </div>
      </form>
    </motion.div>
  );
}