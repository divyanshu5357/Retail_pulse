import React from 'react';
import { Filter, Calendar, MapPin, Tag, RotateCcw } from 'lucide-react';

export default function FilterBar({ filters, setFilters, filterOptions, onReset }) {
  const regions = filterOptions?.regions || ['All', 'North', 'South', 'East', 'West', 'Central'];
  const categories = filterOptions?.categories || ['All', 'Electronics', 'Fashion', 'Home & Living', 'Groceries', 'Sports'];

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  const isFiltered =
    (filters.start_date && filters.start_date !== filterOptions?.min_date) ||
    (filters.end_date && filters.end_date !== filterOptions?.max_date) ||
    (filters.region && filters.region !== 'All') ||
    (filters.category && filters.category !== 'All');

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm mb-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Left: Filter title & active count */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Filter className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Global Analytics Filters
            </span>
            <p className="text-[11px] text-slate-500">Live filters synchronized across all charts & KPIs</p>
          </div>
        </div>

        {/* Center / Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Date Range Start */}
          <div className="flex items-center space-x-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500 font-medium">From:</span>
            <input
              type="date"
              value={filters.start_date || ''}
              onChange={(e) => handleFilterChange('start_date', e.target.value)}
              className="bg-transparent border-0 p-0 text-slate-700 text-xs focus:ring-0 cursor-pointer font-medium"
            />
          </div>

          {/* Date Range End */}
          <div className="flex items-center space-x-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500 font-medium">To:</span>
            <input
              type="date"
              value={filters.end_date || ''}
              onChange={(e) => handleFilterChange('end_date', e.target.value)}
              className="bg-transparent border-0 p-0 text-slate-700 text-xs focus:ring-0 cursor-pointer font-medium"
            />
          </div>

          {/* Region Dropdown */}
          <div className="flex items-center space-x-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500 font-medium">Region:</span>
            <select
              value={filters.region || 'All'}
              onChange={(e) => handleFilterChange('region', e.target.value)}
              className="bg-transparent border-0 p-0 text-slate-800 font-semibold focus:ring-0 cursor-pointer text-xs pr-4"
            >
              {regions.map((reg) => (
                <option key={reg} value={reg}>
                  {reg}
                </option>
              ))}
            </select>
          </div>

          {/* Category Dropdown */}
          <div className="flex items-center space-x-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs">
            <Tag className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500 font-medium">Category:</span>
            <select
              value={filters.category || 'All'}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="bg-transparent border-0 p-0 text-slate-800 font-semibold focus:ring-0 cursor-pointer text-xs pr-4"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Filters */}
          {isFiltered && (
            <button
              onClick={onReset}
              className="flex items-center space-x-1 px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-rose-200 font-medium"
              title="Reset all filters to defaults"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
