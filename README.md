# Retail Sales and Customer Analytics Dashboard

A comprehensive, full-stack Business Analytics college project demonstrating six practical data topics:
1. **Excel Logical Formulas:** IF, Nested IF, AND, OR, NOT, IFERROR, SUMIF, AVERAGEIF, and COUNTIF.
2. **Excel Pivot Tables:** Multi-dimensional cross-tabulation across Category, Region, Revenue, and Profit with detailed replication instructions.
3. **SQL Database Operations:** Relational schema design, constraints, primary/foreign keys, joins, and aggregations.
4. **Customer Spending Analysis:** Calculating customer lifetime spend and isolating inactive accounts using `LEFT JOIN`, `SUM`, `GROUP BY`, and `COALESCE`.
5. **Tableau Data Visualization:** Star-schema denormalized dataset export, calculated fields, and a 6-step dashboard workbook guide.
6. **Interactive Business Dashboard:** Polished, responsive executive interface built with React, Tailwind CSS, Recharts, and Python Flask with INR (₹) formatting.

---

## 1. System Technology Stack

- **Frontend:** React 18, Vite, Tailwind CSS, Recharts, Lucide Icons
- **Backend:** Python 3.10+, Flask REST API, Flask-CORS
- **Database Engine:** MySQL 8.0+ / 9.x (Database: `retail_analytics`) with SQLite dual-engine fallback support
- **Data Exchange:** CSV and Excel `.xlsx` multi-sheet workbooks (via `pandas` and `openpyxl`)
- **Testing:** Pytest automated calculation and integration test suite

---

## 2. Quick Start & Execution Guide

### ⚡ 1-Step Instant Run (Recommended)
After cloning, run the automated setup script which configures environments, installs dependencies, verifies the database, and launches the application:
```bash
# Clone the repository
git clone https://github.com/divyanshu5357/Retail_pulse.git
cd Retail_pulse

# Run the unified launcher (auto-installs & starts everything)
./run.sh
```
*The script automatically opens http://127.0.0.1:5173 in your default browser.*

---

### Manual Setup (Step-by-Step Alternative)

#### Prerequisites
- Python 3.10+ installed
- Node.js (v18+) and npm installed
- MySQL Server (optional; automated SQLite fallback runs if MySQL is offline)


### Step 2: Backend Setup & Virtual Environment
```bash
cd backend

# Create virtual environment if not already present
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### Step 3: Configure Environment (.env)
Copy the template configuration:
```bash
cp .env.example .env
```
Inside `backend/.env`, configure your MySQL credentials:
```ini
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=1234
DB_NAME=retail_analytics
PORT=5001
FLASK_ENV=development
```

### Step 4: Seed Database & Generate Export Files
Run the reproducible seeder (generates 110 customers, 24 products, 280 orders, 530 items, and all CSV/Excel files):
```bash
python seed_data.py
```
*Expected Output:*
```
[Seed] Generating synthetic retail dataset...
[Seed] Applying schema.sql...
[Seed] Schema applied successfully.
[Seed] Seeding 110 customers, 24 products, 280 orders, 530 items...
[Seed] Data insertion complete.
[Seed] Exported CSVs to backend/exports
[Seed] Exported standalone SQL seed file to backend/sql/seed.sql
[Seed] Generated Excel workbook at backend/exports/retail_analytics_workbook.xlsx
```

### Step 5: Run Automated Tests
Verify all business formulas, customer lifetime values, and inactive customer detection:
```bash
pytest tests/
```
*Expected Output:*
```
============================== 11 passed in 0.48s ==============================
```

### Step 6: Start Backend Server
```bash
python app.py
```
*The backend server will run on `http://127.0.0.1:5001`.*

---

### Step 7: Frontend Setup & Start Dev Server
Open a second terminal window:
```bash
cd /Users/sakshisingh/Desktop/college_stuffs/Business_Analytics/frontend

# Install dependencies (first time only)
npm install

# Start Vite development server
npm run dev
```
*The frontend dashboard will be live at `http://localhost:5173`.*

---

## 3. Dashboard Navigation & Feature Matrix

| Sidebar Page | Key Features & Educational Topics |
|---|---|
| **Overview** | 6 KPI cards (Total Revenue ₹, Orders, Customers, Products, AOV, Inactive Customers), 6 Recharts visuals (Monthly trend, Category revenue, Regional sales, Top products, Spending tiers, Order statuses). Synchronized global Date, Region, and Category filters. |
| **Sales Analysis** | Monthly profit velocity, margin % efficiency curves, category revenue share, and fulfillment tracking. |
| **Customers** | Complete customer directory powered by `LEFT JOIN` and `COALESCE`. 21 inactive customers isolated with ₹0 spending. Spending segmentation (Platinum, Gold, Silver, Bronze, Inactive). Customer Order History Modal. |
| **Products** | Catalog items ranked by net revenue, unit prices, cost benchmarks, realized profit, and low-sales alert badge (<10 units sold). |
| **Orders** | Searchable transactions log with date, region, and status filters. Line Items Detail Modal showing item price, quantity, discount %, and profit. |
| **Excel Practical** | Detailed breakdown of the 9 required formulas (`IF`, `Nested IF`, `AND`, `OR`, `NOT`, `IFERROR`, `SUMIF`, `AVERAGEIF`, `COUNTIF`) with live sample data, copyable formula buttons, and cell coordinates. |
| **Excel Pivot Table** | Comprehensive guide covering Rows, Columns, Values, and Filters. Live pre-calculated category × region matrix simulation and step-by-step reproduction instructions. |
| **SQL Analysis** | Safe SQL analytical query playground with 6 pre-configured queries demonstrating joins, groupings, time series, and ranking. Live execution tables with record counts. |
| **Tableau Export** | 1-click download hub for `tableau_sales_master.csv` and normalized dimension tables, accompanied by a 6-step Tableau workbook creation workflow. |
| **Settings** | Live MySQL database telemetry, table row counts, 1-click database reseed tool, and CSV batch sales upload with schema validation. |

---

## 4. Academic Documentation Directory

Detailed guides are located in the `docs/` folder:
- **`docs/TABLEAU_SETUP_GUIDE.md`**: Step-by-step guide for creating Tableau worksheets, dual-axis charts, and interactive dashboard filter actions.
- **`docs/EXCEL_PRACTICAL_GUIDE.md`**: Reference guide for all 9 logical formulas, cell references, expected results, and Pivot Table configuration.
- **`docs/ARCHITECTURE.md`**: Detailed system architecture, entity-relationship diagrams, schema constraints, and financial calculation formulas.

---

## 5. File Structure

```
Business_Analytics/
├── backend/
│   ├── app.py                      # Flask REST API entrypoint & routes
│   ├── config.py                   # Environment & directory configuration
│   ├── db.py                       # MySQL connection pool & SQLite fallback
│   ├── seed_data.py                # Synthetic dataset generator & seeder
│   ├── export_manager.py           # CSV and Excel workbook exporter (.xlsx)
│   ├── analytical_queries.py       # Predefined SQL queries for SQL Playground
│   ├── conftest.py                 # Pytest configuration
│   ├── requirements.txt            # Python dependencies
│   ├── .env                        # Active local configuration
│   ├── .env.example                # Configuration template
│   ├── exports/                    # Generated downloadable artifacts
│   │   ├── tableau_sales_master.csv
│   │   ├── customers.csv
│   │   ├── products.csv
│   │   ├── orders.csv
│   │   ├── order_items.csv
│   │   └── retail_analytics_workbook.xlsx
│   ├── sql/
│   │   ├── schema.sql              # Normalized MySQL DDL & views
│   │   ├── seed.sql                # Standalone INSERT statements
│   │   └── analytical_queries.sql  # All required analytical SQL queries
│   └── tests/
│       ├── test_calculations.py    # Unit tests for calculations & logic
│       └── test_api.py             # Flask endpoint integration tests
├── frontend/
│   ├── src/
│   │   ├── components/             # Sidebar, Navbar, FilterBar, KPICard, Modal
│   │   ├── pages/                  # 10 dedicated dashboard pages
│   │   ├── services/api.js         # API client & INR currency formatters
│   │   ├── App.jsx                 # App layout & routing
│   │   ├── main.jsx
│   │   └── index.css               # Tailwind CSS base styles
│   ├── index.html
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
├── docs/
│   ├── TABLEAU_SETUP_GUIDE.md
│   ├── EXCEL_PRACTICAL_GUIDE.md
│   └── ARCHITECTURE.md
├── package.json                    # Root project scripts
└── README.md                       # Main project documentation
```
