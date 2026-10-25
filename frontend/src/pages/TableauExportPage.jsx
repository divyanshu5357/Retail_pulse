import React from 'react';
import {
  BarChart3,
  Download,
  Database,
  FileSpreadsheet,
  Layers,
  CheckCircle2,
  ExternalLink,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { getDownloadUrl } from '../services/api';

export default function TableauExportPage() {
  const exportFiles = [
    {
      name: 'tableau_sales_master.csv',
      title: 'Tableau Denormalized Master Dataset',
      badge: 'Primary Tableau Source',
      description: 'Fully joined star-schema extract including customer, product, date hierarchy, quantity, discounts, net revenue, and margin.',
      rows: '530 Records',
      color: 'blue'
    },
    {
      name: 'customers.csv',
      title: 'Customers Dimension (CSV)',
      badge: 'Dimension',
      description: 'Includes 110 customer records, geographical regions, registration dates, and inactive customer accounts for retention studies.',
      rows: '110 Records',
      color: 'slate'
    },
    {
      name: 'products.csv',
      title: 'Products Dimension (CSV)',
      badge: 'Dimension',
      description: 'Product catalog with category taxonomy, base selling prices, and manufacturing cost benchmarks.',
      rows: '24 Records',
      color: 'slate'
    },
    {
      name: 'orders.csv',
      title: 'Orders Fact Table (CSV)',
      badge: 'Fact Header',
      description: 'Order transactions with fulfillment statuses, timestamps, customer references, and delivery zones.',
      rows: '280 Records',
      color: 'slate'
    },
    {
      name: 'order_items.csv',
      title: 'Order Items Fact Table (CSV)',
      badge: 'Line Items Fact',
      description: 'Itemized transaction records with quantities, purchase prices, and promotional discount percentages.',
      rows: '530 Records',
      color: 'slate'
    }
  ];

  const dashboardSteps = [
    {
      step: 1,
      title: 'Connect Tableau to Data Source',
      action: 'Open Tableau Desktop or Tableau Public. In the Connect panel, click "Text File" and select tableau_sales_master.csv (or select "To a Server > MySQL", enter Server: 127.0.0.1, Port: 3306, Database: retail_analytics).'
    },
    {
      step: 2,
      title: 'Sheet 1: Monthly Revenue & Profit Trend',
      action: 'Drag Order Date to Columns, right-click and set to Month (Continuous). Drag Net Revenue to Rows. Drag Profit to Rows, right-click Profit axis > Dual Axis > Synchronize Axis. Set Revenue to Bar and Profit to Line.'
    },
    {
      step: 3,
      title: 'Sheet 2: Category Performance Treemap / Bar',
      action: 'Drag Category to Columns and Net Revenue to Rows. Sort descending. Drag Profit Margin Pct to Color mark. Select Color palette "Orange-Blue Diverging" centered at 20%.'
    },
    {
      step: 4,
      title: 'Sheet 3: Regional Sales Geographic / Bar Chart',
      action: 'Drag Region to Columns and Net Revenue to Rows. Drag Region to Color mark. Add Gross Amount and Discount Amount to Tooltip for granular hover inspection.'
    },
    {
      step: 5,
      title: 'Sheet 4: Customer Lifetime Spending Distribution',
      action: 'Create a calculated field "Spending Tier". Drag Customer Name to Rows and Net Revenue to Columns. Sort descending and filter to Top 15 VIP customers.'
    },
    {
      step: 6,
      title: 'Assemble Interactive Dashboard & Actions',
      action: 'Create a new Dashboard (1200x800). Drag all four sheets into a balanced 2x2 grid. Add Region and Category as Universal Filters (select "Apply to Worksheets > All Using This Data Source"). Go to Dashboard > Actions > Add Action > Filter: Use Category and Region sheets as interactive cross-filtering triggers!'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Disclaimer / Academic Notice (Requirement 11) */}
      <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 flex items-start space-x-3 text-xs text-amber-900">
        <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Academic Transparency Notice (Tableau Deliverable Requirement 11):</span>
          <p className="mt-0.5 text-amber-800 leading-relaxed">
            As native Tableau Desktop/Public binaries run as an external GUI application, this dashboard provides the verified, pre-cleaned Tableau-compatible datasets, SQL Views (<code className="font-mono bg-amber-100 px-1 py-0.2 rounded">v_tableau_sales_master</code>), and the step-by-step workbook creation instructions required to build and present the workbook in Tableau.
          </p>
        </div>
      </div>

      {/* Export Downloads Section */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Tableau-Ready Export Hub</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Download pre-formatted CSV extracts and relational dimension tables ready for direct ingestion in Tableau.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {exportFiles.map((f) => (
            <div
              key={f.name}
              className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                f.badge.includes('Primary')
                  ? 'border-blue-300 bg-blue-50/30'
                  : 'border-slate-200 bg-white'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-bold uppercase tracking-wider text-blue-600 font-mono">
                    {f.name}
                  </span>
                  <span className="px-2 py-0.5 rounded-full font-semibold bg-slate-100 text-slate-700">
                    {f.rows}
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 text-xs mt-2">{f.title}</h4>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{f.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-medium">UTF-8 Encoded</span>
                <a
                  href={getDownloadUrl(f.name)}
                  download
                  className="inline-flex items-center space-x-1 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Step-by-Step Tableau Guide */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center space-x-2">
          <BarChart3 className="w-4 h-4 text-blue-600" />
          <h3 className="text-sm font-bold text-slate-900">
            Step-by-Step Tableau Workbook Construction Guide
          </h3>
        </div>
        <p className="text-xs text-slate-500">
          Follow these structured instructions to build a publication-grade Tableau interactive dashboard.
        </p>

        <div className="space-y-4 pt-2">
          {dashboardSteps.map((s) => (
            <div key={s.step} className="flex items-start space-x-3 text-xs p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center flex-shrink-0 text-[11px] mt-0.5">
                {s.step}
              </span>
              <div>
                <p className="font-bold text-slate-900 text-xs">{s.title}</p>
                <p className="text-slate-600 mt-1 leading-relaxed">{s.action}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
