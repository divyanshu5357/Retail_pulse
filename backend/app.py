import os
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from config import Config
from db import query_db, get_db_status
from analytical_queries import get_predefined_queries, execute_predefined_query
from export_manager import (
    get_export_file_path,
    get_excel_practical_data,
    get_pivot_table_practical_data,
    validate_and_import_sales_csv
)
from seed_data import seed_database

app = Flask(__name__)
# Enable CORS for frontend Vite dev server (usually localhost:5173) and local requests
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Helper to build filter clauses
def build_filter_clauses(args, table_prefix='o', include_cancelled=False):
    clauses = []
    params = []

    if not include_cancelled:
        clauses.append(f"{table_prefix}.order_status != 'Cancelled'")

    start_date = args.get('start_date')
    if start_date:
        clauses.append(f"{table_prefix}.order_date >= %s")
        params.append(start_date)

    end_date = args.get('end_date')
    if end_date:
        clauses.append(f"{table_prefix}.order_date <= %s")
        params.append(end_date)

    region = args.get('region')
    if region and region != 'All':
        clauses.append(f"{table_prefix}.region = %s")
        params.append(region)

    category = args.get('category')
    if category and category != 'All':
        clauses.append("p.category = %s")
        params.append(category)

    where_sql = " AND ".join(clauses)
    return (f"WHERE {where_sql}" if where_sql else ""), params

# ------------------------------------------------------------------------------
# 1. System & Health Endpoints
# ------------------------------------------------------------------------------
@app.route('/api/health', methods=['GET'])
def health():
    status = get_db_status()
    return jsonify({
        "status": "healthy" if status["status"] == "connected" else "degraded",
        "database": status
    })

@app.route('/api/filter-options', methods=['GET'])
def filter_options():
    regions = [r['region'] for r in query_db("SELECT DISTINCT region FROM customers ORDER BY region;")]
    categories = [r['category'] for r in query_db("SELECT DISTINCT category FROM products ORDER BY category;")]
    date_bounds = query_db("SELECT MIN(order_date) as min_date, MAX(order_date) as max_date FROM orders;", one=True)
    
    return jsonify({
        "regions": ["All"] + regions,
        "categories": ["All"] + categories,
        "min_date": str(date_bounds['min_date']) if date_bounds and date_bounds['min_date'] else "2024-01-01",
        "max_date": str(date_bounds['max_date']) if date_bounds and date_bounds['max_date'] else "2025-12-31"
    })

# ------------------------------------------------------------------------------
# 2. Dashboard KPIs & Charts (Dynamic Calculation from underlying data)
# ------------------------------------------------------------------------------
@app.route('/api/dashboard/kpis', methods=['GET'])
def dashboard_kpis():
    where_sql, params = build_filter_clauses(request.args, table_prefix='o', include_cancelled=False)

    # Net Revenue, Total Orders, Total Profit
    rev_sql = f"""
    SELECT 
        COUNT(DISTINCT o.order_id) AS total_orders,
        COALESCE(SUM(oi.quantity * oi.unit_price * (1 - (oi.discount_percent / 100.0))), 0) AS total_revenue,
        COALESCE(SUM((oi.quantity * oi.unit_price * (1 - (oi.discount_percent / 100.0))) - (oi.quantity * p.cost_price)), 0) AS total_profit
    FROM orders o
    JOIN order_items oi ON o.order_id = oi.order_id
    JOIN products p ON oi.product_id = p.product_id
    {where_sql};
    """
    kpi_financials = query_db(rev_sql, params, one=True) or {}
    total_revenue = float(kpi_financials.get('total_revenue') or 0.0)
    total_orders = int(kpi_financials.get('total_orders') or 0)
    total_profit = float(kpi_financials.get('total_profit') or 0.0)
    aov = round(total_revenue / total_orders, 2) if total_orders > 0 else 0.0

    # Total registered customers (or filtered customers if region specified)
    cust_region = request.args.get('region')
    if cust_region and cust_region != 'All':
        cust_cnt = query_db("SELECT COUNT(*) AS cnt FROM customers WHERE region = %s;", [cust_region], one=True)['cnt']
    else:
        cust_cnt = query_db("SELECT COUNT(*) AS cnt FROM customers;", one=True)['cnt']

    # Total products catalog
    cat = request.args.get('category')
    if cat and cat != 'All':
        prod_cnt = query_db("SELECT COUNT(*) AS cnt FROM products WHERE category = %s;", [cat], one=True)['cnt']
    else:
        prod_cnt = query_db("SELECT COUNT(*) AS cnt FROM products;", one=True)['cnt']

    # Inactive Customers (customers with 0 lifetime orders)
    inactive_cnt = query_db(
        "SELECT COUNT(*) AS cnt FROM customers c "
        "LEFT JOIN orders o ON c.customer_id = o.customer_id "
        "WHERE o.order_id IS NULL;",
        one=True
    )['cnt']

    return jsonify({
        "total_revenue": round(total_revenue, 2),
        "total_profit": round(total_profit, 2),
        "profit_margin_pct": round((total_profit / total_revenue * 100), 2) if total_revenue > 0 else 0.0,
        "total_orders": total_orders,
        "total_customers": cust_cnt,
        "total_products": prod_cnt,
        "average_order_value": aov,
        "inactive_customers": inactive_cnt
    })

@app.route('/api/dashboard/charts', methods=['GET'])
def dashboard_charts():
    where_sql, params = build_filter_clauses(request.args, table_prefix='o', include_cancelled=False)

    # 1. Monthly sales trend
    monthly_sql = f"""
    SELECT 
        DATE_FORMAT(o.order_date, '%Y-%m') AS month,
        DATE_FORMAT(o.order_date, '%b %y') AS month_label,
        ROUND(SUM(oi.quantity * oi.unit_price * (1 - (oi.discount_percent / 100.0))), 2) AS revenue,
        ROUND(SUM((oi.quantity * oi.unit_price * (1 - (oi.discount_percent / 100.0))) - (oi.quantity * p.cost_price)), 2) AS profit,
        COUNT(DISTINCT o.order_id) AS orders_count
    FROM orders o
    JOIN order_items oi ON o.order_id = oi.order_id
    JOIN products p ON oi.product_id = p.product_id
    {where_sql}
    GROUP BY DATE_FORMAT(o.order_date, '%Y-%m'), DATE_FORMAT(o.order_date, '%b %y')
    ORDER BY month ASC;
    """
    monthly_trend = [
        {
            "month": r["month"],
            "month_label": r["month_label"],
            "revenue": float(r["revenue"]),
            "profit": float(r["profit"]),
            "orders": int(r["orders_count"])
        }
        for r in query_db(monthly_sql, params)
    ]

    # 2. Revenue by product category
    cat_sql = f"""
    SELECT 
        p.category,
        ROUND(SUM(oi.quantity * oi.unit_price * (1 - (oi.discount_percent / 100.0))), 2) AS revenue,
        ROUND(SUM((oi.quantity * oi.unit_price * (1 - (oi.discount_percent / 100.0))) - (oi.quantity * p.cost_price)), 2) AS profit,
        SUM(oi.quantity) AS units_sold
    FROM orders o
    JOIN order_items oi ON o.order_id = oi.order_id
    JOIN products p ON oi.product_id = p.product_id
    {where_sql}
    GROUP BY p.category
    ORDER BY revenue DESC;
    """
    category_revenue = [
        {
            "category": r["category"],
            "revenue": float(r["revenue"]),
            "profit": float(r["profit"]),
            "units_sold": int(r["units_sold"])
        }
        for r in query_db(cat_sql, params)
    ]

    # 3. Sales by region
    reg_sql = f"""
    SELECT 
        o.region,
        ROUND(SUM(oi.quantity * oi.unit_price * (1 - (oi.discount_percent / 100.0))), 2) AS revenue,
        ROUND(SUM((oi.quantity * oi.unit_price * (1 - (oi.discount_percent / 100.0))) - (oi.quantity * p.cost_price)), 2) AS profit,
        COUNT(DISTINCT o.order_id) AS orders_count
    FROM orders o
    JOIN order_items oi ON o.order_id = oi.order_id
    JOIN products p ON oi.product_id = p.product_id
    {where_sql}
    GROUP BY o.region
    ORDER BY revenue DESC;
    """
    regional_sales = [
        {
            "region": r["region"],
            "revenue": float(r["revenue"]),
            "profit": float(r["profit"]),
            "orders": int(r["orders_count"])
        }
        for r in query_db(reg_sql, params)
    ]

    # 4. Top-selling products
    prod_sql = f"""
    SELECT 
        p.product_id,
        p.product_name,
        p.category,
        ROUND(SUM(oi.quantity * oi.unit_price * (1 - (oi.discount_percent / 100.0))), 2) AS revenue,
        SUM(oi.quantity) AS units_sold
    FROM orders o
    JOIN order_items oi ON o.order_id = oi.order_id
    JOIN products p ON oi.product_id = p.product_id
    {where_sql}
    GROUP BY p.product_id, p.product_name, p.category
    ORDER BY revenue DESC
    LIMIT 6;
    """
    top_products = [
        {
            "product_id": r["product_id"],
            "product_name": r["product_name"],
            "category": r["category"],
            "revenue": float(r["revenue"]),
            "units_sold": int(r["units_sold"])
        }
        for r in query_db(prod_sql, params)
    ]

    # 5. Customer spending distribution tiers
    tier_sql = """
    SELECT 
        customer_segment,
        COUNT(*) AS customer_count,
        ROUND(SUM(total_spending), 2) AS tier_revenue
    FROM v_customer_summary
    GROUP BY customer_segment
    ORDER BY tier_revenue DESC;
    """
    spending_distribution = [
        {
            "segment": r["customer_segment"],
            "customers": int(r["customer_count"]),
            "total_spending": float(r["tier_revenue"])
        }
        for r in query_db(tier_sql)
    ]

    # 6. Order status breakdown
    status_where_sql, status_params = build_filter_clauses(request.args, table_prefix='o', include_cancelled=True)
    status_sql = f"""
    SELECT 
        o.order_status,
        COUNT(DISTINCT o.order_id) AS orders_count
    FROM orders o
    JOIN order_items oi ON o.order_id = oi.order_id
    JOIN products p ON oi.product_id = p.product_id
    {status_where_sql}
    GROUP BY o.order_status
    ORDER BY orders_count DESC;
    """
    order_status_breakdown = [
        {
            "status": r["order_status"],
            "count": int(r["orders_count"])
        }
        for r in query_db(status_sql, status_params)
    ]

    return jsonify({
        "monthly_trend": monthly_trend,
        "category_revenue": category_revenue,
        "regional_sales": regional_sales,
        "top_products": top_products,
        "spending_distribution": spending_distribution,
        "order_status_breakdown": order_status_breakdown
    })

# ------------------------------------------------------------------------------
# 3. Customer Management & Spending Analysis (Requirement 4 & 9)
# ------------------------------------------------------------------------------
@app.route('/api/customers', methods=['GET'])
def get_customers():
    search = request.args.get('search', '').strip()
    region = request.args.get('region', 'All')
    segment = request.args.get('segment', 'All')

    clauses = []
    params = []

    if search:
        clauses.append("(c.customer_name LIKE %s OR c.email LIKE %s OR c.city LIKE %s)")
        params.extend([f"%{search}%", f"%{search}%", f"%{search}%"])

    if region != 'All':
        clauses.append("c.region = %s")
        params.append(region)

    where_sql = ("WHERE " + " AND ".join(clauses)) if clauses else ""

    # Implements LEFT JOIN, SUM, GROUP BY, and COALESCE
    sql = f"""
    SELECT 
        c.customer_id,
        c.customer_name,
        c.email,
        c.city,
        c.region,
        c.registration_date,
        COUNT(DISTINCT o.order_id) AS total_orders,
        ROUND(COALESCE(SUM(oi.quantity * oi.unit_price * (1 - (oi.discount_percent / 100.0))), 0), 2) AS total_spending,
        ROUND(COALESCE(SUM((oi.quantity * oi.unit_price * (1 - (oi.discount_percent / 100.0))) - (oi.quantity * p.cost_price)), 0), 2) AS total_profit,
        COALESCE(MAX(o.order_date), NULL) AS last_order_date,
        CASE 
            WHEN COUNT(DISTINCT o.order_id) = 0 THEN 'Inactive'
            WHEN COALESCE(SUM(oi.quantity * oi.unit_price * (1 - (oi.discount_percent / 100.0))), 0) >= 50000 THEN 'Platinum'
            WHEN COALESCE(SUM(oi.quantity * oi.unit_price * (1 - (oi.discount_percent / 100.0))), 0) >= 20000 THEN 'Gold'
            WHEN COALESCE(SUM(oi.quantity * oi.unit_price * (1 - (oi.discount_percent / 100.0))), 0) >= 5000 THEN 'Silver'
            ELSE 'Bronze'
        END AS customer_segment
    FROM customers c
    LEFT JOIN orders o 
        ON c.customer_id = o.customer_id 
        AND o.order_status != 'Cancelled'
    LEFT JOIN order_items oi 
        ON o.order_id = oi.order_id
    LEFT JOIN products p 
        ON oi.product_id = p.product_id
    {where_sql}
    GROUP BY c.customer_id, c.customer_name, c.email, c.city, c.region, c.registration_date
    ORDER BY total_spending DESC;
    """
    rows = query_db(sql, params)

    customers = []
    for r in rows:
        seg = r["customer_segment"]
        if segment != 'All' and seg != segment:
            continue
        customers.append({
            "customer_id": r["customer_id"],
            "customer_name": r["customer_name"],
            "email": r["email"],
            "city": r["city"],
            "region": r["region"],
            "registration_date": str(r["registration_date"]),
            "total_orders": int(r["total_orders"]),
            "total_spending": float(r["total_spending"]),
            "total_profit": float(r["total_profit"]),
            "last_order_date": str(r["last_order_date"]) if r["last_order_date"] else "Never",
            "customer_segment": seg,
            "is_inactive": int(r["total_orders"]) == 0
        })

    return jsonify({"customers": customers, "total_count": len(customers)})

@app.route('/api/customers/<int:customer_id>', methods=['GET'])
def get_customer_detail(customer_id):
    # Customer basic info
    cust = query_db(
        "SELECT * FROM customers WHERE customer_id = %s;",
        [customer_id],
        one=True
    )
    if not cust:
        return jsonify({"error": "Customer not found"}), 404

    # Order history with financial aggregation
    order_history_sql = """
    SELECT 
        o.order_id,
        o.order_date,
        o.order_status,
        o.region,
        COUNT(oi.order_item_id) AS items_count,
        ROUND(COALESCE(SUM(oi.quantity * oi.unit_price * (1 - (oi.discount_percent / 100.0))), 0), 2) AS order_total,
        ROUND(COALESCE(SUM((oi.quantity * oi.unit_price * (1 - (oi.discount_percent / 100.0))) - (oi.quantity * p.cost_price)), 0), 2) AS order_profit
    FROM orders o
    LEFT JOIN order_items oi ON o.order_id = oi.order_id
    LEFT JOIN products p ON oi.product_id = p.product_id
    WHERE o.customer_id = %s
    GROUP BY o.order_id, o.order_date, o.order_status, o.region
    ORDER BY o.order_date DESC;
    """
    orders = query_db(order_history_sql, [customer_id])
    
    formatted_orders = [
        {
            "order_id": o["order_id"],
            "order_date": str(o["order_date"]),
            "order_status": o["order_status"],
            "region": o["region"],
            "items_count": int(o["items_count"]),
            "order_total": float(o["order_total"]),
            "order_profit": float(o["order_profit"])
        }
        for o in orders
    ]

    total_spend = sum(o["order_total"] for o in formatted_orders if o["order_status"] != 'Cancelled')
    total_orders_count = len([o for o in formatted_orders if o["order_status"] != 'Cancelled'])

    return jsonify({
        "customer": {
            "customer_id": cust["customer_id"],
            "customer_name": cust["customer_name"],
            "email": cust["email"],
            "city": cust["city"],
            "region": cust["region"],
            "registration_date": str(cust["registration_date"]),
            "total_orders": total_orders_count,
            "total_spending": round(total_spend, 2),
            "is_inactive": total_orders_count == 0
        },
        "order_history": formatted_orders
    })

# ------------------------------------------------------------------------------
# 4. Products Analytics (Requirement 10)
# ------------------------------------------------------------------------------
@app.route('/api/products', methods=['GET'])
def get_products():
    category = request.args.get('category', 'All')
    search = request.args.get('search', '').strip()

    clauses = []
    params = []

    if category != 'All':
        clauses.append("p.category = %s")
        params.append(category)

    if search:
        clauses.append("(p.product_name LIKE %s OR p.category LIKE %s)")
        params.extend([f"%{search}%", f"%{search}%"])

    where_sql = ("WHERE " + " AND ".join(clauses)) if clauses else ""

    sql = f"""
    SELECT 
        p.product_id,
        p.product_name,
        p.category,
        p.unit_price,
        p.cost_price,
        COALESCE(SUM(oi.quantity), 0) AS units_sold,
        ROUND(COALESCE(SUM(oi.quantity * oi.unit_price * (1 - (oi.discount_percent / 100.0))), 0), 2) AS total_revenue,
        ROUND(COALESCE(SUM((oi.quantity * oi.unit_price * (1 - (oi.discount_percent / 100.0))) - (oi.quantity * p.cost_price)), 0), 2) AS total_profit
    FROM products p
    LEFT JOIN order_items oi ON p.product_id = oi.product_id
    LEFT JOIN orders o ON oi.order_id = o.order_id AND o.order_status != 'Cancelled'
    {where_sql}
    GROUP BY p.product_id, p.product_name, p.category, p.unit_price, p.cost_price
    ORDER BY total_revenue DESC;
    """
    rows = query_db(sql, params)

    products = []
    for rank, r in enumerate(rows, start=1):
        rev = float(r["total_revenue"])
        prof = float(r["total_profit"])
        units = int(r["units_sold"])
        margin_pct = round((prof / rev * 100), 2) if rev > 0 else 0.0

        products.append({
            "rank": rank,
            "product_id": r["product_id"],
            "product_name": r["product_name"],
            "category": r["category"],
            "unit_price": float(r["unit_price"]),
            "cost_price": float(r["cost_price"]),
            "units_sold": units,
            "total_revenue": rev,
            "total_profit": prof,
            "margin_pct": margin_pct,
            "is_low_sales": units < 10
        })

    return jsonify({"products": products, "total_count": len(products)})

# ------------------------------------------------------------------------------
# 5. Orders & Line Items (Requirement 10)
# ------------------------------------------------------------------------------
@app.route('/api/orders', methods=['GET'])
def get_orders():
    search = request.args.get('search', '').strip()
    region = request.args.get('region', 'All')
    status = request.args.get('status', 'All')
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')

    clauses = []
    params = []

    if region != 'All':
        clauses.append("o.region = %s")
        params.append(region)

    if status != 'All':
        clauses.append("o.order_status = %s")
        params.append(status)

    if start_date:
        clauses.append("o.order_date >= %s")
        params.append(start_date)

    if end_date:
        clauses.append("o.order_date <= %s")
        params.append(end_date)

    if search:
        clauses.append("(c.customer_name LIKE %s OR o.order_id LIKE %s)")
        params.extend([f"%{search}%", f"%{search}%"])

    where_sql = ("WHERE " + " AND ".join(clauses)) if clauses else ""

    sql = f"""
    SELECT 
        o.order_id,
        o.order_date,
        o.order_status,
        o.region,
        c.customer_id,
        c.customer_name,
        c.city,
        COUNT(oi.order_item_id) AS items_count,
        ROUND(COALESCE(SUM(oi.quantity * oi.unit_price * (1 - (oi.discount_percent / 100.0))), 0), 2) AS net_total,
        ROUND(COALESCE(SUM((oi.quantity * oi.unit_price * (1 - (oi.discount_percent / 100.0))) - (oi.quantity * p.cost_price)), 0), 2) AS profit
    FROM orders o
    JOIN customers c ON o.customer_id = c.customer_id
    LEFT JOIN order_items oi ON o.order_id = oi.order_id
    LEFT JOIN products p ON oi.product_id = p.product_id
    {where_sql}
    GROUP BY o.order_id, o.order_date, o.order_status, o.region, c.customer_id, c.customer_name, c.city
    ORDER BY o.order_date DESC, o.order_id DESC
    LIMIT 200;
    """
    rows = query_db(sql, params)

    orders = [
        {
            "order_id": r["order_id"],
            "order_date": str(r["order_date"]),
            "order_status": r["order_status"],
            "region": r["region"],
            "customer_id": r["customer_id"],
            "customer_name": r["customer_name"],
            "city": r["city"],
            "items_count": int(r["items_count"]),
            "net_total": float(r["net_total"]),
            "profit": float(r["profit"])
        }
        for r in rows
    ]

    return jsonify({"orders": orders, "total_count": len(orders)})

@app.route('/api/orders/<int:order_id>', methods=['GET'])
def get_order_detail(order_id):
    order_header = query_db(
        "SELECT o.*, c.customer_name, c.email, c.city "
        "FROM orders o JOIN customers c ON o.customer_id = c.customer_id "
        "WHERE o.order_id = %s;",
        [order_id],
        one=True
    )
    if not order_header:
        return jsonify({"error": "Order not found"}), 404

    items_sql = """
    SELECT 
        oi.order_item_id,
        oi.product_id,
        p.product_name,
        p.category,
        oi.quantity,
        oi.unit_price,
        p.cost_price,
        oi.discount_percent,
        ROUND(oi.quantity * oi.unit_price, 2) AS gross_amount,
        ROUND(oi.quantity * oi.unit_price * (1 - (oi.discount_percent / 100.0)), 2) AS line_total,
        ROUND((oi.quantity * oi.unit_price * (1 - (oi.discount_percent / 100.0))) - (oi.quantity * p.cost_price), 2) AS line_profit
    FROM order_items oi
    JOIN products p ON oi.product_id = p.product_id
    WHERE oi.order_id = %s;
    """
    items = query_db(items_sql, [order_id])

    return jsonify({
        "order": {
            "order_id": order_header["order_id"],
            "order_date": str(order_header["order_date"]),
            "order_status": order_header["order_status"],
            "region": order_header["region"],
            "customer_id": order_header["customer_id"],
            "customer_name": order_header["customer_name"],
            "email": order_header["email"],
            "city": order_header["city"]
        },
        "items": [
            {
                "order_item_id": it["order_item_id"],
                "product_id": it["product_id"],
                "product_name": it["product_name"],
                "category": it["category"],
                "quantity": int(it["quantity"]),
                "unit_price": float(it["unit_price"]),
                "discount_percent": float(it["discount_percent"]),
                "gross_amount": float(it["gross_amount"]),
                "line_total": float(it["line_total"]),
                "line_profit": float(it["line_profit"])
            }
            for it in items
        ]
    })

# ------------------------------------------------------------------------------
# 6. Excel Practical Endpoints (Requirement 6 & 7)
# ------------------------------------------------------------------------------
@app.route('/api/practical/excel-formulas', methods=['GET'])
def practical_excel_formulas():
    data = get_excel_practical_data()
    return jsonify(data)

@app.route('/api/practical/pivot-table', methods=['GET'])
def practical_pivot_table():
    data = get_pivot_table_practical_data()
    return jsonify(data)

# ------------------------------------------------------------------------------
# 7. SQL Analysis Interactive Playground (Requirement 8)
# ------------------------------------------------------------------------------
@app.route('/api/sql/queries', methods=['GET'])
def sql_queries_list():
    queries = get_predefined_queries()
    return jsonify({"queries": queries})

@app.route('/api/sql/execute', methods=['POST'])
def sql_execute():
    body = request.get_json() or {}
    query_id = body.get('query_id')
    if not query_id:
        return jsonify({"error": "Missing query_id parameter"}), 400

    try:
        result = execute_predefined_query(query_id)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# ------------------------------------------------------------------------------
# 8. Data Export and Import Endpoints (Requirement 11 & 12)
# ------------------------------------------------------------------------------
@app.route('/api/exports/<filename>', methods=['GET'])
def download_export(filename):
    try:
        file_path = get_export_file_path(filename)
        mime = 'text/csv' if filename.endswith('.csv') else 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        return send_file(
            file_path,
            mimetype=mime,
            as_attachment=True,
            download_name=filename
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 404

@app.route('/api/import/sales-csv', methods=['POST'])
def import_sales_csv():
    if 'file' not in request.files:
        return jsonify({"success": False, "error": "No file uploaded in form-data ('file' key expected)."}), 400
    
    file = request.files['file']
    if not file.filename.endswith('.csv'):
        return jsonify({"success": False, "error": "Invalid file format. Only CSV files are supported."}), 400

    result = validate_and_import_sales_csv(file)
    status_code = 200 if result.get("success") else 400
    return jsonify(result), status_code

# ------------------------------------------------------------------------------
# 9. Admin & Maintenance Endpoints
# ------------------------------------------------------------------------------
@app.route('/api/admin/reseed', methods=['POST'])
def admin_reseed():
    try:
        c, p, o, oi = seed_database()
        return jsonify({
            "success": True,
            "message": f"Successfully reseeded database with {c} customers, {p} products, {o} orders, and {oi} order items."
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == '__main__':
    print(f"[*] Starting Retail Analytics Backend on http://127.0.0.1:{Config.PORT}")
    app.run(host='0.0.0.0', port=Config.PORT, debug=Config.DEBUG)
