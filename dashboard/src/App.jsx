import React, { useState } from "react";
import Header from "./components/Header";
import KpiCard from "./components/KpiCard";
import MonthlyTrendChart from "./components/MonthlyTrendChart";
import CategoryBarChart from "./components/CategoryBarChart";
import RecentOrdersTable from "./components/RecentOrdersTable";
import Footer from "./components/Footer";
import { hospitalDataByRange } from "./data/demoData";

export default function App() {
  const [selectedRange, setSelectedRange] = useState("Last 6 Months");

  const currentData =
    hospitalDataByRange[selectedRange] ||
    hospitalDataByRange["Last 6 Months"];

  return (
    <div className="relative min-h-screen bg-[#070a12] text-slate-100 font-sans antialiased overflow-hidden">
      {/* Background radial glow accents for modern sleek dark aesthetics */}
      <div className="pointer-events-none absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-cyan-600/10 blur-[130px]" />
      <div className="pointer-events-none absolute top-1/3 -right-20 h-96 w-96 rounded-full bg-blue-600/10 blur-[140px]" />
      <div className="pointer-events-none absolute -bottom-20 left-1/3 h-96 w-96 rounded-full bg-purple-600/10 blur-[140px]" />

      <div className="relative z-10 flex flex-col justify-between p-3 sm:p-5 lg:p-6 max-w-7xl mx-auto space-y-3.5 min-h-screen">
        {/* 1. Header with dynamic clinical date-range filter */}
        <Header
          selectedRange={selectedRange}
          onRangeChange={setSelectedRange}
        />

        {/* 2. Four Hospital KPI Cards in one row */}
        <section aria-label="Clinical Key Performance Indicators">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {currentData.kpiMetrics.map((kpi) => (
              <KpiCard
                key={`${selectedRange}-${kpi.id}`}
                title={kpi.title}
                value={kpi.value}
                change={kpi.change}
                isPositive={kpi.isPositive}
                subtext={kpi.subtext}
                iconName={kpi.iconName}
                accentColor={kpi.accentColor}
              />
            ))}
          </div>
        </section>

        {/* 3. Two Charts Side by Side */}
        <section aria-label="Clinical Charts" className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <MonthlyTrendChart
            data={currentData.admissionsTrend}
            badgeLabel={currentData.badgeLabel}
            yDomain={currentData.trendYDomain}
          />
          <CategoryBarChart
            data={currentData.departmentOccupancy}
            yDomain={currentData.departmentYDomain}
          />
        </section>

        {/* 4. Recent Encounters Table (5 rows) */}
        <section aria-label="Recent Inpatient Encounters">
          <RecentOrdersTable encounters={currentData.recentEncounters} />
        </section>

        {/* 5. Footer */}
        <Footer />
      </div>
    </div>
  );
}
