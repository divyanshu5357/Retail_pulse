import React from "react";
import { UserCheck, BedDouble, Activity, IndianRupee } from "lucide-react";

const iconMap = {
  UserCheck: UserCheck,
  BedDouble: BedDouble,
  Activity: Activity,
  IndianRupee: IndianRupee,
};

const colorStyles = {
  cyan: {
    iconBg: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    glow: "group-hover:border-cyan-500/40"
  },
  blue: {
    iconBg: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    glow: "group-hover:border-blue-500/40"
  },
  emerald: {
    iconBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    glow: "group-hover:border-emerald-500/40"
  },
  violet: {
    iconBg: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    glow: "group-hover:border-purple-500/40"
  }
};

export default function KpiCard({ title, value, change, isPositive, subtext, iconName, accentColor = "cyan" }) {
  const IconComponent = iconMap[iconName] || Activity;
  const style = colorStyles[accentColor] || colorStyles.cyan;

  return (
    <div className={`group relative bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800/80 rounded-2xl p-4 shadow-xl shadow-black/40 backdrop-blur-xl transition-all duration-200 ${style.glow}`}>
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-2xs font-semibold uppercase tracking-wider text-slate-400">
          {title}
        </span>
        <div className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-transform group-hover:scale-105 ${style.iconBg}`}>
          <IconComponent className="w-4 h-4" />
        </div>
      </div>

      <div className="text-xl lg:text-2xl font-bold tracking-tight text-white mb-1">
        {value}
      </div>

      <div className="flex items-center gap-1.5 text-xs">
        <span
          className={`font-semibold px-1.5 py-0.5 rounded-md text-2xs ${
            isPositive
              ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20"
              : "text-rose-400 bg-rose-500/10 border border-rose-500/20"
          }`}
        >
          {change}
        </span>
        <span className="text-slate-400 text-2xs truncate">{subtext}</span>
      </div>
    </div>
  );
}
