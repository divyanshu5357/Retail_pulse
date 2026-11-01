import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";

const departmentColors = [
  "#06B6D4", // Cyan (Cardiology)
  "#8B5CF6", // Violet (Oncology)
  "#3B82F6", // Blue (Neurology)
  "#10B981", // Emerald (Orthopedics)
  "#F59E0B", // Amber (Pediatrics)
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900/95 border border-slate-700/80 rounded-xl p-2.5 shadow-2xl backdrop-blur-xl text-xs">
        <p className="font-semibold text-white mb-1">{label} Department</p>
        <p className="text-cyan-400 font-medium flex items-center justify-between gap-3">
          <span>Active Beds:</span>
          <span className="font-bold text-white">{data.beds} occupied</span>
        </p>
        <p className="text-slate-400 font-medium flex items-center justify-between gap-3 mt-1">
          <span>Dept Billing:</span>
          <span className="font-semibold text-slate-200">₹{(data.revenue / 100000).toFixed(1)} Lakh</span>
        </p>
      </div>
    );
  }
  return null;
};

export default function CategoryBarChart({ data, yDomain }) {
  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 shadow-xl shadow-black/40 backdrop-blur-xl flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-sm font-bold text-white tracking-tight">
            Department Bed Occupancy
          </h2>
          <p className="text-xs text-slate-400">Active ward utilization by clinical specialty</p>
        </div>
        <span className="text-3xs px-2.5 py-0.5 rounded-full bg-slate-800/80 text-slate-300 font-medium border border-slate-700/60">
          5 Clinical Wings
        </span>
      </div>

      <div className="h-52 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 12, left: -14, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
            <XAxis
              dataKey="department"
              stroke="#64748B"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: "#334155" }}
            />
            <YAxis
              stroke="#64748B"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              domain={yDomain || [0, "auto"]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="beds"
              radius={[6, 6, 0, 0]}
              maxBarSize={38}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={departmentColors[index % departmentColors.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
