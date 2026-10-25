import React, { useEffect, useState } from 'react';
import {
  Search,
  Filter,
  Calendar,
  Eye,
  ShoppingCart,
  CheckCircle,
  Truck,
  Clock,
  XCircle
} from 'lucide-react';
import Modal from '../components/Modal';
import { fetchOrders, fetchOrderDetail, formatINR, formatNumber } from '../services/api';

const STATUS_ICONS = {
  Delivered: CheckCircle,
  Shipped: Truck,
  Processing: Clock,
  Cancelled: XCircle
};

const STATUS_BADGES = {
  Delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Shipped: 'bg-blue-50 text-blue-700 border-blue-200',
  Processing: 'bg-amber-50 text-amber-700 border-amber-200',
  Cancelled: 'bg-rose-50 text-rose-700 border-rose-200'
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [regionFilter, setRegionFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Modal State
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [orderDetail, setOrderDetail] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const loadOrders = () => {
    setLoading(true);
    fetchOrders({
      search,
      region: regionFilter,
      status: statusFilter,
      start_date: startDate,
      end_date: endDate
    })
      .then((data) => setOrders(data.orders || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadOrders();
  }, [search, regionFilter, statusFilter, startDate, endDate]);

  const handleOpenDetail = (oid) => {
    setSelectedOrderId(oid);
    setLoadingDetail(true);
    fetchOrderDetail(oid)
      .then((data) => setOrderDetail(data))
      .catch((err) => console.error(err))
      .finally(() => setLoadingDetail(false));
  };

  const handleCloseDetail = () => {
    setSelectedOrderId(null);
    setOrderDetail(null);
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by customer name or Order ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          {/* Status Filter */}
          <div className="flex items-center space-x-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200">
            <span className="text-slate-500 font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent border-0 p-0 text-slate-800 font-semibold focus:ring-0 cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Delivered">Delivered</option>
              <option value="Shipped">Shipped</option>
              <option value="Processing">Processing</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

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

          {/* Date Range Inputs */}
          <div className="flex items-center space-x-1 bg-slate-50 px-2 py-1.5 rounded-lg border border-slate-200">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-transparent border-0 p-0 text-slate-700 text-xs cursor-pointer font-medium"
            />
            <span className="text-slate-400">-</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-transparent border-0 p-0 text-slate-700 text-xs cursor-pointer font-medium"
            />
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="px-5 py-3">Order ID</th>
                <th className="px-5 py-3">Order Date</th>
                <th className="px-5 py-3">Customer</th>
                <th className="px-5 py-3">Destination City & Region</th>
                <th className="px-5 py-3">Items</th>
                <th className="px-5 py-3">Net Total (₹)</th>
                <th className="px-5 py-3">Realized Profit (₹)</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={9} className="px-6 py-10 text-center text-slate-500">
                    Loading orders...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-10 text-center text-slate-500">
                    No orders found matching filters.
                  </td>
                </tr>
              ) : (
                orders.map((o) => {
                  const Icon = STATUS_ICONS[o.order_status] || Clock;
                  return (
                    <tr key={o.order_id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-5 py-3.5 font-mono font-bold text-slate-900">#{o.order_id}</td>
                      <td className="px-5 py-3.5 text-slate-600">{o.order_date}</td>
                      <td className="px-5 py-3.5 font-bold text-slate-900">{o.customer_name}</td>
                      <td className="px-5 py-3.5 text-slate-700">
                        {o.city}, <span className="font-semibold">{o.region}</span>
                      </td>
                      <td className="px-5 py-3.5 text-slate-600 font-medium">{o.items_count} items</td>
                      <td className="px-5 py-3.5 font-bold text-slate-900">{formatINR(o.net_total)}</td>
                      <td className="px-5 py-3.5 font-semibold text-emerald-600">{formatINR(o.profit)}</td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                            STATUS_BADGES[o.order_status] || 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          <Icon className="w-3 h-3" />
                          <span>{o.order_status}</span>
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          onClick={() => handleOpenDetail(o.order_id)}
                          className="inline-flex items-center space-x-1 px-2.5 py-1 text-xs text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium border border-blue-200"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Items</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Items Breakdown Modal */}
      <Modal
        isOpen={!!selectedOrderId}
        onClose={handleCloseDetail}
        title={`Order #${selectedOrderId} - Line Item Breakdown`}
        subtitle={`Customer: ${orderDetail?.order?.customer_name} • Date: ${orderDetail?.order?.order_date}`}
        maxWidth="max-w-3xl"
      >
        {loadingDetail ? (
          <div className="py-10 text-center text-slate-500 text-xs">Loading line items...</div>
        ) : (
          <div className="space-y-4">
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 font-semibold">
                  <tr>
                    <th className="px-4 py-2.5">Product Name</th>
                    <th className="px-4 py-2.5">Category</th>
                    <th className="px-4 py-2.5">Unit Price</th>
                    <th className="px-4 py-2.5">Qty</th>
                    <th className="px-4 py-2.5">Discount %</th>
                    <th className="px-4 py-2.5">Line Net (₹)</th>
                    <th className="px-4 py-2.5">Line Profit (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orderDetail?.items?.map((it) => (
                    <tr key={it.order_item_id} className="hover:bg-slate-50">
                      <td className="px-4 py-2.5 font-bold text-slate-900">{it.product_name}</td>
                      <td className="px-4 py-2.5 text-slate-500">{it.category}</td>
                      <td className="px-4 py-2.5 text-slate-800">{formatINR(it.unit_price)}</td>
                      <td className="px-4 py-2.5 font-bold text-slate-900">{it.quantity}</td>
                      <td className="px-4 py-2.5 text-amber-700 font-semibold">{it.discount_percent}%</td>
                      <td className="px-4 py-2.5 font-bold text-slate-900">{formatINR(it.line_total)}</td>
                      <td className="px-4 py-2.5 font-bold text-emerald-600">{formatINR(it.line_profit)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex justify-between items-center text-xs">
              <span className="text-slate-600 font-medium">Order Status: <span className="font-bold text-slate-900">{orderDetail?.order?.order_status}</span></span>
              <div className="text-right">
                <span className="text-slate-500 mr-2">Calculated Net Total:</span>
                <span className="text-base font-bold text-blue-700">
                  {formatINR(orderDetail?.items?.reduce((sum, i) => sum + i.line_total, 0))}
                </span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
