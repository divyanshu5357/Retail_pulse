import React, { useEffect, useState } from 'react';
import {
  Search,
  Filter,
  UserX,
  Eye,
  Calendar,
  DollarSign,
  ShoppingBag,
  Award,
  ChevronRight
} from 'lucide-react';
import Modal from '../components/Modal';
import { fetchCustomers, fetchCustomerDetail, formatINR, formatNumber } from '../services/api';

const SEGMENT_BADGES = {
  'Platinum': 'bg-purple-50 text-purple-700 border-purple-200',
  'Gold': 'bg-amber-50 text-amber-700 border-amber-200',
  'Silver': 'bg-blue-50 text-blue-700 border-blue-200',
  'Bronze': 'bg-slate-100 text-slate-700 border-slate-200',
  'Inactive': 'bg-rose-50 text-rose-700 border-rose-200 font-bold'
};

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [regionFilter, setRegionFilter] = useState('All');
  const [segmentFilter, setSegmentFilter] = useState('All');
  
  // Modal state
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [customerDetail, setCustomerDetail] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const loadCustomers = () => {
    setLoading(true);
    fetchCustomers({ search, region: regionFilter, segment: segmentFilter })
      .then((data) => setCustomers(data.customers || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCustomers();
  }, [search, regionFilter, segmentFilter]);

  const handleOpenDetail = (cid) => {
    setSelectedCustomerId(cid);
    setLoadingDetail(true);
    fetchCustomerDetail(cid)
      .then((data) => setCustomerDetail(data))
      .catch((err) => console.error(err))
      .finally(() => setLoadingDetail(false));
  };

  const handleCloseDetail = () => {
    setSelectedCustomerId(null);
    setCustomerDetail(null);
  };

  // Quick Stats
  const totalCount = customers.length;
  const inactiveCount = customers.filter((c) => c.is_inactive).length;
  const activeCount = totalCount - inactiveCount;
  const totalSpend = customers.reduce((sum, c) => sum + c.total_spending, 0);

  return (
    <div className="space-y-6">
      {/* Top Banner explaining LEFT JOIN logic */}
      <div className="bg-blue-50/60 border border-blue-200 rounded-xl p-4 flex items-start space-x-3 text-xs text-blue-900">
        <Award className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">SQL Relational Concept Demonstration: LEFT JOIN & COALESCE</span>
          <p className="mt-0.5 text-blue-700 leading-relaxed">
            All registered customers are preserved in this table using a <code className="bg-blue-100 px-1 py-0.5 rounded font-mono">LEFT JOIN</code> between <code className="bg-blue-100 px-1 py-0.5 rounded font-mono">customers</code> and <code className="bg-blue-100 px-1 py-0.5 rounded font-mono">orders</code>.
            Customers with 0 purchases display <span className="font-semibold text-rose-700">₹0 spending</span> and an <span className="font-semibold text-rose-700">Inactive</span> segment status via <code className="bg-blue-100 px-1 py-0.5 rounded font-mono">COALESCE()</code> without being omitted from analytical aggregations.
          </p>
        </div>
      </div>

      {/* Summary KPI Mini Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs text-slate-500 font-semibold uppercase">Total Customer Accounts</p>
          <p className="text-xl font-bold text-slate-900 mt-1">{totalCount}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs text-slate-500 font-semibold uppercase">Active Purchasing Customers</p>
          <p className="text-xl font-bold text-emerald-600 mt-1">{activeCount}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-rose-200 bg-rose-50/20 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs text-rose-600 font-bold uppercase">Inactive (0 Purchases)</p>
            <UserX className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-xl font-bold text-rose-600 mt-1">{inactiveCount}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs text-slate-500 font-semibold uppercase">Total Customer Lifetime Value</p>
          <p className="text-xl font-bold text-blue-600 mt-1">{formatINR(totalSpend)}</p>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-2 flex-1 min-w-[240px]">
          <div className="relative w-full max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by customer name, email, or city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900"
            />
          </div>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          {/* Region Filter */}
          <div className="flex items-center space-x-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200">
            <span className="text-slate-500 font-medium">Region:</span>
            <select
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
              className="bg-transparent border-0 p-0 text-slate-800 font-semibold focus:ring-0 cursor-pointer"
            >
              <option value="All">All Regions</option>
              <option value="North">North</option>
              <option value="South">South</option>
              <option value="East">East</option>
              <option value="West">West</option>
              <option value="Central">Central</option>
            </select>
          </div>

          {/* Segment Filter */}
          <div className="flex items-center space-x-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200">
            <span className="text-slate-500 font-medium">Segment:</span>
            <select
              value={segmentFilter}
              onChange={(e) => setSegmentFilter(e.target.value)}
              className="bg-transparent border-0 p-0 text-slate-800 font-semibold focus:ring-0 cursor-pointer"
            >
              <option value="All">All Segments</option>
              <option value="Platinum">Platinum (₹50k+)</option>
              <option value="Gold">Gold (₹20k-₹50k)</option>
              <option value="Silver">Silver (₹5k-₹20k)</option>
              <option value="Bronze">Bronze (&lt;₹5k)</option>
              <option value="Inactive">Inactive (0 Orders)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Customer Data Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="px-5 py-3">Customer ID</th>
                <th className="px-5 py-3">Customer Name</th>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">City & Region</th>
                <th className="px-5 py-3">Registered On</th>
                <th className="px-5 py-3">Total Orders</th>
                <th className="px-5 py-3">Total Spending (₹)</th>
                <th className="px-5 py-3">Last Order</th>
                <th className="px-5 py-3">Spending Segment</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={10} className="px-6 py-10 text-center text-slate-500">
                    Loading customer analytics...
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-6 py-10 text-center text-slate-500">
                    No customers found matching current filters.
                  </td>
                </tr>
              ) : (
                customers.map((c) => (
                  <tr
                    key={c.customer_id}
                    className={`hover:bg-slate-50/80 transition-colors ${
                      c.is_inactive ? 'bg-rose-50/20' : ''
                    }`}
                  >
                    <td className="px-5 py-3.5 font-mono text-slate-500 font-medium">#{c.customer_id}</td>
                    <td className="px-5 py-3.5 font-bold text-slate-900">
                      <div className="flex items-center space-x-2">
                        <span>{c.customer_name}</span>
                        {c.is_inactive && (
                          <span className="text-[10px] bg-rose-100 text-rose-700 px-1.5 py-0.2 rounded font-semibold">
                            Inactive
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 font-mono text-[11px]">{c.email}</td>
                    <td className="px-5 py-3.5 text-slate-700">
                      {c.city}, <span className="font-semibold">{c.region}</span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-500">{c.registration_date}</td>
                    <td className="px-5 py-3.5">
                      <span className={`font-semibold ${c.total_orders === 0 ? 'text-rose-600' : 'text-slate-800'}`}>
                        {c.total_orders}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-bold text-slate-900">
                      {formatINR(c.total_spending)}
                    </td>
                    <td className="px-5 py-3.5 text-slate-500">{c.last_order_date}</td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                          SEGMENT_BADGES[c.customer_segment] || 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {c.customer_segment}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => handleOpenDetail(c.customer_id)}
                        className="inline-flex items-center space-x-1 px-2.5 py-1 text-xs text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium border border-blue-200"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>History</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Detail & Order History Modal */}
      <Modal
        isOpen={!!selectedCustomerId}
        onClose={handleCloseDetail}
        title={customerDetail?.customer?.customer_name || 'Customer Profile'}
        subtitle={`ID: #${customerDetail?.customer?.customer_id} • Registered on ${customerDetail?.customer?.registration_date}`}
        maxWidth="max-w-3xl"
      >
        {loadingDetail ? (
          <div className="py-12 text-center text-slate-500 text-xs">Loading order history...</div>
        ) : (
          <div className="space-y-5">
            {/* Customer Summary Cards */}
            <div className="grid grid-cols-3 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
              <div>
                <span className="text-slate-500 font-medium">Location</span>
                <p className="font-semibold text-slate-900">
                  {customerDetail?.customer?.city}, {customerDetail?.customer?.region}
                </p>
              </div>
              <div>
                <span className="text-slate-500 font-medium">Lifetime Spend</span>
                <p className="font-bold text-blue-700 text-sm">
                  {formatINR(customerDetail?.customer?.total_spending)}
                </p>
              </div>
              <div>
                <span className="text-slate-500 font-medium">Total Orders Placed</span>
                <p className="font-semibold text-slate-900">
                  {customerDetail?.customer?.total_orders} completed
                </p>
              </div>
            </div>

            {/* Orders Table */}
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                Order History & Fulfillment Details
              </h4>
              {customerDetail?.order_history?.length === 0 ? (
                <div className="p-8 text-center bg-rose-50/50 border border-rose-200 rounded-xl">
                  <UserX className="w-8 h-8 text-rose-500 mx-auto mb-2" />
                  <p className="text-xs font-bold text-rose-800">No Orders On Record</p>
                  <p className="text-[11px] text-rose-600 mt-0.5">
                    This customer registered an account but has never completed a retail transaction.
                  </p>
                </div>
              ) : (
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-700 font-semibold">
                      <tr>
                        <th className="px-4 py-2.5">Order ID</th>
                        <th className="px-4 py-2.5">Date</th>
                        <th className="px-4 py-2.5">Items</th>
                        <th className="px-4 py-2.5">Total (₹)</th>
                        <th className="px-4 py-2.5">Profit (₹)</th>
                        <th className="px-4 py-2.5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {customerDetail?.order_history?.map((ord) => (
                        <tr key={ord.order_id} className="hover:bg-slate-50">
                          <td className="px-4 py-2.5 font-mono font-medium">#{ord.order_id}</td>
                          <td className="px-4 py-2.5 text-slate-600">{ord.order_date}</td>
                          <td className="px-4 py-2.5 text-slate-600">{ord.items_count} items</td>
                          <td className="px-4 py-2.5 font-bold text-slate-900">{formatINR(ord.order_total)}</td>
                          <td className="px-4 py-2.5 text-emerald-600 font-semibold">{formatINR(ord.order_profit)}</td>
                          <td className="px-4 py-2.5">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                ord.order_status === 'Delivered'
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : ord.order_status === 'Cancelled'
                                  ? 'bg-rose-50 text-rose-700'
                                  : 'bg-blue-50 text-blue-700'
                              }`}
                            >
                              {ord.order_status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
