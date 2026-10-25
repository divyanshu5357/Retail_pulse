import React from 'react';
import {
  LayoutDashboard,
  TrendingUp,
  Users,
  Package,
  ShoppingCart,
  FileSpreadsheet,
  Database,
  BarChart3,
  Settings,
  Sparkles,
  Server
} from 'lucide-react';

export default function Sidebar({ activePage, setActivePage, dbStatus }) {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'sales', label: 'Sales Analysis', icon: TrendingUp },
    { id: 'customers', label: 'Customers', icon: Users, badge: 'Analysis' },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'excel', label: 'Excel Practical', icon: FileSpreadsheet, badge: '9 Formulas' },
    { id: 'pivot', label: 'Excel Pivot Table', icon: Sparkles, badge: 'Guide' },
    { id: 'sql', label: 'SQL Analysis', icon: Database, badge: 'Interactive' },
    { id: 'tableau', label: 'Tableau Export', icon: BarChart3, badge: 'CSVs' },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const isConnected = dbStatus?.status === 'connected';

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen sticky top-0 select-none z-20">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/30">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 leading-tight">RetailPulse</h1>
            <p className="text-xs text-slate-500 font-medium">Analytics Dashboard</p>
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
          Analytics & Core
        </div>
        {navItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        <div className="pt-4 px-3 pb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
          Academic Practicals
        </div>
        {navItems.slice(5, 9).map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                    isActive ? 'bg-blue-200 text-blue-800' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        <div className="pt-4 px-3 pb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
          Configuration
        </div>
        <button
          onClick={() => setActivePage('settings')}
          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            activePage === 'settings'
              ? 'bg-blue-50 text-blue-700 font-semibold'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <div className="flex items-center space-x-3">
            <Settings className={`w-4 h-4 ${activePage === 'settings' ? 'text-blue-600' : 'text-slate-400'}`} />
            <span>Settings</span>
          </div>
        </button>
      </nav>

      {/* Database Connection Pill Footer */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <span
              className={`w-2 h-2 rounded-full ${
                isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
              }`}
            />
            <span className="font-medium text-slate-700">
              {dbStatus?.is_mysql ? 'MySQL 9.x Active' : 'DB Engine Ready'}
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-500">Port 3306</span>
        </div>
      </div>
    </aside>
  );
}
