"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { apiRequest } from "@/lib/api";
import { 
  Mail, Key, Lock, ArrowRight, Loader2, 
  CheckCircle2, AlertCircle, ArrowLeft, ShieldCheck 
} from "lucide-react";

interface ForgotPasswordFlowProps {
  onBack: () => void;
}

export default function ForgotPasswordFlow({ onBack }: ForgotPasswordFlowProps) {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // 1. POST /auth/forgot-password
  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await apiRequest("auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      setStep(2);
    } catch (err: any) {
      setError(err.message || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  // 2. POST /auth/verify-otp
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await apiRequest("auth/verify-otp", {
        method: "POST",
        body: JSON.stringify({ email, otp }),
      });
      setStep(3);
    } catch (err: any) {
      setError(err.message || "Invalid OTP code.");
    } finally {
      setLoading(false);
    }
  };

  // 3. POST /auth/reset-password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await apiRequest("auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ email, otp, new_password: newPassword }),
      });
      alert("Password Reset Successful. Please Login.");
      onBack();
    } catch (err: any) {
      setError(err.message || "Reset failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 font-bold">
      <header className="text-center">
        <h2 className="text-3xl font-black tracking-tighter uppercase italic text-slate-900">
          Recovery <span className="text-blue-600">Protocol</span>
        </h2>
        <p className="text-slate-400 text-[10px] uppercase tracking-[0.2em] mt-2">
          {step === 1 && "Phase 01: Identification"}
          {step === 2 && "Phase 02: Neural Verification"}
          {step === 3 && "Phase 03: Key Generation"}
        </p>
      </header>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.form key="s1" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} onSubmit={handleRequestOTP} className="space-y-6">
            <InputField label="Registered Email" icon={<Mail size={18}/>} placeholder="your@email.com" value={email} onChange={setEmail} />
            <SubmitButton loading={loading} text="Send Verification Code" />
          </motion.form>
        )}

        {step === 2 && (
          <motion.form key="s2" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} onSubmit={handleVerifyOTP} className="space-y-6">
            <InputField label="Verify OTP Code" icon={<ShieldCheck size={18}/>} placeholder="Enter 6-digit code" value={otp} onChange={setOtp} />
            <SubmitButton loading={loading} text="Verify Protocol" />
          </motion.form>
        )}

        {step === 3 && (
          <motion.form key="s3" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} onSubmit={handleResetPassword} className="space-y-6">
            <InputField label="New Encryption Key" type="password" icon={<Lock size={18}/>} placeholder="••••••••" value={newPassword} onChange={setNewPassword} />
            <SubmitButton loading={loading} text="Commit Reset" />
          </motion.form>
        )}
      </AnimatePresence>

      {error && <p className="text-center text-red-500 text-[10px] uppercase tracking-widest">{error}</p>}

      <button onClick={onBack} className="w-full text-center text-slate-400 text-[10px] uppercase tracking-widest hover:text-slate-900 transition-all flex items-center justify-center gap-2">
        <ArrowLeft size={12} /> Abort Recovery
      </button>
    </div>
  );
}

/* --- REUSABLE MINI COMPONENTS --- */

function InputField({ label, icon, type = "text", placeholder, value, onChange }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">{label}</label>
      <div className="relative group">
        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors">{icon}</div>
        <input 
          required type={type} placeholder={placeholder} value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-slate-50 border border-slate-100 py-5 pl-16 pr-6 rounded-[1.8rem] outline-none focus:bg-white focus:ring-8 focus:ring-blue-500/5 transition-all text-sm font-bold text-slate-800 shadow-inner"
        />
      </div>
    </div>
  );
}

function SubmitButton({ loading, text }: { loading: boolean; text: string }) {
  return (
    <button type="submit" disabled={loading} className="w-full bg-slate-900 text-white p-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-black transition-all shadow-xl disabled:opacity-50">
      {loading ? <Loader2 className="animate-spin" size={20}/> : <>{text} <ArrowRight size={18}/></>}
    </button>
  );
}