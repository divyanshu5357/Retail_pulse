# Tableau Setup & Data Visualization Guide

**Project:** Retail Sales and Customer Analytics Dashboard  
**Academic Module:** Tableau Data Visualization & Business Dashboards  

---

## 1. Overview & Data Sources

This guide walks you through connecting Tableau Desktop or Tableau Public to your retail data and building an interactive sales and customer performance workbook.

### Data Ingestion Methods

Tableau can connect to your data using either of two methods:

### Method A: Live / Extract Connection to MySQL (Recommended)
1. Launch Tableau Desktop.
2. In the **Connect** panel under **To a Server**, choose **MySQL**.
3. Configure the connection parameters:
   - **Server:** `127.0.0.1` (or `localhost`)
   - **Port:** `3306`
   - **Database:** `retail_analytics`
   - **Username:** `root`
   - **Password:** `1234` (or your configured MySQL password)
4. Select the analytical view `v_tableau_sales_master` or drag the normalized tables (`orders`, `customers`, `order_items`, `products`) and set up standard foreign key relationships.

### Method B: Connecting via Exported CSVs
If connecting to MySQL is restricted or you are using Tableau Public Web:
1. In Tableau's **Connect** panel under **To a File**, click **Text file**.
2. Browse to `backend/exports/tableau_sales_master.csv` (or download it directly from the **Tableau Export** page in the web app).
3. The dataset is already denormalized, clean, and UTF-8 encoded with date hierarchies and financial calculations.

---

## 2. Step-by-Step Worksheet Construction

### Sheet 1: Monthly Revenue & Profit Trend (Dual-Axis Chart)
1. **Columns:** Drag `Order Date` to Columns. Right-click and choose **Month** (Continuous, May 2024 format).
2. **Rows:** Drag `Net Revenue` to Rows.
3. Drag `Profit` to Rows (next to Net Revenue).
4. Right-click the `Profit` pill on the Rows shelf and select **Dual Axis**.
5. Right-click the right axis (Profit) and select **Synchronize Axis**.
6. On the **Marks** card:
   - For `Net Revenue`: Set Mark type to **Bar**. Change color to Classic Blue (`#2563EB`).
   - For `Profit`: Set Mark type to **Line**. Change color to Emerald Green (`#10B981`) and add circle markers.
7. Title the sheet: `Monthly Sales & Profit Velocity`.

---

### Sheet 2: Category Performance & Profit Margins (Sorted Bar)
1. **Columns:** Drag `Net Revenue` to Columns.
2. **Rows:** Drag `Category` to Rows.
3. Click the sort icon on the axis to sort descending by revenue.
4. Drag `Profit Margin Pct` to the **Color** card.
5. Click **Color > Edit Colors** and select **Orange-Blue Diverging**, centered at `20%`.
6. Drag `Units Sold` to **Tooltip** for interactive hover inspections.
7. Title the sheet: `Revenue Contribution by Merchandise Category`.

---

### Sheet 3: Regional Sales Distribution
1. **Columns:** Drag `Region` to Columns.
2. **Rows:** Drag `Net Revenue` to Rows.
3. Drag `Region` to **Color** to give distinct palettes to North, South, East, West, and Central.
4. Drag `Discount Amount` and `Gross Amount` into **Tooltip**.
5. Title the sheet: `Geographic Sales Distribution across India`.

---

### Sheet 4: Customer Lifetime Spending Tiers (Segment Treemap / Bar)
1. **Columns:** Drag `Customer Name` to Columns (or create a calculated field `Spending Tier`).
2. **Rows:** Drag `Net Revenue` to Rows.
3. Filter `Customer Name` by Top 15 by `SUM(Net Revenue)`.
4. Drag `Customer Segment` to **Color**.
5. Title the sheet: `Top Customer Spenders & Tier Analysis`.

---

## 3. Assembling the Interactive Dashboard

1. Click **New Dashboard** at the bottom of Tableau.
2. Set Dashboard Size to **Fixed Size: 1280 x 850 px** (Standard Laptop/Widescreen).
3. Drag the four sheets onto the canvas in a balanced 2x2 grid layout:
   - **Top Left:** Monthly Revenue & Profit Trend
   - **Top Right:** Category Performance
   - **Bottom Left:** Regional Sales Distribution
   - **Bottom Right:** Customer Spending Tiers
4. **Interactive Filters:**
   - Click the **Monthly Revenue** sheet > click its small dropdown arrow > **Filters > Region**.
   - Change filter style to **Multiple Values (dropdown)**.
   - Click the filter dropdown arrow > **Apply to Worksheets > All Using This Data Source**.
   - Repeat for **Category** and **Order Date Range**.
5. **Dashboard Cross-Filtering Actions:**
   - In the top menu, go to **Dashboard > Actions...**
   - Click **Add Action > Filter...**
   - Name: `Interactive Category Filter`
   - Source Sheets: Select `Category Performance`
   - Run action on: `Select` (click)
   - Target Sheets: Select `Monthly Trend`, `Regional Sales`, and `Customer Spenders`.
   - Clearing the selection will: `Show all values`.
   - Now, clicking any Category bar in the dashboard instantly filters all other charts dynamically!

---

## 4. Academic Data Dictionary

| Column Name | Data Type | Role | Business Description |
|---|---|---|---|
| `order_id` | Integer | Dimension | Unique sales transaction identifier |
| `order_date` | Date | Dimension | Date of order placement |
| `order_year_month` | String | Dimension | Formatted YYYY-MM period for monthly grouping |
| `order_status` | String | Dimension | Fulfillment status (Delivered, Shipped, Processing, Cancelled) |
| `region` | String | Dimension | Geographic territory (North, South, East, West, Central) |
| `customer_id` | Integer | Dimension | Unique customer account key |
| `customer_name` | String | Dimension | Customer full name |
| `city` | String | Dimension | Delivery municipality |
| `category` | String | Dimension | Product department (Electronics, Fashion, etc.) |
| `quantity` | Integer | Measure | Quantity of items purchased |
| `unit_price` | Decimal | Measure | Selling price per unit (INR ₹) |
| `discount_percent`| Decimal | Measure | Promotional discount percentage (0% to 25%) |
| `net_revenue` | Decimal | Measure | Quantity × Unit Price × (1 - Discount/100) |
| `total_cost` | Decimal | Measure | Quantity × Manufacturing/Wholesale Cost |
| `profit` | Decimal | Measure | Net Revenue - Total Cost |
| `profit_margin_pct` | Decimal | Measure | (Profit / Net Revenue) × 100 |
