import React, { useState, useRef, useEffect } from "react";
import { Calendar, ChevronDown, Activity, Check, HeartPulse } from "lucide-react";
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
    <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-850">
      <div className="flex items-center gap-3">
        <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400/30">
          <HeartPulse className="w-5 h-5 animate-pulse" />
          <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-white leading-tight">
              PulseCare Hospital Analytics
            </h1>
            <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-3xs font-semibold bg-cyan-950/80 text-cyan-400 border border-cyan-800/60 uppercase tracking-widest">
              Live Clinical
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Inpatient admissions, bed occupancy & clinical department performance
          </p>
        </div>
      </div>

      {/* Date-range filter in dark mode */}
      <div className="relative self-start sm:self-auto" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-haspopup="true"
          className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-200 bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-cyan-500/50 rounded-xl shadow-lg shadow-black/30 backdrop-blur-md focus:outline-hidden focus:ring-2 focus:ring-cyan-500/50 transition cursor-pointer"
        >
          <Calendar className="w-3.5 h-3.5 text-cyan-400" />
          <span>{selectedRange}</span>
          <ChevronDown
            className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
              isOpen ? "rotate-180 text-cyan-400" : ""
            }`}
          />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-1.5 w-44 bg-slate-900/95 border border-slate-800 rounded-xl shadow-2xl shadow-black/80 z-30 py-1.5 text-xs backdrop-blur-xl animate-in fade-in slide-in-from-top-1 duration-150">
            <div className="px-3 py-1.5 text-3xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800/80">
              Filter Clinical Window
            </div>
            {dateRanges.map((range) => {
              const isSelected = selectedRange === range;
              return (
                <button
                  key={range}
                  type="button"
                  onClick={() => handleSelect(range)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-slate-800/80 transition cursor-pointer ${
                    isSelected
                      ? "font-semibold text-cyan-400 bg-cyan-950/40"
                      : "text-slate-300"
                  }`}
                >
                  <span>{range}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
}
