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
  // Payload matches your backend's expected structure
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role_name: "staff", // Matches backend payload.role_name
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
      // Handles the 400/403 errors from your backend service
      setError(err.message || "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#2D3748]/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
      >
        {/* Header - Slate Gray & Lime Green branding */}
        <div className="bg-[#2D3748] p-6 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-[#84CC16] p-2 rounded-lg">
              <UserPlus size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold leading-none">Add Team Member</h2>
              <p className="text-xs text-gray-400 mt-1">Assign roles and permissions</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {/* Name Field */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest font-black text-gray-400 ml-1">Full Name</label>
            <div className="relative">
              <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              <input
                type="text"
                placeholder="Full Name"
                className="w-full border border-gray-100 bg-gray-50/50 p-3 pl-10 rounded-xl focus:ring-2 focus:ring-[#84CC16]/20 focus:border-[#84CC16] outline-none transition-all font-medium text-[#2D3748]"
                required
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
          </div>

          {/* Email Field */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest font-black text-gray-400 ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              <input
                type="email"
                placeholder="email@example.com"
                className="w-full border border-gray-100 bg-gray-50/50 p-3 pl-10 rounded-xl focus:ring-2 focus:ring-[#84CC16]/20 focus:border-[#84CC16] outline-none transition-all font-medium text-[#2D3748]"
                required
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest font-black text-gray-400 ml-1">Temporary Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              <input
                type="password"
                placeholder="••••••••"
                className="w-full border border-gray-100 bg-gray-50/50 p-3 pl-10 rounded-xl focus:ring-2 focus:ring-[#84CC16]/20 focus:border-[#84CC16] outline-none transition-all font-medium text-[#2D3748]"
                required
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
          </div>

          {/* Role Selection - Updated for your Backend Permissions */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest font-black text-gray-400 ml-1">Permission Level</label>
            <div className="relative">
              <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              <select
                className="w-full border border-gray-100 bg-gray-50/50 p-3 pl-10 rounded-xl focus:ring-2 focus:ring-[#84CC16]/20 focus:border-[#84CC16] outline-none transition-all font-bold text-[#2D3748] appearance-none"
                value={form.role_name}
                onChange={(e) => setForm({ ...form, role_name: e.target.value })}
              >
                <option value="staff">Staff</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
                {/* Note: 'owner' is blocked by your backend logic, so we omit it here */}
              </select>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }} 
              animate={{ opacity: 1, x: 0 }}
              className="p-3 bg-red-50 text-red-600 rounded-lg text-sm font-medium border border-red-100"
            >
              {error}
            </motion.div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-[#2D3748] font-bold text-sm hover:bg-gray-100 rounded-xl transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="bg-[#84CC16] hover:bg-[#74b513] text-white px-8 py-3 rounded-xl font-black text-sm transition-all shadow-lg shadow-[#84CC16]/30 flex items-center gap-2 disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}