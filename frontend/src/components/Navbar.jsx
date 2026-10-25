import React from 'react';
import { Download, Info, Coins, Database } from 'lucide-react';
import { getDownloadUrl } from '../services/api';

export default function Navbar({ activePage, pageTitle }) {
  return (
    <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center space-x-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">{pageTitle}</h2>
          <p className="text-xs text-slate-500">Retail Sales & Customer Performance Intelligence</p>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        {/* Illustrative Sample Data Notice (Requirement 5) */}
        <div className="flex items-center space-x-1.5 px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-xs text-amber-800">
          <Info className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
          <span className="font-medium">College Project • Illustrative Sample Data</span>
        </div>

        {/* Currency Label (Requirement 3) */}
        <div className="flex items-center space-x-1.5 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full text-xs text-blue-800">
          <Coins className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
          <span className="font-semibold">INR (₹)</span>
        </div>

        {/* Quick Excel Download Button */}
        <a
          href={getDownloadUrl('retail_analytics_workbook.xlsx')}
          download
          className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium transition-colors shadow-sm"
          title="Download complete Excel workbook with raw data and formulas"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Excel Workbook</span>
        </a>
      </div>
    </header>
  );
}
