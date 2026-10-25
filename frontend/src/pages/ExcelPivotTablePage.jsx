import React, { useEffect, useState } from 'react';
import {
  Sparkles,
  Layers,
  ArrowRight,
  Download,
  Info,
  CheckCircle2,
  Table as TableIcon
} from 'lucide-react';
import { fetchPivotTablePractical, getDownloadUrl, formatINR } from '../services/api';

export default function ExcelPivotTablePage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeMetric, setActiveMetric] = useState('revenue'); // 'revenue' or 'profit'

  useEffect(() => {
    fetchPivotTablePractical()
      .then((res) => setData(res))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const activeMatrix = activeMetric === 'revenue' ? data?.revenue_matrix : data?.profit_matrix;

  return (
    <div className="space-y-6">
      {/* Educational Notice Banner */}
      <div className="bg-gradient-to-r from-indigo-50 via-blue-50 to-slate-50 border border-indigo-200 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Excel Pivot Table Practical Guide & Verification Matrix
              </h3>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                Learn the four structural quadrants of Excel Pivot Tables: Rows, Columns, Values, and Filters.
                The summary matrix below is dynamically calculated to verify your expected Excel results.
              </p>
            </div>
          </div>

          <a
            href={getDownloadUrl('retail_analytics_workbook.xlsx')}
            download
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Pivot-Ready Workbook</span>
          </a>
        </div>
      </div>

      {/* 4 Quadrants Visual Architecture */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center space-x-2 text-indigo-600 mb-2">
            <span className="w-6 h-6 rounded-md bg-indigo-50 font-bold flex items-center justify-center text-xs">1</span>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Rows Field</h4>
          </div>
          <p className="text-xs font-bold text-slate-800">Category or Product</p>
          <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
            Organizes transactions into primary vertical groupings.
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center space-x-2 text-blue-600 mb-2">
            <span className="w-6 h-6 rounded-md bg-blue-50 font-bold flex items-center justify-center text-xs">2</span>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Columns Field</h4>
          </div>
          <p className="text-xs font-bold text-slate-800">Region or Month</p>
          <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
            Distributes aggregates across horizontal categories for cross-tabulation.
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center space-x-2 text-emerald-600 mb-2">
            <span className="w-6 h-6 rounded-md bg-emerald-50 font-bold flex items-center justify-center text-xs">3</span>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Values Field (∑)</h4>
          </div>
          <p className="text-xs font-bold text-slate-800">Sum of Revenue & Profit</p>
          <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
            Performs mathematical aggregations: Sum, Count of Orders, or Average.
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center space-x-2 text-amber-600 mb-2">
            <span className="w-6 h-6 rounded-md bg-amber-50 font-bold flex items-center justify-center text-xs">4</span>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Filters & Slicers</h4>
          </div>
          <p className="text-xs font-bold text-slate-800">Status, Date, Region</p>
          <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
            Applies report-level exclusion (e.g., exclude Cancelled orders).
          </p>
        </div>
      </div>

      {/* Dynamic Summary Matrix (Pre-calculated Pivot Simulation) */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <TableIcon className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Pivot Table Matrix Simulation: Category (Rows) × Region (Columns)
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Notice: This interactive table represents the exact pre-aggregated values produced by Excel's native Pivot Table engine.
            </p>
          </div>

          <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-lg text-xs">
            <button
              onClick={() => setActiveMetric('revenue')}
              className={`px-3 py-1 rounded-md font-semibold transition-colors ${
                activeMetric === 'revenue'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sum of Net Revenue
            </button>
            <button
              onClick={() => setActiveMetric('profit')}
              className={`px-3 py-1 rounded-md font-semibold transition-colors ${
                activeMetric === 'profit'
                  ? 'bg-white text-emerald-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sum of Realized Profit
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 uppercase font-bold border-b border-slate-200">
              <tr>
                <th className="px-5 py-3 border-r border-slate-200 bg-slate-100">Category (Rows)</th>
                {activeMatrix?.columns
                  ?.filter((c) => c !== 'category' && c !== 'Grand Total')
                  .map((col) => (
                    <th key={col} className="px-5 py-3 border-r border-slate-200">
                      {col} (Col)
                    </th>
                  ))}
                <th className="px-5 py-3 font-extrabold bg-blue-50/70 text-blue-900">Grand Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-slate-500 font-sans">
                    Calculating pivot summary matrix...
                  </td>
                </tr>
              ) : (
                activeMatrix?.rows?.map((row) => {
                  const isGrandTotalRow = row.category === 'Grand Total';
                  return (
                    <tr
                      key={row.category}
                      className={
                        isGrandTotalRow
                          ? 'bg-blue-50/60 font-bold border-t-2 border-slate-300'
                          : 'hover:bg-slate-50'
                      }
                    >
                      <td
                        className={`px-5 py-3 border-r border-slate-200 font-sans ${
                          isGrandTotalRow ? 'font-extrabold text-blue-900' : 'font-bold text-slate-900'
                        }`}
                      >
                        {row.category}
                      </td>
                      {activeMatrix?.columns
                        ?.filter((c) => c !== 'category' && c !== 'Grand Total')
                        .map((col) => (
                          <td key={col} className="px-5 py-3 border-r border-slate-100 text-slate-800">
                            {formatINR(row[col])}
                          </td>
                        ))}
                      <td
                        className={`px-5 py-3 ${
                          isGrandTotalRow ? 'text-blue-900 font-extrabold' : 'font-bold text-slate-900 bg-blue-50/30'
                        }`}
                      >
                        {formatINR(row['Grand Total'])}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Step-by-Step Native Excel Creation Guide */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 mb-4">
          Step-by-Step Instructions to Reproduce in Microsoft Excel
        </h3>

        <div className="space-y-4">
          {data?.excel_steps?.map((st) => (
            <div key={st.step} className="flex items-start space-x-3 text-xs">
              <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center flex-shrink-0 text-[11px] mt-0.5">
                {st.step}
              </span>
              <div>
                <p className="font-bold text-slate-900">{st.title}</p>
                <p className="text-slate-600 mt-0.5 leading-relaxed">{st.action}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
