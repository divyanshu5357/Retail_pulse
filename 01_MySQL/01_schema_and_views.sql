-- Retail Sales and Customer Analytics Database Schema
-- Database Name: retail_analytics
-- Target DBMS: MySQL 8.0+ / 9.x

CREATE DATABASE IF NOT EXISTS retail_analytics
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE retail_analytics;

-- Drop existing tables in reverse dependency order if resetting
DROP VIEW IF EXISTS v_tableau_sales_master;
DROP VIEW IF EXISTS v_customer_summary;
DROP VIEW IF EXISTS v_order_financials;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS customers;

-- 1. Customers Table
CREATE TABLE customers (
    customer_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    city VARCHAR(50) NOT NULL,
    region VARCHAR(30) NOT NULL,
    registration_date DATE NOT NULL,
    INDEX idx_customers_region (region),
    INDEX idx_customers_city (city),
    INDEX idx_customers_reg_date (registration_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Products Table
CREATE TABLE products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(120) NOT NULL,
    category VARCHAR(50) NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    cost_price DECIMAL(10, 2) NOT NULL,
    CONSTRAINT chk_unit_price CHECK (unit_price >= 0),
    CONSTRAINT chk_cost_price CHECK (cost_price >= 0),
    INDEX idx_products_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Orders Table
CREATE TABLE orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    order_date DATE NOT NULL,
    order_status VARCHAR(30) NOT NULL,
    region VARCHAR(30) NOT NULL,
    CONSTRAINT fk_orders_customer
        FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    INDEX idx_orders_customer (customer_id),
    INDEX idx_orders_date (order_date),
    INDEX idx_orders_status (order_status),
    INDEX idx_orders_region (region)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Order Items Table
CREATE TABLE order_items (
    order_item_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    discount_percent DECIMAL(5, 2) NOT NULL DEFAULT 0.00,
    CONSTRAINT chk_item_quantity CHECK (quantity > 0),
    CONSTRAINT chk_discount_percent CHECK (discount_percent >= 0 AND discount_percent <= 100),
    CONSTRAINT fk_items_order
        FOREIGN KEY (order_id) REFERENCES orders(order_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_items_product
        FOREIGN KEY (product_id) REFERENCES products(product_id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    INDEX idx_items_order (order_id),
    INDEX idx_items_product (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Analytical View 1: Customer Spending Summary (Requirement 4 & 9)
-- Uses LEFT JOIN, SUM, GROUP BY, and COALESCE so inactive customers remain included with 0 spend
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
    c.customer_id,
    c.customer_name,
    c.email,
    c.city,
    c.region,
    c.registration_date;

-- Analytical View 2: Tableau and Excel Denormalized Master Dataset
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
