# Retail Analytics System - Architecture & Design Document

**System Name:** Retail Sales and Customer Analytics Dashboard  
**Classification:** Full-Stack Business Intelligence & Academic Analytics Platform  

---

## 1. Architectural Overview

```
+---------------------------------------------------------------------------------------+
|                                    PRESENTATION LAYER                                 |
|                                                                                       |
|   React 18 + Vite SPA                                                                 |
|   - Tailwind CSS (Executive Navy & Slate Business Palette)                            |
|   - Recharts (Time-series Area, Composed Bar/Line, Donut & Horizontal Ranked Charts) |
|   - 9 Specialized Views: Overview, Sales, Customers, Products, Orders,                |
|     Excel Practical, Pivot Guide, SQL Analysis, Tableau Export, Settings              |
+-------------------------------------------+-------------------------------------------+
                                            |
                                            | REST APIs (JSON / Multipart CSV)
                                            v
+---------------------------------------------------------------------------------------+
|                                    APPLICATION LAYER                                  |
|                                                                                       |
|   Python 3.10 + Flask                                                                 |
|   - app.py: Clean REST routing, filtering & CORS middleware                           |
|   - export_manager.py: Multi-sheet Excel workbook generator (.xlsx) & CSV streaming   |
|   - analytical_queries.py: Safe parameterized query execution registry                |
|   - seed_data.py: Reproducible dataset generator (seed: 42)                           |
+-------------------------------------------+-------------------------------------------+
                                            |
                                            | PyMySQL (Parameterized / DictCursor)
                                            v
+---------------------------------------------------------------------------------------+
|                                     DATA PERSISTENCE                                  |
|                                                                                       |
|   MySQL 8.0+ / 9.x Relational Database (`retail_analytics`)                           |
|   - Normalized 3NF Tables: customers, products, orders, order_items                   |
|   - Referential Integrity: Cascading deletes, RESTRICT constraints, check rules       |
|   - Analytical Views: v_customer_summary (COALESCE/LEFT JOIN), v_tableau_sales_master |
|   - Resilient Fallback: Built-in local SQLite mirroring for offline evaluation        |
+---------------------------------------------------------------------------------------+
```

---

## 2. Relational Database Design

### Normalized Entities & Schema Constraints

```
  +------------------+         1 : N         +------------------+
  |    customers     |<---------------------|      orders      |
  +------------------+                      +------------------+
  | customer_id (PK) |                      | order_id (PK)    |
  | customer_name    |                      | customer_id (FK) |
  | email (UNIQUE)   |                      | order_date       |
  | city             |                      | order_status     |
  | region           |                      | region           |
  | registration_date|                      +--------+---------+
  +------------------+                               | 1
                                                     |
                                                     | N
  +------------------+         1 : N         +-------v----------+
  |     products     |<---------------------|   order_items    |
  +------------------+                      +------------------+
  | product_id (PK)  |                      | order_item_id(PK)|
  | product_name     |                      | order_id (FK)    |
  | category         |                      | product_id (FK)  |
  | unit_price       |                      | quantity (>0)    |
  | cost_price       |                      | unit_price       |
  +------------------+                      | discount_pct(0-100)
                                            +------------------+
```

### Mathematical & Accounting Formulas

1. **Gross Transaction Line Amount:**
   $$\text{Gross Amount} = \text{quantity} \times \text{unit\_price}$$

2. **Discount Deduction:**
   $$\text{Discount Amount} = \text{Gross Amount} \times \left(\frac{\text{discount\_percent}}{100.0}\right)$$

3. **Net Realized Revenue:**
   $$\text{Net Revenue} = \text{Gross Amount} - \text{Discount Amount} = \text{quantity} \times \text{unit\_price} \times \left(1 - \frac{\text{discount\_percent}}{100.0}\right)$$

4. **Product Cost of Goods Sold (COGS):**
   $$\text{Total Cost} = \text{quantity} \times \text{cost\_price}$$

5. **Net Operating Profit:**
   $$\text{Profit} = \text{Net Revenue} - \text{Total Cost}$$

6. **Average Order Value (AOV):**
   $$\text{AOV} = \frac{\sum \text{Net Revenue of Completed Orders}}{\text{Count of Completed Orders}}$$

---

## 3. Core Relational Concepts Implemented

- **LEFT JOIN & Inactive Customers:**  
  Standard INNER JOIN drops customers without purchases. By applying `LEFT JOIN orders o ON c.customer_id = o.customer_id AND o.order_status != 'Cancelled'`, customers with zero orders remain preserved in the resulting relation.
- **COALESCE() Function:**  
  Prevents `NULL` propagating from empty joins; converts unplaced order revenue to `0.00` and last order date to `'Never Ordered'`.
- **Aggregations & GROUP BY:**  
  Multi-dimensional grouping across Customer Segments, Categories, Regions, and Time Series (YYYY-MM).
