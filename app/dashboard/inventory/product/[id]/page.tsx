"use client";

import React, { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import { motion } from "framer-motion";
import { 
  TrendingUp, Layers, CalendarDays, AlertTriangle, 
  Package, ShoppingBag, Loader2 
} from "lucide-react";

interface AnalyticsData {
  current_stock: number;
  average_daily_sales: number;
  days_of_stock_remaining: number;
  classification: string;
  reorder_recommended: boolean;
  suggested_reorder_quantity: number;
}

export default function ProductAnalytics({ params }: { params: Promise<{ id: string }> }) {
  // Safe React.use() unwrap for async Next.js 15 parameters
  const unwrappedParams = React.use(params);
  const productId = unwrappedParams.id;

  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    apiRequest<AnalyticsData>(`/inventory/${productId}/analytics`)
      .then((data) => {
        if (data) setAnalytics(data);
      })
      .catch((err) => console.error("Failed to load inventory performance insight metrics:", err))
      .finally(() => setLoading(false));
  }, [productId]);

  if (loading || !analytics) {
    return (
      <div className="min-h-[40vh] flex flex-col items-center justify-center p-6">
        <Loader2 className="animate-spin text-lime-500" size={32} />
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mt-4 animate-pulse">
          Analyzing inventory metrics...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto text-slate-900 p-1">
      {/* HEADER ROW */}
      <div className="flex items-center gap-3.5 pb-2 border-b border-slate-100">
        <div className="p-2.5 bg-slate-900 rounded-xl text-white shadow-md shrink-0">
          <TrendingUp size={20} />
        </div>
        <div>
          <h1 className="text-xl sm:text-3xl font-black tracking-tight uppercase italic leading-none">
            Product Performance Insights
          </h1>
          <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1.5">
            Predictive demand & velocity metrics
          </p>
        </div>
      </div>

      {/* METRICS DASHBOARD GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <InternalAnalyticsCard 
          label="Available Stock" 
          value={`${analytics.current_stock.toLocaleString('en-IN')} Units`} 
          icon={Package} 
          variant="slate"
          delay={0}
        />
        <InternalAnalyticsCard 
          label="Daily Sales Velocity" 
          value={`${analytics.average_daily_sales.toLocaleString('en-IN', { maximumFractionDigits: 1 })} / Day`} 
          icon={ShoppingBag} 
          variant="blue"
          delay={1}
        />
        <InternalAnalyticsCard 
          label="Estimated Stock Runout" 
          value={`${analytics.days_of_stock_remaining} Days`} 
          subValue={analytics.days_of_stock_remaining < 15 ? "Critical runway window" : "Healthy buffer stock"}
          icon={CalendarDays} 
          variant={analytics.days_of_stock_remaining < 15 ? "lime" : "slate"}
          delay={2}
        />
        <InternalAnalyticsCard 
          label="Inventory Turnover Rank" 
          value={analytics.classification || "Class C"} 
          subValue="Based on velocity patterns"
          icon={Layers} 
          variant="slate"
          delay={3}
        />
        <InternalAnalyticsCard 
          label="Restock Required" 
          value={analytics.reorder_recommended ? "Required" : "Stocked"} 
          icon={AlertTriangle} 
          variant={analytics.reorder_recommended ? "lime" : "slate"}
          delay={4}
        />
        <InternalAnalyticsCard 
          label="Suggested Order Size" 
          value={`${analytics.suggested_reorder_quantity.toLocaleString('en-IN')} Units`} 
          subValue="Optimal replenishment target"
          icon={Package} 
          variant={analytics.reorder_recommended ? "blue" : "slate"}
          delay={5}
        />
      </div>
    </div>
  );
}

/* --- INTERNAL ISOLATED CARD UI --- */
interface InternalCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  variant?: "lime" | "blue" | "slate";
  delay?: number;
}

function InternalAnalyticsCard({ label, value, subValue, icon: Icon, variant = "slate", delay = 0 }: InternalCardProps) {
  const themes = {
    lime: "bg-lime-50 text-lime-600 border-lime-100/70",
    blue: "bg-blue-50 text-blue-600 border-blue-100/70",
    slate: "bg-slate-50 text-slate-400 border-slate-100/70",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.04, duration: 0.3, ease: "easeOut" }}
      className="bg-white rounded-xl sm:rounded-[2rem] p-4 sm:p-6 border border-slate-100 shadow-sm flex items-center gap-4 sm:gap-6 group hover:shadow-md hover:border-slate-200 transition-all duration-300 w-full min-w-0"
    >
      <div className={`h-12 w-12 sm:h-16 sm:w-16 shrink-0 rounded-xl sm:rounded-[1.25rem] flex items-center justify-center border transition-transform duration-300 group-hover:scale-105 ${themes[variant]}`}>
        <Icon size={20} className="sm:h-6 sm:w-6" />
      </div>

      <div className="flex flex-col min-w-0 flex-1">
        <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-slate-400 mb-0.5 sm:mb-1 truncate italic">
          {label}
        </p>
        <p className="text-xl sm:text-2xl font-black text-slate-900 uppercase italic tracking-tight truncate leading-none">
          {value || "---"}
        </p>
        {subValue && (
          <p className="text-[9px] sm:text-[10px] font-semibold text-slate-400 uppercase tracking-wide mt-1 truncate">
            {subValue}
          </p>
        )}
      </div>

      <div className="hidden sm:block ml-auto opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        <div className="h-1.5 w-1.5 bg-slate-200 rounded-full" />
      </div>
    </motion.div>
  );
}