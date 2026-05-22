"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Package,
  AlertTriangle,
  BarChart3,
  Loader2,
  Calendar,
  Sparkles,
  ArrowUpRight,
  Target
} from "lucide-react";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

/* ------------------------------------------------ */
/* ANIMATION VARIANTS */
/* ------------------------------------------------ */

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
};

export default function AnalyticsPage() {
  const [dashboard, setDashboard] = useState<any>(null);
  const [salesTrend, setSalesTrend] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [deadStock, setDeadStock] = useState<any[]>([]);
  const [prediction, setPrediction] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // Fetching all data in parallel
        const [dash, trend, top, dead, demand] = await Promise.all([
          apiRequest<any>("/analytics/dashboard"),
          apiRequest<any>("/analytics/sales-trend"),
          apiRequest<any>("/analytics/top-products"),
          apiRequest<any>("/analytics/dead-stock"),
          apiRequest<any>("/analytics/demand-prediction")
        ]);

        // Fix: Added safety checks to ensure we are setting arrays
        setDashboard(dash || {});
        setSalesTrend(Array.isArray(trend) ? trend : trend?.data || []);
        setTopProducts(Array.isArray(top) ? top : top?.data || []);
        setDeadStock(Array.isArray(dead) ? dead : dead?.data || []);
        setPrediction(Array.isArray(demand) ? demand : demand?.data || []);

      } catch (err) {
        console.error("Analytics fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <AnalyticsSkeleton />;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="max-w-7xl mx-auto space-y-10 p-6 pb-20"
    >
      {/* HEADER */}
      <motion.header variants={itemVariants} className="space-y-2">
        <div className="flex items-center gap-2 text-lime-600 font-bold text-xs uppercase tracking-[0.2em]">
          <BarChart3 size={14} /> Performance Intelligence
        </div>
        <h1 className="text-5xl font-black text-slate-900 tracking-tight">Analytics</h1>
        <p className="text-slate-500 font-medium">Predictive insights and stock health monitoring.</p>
      </motion.header>

      {/* KPI GRID */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Gross Revenue"
          value={`₹${(dashboard?.total_revenue || 0).toLocaleString()}`}
          icon={<TrendingUp size={20} />}
          color="lime"
        />
        <StatCard
          title="Total Sales"
          value={dashboard?.total_sales || 0}
          icon={<BarChart3 size={20} />}
          color="blue"
        />
        <StatCard
          title="Products Sold"
          value={dashboard?.products_sold || 0}
          icon={<Package size={20} />}
          color="orange"
        />
        <StatCard
          title="Inventory Risks"
          value={deadStock.length}
          icon={<AlertTriangle size={20} />}
          color="red"
          isAlert={deadStock.length > 0}
        />
      </motion.div>

      {/* SALES TREND CHART */}
      <motion.div 
        variants={itemVariants} 
        className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40"
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Revenue Velocity</h3>
            <p className="text-sm text-slate-400 font-medium">Daily performance tracking</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-2xl text-slate-400">
            <Calendar size={20} />
          </div>
        </div>

        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={salesTrend}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#84CC16" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#84CC16" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#94A3B8', fontSize: 12, fontWeight: 600}} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#94A3B8', fontSize: 12, fontWeight: 600}}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="sales" 
                stroke="#84CC16" 
                strokeWidth={4} 
                fillOpacity={1} 
                fill="url(#colorSales)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* TOP PRODUCTS */}
        <motion.div variants={itemVariants} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
             <span className="p-2 bg-lime-50 text-lime-600 rounded-xl"><ArrowUpRight size={20}/></span>
             Top Performance
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-[10px] uppercase tracking-widest font-black text-slate-400 text-left border-b border-slate-50">
                  <th className="pb-4">Product</th>
                  <th className="pb-4">Sold</th>
                  <th className="pb-4 text-right">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {topProducts.slice(0, 5).map((p: any) => (
                  <tr key={p.product_id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 font-bold text-slate-700">{p.product_name}</td>
                    <td className="py-4 text-slate-500 font-semibold">{p.total_sold} units</td>
                    <td className="py-4 text-right font-black text-slate-900 tabular-nums">
                      ₹{(p.revenue || 0).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* DEMAND PREDICTION */}
        <motion.div variants={itemVariants} className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-lime-500/10 blur-[60px] rounded-full -mr-16 -mt-16" />
          <h3 className="text-xl font-bold mb-6 flex items-center gap-3 relative z-10">
             <span className="p-2 bg-white/10 text-lime-400 rounded-xl"><Sparkles size={20}/></span>
             Demand Forecast
          </h3>
          <div className="space-y-4 relative z-10">
            {prediction.slice(0, 4).map((p: any) => (
              <div key={p.product_id} className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                <span className="font-bold text-slate-300">{p.product_name}</span>
                <div className="flex items-center gap-3">
                   <span className="text-xs font-black uppercase text-lime-400">Predicted</span>
                   <span className="text-xl font-black">{p.predicted_quantity}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* DEAD STOCK RISK */}
      <motion.div variants={itemVariants} className="bg-white p-8 rounded-[2.5rem] border border-red-100 shadow-sm">
        <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
           <span className="p-2 bg-red-50 text-red-500 rounded-xl"><AlertTriangle size={20}/></span>
           Dead Stock Monitor
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {deadStock.length === 0 ? (
            <div className="col-span-full py-10 text-center bg-emerald-50 rounded-3xl border border-emerald-100">
               <p className="text-emerald-700 font-black flex items-center justify-center gap-2">
                 <Target size={18}/> Inventory health is optimal. No stagnation detected.
               </p>
            </div>
          ) : (
            deadStock.slice(0, 6).map((p: any) => (
              <div key={p.product_id} className="flex justify-between items-center p-5 bg-red-50/30 rounded-2xl border border-red-100/50">
                <span className="font-bold text-slate-700 truncate mr-2">{p.product_name}</span>
                <div className="text-right shrink-0">
                  <p className="text-[10px] font-black uppercase text-red-400 leading-none">Idle for</p>
                  <p className="text-lg font-black text-red-600 tabular-nums">{p.days_without_sale} Days</p>
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ------------------------------------------------ */
/* SUB-COMPONENTS */
/* ------------------------------------------------ */

function StatCard({ title, value, icon, color, isAlert }: any) {
  const colors: any = {
    lime: "bg-lime-500/10 text-lime-600",
    blue: "bg-blue-500/10 text-blue-600",
    orange: "bg-orange-500/10 text-orange-600",
    red: "bg-red-500/10 text-red-600",
  };

  return (
    <div className={`bg-white p-6 rounded-[2rem] border shadow-sm flex items-center justify-between hover:shadow-xl transition-all ${isAlert ? 'border-red-100' : 'border-slate-100'}`}>
      <div className="flex items-center gap-4">
        <div className={`p-4 rounded-2xl ${colors[color]}`}>{icon}</div>
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</p>
          <p className="text-2xl font-black text-slate-900 tabular-nums">{value}</p>
        </div>
      </div>
    </div>
  );
}

function CustomTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-white/10 backdrop-blur-md">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{payload[0].payload.date}</p>
        <p className="text-lg font-black text-lime-400">₹{payload[0].value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
}

function AnalyticsSkeleton() {
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-10 animate-pulse">
      <div className="h-20 w-80 bg-slate-200 rounded-3xl" />
      <div className="grid grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-slate-100 rounded-[2rem]" />)}
      </div>
      <div className="h-96 bg-slate-50 rounded-[2.5rem]" />
    </div>
  );
}