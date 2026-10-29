import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const formatCurrency = (val) => `₹${(val / 1000).toFixed(0)}k`;

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg p-2.5 shadow-md text-xs">
        <p className="font-semibold text-slate-800 mb-1">{label} 2025</p>
        <p className="text-blue-600 font-medium">
          Revenue: <span className="font-bold">₹{payload[0].value.toLocaleString("en-IN")}</span>
        </p>
      </div>
    );
  }
  return null;
};

export default function MonthlyTrendChart({ data }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-sm font-bold text-slate-900">
            Monthly Sales Trend
          </h2>
          <p className="text-xs text-slate-500">Revenue trajectory over 6 months</p>
        </div>
        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium border border-blue-100">
          6-Month View
        </span>
      </div>

      <div className="h-52 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 12, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
            <XAxis
              dataKey="month"
              stroke="#64748B"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: "#CBD5E1" }}
            />
            <YAxis
              stroke="#64748B"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={formatCurrency}
              domain={[80000, 200000]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#2563EB"
              strokeWidth={2.5}
              dot={{ r: 4, fill: "#2563EB", strokeWidth: 1.5, stroke: "#FFFFFF" }}
              activeDot={{ r: 6, fill: "#1D4ED8" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
