import React, { useState } from "react";
import Header from "./components/Header";
import KpiCard from "./components/KpiCard";
import MonthlyTrendChart from "./components/MonthlyTrendChart";
import CategoryBarChart from "./components/CategoryBarChart";
import RecentOrdersTable from "./components/RecentOrdersTable";
import Footer from "./components/Footer";
import { dashboardDataByRange } from "./data/demoData";

export default function App() {
  const [selectedRange, setSelectedRange] = useState("Last 6 Months");

  const currentData =
    dashboardDataByRange[selectedRange] ||
    dashboardDataByRange["Last 6 Months"];

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 font-sans antialiased flex flex-col justify-between p-3 sm:p-5 lg:p-6 max-w-7xl mx-auto space-y-4">
      {/* 1. Header with dynamic date-range filter */}
      <Header
        selectedRange={selectedRange}
        onRangeChange={setSelectedRange}
      />

      {/* 2. Four KPI Cards in one row */}
      <section aria-label="Key Performance Indicators">
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
            />
          ))}
        </div>
      </section>

      {/* 3. Two Charts Side by Side */}
      <section aria-label="Sales Charts" className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <MonthlyTrendChart
          data={currentData.monthlySalesTrend}
          badgeLabel={currentData.badgeLabel}
          yDomain={currentData.trendYDomain}
        />
        <CategoryBarChart
          data={currentData.categoryRevenueData}
          yDomain={currentData.categoryYDomain}
        />
      </section>

      {/* 4. Recent Orders Table (5 rows) */}
      <section aria-label="Recent Transactions">
        <RecentOrdersTable orders={currentData.recentOrders} />
      </section>

      {/* 5. Footer */}
      <Footer />
    </div>
  );
}
