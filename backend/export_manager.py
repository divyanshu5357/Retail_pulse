import io
import csv
import pandas as pd
from datetime import datetime
from pathlib import Path
from config import Config
from db import query_db, get_db

def get_export_file_path(filename):
    """Retrieve verified file path within exports directory."""
    target = (Config.EXPORTS_DIR / filename).resolve()
    # Security check: ensure path stays within exports directory
    if not str(target).startswith(str(Config.EXPORTS_DIR.resolve())):
        raise ValueError("Invalid file request path.")
    if not target.exists():
        raise FileNotFoundError(f"Export file '{filename}' not found.")
    return target

def get_excel_practical_data():
    """
    Returns structured data for the 9 required Excel formulas:
    IF, Nested IF, AND, OR, NOT, IFERROR, SUMIF, AVERAGEIF, COUNTIF
    Along with sample transaction rows for interactive study.
    """
    # Fetch recent transactions for the practical table
    sql = """
    SELECT 
        o.order_id,
        o.order_date,
        c.customer_name,
        p.product_name,
        p.category,
        oi.quantity,
        ROUND(oi.quantity * oi.unit_price * (1 - (oi.discount_percent / 100.0)), 2) AS net_amount,
        ROUND((oi.quantity * oi.unit_price * (1 - (oi.discount_percent / 100.0))) - (oi.quantity * p.cost_price), 2) AS profit,
        o.region,
        o.order_status
    FROM orders o
    JOIN customers c ON o.customer_id = c.customer_id
    JOIN order_items oi ON o.order_id = oi.order_id
    JOIN products p ON oi.product_id = p.product_id
    ORDER BY o.order_id DESC
    LIMIT 25;
    """
    sample_rows = query_db(sql)
    
    # Format rows
    formatted_samples = []
    for r in sample_rows:
        formatted_samples.append({
            "order_id": r["order_id"],
            "order_date": str(r["order_date"]),
            "customer_name": r["customer_name"],
            "product_name": r["product_name"],
            "category": r["category"],
            "quantity": int(r["quantity"]),
            "net_amount": float(r["net_amount"]),
            "profit": float(r["profit"]),
            "region": r["region"],
            "order_status": r["order_status"]
        })

    # Detailed specifications for the 9 required formulas
    formulas = [
        {
            "id": "if_basic",
            "name": "IF",
            "category": "Logical Test",
            "syntax": '=IF(G2>=5000, "High Value", "Standard")',
            "target_cell": "Column G (Net Amount)",
            "purpose": "Binary classification based on threshold condition",
            "explanation": "Evaluates if the transaction Net Amount in column G is at least ₹5,000. If TRUE, outputs 'High Value'; if FALSE, outputs 'Standard'.",
            "cell_references": "G2: Net Amount (₹); returns text 'High Value' or 'Standard'",
            "example_input": "G2 = 7,499.00",
            "example_result": "High Value"
        },
        {
            "id": "nested_if",
            "name": "Nested IF",
            "category": "Multi-tier Logical Classification",
            "syntax": '=IF(G2>=25000, "Tier 1 - Elite", IF(G2>=10000, "Tier 2 - Premium", IF(G2>=3000, "Tier 3 - Plus", "Tier 4 - Basic")))',
            "target_cell": "Column G (Net Amount)",
            "purpose": "Categorizes orders into four distinct volume tiers",
            "explanation": "Chains multiple IF functions to evaluate descending threshold buckets. First checks for >= ₹25,000, then >= ₹10,000, then >= ₹3,000, defaulting to Tier 4.",
            "cell_references": "G2: Net Amount (₹); evaluates sequentially until first TRUE branch matches",
            "example_input": "G2 = 14,200.00",
            "example_result": "Tier 2 - Premium"
        },
        {
            "id": "and_logic",
            "name": "AND",
            "category": "Compound Logical Condition",
            "syntax": '=IF(AND(G2>=5000, J2="Delivered"), "Eligible for Cashback", "Ineligible")',
            "target_cell": "Column G (Net Amount) and Column J (Order Status)",
            "purpose": "Requires both criteria to be satisfied simultaneously",
            "explanation": "The AND function evaluates whether both conditions hold: Net Amount >= ₹5,000 AND Order Status is 'Delivered'. Returns TRUE only when both are satisfied.",
            "cell_references": "G2: Net Amount (Numeric), J2: Status ('Delivered' or other)",
            "example_input": "G2 = 8,990.00, J2 = 'Delivered'",
            "example_result": "Eligible for Cashback"
        },
        {
            "id": "or_logic",
            "name": "OR",
            "category": "Disjunctive Condition",
            "syntax": '=IF(OR(I2="North", I2="South"), "Tier-1 Metro Logistic Hub", "Standard Regional Route")',
            "target_cell": "Column I (Region)",
            "purpose": "Matches either of multiple criteria",
            "explanation": "Returns TRUE if the region is either 'North' or 'South', flagging shipments routing through primary metropolitan freight lanes.",
            "cell_references": "I2: Region string ('North', 'South', 'West', 'East', 'Central')",
            "example_input": "I2 = 'South'",
            "example_result": "Tier-1 Metro Logistic Hub"
        },
        {
            "id": "not_logic",
            "name": "NOT",
            "category": "Logical Negation",
            "syntax": '=IF(NOT(J2="Cancelled"), "Count In Net Revenue", "Omit from Revenue")',
            "target_cell": "Column J (Order Status)",
            "purpose": "Inverts truth value to filter out excluded events",
            "explanation": "Inverts the check J2='Cancelled'. For any non-cancelled order (Delivered, Shipped, Processing), it returns TRUE so the sale is accounted for in revenue audits.",
            "cell_references": "J2: Order Status; checks against 'Cancelled'",
            "example_input": "J2 = 'Shipped'",
            "example_result": "Count In Net Revenue"
        },
        {
            "id": "iferror_safe",
            "name": "IFERROR",
            "category": "Error Handling",
            "syntax": '=IFERROR(H2/G2, 0)',
            "target_cell": "Column H (Profit) and Column G (Net Amount)",
            "purpose": "Shields spreadsheets from #DIV/0! and #VALUE! errors",
            "explanation": "Calculates profit margin as Profit / Net Amount. If Net Amount is 0 or invalid, standard Excel formulas trigger #DIV/0!. IFERROR intercepts this and returns a safe fallback 0.",
            "cell_references": "H2: Profit, G2: Net Amount; returns decimal margin (e.g. 0.35)",
            "example_input": "H2 = 0, G2 = 0",
            "example_result": "0.00 (Prevents #DIV/0!)"
        },
        {
            "id": "sumif_category",
            "name": "SUMIF",
            "category": "Conditional Aggregation",
            "syntax": '=SUMIF(E:E, "Electronics", G:G)',
            "target_cell": "Range E:E (Category) and Range G:G (Net Amount)",
            "purpose": "Sums values matching a single criterion",
            "explanation": "Inspects every entry in Column E (Category). Wherever it equals 'Electronics', it accumulates the corresponding value from Column G (Net Amount).",
            "cell_references": "Range E:E: Category names; Range G:G: Net Amount values to sum",
            "example_input": 'Criterion = "Electronics"',
            "example_result": "₹1,248,390.00"
        },
        {
            "id": "averageif_category",
            "name": "AVERAGEIF",
            "category": "Conditional Average",
            "syntax": '=AVERAGEIF(E:E, "Fashion", G:G)',
            "target_cell": "Range E:E (Category) and Range G:G (Net Amount)",
            "purpose": "Computes arithmetic mean of cells meeting a condition",
            "explanation": "Finds all records where Category is 'Fashion' and computes the exact average transaction amount across those rows.",
            "cell_references": "Range E:E: Category; Range G:G: Net Amount to average",
            "example_input": 'Criterion = "Fashion"',
            "example_result": "₹2,845.50"
        },
        {
            "id": "countif_status",
            "name": "COUNTIF",
            "category": "Conditional Counting",
            "syntax": '=COUNTIF(J:J, "Delivered")',
            "target_cell": "Range J:J (Order Status)",
            "purpose": "Counts the number of cells matching a criterion",
            "explanation": "Counts how many total rows in Column J contain the status 'Delivered' to monitor operational fulfillment rate.",
            "cell_references": "Range J:J: Order fulfillment status column",
            "example_input": 'Criterion = "Delivered"',
            "example_result": "382"
        }
    ]

    return {
        "sample_rows": formatted_samples,
        "formulas": formulas
    }

def get_pivot_table_practical_data():
    """
    Returns Pivot Table configuration guide, step-by-step Excel instructions,
    and actual pre-calculated matrix summaries matching Excel Pivot Table output.
    """
    # 1. Summary: Category (Rows) vs Region (Columns) with Sum of Revenue
    sql_cat_region = """
    SELECT 
        p.category,
        o.region,
        ROUND(SUM(oi.quantity * oi.unit_price * (1 - (oi.discount_percent / 100.0))), 2) AS revenue,
        ROUND(SUM((oi.quantity * oi.unit_price * (1 - (oi.discount_percent / 100.0))) - (oi.quantity * p.cost_price)), 2) AS profit,
        COUNT(DISTINCT o.order_id) AS orders_count
    FROM orders o
    JOIN order_items oi ON o.order_id = oi.order_id
    JOIN products p ON oi.product_id = p.product_id
    WHERE o.order_status != 'Cancelled'
    GROUP BY p.category, o.region;
    """
    rows = query_db(sql_cat_region)
    df = pd.DataFrame(rows)
    for col in ['revenue', 'profit']:
        df[col] = df[col].astype(float)
    df['orders_count'] = df['orders_count'].astype(int)

    # Pivot matrix for revenue
    pivot_rev = df.pivot_table(
        index='category',
        columns='region',
        values='revenue',
        aggfunc='sum',
        fill_value=0
    )
    pivot_rev['Grand Total'] = pivot_rev.sum(axis=1)
    grand_total_row = pivot_rev.sum(axis=0)
    grand_total_row.name = 'Grand Total'
    pivot_rev.loc['Grand Total'] = grand_total_row

    # Pivot matrix for profit
    pivot_prof = df.pivot_table(
        index='category',
        columns='region',
        values='profit',
        aggfunc='sum',
        fill_value=0
    )
    pivot_prof['Grand Total'] = pivot_prof.sum(axis=1)
    grand_total_prof_row = pivot_prof.sum(axis=0)
    grand_total_prof_row.name = 'Grand Total'
    pivot_prof.loc['Grand Total'] = grand_total_prof_row

    # Convert pivot DataFrames to structured JSON
    def format_pivot(pt):
        regions = [c for c in pt.columns if c != 'Grand Total'] + ['Grand Total']
        matrix_rows = []
        for cat_name, r in pt.iterrows():
            row_data = {"category": cat_name}
            for col in pt.columns:
                row_data[col] = round(float(r[col]), 2)
            matrix_rows.append(row_data)
        return {"columns": ["category"] + list(pt.columns), "rows": matrix_rows}

    # Step-by-step instructions for native Excel Pivot Tables
    excel_steps = [
        {
            "step": 1,
            "title": "Open Workbook and Select Data Source",
            "action": "Open 'retail_analytics_workbook.xlsx' and navigate to the 'Sales_Transactions' sheet. Click any cell within the data table (e.g. A1)."
        },
        {
            "step": 2,
            "title": "Insert Pivot Table",
            "action": "In Excel's top ribbon, click Insert > PivotTable. Confirm the Table/Range is auto-selected as 'Sales_Transactions!$A$1:$M$531' and select 'New Worksheet'."
        },
        {
            "step": 3,
            "title": "Configure Rows & Columns",
            "action": "In the PivotTable Fields pane on the right: Drag 'Category' (or 'Product') into the Rows area. Drag 'Region' (or 'Order_Date' grouped by Month) into the Columns area."
        },
        {
            "step": 4,
            "title": "Configure Values (Aggregates)",
            "action": "Drag 'Net_Amount_INR' into the Values area. It will automatically show as 'Sum of Net_Amount_INR'. To also see profit, drag 'Profit_INR' into Values. Right-click any value cell > Number Format > Currency (₹ INR)."
        },
        {
            "step": 5,
            "title": "Apply Filters and Slicers",
            "action": "Drag 'Status' into the Filters area, then filter to exclude 'Cancelled'. To make it interactive, click PivotTable Analyze > Insert Slicer > choose 'Region' and 'Category' for dynamic one-click filtering."
        }
    ]

    return {
        "revenue_matrix": format_pivot(pivot_rev),
        "profit_matrix": format_pivot(pivot_prof),
        "excel_steps": excel_steps,
        "fields_guide": {
            "Rows": "Category or Product_Name (determines hierarchical row grouping)",
            "Columns": "Region or Month (creates horizontal comparison matrix)",
            "Values": "Sum of Net_Amount_INR, Sum of Profit_INR, Count of Order_ID",
            "Filters / Slicers": "Order_Status, Region, Order_Date range"
        }
    }

def validate_and_import_sales_csv(file_stream):
    """
    Parses and validates an uploaded sales CSV.
    Expected columns: customer_id, order_date, region, order_status, product_id, quantity, unit_price, discount_percent
    Returns summary or raises informative validation error.
    """
    try:
        df = pd.read_csv(file_stream)
    except Exception as e:
        return {"success": False, "error": f"Failed to parse CSV file: {str(e)}"}

    required_cols = {'customer_id', 'order_date', 'region', 'order_status', 'product_id', 'quantity', 'unit_price', 'discount_percent'}
    missing = required_cols - set(df.columns)
    if missing:
        return {
            "success": False,
            "error": f"Missing required columns in CSV: {', '.join(missing)}. Please follow template format."
        }

    valid_regions = {"North", "South", "East", "West", "Central"}
    valid_statuses = {"Delivered", "Shipped", "Processing", "Cancelled"}
    
    errors = []
    cleaned_rows = []

    # Query existing valid customer and product IDs
    existing_cids = {r['customer_id'] for r in query_db("SELECT customer_id FROM customers;")}
    existing_pids = {r['product_id'] for r in query_db("SELECT product_id FROM products;")}

    for idx, row in df.iterrows():
        row_num = idx + 2  # 1-indexed header is row 1
        
        # Check customer ID
        try:
            cid = int(row['customer_id'])
            if cid not in existing_cids:
                errors.append(f"Row {row_num}: Customer ID {cid} does not exist in database.")
                continue
        except (ValueError, TypeError):
            errors.append(f"Row {row_num}: Invalid customer_id format.")
            continue

        # Check product ID
        try:
            pid = int(row['product_id'])
            if pid not in existing_pids:
                errors.append(f"Row {row_num}: Product ID {pid} does not exist in database.")
                continue
        except (ValueError, TypeError):
            errors.append(f"Row {row_num}: Invalid product_id format.")
            continue

        # Check date
        try:
            odate = pd.to_datetime(row['order_date']).strftime('%Y-%m-%d')
        except Exception:
            errors.append(f"Row {row_num}: Invalid order_date '{row['order_date']}'. Use YYYY-MM-DD.")
            continue

        # Region & Status
        reg = str(row['region']).strip()
        if reg not in valid_regions:
            errors.append(f"Row {row_num}: Invalid region '{reg}'. Must be one of {valid_regions}.")
            continue

        status = str(row['order_status']).strip()
        if status not in valid_statuses:
            errors.append(f"Row {row_num}: Invalid status '{status}'. Must be one of {valid_statuses}.")
            continue

        # Quantity
        try:
            qty = int(row['quantity'])
            if qty <= 0:
                errors.append(f"Row {row_num}: Quantity must be positive, got {qty}.")
                continue
        except Exception:
            errors.append(f"Row {row_num}: Invalid quantity value.")
            continue

        # Unit price
        try:
            price = float(row['unit_price'])
            if price <= 0:
                errors.append(f"Row {row_num}: Unit price must be positive.")
                continue
        except Exception:
            errors.append(f"Row {row_num}: Invalid unit price.")
            continue

        # Discount
        try:
            disc = float(row['discount_percent'])
            if disc < 0 or disc > 100:
                errors.append(f"Row {row_num}: Discount must be between 0% and 100%.")
                continue
        except Exception:
            errors.append(f"Row {row_num}: Invalid discount value.")
            continue

        cleaned_rows.append({
            "customer_id": cid,
            "order_date": odate,
            "region": reg,
            "order_status": status,
            "product_id": pid,
            "quantity": qty,
            "unit_price": price,
            "discount_percent": disc
        })

        if len(errors) > 10:
            errors.append("Too many errors encountered; stopping validation early.")
            break

    if errors:
        return {
            "success": False,
            "error": "Validation failed with the following issues:",
            "details": errors
        }

    # Perform safe insertion
    with get_db() as conn:
        cur = conn.cursor()
        inserted_orders = 0
        inserted_items = 0

        for item in cleaned_rows:
            # Insert order
            cur.execute(
                "INSERT INTO orders (customer_id, order_date, order_status, region) VALUES (%s, %s, %s, %s)",
                (item["customer_id"], item["order_date"], item["order_status"], item["region"])
            )
            order_id = cur.lastrowid or conn.cursor().execute("SELECT LAST_INSERT_ID()").fetchone()[0]

            # Insert order item
            cur.execute(
                "INSERT INTO order_items (order_id, product_id, quantity, unit_price, discount_percent) "
                "VALUES (%s, %s, %s, %s, %s)",
                (order_id, item["product_id"], item["quantity"], item["unit_price"], item["discount_percent"])
            )
            inserted_orders += 1
            inserted_items += 1

        if hasattr(conn, 'commit'):
            conn.commit()

    return {
        "success": True,
        "message": f"Successfully validated and imported {len(cleaned_rows)} records ({inserted_orders} orders created).",
        "imported_count": len(cleaned_rows)
    }
