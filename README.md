# Retail Sales & Customer Analytics: Excel, MySQL & Tableau

**Academic Specialization:** Business Analytics & Data Visualization  
**Deliverables Scope:** Microsoft Excel Workbook, MySQL Database Scripts & Execution, Tableau Interactive Dashboard  
**Architecture Policy:** Pure Data Analytics Deliverables Only (No web applications, no frontends, no backends, no web servers).

---

## 1. Environment Verification Audit

Prior to generating project deliverables, the local workstation environment was audited:

| Analytics Tool | Installation Path | Detected Version | Operational Status |
|---|---|---|---|
| **Microsoft Excel** | `/Applications/Microsoft Excel.app` | Version 16.112 (Office 365 / Mac) | Available & Verified |
| **MySQL Workbench** | `/Applications/MySQLWorkbench.app` | Version 8.0.44 CE | Running |
| **MySQL Server** | `/usr/local/mysql/bin/mysqld` | Version 9.5.0 Community Server | Running on port `3306` |
| **Tableau Public** | `/Applications/Tableau Public (Apple silicon).app` | Version 2026.3.0 (Apple Silicon) | Available & Verified |

---

## 2. Repository Layout

```
BaProject/
├── 01_MySQL/
│   ├── 01_schema_and_views.sql        # DDL: Tables (customers, products, orders, order_items) & Views
│   ├── 02_seed_data.sql               # DML: Insert statements for 110 customers, 24 products, 280 orders, 530 items
│   ├── 03_analytical_queries.sql      # 11 analytical query topics (aggregates, joins, CTEs, window functions)
│   ├── run_and_validate.sh            # 1-Click execution & validation shell script
│   └── QUERY_EXECUTION_RESULTS.md     # Complete documented query outputs verified against live database
│
├── 02_Excel/
│   ├── retail_sales_analytics.xlsx    # Master formatted Excel workbook (5 sheets, formulas, KPI cards, chart)
│   ├── generate_excel_workbook.py     # Python generator script (openpyxl) to reproduce the workbook
│   └── EXCEL_PIVOT_TABLE_PRACTICAL_GUIDE.md  # Step-by-step guide for formulas & native Excel Pivot Tables
│
├── 03_Tableau/
│   ├── tableau_sales_master.csv       # Denormalized 530-row master reporting dataset
│   ├── retail_sales_dashboard.twbx    # Native Packaged Tableau Workbook (1-click launch)
│   ├── retail_sales_dashboard.twb     # Native Tableau XML Workbook file
│   ├── generate_tableau_workbook.py   # Generator script for Tableau XML and packaging
│   └── TABLEAU_DASHBOARD_BUILD_GUIDE.md # Exact click-by-click instructions for Tableau sheets & dashboard
│
├── dashboard/                         # React + Vite + Tailwind CSS frontend dashboard
│   ├── src/data/demoData.js           # Isolated demo dataset (KPIs, trends, categories, orders)
│   ├── src/components/                # Reusable React components (Header, KpiCard, Charts, Table)
│   └── src/App.jsx                    # Single-screen compact dashboard layout
│
├── DATASET_DICTIONARY.md              # Complete relational schema, dimensions, measures, and formula definitions
└── README.md                          # Executive project documentation and quickstart instructions
```

---

## 3. Tool Deliverables Summary

### Deliverable 1: MySQL Database & Analytical Queries (`01_MySQL/`)
* **Relational Schema:** Normalized into 4 entities with primary keys, foreign keys, cascade constraints, and check constraints (`quantity > 0`, `discount_percent <= 100`).
* **Analytical Views:**
  - `v_customer_summary`: Computes lifetime spend and loyalty segments using `LEFT JOIN` and `COALESCE` to retain inactive users.
  - `v_tableau_sales_master`: Denormalized master sales view joining orders, customers, items, and products with temporal hierarchies.
* **Master Query Suite (`03_analytical_queries.sql`):** Covers 11 industry-standard analytical topics:
  1. *Basic SELECT, Filtering & Sorting:* Premium products priced > ₹2,000 with margin %.
  2. *Multi-table INNER JOIN:* Fulfillment tracking across geographic territories.
  3. *GROUP BY Aggregations:* Category performance (volume, units, average price, net revenue, profit, margin %).
  4. *Regional Performance:* Regional revenue, profit, and Average Order Value (AOV).
  5. *Customer Lifetime Value (CLV):* Customer tiering (`Platinum`, `Gold`, `Silver`, `Bronze`, `Inactive`).
  6. *Inactive Customer Identification:* Audits registered users with 0 orders (found 21 inactive accounts / 19.09%).
  7. *Monthly Sales Trend:* MoM revenue and gross margin progression over 12 months.
  8. *Top 10 Best Selling SKUs:* Product ranking by net revenue.
  9. *Window Functions (DENSE_RANK):* Product ranking within individual categories.
  10. *Window Functions (Running Total):* Cumulative revenue trajectory reaching **₹2,160,920.75**.
  11. *Common Table Expressions (CTE):* Customer repeat purchase analysis (38.18% repeat buyers, 23.64% champions).
* **Live Execution:** All queries are executed against MySQL 9.5 and verified in `QUERY_EXECUTION_RESULTS.md`.

### Deliverable 2: Microsoft Excel Workbook (`02_Excel/`)
* **File:** `02_Excel/retail_sales_analytics.xlsx`
* **Worksheet Architecture:**
  1. `Executive_KPI_Dashboard`: Top corporate KPI cards (Total Revenue: ₹2.16M, Gross Profit: ₹671.8K, Margin: 31.09%, Orders: 247, AOV: ₹8,748.67), Category Performance Table, Regional Table, and native Excel Clustered Column Chart.
  2. `Sales_Transactions`: All 530 sanitized transactions with currency formatting (`₹#,##0.00`), date formatting, and calculated gross/discount/net amounts.
  3. `Advanced_Formulas_Lab`: Complete implementations of **IF**, **Nested IF**, **AND**, **OR**, **NOT**, **IFERROR**, **SUMIF**, **AVERAGEIF**, and **COUNTIF**, plus a 15-order dynamic testing grid.
  4. `Pivot_Summary_Matrix`: Dynamic 5x5 cross-tabulation table using Excel `SUMIFS` formulas calculating net revenue and profit across categories and regions.
  5. `Customer_Lifetime_Value`: Customer directory tracking 110 accounts with automated tiering formulas.
* **Practical Guide:** `EXCEL_PIVOT_TABLE_PRACTICAL_GUIDE.md` details how to insert dynamic Pivot Tables, configure quadrants (Filters, Columns, Rows, Values), format numbers, and add Slicers.

### Deliverable 3: Tableau Interactive Dashboard (`03_Tableau/`)
* **Files:** `retail_sales_dashboard.twbx` (Packaged Workbook) and `retail_sales_dashboard.twb` (XML Workbook).
* **Worksheet Views:**
  1. `Monthly_Revenue_Trend`: Dual-axis synchronized chart combining a Royal Blue Bar chart for Net Revenue and an Emerald Green Line chart with markers for Profit.
  2. `Category_Performance`: Sorted horizontal bar chart colored with Orange-Blue diverging gradient representing Profit Margin %.
  3. `Regional_Sales_Distribution`: Geographic revenue breakdown across Central, East, North, South, and West territories.
  4. `Top_Customer_Spenders`: Top 15 customer accounts ranked by lifetime spend.
* **Interactive Dashboard:** `Retail_Sales_Executive_Dashboard` combines all four sheets into a fixed 1280x850 px canvas with global regional filters and dynamic category cross-filtering action.
* **Build Guide:** `TABLEAU_DASHBOARD_BUILD_GUIDE.md` contains exact click-by-click instructions to build or modify every sheet in Tableau Public.

---

## 4. Quickstart Execution Guide

### Open in Microsoft Excel
Double-click `02_Excel/retail_sales_analytics.xlsx` or run:
```bash
open "02_Excel/retail_sales_analytics.xlsx"
```

### Run and Validate in MySQL
Execute the automated test runner in Terminal:
```bash
./01_MySQL/run_and_validate.sh
```
Or open `01_MySQL/03_analytical_queries.sql` in **MySQL Workbench** (`/Applications/MySQLWorkbench.app`) connected to `root@127.0.0.1:3306`.

### Open in Tableau Public
Double-click `03_Tableau/retail_sales_dashboard.twbx` or run:
```bash
open -a "/Applications/Tableau Public (Apple silicon).app" 03_Tableau/retail_sales_dashboard.twbx
```

### Launch React Frontend Dashboard
Start the compact presentation web dashboard:
```bash
npm run dev
# or: cd dashboard && npm run dev
```
Then visit: `http://localhost:5173`

