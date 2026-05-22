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

  if (loading) return <ProductsSkeleton />;

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 pb-32"
    >
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-lime-500 animate-pulse shadow-[0_0_10px_#bef264]" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Live Product Manager</span>
          </div>
          <h1 className="text-6xl font-black tracking-tighter italic uppercase leading-none text-slate-900">
            Product <span className="text-slate-200">Catalog</span>
          </h1>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button 
            onClick={() => fetchData(true)} 
            title="Refresh List"
            className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:text-lime-600 transition-all active:scale-90"
          >
            <RefreshCw size={20} className={refreshing ? "animate-spin text-lime-500" : "text-slate-400"} />
          </button>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="flex-1 md:flex-none flex items-center justify-center gap-3 bg-slate-900 hover:bg-black text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all"
          >
            <Plus size={18} /> Add New Product
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <InventoryStat 
          label="Total Stock Value" 
          value={`₹${Math.round(dashboardData.reduce((acc, curr) => acc + (curr.stock_value || 0), 0)).toLocaleString('en-IN')}`} 
          icon={<Zap size={22} />} 
          sub="Estimated Inventory Worth"
        />
        <InventoryStat 
          label="Low Stock Items" 
          value={dashboardData.filter(i => i.low_stock_warning).length} 
          icon={<AlertTriangle size={22} />} 
          color="red"
          sub="Items needing restock"
        />
        <InventoryStat 
          label="Items in Catalog" 
          value={products.length} 
          icon={<Boxes size={22} />} 
          sub="Total unique products"
        />
      </div>

      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 flex items-center gap-4 px-8 bg-white border border-slate-100 rounded-[2rem] shadow-sm focus-within:border-slate-900 transition-all">
            <Search size={18} className="text-slate-300" />
            <input 
              type="text" 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by product name or SKU..." 
              className="bg-transparent py-6 outline-none text-sm w-full font-bold text-slate-700 placeholder:text-slate-300 italic"
            />
          </div>
          <div className="flex items-center gap-2 px-4 bg-slate-50 rounded-[1.5rem] border border-slate-100 overflow-x-auto no-scrollbar max-w-md">
            {categories.map((cat) => (
              <button 
                key={cat} onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                  selectedCategory === cat ? "bg-slate-900 text-lime-400 shadow-lg" : "text-slate-400 hover:text-slate-900"
                }`}
              >
                {cat.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)] overflow-hidden">
          <table className="w-full border-separate border-spacing-0">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-10 py-5 text-left text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Product Details</th>
                <th className="px-10 py-5 text-center text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Current Stock</th>
                <th className="px-10 py-5 text-center text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Selling Price</th>
                <th className="px-10 py-5 text-right text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 font-bold">
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((p, idx) => (
                  <motion.tr 
                    layout
                    key={p.id || p.public_id} 
                    initial={{ opacity: 0, y: 5 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0 }} 
                    transition={{ delay: idx * 0.01 }}
                    className="group hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-5">
                        <div className="h-12 w-12 rounded-2xl bg-slate-900 flex items-center justify-center text-lime-400 shadow-lg group-hover:rotate-6 transition-transform">
                          <Package size={20} />
                        </div>
                        <div>
                          <p className="text-sm text-slate-900 uppercase italic tracking-tighter">{p.name}</p>
                          <p className="text-[9px] text-slate-400 uppercase tracking-widest mt-1 font-mono">
                            SKU: {p.sku || "N/A"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-6 text-center">
                      <div className="flex flex-col items-center">
                         <span className={`text-lg font-black tabular-nums ${p.available_stock <= (p.low_stock_threshold || 5) ? 'text-red-600' : 'text-slate-900'}`}>
                          {p.available_stock}
                         </span>
                         <span className="text-[8px] text-slate-400 uppercase tracking-widest mt-0.5">Units Available</span>
                      </div>
                    </td>
                    <td className="px-10 py-6 text-center">
                      <p className="text-sm font-black text-slate-900 tabular-nums italic">
                        ₹{Number(p.selling_price || p.default_selling_price).toLocaleString()}
                      </p>
                    </td>
                    <td className="px-10 py-6 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {/* FIX: Move 'title' from the Activity icon to the button parent */}
                         <button 
                            onClick={() => setEditingProduct(p)} 
                            title="Edit Product"
                            className="h-10 w-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-900 transition-all shadow-sm active:scale-90"
                         >
                            <Activity size={16} />
                         </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          
          {filteredProducts.length === 0 && (
             <div className="py-20 text-center text-slate-400 italic">
               No products found matching your search.
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
    <div className="bg-white p-8 rounded-[3rem] border border-slate-100 flex items-center justify-between group hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
      <div className="flex items-center gap-6">
        <div className={`h-14 w-14 rounded-[1.5rem] flex items-center justify-center transition-all ${color === 'red' ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-900 text-lime-400'}`}>
          {icon}
        </div>
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{label}</p>
          <p className={`text-4xl font-black tabular-nums tracking-tighter italic ${color === 'red' ? 'text-red-600' : 'text-slate-900'}`}>{value}</p>
          <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">{sub}</p>
        </div>
      </div>
      <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-300 group-hover:bg-slate-900 group-hover:text-white transition-all">
        <ArrowUpRight size={18} />
      </div>
    </div>
  );
}

function ProductsSkeleton() {
  return (
    <div className="max-w-7xl mx-auto p-8 space-y-10 animate-pulse">
      <div className="h-16 w-1/3 bg-slate-100 rounded-2xl" />
      <div className="grid grid-cols-3 gap-8">{[1, 2, 3].map(i => <div key={i} className="h-48 bg-slate-50 rounded-[3rem]" />)}</div>
      <div className="h-[600px] bg-slate-50 rounded-[4rem]" />
    </div>
  );
}