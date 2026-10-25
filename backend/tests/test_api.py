import pytest
from app import app

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_health_endpoint(client):
    res = client.get('/api/health')
    assert res.status_code == 200
    data = res.get_json()
    assert data["status"] in ["healthy", "degraded"]
    assert "database" in data

def test_dashboard_kpis(client):
    res = client.get('/api/dashboard/kpis')
    assert res.status_code == 200
    kpis = res.get_json()
    assert kpis["total_revenue"] > 0
    assert kpis["total_orders"] >= 200
    assert kpis["total_customers"] >= 100
    assert kpis["average_order_value"] > 0
    assert kpis["inactive_customers"] >= 10

def test_dashboard_charts(client):
    res = client.get('/api/dashboard/charts')
    assert res.status_code == 200
    charts = res.get_json()
    assert len(charts["monthly_trend"]) > 0
    assert len(charts["category_revenue"]) > 0
    assert len(charts["regional_sales"]) > 0
    assert len(charts["top_products"]) > 0
    assert len(charts["spending_distribution"]) > 0
    assert len(charts["order_status_breakdown"]) > 0

def test_customer_list_and_inactive(client):
    res = client.get('/api/customers')
    assert res.status_code == 200
    data = res.get_json()
    customers = data["customers"]
    assert len(customers) >= 100
    
    # Verify inactive customers are present in customer list
    inactives = [c for c in customers if c["is_inactive"]]
    assert len(inactives) >= 10
    for inc in inactives:
        assert inc["total_orders"] == 0
        assert inc["total_spending"] == 0.0

def test_excel_practical_endpoint(client):
    res = client.get('/api/practical/excel-formulas')
    assert res.status_code == 200
    data = res.get_json()
    assert len(data["formulas"]) == 9
    assert len(data["sample_rows"]) > 0

def test_pivot_table_practical_endpoint(client):
    res = client.get('/api/practical/pivot-table')
    assert res.status_code == 200
    data = res.get_json()
    assert "revenue_matrix" in data
    assert "excel_steps" in data
    assert len(data["excel_steps"]) == 5

def test_sql_execution_endpoint(client):
    res = client.post('/api/sql/execute', json={"query_id": "customer_spending_coalesce"})
    assert res.status_code == 200
    data = res.get_json()
    assert "columns" in data
    assert "rows" in data
    assert data["row_count"] >= 100
