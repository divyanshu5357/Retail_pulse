-- ==============================================================================
-- Retail Sales & Customer Analytics - Analytical SQL Query Suite
-- Practical demonstrations of relational algebra, joins, aggregates, and reporting
-- ==============================================================================

USE retail_analytics;

-- ------------------------------------------------------------------------------
-- Topic 1: Basic SELECT, WHERE, and ORDER BY
-- Objective: Retrieve top 10 premium products priced above ₹2,000 sorted by price
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
-- Topic 2: INNER JOIN with Filtering
-- Objective: Identify all delivered orders with customer names and order dates
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
-- Topic 3: GROUP BY with Aggregates (SUM, COUNT, AVG)
-- Objective: Sales performance summary broken down by product category
-- ------------------------------------------------------------------------------
SELECT 
    p.category,
    COUNT(DISTINCT o.order_id) AS total_orders_containing_category,
    SUM(oi.quantity) AS total_units_sold,
    ROUND(AVG(oi.unit_price), 2) AS avg_selling_price,
    ROUND(SUM(oi.quantity * oi.unit_price * (1 - (oi.discount_percent / 100.0))), 2) AS total_revenue,
    ROUND(SUM((oi.quantity * oi.unit_price * (1 - (oi.discount_percent / 100.0))) - (oi.quantity * p.cost_price)), 2) AS total_profit
FROM order_items oi
INNER JOIN products p ON oi.product_id = p.product_id
INNER JOIN orders o ON oi.order_id = o.order_id
WHERE o.order_status != 'Cancelled'
GROUP BY p.category
ORDER BY total_revenue DESC;

-- ------------------------------------------------------------------------------
-- Topic 4: Regional Performance with Average Order Value (AOV)
-- Objective: Analyze revenue, profit, and average ticket size per geographic region
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
-- Objective: Retrieve EVERY customer, including those with 0 purchases.
-- Notice: Filter o.order_status != 'Cancelled' is located in the LEFT JOIN condition
-- so inactive or zero-order customers are NOT excluded by a WHERE clause!
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
-- Objective: Filter specifically for customers who registered but have 0 orders
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
-- Topic 7: Monthly Sales Trend & Growth Analysis
-- Objective: Month-over-month revenue tracking
-- ------------------------------------------------------------------------------
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

-- ------------------------------------------------------------------------------
-- Topic 8: Top 10 Best Selling Products by Net Revenue
-- Objective: Product ranking for merchandising and replenishment
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
