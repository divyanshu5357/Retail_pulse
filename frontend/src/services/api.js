const API_BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:5001/api';

export const formatINR = (amount) => {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatNumber = (num) => {
  if (num === undefined || num === null || isNaN(num)) return '0';
  return new Intl.NumberFormat('en-IN').format(num);
};

export async function fetchHealth() {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) throw new Error('Failed to fetch health');
  return res.json();
}

export async function fetchFilterOptions() {
  const res = await fetch(`${API_BASE}/filter-options`);
  if (!res.ok) throw new Error('Failed to fetch filter options');
  return res.json();
}

export async function fetchDashboardKPIs(filters = {}) {
  const params = new URLSearchParams();
  if (filters.start_date) params.append('start_date', filters.start_date);
  if (filters.end_date) params.append('end_date', filters.end_date);
  if (filters.region && filters.region !== 'All') params.append('region', filters.region);
  if (filters.category && filters.category !== 'All') params.append('category', filters.category);

  const res = await fetch(`${API_BASE}/dashboard/kpis?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch KPIs');
  return res.json();
}

export async function fetchDashboardCharts(filters = {}) {
  const params = new URLSearchParams();
  if (filters.start_date) params.append('start_date', filters.start_date);
  if (filters.end_date) params.append('end_date', filters.end_date);
  if (filters.region && filters.region !== 'All') params.append('region', filters.region);
  if (filters.category && filters.category !== 'All') params.append('category', filters.category);

  const res = await fetch(`${API_BASE}/dashboard/charts?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch charts data');
  return res.json();
}

export async function fetchCustomers(params = {}) {
  const q = new URLSearchParams();
  if (params.search) q.append('search', params.search);
  if (params.region && params.region !== 'All') q.append('region', params.region);
  if (params.segment && params.segment !== 'All') q.append('segment', params.segment);

  const res = await fetch(`${API_BASE}/customers?${q.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch customers');
  return res.json();
}

export async function fetchCustomerDetail(customerId) {
  const res = await fetch(`${API_BASE}/customers/${customerId}`);
  if (!res.ok) throw new Error('Failed to fetch customer detail');
  return res.json();
}

export async function fetchProducts(params = {}) {
  const q = new URLSearchParams();
  if (params.category && params.category !== 'All') q.append('category', params.category);
  if (params.search) q.append('search', params.search);

  const res = await fetch(`${API_BASE}/products?${q.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

export async function fetchOrders(params = {}) {
  const q = new URLSearchParams();
  if (params.search) q.append('search', params.search);
  if (params.region && params.region !== 'All') q.append('region', params.region);
  if (params.status && params.status !== 'All') q.append('status', params.status);
  if (params.start_date) q.append('start_date', params.start_date);
  if (params.end_date) q.append('end_date', params.end_date);

  const res = await fetch(`${API_BASE}/orders?${q.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch orders');
  return res.json();
}

export async function fetchOrderDetail(orderId) {
  const res = await fetch(`${API_BASE}/orders/${orderId}`);
  if (!res.ok) throw new Error('Failed to fetch order detail');
  return res.json();
}

export async function fetchExcelPractical() {
  const res = await fetch(`${API_BASE}/practical/excel-formulas`);
  if (!res.ok) throw new Error('Failed to fetch Excel formulas');
  return res.json();
}

export async function fetchPivotTablePractical() {
  const res = await fetch(`${API_BASE}/practical/pivot-table`);
  if (!res.ok) throw new Error('Failed to fetch Pivot Table data');
  return res.json();
}

export async function fetchSqlQueries() {
  const res = await fetch(`${API_BASE}/sql/queries`);
  if (!res.ok) throw new Error('Failed to fetch SQL queries');
  return res.json();
}

export async function executeSqlQuery(queryId) {
  const res = await fetch(`${API_BASE}/sql/execute`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query_id: queryId })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Query execution failed');
  }
  return res.json();
}

export function getDownloadUrl(filename) {
  return `${API_BASE}/exports/${filename}`;
}

export async function uploadSalesCsv(file) {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${API_BASE}/import/sales-csv`, {
    method: 'POST',
    body: formData
  });
  return res.json();
}

export async function triggerReseed() {
  const res = await fetch(`${API_BASE}/admin/reseed`, {
    method: 'POST'
  });
  return res.json();
}
