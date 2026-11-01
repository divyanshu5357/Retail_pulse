import React from "react";

export default function RecentOrdersTable({ encounters }) {
  const getStatusBadge = (status) => {
    switch (status) {
      case "Critical Care":
        return "bg-rose-950/60 text-rose-300 border-rose-800/70 shadow-xs shadow-rose-950";
      case "Under Treatment":
        return "bg-purple-950/60 text-purple-300 border-purple-800/70";
      case "Admitted":
        return "bg-cyan-950/60 text-cyan-300 border-cyan-800/70";
      case "Recovering":
        return "bg-blue-950/60 text-blue-300 border-blue-800/70";
      case "Discharged":
        return "bg-emerald-950/60 text-emerald-300 border-emerald-800/70";
      default:
        return "bg-slate-800/80 text-slate-300 border-slate-700";
    }
  };

  const getTriagePill = (level) => {
    switch (level) {
      case "Level 1":
        return "bg-rose-500/10 text-rose-400 border-rose-500/30";
      case "Level 2":
        return "bg-amber-500/10 text-amber-400 border-amber-500/30";
      default:
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
    }
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl shadow-xl shadow-black/40 backdrop-blur-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-800/80 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-white tracking-tight">Recent Inpatient Admissions & Discharges</h2>
          <p className="text-xs text-slate-400">Real-time clinical encounters & ward allocation</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-3xs text-slate-400 font-mono">EMR Feed Active</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/60 text-slate-400 border-b border-slate-800/80 font-semibold uppercase tracking-wider text-3xs">
            <tr>
              <th scope="col" className="px-4 py-2.5">Encounter ID</th>
              <th scope="col" className="px-4 py-2.5">Patient Name</th>
              <th scope="col" className="px-4 py-2.5">Department</th>
              <th scope="col" className="px-4 py-2.5">Assigned Ward</th>
              <th scope="col" className="px-4 py-2.5">Treatment Bill</th>
              <th scope="col" className="px-4 py-2.5">Triage</th>
              <th scope="col" className="px-4 py-2.5">Clinical Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-200">
            {encounters.map((enc) => (
              <tr key={enc.id} className="hover:bg-slate-800/40 transition">
                <td className="px-4 py-2.5 font-medium text-cyan-400 font-mono text-3xs">
                  {enc.id}
                </td>
                <td className="px-4 py-2.5 font-semibold text-white">
                  {enc.patient}
                </td>
                <td className="px-4 py-2.5">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-3xs font-medium bg-slate-800/80 text-slate-300 border border-slate-700/60">
                    {enc.department}
                  </span>
                </td>
                <td className="px-4 py-2.5 text-slate-400 text-3xs">
                  {enc.ward}
                </td>
                <td className="px-4 py-2.5 font-bold text-white">
                  {enc.amount}
                </td>
                <td className="px-4 py-2.5">
                  <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-3xs font-semibold border ${getTriagePill(enc.triageLevel)}`}>
                    {enc.triageLevel}
                  </span>
                </td>
                <td className="px-4 py-2.5">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-3xs font-semibold border ${getStatusBadge(
                      enc.status
                    )}`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-80" />
                    {enc.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
