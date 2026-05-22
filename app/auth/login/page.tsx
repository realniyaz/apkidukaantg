"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { apiRequest } from "@/lib/api";
import { AuthService } from "@/lib/auth";
import { LoginPayload, TokenResponse } from "@/types/auth";
import ForgotPasswordFlow from "@/app/components/auth/ForgotPasswordFlow"; // Import the flow we built
import { 
  Lock, Mail, ArrowRight, Eye, EyeOff, 
  ShieldCheck, Loader2, AlertCircle, Store
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  
  // View State: 'LOGIN' or 'RECOVERY'
  const [view, setView] = useState<"LOGIN" | "RECOVERY">("LOGIN");
  
  const [form, setForm] = useState<LoginPayload>({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await apiRequest<TokenResponse>("auth/login", {
        method: "POST",
        body: JSON.stringify(form),
      });

      AuthService.setToken(data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Credential mismatch. Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFDFD] selection:bg-lime-500/20 overflow-x-hidden relative px-6 py-12">
      
      {/* 01. AMBIENT ATMOSPHERE */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute -top-[10%] -right-[10%] w-[600px] h-[600px] bg-lime-500/5 rounded-full blur-[120px]"
        />
        <motion.div 
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 12, repeat: Infinity }}
          className="absolute -bottom-[10%] -left-[10%] w-[700px] h-[700px] bg-slate-900/5 rounded-full blur-[140px]"
        />
      </div>

      {/* 02. AUTHENTICATION TERMINAL */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-white rounded-[3.5rem] p-10 md:p-14 shadow-2xl border border-slate-100 relative overflow-hidden font-bold">
          
          <AnimatePresence mode="wait">
            {view === "LOGIN" ? (
              /* --- LOGIN VIEW --- */
              <motion.div
                key="login-view"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
              >
                <header className="flex flex-col items-center text-center mb-12">
                  <div className="h-16 w-16 bg-slate-900 rounded-[1.5rem] flex items-center justify-center shadow-2xl mb-6">
                    <Store className="text-lime-400" size={28} />
                  </div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
                    Welcome <span className="text-lime-600 text-slate-800">Back</span>
                  </h2>
                  <p className="text-slate-400 text-[10px] uppercase tracking-[0.3em] mt-3">Access Merchant Terminal</p>
                </header>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Uplink Address</label>
                    <div className="relative group">
                      <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-lime-500 transition-colors" size={18} />
                      <input
                        type="email"
                        placeholder="name@store.com"
                        className="w-full bg-slate-50 border border-slate-100 rounded-[1.8rem] py-4 pl-16 pr-6 outline-none focus:bg-white focus:ring-8 focus:ring-lime-500/5 transition-all text-sm font-bold shadow-inner"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center px-4">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Pass-Key</label>
                      <button 
                        type="button"
                        onClick={() => setView("RECOVERY")}
                        className="text-[10px] font-black uppercase tracking-widest text-lime-600 hover:text-slate-900 transition-colors italic underline decoration-lime-500/30"
                      >
                        Forgot?
                      </button>
                    </div>
                    <div className="relative group">
                      <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-lime-500 transition-colors" size={18} />
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="w-full bg-slate-50 border border-slate-100 rounded-[1.8rem] py-4 pl-16 pr-14 outline-none focus:bg-white focus:ring-8 focus:ring-lime-500/5 transition-all text-sm font-bold shadow-inner"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        required
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-[11px] uppercase tracking-wider italic">
                      <AlertCircle size={16} /> {error}
                    </div>
                  )}

                  <button
                    disabled={loading}
                    className="w-full bg-slate-900 text-white p-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-black transition-all shadow-2xl shadow-slate-200 disabled:opacity-70 group"
                  >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : <>Login <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>}
                  </button>
                </form>

                <footer className="mt-12 flex flex-col items-center gap-6">
                  <div className="flex items-center gap-2 text-[9px] font-black text-slate-300 uppercase tracking-widest">
                    <ShieldCheck size={14} /> Neural Security Protocol Active
                  </div>
                  <p className="text-sm font-medium text-slate-400">
                    New Merchant? <Link href="/auth/register" className="text-lime-600 font-black hover:underline">Sign Up</Link>
                  </p>
                </footer>
              </motion.div>
            ) : (
              /* --- RECOVERY VIEW --- */
              <motion.div
                key="recovery-view"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
              >
                <ForgotPasswordFlow onBack={() => setView("LOGIN")} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <div className="absolute -bottom-20 -left-20 text-[15vw] font-black text-slate-900/[0.02] select-none pointer-events-none tracking-tighter hidden lg:block italic">
        APKI_DUKAAN
      </div>
    </div>
  );
}