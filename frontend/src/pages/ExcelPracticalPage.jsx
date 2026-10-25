import React, { useEffect, useState } from 'react';
import {
  FileSpreadsheet,
  Copy,
  Check,
  Download,
  HelpCircle,
  Code2,
  Table,
  CheckCircle2
} from 'lucide-react';
import { fetchExcelPractical, getDownloadUrl, formatINR } from '../services/api';

export default function ExcelPracticalPage() {
  const [practicalData, setPracticalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);
  const [selectedFormulaId, setSelectedFormulaId] = useState('if_basic');

  useEffect(() => {
    fetchExcelPractical()
      .then((data) => {
        setPracticalData(data);
        if (data.formulas && data.formulas.length > 0) {
          setSelectedFormulaId(data.formulas[0].id);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleCopyFormula = (id, syntax) => {
    navigator.clipboard.writeText(syntax);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const selectedFormula = practicalData?.formulas?.find((f) => f.id === selectedFormulaId);

  return (
    <div className="space-y-6">
      {/* Educational Banner */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border border-emerald-200 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Excel Logical Formulas Practical Module
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Comprehensive academic demonstration of IF, Nested IF, AND, OR, NOT, IFERROR, SUMIF, AVERAGEIF, and COUNTIF.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <a
              href={getDownloadUrl('retail_analytics_workbook.xlsx')}
              download
              className="flex items-center space-x-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .xlsx Workbook</span>
            </a>
            <a
              href={getDownloadUrl('tableau_sales_master.csv')}
              download
              className="flex items-center space-x-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold shadow-sm transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Raw CSV</span>
            </a>
          </div>
        </div>
      </div>

      {/* Formula Selector Tabs */}
      <div className="flex overflow-x-auto space-x-2 pb-1 scrollbar-none">
        {practicalData?.formulas?.map((f) => {
          const isSelected = selectedFormulaId === f.id;
          return (
            <button
              key={f.id}
              onClick={() => setSelectedFormulaId(f.id)}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-colors flex items-center space-x-1.5 border ${
                isSelected
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <span>{f.name}</span>
            </button>
          );
        })}
      </div>

      {/* Active Formula Detailed Breakdown Card */}
      {selectedFormula && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-base font-bold text-slate-900">{selectedFormula.name} Formula</span>
                <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-full border border-blue-200">
                  {selectedFormula.category}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{selectedFormula.purpose}</p>
            </div>

            <button
              onClick={() => handleCopyFormula(selectedFormula.id, selectedFormula.syntax)}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors border border-slate-200 self-start sm:self-auto"
            >
              {copiedId === selectedFormula.id ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Excel Formula</span>
                </>
              )}
            </button>
          </div>

          {/* Syntax Code Display */}
          <div className="bg-slate-900 rounded-xl p-4 font-mono text-xs text-emerald-400 overflow-x-auto flex items-center justify-between">
            <code>{selectedFormula.syntax}</code>
          </div>

          {/* Detailed Metadata Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
              <span className="text-slate-500 font-semibold uppercase tracking-wider text-[10px] block mb-1">
                Cell Reference Description
              </span>
              <p className="text-slate-800 font-medium leading-relaxed">
                {selectedFormula.cell_references}
              </p>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
              <span className="text-slate-500 font-semibold uppercase tracking-wider text-[10px] block mb-1">
                Business Logic & Explanation
              </span>
              <p className="text-slate-800 font-medium leading-relaxed">
                {selectedFormula.explanation}
              </p>
            </div>

            <div className="bg-emerald-50/60 p-3.5 rounded-xl border border-emerald-200 text-xs">
              <span className="text-emerald-800 font-bold uppercase tracking-wider text-[10px] block mb-1">
                Expected Calculation Result
              </span>
              <p className="text-emerald-900 font-extrabold text-sm mt-1">
                {selectedFormula.example_result}
              </p>
              <p className="text-[11px] text-emerald-700 mt-1">
                Based on sample test input ({selectedFormula.example_input})
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Sample Transactions Table with Cell Coordinates (A, B, C... 1, 2, 3...) */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Table className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Live Sample Transaction Table (Referenced by Excel Formulas)
            </h3>
          </div>
          <span className="text-[11px] text-slate-500 font-medium">
            Row 1 represents Headers; Data begins at Row 2
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 text-[11px]">
              <tr>
                <th className="px-3 py-2 border-r border-slate-200 text-slate-400 bg-slate-200 w-12 text-center">Row</th>
                <th className="px-4 py-2 border-r border-slate-200">A: Order_ID</th>
                <th className="px-4 py-2 border-r border-slate-200">B: Date</th>
                <th className="px-4 py-2 border-r border-slate-200">C: Customer</th>
                <th className="px-4 py-2 border-r border-slate-200">D: Product</th>
                <th className="px-4 py-2 border-r border-slate-200">E: Category</th>
                <th className="px-4 py-2 border-r border-slate-200">F: Qty</th>
                <th className="px-4 py-2 border-r border-slate-200">G: Net_Amount (₹)</th>
                <th className="px-4 py-2 border-r border-slate-200">H: Profit (₹)</th>
                <th className="px-4 py-2 border-r border-slate-200">I: Region</th>
                <th className="px-4 py-2">J: Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {loading ? (
                <tr>
                  <td colSpan={11} className="px-6 py-8 text-center text-slate-500">
                    Loading sample transaction matrix...
                  </td>
                </tr>
              ) : (
                practicalData?.sample_rows?.map((row, idx) => (
                  <tr key={row.order_id} className="hover:bg-slate-50/80">
                    <td className="px-3 py-2 border-r border-slate-200 text-center font-mono text-[10px] bg-slate-50 text-slate-400 font-bold">
                      {idx + 2}
                    </td>
                    <td className="px-4 py-2 border-r border-slate-100 font-mono text-slate-600">#{row.order_id}</td>
                    <td className="px-4 py-2 border-r border-slate-100 text-slate-600">{row.order_date}</td>
                    <td className="px-4 py-2 border-r border-slate-100 font-semibold text-slate-900">{row.customer_name}</td>
                    <td className="px-4 py-2 border-r border-slate-100 text-slate-700">{row.product_name}</td>
                    <td className="px-4 py-2 border-r border-slate-100">
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-700">
                        {row.category}
                      </span>
                    </td>
                    <td className="px-4 py-2 border-r border-slate-100 font-mono text-slate-800">{row.quantity}</td>
                    <td className="px-4 py-2 border-r border-slate-100 font-mono font-bold text-slate-900">
                      {formatINR(row.net_amount)}
                    </td>
                    <td className="px-4 py-2 border-r border-slate-100 font-mono font-semibold text-emerald-600">
                      {formatINR(row.profit)}
                    </td>
                    <td className="px-4 py-2 border-r border-slate-100 text-slate-700">{row.region}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          row.order_status === 'Delivered'
                            ? 'bg-emerald-50 text-emerald-700'
                            : row.order_status === 'Cancelled'
                            ? 'bg-rose-50 text-rose-700'
                            : 'bg-blue-50 text-blue-700'
                        }`}
                      >
                        {row.order_status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
