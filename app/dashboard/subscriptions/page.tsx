"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import { Loader2, Activity, Zap } from "lucide-react";
import CurrentPlan from "./components/CurrentPlan";
import PlanCard from "./components/PlanCard";
import { Subscription, Plan } from "./types";

const PLAN_FEATURES: Record<string, string[]> = {
  basic: ["Up to 5 Users", "Basic Inventory Control", "100 Invoices / mo", "Email Support"],
  growth: ["Unlimited Users", "Advanced Audit Trail", "Real-time Sync", "Priority Support"],
  enterprise: ["Multi-Tenant Support", "Custom API Nodes", "White-label Invoices", "Dedicated Manager"],
  custom: ["Infinite Scalability", "Private Cloud Node", "Custom Logic Hooks", "24/7 Neural Support"]
};

export default function SubscriptionsPage() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initNode = async () => {
      try {
        // 🟢 FIX: Paths updated to match your Swagger screenshot exactly
        // Removed trailing slashes as per your backend docs
        const [subData, plansData] = await Promise.all([
          apiRequest<Subscription>("api/v1/subscriptions/subscriptions/me").catch(() => null),    
          apiRequest<Plan[]>("api/v1/subscriptions/subscriptions/plans")       
        ]);
        
        setSubscription(subData);
        setPlans(plansData || []); 
      } catch (err: any) {
        console.error("Critical Registry Failure:", err.message);
      } finally {
        setLoading(false);
      }
    };
    initNode();
  }, []);

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#FDFDFD]">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="animate-spin text-lime-500" size={40} />
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Syncing Billing Matrix</span>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-12 pb-40">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-lime-500 animate-pulse shadow-[0_0_10px_#bef264]" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Uplink: Billing Matrix</span>
          </div>
          <h1 className="text-7xl font-black italic tracking-tighter uppercase text-slate-900 leading-none">
            Subscription <span className="text-slate-200">Vault</span>
          </h1>
        </div>
        
        {subscription && (
           <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm">
              <Activity size={14} className="text-lime-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">
                Status: {subscription.status}
              </span>
           </div>
        )}
      </header>

      <CurrentPlan subscription={subscription} />

      <div className="space-y-10">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 flex items-center gap-3">
            <Zap size={14} className="text-lime-500" /> Available Tiers
          </h2>
          <span className="h-px flex-1 bg-slate-100 ml-8 opacity-50" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.length > 0 ? (
            plans.map((plan) => (
              <PlanCard 
                key={plan.id} 
                plan={{ 
                  ...plan, 
                  features: PLAN_FEATURES[plan.code.toLowerCase()] || ["Standard Features"] 
                }} 
                isCurrent={subscription?.plan?.id === plan.id}
                subscription={subscription}
              />
            ))
          ) : (
            <div className="col-span-full py-32 text-center border-2 border-dashed border-slate-100 rounded-[4rem]">
              <div className="h-16 w-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100">
                <Zap size={24} className="text-slate-200" />
              </div>
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">No Registry Nodes Found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}