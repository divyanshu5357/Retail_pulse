import React, { useEffect, useState } from 'react';
import { Search, Tag, AlertTriangle, TrendingUp, Package, ArrowUpDown } from 'lucide-react';
import { fetchProducts, formatINR, formatNumber } from '../services/api';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const loadProducts = () => {
    setLoading(true);
    fetchProducts({ category: categoryFilter, search })
      .then((data) => setProducts(data.products || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProducts();
  }, [categoryFilter, search]);

  const categories = ['All', 'Electronics', 'Fashion', 'Home & Living', 'Groceries', 'Sports'];
  const lowSalesCount = products.filter((p) => p.is_low_sales).length;
  const totalCatalogRevenue = products.reduce((sum, p) => sum + p.total_revenue, 0);

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs text-slate-500 font-semibold uppercase">Total Catalog Items</p>
          <p className="text-xl font-bold text-slate-900 mt-1">{products.length} Products</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Across 5 retail categories</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs text-slate-500 font-semibold uppercase">Total Catalog Revenue</p>
          <p className="text-xl font-bold text-blue-600 mt-1">{formatINR(totalCatalogRevenue)}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Sum of all net product sales</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-amber-200 bg-amber-50/20 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs text-amber-700 font-semibold uppercase">Low Sales Attention Alert</p>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-xl font-bold text-amber-700 mt-1">{lowSalesCount} Items (&lt;10 Units)</p>
          <p className="text-[11px] text-amber-600 mt-0.5">Replenishment or markdown review required</p>
        </div>
      </div>

      {/* Search & Category Filter */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by product name or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900"
          />
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <Tag className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-500 font-medium">Category:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-slate-800 font-semibold focus:ring-0 cursor-pointer"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="px-5 py-3">Rank</th>
                <th className="px-5 py-3">Product Name</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Unit Price (₹)</th>
                <th className="px-5 py-3">Cost Price (₹)</th>
                <th className="px-5 py-3">Units Sold</th>
                <th className="px-5 py-3">Net Revenue (₹)</th>
                <th className="px-5 py-3">Net Profit (₹)</th>
                <th className="px-5 py-3">Margin %</th>
                <th className="px-5 py-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={10} className="px-6 py-10 text-center text-slate-500">
                    Loading product catalog...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-6 py-10 text-center text-slate-500">
                    No products found matching filters.
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr
                    key={p.product_id}
                    className={`hover:bg-slate-50/80 transition-colors ${
                      p.is_low_sales ? 'bg-amber-50/20' : ''
                    }`}
                  >
                    <td className="px-5 py-3.5 font-bold">
                      <span
                        className={`w-6 h-6 rounded-md inline-flex items-center justify-center text-xs ${
                          p.rank <= 3
                            ? 'bg-amber-100 text-amber-800 font-extrabold'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        #{p.rank}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-bold text-slate-900">{p.product_name}</td>
                    <td className="px-5 py-3.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-700 font-medium">
                        {p.category}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-slate-800">{formatINR(p.unit_price)}</td>
                    <td className="px-5 py-3.5 text-slate-500">{formatINR(p.cost_price)}</td>
                    <td className="px-5 py-3.5">
                      <span className={`font-bold ${p.units_sold < 10 ? 'text-amber-600' : 'text-slate-800'}`}>
                        {formatNumber(p.units_sold)}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-bold text-slate-900">{formatINR(p.total_revenue)}</td>
                    <td className="px-5 py-3.5 font-bold text-emerald-600">{formatINR(p.total_profit)}</td>
                    <td className="px-5 py-3.5">
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full font-bold border border-emerald-200">
                        {p.margin_pct}%
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      {p.is_low_sales ? (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-[10px] font-semibold">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Low Sales</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[10px] font-semibold">
                          <span>Active</span>
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
