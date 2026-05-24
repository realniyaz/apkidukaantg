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
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { y: 15, opacity: 0 },
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
        const [dash, trend, top, dead, demand] = await Promise.all([
          apiRequest<any>("/analytics/dashboard"),
          apiRequest<any>("/analytics/sales-trend"),
          apiRequest<any>("/analytics/top-products"),
          apiRequest<any>("/analytics/dead-stock"),
          apiRequest<any>("/analytics/demand-prediction")
        ]);

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
      components-wrapper="true"
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="max-w-7xl mx-auto space-y-6 sm:space-y-10 p-4 sm:p-6 pb-24 sm:pb-32 text-slate-900"
    >
      {/* HEADER */}
      <motion.header variants={itemVariants} className="space-y-1.5 sm:space-y-2">
        <div className="flex items-center gap-2 text-lime-600 font-bold text-[10px] sm:text-xs uppercase tracking-wider">
          <BarChart3 size={14} /> Live Store Diagnostics
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight uppercase italic">Analytics</h1>
        <p className="text-slate-500 font-medium text-sm sm:text-base">Predictive performance models and stock health metrics.</p>
      </motion.header>

      {/* KPI GRID */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Gross Revenue"
          value={`₹${(dashboard?.total_revenue || 0).toLocaleString('en-IN')}`}
          icon={<TrendingUp size={18} />}
          color="lime"
        />
        <StatCard
          title="Total Sales"
          value={(dashboard?.total_sales || 0).toLocaleString('en-IN')}
          icon={<BarChart3 size={18} />}
          color="blue"
        />
        <StatCard
          title="Items Dispatched"
          value={(dashboard?.products_sold || 0).toLocaleString('en-IN')}
          icon={<Package size={18} />}
          color="orange"
        />
        <StatCard
          title="Stagnant Stock Items"
          value={deadStock.length}
          icon={<AlertTriangle size={18} />}
          color="red"
          isAlert={deadStock.length > 0}
        />
      </motion.div>

      {/* SALES TREND CHART */}
      <motion.div 
        variants={itemVariants} 
        className="bg-white p-4 sm:p-8 rounded-[1.5rem] sm:rounded-[2.5rem] border border-slate-100 shadow-sm"
      >
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">Revenue Momentum</h3>
            <p className="text-xs sm:text-sm text-slate-400 font-medium">Daily transaction tracking</p>
          </div>
          <div className="p-2.5 bg-slate-50 rounded-xl text-slate-400 shrink-0">
            <Calendar size={18} />
          </div>
        </div>

        {/* Prevent clip-offs on tiny mobile viewports */}
        <div className="h-[280px] sm:h-[350px] w-full -ml-4 sm:ml-0 pr-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={salesTrend} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#84CC16" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#84CC16" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#94A3B8', fontSize: 10, fontWeight: 600}} 
                dy={8}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#94A3B8', fontSize: 10, fontWeight: 600}}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="sales" 
                stroke="#84CC16" 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#colorSales)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* TOP PRODUCTS */}
        <motion.div variants={itemVariants} className="bg-white p-5 sm:p-8 rounded-[1.5rem] sm:rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 sm:mb-6 flex items-center gap-2.5">
             <span className="p-2 bg-lime-50 text-lime-600 rounded-xl shrink-0"><ArrowUpRight size={18}/></span>
             Top Performers
          </h3>
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[400px] border-separate border-spacing-0">
              <thead>
                <tr className="text-[9px] sm:text-[10px] uppercase tracking-wider font-black text-slate-400 text-left border-b border-slate-50">
                  <th className="pb-3 px-2">Item Details</th>
                  <th className="pb-3 px-2">Volume</th>
                  <th className="pb-3 px-2 text-right">Revenue Generated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 font-semibold text-slate-700">
                {topProducts.slice(0, 5).map((p: any) => (
                  <tr key={p.product_id} className="group hover:bg-slate-50/40 transition-colors">
                    <td className="py-3.5 px-2 font-bold text-slate-900 line-clamp-1">{p.product_name}</td>
                    <td className="py-3.5 px-2 text-slate-400 text-sm">{p.total_sold} units</td>
                    <td className="py-3.5 px-2 text-right font-black text-slate-900 tabular-nums">
                      ₹{(p.revenue || 0).toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* DEMAND PREDICTION */}
        <motion.div variants={itemVariants} className="bg-slate-900 p-5 sm:p-8 rounded-[1.5rem] sm:rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-lime-500/10 blur-[60px] rounded-full -mr-16 -mt-16 pointer-events-none" />
          <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 flex items-center gap-2.5 relative z-10">
             <span className="p-2 bg-white/10 text-lime-400 rounded-xl shrink-0"><Sparkles size={18}/></span>
             Demand Projection Bar
          </h3>
          <div className="space-y-3 relative z-10">
            {prediction.slice(0, 4).map((p: any) => (
              <div key={p.product_id} className="flex justify-between items-center bg-white/5 p-3.5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors gap-3">
                <span className="font-bold text-slate-300 truncate text-sm sm:text-base">{p.product_name}</span>
                <div className="flex items-center gap-2.5 shrink-0">
                   <span className="text-[9px] font-black uppercase text-lime-400 bg-lime-400/10 px-1.5 py-0.5 rounded">Forecast</span>
                   <span className="text-lg font-black tabular-nums">{p.predicted_quantity}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* DEAD STOCK RISK */}
      <motion.div variants={itemVariants} className="bg-white p-5 sm:p-8 rounded-[1.5rem] sm:rounded-[2.5rem] border border-red-100 shadow-sm">
        <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 sm:mb-6 flex items-center gap-2.5">
           <span className="p-2 bg-red-50 text-red-500 rounded-xl shrink-0"><AlertTriangle size={18}/></span>
           Stagnant Stock Audit
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {deadStock.length === 0 ? (
            <div className="col-span-full py-8 text-center bg-emerald-50/50 rounded-xl border border-emerald-100 p-4">
               <p className="text-emerald-700 font-bold text-sm flex items-center justify-center gap-2">
                 <Target size={16}/> Stock movement is healthy. No stagnant inventory found.
               </p>
            </div>
          ) : (
            deadStock.slice(0, 6).map((p: any) => (
              <div key={p.product_id} className="flex justify-between items-center p-4 bg-red-50/40 rounded-xl border border-red-100/40 gap-3">
                <span className="font-bold text-slate-700 truncate text-sm">{p.product_name}</span>
                <div className="text-right shrink-0">
                  <p className="text-[8px] font-black uppercase text-red-400 leading-none">No sales for</p>
                  <p className="text-base font-black text-red-600 tabular-nums">{p.days_without_sale} Days</p>
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
    <div className={`bg-white p-4 sm:p-5 rounded-xl sm:rounded-[2rem] border shadow-sm flex items-center justify-between hover:shadow-md transition-all ${isAlert ? 'border-red-100' : 'border-slate-100'}`}>
      <div className="flex items-center gap-3.5 min-w-0">
        <div className={`p-3 rounded-xl shrink-0 ${colors[color]}`}>{icon}</div>
        <div className="min-w-0">
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider truncate">{title}</p>
          <p className="text-xl sm:text-2xl font-black text-slate-900 tabular-nums truncate italic">{value}</p>
        </div>
      </div>
    </div>
  );
}

function CustomTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl border border-white/5 backdrop-blur-md">
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-0.5">{payload[0].payload.date}</p>
        <p className="text-base font-black text-lime-400 tabular-nums">₹{payload[0].value.toLocaleString('en-IN')}</p>
      </div>
    );
  }
  return null;
}

function AnalyticsSkeleton() {
  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6 sm:space-y-10 animate-pulse">
      <div className="h-14 bg-slate-200 rounded-xl w-2/3 sm:w-1/3" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-slate-100 rounded-xl sm:rounded-[2rem]" />)}
      </div>
      <div className="h-72 sm:h-96 bg-slate-50 rounded-xl sm:rounded-[2.5rem]" />
    </div>
  );
}