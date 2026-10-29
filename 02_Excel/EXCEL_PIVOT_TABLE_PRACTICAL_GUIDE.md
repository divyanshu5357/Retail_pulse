# Advanced Excel Analytics & Dynamic Pivot Table Practical Guide

**Project:** Retail Sales and Customer Analytics  
**Primary Deliverable:** `retail_sales_analytics.xlsx`  
**Application:** Microsoft Excel for Mac / Windows (v16.x / Office 365)  

---

## 1. Structure of the Excel Analytics Workbook

The generated Excel file `retail_sales_analytics.xlsx` contains five interconnected worksheets:

1. **`Executive_KPI_Dashboard`**: High-level corporate scorecards featuring Total Revenue, Gross Profit, Overall Profit Margin %, Completed Order Count, and Average Order Value (AOV). Includes dynamic category and regional performance tables and an embedded native Excel column chart.
2. **`Sales_Transactions`**: 530 sanitized, formatted order item rows spanning 280 orders. Contains fields for order date, customer, region, city, product, category, quantity, unit price, discounts, gross/net revenue, cost, profit, margin %, and fulfillment status.
3. **`Advanced_Formulas_Lab`**: Complete implementation of 9 core business analytics formulas with syntax explanation, target column coordinates, and a live row-by-row 15-order test grid.
4. **`Pivot_Summary_Matrix`**: Dynamic 5x5 cross-tabulation table using Excel `SUMIFS` formulas calculating net revenue and profit across all five product categories and five geographic regions.
5. **`Customer_Lifetime_Value`**: Customer directory spanning all 110 registered accounts with lifetime spend, completed order counts, and automated RFM/spending tier classification (`Platinum`, `Gold`, `Silver`, `Bronze`, `Inactive`).

---

## 2. Advanced Logical & Aggregate Formulas

All formulas directly reference columns in the `Sales_Transactions` worksheet:
- **Col D:** `Region`
- **Col G:** `Category`
- **Col H:** `Quantity`
- **Col I:** `Unit_Price_INR`
- **Col K:** `Gross_Amount_INR`
- **Col M:** `Net_Amount_INR`
- **Col N:** `Total_Cost_INR`
- **Col O:** `Profit_INR`
- **Col Q:** `Order_Status`

### Formula 1: IF (Binary Value Classification)
* **Syntax:** `=IF(M2>=5000, "High Value", "Standard")`
* **Target:** Net Amount (`Col M`)
* **Business Logic:** Evaluates if a transaction total is ₹5,000 or greater. Orders meeting or exceeding the threshold receive `"High Value"`; otherwise tagged `"Standard"`.

### Formula 2: Nested IF (Multi-Tier Volume Grading)
* **Syntax:** `=IF(M2>=25000, "Tier 1", IF(M2>=10000, "Tier 2", IF(M2>=3000, "Tier 3", "Tier 4")))`
* **Target:** Net Amount (`Col M`)
* **Business Logic:** Hierarchical cascading evaluation:
  - **Tier 1:** Spending ≥ ₹25,000 (Bulk/Wholesale purchases)
  - **Tier 2:** ₹10,000 to ₹24,999.99 (High-value consumer baskets)
  - **Tier 3:** ₹3,000 to ₹9,999.99 (Standard baskets)
  - **Tier 4:** Below ₹3,000 (Impulse/Accessory purchases)

### Formula 3: AND (Conjunctive Multi-Condition Test)
* **Syntax:** `=IF(AND(M2>=5000, Q2="Delivered"), "Qualifies For Loyalty Bonus", "No Bonus")`
* **Target:** Net Amount (`Col M`) and Order Status (`Col Q`)
* **Business Logic:** Both conditions must evaluate to TRUE. Prevents issuing rewards or loyalty points on cancelled orders.

### Formula 4: OR (Disjunctive Territory Test)
* **Syntax:** `=IF(OR(D2="North", D2="South"), "Priority Delivery Zone", "Standard Zone")`
* **Target:** Region (`Col D`)
* **Business Logic:** Tags shipments routing to primary fulfillment logistics hubs (North or South).

### Formula 5: NOT (Logical Negation for Financial Auditing)
* **Syntax:** `=IF(NOT(Q2="Cancelled"), "Valid Sale", "Excluded")`
* **Target:** Order Status (`Col Q`)
* **Business Logic:** Excludes cancelled transactions from realized net revenue calculations.

### Formula 6: IFERROR (Fault-Tolerant Margin Protection)
* **Syntax:** `=IFERROR(O2/M2, 0)`
* **Target:** Profit (`Col O`) / Net Revenue (`Col M`)
* **Business Logic:** Traps runtime `#DIV/0!` and `#VALUE!` errors whenever net revenue is zero, returning a clean `0.00%`.

### Formula 7: SUMIF (Single-Condition Financial Summation)
* **Syntax:** `=SUMIF(Sales_Transactions!G:G, "Electronics", Sales_Transactions!M:M)`
* **Target:** Category (`Col G`) and Net Amount (`Col M`)
* **Business Logic:** Scans the entire Category column and aggregates the total net revenue for Electronics (evaluates to **₹1,309,620.37**).

### Formula 8: AVERAGEIF (Conditional Mean Ticket Size)
* **Syntax:** `=AVERAGEIF(Sales_Transactions!G:G, "Fashion", Sales_Transactions!M:M)`
* **Target:** Category (`Col G`) and Net Amount (`Col M`)
* **Business Logic:** Calculates the average order item ticket price specifically for Fashion merchandise (evaluates to **₹2,845.53**).

### Formula 9: COUNTIF (Order Fulfillment Frequency)
* **Syntax:** `=COUNTIF(Sales_Transactions!Q:Q, "Delivered")`
* **Target:** Order Status (`Col Q`)
* **Business Logic:** Counts the total number of orders that have been successfully delivered to the customer (evaluates to **382**).

---

## 3. Step-by-Step Instructions: Building Native Excel Pivot Tables

While `retail_sales_analytics.xlsx` contains pre-calculated cross-tabulation matrices in the `Pivot_Summary_Matrix` sheet, follow these 6 steps in Microsoft Excel to create an interactive, dynamic drag-and-drop Pivot Table:

### Step 1: Open and Select Source Data
1. Launch **Microsoft Excel** and open `02_Excel/retail_sales_analytics.xlsx`.
2. Click on the tab **`Sales_Transactions`**.
3. Click anywhere inside the data table (e.g., cell `A1`).
4. Press `Ctrl + A` (Windows) or `Cmd + A` (Mac) to select the full range `$A$1:$Q$531`.

### Step 2: Insert the PivotTable
1. In the top Excel Ribbon menu, click the **Insert** tab.
2. Click **PivotTable** (the leftmost icon on the ribbon).
3. In the dialog that appears:
   - **Table/Range:** Ensure `Sales_Transactions!$A$1:$Q$531` is selected.
   - **Place the PivotTable:** Select **New Worksheet**.
4. Click **OK**. A new blank PivotTable canvas and the **PivotTable Fields** side pane will appear.

### Step 3: Configure the Four Pivot Quadrants
In the **PivotTable Fields** pane on the right-hand side, drag the fields into their respective areas:

```
+----------------------------------------------------------------------+
|                     PIVOT TABLE FIELD PLACEMENT                      |
+------------------------------------+---------------------------------+
| 1. FILTERS (Page Filter)           | 2. COLUMNS                      |
|    Drag: Order_Status              |    Drag: Region                 |
+------------------------------------+---------------------------------+
| 3. ROWS                            | 4. VALUES (∑)                   |
|    Drag: Category                  |    Drag: Net_Amount_INR         |
|                                    |    Drag: Profit_INR             |
+------------------------------------+---------------------------------+
```

### Step 4: Configure Filters & Number Formats
1. **Exclude Cancelled Orders:**
   - In cell `B1` (where `Order_Status` filter is placed), click the filter dropdown arrow.
   - Check **Select Multiple Items**.
   - Uncheck **Cancelled** (leaving Delivered, Shipped, Processing checked).
   - Click **OK**.
2. **Format as Currency:**
   - In the PivotTable, right-click any number under `Sum of Net_Amount_INR`.
   - Click **Number Format...** (do NOT click Format Cells).
   - Select **Currency**.
   - Symbol: **₹ English (India)** or Standard Currency.
   - Decimal places: `2`.
   - Click **OK**.
   - Repeat for `Sum of Profit_INR`.

### Step 5: Insert Interactive Slicers
1. Click anywhere inside your new Pivot Table.
2. In the top ribbon, click **PivotTable Analyze** (or **Analyze**).
3. Click **Insert Slicer**.
4. In the checklist, check:
   - ☑ **Region**
   - ☑ **Category**
5. Click **OK**.
6. Two floating slicer buttons will appear on your sheet. You can now click any button (e.g., `"North"` or `"Electronics"`) to instantly filter the entire Pivot Table!

### Step 6: Insert a Pivot Chart
1. Click inside the Pivot Table.
2. In the ribbon, click **PivotTable Analyze > PivotChart** (or **Insert > Clustered Column**).
3. Choose **Clustered Column** and click **OK**.
4. Format the chart title to `"Category Revenue & Profit by Region"`.

---

## 4. Benchmark Validation Matrix

When your Pivot Table is created, verify that your numbers match the pre-calculated `Pivot_Summary_Matrix` sheet and SQL database totals:

| Category | Central (₹) | East (₹) | North (₹) | South (₹) | West (₹) | Total Net Revenue (₹) | Total Profit (₹) |
|---|---|---|---|---|---|---|---|
| **Electronics** | ₹314,188.34 | ₹446,738.07 | ₹273,245.35 | ₹254,731.01 | ₹309,762.15 | **₹1,309,620.37** | **₹318,970.37** |
| **Fashion** | ₹52,783.49 | ₹48,800.05 | ₹62,534.93 | ₹79,643.37 | ₹47,707.44 | **₹256,098.00** | **₹130,148.00** |
| **Groceries** | ₹17,229.12 | ₹12,622.53 | ₹12,920.00 | ₹12,764.40 | ₹12,082.35 | **₹61,429.58** | **₹19,679.58** |
| **Home & Living** | ₹99,000.38 | ₹83,039.14 | ₹86,144.14 | ₹79,192.37 | ₹75,208.78 | **₹344,141.83** | **₹125,231.83** |
| **Sports** | ₹37,435.82 | ₹13,583.21 | ₹68,481.36 | ₹52,559.95 | ₹55,006.56 | **₹189,630.97** | **₹77,810.97** |
| **Grand Total** | **₹481,929.73** | **₹587,562.60** | **₹370,644.64** | **₹398,468.80** | **₹322,314.98** | **₹2,160,920.75** | **₹671,841.75** |
