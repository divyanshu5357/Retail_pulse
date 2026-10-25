import React, { useEffect, useState } from 'react';
import {
  TrendingUp,
  Percent,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Layers
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import FilterBar from '../components/FilterBar';
import { fetchDashboardCharts, fetchDashboardKPIs, fetchFilterOptions, formatINR, formatNumber } from '../services/api';

export default function SalesAnalysisPage() {
  const [charts, setCharts] = useState(null);
  const [kpis, setKpis] = useState(null);
  const [filterOptions, setFilterOptions] = useState(null);
  const [filters, setFilters] = useState({
    start_date: '',
    end_date: '',
    region: 'All',
    category: 'All'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFilterOptions().then((opts) => {
      setFilterOptions(opts);
      setFilters((prev) => ({
        ...prev,
        start_date: opts.min_date,
        end_date: opts.max_date
      }));
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchDashboardCharts(filters), fetchDashboardKPIs(filters)])
      .then(([cData, kData]) => {
        setCharts(cData);
        setKpis(kData);
      })
      .finally(() => setLoading(false));
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

  return (
    <div className="space-y-6">
      <FilterBar
        filters={filters}
        setFilters={setFilters}
        filterOptions={filterOptions}
        onReset={handleResetFilters}
      />

      {/* Summary Highlight Strip */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <p className="text-xs font-semibold text-slate-500 uppercase">Gross Revenue</p>
          <p className="text-xl font-bold text-slate-900 mt-1">{formatINR(kpis?.total_revenue)}</p>
          <p className="text-[11px] text-emerald-600 font-medium mt-1">All fulfilled order streams</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <p className="text-xs font-semibold text-slate-500 uppercase">Net Profit</p>
          <p className="text-xl font-bold text-emerald-600 mt-1">{formatINR(kpis?.total_profit)}</p>
          <p className="text-[11px] text-slate-500 mt-1">Calculated after discounts & product cost</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <p className="text-xs font-semibold text-slate-500 uppercase">Overall Profit Margin</p>
          <p className="text-xl font-bold text-blue-600 mt-1">{kpis?.profit_margin_pct || 0}%</p>
          <p className="text-[11px] text-slate-500 mt-1">Net profit / Net revenue</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <p className="text-xs font-semibold text-slate-500 uppercase">Average Ticket (AOV)</p>
          <p className="text-xl font-bold text-indigo-600 mt-1">{formatINR(kpis?.average_order_value)}</p>
          <p className="text-[11px] text-slate-500 mt-1">Across {formatNumber(kpis?.total_orders)} orders</p>
        </div>
      </div>

      {/* Revenue vs Profit Composed Chart */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Revenue & Profit Margin Efficiency Curve</h3>
            <p className="text-xs text-slate-500">Monthly Net Revenue (bars) overlaid with realized Net Profit (line)</p>
          </div>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={charts?.monthly_trend || []} margin={{ top: 10, right: 20, bottom: 0, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month_label" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis
                yAxisId="left"
                tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                tick={{ fontSize: 11, fill: '#64748b' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                formatter={(val, name) => [formatINR(val), name]}
                contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Bar yAxisId="left" dataKey="revenue" name="Net Revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Line yAxisId="left" type="monotone" dataKey="profit" name="Realized Profit" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Performance Breakdown Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Category Financial Contribution Breakdown</h3>
            <p className="text-xs text-slate-500">Revenue, profit, and volume matrix per merchandise category</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Units Sold</th>
                <th className="px-6 py-3">Net Revenue (₹)</th>
                <th className="px-6 py-3">Total Profit (₹)</th>
                <th className="px-6 py-3">Profit Margin %</th>
                <th className="px-6 py-3">Revenue Share</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {charts?.category_revenue?.map((cat) => {
                const totalRev = kpis?.total_revenue || 1;
                const share = ((cat.revenue / totalRev) * 100).toFixed(1);
                const margin = ((cat.profit / cat.revenue) * 100).toFixed(1);
                return (
                  <tr key={cat.category} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-3.5 font-bold text-slate-900">{cat.category}</td>
                    <td className="px-6 py-3.5 text-slate-600">{formatNumber(cat.units_sold)}</td>
                    <td className="px-6 py-3.5 font-semibold text-slate-900">{formatINR(cat.revenue)}</td>
                    <td className="px-6 py-3.5 font-semibold text-emerald-600">{formatINR(cat.profit)}</td>
                    <td className="px-6 py-3.5">
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full font-semibold border border-emerald-200">
                        {margin}%
                      </span>
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${Math.min(100, share)}%` }} />
                        </div>
                        <span className="text-slate-500 font-medium">{share}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
