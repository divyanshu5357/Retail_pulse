# Retail Sales & Customer Analytics: Unified Dataset Dictionary

**Project:** Cross-Tool Business Analytics  
**Shared Across:** Microsoft Excel, MySQL, and Tableau Public  
**Temporal Span:** November 2024 – October 2025 (12 Calendar Months)  
**Geographic Coverage:** Pan-India (Central, East, North, South, West)  

---

## 1. Unified Dataset Architecture

The analytics workflow relies on a single relational schema containing 4 normalized transactional tables and 2 analytical views. The same dataset is denormalized for Tableau and Excel to ensure metric parity.

```
+--------------------------------------------------------------------------------------------------+
|                                    RELATIONAL SCHEMA (MySQL)                                     |
+--------------------------+-----------------------+------------------------+----------------------+
|        CUSTOMERS         |        ORDERS         |      ORDER_ITEMS       |       PRODUCTS       |
| 110 records              | 280 records           | 530 records            | 24 records           |
| (PK: customer_id)        | (PK: order_id)        | (PK: order_item_id)    | (PK: product_id)     |
|                          | (FK: customer_id)     | (FK: order_id)         |                      |
|                          |                       | (FK: product_id)       |                      |
+--------------------------+-----------------------+------------------------+----------------------+
                                       |
                                       v
+--------------------------------------------------------------------------------------------------+
|                     DENORMALIZED MASTER REPORTING LAYER (v_tableau_sales_master)                 |
|                     Exported as: 03_Tableau/tableau_sales_master.csv                             |
|                     Populated in: 02_Excel/retail_sales_analytics.xlsx [Sales_Transactions]      |
+--------------------------------------------------------------------------------------------------+
```

---

## 2. Table-by-Table Data Dictionary

### Table 1: `customers`
Contains registered customer accounts across Indian metropolitan and tier-2 cities.

| Column | Data Type | Key/Index | Nullable | Description & Business Rules |
|---|---|---|---|---|
| `customer_id` | INT | Primary Key | NO | Unique surrogate customer identifier (Auto-increment) |
| `customer_name` | VARCHAR(100) | | NO | Full name of the customer |
| `email` | VARCHAR(120) | Unique Index | NO | Valid unique email address format (`username@example.in`) |
| `city` | VARCHAR(50) | Indexed | NO | Delivery municipality (e.g., Bengaluru, Patna, Bhopal, Delhi) |
| `region` | VARCHAR(30) | Indexed | NO | Operating territory (`Central`, `East`, `North`, `South`, `West`) |
| `registration_date` | DATE | Indexed | NO | Account creation timestamp (2023-10 to 2024-08) |

---

### Table 2: `products`
Merchandise catalog with wholesale procurement cost and retail list price.

| Column | Data Type | Key/Index | Nullable | Description & Business Rules |
|---|---|---|---|---|
| `product_id` | INT | Primary Key | NO | Unique SKU identifier |
| `product_name` | VARCHAR(120) | | NO | Descriptive commercial product name |
| `category` | VARCHAR(50) | Indexed | NO | Department: `Electronics`, `Fashion`, `Groceries`, `Home & Living`, `Sports` |
| `unit_price` | DECIMAL(10,2) | | NO | Standard retail selling price (MSRP) in INR (₹) |
| `cost_price` | DECIMAL(10,2) | | NO | Wholesale/procurement cost in INR (₹) |

---

### Table 3: `orders`
Header records for sales transactions.

| Column | Data Type | Key/Index | Nullable | Description & Business Rules |
|---|---|---|---|---|
| `order_id` | INT | Primary Key | NO | Unique order identifier |
| `customer_id` | INT | Foreign Key | NO | References `customers(customer_id)` |
| `order_date` | DATE | Indexed | NO | Order placement date (2024-11-01 to 2025-10-31) |
| `order_status` | VARCHAR(30) | Indexed | NO | Lifecycle state: `Delivered`, `Shipped`, `Processing`, `Cancelled` |
| `region` | VARCHAR(30) | Indexed | NO | Geographic delivery region |

---

### Table 4: `order_items`
Basket itemization lines. Multiple items map to one order header.

| Column | Data Type | Key/Index | Nullable | Description & Business Rules |
|---|---|---|---|---|
| `order_item_id` | INT | Primary Key | NO | Unique line item identifier |
| `order_id` | INT | Foreign Key | NO | References `orders(order_id)` |
| `product_id` | INT | Foreign Key | NO | References `products(product_id)` |
| `quantity` | INT | | NO | Quantity purchased (Range: 1 to 5) |
| `unit_price` | DECIMAL(10,2) | | NO | Unit price captured at point of sale (INR ₹) |
| `discount_percent` | DECIMAL(5,2) | | NO | Promotional discount rate (Range: 0.00% to 25.00%) |

---

## 3. Financial Metrics & Calculation Formulas

| Business Metric | Mathematical Formula | Purpose in Analytics |
|---|---|---|
| **Gross Revenue** | `quantity * unit_price` | Top-line nominal sales volume before promotional markdowns |
| **Discount Amount** | `gross_revenue * (discount_percent / 100.0)` | Total markdown subsidies granted |
| **Net Revenue** | `gross_revenue - discount_amount` | Realized gross transaction value received by the merchant |
| **Total Cost (COGS)** | `quantity * cost_price` | Direct cost of goods sold |
| **Gross Profit** | `net_revenue - total_cost` | Net operating gross margin after discount absorption |
| **Profit Margin %** | `(profit / net_revenue) * 100` | Efficiency metric measuring profitability per rupee earned |
| **Average Order Value (AOV)** | `SUM(net_revenue) / COUNT(DISTINCT order_id)` | Measure of customer purchasing power per basket |

---

## 4. Analytical Views

### 1. `v_customer_summary`
Pre-aggregated customer lifetime metrics using `LEFT JOIN` and `COALESCE` so inactive accounts are retained with 0 orders and ₹0.00 spend.
- **Tiers:**
  - `Platinum / VIP`: Lifetime spend ≥ ₹50,000
  - `Gold Tier`: Lifetime spend ≥ ₹20,000
  - `Silver Tier`: Lifetime spend ≥ ₹5,000
  - `Bronze Tier`: Lifetime spend < ₹5,000
  - `Inactive (Never Purchased)`: 0 completed orders

### 2. `v_tableau_sales_master`
Denormalized reporting flat-file joining `orders`, `customers`, `order_items`, and `products`. Contains all calendar dimensions (`order_year`, `order_month`, `order_month_name`, `order_year_month`), customer geography, item attributes, and financial metrics. Serves as the single source of truth for Tableau and Excel.
