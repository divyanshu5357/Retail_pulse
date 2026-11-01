export const dateRanges = ["Last 30 Days", "Last 6 Months", "This Year", "All Time"];

export const hospitalDataByRange = {
  "Last 30 Days": {
    badgeLabel: "30-Day Clinical Velocity",
    kpiMetrics: [
      {
        id: "admissions",
        title: "Total Inpatients",
        value: "412",
        change: "+8.4%",
        isPositive: true,
        subtext: "vs prev 30 days",
        iconName: "UserCheck",
        accentColor: "cyan"
      },
      {
        id: "occupancy",
        title: "Bed Occupancy Rate",
        value: "86.2%",
        change: "+2.8%",
        isPositive: true,
        subtext: "target 85%",
        iconName: "BedDouble",
        accentColor: "blue"
      },
      {
        id: "alos",
        title: "Avg Length of Stay",
        value: "3.8 Days",
        change: "-0.4d",
        isPositive: true,
        subtext: "clinical efficiency",
        iconName: "Activity",
        accentColor: "emerald"
      },
      {
        id: "billing",
        title: "Clinical Billing",
        value: "₹34.8 Lakh",
        change: "+11.5%",
        isPositive: true,
        subtext: "gross collections",
        iconName: "IndianRupee",
        accentColor: "violet"
      }
    ],
    admissionsTrend: [
      { period: "Week 1", admissions: 94, discharges: 88 },
      { period: "Week 2", admissions: 108, discharges: 102 },
      { period: "Week 3", admissions: 102, discharges: 98 },
      { period: "Week 4", admissions: 108, discharges: 105 }
    ],
    trendYDomain: [60, 120],
    departmentOccupancy: [
      { department: "Cardiology", beds: 52, revenue: 1120000 },
      { department: "Neurology", beds: 38, revenue: 840000 },
      { department: "Orthopedics", beds: 44, revenue: 760000 },
      { department: "Oncology", beds: 32, revenue: 920000 },
      { department: "Pediatrics", beds: 28, revenue: 420000 }
    ],
    departmentYDomain: [0, 60],
    recentEncounters: [
      {
        id: "ADM-9401",
        patient: "Devendra Rathore",
        department: "Cardiology",
        ward: "ICU Ward B-04",
        amount: "₹65,000",
        status: "Critical Care",
        triageLevel: "Level 1"
      },
      {
        id: "ADM-9402",
        patient: "Meenakshi Sundaram",
        department: "Orthopedics",
        ward: "Deluxe Ward 208",
        amount: "₹42,500",
        status: "Recovering",
        triageLevel: "Level 2"
      },
      {
        id: "ADM-9403",
        patient: "Zainab Fatima",
        department: "Neurology",
        ward: "Special Care 112",
        amount: "₹58,200",
        status: "Admitted",
        triageLevel: "Level 2"
      },
      {
        id: "ADM-9404",
        patient: "Anand Deshmukh",
        department: "Pediatrics",
        ward: "Daycare Ward P-03",
        amount: "₹18,400",
        status: "Discharged",
        triageLevel: "Level 3"
      },
      {
        id: "ADM-9405",
        patient: "Sunita Chatterjee",
        department: "Oncology",
        ward: "Chemo Suite 06",
        amount: "₹72,000",
        status: "Under Treatment",
        triageLevel: "Level 1"
      }
    ]
  },

  "Last 6 Months": {
    badgeLabel: "6-Month Hospital Performance",
    kpiMetrics: [
      {
        id: "admissions",
        title: "Total Inpatients",
        value: "2,480",
        change: "+12.6%",
        isPositive: true,
        subtext: "vs prior 6 months",
        iconName: "UserCheck",
        accentColor: "cyan"
      },
      {
        id: "occupancy",
        title: "Bed Occupancy Rate",
        value: "84.5%",
        change: "+3.4%",
        isPositive: true,
        subtext: "optimal hospital capacity",
        iconName: "BedDouble",
        accentColor: "blue"
      },
      {
        id: "alos",
        title: "Avg Length of Stay",
        value: "4.2 Days",
        change: "-0.6d",
        isPositive: true,
        subtext: "improved recovery",
        iconName: "Activity",
        accentColor: "emerald"
      },
      {
        id: "billing",
        title: "Clinical Billing",
        value: "₹1.85 Crore",
        change: "+14.8%",
        isPositive: true,
        subtext: "realized hospital revenue",
        iconName: "IndianRupee",
        accentColor: "violet"
      }
    ],
    admissionsTrend: [
      { period: "May", admissions: 380, discharges: 362 },
      { period: "Jun", admissions: 410, discharges: 395 },
      { period: "Jul", admissions: 395, discharges: 382 },
      { period: "Aug", admissions: 425, discharges: 412 },
      { period: "Sep", admissions: 435, discharges: 418 },
      { period: "Oct", admissions: 435, discharges: 426 }
    ],
    trendYDomain: [300, 480],
    departmentOccupancy: [
      { department: "Cardiology", beds: 58, revenue: 5840000 },
      { department: "Oncology", beds: 48, revenue: 4720000 },
      { department: "Neurology", beds: 42, revenue: 3950000 },
      { department: "Orthopedics", beds: 36, revenue: 3250000 },
      { department: "Pediatrics", beds: 24, revenue: 1820000 }
    ],
    departmentYDomain: [0, 70],
    recentEncounters: [
      {
        id: "ADM-8821",
        patient: "Rajeshwar Sen",
        department: "Cardiology",
        ward: "Cath Lab ICU 01",
        amount: "₹1,24,000",
        status: "Critical Care",
        triageLevel: "Level 1"
      },
      {
        id: "ADM-8820",
        patient: "Pooja Hegde",
        department: "Neurology",
        ward: "Neuro Stepdown 14",
        amount: "₹84,500",
        status: "Admitted",
        triageLevel: "Level 2"
      },
      {
        id: "ADM-8819",
        patient: "Harshwardhan K.",
        department: "Orthopedics",
        ward: "Post-Op Ward 302",
        amount: "₹62,000",
        status: "Recovering",
        triageLevel: "Level 2"
      },
      {
        id: "ADM-8818",
        patient: "Priyanka Nambiar",
        department: "Oncology",
        ward: "Infusion Bay 09",
        amount: "₹91,000",
        status: "Under Treatment",
        triageLevel: "Level 1"
      },
      {
        id: "ADM-8817",
        patient: "Aaradhya Joshi",
        department: "Pediatrics",
        ward: "Pediatric Care 05",
        amount: "₹26,800",
        status: "Discharged",
        triageLevel: "Level 3"
      }
    ]
  },

  "This Year": {
    badgeLabel: "YTD Healthcare Analytics",
    kpiMetrics: [
      {
        id: "admissions",
        title: "Total Inpatients",
        value: "4,320",
        change: "+16.8%",
        isPositive: true,
        subtext: "YTD cumulative count",
        iconName: "UserCheck",
        accentColor: "cyan"
      },
      {
        id: "occupancy",
        title: "Bed Occupancy Rate",
        value: "85.8%",
        change: "+4.1%",
        isPositive: true,
        subtext: "annual bed utilization",
        iconName: "BedDouble",
        accentColor: "blue"
      },
      {
        id: "alos",
        title: "Avg Length of Stay",
        value: "4.1 Days",
        change: "-0.5d",
        isPositive: true,
        subtext: "patient throughput",
        iconName: "Activity",
        accentColor: "emerald"
      },
      {
        id: "billing",
        title: "Clinical Billing",
        value: "₹3.42 Crore",
        change: "+19.2%",
        isPositive: true,
        subtext: "annual medical gross",
        iconName: "IndianRupee",
        accentColor: "violet"
      }
    ],
    admissionsTrend: [
      { period: "Jan", admissions: 390, discharges: 375 },
      { period: "Feb", admissions: 405, discharges: 390 },
      { period: "Mar", admissions: 420, discharges: 408 },
      { period: "Apr", admissions: 410, discharges: 396 },
      { period: "May", admissions: 430, discharges: 418 },
      { period: "Jun", admissions: 445, discharges: 430 },
      { period: "Jul", admissions: 435, discharges: 424 },
      { period: "Aug", admissions: 450, discharges: 438 },
      { period: "Sep", admissions: 465, discharges: 452 },
      { period: "Oct", admissions: 470, discharges: 460 }
    ],
    trendYDomain: [350, 500],
    departmentOccupancy: [
      { department: "Cardiology", beds: 62, revenue: 11400000 },
      { department: "Oncology", beds: 52, revenue: 9800000 },
      { department: "Neurology", beds: 46, revenue: 8100000 },
      { department: "Orthopedics", beds: 39, revenue: 6400000 },
      { department: "Pediatrics", beds: 27, revenue: 3500000 }
    ],
    departmentYDomain: [0, 75],
    recentEncounters: [
      {
        id: "ADM-7640",
        patient: "Gurpreet Singh",
        department: "Cardiology",
        ward: "Cardiac Care CCU-2",
        amount: "₹1,45,000",
        status: "Critical Care",
        triageLevel: "Level 1"
      },
      {
        id: "ADM-7639",
        patient: "Shalini Trivedi",
        department: "Oncology",
        ward: "Radiation Suite 04",
        amount: "₹1,12,000",
        status: "Under Treatment",
        triageLevel: "Level 1"
      },
      {
        id: "ADM-7638",
        patient: "Balvinder Bhasin",
        department: "Neurology",
        ward: "Stroke Unit 105",
        amount: "₹88,000",
        status: "Admitted",
        triageLevel: "Level 2"
      },
      {
        id: "ADM-7637",
        patient: "Tanya Mukherjee",
        department: "Orthopedics",
        ward: "Joint Rehab 210",
        amount: "₹68,500",
        status: "Recovering",
        triageLevel: "Level 2"
      },
      {
        id: "ADM-7636",
        patient: "Kabir Malhotra",
        department: "Pediatrics",
        ward: "Pediatric ICU 02",
        amount: "₹34,000",
        status: "Discharged",
        triageLevel: "Level 3"
      }
    ]
  },

  "All Time": {
    badgeLabel: "Historical Clinical Registry",
    kpiMetrics: [
      {
        id: "admissions",
        title: "Total Inpatients",
        value: "8,650",
        change: "+22.4%",
        isPositive: true,
        subtext: "all-time treated patients",
        iconName: "UserCheck",
        accentColor: "cyan"
      },
      {
        id: "occupancy",
        title: "Bed Occupancy Rate",
        value: "86.4%",
        change: "+5.0%",
        isPositive: true,
        subtext: "historical average",
        iconName: "BedDouble",
        accentColor: "blue"
      },
      {
        id: "alos",
        title: "Avg Length of Stay",
        value: "4.0 Days",
        change: "-0.8d",
        isPositive: true,
        subtext: "institutional benchmark",
        iconName: "Activity",
        accentColor: "emerald"
      },
      {
        id: "billing",
        title: "Clinical Billing",
        value: "₹6.94 Crore",
        change: "+26.1%",
        isPositive: true,
        subtext: "total hospital revenue",
        iconName: "IndianRupee",
        accentColor: "violet"
      }
    ],
    admissionsTrend: [
      { period: "Nov 24", admissions: 375, discharges: 360 },
      { period: "Dec 24", admissions: 385, discharges: 370 },
      { period: "Jan 25", admissions: 390, discharges: 375 },
      { period: "Feb 25", admissions: 405, discharges: 390 },
      { period: "Mar 25", admissions: 420, discharges: 408 },
      { period: "Apr 25", admissions: 410, discharges: 396 },
      { period: "May 25", admissions: 430, discharges: 418 },
      { period: "Jun 25", admissions: 445, discharges: 430 },
      { period: "Jul 25", admissions: 435, discharges: 424 },
      { period: "Aug 25", admissions: 450, discharges: 438 },
      { period: "Sep 25", admissions: 465, discharges: 452 },
      { period: "Oct 25", admissions: 470, discharges: 460 }
    ],
    trendYDomain: [300, 500],
    departmentOccupancy: [
      { department: "Cardiology", beds: 65, revenue: 23500000 },
      { department: "Oncology", beds: 54, revenue: 19800000 },
      { department: "Neurology", beds: 48, revenue: 16200000 },
      { department: "Orthopedics", beds: 42, revenue: 13400000 },
      { department: "Pediatrics", beds: 30, revenue: 6500000 }
    ],
    departmentYDomain: [0, 80],
    recentEncounters: [
      {
        id: "ADM-6501",
        patient: "Venkatesh Rao",
        department: "Cardiology",
        ward: "Executive Suite 401",
        amount: "₹1,85,000",
        status: "Critical Care",
        triageLevel: "Level 1"
      },
      {
        id: "ADM-6502",
        patient: "Nirmala Devi",
        department: "Oncology",
        ward: "Special Care 201",
        amount: "₹1,40,000",
        status: "Under Treatment",
        triageLevel: "Level 1"
      },
      {
        id: "ADM-6503",
        patient: "Aakash Varma",
        department: "Neurology",
        ward: "Neuro Stepdown 12",
        amount: "₹95,000",
        status: "Admitted",
        triageLevel: "Level 2"
      },
      {
        id: "ADM-6504",
        patient: "Ratna Srivastava",
        department: "Orthopedics",
        ward: "Deluxe Ward 305",
        amount: "₹78,000",
        status: "Recovering",
        triageLevel: "Level 2"
      },
      {
        id: "ADM-6505",
        patient: "Farhan Qureshi",
        department: "Pediatrics",
        ward: "General Pediatric 01",
        amount: "₹38,000",
        status: "Discharged",
        triageLevel: "Level 3"
      }
    ]
  }
};
