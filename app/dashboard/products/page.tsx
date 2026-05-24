"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { apiRequest } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Package, AlertTriangle, Plus, Loader2,
  Search, RefreshCw, Zap, Activity, Boxes, ArrowUpRight
} from "lucide-react";

// Component Imports
import CreateProductModal from "./components/CreateProductModal";
import EditProductModal from "./components/EditProductModal";

export default function ProductsPage() {
  const [dashboardData, setDashboardData] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All Categories");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);

  const fetchData = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    if (silent) setRefreshing(true);
    try {
      const ts = Date.now(); 
      const [dash, prods] = await Promise.all([
        apiRequest<any[]>(`products/dashboard?t=${ts}`),
        apiRequest<any[]>(`products/?t=${ts}`) 
      ]);
      setDashboardData(dash || []);
      setProducts(prods || []);
    } catch (err) {
      console.error("Failed to load products:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSuccess = useCallback(() => {
    setTimeout(() => {
      fetchData(true);
    }, 400);
  }, [fetchData]);

  const categories = useMemo(() => {
    const unique = new Set(products.map(p => p.category?.name || p.category_name).filter(Boolean));
    return ["All Categories", ...Array.from(unique)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const name = product.name?.toLowerCase() || "";
      const matchesSearch = name.includes(searchQuery.toLowerCase()) || 
                            (product.sku || "").toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All Categories" || 
                              (product.category?.name || product.category_name) === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  if (loading) return <ProductsPageSkeleton />;

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="max-w-7xl mx-auto p-4 sm:p-8 space-y-6 sm:space-y-8 pb-24 sm:pb-32"
    >
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 sm:gap-6">
        <div className="space-y-1.5 sm:space-y-2">
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-lime-500 animate-pulse shadow-[0_0_8px_#bef264]" />
            <span className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-wider">Catalog Assistant Live</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tighter italic uppercase leading-none text-slate-900">
            Product <span className="text-slate-400">Catalog</span>
          </h1>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto pt-1 md:pt-0">
          <button 
            onClick={() => fetchData(true)} 
            disabled={refreshing}
            title="Refresh List"
            className="p-3.5 sm:p-4 bg-white border border-slate-100 rounded-xl sm:rounded-2xl shadow-sm hover:text-lime-600 transition-all active:scale-95 shrink-0"
          >
            <RefreshCw size={18} className={refreshing ? "animate-spin text-lime-500" : "text-slate-400"} />
          </button>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-slate-900 hover:bg-black text-white px-5 sm:px-8 h-11 sm:h-12 rounded-xl sm:rounded-2xl font-black text-xs uppercase tracking-wider shadow-lg active:scale-95 transition-all"
          >
            <Plus size={16} /> Add Product
          </button>
        </div>
      </header>

      {/* STATS TILES MATRIX */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <InventoryStat 
          label="Total Inventory Value" 
          value={`₹${Math.round(dashboardData.reduce((acc, curr) => acc + (curr.stock_value || 0), 0)).toLocaleString('en-IN')}`} 
          icon={<Zap size={20} />} 
          sub="Estimated inventory valuation"
        />
        <InventoryStat 
          label="Low Stock Alerts" 
          value={dashboardData.filter(i => i.low_stock_warning).length} 
          icon={<AlertTriangle size={20} />} 
          color="red"
          sub="Items needing immediate restock"
        />
        <InventoryStat 
          label="Unique Products" 
          value={products.length} 
          icon={<Boxes size={20} />} 
          sub="Total items listed in system"
        />
      </div>

      {/* SEARCH AND FILTERS */}
      <div className="space-y-4">
        <div className="flex flex-col lg:flex-row gap-3 sm:gap-4">
          <div className="flex-1 flex items-center gap-3 px-4 sm:px-6 bg-white border border-slate-100 rounded-xl sm:rounded-2xl shadow-sm focus-within:border-slate-400 transition-all">
            <Search size={18} className="text-slate-300 shrink-0" />
            <input 
              type="text" 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by product name or SKU..." 
              className="bg-transparent py-4 sm:py-5 outline-none text-sm w-full font-semibold text-slate-700 placeholder:text-slate-300"
            />
          </div>
          
          {/* Categories Pill Bar - Horizontal Scrolling on Mobile */}
          <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl sm:rounded-2xl border border-slate-100 overflow-x-auto no-scrollbar max-w-full lg:max-w-md">
            {categories.map((cat) => (
              <button 
                key={cat} onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all ${
                  selectedCategory === cat ? "bg-slate-900 text-lime-400 shadow-md" : "text-slate-400 hover:text-slate-900"
                }`}
              >
                {cat.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>

        {/* DATA CONTAINER TABLE CONTAINER */}
        <div className="bg-white rounded-[1.5rem] sm:rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="w-full overflow-x-auto">
            <table className="w-full border-separate border-spacing-0 min-w-[600px]">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-6 sm:px-10 py-4 text-left text-[9px] font-black uppercase tracking-wider text-slate-400">Product Details</th>
                  <th className="px-6 sm:px-10 py-4 text-center text-[9px] font-black uppercase tracking-wider text-slate-400">Available Stock</th>
                  <th className="px-6 sm:px-10 py-4 text-center text-[9px] font-black uppercase tracking-wider text-slate-400">Retail Price</th>
                  <th className="px-6 sm:px-10 py-4 text-right text-[9px] font-black uppercase tracking-wider text-slate-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 font-semibold text-slate-700">
                <AnimatePresence mode="popLayout">
                  {filteredProducts.map((p, idx) => (
                    <motion.tr 
                      layout
                      key={p.id || p.public_id} 
                      initial={{ opacity: 0, y: 5 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      exit={{ opacity: 0 }} 
                      transition={{ delay: idx * 0.01 }}
                      className="group hover:bg-slate-50/40 transition-colors"
                    >
                      <td className="px-6 sm:px-10 py-4 sm:py-5">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 sm:h-12 sm:w-12 shrink-0 rounded-xl sm:rounded-2xl bg-slate-900 flex items-center justify-center text-lime-400 shadow-md">
                            <Package size={18} />
                          </div>
                          <div>
                            <p className="text-sm text-slate-900 font-bold uppercase italic tracking-tight line-clamp-1">{p.name}</p>
                            <p className="text-[9px] text-slate-400 uppercase tracking-wider mt-0.5 font-mono">
                              SKU: {p.sku || "N/A"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 sm:px-10 py-4 sm:py-5 text-center">
                        <div className="flex flex-col items-center">
                           <span className={`text-base sm:text-lg font-black tabular-nums ${p.available_stock <= (p.low_stock_threshold || 5) ? 'text-red-600' : 'text-slate-900'}`}>
                            {p.available_stock}
                           </span>
                           <span className="text-[8px] text-slate-400 uppercase tracking-widest mt-0.5">Units</span>
                        </div>
                      </td>
                      <td className="px-6 sm:px-10 py-4 sm:py-5 text-center">
                        <p className="text-sm font-black text-slate-900 tabular-nums italic">
                          ₹{Number(p.selling_price || p.default_selling_price).toLocaleString('en-IN')}
                        </p>
                      </td>
                      <td className="px-6 sm:px-10 py-4 sm:py-5 text-right">
                        {/* Mobile optimization: Action buttons are permanently visible on touch targets, instead of using hover states */}
                        <div className="flex justify-end gap-2 md:opacity-0 group-hover:opacity-100 transition-opacity">
                           <button 
                              onClick={() => setEditingProduct(p)} 
                              title="Edit Product"
                              className="h-9 w-9 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-900 transition-all active:scale-95"
                           >
                              <Activity size={14} />
                           </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
          
          {filteredProducts.length === 0 && (
             <div className="py-16 text-center text-slate-400 text-sm font-medium italic">
               No products found matching your criteria.
             </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showCreateModal && (
          <CreateProductModal 
            onClose={() => setShowCreateModal(false)} 
            onSuccess={handleSuccess} 
          />
        )}
        {editingProduct && (
          <EditProductModal 
            product={editingProduct} 
            onClose={() => setEditingProduct(null)} 
            onSuccess={handleSuccess} 
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// --- SUB COMPONENTS ---

function InventoryStat({ label, value, icon, sub, color = "lime" }: any) {
  return (
    <div className="bg-white p-5 sm:p-8 rounded-[1.5rem] sm:rounded-[3rem] border border-slate-100 flex items-center justify-between group hover:shadow-md transition-all duration-300 relative overflow-hidden">
      <div className="flex items-center gap-4 sm:gap-6">
        <div className={`h-12 w-12 sm:h-14 sm:w-14 shrink-0 rounded-xl sm:rounded-[1.5rem] flex items-center justify-center transition-all ${color === 'red' ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-900 text-lime-400'}`}>
          {icon}
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">{label}</p>
          <p className={`text-2xl sm:text-4xl font-black tabular-nums tracking-tighter italic ${color === 'red' ? 'text-red-600' : 'text-slate-900'}`}>{value}</p>
          <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">{sub}</p>
        </div>
      </div>
      <div className="h-8 w-8 sm:h-10 sm:w-10 bg-slate-50 rounded-lg sm:rounded-xl flex items-center justify-center text-slate-300 group-hover:bg-slate-900 group-hover:text-white transition-all shrink-0">
        <ArrowUpRight size={16} />
      </div>
    </div>
  );
}

function ProductsPageSkeleton() {
  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-8 space-y-6 sm:space-y-10 animate-pulse">
      <div className="h-12 w-1/3 bg-slate-100 rounded-xl" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8">
        {[1, 2, 3].map(i => <div key={i} className="h-32 sm:h-48 bg-slate-50 rounded-2xl sm:rounded-[3rem]" />)}
      </div>
      <div className="h-[400px] sm:h-[600px] bg-slate-50 rounded-2xl sm:rounded-[4rem]" />
    </div>
  );
}