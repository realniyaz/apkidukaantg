"use client";

import { useState } from "react";
import { apiRequest } from "@/lib/api";
import { User } from "@/types/user";
import { motion } from "framer-motion";
// Corrected UserEdit to UserRoundPen or Edit3
import { X, UserRoundPen, ShieldCheck, Lock, Loader2, User as UserIcon } from "lucide-react";

export default function EditUserModal({
  user,
  onClose,
  onSuccess,
}: {
  user: User;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [form, setForm] = useState({
    name: user.name,
    role_name: user.role, 
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload: any = {
        name: form.name,
        role_name: form.role_name,
      };

      if (form.password.trim() !== "") {
        payload.password = form.password;
      }

      await apiRequest(`/users/${user.public_id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "Update failed");
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
        {/* Header */}
        <div className="bg-[#2D3748] p-6 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-[#84CC16] p-2 rounded-lg">
              <UserRoundPen size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold leading-none">Edit Profile</h2>
              <p className="text-xs text-gray-400 mt-1">Update details for {user.name}</p>
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
              <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              <input
                type="text"
                value={form.name}
                className="w-full border border-gray-100 bg-gray-50/50 p-3 pl-10 rounded-xl focus:ring-2 focus:ring-[#84CC16]/20 focus:border-[#84CC16] outline-none transition-all font-medium text-[#2D3748]"
                required
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
          </div>

          {/* Role Selection */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest font-black text-gray-400 ml-1">Access Level</label>
            <div className="relative">
              <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              <select
                className="w-full border border-gray-100 bg-gray-50/50 p-3 pl-10 rounded-xl focus:ring-2 focus:ring-[#84CC16]/20 focus:border-[#84CC16] outline-none transition-all font-bold text-[#2D3748] appearance-none cursor-pointer"
                value={form.role_name}
                onChange={(e) => setForm({ ...form, role_name: e.target.value })}
              >
                <option value="staff">Staff</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest font-black text-gray-400 ml-1">Update Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              <input
                type="password"
                placeholder="Leave blank to keep current"
                className="w-full border border-gray-100 bg-gray-50/50 p-3 pl-10 rounded-xl focus:ring-2 focus:ring-[#84CC16]/20 focus:border-[#84CC16] outline-none transition-all font-medium text-[#2D3748]"
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
          </div>

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
              className="bg-[#84CC16] hover:bg-[#74b513] text-white px-8 py-3 rounded-xl font-black text-sm transition-all shadow-lg shadow-[#84CC16]/30 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Updating...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}