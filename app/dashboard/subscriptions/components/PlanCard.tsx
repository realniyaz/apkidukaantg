"use client";

import { Plan } from "../types";
import { Check, Zap, Loader2, ArrowUpRight } from "lucide-react";
import { apiRequest } from "@/lib/api";
import { useState } from "react";

interface OrderResponse {
  id: string; 
  amount: number;
  currency: string;
  receipt: string;
}

export default function PlanCard({ plan, isCurrent, subscription }: { plan: Plan, isCurrent: boolean, subscription: any }) {
  const [loading, setLoading] = useState(false);
  const [isYearly, setIsYearly] = useState(false);

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleAction = async () => {
    if (loading || isCurrent) return;
    setLoading(true);

    try {
      const isLoaded = await loadRazorpay();
      if (!isLoaded) throw new Error("Razorpay SDK failed to load.");

      const cycle = isYearly ? "yearly" : "monthly";
      
      // 🟢 LOGIC: Determine if this is a fresh selection or an upgrade
      // We check if subscription exists and is NOT in 'incomplete' status
      const isUpgrade = subscription && subscription.status !== 'incomplete';
      
      const subEndpoint = isUpgrade 
        ? "api/v1/subscriptions/subscriptions/upgrade" 
        : "api/v1/subscriptions/subscriptions/select-plan";

      // 🟢 PAYLOAD FIX: Backend requires 'new_plan_code' for upgrades
      const subPayload = isUpgrade
        ? { new_plan_code: plan.code, billing_cycle: cycle }
        : { plan_code: plan.code, billing_cycle: cycle };

      const subRes: any = await apiRequest(subEndpoint, {
        method: "POST",
        body: JSON.stringify(subPayload)
      });

      // 3. Create Razorpay Order
      const order = await apiRequest<OrderResponse>("api/v1/payments/payments/create-order", {
        method: "POST",
        body: JSON.stringify({ 
          invoice_id: subRes.invoice_id,
          amount: subRes.amount 
        })
      });

      // 4. Trigger Razorpay Modal
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, 
        amount: order.amount,
        currency: order.currency,
        name: "Apkidukaan",
        description: `Uplink: ${plan.name} Tier (${cycle})`,
        order_id: order.id,
        handler: async function (response: any) {
          try {
            await apiRequest("api/v1/payments/payments/verify", {
              method: "POST",
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
            window.location.reload();
          } catch (err) {
            alert("Neural Verification Failed. Contact support.");
          }
        },
        prefill: {
          name: "Niyaz Ahmed",
          email: "niyaz@apkidukaan.com",
        },
        theme: {
          color: "#0F172A",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();

    } catch (err: any) {
      alert("Neural Link Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const displayPrice = isYearly ? plan.price_yearly : plan.price_monthly;
  const isFree = displayPrice === 0;

  return (
    <div className={`bg-white border rounded-[3rem] p-10 flex flex-col justify-between transition-all duration-700 hover:shadow-2xl relative overflow-hidden group ${
      isCurrent ? 'border-lime-500 shadow-xl shadow-lime-500/10' : 'border-slate-100'
    }`}>
      
      {isCurrent && (
        <div className="absolute top-0 right-0 p-8 text-lime-500">
          <div className="bg-lime-500/10 p-2 rounded-xl"><Zap size={20} fill="currentColor" /></div>
        </div>
      )}

      <div className="space-y-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Tier: {plan.code}</span>
            {isYearly && plan.price_yearly > 0 && (
              <span className="text-[8px] font-black bg-lime-400 text-slate-900 px-2 py-0.5 rounded-full uppercase">Save 20%</span>
            )}
          </div>
          <h3 className="text-4xl font-black italic tracking-tighter uppercase text-slate-900 leading-none">{plan.name}</h3>
        </div>

        <div className="space-y-1">
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-black text-slate-900 italic tracking-tighter">
              {isFree ? "CUSTOM" : `₹${displayPrice.toLocaleString()}`}
            </span>
            {!isFree && <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">/ {isYearly ? "year" : "month"}</span>}
          </div>
        </div>

        <ul className="space-y-4 py-8 border-y border-slate-50">
          {plan.features?.map((f: string) => (
            <li key={f} className="flex items-start gap-3 text-xs font-bold text-slate-600">
              <div className="h-5 w-5 bg-slate-50 rounded-lg flex items-center justify-center text-lime-600 shrink-0 mt-0.5 group-hover:bg-lime-500 group-hover:text-white transition-colors">
                <Check size={12} strokeWidth={4} />
              </div>
              <span className="leading-tight">{f}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-10 space-y-4">
        {!isCurrent && !isFree && (
          <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
            <button onClick={() => setIsYearly(false)} className={`flex-1 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${!isYearly ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}>Monthly</button>
            <button onClick={() => setIsYearly(true)} className={`flex-1 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${isYearly ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}>Yearly</button>
          </div>
        )}

        <button
          disabled={isCurrent || loading}
          onClick={handleAction}
          className={`w-full py-5 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
            isCurrent 
            ? 'bg-slate-50 text-slate-300 border border-slate-100' 
            : 'bg-slate-900 text-white hover:bg-black active:scale-95 shadow-xl shadow-slate-900/10'
          }`}
        >
          {loading ? <Loader2 className="animate-spin" size={14} /> : isCurrent ? 'Active Node' : <>{subscription ? 'Upgrade Uplink' : 'Initialize Plan'} <ArrowUpRight size={14} /></>}
        </button>
      </div>
    </div>
  );
}