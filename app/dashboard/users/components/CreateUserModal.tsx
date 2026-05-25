"use client";

import { useState } from "react";
import { apiRequest } from "@/lib/api";
import { motion } from "framer-motion";
import { X, UserPlus, Mail, Lock, ShieldCheck, Loader2 } from "lucide-react";

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateUserModal({ onClose, onSuccess }: Props) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role_name: "staff", 
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await apiRequest("/users/", {
        method: "POST",
        body: JSON.stringify(form),
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "Could not register account. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#2D3748]/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4 overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative my-auto"
      >
        {/* Header Section */}
        <div className="bg-[#2D3748] p-5 sm:p-6 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-[#84CC16] p-2 rounded-lg shrink-0">
              <UserPlus size={18} className="text-white" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold leading-none uppercase italic tracking-tight">Add Team Member</h2>
              <p className="text-[11px] text-gray-400 mt-1">Assign access tiers and role levels</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1 transition-colors shrink-0">
            <X size={20} />
          </button>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-8 space-y-4 sm:space-y-5">
          {/* Name Input */}
          <div className="space-y-1.5">
            <label className="text-[9px] uppercase tracking-wider font-black text-gray-400 ml-0.5">Full Name</label>
            <div className="relative">
              <UserPlus className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
              <input
                type="text"
                placeholder="John Doe"
                className="w-full border border-gray-100 bg-gray-50/50 py-2.5 sm:py-3 pl-10 pr-4 rounded-xl focus:border-[#84CC16] outline-none transition-all text-sm font-semibold text-[#2D3748]"
                required
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
          </div>

          {/* Email Input */}
          <div className="space-y-1.5">
            <label className="text-[9px] uppercase tracking-wider font-black text-gray-400 ml-0.5">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
              <input
                type="email"
                placeholder="name@store.com"
                className="w-full border border-gray-100 bg-gray-50/50 py-2.5 sm:py-3 pl-10 pr-4 rounded-xl focus:border-[#84CC16] outline-none transition-all text-sm font-semibold text-[#2D3748]"
                required
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label className="text-[9px] uppercase tracking-wider font-black text-gray-400 ml-0.5">Temporary Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
              <input
                type="password"
                placeholder="••••••••"
                className="w-full border border-gray-100 bg-gray-50/50 py-2.5 sm:py-3 pl-10 pr-4 rounded-xl focus:border-[#84CC16] outline-none transition-all text-sm font-semibold text-[#2D3748]"
                required
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
          </div>

          {/* Role Choice */}
          <div className="space-y-1.5">
            <label className="text-[9px] uppercase tracking-wider font-black text-gray-400 ml-0.5">Access Privileges</label>
            <div className="relative">
              <ShieldCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" size={16} />
              <select
                className="w-full border border-gray-100 bg-gray-50/50 py-2.5 sm:py-3 pl-10 pr-4 rounded-xl focus:border-[#84CC16] outline-none transition-all text-sm font-bold text-[#2D3748] appearance-none"
                value={form.role_name}
                onChange={(e) => setForm({ ...form, role_name: e.target.value })}
              >
                <option value="staff">Staff</option>
                <option value="manager">Manager</option>
                <option value="admin">Administrator</option>
              </select>
            </div>
          </div>

          {/* Error Message banner */}
          {error && (
            <motion.div 
              initial={{ opacity: 0, x: -5 }} 
              animate={{ opacity: 1, x: 0 }}
              className="p-3 bg-red-50 text-red-600 rounded-xl text-xs font-semibold border border-red-100 italic"
            >
              {error}
            </motion.div>
          )}

          {/* Action Trigger Row */}
          <div className="flex justify-end gap-3 pt-3.5 border-t border-gray-50">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-[#2D3748] font-bold text-sm hover:bg-gray-50 rounded-xl transition-colors active:scale-95"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="bg-[#84CC16] hover:bg-[#74b513] text-white px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Saving...
                </>
              ) : (
                "Add Profile"
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}