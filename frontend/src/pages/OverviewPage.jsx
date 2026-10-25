import React, { useEffect, useState } from 'react';
import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Activity,
  UserX,
  TrendingUp,
  PieChart as PieIcon,
  BarChart2,
  Calendar,
  AlertCircle
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import KPICard from '../components/KPICard';
import FilterBar from '../components/FilterBar';
import {
  fetchDashboardKPIs,
  fetchDashboardCharts,
  fetchFilterOptions,
  formatINR,
  formatNumber
} from '../services/api';

const COLORS = ['#2563eb', '#0d9488', '#f59e0b', '#8b5cf6', '#ec4899', '#64748b'];
const STATUS_COLORS = {
  Delivered: '#10b981',
  Shipped: '#3b82f6',
  Processing: '#f59e0b',
  Cancelled: '#ef4444'
};

export default function OverviewPage({ setActivePage }) {
  const [kpis, setKpis] = useState(null);
  const [charts, setCharts] = useState(null);
  const [filterOptions, setFilterOptions] = useState(null);
  const [filters, setFilters] = useState({
    start_date: '',
    end_date: '',
    region: 'All',
    category: 'All'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFilterOptions()
      .then((opts) => {
        setFilterOptions(opts);
        setFilters((prev) => ({
          ...prev,
          start_date: opts.min_date,
          end_date: opts.max_date
        }));
      })
      .catch((err) => console.error('Filter options error:', err));
  }, []);

  const loadData = () => {
    setLoading(true);
    setError(null);
    Promise.all([fetchDashboardKPIs(filters), fetchDashboardCharts(filters)])
      .then(([kpiData, chartData]) => {
        setKpis(kpiData);
        setCharts(chartData);
      })
      .catch((err) => {
        console.error('Overview data error:', err);
        setError('Failed to load dashboard metrics. Ensure backend server is running on port 5001.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, [filters]);

  const handleResetFilters = () => {
    if (filterOptions) {
      setFilters({
        start_date: filterOptions.min_date,
        end_date: filterOptions.max_date,
        region: 'All',
        category: 'All'
      });
    }
  };

  if (loading && !kpis) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-3">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-slate-500 font-medium">Calculating retail financial metrics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 flex items-start space-x-3">
        <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-semibold text-sm">Dashboard Connection Error</h4>
          <p className="text-xs mt-1 text-rose-700">{error}</p>
          <button
            onClick={loadData}
            className="mt-3 px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters Bar */}
      <FilterBar
        filters={filters}
        setFilters={setFilters}
        filterOptions={filterOptions}
        onReset={handleResetFilters}
      />

      {/* 6 KPI Cards (Requirement 3) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <KPICard
          title="Total Revenue"
          value={formatINR(kpis?.total_revenue)}
          subtext={`Net Profit: ${formatINR(kpis?.total_profit)}`}
          icon={DollarSign}
          badge={`${kpis?.profit_margin_pct}% Margin`}
          color="blue"
        />
        <KPICard
          title="Total Orders"
          value={formatNumber(kpis?.total_orders)}
          subtext="Fulfilled orders count"
          icon={ShoppingCart}
          badge="Live"
          color="indigo"
        />
        <KPICard
          title="Total Customers"
          value={formatNumber(kpis?.total_customers)}
          subtext="Registered customer base"
          icon={Users}
          color="emerald"
        />
        <KPICard
          title="Total Products"
          value={formatNumber(kpis?.total_products)}
          subtext="Catalog items across 5 categories"
          icon={Package}
          color="slate"
        />
        <KPICard
          title="Average Order Value"
          value={formatINR(kpis?.average_order_value)}
          subtext="AOV per completed order"
          icon={Activity}
          badge="AOV"
          color="amber"
        />
        <div
          onClick={() => setActivePage('customers')}
          className="cursor-pointer transition-transform hover:scale-[1.02]"
        >
          <KPICard
            title="Inactive Customers"
            value={formatNumber(kpis?.inactive_customers)}
            subtext="0 lifetime purchases"
            icon={UserX}
            badge="Action Needed"
            color="rose"
          />
        </div>
      </div>

      {/* Row 1 Charts: Monthly Trend & Category Revenue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Trend Area Chart (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Monthly Sales & Profit Trajectory</h3>
              <p className="text-xs text-slate-500">12-month net revenue vs net profit velocity (₹ INR)</p>
            </div>
            <div className="flex items-center space-x-3 text-xs">
              <span className="flex items-center space-x-1">
                <span className="w-3 h-3 rounded-full bg-blue-600 inline-block" />
                <span className="text-slate-600">Revenue</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                <span className="text-slate-600">Profit</span>
              </span>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts?.monthly_trend || []} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorProf" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month_label" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis
                  tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  formatter={(value) => [formatINR(value), '']}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#2563eb" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRev)" />
                <Area type="monotone" dataKey="profit" name="Profit" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorProf)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Revenue Bar Chart */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-900">Revenue by Category</h3>
            <p className="text-xs text-slate-500">Gross vs Net contribution across product lines</p>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts?.category_revenue || []} layout="vertical" margin={{ top: 5, right: 10, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="category" tick={{ fontSize: 11, fill: '#1e293b' }} axisLine={false} tickLine={false} width={80} />
                <Tooltip formatter={(v) => [formatINR(v), 'Revenue']} contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
                <Bar dataKey="revenue" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 2 Charts: Regional Sales, Top Products, Spending Distribution, Order Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* Sales by Region */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-900">Sales by Region</h3>
            <p className="text-xs text-slate-500">Regional sales volumes across India</p>
          </div>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts?.regional_sales || []} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="region" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(v) => [formatINR(v), 'Revenue']} contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
                <Bar dataKey="revenue" fill="#0d9488" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top-Selling Products */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-900">Top-Selling Products</h3>
            <p className="text-xs text-slate-500">Highest grossing catalog items</p>
          </div>
          <div className="space-y-3 overflow-y-auto max-h-60 pr-1">
            {charts?.top_products?.map((item, idx) => (
              <div key={item.product_id} className="flex items-center justify-between text-xs pb-2 border-b border-slate-100 last:border-0">
                <div className="flex items-center space-x-2 truncate">
                  <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-[10px] flex-shrink-0">
                    {idx + 1}
                  </span>
                  <div className="truncate">
                    <p className="font-semibold text-slate-800 truncate" title={item.product_name}>
                      {item.product_name}
                    </p>
                    <p className="text-[10px] text-slate-400">{item.category} • {item.units_sold} units sold</p>
                  </div>
                </div>
                <span className="font-bold text-slate-900 ml-2 whitespace-nowrap">{formatINR(item.revenue)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Spending Distribution */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-900">Customer Segments</h3>
            <p className="text-xs text-slate-500">Spending tier breakdown (COALESCE)</p>
          </div>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={charts?.spending_distribution || []}
                  dataKey="customers"
                  nameKey="segment"
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={65}
                  paddingAngle={3}
                >
                  {charts?.spending_distribution?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val, name, item) => [`${val} customers (${formatINR(item.payload.total_spending)})`, name]}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '11px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-1.5 text-[10px]">
            {charts?.spending_distribution?.map((seg, idx) => (
              <div key={seg.segment} className="flex items-center space-x-1.5 truncate">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                <span className="text-slate-600 truncate">{seg.segment} ({seg.customers})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Order Status Breakdown */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-900">Order Status Breakdown</h3>
            <p className="text-xs text-slate-500">Fulfillment lifecycle distribution</p>
          </div>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={charts?.order_status_breakdown || []}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={65}
                  paddingAngle={3}
                >
                  {charts?.order_status_breakdown?.map((entry) => (
                    <Cell key={`status-${entry.status}`} fill={STATUS_COLORS[entry.status] || '#94a3b8'} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val, name) => [`${val} orders`, name]}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '11px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-1.5 text-[10px]">
            {charts?.order_status_breakdown?.map((st) => (
              <div key={st.status} className="flex items-center space-x-1.5 truncate">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: STATUS_COLORS[st.status] || '#94a3b8' }} />
                <span className="text-slate-600">{st.status} ({st.count})</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
