"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { apiRequest } from "@/lib/api";
import { AuthService } from "@/lib/auth";
import { LoginPayload, TokenResponse } from "@/types/auth";
import ForgotPasswordFlow from "@/app/components/auth/ForgotPasswordFlow"; 
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
      setError(err.message || "Invalid email or password. Please try again.");
    } finally {
      setView("LOGIN");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFDFD] selection:bg-lime-500/20 overflow-x-hidden relative px-4 sm:px-6 py-8 sm:py-12">
      
      {/* 01. AMBIENT ATMOSPHERE */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute -top-[10%] -right-[10%] w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-lime-500/5 rounded-full blur-[80px] sm:blur-[120px]"
        />
        <motion.div 
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 12, repeat: Infinity }}
          className="absolute -bottom-[10%] -left-[10%] w-[350px] sm:w-[700px] h-[350px] sm:h-[700px] bg-slate-900/5 rounded-full blur-[90px] sm:blur-[140px]"
        />
      </div>

      {/* 02. AUTHENTICATION TERMINAL */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Mobile-optimized layout: reduced padding and rounded corners on smaller screens */}
        <div className="bg-white rounded-[2rem] sm:rounded-[3.5rem] p-6 sm:p-14 shadow-xl sm:shadow-2xl border border-slate-100 relative overflow-hidden">
          
          <AnimatePresence mode="wait">
            {view === "LOGIN" ? (
              /* --- LOGIN VIEW --- */
              <motion.div
                key="login-view"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
              >
                <header className="flex flex-col items-center text-center mb-8 sm:mb-12">
                  <div className="h-14 w-14 sm:h-16 sm:w-16 bg-slate-900 rounded-[1.2rem] sm:rounded-[1.5rem] flex items-center justify-center shadow-lg mb-4 sm:mb-6">
                    <Store className="text-lime-400" size={24} />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
                    Welcome <span className="text-lime-600">Back</span>
                  </h2>
                  <p className="text-slate-400 text-[9px] sm:text-[10px] uppercase tracking-[0.25em] mt-2.5">Sign in to your merchant account</p>
                </header>

                <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 ml-3 sm:ml-4">Email Address</label>
                    <div className="relative group">
                      <Mail className="absolute left-5 sm:left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-lime-500 transition-colors" size={18} />
                      <input
                        type="email"
                        placeholder="name@store.com"
                        className="w-full bg-slate-50 border border-slate-100 rounded-[1.2rem] sm:rounded-[1.8rem] py-3.5 sm:py-4 pl-12 sm:pl-16 pr-5 sm:pr-6 outline-none focus:bg-white focus:ring-4 sm:focus:ring-8 focus:ring-lime-500/5 transition-all text-sm font-semibold shadow-inner"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center px-3 sm:px-4">
                      <label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">Password</label>
                      <button 
                        type="button"
                        onClick={() => setView("RECOVERY")}
                        className="text-[10px] font-black uppercase tracking-wider text-lime-600 hover:text-slate-900 transition-colors italic underline decoration-lime-500/30"
                      >
                        Forgot?
                      </button>
                    </div>
                    <div className="relative group">
                      <Lock className="absolute left-5 sm:left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-lime-500 transition-colors" size={18} />
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="w-full bg-slate-50 border border-slate-100 rounded-[1.2rem] sm:rounded-[1.8rem] py-3.5 sm:py-4 pl-12 sm:pl-16 pr-12 sm:pr-14 outline-none focus:bg-white focus:ring-4 sm:focus:ring-8 focus:ring-lime-500/5 transition-all text-sm font-semibold shadow-inner"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        required
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-5 sm:right-6 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <div className="flex items-center gap-2.5 p-3.5 bg-red-50 border border-red-100 rounded-xl sm:rounded-2xl text-red-600 text-[11px] uppercase tracking-wider italic">
                      <AlertCircle size={16} className="shrink-0" /> {error}
                    </div>
                  )}

                  <button
                    disabled={loading}
                    className="w-full bg-slate-900 text-white p-4 sm:p-6 rounded-[1.2rem] sm:rounded-[2rem] font-black text-xs uppercase tracking-[0.25em] flex items-center justify-center gap-2 hover:bg-black transition-all shadow-xl sm:shadow-2xl shadow-slate-200 disabled:opacity-70 group"
                  >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : <>Sign In <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>}
                  </button>
                </form>

                <footer className="mt-8 sm:mt-12 flex flex-col items-center gap-4 sm:gap-6">
                  <div className="flex items-center gap-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                    <ShieldCheck size={14} className="text-lime-600" /> Secure Encryption Active
                  </div>
                  <p className="text-sm font-medium text-slate-400">
                    New merchant? <Link href="/auth/register" className="text-lime-600 font-black hover:underline">Create an account</Link>
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