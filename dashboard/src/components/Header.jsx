import React, { useState, useRef, useEffect } from "react";
import { Calendar, ChevronDown, BarChart3, Check } from "lucide-react";
import { dateRanges } from "../data/demoData";

export default function Header({ selectedRange, onRangeChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (range) => {
    onRangeChange(range);
    setIsOpen(false);
  };

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
      <div className="relative self-start sm:self-auto" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-haspopup="true"
          className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-800 bg-white border border-slate-300 rounded-lg shadow-2xs hover:bg-slate-50 hover:border-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition cursor-pointer"
        >
          <Calendar className="w-3.5 h-3.5 text-blue-600" />
          <span>{selectedRange}</span>
          <ChevronDown
            className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-1 w-40 bg-white border border-slate-200 rounded-lg shadow-lg z-30 py-1 text-xs animate-in fade-in slide-in-from-top-1 duration-150">
            <div className="px-3 py-1 text-2xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-100">
              Filter Date Range
            </div>
            {dateRanges.map((range) => {
              const isSelected = selectedRange === range;
              return (
                <button
                  key={range}
                  type="button"
                  onClick={() => handleSelect(range)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-slate-50 transition cursor-pointer ${
                    isSelected
                      ? "font-semibold text-blue-600 bg-blue-50/60"
                      : "text-slate-700"
                  }`}
                >
                  <span>{range}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-blue-600" />}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
}
