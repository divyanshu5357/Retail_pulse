import pytest
from db import query_db, get_db_status
from analytical_queries import execute_predefined_query

def test_database_connection():
    status = get_db_status()
    assert status["status"] == "connected"
    assert status["counts"]["customers"] >= 100
    assert status["counts"]["products"] >= 20
    assert status["counts"]["orders"] >= 250
    assert status["counts"]["order_items"] >= 250

def test_inactive_customers_inclusion():
    """Verify customers without orders are not eliminated, showing 0 spend and 0 orders."""
    # Check v_customer_summary view
    inactive = query_db(
        "SELECT customer_id, customer_name, total_orders, total_spending, customer_segment "
        "FROM v_customer_summary WHERE total_orders = 0;"
    )
    assert len(inactive) >= 10, f"Expected at least 10 inactive customers, found {len(inactive)}"
    
    for cust in inactive:
        assert float(cust["total_spending"]) == 0.0
        assert cust["total_orders"] == 0
        assert "Inactive" in cust["customer_segment"]

def test_revenue_and_profit_formula():
    """Verify mathematical consistency of net revenue and profit on sample order items."""
    items = query_db("""
        SELECT 
            oi.quantity,
            oi.unit_price,
            oi.discount_percent,
            p.cost_price,
            ROUND(oi.quantity * oi.unit_price * (1 - (oi.discount_percent / 100.0)), 2) AS calculated_revenue,
            ROUND((oi.quantity * oi.unit_price * (1 - (oi.discount_percent / 100.0))) - (oi.quantity * p.cost_price), 2) AS calculated_profit
        FROM order_items oi
        JOIN products p ON oi.product_id = p.product_id
        LIMIT 10;
    """)
    assert len(items) > 0
    for item in items:
        qty = item["quantity"]
        uprice = float(item["unit_price"])
        disc = float(item["discount_percent"])
        cost = float(item["cost_price"])
        
        expected_rev = round(qty * uprice * (1 - disc / 100.0), 2)
        expected_profit = round(expected_rev - (qty * cost), 2)
        
        assert float(item["calculated_revenue"]) == expected_rev
        assert float(item["calculated_profit"]) == expected_profit

def test_sql_analytical_queries():
    """Test predefined analytical query runner."""
    result = execute_predefined_query("customer_spending_coalesce")
    assert result["row_count"] >= 100
    assert "total_spending" in result["columns"]
    assert "customer_tier" in result["columns"]

    inactive_result = execute_predefined_query("inactive_customers_zero_orders")
    assert inactive_result["row_count"] >= 10
