import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/95 border border-slate-700/80 rounded-xl p-2.5 shadow-2xl backdrop-blur-xl text-xs">
        <p className="font-semibold text-slate-300 mb-1.5 border-b border-slate-800 pb-1">
          {label} Clinical Volume
        </p>
        <p className="text-cyan-400 font-medium flex items-center justify-between gap-3">
          <span>Admissions:</span>
          <span className="font-bold text-white">{payload[0].value} pts</span>
        </p>
        {payload[1] && (
          <p className="text-emerald-400 font-medium flex items-center justify-between gap-3 mt-1">
            <span>Discharges:</span>
            <span className="font-bold text-white">{payload[1].value} pts</span>
          </p>
        )}
      </div>
    );
  }
  return null;
};

export default function MonthlyTrendChart({ data, badgeLabel, yDomain }) {
  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 shadow-xl shadow-black/40 backdrop-blur-xl flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-sm font-bold text-white tracking-tight">
            Inpatient Admissions & Discharges
          </h2>
          <p className="text-xs text-slate-400">Patient admission trajectory over timeline</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-flex items-center gap-1.5 text-3xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span> Admissions
            <span className="w-2 h-2 rounded-full bg-emerald-400 ml-1"></span> Discharges
          </span>
          <span className="text-3xs px-2.5 py-0.5 rounded-full bg-cyan-950/70 text-cyan-300 font-medium border border-cyan-800/50">
            {badgeLabel || "Clinical Trajectory"}
          </span>
        </div>
      </div>

      <div className="h-52 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 12, left: -14, bottom: 0 }}>
            <defs>
              <linearGradient id="admissionGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="dischargeGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
            <XAxis
              dataKey="period"
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
              domain={yDomain || ["auto", "auto"]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="admissions"
              stroke="#06B6D4"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#admissionGlow)"
              dot={{ r: 3.5, fill: "#06B6D4", strokeWidth: 1.5, stroke: "#0B0F19" }}
              activeDot={{ r: 6, fill: "#22D3EE", stroke: "#0B0F19", strokeWidth: 2 }}
            />
            <Area
              type="monotone"
              dataKey="discharges"
              stroke="#10B981"
              strokeWidth={2}
              strokeDasharray="4 4"
              fillOpacity={1}
              fill="url(#dischargeGlow)"
              dot={{ r: 3, fill: "#10B981", strokeWidth: 1, stroke: "#0B0F19" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
