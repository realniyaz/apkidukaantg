"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { apiRequest } from "@/lib/api";
import { 
  User, Store, Mail, Lock, ArrowRight, Loader2, 
  CheckCircle2, AlertCircle, ShieldCheck, MapPin, 
  Phone, Globe, Building, ArrowLeft, Zap 
} from "lucide-react";

/* --- REUSABLE SUB-COMPONENT --- */
function InputField({ label, icon, type = "text", placeholder, value, onChange }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">{label}</label>
      <div className="relative group">
        {icon && <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-lime-500 transition-colors">{icon}</div>}
        <input 
          required 
          type={type} 
          placeholder={placeholder} 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full bg-slate-50 border border-slate-100 py-5 ${icon ? 'pl-16' : 'pl-6'} pr-6 rounded-[1.8rem] outline-none focus:bg-white focus:ring-8 focus:ring-lime-500/5 transition-all text-sm font-bold text-slate-800 placeholder:text-slate-300 shadow-inner`}
        />
      </div>
    </div>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    owner_name: "",
    email: "",
    phone: "",
    is_phone_verified: false,
    password: "",
    shop_name: "",
    address_line: "",
    address_line2: "",
    city: "",
    state: "",
    country: "India",
    pincode: "",
  });

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
        nextStep();
        return;
    }
    
    setLoading(true);
    setError("");

    try {
      await apiRequest("auth/register", {
        method: "POST",
        body: JSON.stringify(form),
      });

      setSuccess("Neural Store Identity Created.");
      setTimeout(() => router.push("/auth/login"), 2000);
    } catch (err: any) {
      setError(err.message || "Protocol mismatch. Check your credentials.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFDFD] selection:bg-lime-500/20 px-6 py-12 relative overflow-hidden">
      
      {/* ATMOSPHERIC NODES */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-lime-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-slate-900/5 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-2xl"
      >
        <div className="bg-white rounded-[3.5rem] p-10 md:p-16 shadow-2xl border border-slate-100 relative overflow-hidden font-bold">
          
          <header className="text-center mb-12">
             <div className="flex justify-center mb-6">
                <div className="h-16 w-16 bg-slate-900 rounded-[1.5rem] flex items-center justify-center shadow-xl">
                   <Store className="text-lime-400" size={28} />
                </div>
             </div>
             <h1 className="text-4xl font-black tracking-tighter uppercase italic text-slate-900 leading-none">
               Initialize <span className="text-lime-600">Merchant</span>
             </h1>
             <p className="text-slate-400 text-[10px] uppercase tracking-[0.3em] mt-3">Node Registration Protocol v2.6</p>
          </header>

          {/* PROGRESS NODES */}
          <div className="flex justify-center gap-3 mb-12">
            {[1, 2, 3].map((i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${step >= i ? 'w-10 bg-lime-500' : 'w-2 bg-slate-100'}`} />
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div 
                  key="step1" 
                  initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} 
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField label="Owner Identity" icon={<User size={18}/>} placeholder="Legal Name" value={form.owner_name} onChange={(v: string) => setForm({...form, owner_name: v})} />
                    <InputField label="Secure Uplink" icon={<Phone size={18}/>} placeholder="Phone Number" value={form.phone} onChange={(v: string) => setForm({...form, phone: v})} />
                  </div>
                  <InputField label="Neural Address" icon={<Mail size={18}/>} placeholder="business@email.com" value={form.email} onChange={(v: string) => setForm({...form, email: v})} />
                  <InputField label="Access Encryption" icon={<Lock size={18}/>} type="password" placeholder="••••••••" value={form.password} onChange={(v: string) => setForm({...form, password: v})} />
                </motion.div>
              )}

              {step === 2 && (
                <motion.div 
                  key="step2" 
                  initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} 
                  className="space-y-6"
                >
                  <InputField label="Store Designation" icon={<Zap size={18}/>} placeholder="Store Title" value={form.shop_name} onChange={(v: string) => setForm({...form, shop_name: v})} />
                  <InputField label="Location Alpha" icon={<MapPin size={18}/>} placeholder="Address Line 1" value={form.address_line} onChange={(v: string) => setForm({...form, address_line: v})} />
                  <InputField label="Location Beta" icon={<Building size={18}/>} placeholder="Landmark / Suite (Optional)" value={form.address_line2} onChange={(v: string) => setForm({...form, address_line2: v})} />
                </motion.div>
              )}

              {step === 3 && (
                <motion.div 
                  key="step3" 
                  initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} 
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField label="City Node" placeholder="City" value={form.city} onChange={(v: string) => setForm({...form, city: v})} />
                    <InputField label="State / Province" placeholder="State" value={form.state} onChange={(v: string) => setForm({...form, state: v})} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField label="Postal Code" placeholder="Pincode" value={form.pincode} onChange={(v: string) => setForm({...form, pincode: v})} />
                    <InputField label="Jurisdiction" icon={<Globe size={18}/>} placeholder="Country" value={form.country} onChange={(v: string) => setForm({...form, country: v})} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* FEEDBACK OVERLAYS */}
            <AnimatePresence>
                {error && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 p-5 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-[11px] uppercase tracking-wider">
                        <AlertCircle size={16}/> {error}
                    </motion.div>
                )}
                {success && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 p-5 bg-lime-50 border border-lime-100 rounded-2xl text-lime-600 text-[11px] uppercase tracking-wider">
                        <CheckCircle2 size={16}/> {success}
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex gap-4">
              {step > 1 && (
                <button type="button" onClick={prevStep} className="p-6 bg-slate-50 text-slate-400 rounded-[1.8rem] hover:text-slate-900 transition-all active:scale-95 border border-slate-100 shadow-inner">
                    <ArrowLeft size={20}/>
                </button>
              )}
              <button 
                type="submit" 
                disabled={loading || !!success}
                className="flex-1 bg-slate-900 text-white p-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-black transition-all shadow-2xl disabled:opacity-50 group"
              >
                {loading ? <Loader2 className="animate-spin" size={20}/> : (
                  <>
                    {step === 3 ? "Finalize Registry" : "Next Segment"}
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </form>

          <footer className="mt-12 pt-8 border-t border-slate-50 flex flex-col items-center gap-6">
             <p className="text-sm font-medium text-slate-400">Existing Merchant? <Link href="/auth/login" className="text-lime-600 font-black hover:underline">Connect Node</Link></p>
             <div className="flex items-center gap-2 opacity-20 grayscale select-none">
                <ShieldCheck size={14}/>
                <span className="text-[8px] font-black uppercase tracking-widest">Apkidukaan Neural Security v4.2</span>
             </div>
          </footer>
        </div>
      </motion.div>
    </div>
  );
}