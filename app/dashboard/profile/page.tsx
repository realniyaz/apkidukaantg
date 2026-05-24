"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import { motion } from "framer-motion";
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
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
      <Loader2 className="animate-spin text-lime-500" size={32} />
      <p className="mt-4 font-bold text-slate-400 uppercase tracking-widest text-[10px] text-center">Syncing profile details...</p>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto p-4 sm:p-8 space-y-6 sm:space-y-12 pb-24 sm:pb-32 relative"
    >
      <ProfileHeader 
        shopName={data?.shop_profile?.shop_name} 
        onEdit={() => setIsDrawerOpen(true)} 
      />

      {/* 01. BUSINESS OVERVIEW STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-10">
        
        {/* 02. LEFT COLUMN: SHOP DETAILS & RECOMMENDATIONS */}
        <section className="lg:col-span-2 space-y-6 sm:space-y-10">
          <div className="bg-white rounded-[1.5rem] sm:rounded-[3.5rem] p-5 sm:p-10 border border-slate-100 shadow-md sm:shadow-2xl space-y-6 sm:space-y-10 relative overflow-hidden group">
            <h3 className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-2.5 italic">
              <Zap size={14} className="text-lime-500 fill-current" /> Company Information
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-12 relative z-10">
              <IdentityLine label="Business Name" value={data?.shop_profile?.shop_name} icon={<Building2 />} />
              <IdentityLine label="GST Number" value={data?.shop_profile?.gst_number || "Not Provided"} icon={<Hash />} />
              <IdentityLine label="Official Email" value={data?.shop_profile?.owner_email} icon={<Mail />} />
              <IdentityLine label="Contact Number" value={data?.shop_profile?.phone} icon={<Phone />} />
            </div>

            <div className="pt-6 sm:pt-10 border-t border-slate-100">
               <div className="flex items-start gap-4 sm:gap-6 p-4 sm:p-8 bg-slate-50/60 rounded-[1.2rem] sm:rounded-[2.5rem] border border-slate-100">
                  <div className="h-10 w-10 sm:h-12 sm:w-12 bg-white rounded-xl flex items-center justify-center text-slate-300 shrink-0 shadow-sm">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="text-base sm:text-lg font-bold text-slate-900 uppercase italic tracking-tight leading-snug">
                      {data?.shop_profile?.address_line || "No address added yet"}
                    </p>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">
                      {data?.shop_profile?.city || "---"}, {data?.shop_profile?.state || "---"} | {data?.shop_profile?.pincode || "------"}
                    </p>
                  </div>
               </div>
            </div>
          </div>

          {/* SMART INSIGHTS FEED */}
          <div className="bg-slate-900 rounded-[1.5rem] sm:rounded-[3.5rem] p-5 sm:p-10 relative overflow-hidden shadow-xl">
             <div className="absolute top-0 right-0 p-10 opacity-5 text-lime-500 pointer-events-none hidden sm:block">
                <BrainCircuit size={120} />
             </div>
             <div className="flex items-center justify-between mb-6 sm:mb-8 relative z-10">
                <div className="flex items-center gap-2.5">
                   <div className="h-8 w-8 bg-lime-500 rounded-lg flex items-center justify-center text-slate-900">
                      <Sparkles size={16} />
                   </div>
                   <h3 className="text-base sm:text-lg font-black text-white uppercase italic tracking-tight">Business Metrics & Insights</h3>
                </div>
             </div>

             <div className="space-y-3 sm:space-y-4 relative z-10">
                {data?.ai_insights?.map((insight: string, idx: number) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + (idx * 0.05) }}
                    className="flex items-start gap-3.5 p-4 bg-white/5 border border-white/5 rounded-xl sm:rounded-2xl hover:border-lime-500/20 transition-all group"
                  >
                     <div className="h-1.5 w-1.5 bg-lime-500 rounded-full mt-2 shrink-0 group-hover:scale-110 transition-transform" />
                     <p className="text-sm font-semibold text-slate-300 leading-relaxed italic">{insight}</p>
                  </motion.div>
                ))}
             </div>
          </div>
        </section>

        {/* 03. RIGHT COLUMN: OWNER & ACCOUNT SETTINGS */}
        <aside className="space-y-6 sm:space-y-10">
          <div className="bg-white rounded-[1.5rem] sm:rounded-[3rem] border border-slate-100 p-5 sm:p-10 shadow-sm relative overflow-hidden">
             <h3 className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-6 sm:mb-8 italic">Owner Profile</h3>
             <div className="space-y-4 sm:space-y-6">
                <IdentityLine label="Full Name" value={data?.owner?.name} />
                <IdentityLine label="Phone Number" value={data?.owner?.phone} />
             </div>
             <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-slate-100 flex items-center justify-between">
                <div className="px-3.5 py-1.5 bg-lime-500 text-slate-900 rounded-lg text-[10px] font-black uppercase italic">
                   {data?.subscription?.plan} Account tier
                </div>
                <ShieldCheck className="text-lime-600" size={20} />
             </div>
          </div>

          {/* SETTINGS BUTTON */}
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="w-full bg-slate-900 text-white p-5 sm:p-8 rounded-[1.5rem] sm:rounded-[2.5rem] shadow-xl flex items-center justify-between group hover:bg-black transition-all border border-white/5 active:scale-[0.99]"
          >
            <div className="flex items-center gap-3.5">
               <div className="h-11 w-11 bg-white/10 rounded-xl flex items-center justify-center text-lime-400 group-hover:rotate-45 transition-transform duration-300 shrink-0">
                  <Settings2 size={22} />
               </div>
               <div className="text-left">
                  <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider leading-none mb-1">Configuration</p>
                  <p className="text-sm font-black uppercase italic tracking-wider text-white">System Settings</p>
               </div>
            </div>
            <ArrowRight className="text-slate-500 group-hover:text-lime-400 group-hover:translate-x-1.5 transition-all shrink-0" size={18} />
          </button>

          <div className="bg-white rounded-[1.5rem] sm:rounded-[2.5rem] p-5 sm:p-8 border border-slate-100 flex items-center justify-between shadow-sm">
            <div className="space-y-0.5">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Base Currency</p>
                <p className="text-lg sm:text-xl font-black italic text-slate-900 uppercase tracking-tight">{data?.settings?.currency}</p>
            </div>
            <Globe className="text-slate-200 shrink-0" size={26} />
          </div>
        </aside>
      </div>

      {/* DRAWERS & DIALOGS */}
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
        message="Profile updates saved successfully" 
        onClose={() => setShowToast(false)} 
      />
    </motion.div>
  );
}

function IdentityLine({ label, value, icon }: any) {
  return (
    <div className="flex items-center gap-3.5 group">
      {icon && (
        <div className="h-9 w-9 shrink-0 rounded-lg bg-slate-50 flex items-center justify-center text-slate-300 group-hover:text-lime-500 transition-colors">
          {icon}
        </div>
      )}
      <div className="flex flex-col min-w-0">
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-0.5">{label}</p>
        <p className="text-sm font-bold text-slate-900 uppercase italic tracking-tight truncate">{value || "---"}</p>
      </div>
    </div>
  );
}