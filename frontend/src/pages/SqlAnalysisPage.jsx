import React, { useEffect, useState } from 'react';
import {
  Database,
  Play,
  CheckCircle,
  Code,
  Table,
  Download,
  AlertCircle,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { fetchSqlQueries, executeSqlQuery, formatINR } from '../services/api';

export default function SqlAnalysisPage() {
  const [queries, setQueries] = useState([]);
  const [selectedQueryId, setSelectedQueryId] = useState(null);
  const [queryResult, setQueryResult] = useState(null);
  const [executing, setExecuting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSqlQueries()
      .then((data) => {
        setQueries(data.queries || []);
        if (data.queries && data.queries.length > 0) {
          const defaultQ = data.queries[0].id;
          setSelectedQueryId(defaultQ);
          runQuery(defaultQ);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const runQuery = (qid) => {
    setExecuting(true);
    setError(null);
    executeSqlQuery(qid)
      .then((res) => {
        setQueryResult(res);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => setExecuting(false));
  };

  const handleSelectQuery = (qid) => {
    setSelectedQueryId(qid);
    runQuery(qid);
  };

  const selectedQuery = queries.find((q) => q.id === selectedQueryId);

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-blue-950 text-white rounded-xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold">SQL Relational Analytics Laboratory</h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Predefined, parameterized analytical queries executed directly on the MySQL 9.x relational database.
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-[11px] bg-blue-900/60 border border-blue-700/50 px-2.5 py-1 rounded-full text-blue-200 font-mono">
              Safe Backend Parameterization Active
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Predefined Queries List (1 col) */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-2 h-fit">
          <div className="px-2 pb-2 border-b border-slate-100 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Approved Analytical Queries
            </span>
            <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold">
              {queries.length} Queries
            </span>
          </div>

          <div className="space-y-1.5 max-h-[600px] overflow-y-auto pr-1">
            {queries.map((q) => {
              const isSelected = selectedQueryId === q.id;
              return (
                <button
                  key={q.id}
                  onClick={() => handleSelectQuery(q.id)}
                  className={`w-full text-left p-3 rounded-xl border transition-all text-xs ${
                    isSelected
                      ? 'bg-blue-50/80 border-blue-400 shadow-sm'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                      {q.category}
                    </span>
                    <span className="text-[9px] bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded font-semibold">
                      {q.badge}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 mt-1 line-clamp-1">{q.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{q.concept}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: SQL Editor Display & Live Execution Results (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Query Code & Explanation */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">{selectedQuery?.title}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{selectedQuery?.concept}</p>
              </div>

              <button
                onClick={() => selectedQueryId && runQuery(selectedQueryId)}
                disabled={executing}
                className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
              >
                <Play className="w-3.5 h-3.5" />
                <span>{executing ? 'Executing...' : 'Re-Execute Query'}</span>
              </button>
            </div>

            {/* Explanation card */}
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs text-slate-700 leading-relaxed">
              <span className="font-bold text-slate-900">Academic Objective: </span>
              {selectedQuery?.description}
            </div>

            {/* SQL Code Box */}
            <div className="relative rounded-xl overflow-hidden bg-slate-900 p-4 font-mono text-xs text-slate-100 overflow-x-auto">
              <pre className="text-blue-300">
                <code>{selectedQuery?.sql}</code>
              </pre>
            </div>
          </div>

          {/* Live Execution Results Table */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center space-x-2">
                <Table className="w-4 h-4 text-emerald-600" />
                <h4 className="text-xs font-bold text-slate-900">
                  Executed Query Result ({queryResult?.row_count || 0} Records Returned)
                </h4>
              </div>
              <span className="text-[11px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                STATUS: 200 OK
              </span>
            </div>

            <div className="overflow-x-auto max-h-96">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 uppercase font-semibold border-b border-slate-200 sticky top-0">
                  <tr>
                    {queryResult?.columns?.map((col) => (
                      <th key={col} className="px-4 py-2.5 whitespace-nowrap">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {executing ? (
                    <tr>
                      <td colSpan={queryResult?.columns?.length || 1} className="px-6 py-10 text-center text-slate-500 font-sans">
                        Executing query against MySQL database...
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan={queryResult?.columns?.length || 1} className="px-6 py-8 text-center text-rose-600 font-sans">
                        Error: {error}
                      </td>
                    </tr>
                  ) : queryResult?.rows?.length === 0 ? (
                    <tr>
                      <td colSpan={queryResult?.columns?.length || 1} className="px-6 py-8 text-center text-slate-500 font-sans">
                        No rows returned by this query.
                      </td>
                    </tr>
                  ) : (
                    queryResult?.rows?.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        {queryResult?.columns?.map((col) => {
                          const val = row[col];
                          const isCurrency = col.includes('spending') || col.includes('revenue') || col.includes('profit') || col.includes('price');
                          return (
                            <td key={col} className="px-4 py-2 text-slate-800 whitespace-nowrap">
                              {isCurrency && typeof val === 'number' ? formatINR(val) : String(val ?? '')}
                            </td>
                          );
                        })}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
