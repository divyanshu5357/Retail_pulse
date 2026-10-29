# MySQL Analytical Queries: Execution & Validation Report

**Database:** `retail_analytics`  
**Host:** `127.0.0.1:3306`  
**DBMS Engine:** MySQL 9.5.0 Community Server  
**Execution Environment:** macOS / Terminal & MySQL Workbench  
**Validation Timestamp:** Live Validated  

---

## Database Architecture & Entity Counts

The relational schema represents a multi-category Indian retail enterprise:

| Entity / View | Role | Record Count |
|---|---|---|
| `customers` | Master customer directory across 5 geographic regions | **110 rows** |
| `products` | Product catalog across 5 merchandise categories | **24 rows** |
| `orders` | Sales header transactions (Delivered, Shipped, Processing, Cancelled) | **280 rows** |
| `order_items` | Granular basket line items with price and discounts | **530 rows** |
| `v_customer_summary` | Pre-aggregated customer lifetime metrics and tiers | **110 rows** |
| `v_tableau_sales_master` | Denormalized reporting dataset for Tableau & Excel | **530 rows** |

---

## Topic-by-Topic Analytical Query Results

### Topic 1: Basic SELECT, WHERE, and ORDER BY
* **Business Objective:** Retrieve premium products priced above ₹2,000, calculate per-unit margin, and sort descending.
* **SQL Query:**
  ```sql
  SELECT 
      product_id, product_name, category, unit_price, cost_price,
      (unit_price - cost_price) AS unit_margin,
      ROUND(((unit_price - cost_price) / unit_price) * 100, 2) AS profit_margin_pct
  FROM products
  WHERE unit_price >= 2000.00
  ORDER BY unit_price DESC
  LIMIT 8;
  ```
* **Validated MySQL Output:**
  | product_id | product_name | category | unit_price (₹) | cost_price (₹) | unit_margin (₹) | margin % |
  |---|---|---|---|---|---|---|
  | 1 | Ultra HD Smart LED TV 55-inch | Electronics | 42,999.00 | 31,000.00 | 11,999.00 | 27.91% |
  | 2 | Wireless Noise-Cancelling Headphones | Electronics | 7,499.00 | 4,800.00 | 2,699.00 | 35.99% |
  | 15 | Automatic Air Fryer 4.5L | Home & Living | 5,499.00 | 3,600.00 | 1,899.00 | 34.53% |
  | 5 | Smart Fitness Watch Pro | Electronics | 4,999.00 | 3,200.00 | 1,799.00 | 35.99% |
  | 22 | Adjustable Dumbbell Set 20kg | Sports | 4,299.00 | 2,600.00 | 1,699.00 | 39.52% |
  | 3 | Mechanical Gaming Keyboard | Electronics | 3,299.00 | 2,100.00 | 1,199.00 | 36.34% |
  | 10 | Lightweight Running Sports Shoes | Fashion | 3,199.00 | 1,500.00 | 1,699.00 | 53.11% |
  | 9 | Unisex Classic Denim Jeans | Fashion | 2,499.00 | 1,100.00 | 1,399.00 | 55.98% |

---

### Topic 2: Relational INNER JOIN with Filtering
* **Business Objective:** Track completed order fulfillment across geographical territories, mapping orders to registered customer records.
* **SQL Query:**
  ```sql
  SELECT 
      o.order_id, o.order_date, c.customer_name, c.city, o.region, o.order_status
  FROM orders o
  INNER JOIN customers c ON o.customer_id = c.customer_id
  WHERE o.order_status = 'Delivered'
  ORDER BY o.order_date DESC
  LIMIT 5;
  ```
* **Validated MySQL Output:**
  | order_id | order_date | customer_name | city | region | order_status |
  |---|---|---|---|---|---|
  | 135 | 2025-10-17 | Ananya Iyer | Chennai | South | Delivered |
  | 232 | 2025-10-12 | Anjali Sharma | Gwalior | Central | Delivered |
  | 167 | 2025-10-11 | Swati Reddy | Mumbai | West | Delivered |
  | 174 | 2025-10-11 | Shreya Kapoor | Bhubaneswar | East | Delivered |
  | 255 | 2025-10-11 | Simran Choudhury | Guwahati | East | Delivered |

---

### Topic 3: GROUP BY with Multi-Metric Aggregations
* **Business Objective:** Merchandise category sales and profitability performance breakdown.
* **SQL Query:**
  ```sql
  SELECT 
      p.category,
      COUNT(DISTINCT o.order_id) AS total_orders_containing_category,
      SUM(oi.quantity) AS total_units_sold,
      ROUND(AVG(oi.unit_price), 2) AS avg_selling_price,
      ROUND(SUM(oi.quantity * oi.unit_price * (1 - (oi.discount_percent / 100.0))), 2) AS total_revenue,
      ROUND(SUM((oi.quantity * oi.unit_price * (1 - (oi.discount_percent / 100.0))) - (oi.quantity * p.cost_price)), 2) AS total_profit,
      ROUND((SUM((oi.quantity * oi.unit_price * (1 - (oi.discount_percent / 100.0))) - (oi.quantity * p.cost_price)) / 
             SUM(oi.quantity * oi.unit_price * (1 - (oi.discount_percent / 100.0)))) * 100, 2) AS profit_margin_pct
  FROM order_items oi
  INNER JOIN products p ON oi.product_id = p.product_id
  INNER JOIN orders o ON oi.order_id = o.order_id
  WHERE o.order_status != 'Cancelled'
  GROUP BY p.category
  ORDER BY total_revenue DESC;
  ```
* **Validated MySQL Output:**
  | category | orders_count | units_sold | avg_price (₹) | net_revenue (₹) | total_profit (₹) | margin % |
  |---|---|---|---|---|---|---|
  | **Electronics** | 76 | 140 | ₹10,357.51 | ₹1,309,620.37 | ₹318,970.37 | 24.36% |
  | **Home & Living** | 100 | 193 | ₹2,092.10 | ₹344,141.83 | ₹125,231.83 | 36.39% |
  | **Fashion** | 78 | 139 | ₹2,006.87 | ₹256,098.00 | ₹130,148.00 | 50.82% |
  | **Sports** | 81 | 150 | ₹1,404.62 | ₹189,630.97 | ₹77,810.97 | 41.03% |
  | **Groceries** | 68 | 109 | ₹682.95 | ₹61,429.58 | ₹19,679.58 | 32.04% |

---

### Topic 4: Regional Performance with Average Order Value (AOV)
* **Business Objective:** Regional sales volume, realized revenue, profit, and ticket size.
* **SQL Query:**
  ```sql
  SELECT 
      o.region,
      COUNT(DISTINCT o.order_id) AS order_count,
      ROUND(SUM(oi.quantity * oi.unit_price * (1 - (oi.discount_percent / 100.0))), 2) AS regional_revenue,
      ROUND(SUM((oi.quantity * oi.unit_price * (1 - (oi.discount_percent / 100.0))) - (oi.quantity * p.cost_price)), 2) AS regional_profit,
      ROUND(SUM(oi.quantity * oi.unit_price * (1 - (oi.discount_percent / 100.0))) / COUNT(DISTINCT o.order_id), 2) AS avg_order_value
  FROM orders o
  INNER JOIN order_items oi ON o.order_id = oi.order_id
  INNER JOIN products p ON oi.product_id = p.product_id
  WHERE o.order_status != 'Cancelled'
  GROUP BY o.region
  ORDER BY regional_revenue DESC;
  ```
* **Validated MySQL Output:**
  | region | order_count | regional_revenue (₹) | regional_profit (₹) | avg_order_value (₹) |
  |---|---|---|---|---|
  | **East** | 42 | ₹587,562.60 | ₹153,512.60 | ₹13,989.59 |
  | **Central** | 56 | ₹481,929.73 | ₹148,539.73 | ₹8,605.89 |
  | **South** | 52 | ₹398,468.80 | ₹144,428.80 | ₹7,662.86 |
  | **North** | 54 | ₹370,644.64 | ₹124,384.64 | ₹6,863.79 |
  | **West** | 43 | ₹322,314.98 | ₹100,974.98 | ₹7,495.70 |

---

### Topic 5: Customer Lifetime Value (CLV) & Tier Segmentation
* **Business Objective:** Audit every customer using `LEFT JOIN` and `COALESCE` to classify into spending tiers without dropping inactive users.
* **SQL Query:**
  ```sql
  SELECT 
      c.customer_id, c.customer_name, c.city, c.region,
      COUNT(DISTINCT o.order_id) AS order_count,
      COALESCE(SUM(oi.quantity * oi.unit_price * (1 - (oi.discount_percent / 100.0))), 0) AS total_spent_inr,
      CASE 
          WHEN COUNT(DISTINCT o.order_id) = 0 THEN 'Inactive / No Orders'
          WHEN COALESCE(SUM(oi.quantity * oi.unit_price * (1 - (oi.discount_percent / 100.0))), 0) >= 50000 THEN 'Platinum Spender'
          WHEN COALESCE(SUM(oi.quantity * oi.unit_price * (1 - (oi.discount_percent / 100.0))), 0) >= 20000 THEN 'Gold Spender'
          WHEN COALESCE(SUM(oi.quantity * oi.unit_price * (1 - (oi.discount_percent / 100.0))), 0) >= 5000 THEN 'Silver Spender'
          ELSE 'Bronze Spender'
      END AS spending_tier
  FROM customers c
  LEFT JOIN orders o ON c.customer_id = o.customer_id AND o.order_status != 'Cancelled'
  LEFT JOIN order_items oi ON o.order_id = oi.order_id
  GROUP BY c.customer_id, c.customer_name, c.city, c.region
  ORDER BY total_spent_inr DESC
  LIMIT 5;
  ```
* **Validated Top Spenders:**
  | customer_id | customer_name | city | region | order_count | total_spent (₹) | spending_tier |
  |---|---|---|---|---|---|---|
  | 85 | Sunil Agarwal | Guwahati | East | 2 | ₹160,702.10 | Platinum Spender |
  | 76 | Vivek Sharma | Kolkata | East | 4 | ₹116,989.15 | Platinum Spender |
  | 36 | Arjun Choudhury | Patna | East | 5 | ₹97,294.03 | Platinum Spender |
  | 52 | Simran Reddy | Bhopal | Central | 5 | ₹96,878.02 | Platinum Spender |
  | 80 | Rahul Rao | Kolkata | East | 4 | ₹86,187.35 | Platinum Spender |

---

### Topic 6: Identification of Inactive Customers (Zero Lifetime Orders)
* **Business Objective:** Isolate registered accounts with 0 orders for retention/re-engagement campaigns.
* **SQL Query:**
  ```sql
  SELECT 
      c.customer_id, c.customer_name, c.email, c.city, c.region, c.registration_date,
      0 AS total_orders, 0.00 AS total_spending, 'Inactive Customer' AS account_status
  FROM customers c
  LEFT JOIN orders o ON c.customer_id = o.customer_id
  WHERE o.order_id IS NULL
  ORDER BY c.registration_date ASC;
  ```
* **Validated Finding:** Exactly **21 registered accounts (19.09% of user base)** have never completed an order.

---

### Topic 7: Monthly Sales Trend & Velocity Analysis
* **Business Objective:** Month-over-Month (MoM) revenue trajectory and margin stability.
* **SQL Query:**
  ```sql
  SELECT 
      DATE_FORMAT(o.order_date, '%Y-%m') AS sale_month,
      COUNT(DISTINCT o.order_id) AS total_orders,
      ROUND(SUM(oi.quantity * oi.unit_price * (1 - (oi.discount_percent / 100.0))), 2) AS monthly_revenue,
      ROUND(SUM((oi.quantity * oi.unit_price * (1 - (oi.discount_percent / 100.0))) - (oi.quantity * p.cost_price)), 2) AS monthly_profit
  FROM orders o
  INNER JOIN order_items oi ON o.order_id = oi.order_id
  INNER JOIN products p ON oi.product_id = p.product_id
  WHERE o.order_status != 'Cancelled'
  GROUP BY DATE_FORMAT(o.order_date, '%Y-%m')
  ORDER BY sale_month ASC;
  ```
* **Validated Monthly Progression:**
  | sale_month | total_orders | monthly_revenue (₹) | monthly_profit (₹) |
  |---|---|---|---|
  | 2024-11 | 20 | ₹228,961.78 | ₹69,851.78 |
  | 2024-12 | 22 | ₹229,142.14 | ₹72,432.14 |
  | 2025-01 | 26 | ₹117,275.11 | ₹45,495.11 |
  | 2025-02 | 22 | ₹283,928.31 | ₹87,868.31 |
  | 2025-03 | 17 | ₹77,556.27 | ₹28,976.27 |
  | 2025-04 | 25 | ₹250,542.78 | ₹75,022.78 |
  | 2025-05 | 17 | ₹134,826.76 | ₹50,666.76 |
  | 2025-06 | 21 | ₹144,964.29 | ₹41,444.29 |
  | 2025-07 | 29 | ₹114,531.57 | ₹44,441.57 |
  | 2025-08 | 17 | ₹99,265.18 | ₹30,195.18 |
  | 2025-09 | 16 | ₹307,391.12 | ₹72,601.12 |
  | 2025-10 | 15 | ₹172,535.44 | ₹52,845.44 |
  | **Full Year** | **247 Active Orders** | **₹2,160,920.75** | **₹671,841.75** |

---

### Topic 8: Top 10 Best-Selling Products by Net Realized Revenue
* **Business Objective:** Top revenue-driving individual SKUs.
* **Validated Top 5 SKUs:**
  1. **Ultra HD Smart LED TV 55-inch:** ₹906,418.92 net sales (23 units sold, 21.34% margin)
  2. **Wireless Noise-Cancelling Headphones:** ₹184,550.39 net sales (27 units sold, 29.78% margin)
  3. **Automatic Air Fryer 4.5L:** ₹159,361.02 net sales (32 units sold, 27.71% margin)
  4. **Adjustable Dumbbell Set 20kg:** ₹102,488.16 net sales (26 units sold, 34.04% margin)
  5. **Lightweight Running Sports Shoes:** ₹80,934.70 net sales (29 units sold, 46.25% margin)

---

### Topic 9: Window Functions (DENSE_RANK() OVER Category Partition)
* **Business Objective:** Rank product SKUs within their merchandise departments.
* **Top Rankers by Department:**
  - **Electronics #1:** Ultra HD Smart LED TV (₹906.4K)
  - **Fashion #1:** Lightweight Running Shoes (₹80.9K)
  - **Groceries #1:** Extra Virgin Olive Oil 1L (₹25.8K)
  - **Home & Living #1:** Automatic Air Fryer 4.5L (₹159.4K)
  - **Sports #1:** Adjustable Dumbbell Set 20kg (₹102.5K)

---

### Topic 10: Cumulative Running Total (SUM() OVER Order Date)
* **Business Objective:** Cumulative running sales progression towards annual business quota.
* **Milestones:**
  - Month 2 (Dec 2024): ₹458,103.92
  - Month 4 (Feb 2025): ₹859,307.34
  - Month 6 (Apr 2025): ₹1,187,406.39 (Surpassed ₹1.0M milestone)
  - Month 11 (Sep 2025): ₹1,988,385.31
  - Month 12 (Oct 2025): **₹2,160,920.75 Final Realized Revenue**

---

### Topic 11: Common Table Expressions (CTE) - Customer Loyalty Distribution
* **Business Objective:** Measure repeat purchase adoption.
* **Validated Retention Breakdown:**
  | Customer Loyalty Segment | Customer Count | % of Customer Base |
  |---|---|---|
  | **2-3 Orders (Repeat Buyers)** | 42 | 38.18% |
  | **4+ Orders (Loyal Champions)** | 26 | 23.64% |
  | **1 Order (One-Time Buyers)** | 21 | 19.09% |
  | **0 Orders (Inactive Accounts)** | 21 | 19.09% |
  | **Total** | **110** | **100.00%** |
