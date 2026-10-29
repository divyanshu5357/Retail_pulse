import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const formatCurrency = (val) => {
  if (val >= 1000000) return `₹${(val / 1000000).toFixed(1)}M`;
  return `₹${(val / 1000).toFixed(0)}k`;
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg p-2.5 shadow-md text-xs">
        <p className="font-semibold text-slate-800 mb-1">{label}</p>
        <p className="text-blue-600 font-medium">
          Revenue: <span className="font-bold">₹{payload[0].value.toLocaleString("en-IN")}</span>
        </p>
      </div>
    );
  }
  return null;
};

export default function CategoryBarChart({ data, yDomain }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs flex flex-col justify-between transition-all duration-200">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-sm font-bold text-slate-900">
            Revenue by Category
          </h2>
          <p className="text-xs text-slate-500">Sales breakdown by department</p>
        </div>
        <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium border border-slate-200">
          4 Categories
        </span>
      </div>

      <div className="h-52 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 12, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
            <XAxis
              dataKey="category"
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
              domain={yDomain || [0, "auto"]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="revenue"
              fill="#2563EB"
              radius={[4, 4, 0, 0]}
              maxBarSize={42}
              isAnimationActive={true}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
