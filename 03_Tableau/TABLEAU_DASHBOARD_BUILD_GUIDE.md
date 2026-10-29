# Tableau Executive Dashboard Construction & Practical Guide

**Project:** Retail Sales and Customer Analytics  
**Primary Deliverables:**  
- `03_Tableau/retail_sales_dashboard.twbx` (Native Packaged Tableau Workbook)
- `03_Tableau/retail_sales_dashboard.twb` (Native Tableau XML Workbook)
- `03_Tableau/tableau_sales_master.csv` (Denormalized 530-Row Master Dataset)  
**Application:** Tableau Public (Apple silicon) / Tableau Desktop 2024.x – 2026.x  

---

## 1. Fast Track: 1-Click Launch

Because the native packaged workbook has already been created for you:
1. Double-click **`03_Tableau/retail_sales_dashboard.twbx`** in macOS Finder.
2. Or in Terminal, run:
   ```bash
   open -a "/Applications/Tableau Public (Apple silicon).app" 03_Tableau/retail_sales_dashboard.twbx
   ```
3. Tableau Public will open immediately with all 4 worksheets and the **`Retail_Sales_Executive_Dashboard`** pre-assembled!

---

## 2. Ingesting Data from Scratch (Two Methods)

If you wish to demonstrate building the workbook from scratch for academic viva or coursework:

### Method A: Connecting to the Clean Master CSV (Recommended for Tableau Public)
1. Launch **Tableau Public**.
2. On the start page under **Connect > To a File**, click **Text file**.
3. Navigate to `03_Tableau/tableau_sales_master.csv` and click **Open**.
4. The data source preview will show all 23 columns (Order details, Customer names, Cities, Categories, Quantities, Unit Prices, Discounts, Gross/Net Amounts, Profit, and Margins).
5. Click the orange **Sheet 1** tab at the bottom left to begin building.

### Method B: Live Connection to MySQL Database (Tableau Desktop)
1. On the start page under **Connect > To a Server**, click **MySQL**.
2. Configure the connection dialog:
   - **Server:** `127.0.0.1`
   - **Port:** `3306`
   - **Database:** `retail_analytics`
   - **Username:** `root`
   - **Password:** `1234`
3. Drag the pre-computed analytical view **`v_tableau_sales_master`** onto the canvas.

---

## 3. Step-by-Step Worksheet Construction

### Sheet 1: Monthly Revenue & Profit Velocity (Dual-Axis Chart)
* **Goal:** Visualize MoM revenue performance alongside gross profit trends.
1. Double-click the sheet tab and rename it: `Monthly_Revenue_Trend`.
2. **Columns:** Drag `order_date` to the Columns shelf. Right-click the pill and select **Month (Continuous)** (the second "Month" option showing *May 2025* format).
3. **Rows:** Drag `net_revenue` to the Rows shelf.
4. Drag `profit` to the Rows shelf right next to `SUM(net_revenue)`.
5. Right-click the `SUM(profit)` pill on the Rows shelf and select **Dual Axis**.
6. Right-click the secondary vertical axis on the right side of the chart and select **Synchronize Axis**.
7. In the **Marks** card:
   - Click `SUM(net_revenue)`: Change mark type from *Automatic* to **Bar**. Set color to Classic Royal Blue (`#2563EB`).
   - Click `SUM(profit)`: Change mark type to **Line**. Set color to Emerald Green (`#10B981`) and enable circle data markers under **Color > Effects**.
8. **Filter:** Drag `order_status` to the **Filters** card, uncheck `"Cancelled"`, and click **OK**.
9. Double-click the sheet title and enter: `Monthly Sales & Profit Velocity (Dual-Axis Trend)`.

---

### Sheet 2: Category Performance & Profit Margins (Horizontal Bar)
* **Goal:** Rank merchandise categories by sales volume and margin contribution.
1. Click the **New Worksheet** icon at the bottom. Rename it: `Category_Performance`.
2. **Rows:** Drag `category` to the Rows shelf.
3. **Columns:** Drag `net_revenue` to the Columns shelf.
4. Hover over the horizontal axis at the bottom and click the **Sort Descending** button (Electronics will rank #1 at ₹1.31M).
5. **Color Encoding:** Drag `profit_margin_pct` (or calculated margin) to the **Color** card.
6. Click **Color > Edit Colors...**:
   - Palette: Choose **Orange-Blue Diverging**.
   - Check **Stepped Color** (5 steps) or continuous gradient.
   - Click **OK**.
7. **Tooltip:** Drag `quantity` (Units Sold) and `profit` into the **Tooltip** card.
8. **Filter:** Drag `order_status` to **Filters**, exclude `"Cancelled"`.
9. Set Title: `Revenue Contribution by Merchandise Category`.

---

### Sheet 3: Regional Sales Distribution (Geographic Matrix)
* **Goal:** Evaluate geographic revenue spread across Central, East, North, South, and West territories.
1. Click **New Worksheet**. Rename it: `Regional_Sales_Distribution`.
2. **Columns:** Drag `region` to the Columns shelf.
3. **Rows:** Drag `net_revenue` to the Rows shelf.
4. **Color:** Drag `region` to the **Color** card.
5. In the Marks card, click **Label** and check **Show mark labels** so the exact revenue appears above each bar.
6. **Filter:** Exclude `Cancelled` orders via the `order_status` filter.
7. Set Title: `Geographic Sales Distribution across India`.

---

### Sheet 4: Top 15 Customer Spenders (Customer Lifetime Value)
* **Goal:** Identify VIP customer accounts for loyalty engagement.
1. Click **New Worksheet**. Rename it: `Top_Customer_Spenders`.
2. **Rows:** Drag `customer_name` to the Rows shelf.
3. **Columns:** Drag `net_revenue` to the Columns shelf.
4. Click Sort Descending.
5. **Top N Filter:**
   - Drag `customer_name` to the **Filters** card.
   - Click the **Top** tab.
   - Select **By field:** `Top` `15` by `net_revenue` `Sum`.
   - Click **OK**.
6. **Color:** Drag `net_revenue` to **Color** (Continuous Blue palette).
7. Set Title: `Top 15 Customer Accounts by Lifetime Spend`.

---

## 4. Assembling the Executive Interactive Dashboard

1. At the bottom tab bar, click the **New Dashboard** icon (grid with plus sign).
2. Rename the dashboard: `Retail_Sales_Executive_Dashboard`.
3. In the left **Dashboard** panel under **Size**:
   - Change from *Range* to **Fixed Size**.
   - Width: `1280 px`, Height: `850 px` (Standard Widescreen Laptop).
4. Drag a **Vertical** layout container onto the blank canvas.
5. **Arrange the 4 Worksheets in a 2x2 Grid:**
   - Top-Left: Drag in `Monthly_Revenue_Trend`.
   - Top-Right: Drag in `Category_Performance`.
   - Bottom-Left: Drag in `Regional_Sales_Distribution`.
   - Bottom-Right: Drag in `Top_Customer_Spenders`.
6. **Add Interactive Filters:**
   - Click on the `Category_Performance` sheet in the dashboard.
   - Click the small triangle (More Options) on its bounding box > **Filters > region**.
   - Position the filter at the top right of the dashboard.
   - In the filter's options, select **Multiple Values (dropdown)**.
   - Click the filter dropdown > **Apply to Worksheets > All Using This Data Source**.
7. **Configure Dynamic Cross-Filtering Action:**
   - In the top macOS/Tableau menu, click **Dashboard > Actions...**
   - Click **Add Action > Filter...**
   - **Name:** `Filter Dashboard by Category`
   - **Source Sheets:** Check `Category_Performance`.
   - **Run action on:** Select **Select** (click).
   - **Target Sheets:** Check `Monthly_Revenue_Trend`, `Regional_Sales_Distribution`, and `Top_Customer_Spenders`.
   - **Clearing the selection will:** Select **Show all values**.
   - Click **OK**, then click **OK**.
8. **Interactive Demonstration:**
   - Click on the **Electronics** bar in the Category chart: instantly, the monthly trend updates to show only electronics sales, the regional bars adjust to show regional electronics revenue, and the top customer list filters to show top electronics buyers!
   - Click the bar again to restore the full view.

---

## 5. Metric Reference & Validation Table

| Visual Component | Primary Metric | Aggregation | Benchmark Value |
|---|---|---|---|
| Monthly Trend Peak | Highest Revenue Month | SUM(net_revenue) | **Sep 2025: ₹307,391.12** |
| Top Merchandise Category | Electronics | SUM(net_revenue) | **₹1,309,620.37 (60.6%)** |
| Highest Profit Margin Category | Fashion | AVG(profit_margin_pct) | **50.82% Gross Margin** |
| Top Region | East Territory | SUM(net_revenue) | **₹587,562.60 (27.2%)** |
| VIP Customer Account | Sunil Agarwal (Guwahati) | SUM(net_revenue) | **₹160,702.10 (Platinum)** |
| Grand Realized Total | Net Sales (Delivered/Shipped/Proc) | SUM(net_revenue) | **₹2,160,920.75** |
