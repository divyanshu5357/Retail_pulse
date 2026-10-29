export const dateRanges = ["Last 30 Days", "Last 6 Months", "This Year", "All Time"];

export const dashboardDataByRange = {
  "Last 30 Days": {
    badgeLabel: "30-Day Trend",
    kpiMetrics: [
      {
        id: "revenue",
        title: "Total Revenue",
        value: "₹1,85,000",
        change: "+14.2%",
        isPositive: true,
        subtext: "vs prev 30 days",
        iconName: "IndianRupee"
      },
      {
        id: "profit",
        title: "Total Profit",
        value: "₹48,500",
        change: "+9.4%",
        isPositive: true,
        subtext: "vs prev 30 days",
        iconName: "TrendingUp"
      },
      {
        id: "orders",
        title: "Total Orders",
        value: "284",
        change: "+7.1%",
        isPositive: true,
        subtext: "completed orders",
        iconName: "ShoppingBag"
      },
      {
        id: "customers",
        title: "Total Customers",
        value: "95",
        change: "+24",
        isPositive: true,
        subtext: "new buyers",
        iconName: "Users"
      }
    ],
    monthlySalesTrend: [
      { month: "Week 1", revenue: 38000, profit: 9800 },
      { month: "Week 2", revenue: 45000, profit: 11800 },
      { month: "Week 3", revenue: 49000, profit: 12900 },
      { month: "Week 4", revenue: 53000, profit: 14000 }
    ],
    trendYDomain: [30000, 60000],
    categoryRevenueData: [
      { category: "Electronics", revenue: 82000 },
      { category: "Clothing", revenue: 48000 },
      { category: "Home", revenue: 34000 },
      { category: "Grocery", revenue: 21000 }
    ],
    categoryYDomain: [0, 100000],
    recentOrders: [
      {
        id: "ORD-8104",
        customer: "Aarav Mehta",
        category: "Electronics",
        amount: "₹18,499",
        status: "Completed",
        date: "2 hours ago"
      },
      {
        id: "ORD-8103",
        customer: "Meera Sen",
        category: "Clothing",
        amount: "₹2,799",
        status: "Completed",
        date: "5 hours ago"
      },
      {
        id: "ORD-8102",
        customer: "Devendra Rao",
        category: "Home",
        amount: "₹5,400",
        status: "Pending",
        date: "Yesterday"
      },
      {
        id: "ORD-8101",
        customer: "Ananya Iyer",
        category: "Grocery",
        amount: "₹1,450",
        status: "Completed",
        date: "2 days ago"
      },
      {
        id: "ORD-8100",
        customer: "Kunal Shah",
        category: "Clothing",
        amount: "₹4,199",
        status: "Cancelled",
        date: "3 days ago"
      }
    ]
  },

  "Last 6 Months": {
    badgeLabel: "6-Month View",
    kpiMetrics: [
      {
        id: "revenue",
        title: "Total Revenue",
        value: "₹8,50,000",
        change: "+12.4%",
        isPositive: true,
        subtext: "vs last period",
        iconName: "IndianRupee"
      },
      {
        id: "profit",
        title: "Total Profit",
        value: "₹2,10,000",
        change: "+8.1%",
        isPositive: true,
        subtext: "vs last period",
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
    ],
    monthlySalesTrend: [
      { month: "Jan", revenue: 115000, profit: 28000 },
      { month: "Feb", revenue: 132000, profit: 34000 },
      { month: "Mar", revenue: 140000, profit: 36000 },
      { month: "Apr", revenue: 128000, profit: 31000 },
      { month: "May", revenue: 155000, profit: 39000 },
      { month: "Jun", revenue: 180000, profit: 42000 }
    ],
    trendYDomain: [80000, 200000],
    categoryRevenueData: [
      { category: "Electronics", revenue: 380000 },
      { category: "Clothing", revenue: 210000 },
      { category: "Home", revenue: 160000 },
      { category: "Grocery", revenue: 100000 }
    ],
    categoryYDomain: [0, 400000],
    recentOrders: [
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
    ]
  },

  "This Year": {
    badgeLabel: "Year-to-Date (YTD)",
    kpiMetrics: [
      {
        id: "revenue",
        title: "Total Revenue",
        value: "₹14,20,000",
        change: "+18.6%",
        isPositive: true,
        subtext: "YTD growth",
        iconName: "IndianRupee"
      },
      {
        id: "profit",
        title: "Total Profit",
        value: "₹3,65,000",
        change: "+14.2%",
        isPositive: true,
        subtext: "YTD margin +25.7%",
        iconName: "TrendingUp"
      },
      {
        id: "orders",
        title: "Total Orders",
        value: "2,150",
        change: "+11.8%",
        isPositive: true,
        subtext: "annual volume",
        iconName: "ShoppingBag"
      },
      {
        id: "customers",
        title: "Total Customers",
        value: "780",
        change: "+142",
        isPositive: true,
        subtext: "active customer base",
        iconName: "Users"
      }
    ],
    monthlySalesTrend: [
      { month: "Jan", revenue: 115000, profit: 28000 },
      { month: "Feb", revenue: 132000, profit: 34000 },
      { month: "Mar", revenue: 140000, profit: 36000 },
      { month: "Apr", revenue: 128000, profit: 31000 },
      { month: "May", revenue: 155000, profit: 39000 },
      { month: "Jun", revenue: 180000, profit: 42000 },
      { month: "Jul", revenue: 165000, profit: 41000 },
      { month: "Aug", revenue: 172000, profit: 44000 },
      { month: "Sep", revenue: 198000, profit: 51000 },
      { month: "Oct", revenue: 215000, profit: 56000 }
    ],
    trendYDomain: [80000, 240000],
    categoryRevenueData: [
      { category: "Electronics", revenue: 640000 },
      { category: "Clothing", revenue: 350000 },
      { category: "Home", revenue: 265000 },
      { category: "Grocery", revenue: 165000 }
    ],
    categoryYDomain: [0, 700000],
    recentOrders: [
      {
        id: "ORD-9240",
        customer: "Sunil Agarwal",
        category: "Electronics",
        amount: "₹65,000",
        status: "Completed",
        date: "Oct 28"
      },
      {
        id: "ORD-9239",
        customer: "Vivek Sharma",
        category: "Clothing",
        amount: "₹12,499",
        status: "Completed",
        date: "Oct 27"
      },
      {
        id: "ORD-9238",
        customer: "Shreya Kapoor",
        category: "Home",
        amount: "₹9,800",
        status: "Pending",
        date: "Oct 26"
      },
      {
        id: "ORD-9237",
        customer: "Kavita Nair",
        category: "Grocery",
        amount: "₹3,250",
        status: "Completed",
        date: "Oct 25"
      },
      {
        id: "ORD-9236",
        customer: "Rohit Sharma",
        category: "Electronics",
        amount: "₹22,999",
        status: "Cancelled",
        date: "Oct 24"
      }
    ]
  },

  "All Time": {
    badgeLabel: "Full Dataset History",
    kpiMetrics: [
      {
        id: "revenue",
        title: "Total Revenue",
        value: "₹21,60,921",
        change: "+24.5%",
        isPositive: true,
        subtext: "cumulative gross sales",
        iconName: "IndianRupee"
      },
      {
        id: "profit",
        title: "Total Profit",
        value: "₹6,71,842",
        change: "+21.3%",
        isPositive: true,
        subtext: "realized net profit",
        iconName: "TrendingUp"
      },
      {
        id: "orders",
        title: "Total Orders",
        value: "3,420",
        change: "+16.4%",
        isPositive: true,
        subtext: "lifetime order transactions",
        iconName: "ShoppingBag"
      },
      {
        id: "customers",
        title: "Total Customers",
        value: "1,180",
        change: "+310",
        isPositive: true,
        subtext: "total registered accounts",
        iconName: "Users"
      }
    ],
    monthlySalesTrend: [
      { month: "Nov 24", revenue: 228962, profit: 69852 },
      { month: "Dec 24", revenue: 229142, profit: 72432 },
      { month: "Jan 25", revenue: 117275, profit: 45495 },
      { month: "Feb 25", revenue: 283928, profit: 87868 },
      { month: "Mar 25", revenue: 77556, profit: 28976 },
      { month: "Apr 25", revenue: 250543, profit: 75023 },
      { month: "May 25", revenue: 134827, profit: 50667 },
      { month: "Jun 25", revenue: 144964, profit: 41444 },
      { month: "Jul 25", revenue: 114532, profit: 44442 },
      { month: "Aug 25", revenue: 99265, profit: 30195 },
      { month: "Sep 25", revenue: 307391, profit: 72601 },
      { month: "Oct 25", revenue: 172535, profit: 52845 }
    ],
    trendYDomain: [50000, 350000],
    categoryRevenueData: [
      { category: "Electronics", revenue: 1309620 },
      { category: "Clothing", revenue: 256098 },
      { category: "Home", revenue: 344142 },
      { category: "Grocery", revenue: 61430 }
    ],
    categoryYDomain: [0, 1400000],
    recentOrders: [
      {
        id: "ORD-1005",
        customer: "Arjun Choudhury",
        category: "Electronics",
        amount: "₹97,294",
        status: "Completed",
        date: "Historical VIP"
      },
      {
        id: "ORD-1004",
        customer: "Simran Reddy",
        category: "Home",
        amount: "₹96,878",
        status: "Completed",
        date: "Historical VIP"
      },
      {
        id: "ORD-1003",
        customer: "Rahul Rao",
        category: "Clothing",
        amount: "₹86,187",
        status: "Completed",
        date: "Historical VIP"
      },
      {
        id: "ORD-1002",
        customer: "Nandini Patel",
        category: "Grocery",
        amount: "₹74,940",
        status: "Completed",
        date: "Historical VIP"
      },
      {
        id: "ORD-1001",
        customer: "Bhavna Nair",
        category: "Home",
        amount: "₹5,200",
        status: "Pending",
        date: "Historical"
      }
    ]
  }
};
