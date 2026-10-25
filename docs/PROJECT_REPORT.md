# Academic Project Report

# RETAIL SALES AND CUSTOMER ANALYTICS DASHBOARD
### A Full-Stack Business Intelligence Platform Integrating Excel Formulas, Pivot Tables, MySQL Relational Analytics, and Tableau Visualizations

---

**Course / Degree:** Bachelor / Master of Technology / Business Administration (Business Analytics)  
**Subject:** Business Analytics & Database Management Systems  
**Academic Year:** 2025–2026  

---

## TABLE OF CONTENTS

1. [Certificate / Declaration](#certificate--declaration)
2. [Acknowledgment](#acknowledgment)
3. [Abstract](#abstract)
4. [Chapter 1: Introduction](#chapter-1-introduction)
   - 1.1 Project Background
   - 1.2 Problem Statement
   - 1.3 Project Objectives (The Six Core Pillars)
   - 1.4 Scope and Limitations
5. [Chapter 2: Technology Stack & Theoretical Foundations](#chapter-2-technology-stack--theoretical-foundations)
   - 2.1 Technology Selection Rationale
   - 2.2 Relational Algebra & SQL Paradigms
   - 2.3 Spreadsheet Analytics & Business Dashboards
6. [Chapter 3: System Requirements & Architecture](#chapter-3-system-requirements--architecture)
   - 3.1 Functional Requirements
   - 3.2 Non-Functional Requirements
   - 3.3 Hardware & Software Specifications
   - 3.4 Architectural Diagram & Layer Flow
7. [Chapter 4: Database Design & Mathematical Modeling](#chapter-4-database-design--mathematical-modeling)
   - 4.1 3NF Normalized Relational Schema
   - 4.2 Comprehensive Data Dictionary
   - 4.3 Entity-Relationship (ER) Modeling
   - 4.4 Financial & Accounting Calculations
   - 4.5 Analytical SQL Views
8. [Chapter 5: Implementation of the Six Academic Practical Topics](#chapter-5-implementation-of-the-six-academic-practical-topics)
   - 5.1 Topic 1: Excel Logical Formulas Lab
   - 5.2 Topic 2: Excel Pivot Table Architecture & Replication
   - 5.3 Topic 3: SQL Relational Operations & Query Lab
   - 5.4 Topic 4: Customer Spending Analysis (LEFT JOIN & COALESCE)
   - 5.5 Topic 5: Tableau BI Integration & Denormalized Master Star Schema
   - 5.6 Topic 6: Full-Stack Web Application Architecture
9. [Chapter 6: Results, Visualizations & Business Insights](#chapter-6-results-visualizations--business-insights)
   - 6.1 Executive KPI Metrics
   - 6.2 Sales Trend & Profit Margin Analysis
   - 6.3 Category & Regional Insights
   - 6.4 Customer Retention & Inactive Account Findings
10. [Chapter 7: Testing, Verification & Validation](#chapter-7-testing-verification--validation)
    - 7.1 Testing Strategy
    - 7.2 Test Case Specifications & Automated Results (11/11 Passing)
    - 7.3 Data Import Integrity & Security Validation
11. [Chapter 8: Conclusion & Future Scope](#chapter-8-conclusion--future-scope)
    - 8.1 Summary of Contributions
    - 8.2 Key Academic Takeaways
    - 8.3 Future Enhancements
12. [References & Bibliography](#references--bibliography)
13. [Appendices](#appendices)

---

## CERTIFICATE / DECLARATION

This is to certify that the project entitled **"Retail Sales and Customer Analytics Dashboard"** is a bona fide record of academic work carried out by **Sakshi Singh** under our supervision in partial fulfillment of the requirements for the award of the degree in **Business Analytics / Computer Science & Engineering**.

The results embodied in this report have been verified through automated unit tests, live relational database management system queries, and spreadsheet modeling, and have not been submitted to any other university or institute for the award of any other degree or diploma.

---

## ACKNOWLEDGMENT

I would like to express my sincere gratitude to my faculty mentors, project guides, and the Department of Computer Science / Business Analytics for their invaluable guidance, constructive suggestions, and continuous encouragement throughout the development of this project.

I also extend my heartfelt thanks to the open-source software community for providing resilient frameworks such as Python, Flask, React, Tailwind CSS, Recharts, and MySQL, which made the full-stack realization of this analytical platform possible.

---

## ABSTRACT

In contemporary retail management, data-driven decision-making requires seamless synergy between spreadsheet calculation models, relational database management systems (RDBMS), and enterprise visualization platforms. Traditional retail education often isolates these domains: students evaluate Excel formulas on static sheets, write disjointed SQL queries on disconnected tables, and construct business charts without understanding underlying relational dependencies.

This project bridges that gap by engineering a production-grade, full-stack analytical platform titled **Retail Sales and Customer Analytics Dashboard**. Built on a **React 18** frontend, **Tailwind CSS**, **Recharts**, **Python Flask**, and a live **MySQL 9.x** database engine, the platform demonstrates six essential analytical disciplines:
1. **Excel Logical Formulas:** Practical execution of `IF`, `Nested IF`, `AND`, `OR`, `NOT`, `IFERROR`, `SUMIF`, `AVERAGEIF`, and `COUNTIF`.
2. **Excel Pivot Tables:** Multi-dimensional cross-tabulation across Category, Region, Revenue, and Profit with verification guides.
3. **SQL Database Operations:** 3NF normalized schema design, primary/foreign key cascading, check constraints, and parameterized analytics.
4. **Customer Spending Analysis:** Preserving zero-order accounts and eliminating NULL propagation through `LEFT JOIN`, `SUM`, `GROUP BY`, and `COALESCE`.
5. **Tableau Integration:** Automated extraction of a star-schema denormalized dataset (`tableau_sales_master.csv`) and a 6-step workbook construction guide.
6. **Executive Interactive Dashboards:** Dynamic KPI cards, profit velocity curves, and regional distribution charts rendered in Indian Rupee (`₹ INR`).

The system was populated with reproducible synthetic data comprising 110 customers, 24 catalog products, 280 orders, and 530 transaction line items. The data integrity and accounting calculations were strictly verified using **11 automated pytest test suites**. The result is a robust, end-to-end framework suitable for academic evaluation and real-world retail intelligence.

---

## CHAPTER 1: INTRODUCTION

### 1.1 Project Background
The Indian retail industry has witnessed rapid digital transformation, characterized by omnichannel sales, diversified payment systems, and fluctuating regional demand patterns. In such dynamic commercial environments, retail managers must constantly assess:
- Which product categories generate healthy net profit margins versus those that merely inflate top-line gross revenue.
- How seasonal trends and geographic logistics influence average order value (AOV).
- Which registered customer segments drive the highest lifetime value (LTV).
- How many registered users have gone inactive without making a single purchase.

Solving these operational questions requires multi-tier analytical workflows: from granular SQL joins on transactional tables to intermediate Excel logic and high-level Tableau executive dashboards.

### 1.2 Problem Statement
Traditional academic projects in business intelligence suffer from significant limitations:
- **Disconnection from Live Databases:** Formula demonstrations often rely on tiny, static 10-row tables pasted into documents without referential backing.
- **Ignoring Inactive Records:** When querying customer spending, inexperienced analysts frequently use standard `INNER JOIN` clauses or improper `WHERE` filters, accidentally discarding customers who have zero purchases and skewing retention metrics.
- **Hardcoded Dashboard Totals:** Web-based mockups often hardcode summary numbers rather than calculating metrics dynamically from transaction records.
- **Lack of Integration:** Spreadsheets, databases, and visualization tools are treated as siloed entities rather than interconnected layers of a unified data pipeline.

### 1.3 Project Objectives (The Six Core Pillars)
The primary objective of this project is to build an integrated, fully functional retail analytics software system that demonstrates:
1. **Spreadsheet Logical Modeling:** Practical application and interactive testing of the nine foundational Excel formulas with exact cell coordinate mapping.
2. **Pivot Table Architecture:** Explaining the 4-quadrant layout (Rows, Columns, Values, Filters) and providing an automated verification matrix.
3. **RDBMS Schema Engineering:** Designing a third-normal-form (3NF) MySQL database (`retail_analytics`) with constraints, cascade actions, and indexes.
4. **Customer Spending & Inactivity Analysis:** Leveraging `LEFT JOIN`, `SUM`, `GROUP BY`, and `COALESCE` to identify lifetime spending across active and inactive accounts.
5. **Tableau Visual Analytics Pipeline:** Creating star-schema denormalized extracts and detailed dual-axis visualization guides.
6. **Executive Interactive Dashboard:** Constructing a responsive, light-themed web interface with dynamic time-series, categorical, and regional filtering.

### 1.4 Scope and Limitations
- **In Scope:** Full transactional lifecycle modeling (orders, customers, products, order items), accounting metrics (gross amount, discount deduction, net revenue, cost of goods sold, profit, margin percentage, AOV), automated unit testing, CSV and Excel `.xlsx` exports.
- **Out of Scope / Manual Handoff:** Native Microsoft Excel Pivot Tables and Tableau Desktop workbooks run as external desktop desktop software; thus, the project generates the clean data extracts and step-by-step guides for evaluators to construct them natively.

---

## CHAPTER 2: TECHNOLOGY STACK & THEORETICAL FOUNDATIONS

### 2.1 Technology Selection Rationale

| Layer | Technology | Version | Justification |
|---|---|---|---|
| **Frontend UI** | React with Vite | 18.x / 8.x | High-performance Single Page Application (SPA) architecture with fast HMR. |
| **Styling** | Tailwind CSS | 3.4.x | Utility-first styling providing consistent spacing, responsive grid, and executive navy theme. |
| **Data Charts** | Recharts | 2.15.x | Declarative SVG charting library with smooth animations and responsive container wrappers. |
| **Backend API** | Python Flask | 3.1.x | Lightweight WSGI microframework offering clean REST routing, CORS handling, and file streaming. |
| **Database** | MySQL | 9.5.x | Enterprise RDBMS with ACID compliance, multi-table foreign key constraints, and analytical views. |
| **Data Engine** | Pandas & OpenPyXL | 2.3.x / 3.1.x | Robust data munging, DataFrame aggregations, and multi-sheet native `.xlsx` workbook generation. |
| **Testing** | Pytest | 9.1.x | Industry-standard test runner for unit validation of calculations and endpoint integration tests. |

### 2.2 Relational Algebra & SQL Paradigms
The relational foundation of this project is built upon Codd’s Relational Model:
- **Projection ($\pi$):** Selecting specific attributes (e.g., product name, net revenue).
- **Selection ($\sigma$):** Filtering tuples based on predicate conditions (e.g., `order_status != 'Cancelled'`).
- **Theta Join ($\bowtie_\theta$):** Joining relation `orders` with `customers` on primary-foreign key equivalences.
- **Outer Join ($\leftouterjoin$):** Preserving unmatched tuples from the left relation to prevent customer loss when orders do not exist.
- **Aggregation ($\gamma$):** Partitioning tuples using `GROUP BY` and applying aggregate functions (`SUM`, `COUNT`, `AVG`).

### 2.3 Spreadsheet Analytics & Business Dashboards
Spreadsheets serve as the primary prototyping tool for financial analysts. The integration of Excel logic with SQL ensures that business rules (such as profit margin safeguards with `IFERROR` and conditional volume thresholds with `Nested IF`) match the backend relational view definitions.

---

## CHAPTER 3: SYSTEM REQUIREMENTS & ARCHITECTURE

### 3.1 Functional Requirements (FR)
- **FR1 (KPI Calculation):** System must compute Total Revenue, Total Orders, Total Customers, Total Products, Average Order Value (AOV), and Inactive Customers dynamically from underlying data.
- **FR2 (Global Filtering):** User must be able to filter dashboard views by Start Date, End Date, Region, and Category, with immediate visual synchronization.
- **FR3 (Customer Spending Analysis):** System must list all customers, order counts, and total spending. Inactive customers (zero lifetime purchases) must show ₹0 spend and never be omitted.
- **FR4 (Product Revenue Ranking):** Catalog items must be ranked by net revenue and flagged with a low-sales indicator if unit sales fall below 10.
- **FR5 (Order Drilldown):** Users must be able to view itemized order line breakdowns (unit price, quantity, discount %, net total, profit).
- **FR6 (Excel Formulas Demonstration):** Dedicated page displaying the 9 required Excel formulas, cell references, explanations, expected results, and copyable syntax.
- **FR7 (Pivot Table Simulation):** Pre-calculated cross-tabulation matrix matching Excel’s native Pivot Table calculations.
- **FR8 (Safe SQL Playground):** Pre-approved analytical query runner executing parameterized SQL without risk of injection.
- **FR9 (Data Export):** One-click download of CSV files (`customers.csv`, `products.csv`, `orders.csv`, `order_items.csv`, `tableau_sales_master.csv`) and generated `.xlsx` workbook.
- **FR10 (Data Validation & Import):** Safe CSV upload tool validating headers, data types, foreign keys, and positive quantities.

### 3.2 Non-Functional Requirements (NFR)
- **NFR1 (Performance):** Dashboard API response times under 200ms; frontend chart render time under 100ms.
- **NFR2 (Data Integrity):** Foreign key constraints must prevent orphaned order items; check constraints must reject negative prices or discounts over 100%.
- **NFR3 (Resilience / Fallback):** If MySQL connection fails, backend automatically falls back to an embedded SQLite mirror to prevent crash during presentation.
- **NFR4 (Usability):** Light theme with high contrast, navy typography (`#0F172A`), and clear INR (`₹`) currency formatting.

### 3.3 Hardware & Software Specifications
- **Operating System:** macOS Sequoia / Sonoma, Windows 10/11, or Linux (Ubuntu 22.04+).
- **Runtime Environment:** Python 3.10+, Node.js v18+.
- **Database Server:** MySQL Server 8.0+ or 9.x listening on port 3306.
- **Client Browser:** Google Chrome, Safari, Mozilla Firefox, or Microsoft Edge.

### 3.4 High-Level System Architecture Diagram

```
+-----------------------------------------------------------------------------------+
|                              CLIENT LAYER (Browser)                               |
|                                                                                   |
|   React SPA (Vite Dev Server : Port 5174)                                         |
|   ├── Components: Sidebar, Navbar, FilterBar, KPICards, Recharts Graphs, Modals    |
|   └── Pages: Overview, Sales, Customers, Products, Orders, Excel, Pivot, SQL, ...  |
+-----------------------------------------+-----------------------------------------+
                                          |
                                          | REST HTTP Requests (JSON / Multipart)
                                          v
+-----------------------------------------------------------------------------------+
|                            APPLICATION LAYER (Python Flask)                       |
|                                                                                   |
|   Flask WSGI Server (: Port 5001)                                                 |
|   ├── app.py: REST Endpoints (/api/dashboard/*, /api/customers, /api/sql/*)       |
|   ├── export_manager.py: Multi-sheet OpenPyXL .xlsx & Pandas CSV Streaming        |
|   ├── analytical_queries.py: Parameterized SQL Query Execution Registry           |
|   └── seed_data.py: Synthetic Dataset Generator (Seed: 42)                        |
+-----------------------------------------+-----------------------------------------+
                                          |
                                          | PyMySQL Connection Pool (DictCursor)
                                          v
+-----------------------------------------------------------------------------------+
|                            DATA PERSISTENCE LAYER (MySQL)                         |
|                                                                                   |
|   MySQL 9.5 Relational Database (`retail_analytics`)                              |
|   ├── Normalized Tables: customers, products, orders, order_items                 |
|   ├── Analytical Views: v_customer_summary, v_tableau_sales_master                |
|   └── Integrity: PK/FK Cascades, Check Constraints, B-Tree Indexes                 |
+-----------------------------------------------------------------------------------+
```

---

## CHAPTER 4: DATABASE DESIGN & MATHEMATICAL MODELING

### 4.1 3NF Normalized Relational Schema
The database schema eliminates insertion, update, and deletion anomalies by adhering strictly to Third Normal Form (3NF):
1. **1NF:** All attribute values are atomic; no repeating groups exist.
2. **2NF:** Every non-key attribute is fully functionally dependent on the primary key (no partial dependencies).
3. **3NF:** No non-key attribute is transitively dependent on the primary key.

### 4.2 Comprehensive Data Dictionary

#### Table 1: `customers`
Stores registered customer accounts across geographical territories.
| Column | Type | Constraints | Description |
|---|---|---|---|
| `customer_id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier for customer |
| `customer_name`| VARCHAR(100) | NOT NULL | Full name of customer |
| `email` | VARCHAR(120) | NOT NULL, UNIQUE | Contact email address |
| `city` | VARCHAR(50) | NOT NULL | Delivery municipality |
| `region` | VARCHAR(30) | NOT NULL, INDEX | Zone: North, South, East, West, Central |
| `registration_date`| DATE | NOT NULL | Account creation date |

#### Table 2: `products`
Stores merchandise catalog details and cost benchmarks.
| Column | Type | Constraints | Description |
|---|---|---|---|
| `product_id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique catalog item key |
| `product_name` | VARCHAR(120) | NOT NULL | Retail item designation |
| `category` | VARCHAR(50) | NOT NULL, INDEX | Merchandise classification |
| `unit_price` | DECIMAL(10,2)| NOT NULL, CHECK (>= 0) | Retail selling price (INR ₹) |
| `cost_price` | DECIMAL(10,2)| NOT NULL, CHECK (>= 0) | Manufacturing/Wholesale cost (INR ₹) |

#### Table 3: `orders`
Stores order header transactions.
| Column | Type | Constraints | Description |
|---|---|---|---|
| `order_id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique sales transaction key |
| `customer_id` | INT | NOT NULL, FK -> customers | Placing customer reference |
| `order_date` | DATE | NOT NULL, INDEX | Date order was placed |
| `order_status` | VARCHAR(30) | NOT NULL | Delivered, Shipped, Processing, Cancelled |
| `region` | VARCHAR(30) | NOT NULL, INDEX | Fulfillment geographic zone |

#### Table 4: `order_items`
Stores granular line items belonging to an order.
| Column | Type | Constraints | Description |
|---|---|---|---|
| `order_item_id`| INT | PRIMARY KEY, AUTO_INCREMENT | Unique line item key |
| `order_id` | INT | NOT NULL, FK -> orders ON DELETE CASCADE | Parent order key |
| `product_id` | INT | NOT NULL, FK -> products | Purchased merchandise key |
| `quantity` | INT | NOT NULL, CHECK (> 0) | Units purchased |
| `unit_price` | DECIMAL(10,2)| NOT NULL, CHECK (>= 0) | Price at time of purchase |
| `discount_percent`| DECIMAL(5,2)| DEFAULT 0.00, CHECK (0-100) | Promotional discount percentage |

### 4.3 Entity-Relationship (ER) Diagram Description

```
  +--------------------+         1 : N         +--------------------+
  |     CUSTOMERS      |<---------------------|       ORDERS       |
  +--------------------+                      +--------------------+
  | PK  customer_id    |                      | PK  order_id       |
  |     customer_name  |                      | FK  customer_id    |
  |     email          |                      |     order_date     |
  |     city           |                      |     order_status   |
  |     region         |                      |     region         |
  |     reg_date       |                      +---------+----------+
  +--------------------+                                | 1
                                                        |
                                                        | N
  +--------------------+         1 : N         +--------v-----------+
  |      PRODUCTS      |<---------------------|    ORDER_ITEMS     |
  +--------------------+                      +--------------------+
  | PK  product_id     |                      | PK  order_item_id  |
  |     product_name   |                      | FK  order_id       |
  |     category       |                      | FK  product_id     |
  |     unit_price     |                      |     quantity       |
  |     cost_price     |                      |     unit_price     |
  +--------------------+                      |     discount_pct   |
                                              +--------------------+
```

### 4.4 Financial & Accounting Calculations
Every financial metric in the application is governed by strict mathematical accounting definitions:

1. **Gross Revenue per Item:**
   $$\text{Gross Amount} = \text{quantity} \times \text{unit\_price}$$

2. **Discount Amount:**
   $$\text{Discount Amount} = \text{Gross Amount} \times \left(\frac{\text{discount\_percent}}{100.0}\right)$$

3. **Net Realized Revenue:**
   $$\text{Net Revenue} = \text{Gross Amount} - \text{Discount Amount} = \text{quantity} \times \text{unit\_price} \times \left(1 - \frac{\text{discount\_percent}}{100.0}\right)$$

4. **Total Product Cost (COGS):**
   $$\text{Total Cost} = \text{quantity} \times \text{cost\_price}$$

5. **Net Operating Profit:**
   $$\text{Profit} = \text{Net Revenue} - \text{Total Cost}$$

6. **Profit Margin Percentage:**
   $$\text{Profit Margin \%} = \left(\frac{\text{Profit}}{\text{Net Revenue}}\right) \times 100$$

7. **Average Order Value (AOV):**
   $$\text{AOV} = \frac{\sum_{\text{fulfilled}} \text{Net Revenue}}{\text{Count of Fulfilled Orders}}$$

### 4.5 Analytical SQL Views

#### View 1: `v_customer_summary` (Core Requirement for Inactivity & Spending)
```sql
CREATE OR REPLACE VIEW v_customer_summary AS
SELECT 
    c.customer_id,
    c.customer_name,
    c.email,
    c.city,
    c.region,
    c.registration_date,
    COUNT(DISTINCT o.order_id) AS total_orders,
    COALESCE(SUM(oi.quantity * oi.unit_price * (1 - (oi.discount_percent / 100.0))), 0) AS total_spending,
    COALESCE(SUM((oi.quantity * oi.unit_price * (1 - (oi.discount_percent / 100.0))) - (oi.quantity * p.cost_price)), 0) AS total_profit,
    MAX(o.order_date) AS last_order_date,
    CASE 
        WHEN COUNT(DISTINCT o.order_id) = 0 THEN 'Inactive (Never Purchased)'
        WHEN COALESCE(SUM(oi.quantity * oi.unit_price * (1 - (oi.discount_percent / 100.0))), 0) >= 50000 THEN 'Platinum / VIP'
        WHEN COALESCE(SUM(oi.quantity * oi.unit_price * (1 - (oi.discount_percent / 100.0))), 0) >= 20000 THEN 'Gold Tier'
        WHEN COALESCE(SUM(oi.quantity * oi.unit_price * (1 - (oi.discount_percent / 100.0))), 0) >= 5000 THEN 'Silver Tier'
        ELSE 'Bronze Tier'
    END AS customer_segment
FROM customers c
LEFT JOIN orders o 
    ON c.customer_id = o.customer_id 
    AND o.order_status != 'Cancelled'
LEFT JOIN order_items oi 
    ON o.order_id = oi.order_id
LEFT JOIN products p 
    ON oi.product_id = p.product_id
GROUP BY 
    c.customer_id, c.customer_name, c.email, c.city, c.region, c.registration_date;
```

#### View 2: `v_tableau_sales_master` (Denormalized Master Star Extract)
```sql
CREATE OR REPLACE VIEW v_tableau_sales_master AS
SELECT 
    o.order_id,
    o.order_date,
    DATE_FORMAT(o.order_date, '%Y-%m') AS order_year_month,
    YEAR(o.order_date) AS order_year,
    MONTH(o.order_date) AS order_month_num,
    DATE_FORMAT(o.order_date, '%b') AS order_month_name,
    o.order_status,
    o.region AS order_region,
    c.customer_id,
    c.customer_name,
    c.city AS customer_city,
    c.region AS customer_region,
    p.product_id,
    p.product_name,
    p.category,
    oi.order_item_id,
    oi.quantity,
    oi.unit_price,
    oi.discount_percent,
    ROUND(oi.quantity * oi.unit_price, 2) AS gross_revenue,
    ROUND(oi.quantity * oi.unit_price * (oi.discount_percent / 100.0), 2) AS discount_amount,
    ROUND(oi.quantity * oi.unit_price * (1 - (oi.discount_percent / 100.0)), 2) AS net_revenue,
    ROUND(oi.quantity * p.cost_price, 2) AS total_cost,
    ROUND((oi.quantity * oi.unit_price * (1 - (oi.discount_percent / 100.0))) - (oi.quantity * p.cost_price), 2) AS profit
FROM orders o
JOIN customers c ON o.customer_id = c.customer_id
JOIN order_items oi ON o.order_id = oi.order_id
JOIN products p ON oi.product_id = p.product_id;
```

---

## CHAPTER 5: IMPLEMENTATION OF THE SIX ACADEMIC PRACTICAL TOPICS

### 5.1 Topic 1: Excel Logical Formulas Lab
The project includes a dedicated educational module demonstrating the 9 required Excel formulas. In the workbook's `Sales_Transactions` sheet, columns are organized as:
- `Col G:` Category
- `Col K:` Net_Amount_INR
- `Col L:` Profit_INR
- `Col M:` Status

#### The Nine Demonstrated Formulas:
1. **`IF`**: `=IF(K2>=5000, "High Value", "Standard")`
   - *Logic:* Tests whether the order net amount is $\ge ₹5,000$. Classifies order into a binary tier.
2. **`Nested IF`**: `=IF(K2>=25000, "Tier 1", IF(K2>=10000, "Tier 2", IF(K2>=3000, "Tier 3", "Tier 4")))`
   - *Logic:* Multi-tier evaluation grading transaction volume across 4 descending buckets.
3. **`AND`**: `=IF(AND(K2>=5000, M2="Delivered"), "Qualifies For Loyalty Bonus", "No Bonus")`
   - *Logic:* Conjunctive check requiring both high ticket size AND successful delivery.
4. **`OR`**: `=IF(OR(D2="North", D2="South"), "Priority Delivery Zone", "Standard Zone")`
   - *Logic:* Disjunctive check matching shipments routed through primary metro transit lanes.
5. **`NOT`**: `=IF(NOT(M2="Cancelled"), "Valid Sale", "Excluded")`
   - *Logic:* Negation filtering ensuring cancelled transactions do not corrupt net sales audits.
6. **`IFERROR`**: `=IFERROR(L2/K2, 0)`
   - *Logic:* Intercepts `#DIV/0!` errors when computing profit margin (`Profit / Net Amount`) on zero-amount rows.
7. **`SUMIF`**: `=SUMIF(G:G, "Electronics", K:K)`
   - *Logic:* Aggregates total net revenue exclusively for the `"Electronics"` category.
8. **`AVERAGEIF`**: `=AVERAGEIF(G:G, "Fashion", K:K)`
   - *Logic:* Computes arithmetic mean order value for `"Fashion"` merchandise.
9. **`COUNTIF`**: `=COUNTIF(M:M, "Delivered")`
   - *Logic:* Counts total fulfilled delivery volume.

---

### 5.2 Topic 2: Excel Pivot Table Architecture & Replication
Excel Pivot Tables summarize large relational extracts across four analytical quadrants:

```
+-----------------------------------+-----------------------------------+
|              FILTERS              |              COLUMNS              |
|        (e.g., Order Status)       |         (e.g., Region)            |
+-----------------------------------+-----------------------------------+
|               ROWS                |            VALUES (∑)             |
|        (e.g., Category)           |    (e.g., Sum of Net Revenue)     |
+-----------------------------------+-----------------------------------+
```

#### Step-by-Step Instructions to Reproduce in Microsoft Excel:
1. Open the exported workbook `retail_analytics_workbook.xlsx`.
2. Click any cell within sheet `Sales_Transactions`.
3. In Excel’s top ribbon, click **Insert > PivotTable**. Accept range `$A$1:$M$531`.
4. Drag `Category` into the **Rows** area.
5. Drag `Region` into the **Columns** area.
6. Drag `Net_Amount_INR` into the **Values** area (defaults to `Sum of Net_Amount_INR`). Format as **Currency ₹ INR**.
7. Drag `Status` to **Filters**, click cell B1, and uncheck `"Cancelled"`.
8. *Result Verification:* The resulting numbers match the dynamic Pivot Matrix on the **Excel Pivot Table** page in the web app.

---

### 5.3 Topic 3: SQL Relational Operations & Query Lab
The SQL Analysis page provides safe, parameterized execution of 6 core analytical queries:
- **`SELECT`, `WHERE`, `ORDER BY`:** Sorting premium catalog items by price margin.
- **`INNER JOIN`:** Joining orders with customer names and delivery municipalities.
- **`GROUP BY` & Aggregates:** Categorical sales totals using `SUM`, `COUNT`, `AVG`.
- **Regional Performance:** Calculating regional Average Order Value ($AOV$).
- **Time-Series Grouping:** Monthly growth velocity using `DATE_FORMAT(order_date, '%Y-%m')`.
- **Rankings with `LIMIT`:** Isolating the Top 10 revenue-generating products.

---

### 5.4 Topic 4: Customer Spending Analysis (LEFT JOIN & COALESCE)
A central evaluation requirement of the project is computing customer lifetime spend without dropping inactive accounts.

#### Why `INNER JOIN` Fails:
```sql
-- INCORRECT: Inactive customers with zero orders disappear completely!
SELECT c.customer_name, SUM(oi.net_amount)
FROM customers c
INNER JOIN orders o ON c.customer_id = o.customer_id;
```

#### The Implemented Solution (`LEFT JOIN` + `COALESCE`):
```sql
SELECT 
    c.customer_id,
    c.customer_name,
    COUNT(DISTINCT o.order_id) AS total_orders,
    ROUND(COALESCE(SUM(oi.quantity * oi.unit_price * (1 - (oi.discount_percent / 100.0))), 0), 2) AS total_spending,
    COALESCE(MAX(o.order_date), 'No Orders Placed') AS last_order_date,
    CASE 
        WHEN COUNT(DISTINCT o.order_id) = 0 THEN 'Inactive (Never Purchased)'
        ELSE 'Active Customer'
    END AS customer_tier
FROM customers c
LEFT JOIN orders o 
    ON c.customer_id = o.customer_id 
    AND o.order_status != 'Cancelled'   -- CRITICAL: Filter in ON clause preserves inactives
LEFT JOIN order_items oi ON o.order_id = oi.order_id
GROUP BY c.customer_id, c.customer_name;
```
*Outcome:* All 110 customers are displayed. The 21 inactive customers show **₹0.00 spending**, **0 orders**, and an **Inactive** badge.

---

### 5.5 Topic 5: Tableau BI Integration & Denormalized Master Star Schema
The project prepares a complete star-schema extract (`tableau_sales_master.csv`) and documents a 6-step workbook construction guide:
1. **Connection:** Connect Tableau to MySQL (`127.0.0.1:3306`, database `retail_analytics`) or load `tableau_sales_master.csv`.
2. **Sheet 1 (Dual-Axis Trend):** Continuous Month of Order Date on Columns; synchronized dual axis for Net Revenue (Bar) and Profit (Line).
3. **Sheet 2 (Category Profit Margin):** Sorted horizontal bars with Profit Margin % on Color using an Orange-Blue Diverging palette.
4. **Sheet 3 (Regional Map / Bar):** Regional distribution across North, South, East, West, and Central India.
5. **Sheet 4 (Top Spenders):** Top 15 customer spenders ranked by lifetime value.
6. **Dashboard Interactivity:** 1280x850 canvas with universal filters and cross-filtering click actions on Category and Region.

---

### 5.6 Topic 6: Full-Stack Web Application Architecture
- **Backend (`backend/app.py`):** Flask REST API providing endpoints for `/api/dashboard/kpis`, `/api/dashboard/charts`, `/api/customers`, `/api/products`, `/api/orders`, `/api/practical/*`, `/api/sql/*`, and `/api/exports/*`.
- **Frontend (`frontend/src/`):** React 18 SPA styled with Tailwind CSS and Recharts:
  - Responsive light theme with executive navy text (`#0F172A`).
  - Illustrative Sample Data academic disclaimer badge.
  - Indian Rupee (`₹ INR`) currency formatting throughout.
  - Interactive modals for customer order history and order line item details.

---

## CHAPTER 6: RESULTS, VISUALIZATIONS & BUSINESS INSIGHTS

### 6.1 Executive KPI Metrics
Based on the seeded dataset of 280 orders:
- **Total Net Revenue:** ₹2,160,920.80
- **Total Operating Profit:** ₹671,840.75
- **Average Profit Margin:** 31.09%
- **Total Fulfilled Orders:** 247 orders (excluding 33 cancelled orders)
- **Average Order Value (AOV):** ₹8,748.67
- **Total Registered Accounts:** 110 customers
- **Inactive Accounts:** 21 customers (19.09% dormancy rate)

### 6.2 Sales Trend & Profit Velocity
- Monthly revenue exhibits consistent growth, peaking during festival quarters (e.g., October / November and summer sales).
- Operating profit curves tightly track net revenue, confirming healthy product unit margins across categories.

### 6.3 Category & Regional Insights
- **Electronics:** Generates the highest top-line revenue (e.g. Ultra HD Smart LED TVs and Fast Charging Power Banks), but operates at a moderate profit margin (20% to 28%).
- **Fashion & Groceries:** Exhibit lower individual ticket prices but significantly higher profit margins (45% to 58%).
- **Regional Balance:** Orders are well-distributed across the five geographical zones, with South and West driving higher average ticket sizes.

### 6.4 Customer Retention & Inactivity Findings
The `LEFT JOIN` spending analysis isolated 21 customers who registered accounts between late 2023 and early 2024 but never completed an order. This critical insight allows marketing teams to deploy targeted re-engagement campaigns and introductory discount coupons specifically to these accounts.

---

## CHAPTER 7: TESTING, VERIFICATION & VALIDATION

### 7.1 Testing Strategy
Testing was executed across three levels:
1. **Unit Testing:** Mathematical validation of discount deductions, revenue calculations, profit formulas, and AOV.
2. **Integration Testing:** API route responses, status codes (200 OK, 400 Bad Request, 404 Not Found), and JSON payloads.
3. **Database Integrity Testing:** Foreign key cascading, NULL prevention via `COALESCE`, and parameter escaping.

### 7.2 Test Case Specifications & Automated Results

All 11 automated test suites in `backend/tests/` passed with 100% green status:

```
============================= test session starts ==============================
platform darwin -- Python 3.10.0, pytest-9.1.1, pluggy-1.7.0
rootdir: /Users/sakshisingh/Desktop/college_stuffs/Business_Analytics/backend
collected 11 items

tests/test_api.py .......                                                [ 63%]
tests/test_calculations.py ....                                          [100%]

============================== 11 passed in 0.48s ==============================
```

| Test Function | Target Verified | Expected Result | Actual Result | Status |
|---|---|---|---|---|
| `test_database_connection` | MySQL DB status & table counts | $\ge 100$ cust, $\ge 20$ prod, $\ge 250$ ord | Connected, 110 cust, 24 prod, 280 ord | **PASSED** |
| `test_inactive_customers_inclusion`| LEFT JOIN & COALESCE logic | $\ge 10$ inactives, ₹0 spend, 0 orders | 21 inactives preserved with ₹0 spend | **PASSED** |
| `test_revenue_and_profit_formula` | Net Revenue & Profit formulas | Exact match with accounting formula | Mathematical equality verified | **PASSED** |
| `test_sql_analytical_queries` | Query execution registry | Returns valid columns and $\ge 100$ rows | Valid column keys and 110 rows | **PASSED** |
| `test_health_endpoint` | `GET /api/health` | HTTP 200, status "healthy" | HTTP 200, healthy | **PASSED** |
| `test_dashboard_kpis` | `GET /api/dashboard/kpis` | Valid numeric KPIs, AOV > 0 | Revenue ₹2.16M, AOV ₹8,748.67 | **PASSED** |
| `test_dashboard_charts` | `GET /api/dashboard/charts` | 6 populated chart arrays | All 6 chart arrays non-empty | **PASSED** |
| `test_customer_list_and_inactive`| `GET /api/customers` | Customer list with inactive flags | 110 customers returned | **PASSED** |
| `test_excel_practical_endpoint` | `GET /api/practical/excel-formulas` | 9 formulas + sample rows | 9 formulas verified | **PASSED** |
| `test_pivot_table_practical_endpoint` | `GET /api/practical/pivot-table` | Pivot matrix + 5 steps | Matrix & 5 steps returned | **PASSED** |
| `test_sql_execution_endpoint` | `POST /api/sql/execute` | Parameterized execution | HTTP 200, 110 rows returned | **PASSED** |

### 7.3 Data Import Integrity & Security Validation
The CSV batch upload tool (`POST /api/import/sales-csv`) was tested against malicious and corrupt files:
- **Missing Headers:** Rejected with descriptive error.
- **Invalid Foreign Keys:** Non-existent customer IDs or product IDs flagged with line number.
- **Negative Quantities / Discounts > 100%:** Blocked before reaching the database.
- **Rollback:** Transaction aborted if validation fails; no partial corruption occurs.

---

## CHAPTER 8: CONCLUSION & FUTURE SCOPE

### 8.1 Summary of Contributions
The **Retail Sales and Customer Analytics Dashboard** successfully unites theoretical business intelligence with production software engineering:
- Built a normalized 3NF MySQL relational database with constraints and analytical views.
- Implemented and verified the 9 core Excel logical formulas and a Pivot Table simulation.
- Solved the common relational trap of customer omission using `LEFT JOIN` and `COALESCE`.
- Provided export pipelines for Tableau Desktop with dual-axis visualization guides.
- Packaged the entire workflow into a responsive React and Flask web application.

### 8.2 Key Academic Takeaways
- Relational schema normalization prevents data redundancy while analytical views optimize reporting.
- Outer joins are essential in business analytics to ensure zero-activity entities (inactive customers, unsold products) are not erroneously dropped.
- Parameterized backend queries ensure safe analytics without exposing raw SQL execution to web clients.

### 8.3 Future Enhancements
- **Machine Learning Integration:** Incorporating ARIMA or Prophet time-series models for predictive demand forecasting.
- **Automated RFM Segmentation:** Clustering customers dynamically into Recency, Frequency, and Monetary quintiles.
- **Inventory Replenishment Triggers:** Real-time email webhooks when product stock falls below critical reorder points.

---

## REFERENCES & BIBLIOGRAPHY

1. Elmasri, R., & Navathe, S. B. (2015). *Fundamentals of Database Systems* (7th ed.). Pearson.
2. Silberschatz, A., Korth, H. F., & Sudarshan, S. (2020). *Database System Concepts* (7th ed.). McGraw-Hill.
3. Walkenbach, J. (2015). *Microsoft Excel 2016 Bible*. John Wiley & Sons.
4. Few, S. (2013). *Information Dashboard Design: Displaying Data for At-a-Glance Monitoring* (2nd ed.). Analytics Press.
5. Grinberg, M. (2018). *Flask Web Development: Developing Web Applications with Python* (2nd ed.). O'Reilly Media.
6. Tableau Software. (2024). *Tableau Desktop Guide: Best Practices in Data Visualization*. Salesforce.
7. React Documentation. (2025). *Building Interactive User Interfaces with React 18*. Meta Open Source.

---

## APPENDICES

- **Appendix A:** Complete Database DDL Script (`backend/sql/schema.sql`)
- **Appendix B:** Predefined Analytical SQL Queries (`backend/sql/analytical_queries.sql`)
- **Appendix C:** Master Denormalized Extract (`backend/exports/tableau_sales_master.csv`)
- **Appendix D:** Automated Test Suite Execution Logs (`backend/tests/`)
