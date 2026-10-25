from db import query_db

PREDEFINED_QUERIES = [
    {
        "id": "customer_spending_coalesce",
        "title": "Customer Spending Analysis (LEFT JOIN, SUM, GROUP BY & COALESCE)",
        "category": "Customer Analytics",
        "badge": "Core Requirement",
        "concept": "LEFT JOIN, SUM, GROUP BY, COALESCE",
        "description": (
            "Demonstrates calculating lifetime spending across ALL customers. By using a LEFT JOIN and placing the "
            "order status filter inside the ON clause, customers with 0 orders remain included rather than being eliminated. "
            "COALESCE() converts NULL order sums to 0.00."
        ),
        "sql": """SELECT 
    c.customer_id,
    c.customer_name,
    c.email,
    c.city,
    c.region,
    COUNT(DISTINCT o.order_id) AS total_orders,
    ROUND(COALESCE(SUM(oi.quantity * oi.unit_price * (1 - (oi.discount_percent / 100.0))), 0), 2) AS total_spending,
    COALESCE(MAX(o.order_date), 'No Orders Placed') AS last_order_date,
    CASE 
        WHEN COUNT(DISTINCT o.order_id) = 0 THEN 'Inactive (Never Purchased)'
        WHEN COALESCE(SUM(oi.quantity * oi.unit_price * (1 - (oi.discount_percent / 100.0))), 0) >= 50000 THEN 'Platinum'
        WHEN COALESCE(SUM(oi.quantity * oi.unit_price * (1 - (oi.discount_percent / 100.0))), 0) >= 20000 THEN 'Gold'
        WHEN COALESCE(SUM(oi.quantity * oi.unit_price * (1 - (oi.discount_percent / 100.0))), 0) >= 5000 THEN 'Silver'
        ELSE 'Bronze'
    END AS customer_tier
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
ORDER BY total_spending DESC;"""
    },
    {
        "id": "inactive_customers_zero_orders",
        "title": "Inactive Customers Detection (IS NULL Check)",
        "category": "Customer Analytics",
        "badge": "Retention",
        "concept": "LEFT JOIN with IS NULL Filter",
        "description": (
            "Identifies newly registered customers who have never placed an order in the retail system. "
            "Uses a LEFT JOIN between customers and orders, filtering where o.order_id IS NULL to isolate accounts with zero lifetime orders."
        ),
        "sql": """SELECT 
    c.customer_id,
    c.customer_name,
    c.email,
    c.city,
    c.region,
    c.registration_date,
    0 AS total_orders,
    0.00 AS total_spending,
    'Never Purchased' AS status
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
WHERE o.order_id IS NULL
ORDER BY c.registration_date ASC;"""
    },
    {
        "id": "category_performance_aggregates",
        "title": "Category Performance Summary (Aggregates & Profit Margin)",
        "category": "Sales & Products",
        "badge": "Aggregation",
        "concept": "INNER JOIN, GROUP BY, SUM, AVG",
        "description": (
            "Aggregates units sold, net revenue, total profit, and average item selling price grouped by product category. "
            "Excludes cancelled orders to reflect net realized business income."
        ),
        "sql": """SELECT 
    p.category,
    COUNT(DISTINCT o.order_id) AS distinct_orders,
    SUM(oi.quantity) AS total_units_sold,
    ROUND(AVG(oi.unit_price), 2) AS avg_unit_price,
    ROUND(SUM(oi.quantity * oi.unit_price * (1 - (oi.discount_percent / 100.0))), 2) AS total_revenue,
    ROUND(SUM((oi.quantity * oi.unit_price * (1 - (oi.discount_percent / 100.0))) - (oi.quantity * p.cost_price)), 2) AS total_profit,
    ROUND((SUM((oi.quantity * oi.unit_price * (1 - (oi.discount_percent / 100.0))) - (oi.quantity * p.cost_price)) / 
           SUM(oi.quantity * oi.unit_price * (1 - (oi.discount_percent / 100.0)))) * 100, 2) AS profit_margin_pct
FROM order_items oi
INNER JOIN products p ON oi.product_id = p.product_id
INNER JOIN orders o ON oi.order_id = o.order_id
WHERE o.order_status != 'Cancelled'
GROUP BY p.category
ORDER BY total_revenue DESC;"""
    },
    {
        "id": "regional_sales_aov",
        "title": "Regional Sales & Average Order Value (AOV)",
        "category": "Regional Analysis",
        "badge": "KPI",
        "concept": "Regional Grouping, AOV Computation",
        "description": (
            "Calculates total revenue and Average Order Value (AOV = Total Revenue / Total Orders) across all 5 geographical zones "
            "(North, South, East, West, Central)."
        ),
        "sql": """SELECT 
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
ORDER BY regional_revenue DESC;"""
    },
    {
        "id": "monthly_sales_trend",
        "title": "Monthly Sales Trend (Time Series Aggregation)",
        "category": "Time Series",
        "badge": "Trend",
        "concept": "DATE_FORMAT, Time-based GROUP BY",
        "description": (
            "Groups sales data by Year and Month to track monthly revenue trajectory and profit velocity over time."
        ),
        "sql": """SELECT 
    DATE_FORMAT(o.order_date, '%Y-%m') AS month,
    COUNT(DISTINCT o.order_id) AS orders_placed,
    ROUND(SUM(oi.quantity * oi.unit_price * (1 - (oi.discount_percent / 100.0))), 2) AS monthly_revenue,
    ROUND(SUM((oi.quantity * oi.unit_price * (1 - (oi.discount_percent / 100.0))) - (oi.quantity * p.cost_price)), 2) AS monthly_profit
FROM orders o
INNER JOIN order_items oi ON o.order_id = oi.order_id
INNER JOIN products p ON oi.product_id = p.product_id
WHERE o.order_status != 'Cancelled'
GROUP BY DATE_FORMAT(o.order_date, '%Y-%m')
ORDER BY month ASC;"""
    },
    {
        "id": "top_selling_products",
        "title": "Top Selling Products by Revenue Ranking",
        "category": "Sales & Products",
        "badge": "Ranking",
        "concept": "Multi-table Join & Ranking with LIMIT",
        "description": (
            "Ranks catalog items by net revenue generated, calculating gross revenue, total discounts given, and net profit margins."
        ),
        "sql": """SELECT 
    p.product_id,
    p.product_name,
    p.category,
    p.unit_price,
    SUM(oi.quantity) AS total_sold_qty,
    ROUND(SUM(oi.quantity * oi.unit_price * (1 - (oi.discount_percent / 100.0))), 2) AS net_revenue,
    ROUND(SUM((oi.quantity * oi.unit_price * (1 - (oi.discount_percent / 100.0))) - (oi.quantity * p.cost_price)), 2) AS net_profit
FROM products p
INNER JOIN order_items oi ON p.product_id = oi.product_id
INNER JOIN orders o ON oi.order_id = o.order_id
WHERE o.order_status != 'Cancelled'
GROUP BY p.product_id, p.product_name, p.category, p.unit_price
ORDER BY net_revenue DESC
LIMIT 10;"""
    }
]

def get_predefined_queries():
    """Return catalog of approved queries."""
    return [
        {
            "id": q["id"],
            "title": q["title"],
            "category": q["category"],
            "badge": q["badge"],
            "concept": q["concept"],
            "description": q["description"],
            "sql": q["sql"]
        }
        for q in PREDEFINED_QUERIES
    ]

def execute_predefined_query(query_id):
    """Execute a predefined query safely."""
    target = next((q for q in PREDEFINED_QUERIES if q["id"] == query_id), None)
    if not target:
        raise ValueError(f"Unknown query ID: {query_id}")
    
    rows = query_db(target["sql"])
    columns = list(rows[0].keys()) if rows else []
    
    # Convert Decimal/Date objects to JSON serializable formats
    formatted_rows = []
    for r in rows:
        row_dict = {}
        for k, v in r.items():
            if hasattr(v, '__float__'):
                row_dict[k] = float(v)
            elif hasattr(v, 'strftime'):
                row_dict[k] = v.strftime('%Y-%m-%d')
            else:
                row_dict[k] = v
        formatted_rows.append(row_dict)

    return {
        "id": target["id"],
        "title": target["title"],
        "category": target["category"],
        "concept": target["concept"],
        "description": target["description"],
        "sql": target["sql"],
        "columns": columns,
        "rows": formatted_rows,
        "row_count": len(formatted_rows)
    }
