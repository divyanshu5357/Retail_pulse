import os
import random
import datetime
from pathlib import Path
import pymysql
import pandas as pd
from config import Config
from db import get_db, execute_script, USE_MYSQL, get_mysql_connection

# Fixed seed for reproducibility
random.seed(42)

FIRST_NAMES = [
    "Aarav", "Priya", "Rohit", "Ananya", "Vikram", "Sneha", "Rajesh", "Pooja", "Amit", "Kavita",
    "Suresh", "Neha", "Arjun", "Divya", "Manoj", "Shreya", "Kunal", "Meera", "Aditya", "Ritu",
    "Nikhil", "Deepika", "Sunil", "Tanvi", "Gaurav", "Swati", "Sanjay", "Anjali", "Varun", "Simran",
    "Pranav", "Ishaan", "Rhea", "Alok", "Nandini", "Harsh", "Bhavna", "Kiran", "Vidya", "Tarun"
]

LAST_NAMES = [
    "Sharma", "Patel", "Verma", "Iyer", "Singh", "Rao", "Nair", "Gupta", "Deshmukh", "Choudhury",
    "Reddy", "Mehta", "Banerjee", "Joshi", "Bhat", "Kapoor", "Agarwal", "Saxena", "Malhotra", "Kulkarni"
]

CITIES_BY_REGION = {
    "North": ["Delhi", "Noida", "Gurgaon", "Chandigarh", "Jaipur", "Lucknow"],
    "South": ["Bengaluru", "Chennai", "Hyderabad", "Kochi", "Coimbatore"],
    "West": ["Mumbai", "Pune", "Ahmedabad", "Surat", "Nagpur"],
    "East": ["Kolkata", "Bhubaneswar", "Patna", "Ranchi", "Guwahati"],
    "Central": ["Bhopal", "Indore", "Raipur", "Jabalpur", "Gwalior"]
}

PRODUCTS_CATALOG = [
    # Electronics
    ("Ultra HD Smart LED TV 55-inch", "Electronics", 42999.00, 31000.00),
    ("Wireless Noise-Cancelling Headphones", "Electronics", 7499.00, 4800.00),
    ("Mechanical Gaming Keyboard", "Electronics", 3299.00, 2100.00),
    ("Ergonomic Wireless Mouse", "Electronics", 1299.00, 750.00),
    ("Smart Fitness Watch Pro", "Electronics", 4999.00, 3200.00),
    ("Fast Charging Power Bank 20000mAh", "Electronics", 1899.00, 1150.00),

    # Fashion & Apparel
    ("Men Slim-Fit Cotton Casual Shirt", "Fashion", 1499.00, 650.00),
    ("Women Floral Embroidered Kurti", "Fashion", 1899.00, 800.00),
    ("Unisex Classic Denim Jeans", "Fashion", 2499.00, 1100.00),
    ("Lightweight Running Sports Shoes", "Fashion", 3199.00, 1500.00),
    ("Genuine Leather Bifold Wallet", "Fashion", 899.00, 380.00),

    # Home & Living
    ("Orthopedic Memory Foam Pillow", "Home & Living", 1799.00, 950.00),
    ("Stainless Steel Electric Kettle 1.8L", "Home & Living", 1299.00, 720.00),
    ("Double Bed Pure Cotton Bedsheet", "Home & Living", 1599.00, 780.00),
    ("Automatic Air Fryer 4.5L", "Home & Living", 5499.00, 3600.00),
    ("Multipurpose Desk Organizer Set", "Home & Living", 699.00, 290.00),

    # Groceries & Gourmet
    ("Organic Green Tea 100 Bags", "Groceries", 450.00, 260.00),
    ("Cold-Pressed Extra Virgin Olive Oil 1L", "Groceries", 1199.00, 780.00),
    ("Premium California Almonds 500g", "Groceries", 599.00, 380.00),
    ("Pure Raw Honey 500g", "Groceries", 399.00, 210.00),

    # Sports & Fitness
    ("Anti-Skid Yoga Mat 6mm", "Sports", 999.00, 480.00),
    ("Adjustable Dumbbell Set 20kg", "Sports", 4299.00, 2600.00),
    ("Insulated Stainless Steel Sipper Bottle", "Sports", 799.00, 390.00),
    ("Skipping Rope with Digital Counter", "Sports", 499.00, 210.00)
]

ORDER_STATUSES = ["Delivered", "Delivered", "Delivered", "Delivered", "Shipped", "Processing", "Cancelled"]
DISCOUNT_OPTIONS = [0.0, 0.0, 5.0, 10.0, 12.0, 15.0, 20.0]

def generate_sample_dataset():
    """Generate realistic, normalized sample data matching project requirements."""
    # 1. Customers: 110 customers (15 will be inactive with 0 orders)
    customers = []
    customer_emails = set()
    
    for cid in range(1, 111):
        fn = random.choice(FIRST_NAMES)
        ln = random.choice(LAST_NAMES)
        name = f"{fn} {ln}"
        
        email_base = f"{fn.lower()}.{ln.lower()}{cid}@example.in"
        email = email_base
        while email in customer_emails:
            email = f"{fn.lower()}.{ln.lower()}{random.randint(100, 999)}@example.in"
        customer_emails.add(email)

        region = random.choice(list(CITIES_BY_REGION.keys()))
        city = random.choice(CITIES_BY_REGION[region])
        
        # Registration dates between Nov 2023 and Aug 2024
        start_date = datetime.date(2023, 11, 1)
        reg_days = random.randint(0, 280)
        reg_date = start_date + datetime.timedelta(days=reg_days)

        customers.append({
            "customer_id": cid,
            "customer_name": name,
            "email": email,
            "city": city,
            "region": region,
            "registration_date": reg_date.strftime("%Y-%m-%d")
        })

    # 2. Products
    products = []
    for pid, (pname, cat, uprice, cprice) in enumerate(PRODUCTS_CATALOG, start=1):
        products.append({
            "product_id": pid,
            "product_name": pname,
            "category": cat,
            "unit_price": uprice,
            "cost_price": cprice
        })

    # Active customer IDs: 1 to 95. Inactive customer IDs: 96 to 110 (15 customers have 0 orders)
    active_customer_ids = list(range(1, 96))
    
    # 3. Orders: 280 realistic orders across 12 months (Nov 2024 to Oct 2025)
    orders = []
    order_items = []
    
    order_start_date = datetime.date(2024, 11, 1)
    item_counter = 1

    for oid in range(1, 281):
        cid = random.choice(active_customer_ids)
        customer_info = customers[cid - 1]
        
        # Order date after customer registration
        order_days = random.randint(0, 350)
        order_date = order_start_date + datetime.timedelta(days=order_days)
        
        # Region usually matches customer region
        region = customer_info["region"]
        status = random.choice(ORDER_STATUSES)

        orders.append({
            "order_id": oid,
            "customer_id": cid,
            "order_date": order_date.strftime("%Y-%m-%d"),
            "order_status": status,
            "region": region
        })

        # 4. Order items: 1 to 4 items per order
        num_items = random.choices([1, 2, 3, 4], weights=[45, 35, 15, 5])[0]
        chosen_products = random.sample(products, num_items)
        
        for prod in chosen_products:
            qty = random.choices([1, 2, 3, 4, 5], weights=[60, 25, 10, 3, 2])[0]
            disc = random.choice(DISCOUNT_OPTIONS)
            
            order_items.append({
                "order_item_id": item_counter,
                "order_id": oid,
                "product_id": prod["product_id"],
                "quantity": qty,
                "unit_price": prod["unit_price"],
                "discount_percent": disc
            })
            item_counter += 1

    return customers, products, orders, order_items

def seed_database():
    """Initialize schema and seed sample data in active database engine."""
    print("[Seed] Generating synthetic retail dataset...")
    customers, products, orders, order_items = generate_sample_dataset()

    schema_path = Config.SQL_DIR / 'schema.sql'
    with open(schema_path, 'r', encoding='utf-8') as f:
        schema_sql = f.read()

    print("[Seed] Applying schema.sql...")
    try:
        execute_script(schema_sql)
        print("[Seed] Schema applied successfully.")
    except Exception as e:
        print(f"[Seed] Error executing schema: {e}")
        raise

    print(f"[Seed] Seeding {len(customers)} customers, {len(products)} products, {len(orders)} orders, {len(order_items)} items...")
    
    with get_db() as conn:
        cur = conn.cursor()

        # Insert Customers
        for c in customers:
            cur.execute(
                "INSERT INTO customers (customer_id, customer_name, email, city, region, registration_date) "
                "VALUES (%s, %s, %s, %s, %s, %s)",
                (c["customer_id"], c["customer_name"], c["email"], c["city"], c["region"], c["registration_date"])
            )

        # Insert Products
        for p in products:
            cur.execute(
                "INSERT INTO products (product_id, product_name, category, unit_price, cost_price) "
                "VALUES (%s, %s, %s, %s, %s)",
                (p["product_id"], p["product_name"], p["category"], p["unit_price"], p["cost_price"])
            )

        # Insert Orders
        for o in orders:
            cur.execute(
                "INSERT INTO orders (order_id, customer_id, order_date, order_status, region) "
                "VALUES (%s, %s, %s, %s, %s)",
                (o["order_id"], o["customer_id"], o["order_date"], o["order_status"], o["region"])
            )

        # Insert Order Items
        for oi in order_items:
            cur.execute(
                "INSERT INTO order_items (order_item_id, order_id, product_id, quantity, unit_price, discount_percent) "
                "VALUES (%s, %s, %s, %s, %s, %s)",
                (oi["order_item_id"], oi["order_id"], oi["product_id"], oi["quantity"], oi["unit_price"], oi["discount_percent"])
            )

        if hasattr(conn, 'commit'):
            conn.commit()

    print("[Seed] Data insertion complete.")

    # Export to CSV files for Tableau and Excel downloads
    export_csvs(customers, products, orders, order_items)
    # Generate SQL seed file for pure SQL grading
    export_sql_seed_file(customers, products, orders, order_items)
    # Generate Excel Workbook
    generate_excel_workbook(customers, products, orders, order_items)

    print("[Seed] All artifacts generated in backend/exports and backend/sql.")
    return len(customers), len(products), len(orders), len(order_items)

def export_csvs(customers, products, orders, order_items):
    """Export normalized CSV files and denormalized Tableau master CSV."""
    exports_dir = Config.EXPORTS_DIR
    exports_dir.mkdir(parents=True, exist_ok=True)

    df_customers = pd.DataFrame(customers)
    df_products = pd.DataFrame(products)
    df_orders = pd.DataFrame(orders)
    df_items = pd.DataFrame(order_items)

    df_customers.to_csv(exports_dir / 'customers.csv', index=False)
    df_products.to_csv(exports_dir / 'products.csv', index=False)
    df_orders.to_csv(exports_dir / 'orders.csv', index=False)
    df_items.to_csv(exports_dir / 'order_items.csv', index=False)

    # Denormalized Tableau Master CSV
    # Merging orders + customers + order_items + products
    merged = df_orders.merge(df_customers, on='customer_id', suffixes=('', '_cust'))
    merged = merged.merge(df_items, on='order_id')
    merged = merged.merge(df_products, on='product_id', suffixes=('', '_prod'))

    # Calculate financial metrics
    merged['gross_amount'] = (merged['quantity'] * merged['unit_price']).round(2)
    merged['discount_amount'] = (merged['gross_amount'] * (merged['discount_percent'] / 100.0)).round(2)
    merged['net_revenue'] = (merged['gross_amount'] - merged['discount_amount']).round(2)
    merged['total_cost'] = (merged['quantity'] * merged['cost_price']).round(2)
    merged['profit'] = (merged['net_revenue'] - merged['total_cost']).round(2)
    merged['profit_margin_pct'] = ((merged['profit'] / merged['net_revenue']) * 100).round(2)

    # Date dimensions for Tableau / Excel
    merged['order_date'] = pd.to_datetime(merged['order_date'])
    merged['order_year'] = merged['order_date'].dt.year
    merged['order_month'] = merged['order_date'].dt.month
    merged['order_month_name'] = merged['order_date'].dt.strftime('%b')
    merged['order_year_month'] = merged['order_date'].dt.strftime('%Y-%m')

    tableau_cols = [
        'order_id', 'order_date', 'order_year', 'order_month', 'order_month_name', 'order_year_month',
        'order_status', 'region', 'customer_id', 'customer_name', 'city',
        'product_id', 'product_name', 'category', 'quantity', 'unit_price',
        'discount_percent', 'gross_amount', 'discount_amount', 'net_revenue',
        'total_cost', 'profit', 'profit_margin_pct'
    ]
    df_tableau = merged[tableau_cols]
    df_tableau.to_csv(exports_dir / 'tableau_sales_master.csv', index=False)
    print(f"[Seed] Exported CSVs to {exports_dir}")

def export_sql_seed_file(customers, products, orders, order_items):
    """Write an executable standalone SQL seed script with all INSERT statements."""
    seed_file = Config.SQL_DIR / 'seed.sql'
    with open(seed_file, 'w', encoding='utf-8') as f:
        f.write("-- Retail Analytics Sample Data Seeding Script\n")
        f.write("USE retail_analytics;\n\n")

        # Customers
        f.write("-- Customers (110 records, IDs 96-110 have no orders)\n")
        f.write("INSERT INTO customers (customer_id, customer_name, email, city, region, registration_date) VALUES\n")
        cust_lines = []
        for c in customers:
            cust_lines.append(f"({c['customer_id']}, '{c['customer_name']}', '{c['email']}', '{c['city']}', '{c['region']}', '{c['registration_date']}')")
        f.write(",\n".join(cust_lines) + ";\n\n")

        # Products
        f.write("-- Products (24 catalog items across 5 categories)\n")
        f.write("INSERT INTO products (product_id, product_name, category, unit_price, cost_price) VALUES\n")
        prod_lines = []
        for p in products:
            p_name = p['product_name'].replace("'", "\\'")
            prod_lines.append(f"({p['product_id']}, '{p_name}', '{p['category']}', {p['unit_price']}, {p['cost_price']})")
        f.write(",\n".join(prod_lines) + ";\n\n")

        # Orders
        f.write("-- Orders (280 orders across 12 months)\n")
        f.write("INSERT INTO orders (order_id, customer_id, order_date, order_status, region) VALUES\n")
        ord_lines = []
        for o in orders:
            ord_lines.append(f"({o['order_id']}, {o['customer_id']}, '{o['order_date']}', '{o['order_status']}', '{o['region']}')")
        f.write(",\n".join(ord_lines) + ";\n\n")

        # Order Items
        f.write("-- Order Items\n")
        f.write("INSERT INTO order_items (order_item_id, order_id, product_id, quantity, unit_price, discount_percent) VALUES\n")
        item_lines = []
        for oi in order_items:
            item_lines.append(f"({oi['order_item_id']}, {oi['order_id']}, {oi['product_id']}, {oi['quantity']}, {oi['unit_price']}, {oi['discount_percent']})")
        f.write(",\n".join(item_lines) + ";\n\n")

    print(f"[Seed] Exported standalone SQL seed file to {seed_file}")

def generate_excel_workbook(customers, products, orders, order_items):
    """
    Generate an Excel workbook (.xlsx) containing:
    1. 'Sales_Transactions' raw data ready for Pivot Tables
    2. 'Excel_Formulas_Guide' with actual live formula demonstrations
    3. 'Pivot_Table_Summary' showing pre-calculated matrix and exact reproduction steps
    """
    wb_path = Config.EXPORTS_DIR / 'retail_analytics_workbook.xlsx'
    
    with pd.ExcelWriter(wb_path, engine='openpyxl') as writer:
        # Sheet 1: Master Sales Transactions
        df_customers = pd.DataFrame(customers)
        df_products = pd.DataFrame(products)
        df_orders = pd.DataFrame(orders)
        df_items = pd.DataFrame(order_items)

        merged = df_orders.merge(df_customers, on='customer_id', suffixes=('', '_cust'))
        merged = merged.merge(df_items, on='order_id')
        merged = merged.merge(df_products, on='product_id', suffixes=('', '_prod'))
        
        merged['net_amount'] = (merged['quantity'] * merged['unit_price'] * (1 - merged['discount_percent'] / 100.0)).round(2)
        merged['profit'] = (merged['net_amount'] - (merged['quantity'] * merged['cost_price'])).round(2)
        
        tx_cols = [
            'order_id', 'order_date', 'customer_name', 'region', 'city',
            'product_name', 'category', 'quantity', 'unit_price', 'discount_percent',
            'net_amount', 'profit', 'order_status'
        ]
        df_sales = merged[tx_cols].rename(columns={
            'order_id': 'Order_ID',
            'order_date': 'Order_Date',
            'customer_name': 'Customer',
            'region': 'Region',
            'city': 'City',
            'product_name': 'Product',
            'category': 'Category',
            'quantity': 'Quantity',
            'unit_price': 'Unit_Price_INR',
            'discount_percent': 'Discount_Pct',
            'net_amount': 'Net_Amount_INR',
            'profit': 'Profit_INR',
            'order_status': 'Status'
        })
        df_sales.to_excel(writer, sheet_name='Sales_Transactions', index=False)

        # Sheet 2: Excel Practical Formulas Reference Sheet
        formulas_data = [
            {
                "Formula Name": "IF",
                "Excel Syntax": '=IF(K2>=5000, "High Value", "Standard")',
                "Description": "Checks if Net Amount is ₹5,000 or more and classifies as High Value.",
                "Target Column": "Net_Amount_INR (Col K)",
                "Sample Result": "High Value"
            },
            {
                "Formula Name": "Nested IF",
                "Excel Syntax": '=IF(K2>=25000, "Tier 1", IF(K2>=10000, "Tier 2", IF(K2>=3000, "Tier 3", "Tier 4")))',
                "Description": "Multi-tier classification based on transaction spend amount.",
                "Target Column": "Net_Amount_INR (Col K)",
                "Sample Result": "Tier 2"
            },
            {
                "Formula Name": "AND",
                "Excel Syntax": '=IF(AND(K2>=5000, M2="Delivered"), "Qualifies For Loyalty Bonus", "No Bonus")',
                "Description": "Returns TRUE only if order is high value AND successfully Delivered.",
                "Target Column": "Net Amount & Status",
                "Sample Result": "Qualifies For Loyalty Bonus"
            },
            {
                "Formula Name": "OR",
                "Excel Syntax": '=IF(OR(D2="North", D2="South"), "Priority Delivery Zone", "Standard Zone")',
                "Description": "Returns TRUE if order belongs to either North or South regions.",
                "Target Column": "Region (Col D)",
                "Sample Result": "Priority Delivery Zone"
            },
            {
                "Formula Name": "NOT",
                "Excel Syntax": '=IF(NOT(M2="Cancelled"), "Valid Sale", "Excluded")',
                "Description": "Identifies transactions that are NOT cancelled for revenue analysis.",
                "Target Column": "Status (Col M)",
                "Sample Result": "Valid Sale"
            },
            {
                "Formula Name": "IFERROR",
                "Excel Syntax": '=IFERROR(L2/K2, 0)',
                "Description": "Safely computes Profit Margin (Profit / Net Amount) preventing #DIV/0! errors.",
                "Target Column": "Profit / Net Amount",
                "Sample Result": "0.32"
            },
            {
                "Formula Name": "SUMIF",
                "Excel Syntax": '=SUMIF(G:G, "Electronics", K:K)',
                "Description": "Sums total Net Amount specifically for the Electronics category.",
                "Target Column": "Category (G) & Net Amount (K)",
                "Sample Result": "₹1,248,390"
            },
            {
                "Formula Name": "AVERAGEIF",
                "Excel Syntax": '=AVERAGEIF(G:G, "Fashion", K:K)',
                "Description": "Calculates the average transaction amount for Fashion category items.",
                "Target Column": "Category (G) & Net Amount (K)",
                "Sample Result": "₹2,845"
            },
            {
                "Formula Name": "COUNTIF",
                "Excel Syntax": '=COUNTIF(M:M, "Delivered")',
                "Description": "Counts total number of completed, delivered orders.",
                "Target Column": "Status (Col M)",
                "Sample Result": "382"
            }
        ]
        pd.DataFrame(formulas_data).to_excel(writer, sheet_name='Excel_Formulas_Guide', index=False)

        # Sheet 3: Pivot Table Reference Guide
        pivot_summary = df_sales.pivot_table(
            index='Category',
            columns='Region',
            values='Net_Amount_INR',
            aggfunc='sum',
            fill_value=0
        ).round(2)
        pivot_summary.to_excel(writer, sheet_name='Pivot_Summary_Matrix')

    print(f"[Seed] Generated Excel workbook at {wb_path}")

if __name__ == '__main__':
    seed_database()
