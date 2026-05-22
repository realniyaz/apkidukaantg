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
  ShieldCheck, Activity, Zap, ArrowRight, Fingerprint 
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
      console.error("User Sync Failure:", err.message);
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
    <div className="min-h-[60vh] flex flex-col items-center justify-center">
      <Loader2 className="animate-spin text-lime-500" size={40} />
      <p className="mt-4 font-black text-slate-400 uppercase tracking-[0.3em] text-[10px]">Synchronizing Personnel Registry...</p>
    </div>
  );

  return (
    <div className="space-y-10 pb-20">
      
      {/* EXECUTIVE HEADER */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-lime-600 font-black text-[10px] uppercase tracking-[0.3em]">
            <Fingerprint size={14} className="animate-pulse" /> Personnel Control Node
          </div>
          <h1 className="text-5xl font-black tracking-tighter uppercase italic leading-none text-slate-900">
            Team <span className="text-slate-300">Registry</span>
          </h1>
          <p className="text-slate-500 font-medium italic">Manage system access and neural permissions.</p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-slate-900 hover:bg-black text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl hover:shadow-lime-500/20 active:scale-95 flex items-center gap-3"
        >
          <UserPlus size={18} className="text-lime-400" />
          Provision New Node
        </button>
      </header>

      {/* STATS ARCHITECTURE */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label="Total Nodes" value={stats.total} sub="Full Personnel" icon={<Users />} color="blue" />
        <StatCard label="Active Uplinks" value={stats.active} sub="System Online" icon={<Activity />} color="lime" />
        <StatCard label="Security Admin" value={stats.admins} sub="Root Permissions" icon={<ShieldCheck />} color="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* TABLE SECTION */}
        <section className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50 border-b border-slate-100">
                  <tr>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Identity</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Protocol</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Status</th>
                    <th className="px-8 py-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {users.map((user, idx) => (
                    <motion.tr 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      key={user.public_id} 
                      className="group hover:bg-slate-50 transition-all duration-300"
                    >
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-xl bg-slate-900 flex items-center justify-center text-lime-400 font-black border border-slate-800 shadow-lg group-hover:scale-105 transition-transform">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-black text-slate-900 uppercase italic tracking-tighter leading-tight group-hover:text-lime-600 transition-colors">
                              {user.name}
                            </span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{user.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className="px-3 py-1 bg-slate-100 rounded-lg text-[9px] font-black text-slate-600 uppercase tracking-widest italic border border-slate-200">
                          {user.role}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2">
                          <div className={`h-1.5 w-1.5 rounded-full ${user.is_active ? 'bg-lime-500 animate-pulse' : 'bg-slate-300'}`} />
                          <span className={`text-[10px] font-black uppercase tracking-widest ${user.is_active ? 'text-lime-600' : 'text-slate-400'}`}>
                            {user.is_active ? 'Uplink Active' : 'Offline'}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => setEditingUser(user)} className="h-10 w-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-blue-500 hover:border-blue-500/30 transition-all">
                            <Edit3 size={16} />
                          </button>
                          {user.is_active && (
                            <button onClick={() => setDeactivatingId(user.public_id)} className="h-10 w-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-red-500 hover:border-red-500/30 transition-all">
                              <UserX size={16} />
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
        <aside className="space-y-8">
           <div className="bg-slate-900 rounded-[3.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
              <Zap className="absolute top-0 right-0 p-8 opacity-5" size={180} />
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-lime-400 mb-8 italic flex items-center gap-2">
                 <Zap size={14} fill="currentColor" /> Role Analytics
              </h3>
              <div className="relative z-10">
                <RoleDistributionChart users={users} />
              </div>
           </div>
           
           <div className="bg-white rounded-[3rem] p-8 border border-slate-100 shadow-xl group">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 italic mb-4">Registry Integrity</p>
              <div className="flex items-center justify-between">
                 <span className="text-xs font-black text-slate-900 uppercase italic">System Health</span>
                 <span className="text-xs font-black text-lime-600">98.2%</span>
              </div>
              <div className="mt-4 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
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

function StatCard({ label, value, sub, icon, color }: any) {
  const colors: any = {
    blue: "text-blue-500 bg-blue-50 border-blue-100",
    lime: "text-lime-600 bg-lime-50 border-lime-100",
    purple: "text-purple-600 bg-purple-50 border-purple-100"
  }
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl transition-all group"
    >
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
          <h2 className="text-5xl font-black italic tracking-tighter text-slate-900">{value}</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">{sub}</p>
        </div>
        <div className={`h-14 w-14 rounded-2xl flex items-center justify-center border transition-transform group-hover:rotate-6 ${colors[color]}`}>
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
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[100] p-4"
    >
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white p-12 rounded-[3.5rem] max-w-md w-full shadow-2xl text-center"
      >
        <div className="h-20 w-20 bg-red-50 text-red-500 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-red-100">
          <UserX size={32} />
        </div>
        <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter mb-4">Decommission Node?</h3>
        <p className="text-slate-500 mb-10 text-sm font-medium leading-relaxed">
          The personnel uplink will be terminated immediately. This action will revoke all system permissions for this node.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <button onClick={onCancel} className="py-4 bg-slate-100 hover:bg-slate-200 text-slate-900 font-black text-[10px] uppercase tracking-widest rounded-2xl transition-all">
            Abort
          </button>
          <button onClick={onConfirm} className="py-4 bg-red-600 hover:bg-red-700 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl transition-all shadow-lg shadow-red-200">
            Terminate
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}