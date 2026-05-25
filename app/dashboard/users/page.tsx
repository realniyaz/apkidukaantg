"use client";

import { useEffect, useState, useMemo } from "react";
import { apiRequest } from "@/lib/api";
import { User } from "@/types/user";

import CreateUserModal from "./components/CreateUserModal";
import EditUserModal from "./components/EditUserModal";
import RoleDistributionChart from "./components/RoleDistributionChart";

import { motion, AnimatePresence } from "framer-motion";
import { 
  UserPlus, UserX, Edit3, Loader2, Users, 
  ShieldCheck, Activity, Zap, Fingerprint 
} from "lucide-react";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deactivatingId, setDeactivatingId] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await apiRequest<User[]>("/users/");
      setUsers(data || []);
    } catch (err: any) {
      console.error("User list sync failed:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const deactivateUser = async (id: string) => {
    try {
      await apiRequest(`/users/${id}`, { method: "DELETE" });
      setUsers(prev =>
        prev.map(u => u.public_id === id ? { ...u, is_active: false } : u)
      );
      setDeactivatingId(null);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const stats = useMemo(() => ({
    total: users.length,
    active: users.filter(u => u.is_active).length,
    admins: users.filter(u => u.role === "admin").length
  }), [users]);

  if (loading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
      <Loader2 className="animate-spin text-lime-500" size={32} />
      <p className="mt-4 font-bold text-slate-400 uppercase tracking-widest text-[10px] text-center">Syncing Staff Records...</p>
    </div>
  );

  return (
    <div className="space-y-6 sm:space-y-10 pb-24 sm:pb-32 text-slate-900">
      
      {/* EXECUTIVE HEADER */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 sm:gap-6">
        <div className="space-y-1.5 sm:space-y-2">
          <div className="flex items-center gap-2 text-lime-600 font-black text-[9px] sm:text-[10px] uppercase tracking-wider">
            <Fingerprint size={14} className="text-lime-500 shrink-0" /> Team Authorization Active
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tighter uppercase italic leading-none text-slate-900">
            Team <span className="text-slate-400">Registry</span>
          </h1>
          <p className="text-slate-500 font-medium text-sm sm:text-base">Manage store access levels and staff workspace profiles.</p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="w-full md:w-auto bg-slate-900 hover:bg-black text-white px-6 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-black text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 flex items-center justify-center gap-2.5"
        >
          <UserPlus size={16} className="text-lime-400" />
          Add Team Member
        </button>
      </header>

      {/* STATS ARCHITECTURE */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <StatCard label="Total Members" value={stats.total} sub="Registered Staff" icon={<Users size={20} />} color="blue" />
        <StatCard label="Active Now" value={stats.active} sub="Currently Online" icon={<Activity size={20} />} color="lime" />
        <StatCard label="Administrators" value={stats.admins} sub="Full Control Privileges" icon={<ShieldCheck size={20} />} color="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-10">
        
        {/* TABLE SECTION */}
        <section className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-[1.5rem] sm:rounded-[3.5rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left min-w-[550px] border-separate border-spacing-0">
                <thead className="bg-slate-50/50 border-b border-slate-100 text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-wider">
                  <tr>
                    <th className="px-6 sm:px-8 py-4 sm:py-6 italic">Member Profile</th>
                    <th className="px-6 sm:px-8 py-4 sm:py-6 italic">Role Title</th>
                    <th className="px-6 sm:px-8 py-4 sm:py-6 italic">Status</th>
                    <th className="px-6 sm:px-8 py-4 sm:py-6 text-right italic">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 font-semibold text-slate-700">
                  {users.map((user, idx) => (
                    <motion.tr 
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      key={user.public_id} 
                      className="group hover:bg-slate-50/40 transition-colors"
                    >
                      <td className="px-6 sm:px-8 py-4">
                        <div className="flex items-center gap-3.5">
                          <div className="h-10 w-10 sm:h-12 sm:w-12 shrink-0 rounded-xl bg-slate-900 flex items-center justify-center text-lime-400 font-black border border-slate-800 shadow-md">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="font-black text-slate-900 uppercase italic tracking-tight leading-tight line-clamp-1">
                              {user.name}
                            </span>
                            <span className="text-[10px] font-medium text-slate-400 truncate mt-0.5">{user.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 sm:px-8 py-4">
                        <span className="px-2.5 py-0.5 bg-slate-100 rounded-md text-[9px] font-black text-slate-600 uppercase tracking-wider border border-slate-200">
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 sm:px-8 py-4">
                        <div className="flex items-center gap-2">
                          <div className={`h-1.5 w-1.5 rounded-full shrink-0 ${user.is_active ? 'bg-lime-500 animate-pulse' : 'bg-slate-300'}`} />
                          <span className={`text-[10px] font-black uppercase tracking-wider ${user.is_active ? 'text-lime-600' : 'text-slate-400'}`}>
                            {user.is_active ? 'Online' : 'Offline'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 sm:px-8 py-4 text-right">
                        {/* Mobile optimization: Keeps action buttons permanently visible on touch configurations */}
                        <div className="flex justify-end gap-2 md:opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => setEditingUser(user)} 
                            title="Edit User Profile"
                            className="h-9 w-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-500/20 transition-all active:scale-95 shadow-sm"
                          >
                            <Edit3 size={14} />
                          </button>
                          {user.is_active && (
                            <button 
                              onClick={() => setDeactivatingId(user.public_id)} 
                              title="Revoke Access"
                              className="h-9 w-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-red-500 hover:border-red-500/20 transition-all active:scale-95 shadow-sm"
                            >
                              <UserX size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ANALYTICS SIDEBAR */}
        <aside className="space-y-6 sm:space-y-8">
           <div className="bg-slate-900 rounded-[1.5rem] sm:rounded-[3.5rem] p-5 sm:p-10 text-white shadow-xl relative overflow-hidden">
              <Zap className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none hidden sm:block" size={180} />
              <h3 className="text-[10px] font-black uppercase tracking-wider text-lime-400 mb-6 sm:mb-8 italic flex items-center gap-2 relative z-10">
                 <Zap size={14} fill="currentColor" /> Role Allocation
              </h3>
              <div className="relative z-10 w-full overflow-x-auto no-scrollbar">
                <RoleDistributionChart users={users} />
              </div>
           </div>
           
           <div className="bg-white rounded-[1.5rem] sm:rounded-[3rem] p-5 sm:p-8 border border-slate-100 shadow-sm">
              <p className="text-[9px] font-black uppercase tracking-wider text-slate-400 italic mb-3">System Authorization Metrics</p>
              <div className="flex items-center justify-between">
                 <span className="text-xs font-bold text-slate-900 uppercase italic">Access Token Health</span>
                 <span className="text-xs font-black text-lime-600">98.2%</span>
              </div>
              <div className="mt-3 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                 <div className="h-full w-[98.2%] bg-lime-500" />
              </div>
           </div>
        </aside>
      </div>

      {/* MODALS */}
      <AnimatePresence>
        {showCreateModal && (
          <CreateUserModal onClose={() => setShowCreateModal(false)} onSuccess={fetchUsers} />
        )}
        {editingUser && (
          <EditUserModal user={editingUser} onClose={() => setEditingUser(null)} onSuccess={fetchUsers} />
        )}
        {deactivatingId && (
          <ConfirmModal
            onConfirm={() => deactivateUser(deactivatingId)}
            onCancel={() => setDeactivatingId(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function StatCard({ label, value, sub, icon, color }: any) {
  const colors: any = {
    blue: "text-blue-500 bg-blue-50 border-blue-100",
    lime: "text-lime-600 bg-lime-50 border-lime-100",
    purple: "text-purple-600 bg-purple-50 border-purple-100"
  };
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-slate-100 rounded-[1.5rem] sm:rounded-[2.5rem] p-5 sm:p-8 shadow-sm hover:shadow-md transition-all group"
    >
      <div className="flex justify-between items-start gap-4">
        <div className="space-y-0.5 min-w-0">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">{label}</p>
          <h2 className="text-3xl sm:text-5xl font-black italic tracking-tighter text-slate-900 leading-none mb-1 tabular-nums">{value}</h2>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider italic truncate">{sub}</p>
        </div>
        <div className={`h-11 w-11 sm:h-14 sm:w-14 rounded-xl sm:rounded-2xl flex items-center justify-center border shrink-0 transition-transform group-hover:rotate-6 ${colors[color]}`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );
}

function ConfirmModal({ onConfirm, onCancel }: { onConfirm: () => void, onCancel: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
    >
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white p-6 sm:p-12 rounded-[1.5rem] sm:rounded-[3.5rem] max-w-sm w-full shadow-xl text-center"
      >
        <div className="h-14 w-14 sm:h-20 sm:w-20 bg-red-50 text-red-500 rounded-xl sm:rounded-[2rem] flex items-center justify-center mx-auto mb-5 sm:mb-8 border border-red-100 shrink-0">
          <UserX size={24} />
        </div>
        <h3 className="text-xl sm:text-2xl font-black text-slate-900 uppercase italic tracking-tighter mb-2">Revoke Access?</h3>
        <p className="text-slate-500 mb-6 sm:mb-8 text-xs sm:text-sm font-medium leading-relaxed">
          This profile will be disabled immediately. This action revokes all active workspace permissions for this team member.
        </p>
        <div className="grid grid-cols-2 gap-3">
          <button onClick={onCancel} className="py-3 bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-[10px] uppercase tracking-wider rounded-xl transition-all">
            Cancel
          </button>
          <button onClick={onConfirm} className="py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-[10px] uppercase tracking-wider rounded-xl transition-all shadow-md">
            Confirm
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}