import React, { useState } from "react";
import { Calendar, ChevronDown, BarChart3 } from "lucide-react";

export default function Header() {
  const [selectedRange, setSelectedRange] = useState("Last 6 Months");
  const [isOpen, setIsOpen] = useState(false);

  const ranges = ["Last 30 Days", "Last 6 Months", "This Year", "All Time"];

  return (
    <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-200">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs">
          <BarChart3 className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 leading-tight">
            Retail Sales Dashboard
          </h1>
          <p className="text-xs text-slate-500">
            Sales and customer performance overview
          </p>
        </div>
      </div>

      {/* Date-range filter */}
      <div className="relative self-start sm:self-auto">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg shadow-2xs hover:bg-slate-50 hover:border-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition"
        >
          <Calendar className="w-3.5 h-3.5 text-slate-500" />
          <span>{selectedRange}</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-1 w-36 bg-white border border-slate-200 rounded-lg shadow-lg z-20 py-1 text-xs">
            {ranges.map((range) => (
              <button
                key={range}
                type="button"
                onClick={() => {
                  setSelectedRange(range);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-1.5 hover:bg-slate-50 transition ${
                  selectedRange === range
                    ? "font-semibold text-blue-600 bg-blue-50/50"
                    : "text-slate-700"
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
