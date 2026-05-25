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

// --- VALIDATION HELPERS ---
const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidPhone = (phone: string) => /^\d{10}$/.test(phone);
const isValidPincode = (pin: string) => /^\d{6}$/.test(pin);

/* --- SUB-COMPONENT --- */
function InputField({ label, icon, type = "text", placeholder, value, onChange }: any) {
  return (
    <div className="space-y-1.5 sm:space-y-2">
      <label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 ml-4">{label}</label>
      <div className="relative group">
        {icon && <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-lime-500 transition-colors">{icon}</div>}
        <input 
          required 
          type={type} 
          placeholder={placeholder} 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-slate-50 border border-slate-100 py-4 pl-14 pr-6 rounded-[1.8rem] outline-none focus:bg-white focus:ring-4 focus:ring-lime-500/5 transition-all text-sm font-semibold text-slate-800 shadow-inner"
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
    owner_name: "", email: "", phone: "", password: "",
    shop_name: "", address_line: "", address_line2: "",
    city: "", state: "", country: "India", pincode: "",
  });

  // --- SECURITY VALIDATION ---
  const validateStep = () => {
    if (step === 1) {
      if (!form.owner_name.trim()) return "Full Name is required";
      if (!isValidPhone(form.phone)) return "Enter a valid 10-digit phone number";
      if (!isValidEmail(form.email)) return "Enter a valid email address";
      if (form.password.length < 6) return "Password must be at least 6 characters";
    }
    if (step === 2) {
      if (!form.shop_name.trim()) return "Business Name is required";
      if (!form.address_line.trim()) return "Street address is required";
    }
    if (step === 3) {
      if (!form.city.trim() || !form.state.trim()) return "City and State are required";
      if (!isValidPincode(form.pincode)) return "Enter a valid 6-digit Pincode";
    }
    return null;
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateStep();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError("");
    setStep(s => s + 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) return handleNext(e);
    
    setLoading(true);
    setError("");

    try {
      await apiRequest("auth/register", { method: "POST", body: JSON.stringify(form) });
      setSuccess("Account created successfully!");
      setTimeout(() => router.push("/auth/login"), 2000);
    } catch (err: any) {
      setError(err.message || "Registration failed. Try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFDFD] px-4 py-12 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-lime-500/5 rounded-full blur-[120px]" />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 w-full max-w-xl">
        <div className="bg-white rounded-[3rem] p-10 shadow-2xl border border-slate-100">
          <header className="text-center mb-10">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 bg-slate-900 rounded-[1.5rem] flex items-center justify-center"><Store className="text-lime-400" size={24} /></div>
            </div>
            <h1 className="text-3xl font-black italic uppercase tracking-tighter">Create Account</h1>
            <p className="text-slate-400 text-[10px] uppercase tracking-[0.2em] mt-2">Register your business profile</p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5">
                  <InputField label="Full Name" icon={<User size={18}/>} placeholder="John Doe" value={form.owner_name} onChange={(v: string) => setForm({...form, owner_name: v})} />
                  <InputField label="Phone Number" icon={<Phone size={18}/>} placeholder="10-digit mobile" value={form.phone} onChange={(v: string) => setForm({...form, phone: v})} />
                  <InputField label="Email Address" icon={<Mail size={18}/>} placeholder="email@business.com" value={form.email} onChange={(v: string) => setForm({...form, email: v})} />
                  <InputField label="Password" icon={<Lock size={18}/>} type="password" placeholder="Min 6 characters" value={form.password} onChange={(v: string) => setForm({...form, password: v})} />
                </motion.div>
              )}
              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5">
                  <InputField label="Business Name" icon={<Zap size={18}/>} placeholder="My Shop" value={form.shop_name} onChange={(v: string) => setForm({...form, shop_name: v})} />
                  <InputField label="Address Line 1" icon={<MapPin size={18}/>} placeholder="Street address" value={form.address_line} onChange={(v: string) => setForm({...form, address_line: v})} />
                  <InputField label="Address Line 2" icon={<Building size={18}/>} placeholder="Landmark (Optional)" value={form.address_line2} onChange={(v: string) => setForm({...form, address_line2: v})} />
                </motion.div>
              )}
              {step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5">
                  <InputField label="City" placeholder="City" value={form.city} onChange={(v: string) => setForm({...form, city: v})} />
                  <InputField label="State" placeholder="State" value={form.state} onChange={(v: string) => setForm({...form, state: v})} />
                  <InputField label="Pincode" icon={<Globe size={18}/>} placeholder="6-digit PIN" value={form.pincode} onChange={(v: string) => setForm({...form, pincode: v})} />
                </motion.div>
              )}
            </AnimatePresence>

            {error && <div className="flex items-center gap-2 text-red-500 text-[10px] font-black uppercase p-3 bg-red-50 rounded-xl"><AlertCircle size={14}/> {error}</div>}
            {success && <div className="flex items-center gap-2 text-lime-600 text-[10px] font-black uppercase p-3 bg-lime-50 rounded-xl"><CheckCircle2 size={14}/> {success}</div>}

            <div className="flex gap-4 pt-4">
              {step > 1 && (
                <button type="button" onClick={() => setStep(s => s - 1)} className="p-6 bg-slate-100 rounded-[1.8rem]"><ArrowLeft size={20}/></button>
              )}
              <button type="submit" disabled={loading} className="flex-1 bg-slate-900 text-white p-6 rounded-[1.8rem] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-black transition-all">
                {loading ? <Loader2 className="animate-spin" size={18}/> : (step === 3 ? "Complete Registration" : "Continue")}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}