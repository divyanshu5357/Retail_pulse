import React from "react";

export default function RecentOrdersTable({ orders }) {
  const getStatusBadge = (status) => {
    switch (status) {
      case "Completed":
        return "bg-emerald-50 text-emerald-700 border-emerald-200/80";
      case "Pending":
        return "bg-amber-50 text-amber-700 border-amber-200/80";
      case "Cancelled":
        return "bg-rose-50 text-rose-700 border-rose-200/80";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-slate-900">Recent Orders</h2>
          <p className="text-xs text-slate-500">Latest 5 sales transactions</p>
        </div>
        <span className="text-xs text-slate-400">Live order feed</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold uppercase tracking-wider">
            <tr>
              <th scope="col" className="px-4 py-2.5">Order ID</th>
              <th scope="col" className="px-4 py-2.5">Customer</th>
              <th scope="col" className="px-4 py-2.5">Category</th>
              <th scope="col" className="px-4 py-2.5">Amount</th>
              <th scope="col" className="px-4 py-2.5">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-slate-50/70 transition">
                <td className="px-4 py-2.5 font-medium text-slate-900 font-mono">
                  {order.id}
                </td>
                <td className="px-4 py-2.5 text-slate-700 font-medium">
                  {order.customer}
                </td>
                <td className="px-4 py-2.5 text-slate-600">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-2xs font-medium bg-slate-100 text-slate-700">
                    {order.category}
                  </span>
                </td>
                <td className="px-4 py-2.5 font-semibold text-slate-900">
                  {order.amount}
                </td>
                <td className="px-4 py-2.5">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-2xs font-semibold border ${getStatusBadge(
                      order.status
                    )}`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-80" />
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
