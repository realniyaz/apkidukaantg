"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Building2, Hash, Mail, Phone, MapPin, 
  Loader2, Zap, ShieldCheck, Globe, 
  BrainCircuit, Users, Package, ShoppingBag, 
  ArrowRight, Sparkles, Settings2
} from "lucide-react";

import ProfileHeader from "./components/ProfileHeader";
import UpdateDrawer from "./components/UpdateDrawer";
import SettingsDrawer from "./components/SettingsDrawer";
import InfoCard from "./components/InfoCard";
import Toast from "app/components/ui/Toast";

export default function ProfilePage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const fetchProfile = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const result = await apiRequest<any>("shop/dashboard");
      setData(result);
    } catch (error) {
      console.error("Profile Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProfile(); }, []);

  if (loading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center">
      <Loader2 className="animate-spin text-lime-500" size={40} />
      <p className="mt-4 font-black text-slate-400 uppercase tracking-[0.3em] text-[10px]">Loading Your Profile...</p>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto p-8 space-y-12 pb-32 relative"
    >
      <ProfileHeader 
        shopName={data?.shop_profile?.shop_name} 
        onEdit={() => setIsDrawerOpen(true)} 
      />

      {/* 01. BUSINESS OVERVIEW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <InfoCard 
          label="Team Members" 
          value={data?.team_summary?.active_users} 
          subValue={`Total seats: ${data?.team_summary?.total_users}`}
          icon={Users} 
          variant="lime"
          delay={1}
        />
        <InfoCard 
          label="Total Products" 
          value={data?.products?.total_products} 
          subValue="Items in Stock"
          icon={Package} 
          variant="blue"
          delay={2}
        />
        <InfoCard 
          label="Total Customers" 
          value={data?.customers?.total_customers} 
          subValue="Registered Clients"
          icon={ShoppingBag} 
          variant="slate"
          delay={3}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* 02. LEFT COLUMN: SHOP DETAILS & RECOMMENDATIONS */}
        <section className="lg:col-span-2 space-y-10">
          <div className="bg-white rounded-[3.5rem] border border-slate-100 p-10 shadow-2xl space-y-10 relative overflow-hidden group">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 flex items-center gap-3 italic">
              <Zap size={14} className="text-lime-500 fill-current" /> Shop Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
              <IdentityLine label="Business Name" value={data?.shop_profile?.shop_name} icon={<Building2 />} />
              <IdentityLine label="GST Number" value={data?.shop_profile?.gst_number || "Not Provided"} icon={<Hash />} />
              <IdentityLine label="Official Email" value={data?.shop_profile?.owner_email} icon={<Mail />} />
              <IdentityLine label="Contact Number" value={data?.shop_profile?.phone} icon={<Phone />} />
            </div>

            <div className="pt-10 border-t border-slate-50">
               <div className="flex items-start gap-6 p-8 bg-slate-50/50 rounded-[2.5rem] border border-slate-100">
                  <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center text-slate-300">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <p className="text-lg font-black text-slate-900 uppercase italic tracking-tighter">
                      {data?.shop_profile?.address_line || "No address added yet"}
                    </p>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                      {data?.shop_profile?.city || "---"}, {data?.shop_profile?.state || "---"} | {data?.shop_profile?.pincode || "------"}
                    </p>
                  </div>
               </div>
            </div>
          </div>

          {/* SMART INSIGHTS FEED */}
          <div className="bg-slate-900 rounded-[3.5rem] p-10 relative overflow-hidden shadow-2xl">
             <div className="absolute top-0 right-0 p-10 opacity-10 text-lime-500">
                <BrainCircuit size={120} />
             </div>
             <div className="flex items-center justify-between mb-8 relative z-10">
                <div className="flex items-center gap-3">
                   <div className="h-8 w-8 bg-lime-500 rounded-lg flex items-center justify-center text-slate-900">
                      <Sparkles size={18} />
                   </div>
                   <h3 className="text-lg font-black text-white uppercase italic tracking-tighter">Smart Recommendations</h3>
                </div>
             </div>

             <div className="space-y-4 relative z-10">
                {data?.ai_insights?.map((insight: string, idx: number) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + (idx * 0.1) }}
                    className="flex items-start gap-4 p-5 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 hover:border-lime-500/30 transition-all group"
                  >
                     <div className="h-2 w-2 bg-lime-500 rounded-full mt-2 group-hover:scale-125 transition-transform" />
                     <p className="text-sm font-bold text-slate-300 leading-relaxed italic">{insight}</p>
                  </motion.div>
                ))}
             </div>
          </div>
        </section>

        {/* 03. RIGHT COLUMN: OWNER & ACCOUNT SETTINGS */}
        <aside className="space-y-10">
          <div className="bg-white rounded-[3rem] border border-slate-100 p-10 shadow-xl relative overflow-hidden">
             <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 mb-8 italic">Owner Profile</h3>
             <div className="space-y-6">
                <IdentityLine label="Full Name" value={data?.owner?.name} />
                <IdentityLine label="Phone Number" value={data?.owner?.phone} />
             </div>
             <div className="mt-8 pt-8 border-t border-slate-50 flex items-center justify-between">
                <div className="px-4 py-2 bg-lime-500 text-slate-900 rounded-xl text-[10px] font-black uppercase italic">
                   {data?.subscription?.plan} Membership
                </div>
                <ShieldCheck className="text-lime-500" size={20} />
             </div>
          </div>

          {/* SETTINGS BUTTON */}
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="w-full bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl flex items-center justify-between group hover:bg-black transition-all border border-white/5"
          >
            <div className="flex items-center gap-4">
               <div className="h-12 w-12 bg-white/10 rounded-2xl flex items-center justify-center text-lime-500 group-hover:rotate-90 transition-transform duration-500">
                  <Settings2 size={24} />
               </div>
               <div className="text-left">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Preferences</p>
                  <p className="text-sm font-black uppercase italic tracking-widest text-white">Global Settings</p>
               </div>
            </div>
            <ArrowRight className="text-slate-600 group-hover:text-lime-500 group-hover:translate-x-2 transition-all" />
          </button>

          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 flex items-center justify-between shadow-lg">
            <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Currency</p>
                <p className="text-xl font-black italic text-slate-900 uppercase">{data?.settings?.currency}</p>
            </div>
            <Globe className="text-slate-200" size={28} />
          </div>
        </aside>
      </div>

      {/* DRAWERS */}
      <UpdateDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        initialData={data}
        onSuccess={() => { fetchProfile(true); setShowToast(true); }} 
      />

      <SettingsDrawer 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        initialSettings={data?.settings}
        onSuccess={() => { fetchProfile(true); setShowToast(true); }} 
      />

      <Toast 
        isVisible={showToast} 
        message="Profile details updated successfully" 
        onClose={() => setShowToast(false)} 
      />
    </motion.div>
  );
}

function IdentityLine({ label, value, icon }: any) {
  return (
    <div className="flex items-center gap-4 group">
      {icon && <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:text-lime-500 transition-colors">{icon}</div>}
      <div className="flex flex-col">
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
        <p className="text-sm font-black text-slate-900 uppercase italic tracking-tight">{value || "---"}</p>
      </div>
    </div>
  );
}