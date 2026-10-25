import React from 'react';

export default function KPICard({ title, value, subtext, icon: Icon, badge, color = 'blue' }) {
  const colorMap = {
    blue: {
      bg: 'bg-blue-50 text-blue-600',
      border: 'border-blue-100',
      badge: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    emerald: {
      bg: 'bg-emerald-50 text-emerald-600',
      border: 'border-emerald-100',
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    indigo: {
      bg: 'bg-indigo-50 text-indigo-600',
      border: 'border-indigo-100',
      badge: 'bg-indigo-50 text-indigo-700 border-indigo-200'
    },
    amber: {
      bg: 'bg-amber-50 text-amber-600',
      border: 'border-amber-100',
      badge: 'bg-amber-50 text-amber-700 border-amber-200'
    },
    rose: {
      bg: 'bg-rose-50 text-rose-600',
      border: 'border-rose-100',
      badge: 'bg-rose-50 text-rose-700 border-rose-200'
    },
    slate: {
      bg: 'bg-slate-100 text-slate-700',
      border: 'border-slate-200',
      badge: 'bg-slate-50 text-slate-700 border-slate-200'
    }
  };

  const currentTheme = colorMap[color] || colorMap.blue;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1.5 tracking-tight">{value}</h3>
        </div>
        <div className={`p-2.5 rounded-xl ${currentTheme.bg}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-3.5 flex items-center justify-between text-xs">
        <span className="text-slate-500 font-medium">{subtext}</span>
        {badge && (
          <span className={`px-2 py-0.5 rounded-full font-semibold border ${currentTheme.badge}`}>
            {badge}
          </span>
        )}
      </div>
    </div>
  );
}
