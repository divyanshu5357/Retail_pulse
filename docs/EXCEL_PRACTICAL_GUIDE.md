# Excel Practical & Pivot Table Reference Guide

**Project:** Retail Sales and Customer Analytics Dashboard  
**Academic Module:** Advanced Excel Formulas & Business Pivot Tables  
**Accompanying File:** `backend/exports/retail_analytics_workbook.xlsx`  

---

## 1. Required Excel Logical Formulas (Practical 1)

In the workbook's `Sales_Transactions` sheet, column coordinates are mapped as follows:
- `Column A:` Order_ID
- `Column B:` Order_Date
- `Column C:` Customer
- `Column D:` Region
- `Column E:` City
- `Column F:` Product
- `Column G:` Category
- `Column H:` Quantity
- `Column I:` Unit_Price_INR
- `Column J:` Discount_Pct
- `Column K:` Net_Amount_INR
- `Column L:` Profit_INR
- `Column M:` Status

Data begins at **Row 2** (`K2`, `M2`, etc.) with Row 1 containing headers.

---

### Formula 1: IF (Binary Threshold Test)
- **Syntax:** `=IF(K2>=5000, "High Value", "Standard")`
- **Purpose:** Segregates orders based on a monetary threshold.
- **Logic:** If the net transaction amount in cell `K2` is greater than or equal to ₹5,000, outputs `"High Value"`; otherwise outputs `"Standard"`.
- **Sample Result:** For an order of ₹7,499.00 in K2, formula returns `High Value`.

---

### Formula 2: Nested IF (Multi-Tier Sales Classification)
- **Syntax:** `=IF(K2>=25000, "Tier 1", IF(K2>=10000, "Tier 2", IF(K2>=3000, "Tier 3", "Tier 4")))`
- **Purpose:** Progressively grades sales tickets into 4 hierarchical volume tiers.
- **Logic:** Evaluates conditions in cascading order:
  - Tier 1: ₹25,000 and above
  - Tier 2: ₹10,000 to ₹24,999.99
  - Tier 3: ₹3,000 to ₹9,999.99
  - Tier 4: Below ₹3,000
- **Sample Result:** For an order of ₹12,500.00 in K2, formula returns `Tier 2`.

---

### Formula 3: AND (Conjunctive Multi-Condition Test)
- **Syntax:** `=IF(AND(K2>=5000, M2="Delivered"), "Qualifies For Loyalty Bonus", "No Bonus")`
- **Purpose:** Requires multiple business criteria to be met simultaneously.
- **Logic:** The `AND()` function checks both `K2>=5000` AND `M2="Delivered"`. If both return TRUE, outputs `"Qualifies For Loyalty Bonus"`.
- **Sample Result:** For an order of ₹8,000 with status `"Delivered"`, returns `Qualifies For Loyalty Bonus`.

---

### Formula 4: OR (Disjunctive Condition)
- **Syntax:** `=IF(OR(D2="North", D2="South"), "Priority Delivery Zone", "Standard Zone")`
- **Purpose:** Evaluates if a record satisfies at least one of several alternate criteria.
- **Logic:** If cell `D2` (Region) is either `"North"` OR `"South"`, formula outputs `"Priority Delivery Zone"`.
- **Sample Result:** For a customer in `"South"`, returns `Priority Delivery Zone`.

---

### Formula 5: NOT (Logical Negation for Financial Integrity)
- **Syntax:** `=IF(NOT(M2="Cancelled"), "Valid Sale", "Excluded")`
- **Purpose:** Inverts logical evaluation to omit cancelled transactions from realized revenue audits.
- **Logic:** For any fulfillment status other than `"Cancelled"` (such as Delivered, Shipped, Processing), outputs `"Valid Sale"`.
- **Sample Result:** For an order marked `"Shipped"`, returns `Valid Sale`.

---

### Formula 6: IFERROR (Error Interception & Fallback Handling)
- **Syntax:** `=IFERROR(L2/K2, 0)`
- **Purpose:** Shields spreadsheets from `#DIV/0!` or `#VALUE!` runtime errors when computing Profit Margins (`Profit / Net Amount`).
- **Logic:** Calculates `L2 / K2`. If the division produces an error (e.g. division by zero on cancelled orders), `IFERROR` catches the exception and outputs safe fallback `0`.
- **Sample Result:** For `L2=1200` and `K2=4000`, returns `0.30` (30%). For `K2=0`, safely returns `0.00`.

---

### Formula 7: SUMIF (Conditional Totaling)
- **Syntax:** `=SUMIF(G:G, "Electronics", K:K)`
- **Purpose:** Aggregates net amounts specifically for the Electronics merchandise category.
- **Logic:** Checks Range `G:G` (Category). For each cell matching `"Electronics"`, accumulates the corresponding cell in Range `K:K` (Net Amount).
- **Sample Result:** Accurately sums to the verified database category total (e.g., ₹1,248,390.00).

---

### Formula 8: AVERAGEIF (Conditional Mean Calculation)
- **Syntax:** `=AVERAGEIF(G:G, "Fashion", K:K)`
- **Purpose:** Computes the arithmetic mean transaction value for the Fashion department.
- **Logic:** Identifies all rows where Range `G:G` equals `"Fashion"` and computes the average of their values in Range `K:K`.
- **Sample Result:** Returns `₹2,845.50`.

---

### Formula 9: COUNTIF (Conditional Frequency Count)
- **Syntax:** `=COUNTIF(M:M, "Delivered")`
- **Purpose:** Counts the total number of fulfilled transactions.
- **Logic:** Evaluates Range `M:M` (Status) and counts all rows containing the exact text `"Delivered"`.
- **Sample Result:** Evaluates to the verified count of completed deliveries (e.g., 382).

---

## 2. Excel Pivot Table Architecture & Practical Steps (Practical 2)

Excel Pivot Tables use four structural functional quadrants:

```
+-----------------------------------+-----------------------------------+
|              FILTERS              |              COLUMNS              |
|  (e.g., Order Status, Order Date) |      (e.g., Geographic Region)    |
+-----------------------------------+-----------------------------------+
|               ROWS                |            VALUES (∑)             |
|   (e.g., Merchandise Category)    | (e.g., Sum of Revenue & Profit)   |
+-----------------------------------+-----------------------------------+
```

### Step-by-Step Instructions to Build in Microsoft Excel:

1. **Step 1: Open Data Source**  
   Open `retail_analytics_workbook.xlsx` and click on any cell in sheet `Sales_Transactions`.
2. **Step 2: Insert Pivot Table**  
   From Excel's top menu ribbon, click **Insert > PivotTable**. Accept default table range (`$A$1:$M$531`) and click **OK** (creates a new worksheet).
3. **Step 3: Configure Rows**  
   In the **PivotTable Fields** side panel, drag `Category` into the **Rows** area.
4. **Step 4: Configure Columns**  
   Drag `Region` into the **Columns** area.
5. **Step 5: Configure Values**  
   - Drag `Net_Amount_INR` into the **Values** area. Excel defaults to `Sum of Net_Amount_INR`.
   - Right-click any number in the table > **Number Format... > Currency > ₹ INR**.
   - Optional: Drag `Profit_INR` into the **Values** area to cross-tabulate profitability.
6. **Step 6: Add Slicers & Filters**  
   - Drag `Status` to the **Filters** quadrant at the top of the PivotTable Fields pane.
   - Click the filter dropdown in cell B1 and uncheck `"Cancelled"`.
   - Click **PivotTable Analyze > Insert Slicer**, check `Region` and `Category`. Click **OK**.
7. **Verification:**  
   Compare your Excel table with the interactive verification matrix on the **Excel Pivot Table** page in the web app. The numbers match to the penny!
