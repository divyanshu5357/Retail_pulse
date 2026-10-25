import React, { useEffect, useState } from 'react';
import {
  Server,
  Database,
  Upload,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  FileText,
  ShieldCheck,
  Check
} from 'lucide-react';
import { fetchHealth, triggerReseed, uploadSalesCsv, formatNumber } from '../services/api';

export default function SettingsPage() {
  const [healthData, setHealthData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Reseed state
  const [reseeding, setReseeding] = useState(false);
  const [reseedMsg, setReseedMsg] = useState(null);

  // Upload state
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);

  const loadStatus = () => {
    setLoading(true);
    fetchHealth()
      .then((data) => setHealthData(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadStatus();
  }, []);

  const handleReseed = () => {
    if (!window.confirm('Are you sure you want to re-seed the sample database? This will refresh all tables to the initial reproducible dataset.')) {
      return;
    }
    setReseeding(true);
    setReseedMsg(null);
    triggerReseed()
      .then((res) => {
        setReseedMsg({ type: 'success', text: res.message });
        loadStatus();
      })
      .catch((err) => {
        setReseedMsg({ type: 'error', text: err.message });
      })
      .finally(() => setReseeding(false));
  };

  const handleFileUpload = (e) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setUploadResult(null);
    uploadSalesCsv(file)
      .then((res) => {
        setUploadResult({
          success: res.success,
          message: res.message || res.error,
          details: res.details
        });
        if (res.success) {
          loadStatus();
        }
      })
      .catch((err) => {
        setUploadResult({
          success: false,
          message: err.message || 'File upload failed'
        });
      })
      .finally(() => setUploading(false));
  };

  const db = healthData?.database;
  const isConnected = db?.status === 'connected';

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Database Diagnostics Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Database Engine & Infrastructure</h3>
              <p className="text-xs text-slate-500">Live connection diagnostics to local MySQL DBMS</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span
              className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                isConnected
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-rose-50 text-rose-700 border-rose-200'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-rose-500'}`} />
              <span>{isConnected ? 'ONLINE & READY' : 'OFFLINE'}</span>
            </span>
            <button
              onClick={loadStatus}
              className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
              title="Refresh connection status"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <span className="text-slate-500 font-medium">DBMS Engine</span>
            <p className="font-bold text-slate-900 text-sm mt-0.5">{db?.engine || 'Checking...'}</p>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <span className="text-slate-500 font-medium">Database Name</span>
            <p className="font-bold text-slate-900 text-sm mt-0.5 font-mono">{db?.database || 'retail_analytics'}</p>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <span className="text-slate-500 font-medium">Host Endpoint</span>
            <p className="font-bold text-slate-900 text-sm mt-0.5 font-mono">{db?.host || '127.0.0.1'}:3306</p>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <span className="text-slate-500 font-medium">Security</span>
            <p className="font-bold text-emerald-700 text-sm mt-0.5">Parameterized</p>
          </div>
        </div>

        {/* Record Counts */}
        <div className="pt-2">
          <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block mb-2">
            Active Table Record Counts
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 border border-slate-200 rounded-lg flex items-center justify-between">
              <span className="text-slate-600">Customers:</span>
              <span className="font-bold text-slate-900 font-mono">{formatNumber(db?.counts?.customers)}</span>
            </div>
            <div className="p-3 border border-slate-200 rounded-lg flex items-center justify-between">
              <span className="text-slate-600">Products:</span>
              <span className="font-bold text-slate-900 font-mono">{formatNumber(db?.counts?.products)}</span>
            </div>
            <div className="p-3 border border-slate-200 rounded-lg flex items-center justify-between">
              <span className="text-slate-600">Orders:</span>
              <span className="font-bold text-slate-900 font-mono">{formatNumber(db?.counts?.orders)}</span>
            </div>
            <div className="p-3 border border-slate-200 rounded-lg flex items-center justify-between">
              <span className="text-slate-600">Order Items:</span>
              <span className="font-bold text-slate-900 font-mono">{formatNumber(db?.counts?.order_items)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Database Seeding & Reset Control */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Database Seeding & Reset Tool</h3>
            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
              Resets the database schema and re-populates reproducible sample data (110 customers with 21 inactive, 24 products, 280 orders, 530 items) and regenerates all CSVs and Excel files.
            </p>
          </div>

          <button
            onClick={handleReseed}
            disabled={reseeding}
            className="flex items-center space-x-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors whitespace-nowrap"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${reseeding ? 'animate-spin' : ''}`} />
            <span>{reseeding ? 'Reseeding Tables...' : 'Reseed Database'}</span>
          </button>
        </div>

        {reseedMsg && (
          <div
            className={`p-3 rounded-lg text-xs flex items-center space-x-2 border ${
              reseedMsg.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-rose-50 text-rose-800 border-rose-200'
            }`}
          >
            {reseedMsg.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            )}
            <span>{reseedMsg.text}</span>
          </div>
        )}
      </div>

      {/* CSV Import Tool with Validation (Requirement 12) */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div>
          <div className="flex items-center space-x-2">
            <Upload className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">Sales CSV Batch Ingestion & Validation</h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
            Upload custom sales batches. Validates required headers, foreign keys, positive quantities, and valid discounts to protect against database corruption.
          </p>
        </div>

        <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 text-[11px] text-slate-600 space-y-1">
          <p className="font-bold text-slate-800">Required CSV Columns:</p>
          <code className="text-blue-700 font-mono block bg-white p-2 rounded border border-slate-200">
            customer_id, order_date, region, order_status, product_id, quantity, unit_price, discount_percent
          </code>
        </div>

        <form onSubmit={handleFileUpload} className="space-y-4 pt-1">
          <div className="flex items-center space-x-3">
            <input
              type="file"
              accept=".csv"
              onChange={(e) => setFile(e.target.files[0])}
              className="text-xs text-slate-600 file:mr-3 file:py-2 file:px-3.5 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
            />
            <button
              type="submit"
              disabled={!file || uploading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
            >
              {uploading ? 'Validating & Importing...' : 'Validate & Import CSV'}
            </button>
          </div>
        </form>

        {uploadResult && (
          <div
            className={`p-4 rounded-xl text-xs border ${
              uploadResult.success
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-rose-50 text-rose-800 border-rose-200'
            }`}
          >
            <div className="flex items-center space-x-2 font-bold mb-1">
              {uploadResult.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600" />
              )}
              <span>{uploadResult.message}</span>
            </div>

            {uploadResult.details && uploadResult.details.length > 0 && (
              <ul className="list-disc pl-5 mt-2 space-y-1 text-[11px] text-rose-700">
                {uploadResult.details.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
