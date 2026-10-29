export const kpiMetrics = [
  {
    id: "revenue",
    title: "Total Revenue",
    value: "₹8,50,000",
    change: "+12.4%",
    isPositive: true,
    subtext: "vs last month",
    iconName: "IndianRupee"
  },
  {
    id: "profit",
    title: "Total Profit",
    value: "₹2,10,000",
    change: "+8.1%",
    isPositive: true,
    subtext: "vs last month",
    iconName: "TrendingUp"
  },
  {
    id: "orders",
    title: "Total Orders",
    value: "1,240",
    change: "+5.2%",
    isPositive: true,
    subtext: "fulfilled orders",
    iconName: "ShoppingBag"
  },
  {
    id: "customers",
    title: "Total Customers",
    value: "450",
    change: "+18",
    isPositive: true,
    subtext: "new accounts",
    iconName: "Users"
  }
];

export const monthlySalesTrend = [
  { month: "Jan", revenue: 115000, profit: 28000 },
  { month: "Feb", revenue: 132000, profit: 34000 },
  { month: "Mar", revenue: 140000, profit: 36000 },
  { month: "Apr", revenue: 128000, profit: 31000 },
  { month: "May", revenue: 155000, profit: 39000 },
  { month: "Jun", revenue: 180000, profit: 42000 }
];

export const categoryRevenueData = [
  { category: "Electronics", revenue: 380000 },
  { category: "Clothing", revenue: 210000 },
  { category: "Home", revenue: 160000 },
  { category: "Grocery", revenue: 100000 }
];

export const recentOrders = [
  {
    id: "ORD-7821",
    customer: "Priya Sharma",
    category: "Electronics",
    amount: "₹42,999",
    status: "Completed",
    date: "Today, 14:20"
  },
  {
    id: "ORD-7820",
    customer: "Rahul Verma",
    category: "Clothing",
    amount: "₹3,499",
    status: "Completed",
    date: "Today, 12:45"
  },
  {
    id: "ORD-7819",
    customer: "Anita Desai",
    category: "Home",
    amount: "₹8,250",
    status: "Pending",
    date: "Today, 10:15"
  },
  {
    id: "ORD-7818",
    customer: "Vikram Patel",
    category: "Grocery",
    amount: "₹1,850",
    status: "Completed",
    date: "Yesterday"
  },
  {
    id: "ORD-7817",
    customer: "Sneha Reddy",
    category: "Electronics",
    amount: "₹14,999",
    status: "Cancelled",
    date: "Yesterday"
  }
];
