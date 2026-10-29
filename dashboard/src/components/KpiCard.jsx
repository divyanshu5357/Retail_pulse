import React from "react";
import { IndianRupee, TrendingUp, ShoppingBag, Users } from "lucide-react";

const iconMap = {
  IndianRupee: IndianRupee,
  TrendingUp: TrendingUp,
  ShoppingBag: ShoppingBag,
  Users: Users,
};

export default function KpiCard({ title, value, change, isPositive, subtext, iconName }) {
  const IconComponent = iconMap[iconName] || TrendingUp;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs hover:border-slate-300 transition">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
          {title}
        </span>
        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
          <IconComponent className="w-4 h-4" />
        </div>
      </div>

      <div className="flex items-baseline justify-between gap-2">
        <div className="text-xl lg:text-2xl font-bold tracking-tight text-slate-900">
          {value}
        </div>
      </div>

      <div className="mt-1 flex items-center gap-1.5 text-xs">
        <span
          className={`font-semibold ${
            isPositive ? "text-emerald-600" : "text-rose-600"
          }`}
        >
          {change}
        </span>
        <span className="text-slate-400">{subtext}</span>
      </div>
    </div>
  );
}
