-- ==============================================================================
-- RETAIL SALES & CUSTOMER ANALYTICS: MASTER ANALYTICAL SQL SUITE
-- Target DBMS: MySQL 8.0+ / 9.x
-- Database: retail_analytics
-- ==============================================================================

USE retail_analytics;

-- ------------------------------------------------------------------------------
-- Topic 1: Basic SELECT, Filtering (WHERE), and Sorting (ORDER BY)
-- Business Objective: Identify premium retail products priced above ₹2,000, 
-- calculate their unit margins, and sort by highest ticket price.
-- ------------------------------------------------------------------------------
SELECT 
    product_id,
    product_name,
    category,
    unit_price,
    cost_price,
    (unit_price - cost_price) AS unit_margin,
    ROUND(((unit_price - cost_price) / unit_price) * 100, 2) AS profit_margin_pct
FROM products
WHERE unit_price >= 2000.00
ORDER BY unit_price DESC
LIMIT 10;

-- ------------------------------------------------------------------------------
-- Topic 2: Relational INNER JOIN with Multi-Condition Filtering
-- Business Objective: Track completed order fulfillment across geographical 
-- territories, mapping orders to registered customer records.
-- ------------------------------------------------------------------------------
SELECT 
    o.order_id,
    o.order_date,
    c.customer_name,
    c.city,
    o.region,
    o.order_status
FROM orders o
INNER JOIN customers c ON o.customer_id = c.customer_id
WHERE o.order_status = 'Delivered'
ORDER BY o.order_date DESC
LIMIT 15;

-- ------------------------------------------------------------------------------
-- Topic 3: GROUP BY with Multi-Metric Aggregations (SUM, COUNT, AVG, ROUND)
-- Business Objective: Evaluate merchandise department performance by measuring
-- order volume, units moved, average selling price, net revenue, and gross profit.
-- ------------------------------------------------------------------------------
SELECT 
    p.category,
    COUNT(DISTINCT o.order_id) AS total_orders_containing_category,
    SUM(oi.quantity) AS total_units_sold,
    ROUND(AVG(oi.unit_price), 2) AS avg_selling_price,
    ROUND(SUM(oi.quantity * oi.unit_price * (1 - (oi.discount_percent / 100.0))), 2) AS total_revenue,
    ROUND(SUM((oi.quantity * oi.unit_price * (1 - (oi.discount_percent / 100.0))) - (oi.quantity * p.cost_price)), 2) AS total_profit,
    ROUND(
        (SUM((oi.quantity * oi.unit_price * (1 - (oi.discount_percent / 100.0))) - (oi.quantity * p.cost_price)) / 
         SUM(oi.quantity * oi.unit_price * (1 - (oi.discount_percent / 100.0)))) * 100, 2
    ) AS profit_margin_pct
FROM order_items oi
INNER JOIN products p ON oi.product_id = p.product_id
INNER JOIN orders o ON oi.order_id = o.order_id
WHERE o.order_status != 'Cancelled'
GROUP BY p.category
ORDER BY total_revenue DESC;

-- ------------------------------------------------------------------------------
-- Topic 4: Regional Performance with Average Order Value (AOV)
-- Business Objective: Determine regional revenue concentration and assess 
-- customer purchasing power through Average Order Value (AOV).
-- ------------------------------------------------------------------------------
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

-- ------------------------------------------------------------------------------
-- Topic 5: Customer Spending Analysis using LEFT JOIN, SUM, GROUP BY, and COALESCE
-- Business Objective: Comprehensive audit of EVERY registered customer.
-- Using LEFT JOIN ensures inactive/zero-order customers are preserved.
-- Applies CASE statements to classify customers into lifetime spending tiers.
-- ------------------------------------------------------------------------------
SELECT 
    c.customer_id,
    c.customer_name,
    c.email,
    c.city,
    c.region,
    COUNT(DISTINCT o.order_id) AS order_count,
    COALESCE(SUM(oi.quantity * oi.unit_price * (1 - (oi.discount_percent / 100.0))), 0) AS total_spent_inr,
    COALESCE(MAX(o.order_date), 'Never Ordered') AS last_purchase_date,
    CASE 
        WHEN COUNT(DISTINCT o.order_id) = 0 THEN 'Inactive / No Orders'
        WHEN COALESCE(SUM(oi.quantity * oi.unit_price * (1 - (oi.discount_percent / 100.0))), 0) >= 50000 THEN 'Platinum Spender'
        WHEN COALESCE(SUM(oi.quantity * oi.unit_price * (1 - (oi.discount_percent / 100.0))), 0) >= 20000 THEN 'Gold Spender'
        WHEN COALESCE(SUM(oi.quantity * oi.unit_price * (1 - (oi.discount_percent / 100.0))), 0) >= 5000 THEN 'Silver Spender'
        ELSE 'Bronze Spender'
    END AS spending_tier
FROM customers c
LEFT JOIN orders o 
    ON c.customer_id = o.customer_id 
    AND o.order_status != 'Cancelled'
LEFT JOIN order_items oi 
    ON o.order_id = oi.order_id
GROUP BY 
    c.customer_id,
    c.customer_name,
    c.email,
    c.city,
    c.region
ORDER BY total_spent_inr DESC;

-- ------------------------------------------------------------------------------
-- Topic 6: Identification of Inactive Customers (Zero Lifetime Orders)
-- Business Objective: Detect registered users who never converted to purchasing,
-- enabling re-engagement and win-back promotional targeting.
-- ------------------------------------------------------------------------------
SELECT 
    c.customer_id,
    c.customer_name,
    c.email,
    c.city,
    c.region,
    c.registration_date,
    0 AS total_orders,
    0.00 AS total_spending,
    'Inactive Customer' AS account_status
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
WHERE o.order_id IS NULL
ORDER BY c.registration_date ASC;

-- ------------------------------------------------------------------------------
-- Topic 7: Monthly Sales Trend & Velocity Analysis
-- Business Objective: Track Month-over-Month (MoM) revenue trajectory, order 
-- velocity, and margin stability across the full timeline.
-- ------------------------------------------------------------------------------
SELECT 
    DATE_FORMAT(o.order_date, '%Y-%m') AS sale_month,
    COUNT(DISTINCT o.order_id) AS total_orders,
    ROUND(SUM(oi.quantity * oi.unit_price * (1 - (oi.discount_percent / 100.0))), 2) AS monthly_revenue,
    ROUND(SUM((oi.quantity * oi.unit_price * (1 - (oi.discount_percent / 100.0))) - (oi.quantity * p.cost_price)), 2) AS monthly_profit,
    ROUND(
        (SUM((oi.quantity * oi.unit_price * (1 - (oi.discount_percent / 100.0))) - (oi.quantity * p.cost_price)) / 
         SUM(oi.quantity * oi.unit_price * (1 - (oi.discount_percent / 100.0)))) * 100, 2
    ) AS monthly_margin_pct
FROM orders o
INNER JOIN order_items oi ON o.order_id = oi.order_id
INNER JOIN products p ON oi.product_id = p.product_id
WHERE o.order_status != 'Cancelled'
GROUP BY DATE_FORMAT(o.order_date, '%Y-%m')
ORDER BY sale_month ASC;

-- ------------------------------------------------------------------------------
-- Topic 8: Top 10 Best-Selling Products by Net Realized Revenue
-- Business Objective: Rank top individual SKUs for inventory planning, 
-- warehouse restocking, and supplier price negotiation.
-- ------------------------------------------------------------------------------
SELECT 
    p.product_id,
    p.product_name,
    p.category,
    SUM(oi.quantity) AS total_quantity_sold,
    ROUND(SUM(oi.quantity * oi.unit_price * (1 - (oi.discount_percent / 100.0))), 2) AS net_revenue,
    ROUND(SUM((oi.quantity * oi.unit_price * (1 - (oi.discount_percent / 100.0))) - (oi.quantity * p.cost_price)), 2) AS total_profit,
    ROUND(
        (SUM((oi.quantity * oi.unit_price * (1 - (oi.discount_percent / 100.0))) - (oi.quantity * p.cost_price)) / 
         SUM(oi.quantity * oi.unit_price * (1 - (oi.discount_percent / 100.0)))) * 100, 2
    ) AS margin_percentage
FROM products p
INNER JOIN order_items oi ON p.product_id = oi.product_id
INNER JOIN orders o ON oi.order_id = o.order_id
WHERE o.order_status != 'Cancelled'
GROUP BY p.product_id, p.product_name, p.category
ORDER BY net_revenue DESC
LIMIT 10;

-- ------------------------------------------------------------------------------
-- Topic 9: Window Functions (DENSE_RANK() OVER PARTITION)
-- Business Objective: Rank products by revenue WITHIN their respective categories
-- to identify category leaders and laggards.
-- ------------------------------------------------------------------------------
WITH CategoryProductRevenue AS (
    SELECT 
        p.category,
        p.product_name,
        ROUND(SUM(oi.quantity * oi.unit_price * (1 - (oi.discount_percent / 100.0))), 2) AS product_revenue,
        SUM(oi.quantity) AS units_sold
    FROM products p
    JOIN order_items oi ON p.product_id = oi.product_id
    JOIN orders o ON oi.order_id = o.order_id
    WHERE o.order_status != 'Cancelled'
    GROUP BY p.category, p.product_name
)
SELECT 
    category,
    product_name,
    product_revenue,
    units_sold,
    DENSE_RANK() OVER (PARTITION BY category ORDER BY product_revenue DESC) AS rank_within_category
FROM CategoryProductRevenue
ORDER BY category, rank_within_category;

-- ------------------------------------------------------------------------------
-- Topic 10: Window Functions (Cumulative Running Total)
-- Business Objective: Compute running cumulative revenue across calendar months.
-- ------------------------------------------------------------------------------
SELECT 
    sale_month,
    monthly_revenue,
    SUM(monthly_revenue) OVER (ORDER BY sale_month ASC) AS cumulative_running_revenue
FROM (
    SELECT 
        DATE_FORMAT(o.order_date, '%Y-%m') AS sale_month,
        ROUND(SUM(oi.quantity * oi.unit_price * (1 - (oi.discount_percent / 100.0))), 2) AS monthly_revenue
    FROM orders o
    JOIN order_items oi ON o.order_id = oi.order_id
    WHERE o.order_status != 'Cancelled'
    GROUP BY DATE_FORMAT(o.order_date, '%Y-%m')
) AS monthly_summary
ORDER BY sale_month ASC;

-- ------------------------------------------------------------------------------
-- Topic 11: Common Table Expressions (CTE) - Customer Repeat Purchase Analysis
-- Business Objective: Determine percentage of one-time vs multi-order buyers.
-- ------------------------------------------------------------------------------
WITH CustomerOrderCounts AS (
    SELECT 
        c.customer_id,
        COUNT(DISTINCT o.order_id) AS completed_orders
    FROM customers c
    LEFT JOIN orders o ON c.customer_id = o.customer_id AND o.order_status != 'Cancelled'
    GROUP BY c.customer_id
)
SELECT 
    CASE 
        WHEN completed_orders = 0 THEN '0 Orders (Inactive)'
        WHEN completed_orders = 1 THEN '1 Order (One-Time Buyer)'
        WHEN completed_orders BETWEEN 2 AND 3 THEN '2-3 Orders (Repeat Buyer)'
        ELSE '4+ Orders (Loyal Champion)'
    END AS customer_loyalty_segment,
    COUNT(*) AS total_customers,
    ROUND((COUNT(*) / (SELECT COUNT(*) FROM customers)) * 100, 2) AS percentage_of_customer_base
FROM CustomerOrderCounts
GROUP BY customer_loyalty_segment
ORDER BY total_customers DESC;
