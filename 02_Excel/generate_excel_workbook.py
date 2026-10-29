#!/usr/bin/env python3
"""
Generate retail_sales_analytics.xlsx
A comprehensive, professionally styled Excel workbook featuring:
1. Executive_KPI_Dashboard (KPI scorecards, category/regional tables, and native bar chart)
2. Sales_Transactions (530 formatted transaction records with proper currency/date formats)
3. Advanced_Formulas_Lab (Live evaluations of IF, Nested IF, AND, OR, NOT, IFERROR, SUMIF, AVERAGEIF, COUNTIF)
4. Pivot_Summary_Matrix (5x5 Category x Region cross-tabulation table with SUMIFS formulas)
5. Customer_Lifetime_Value (Customer spending tiers and loyalty segments)
"""

import os
import csv
from datetime import datetime
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter
from openpyxl.chart import BarChart, Reference

def create_workbook():
    wb = openpyxl.Workbook()
    # remove default sheet
    default_sheet = wb.active

    # Palette
    navy_dark = "0F172A"       # Slate 900
    navy_blue = "1E293B"       # Slate 800
    blue_primary = "2563EB"    # Blue 600
    blue_light = "DBEAFE"      # Blue 100
    teal_accent = "0D9488"     # Teal 600
    emerald_accent = "10B981"  # Emerald 500
    amber_accent = "F59E0B"    # Amber 500
    gray_header = "334155"     # Slate 700
    gray_zebra = "F8FAFC"      # Slate 50
    gray_border = "CBD5E1"     # Slate 300
    white = "FFFFFF"

    font_family = "Calibri"

    title_font = Font(name=font_family, size=16, bold=True, color=white)
    subtitle_font = Font(name=font_family, size=11, italic=True, color="E2E8F0")
    header_font = Font(name=font_family, size=11, bold=True, color=white)
    header_navy_font = Font(name=font_family, size=11, bold=True, color=navy_dark)
    kpi_title_font = Font(name=font_family, size=10, bold=True, color="475569")
    kpi_value_font = Font(name=font_family, size=18, bold=True, color=navy_dark)
    data_font = Font(name=font_family, size=10, color="0F172A")
    data_bold = Font(name=font_family, size=10, bold=True, color="0F172A")
    formula_font = Font(name="Consolas", size=9.5, color="1E3A8A")

    title_fill = PatternFill(start_color=navy_dark, end_color=navy_dark, fill_type="solid")
    header_fill = PatternFill(start_color=blue_primary, end_color=blue_primary, fill_type="solid")
    header_dark_fill = PatternFill(start_color=gray_header, end_color=gray_header, fill_type="solid")
    kpi_bg_fill = PatternFill(start_color="F1F5F9", end_color="F1F5F9", fill_type="solid")
    zebra_fill = PatternFill(start_color=gray_zebra, end_color=gray_zebra, fill_type="solid")
    accent_fill = PatternFill(start_color=blue_light, end_color=blue_light, fill_type="solid")

    thin_border_side = Side(style="thin", color=gray_border)
    thick_bottom_side = Side(style="medium", color=navy_dark)
    double_bottom_side = Side(style="double", color=navy_dark)

    cell_border = Border(left=thin_border_side, right=thin_border_side, top=thin_border_side, bottom=thin_border_side)
    total_border = Border(top=thin_border_side, bottom=double_bottom_side, left=thin_border_side, right=thin_border_side)
    kpi_border = Border(left=thin_border_side, right=thin_border_side, top=thin_border_side, bottom=thin_border_side)

    # --------------------------------------------------------------------------
    # 1. Load CSV data
    # --------------------------------------------------------------------------
    csv_path = "../03_Tableau/tableau_sales_master.csv"
    if not os.path.exists(csv_path):
        csv_path = "03_Tableau/tableau_sales_master.csv"
    if not os.path.exists(csv_path):
        csv_path = "../Business_Analytics/backend/exports/tableau_sales_master.csv"

    rows_data = []
    with open(csv_path, mode="r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for r in reader:
            rows_data.append(r)

    # --------------------------------------------------------------------------
    # SHEET 1: Executive_KPI_Dashboard
    # --------------------------------------------------------------------------
    ws_dash = wb.create_sheet(title="Executive_KPI_Dashboard")
    ws_dash.views.sheetView[0].showGridLines = True

    # Title Banner
    ws_dash.merge_cells("A1:K2")
    title_cell = ws_dash["A1"]
    title_cell.value = "   RETAIL SALES & CUSTOMER ANALYTICS — EXECUTIVE KPI DASHBOARD"
    title_cell.font = title_font
    title_cell.fill = title_fill
    title_cell.alignment = Alignment(vertical="center")

    ws_dash.merge_cells("A3:K3")
    sub_cell = ws_dash["A3"]
    sub_cell.value = f"   Dataset: 530 Transactions | 280 Orders | 110 Customers | 5 Geographic Regions | Generated: {datetime.now().strftime('%Y-%m-%d')}"
    sub_cell.font = subtitle_font
    sub_cell.fill = PatternFill(start_color=navy_blue, end_color=navy_blue, fill_type="solid")
    sub_cell.alignment = Alignment(vertical="center")

    # KPI Cards (Row 5 to 7)
    kpis = [
        ("TOTAL NET REVENUE", "=SUM(Sales_Transactions!M2:M531)", "₹#,##0.00", "B5:C7", "B5", "B6"),
        ("TOTAL GROSS PROFIT", "=SUM(Sales_Transactions!O2:O531)", "₹#,##0.00", "D5:E7", "D5", "D6"),
        ("OVERALL PROFIT MARGIN", "=D6/B6", "0.00%", "F5:G7", "F5", "F6"),
        ("TOTAL COMPLETED ORDERS", '=COUNTIF(Sales_Transactions!Q2:Q531, "<>Cancelled")', '#,##0', "H5:I7", "H5", "H6"),
        ("AVERAGE ORDER VALUE (AOV)", "=B6/H6", "₹#,##0.00", "J5:K7", "J5", "J6")
    ]

    for title, formula, num_fmt, merge_range, top_left, val_cell in kpis:
        c1, c2 = merge_range.split(":")
        start_col, start_row = c1[0], int(c1[1])
        end_col, end_row = c2[0], int(c2[1])

        # Style box
        for col_idx in range(openpyxl.utils.column_index_from_string(start_col), openpyxl.utils.column_index_from_string(end_col) + 1):
            for row_idx in range(start_row, end_row + 1):
                cell = ws_dash.cell(row=row_idx, column=col_idx)
                cell.fill = kpi_bg_fill
                cell.border = kpi_border

        # Merge title
        ws_dash.merge_cells(f"{start_col}{start_row}:{end_col}{start_row}")
        t_cell = ws_dash[f"{start_col}{start_row}"]
        t_cell.value = title
        t_cell.font = kpi_title_font
        t_cell.alignment = Alignment(horizontal="center", vertical="center")

        # Merge value
        ws_dash.merge_cells(f"{start_col}{start_row+1}:{end_col}{end_row}")
        v_cell = ws_dash[f"{start_col}{start_row+1}"]
        v_cell.value = formula
        v_cell.font = kpi_value_font
        v_cell.alignment = Alignment(horizontal="center", vertical="center")
        v_cell.number_format = num_fmt

    # Section 1: Category Performance Table (Row 9)
    ws_dash["B9"].value = "Merchandise Category Performance Breakdown"
    ws_dash["B9"].font = Font(name=font_family, size=12, bold=True, color=navy_dark)

    cat_headers = ["Category", "Orders Count", "Units Sold", "Net Revenue (INR)", "Total Profit (INR)", "Profit Margin"]
    for col_i, h in enumerate(cat_headers, start=2):
        cell = ws_dash.cell(row=10, column=col_i, value=h)
        cell.font = header_font
        cell.fill = header_fill
        cell.alignment = Alignment(horizontal="center" if col_i not in (2,) else "left", vertical="center")
        cell.border = cell_border

    categories = ["Electronics", "Fashion", "Groceries", "Home & Living", "Sports"]
    for idx, cat in enumerate(categories, start=11):
        ws_dash.cell(row=idx, column=2, value=cat).font = data_bold
        ws_dash.cell(row=idx, column=3, value=f'=COUNTIFS(Sales_Transactions!G:G, "{cat}", Sales_Transactions!Q:Q, "<>Cancelled")').number_format = "#,##0"
        ws_dash.cell(row=idx, column=4, value=f'=SUMIFS(Sales_Transactions!H:H, Sales_Transactions!G:G, "{cat}", Sales_Transactions!Q:Q, "<>Cancelled")').number_format = "#,##0"
        ws_dash.cell(row=idx, column=5, value=f'=SUMIFS(Sales_Transactions!M:M, Sales_Transactions!G:G, "{cat}", Sales_Transactions!Q:Q, "<>Cancelled")').number_format = "₹#,##0.00"
        ws_dash.cell(row=idx, column=6, value=f'=SUMIFS(Sales_Transactions!O:O, Sales_Transactions!G:G, "{cat}", Sales_Transactions!Q:Q, "<>Cancelled")').number_format = "₹#,##0.00"
        ws_dash.cell(row=idx, column=7, value=f'=F{idx}/E{idx}').number_format = "0.00%"

        for c_idx in range(2, 8):
            cell = ws_dash.cell(row=idx, column=c_idx)
            cell.font = data_font if c_idx != 2 else data_bold
            cell.border = cell_border
            if idx % 2 == 0:
                cell.fill = zebra_fill

    # Total Row for Category Table
    tot_row = 11 + len(categories)
    ws_dash.cell(row=tot_row, column=2, value="Grand Total").font = data_bold
    ws_dash.cell(row=tot_row, column=3, value=f"=SUM(C11:C{tot_row-1})").number_format = "#,##0"
    ws_dash.cell(row=tot_row, column=4, value=f"=SUM(D11:D{tot_row-1})").number_format = "#,##0"
    ws_dash.cell(row=tot_row, column=5, value=f"=SUM(E11:E{tot_row-1})").number_format = "₹#,##0.00"
    ws_dash.cell(row=tot_row, column=6, value=f"=SUM(F11:F{tot_row-1})").number_format = "₹#,##0.00"
    ws_dash.cell(row=tot_row, column=7, value=f"=F{tot_row}/E{tot_row}").number_format = "0.00%"
    for c_idx in range(2, 8):
        c = ws_dash.cell(row=tot_row, column=c_idx)
        c.font = data_bold
        c.fill = accent_fill
        c.border = total_border

    # Section 2: Regional Performance Table (Row 18)
    ws_dash["B18"].value = "Geographic Regional Distribution"
    ws_dash["B18"].font = Font(name=font_family, size=12, bold=True, color=navy_dark)

    reg_headers = ["Region", "Order Count", "Net Revenue (INR)", "Profit (INR)", "AOV (INR)"]
    for col_i, h in enumerate(reg_headers, start=2):
        cell = ws_dash.cell(row=19, column=col_i, value=h)
        cell.font = header_font
        cell.fill = header_dark_fill
        cell.alignment = Alignment(horizontal="center" if col_i not in (2,) else "left", vertical="center")
        cell.border = cell_border

    regions = ["East", "Central", "South", "North", "West"]
    for idx, reg in enumerate(regions, start=20):
        ws_dash.cell(row=idx, column=2, value=reg).font = data_bold
        ws_dash.cell(row=idx, column=3, value=f'=COUNTIFS(Sales_Transactions!D:D, "{reg}", Sales_Transactions!Q:Q, "<>Cancelled")').number_format = "#,##0"
        ws_dash.cell(row=idx, column=4, value=f'=SUMIFS(Sales_Transactions!M:M, Sales_Transactions!D:D, "{reg}", Sales_Transactions!Q:Q, "<>Cancelled")').number_format = "₹#,##0.00"
        ws_dash.cell(row=idx, column=5, value=f'=SUMIFS(Sales_Transactions!O:O, Sales_Transactions!D:D, "{reg}", Sales_Transactions!Q:Q, "<>Cancelled")').number_format = "₹#,##0.00"
        ws_dash.cell(row=idx, column=6, value=f'=D{idx}/C{idx}').number_format = "₹#,##0.00"

        for c_idx in range(2, 7):
            cell = ws_dash.cell(row=idx, column=c_idx)
            cell.font = data_font if c_idx != 2 else data_bold
            cell.border = cell_border
            if idx % 2 == 0:
                cell.fill = zebra_fill

    reg_tot_row = 20 + len(regions)
    ws_dash.cell(row=reg_tot_row, column=2, value="Grand Total").font = data_bold
    ws_dash.cell(row=reg_tot_row, column=3, value=f"=SUM(C20:C{reg_tot_row-1})").number_format = "#,##0"
    ws_dash.cell(row=reg_tot_row, column=4, value=f"=SUM(D20:D{reg_tot_row-1})").number_format = "₹#,##0.00"
    ws_dash.cell(row=reg_tot_row, column=5, value=f"=SUM(E20:E{reg_tot_row-1})").number_format = "₹#,##0.00"
    ws_dash.cell(row=reg_tot_row, column=6, value=f"=D{reg_tot_row}/C{reg_tot_row}").number_format = "₹#,##0.00"
    for c_idx in range(2, 7):
        c = ws_dash.cell(row=reg_tot_row, column=c_idx)
        c.font = data_bold
        c.fill = accent_fill
        c.border = total_border

    # Add Native Excel Bar Chart for Category Performance (columns E & F rows 10 to 15)
    chart = BarChart()
    chart.type = "col"
    chart.style = 10
    chart.title = "Net Revenue vs Profit by Merchandise Category"
    chart.y_axis.title = "INR (₹)"
    chart.x_axis.title = "Category"
    chart.width = 15
    chart.height = 10

    data_ref = Reference(ws_dash, min_col=5, min_row=10, max_col=6, max_row=15)
    cats_ref = Reference(ws_dash, min_col=2, min_row=11, max_row=15)
    chart.add_data(data_ref, titles_from_data=True)
    chart.set_categories(cats_ref)
    ws_dash.add_chart(chart, "I9")

    # Column widths for Dashboard
    dash_widths = {"A": 4, "B": 24, "C": 16, "D": 20, "E": 22, "F": 20, "G": 16, "H": 18, "I": 20, "J": 20, "K": 20}
    for col, width in dash_widths.items():
        ws_dash.column_dimensions[col].width = width

    # --------------------------------------------------------------------------
    # SHEET 2: Sales_Transactions (Raw Transaction Data)
    # --------------------------------------------------------------------------
    ws_trans = wb.create_sheet(title="Sales_Transactions")
    ws_trans.views.sheetView[0].showGridLines = True

    tx_headers = [
        "Order_ID", "Order_Date", "Customer_Name", "Region", "City", 
        "Product_Name", "Category", "Quantity", "Unit_Price_INR", "Discount_Pct",
        "Gross_Amount_INR", "Discount_Amount_INR", "Net_Amount_INR", "Total_Cost_INR", 
        "Profit_INR", "Profit_Margin_Pct", "Order_Status"
    ]

    for col_idx, h in enumerate(tx_headers, start=1):
        cell = ws_trans.cell(row=1, column=col_idx, value=h)
        cell.font = header_font
        cell.fill = PatternFill(start_color=navy_dark, end_color=navy_dark, fill_type="solid")
        cell.alignment = Alignment(horizontal="center", vertical="center")
        cell.border = cell_border

    for row_idx, r in enumerate(rows_data, start=2):
        ws_trans.cell(row=row_idx, column=1, value=int(r["order_id"])).alignment = Alignment(horizontal="center")
        ws_trans.cell(row=row_idx, column=2, value=r["order_date"]).alignment = Alignment(horizontal="center")
        ws_trans.cell(row=row_idx, column=3, value=r["customer_name"])
        ws_trans.cell(row=row_idx, column=4, value=r["region"]).alignment = Alignment(horizontal="center")
        ws_trans.cell(row=row_idx, column=5, value=r["city"])
        ws_trans.cell(row=row_idx, column=6, value=r["product_name"])
        ws_trans.cell(row=row_idx, column=7, value=r["category"]).alignment = Alignment(horizontal="center")
        
        q_cell = ws_trans.cell(row=row_idx, column=8, value=int(r["quantity"]))
        q_cell.number_format = "#,##0"
        q_cell.alignment = Alignment(horizontal="right")

        up_cell = ws_trans.cell(row=row_idx, column=9, value=float(r["unit_price"]))
        up_cell.number_format = "₹#,##0.00"

        disc_cell = ws_trans.cell(row=row_idx, column=10, value=float(r["discount_percent"]) / 100.0)
        disc_cell.number_format = "0.0%"

        gross_cell = ws_trans.cell(row=row_idx, column=11, value=f"=H{row_idx}*I{row_idx}")
        gross_cell.number_format = "₹#,##0.00"

        disc_amt_cell = ws_trans.cell(row=row_idx, column=12, value=f"=K{row_idx}*J{row_idx}")
        disc_amt_cell.number_format = "₹#,##0.00"

        net_cell = ws_trans.cell(row=row_idx, column=13, value=f"=K{row_idx}-L{row_idx}")
        net_cell.number_format = "₹#,##0.00"

        cost_cell = ws_trans.cell(row=row_idx, column=14, value=float(r["total_cost"]))
        cost_cell.number_format = "₹#,##0.00"

        prof_cell = ws_trans.cell(row=row_idx, column=15, value=f"=M{row_idx}-N{row_idx}")
        prof_cell.number_format = "₹#,##0.00"

        margin_cell = ws_trans.cell(row=row_idx, column=16, value=f"=IFERROR(O{row_idx}/M{row_idx}, 0)")
        margin_cell.number_format = "0.00%"

        status_cell = ws_trans.cell(row=row_idx, column=17, value=r["order_status"])
        status_cell.alignment = Alignment(horizontal="center")

        for c_idx in range(1, 18):
            c = ws_trans.cell(row=row_idx, column=c_idx)
            c.font = data_font
            c.border = cell_border
            if row_idx % 2 == 1:
                c.fill = zebra_fill

    ws_trans.auto_filter.ref = f"A1:Q{len(rows_data)+1}"
    ws_trans.freeze_panes = "A2"

    for col in ws_trans.columns:
        col_letter = get_column_letter(col[0].column)
        max_len = max(len(str(cell.value or '')) for cell in col[:15])
        ws_trans.column_dimensions[col_letter].width = max(max_len + 4, 12)

    # --------------------------------------------------------------------------
    # SHEET 3: Advanced_Formulas_Lab
    # --------------------------------------------------------------------------
    ws_form = wb.create_sheet(title="Advanced_Formulas_Lab")
    ws_form.views.sheetView[0].showGridLines = True

    # Title
    ws_form.merge_cells("A1:G2")
    f_title = ws_form["A1"]
    f_title.value = "   EXCEL PRACTICAL: ADVANCED LOGICAL & AGGREGATE FORMULAS"
    f_title.font = title_font
    f_title.fill = title_fill
    f_title.alignment = Alignment(vertical="center")

    form_headers = ["Formula Type", "Function Syntax", "Target Data Column", "Business Purpose & Logic", "Live Formula Output"]
    for col_i, h in enumerate(form_headers, start=1):
        cell = ws_form.cell(row=4, column=col_i, value=h)
        cell.font = header_font
        cell.fill = header_fill
        cell.alignment = Alignment(horizontal="center" if col_i in (1, 5) else "left", vertical="center")
        cell.border = cell_border

    formula_rows = [
        ("IF", '=IF(Sales_Transactions!M2>=5000, "High Value", "Standard")', "Net_Amount_INR (Col M)", 
         "Binary threshold check: tags transaction as 'High Value' if amount >= ₹5,000.",
         '=IF(Sales_Transactions!M2>=5000, "High Value", "Standard")'),
        
        ("Nested IF", '=IF(Sales_Transactions!M2>=25000, "Tier 1", IF(Sales_Transactions!M2>=10000, "Tier 2", IF(Sales_Transactions!M2>=3000, "Tier 3", "Tier 4")))', 
         "Net_Amount_INR (Col M)",
         "Hierarchical spend tiering: Tier 1 (>=₹25K), Tier 2 (>=₹10K), Tier 3 (>=₹3K), Tier 4 (<₹3K).",
         '=IF(Sales_Transactions!M2>=25000, "Tier 1", IF(Sales_Transactions!M2>=10000, "Tier 2", IF(Sales_Transactions!M2>=3000, "Tier 3", "Tier 4")))'),

        ("AND", '=IF(AND(Sales_Transactions!M2>=5000, Sales_Transactions!Q2="Delivered"), "Qualifies For Loyalty Bonus", "No Bonus")',
         "Net Amount & Order Status",
         "Conjunctive test: requires order to be high-value (>=₹5,000) AND successfully Delivered.",
         '=IF(AND(Sales_Transactions!M2>=5000, Sales_Transactions!Q2="Delivered"), "Qualifies For Loyalty Bonus", "No Bonus")'),

        ("OR", '=IF(OR(Sales_Transactions!D2="North", Sales_Transactions!D2="South"), "Priority Delivery Zone", "Standard Zone")',
         "Region (Col D)",
         "Disjunctive test: tags transaction if order destination is either North OR South region.",
         '=IF(OR(Sales_Transactions!D2="North", Sales_Transactions!D2="South"), "Priority Delivery Zone", "Standard Zone")'),

        ("NOT", '=IF(NOT(Sales_Transactions!Q2="Cancelled"), "Valid Sale", "Excluded")',
         "Order_Status (Col Q)",
         "Logical negation: isolates active/valid revenue transactions by excluding Cancelled orders.",
         '=IF(NOT(Sales_Transactions!Q2="Cancelled"), "Valid Sale", "Excluded")'),

        ("IFERROR", '=IFERROR(Sales_Transactions!O2/Sales_Transactions!M2, 0)',
         "Profit / Net Amount",
         "Fault-tolerance error handler: prevents #DIV/0! or #VALUE! runtime crashes on division.",
         '=IFERROR(Sales_Transactions!O2/Sales_Transactions!M2, 0)'),

        ("SUMIF", '=SUMIF(Sales_Transactions!G:G, "Electronics", Sales_Transactions!M:M)',
         "Category (G) & Net Amount (M)",
         "Conditional summation: totals realized net revenue specifically for the Electronics department.",
         '=SUMIF(Sales_Transactions!G:G, "Electronics", Sales_Transactions!M:M)'),

        ("AVERAGEIF", '=AVERAGEIF(Sales_Transactions!G:G, "Fashion", Sales_Transactions!M:M)',
         "Category (G) & Net Amount (M)",
         "Conditional average: computes arithmetic mean ticket price for the Fashion department.",
         '=AVERAGEIF(Sales_Transactions!G:G, "Fashion", Sales_Transactions!M:M)'),

        ("COUNTIF", '=COUNTIF(Sales_Transactions!Q:Q, "Delivered")',
         "Order_Status (Col Q)",
         "Conditional frequency: counts the exact count of fully fulfilled 'Delivered' orders.",
         '=COUNTIF(Sales_Transactions!Q:Q, "Delivered")')
    ]

    for idx, (ftype, syntax, target, desc, live_formula) in enumerate(formula_rows, start=5):
        c1 = ws_form.cell(row=idx, column=1, value=ftype)
        c1.font = data_bold
        c1.alignment = Alignment(horizontal="center")

        c2 = ws_form.cell(row=idx, column=2, value=syntax)
        c2.font = formula_font

        c3 = ws_form.cell(row=idx, column=3, value=target)
        c3.font = data_font

        c4 = ws_form.cell(row=idx, column=4, value=desc)
        c4.font = data_font

        c5 = ws_form.cell(row=idx, column=5, value=live_formula)
        c5.font = data_bold
        c5.alignment = Alignment(horizontal="center")
        if ftype in ("SUMIF", "AVERAGEIF"):
            c5.number_format = "₹#,##0.00"
        elif ftype == "COUNTIF":
            c5.number_format = "#,##0"
        elif ftype == "IFERROR":
            c5.number_format = "0.00%"

        for c_i in range(1, 6):
            cell = ws_form.cell(row=idx, column=c_i)
            cell.border = cell_border
            if idx % 2 == 1:
                cell.fill = zebra_fill

    # Row 16: Live Evaluation Matrix across First 15 Transactions
    ws_form["A16"].value = "Live Formula Evaluation Grid (Applied Row-by-Row on First 15 Orders)"
    ws_form["A16"].font = Font(name=font_family, size=12, bold=True, color=navy_dark)

    grid_headers = ["Row", "Order ID", "Customer", "Net Amount", "Status", "IF Test", "Nested IF Tier", "AND Bonus", "OR Zone", "NOT Audit", "Margin (IFERROR)"]
    for col_i, h in enumerate(grid_headers, start=1):
        cell = ws_form.cell(row=17, column=col_i, value=h)
        cell.font = header_font
        cell.fill = header_dark_fill
        cell.alignment = Alignment(horizontal="center", vertical="center")
        cell.border = cell_border

    for i in range(15):
        row_num = 18 + i
        source_row = 2 + i

        ws_form.cell(row=row_num, column=1, value=i+1).alignment = Alignment(horizontal="center")
        ws_form.cell(row=row_num, column=2, value=f"=Sales_Transactions!A{source_row}").alignment = Alignment(horizontal="center")
        ws_form.cell(row=row_num, column=3, value=f"=Sales_Transactions!C{source_row}")
        
        na_c = ws_form.cell(row=row_num, column=4, value=f"=Sales_Transactions!M{source_row}")
        na_c.number_format = "₹#,##0.00"

        ws_form.cell(row=row_num, column=5, value=f"=Sales_Transactions!Q{source_row}").alignment = Alignment(horizontal="center")
        
        ws_form.cell(row=row_num, column=6, value=f'=IF(Sales_Transactions!M{source_row}>=5000, "High Value", "Standard")').alignment = Alignment(horizontal="center")
        ws_form.cell(row=row_num, column=7, value=f'=IF(Sales_Transactions!M{source_row}>=25000, "Tier 1", IF(Sales_Transactions!M{source_row}>=10000, "Tier 2", IF(Sales_Transactions!M{source_row}>=3000, "Tier 3", "Tier 4")))').alignment = Alignment(horizontal="center")
        ws_form.cell(row=row_num, column=8, value=f'=IF(AND(Sales_Transactions!M{source_row}>=5000, Sales_Transactions!Q{source_row}="Delivered"), "Bonus", "No")').alignment = Alignment(horizontal="center")
        ws_form.cell(row=row_num, column=9, value=f'=IF(OR(Sales_Transactions!D{source_row}="North", Sales_Transactions!D{source_row}="South"), "Priority", "Standard")').alignment = Alignment(horizontal="center")
        ws_form.cell(row=row_num, column=10, value=f'=IF(NOT(Sales_Transactions!Q{source_row}="Cancelled"), "Valid", "Excluded")').alignment = Alignment(horizontal="center")
        
        m_c = ws_form.cell(row=row_num, column=11, value=f'=IFERROR(Sales_Transactions!O{source_row}/Sales_Transactions!M{source_row}, 0)')
        m_c.number_format = "0.00%"
        m_c.alignment = Alignment(horizontal="right")

        for c_i in range(1, 12):
            cell = ws_form.cell(row=row_num, column=c_i)
            cell.font = data_font
            cell.border = cell_border
            if row_num % 2 == 1:
                cell.fill = zebra_fill

    form_widths = {"A": 16, "B": 48, "C": 26, "D": 45, "E": 28, "F": 16, "G": 18, "H": 16, "I": 16, "J": 16, "K": 18}
    for col, width in form_widths.items():
        ws_form.column_dimensions[col].width = width

    # --------------------------------------------------------------------------
    # SHEET 4: Pivot_Summary_Matrix
    # --------------------------------------------------------------------------
    ws_piv = wb.create_sheet(title="Pivot_Summary_Matrix")
    ws_piv.views.sheetView[0].showGridLines = True

    # Title
    ws_piv.merge_cells("A1:G2")
    p_title = ws_piv["A1"]
    p_title.value = "   EXCEL PIVOT TABLE CROSS-TABULATION MATRIX (CATEGORY X REGION)"
    p_title.font = title_font
    p_title.fill = title_fill
    p_title.alignment = Alignment(vertical="center")

    ws_piv["A3"].value = "Table 1: Net Revenue Cross-Tabulation Matrix (INR)"
    ws_piv["A3"].font = Font(name=font_family, size=11, bold=True, color=navy_dark)

    pivot_headers = ["Category", "Central", "East", "North", "South", "West", "Total Revenue"]
    for col_i, h in enumerate(pivot_headers, start=1):
        cell = ws_piv.cell(row=4, column=col_i, value=h)
        cell.font = header_font
        cell.fill = header_fill
        cell.alignment = Alignment(horizontal="center" if col_i > 1 else "left", vertical="center")
        cell.border = cell_border

    regions_list = ["Central", "East", "North", "South", "West"]
    categories_list = ["Electronics", "Fashion", "Groceries", "Home & Living", "Sports"]

    for r_idx, cat in enumerate(categories_list, start=5):
        ws_piv.cell(row=r_idx, column=1, value=cat).font = data_bold
        for c_idx, reg in enumerate(regions_list, start=2):
            cell = ws_piv.cell(row=r_idx, column=c_idx, 
                value=f'=SUMIFS(Sales_Transactions!M:M, Sales_Transactions!G:G, "{cat}", Sales_Transactions!D:D, "{reg}", Sales_Transactions!Q:Q, "<>Cancelled")')
            cell.number_format = "₹#,##0.00"
            cell.font = data_font
            cell.border = cell_border
            if r_idx % 2 == 1:
                cell.fill = zebra_fill

        tot_cell = ws_piv.cell(row=r_idx, column=7, value=f"=SUM(B{r_idx}:F{r_idx})")
        tot_cell.number_format = "₹#,##0.00"
        tot_cell.font = data_bold
        tot_cell.fill = accent_fill
        tot_cell.border = cell_border

    # Bottom Total Row
    b_tot_row = 5 + len(categories_list)
    ws_piv.cell(row=b_tot_row, column=1, value="Grand Total").font = data_bold
    for c_idx in range(2, 7):
        col_letter = get_column_letter(c_idx)
        cell = ws_piv.cell(row=b_tot_row, column=c_idx, value=f"=SUM({col_letter}5:{col_letter}{b_tot_row-1})")
        cell.number_format = "₹#,##0.00"
        cell.font = data_bold
        cell.fill = accent_fill
        cell.border = total_border

    grand_tot_cell = ws_piv.cell(row=b_tot_row, column=7, value=f"=SUM(G5:G{b_tot_row-1})")
    grand_tot_cell.number_format = "₹#,##0.00"
    grand_tot_cell.font = data_bold
    grand_tot_cell.fill = PatternFill(start_color="BBF7D0", end_color="BBF7D0", fill_type="solid")
    grand_tot_cell.border = total_border

    # Table 2: Gross Profit Cross-Tabulation Matrix
    ws_piv["A13"].value = "Table 2: Gross Profit Cross-Tabulation Matrix (INR)"
    ws_piv["A13"].font = Font(name=font_family, size=11, bold=True, color=navy_dark)

    profit_headers = ["Category", "Central", "East", "North", "South", "West", "Total Profit"]
    for col_i, h in enumerate(profit_headers, start=1):
        cell = ws_piv.cell(row=14, column=col_i, value=h)
        cell.font = header_font
        cell.fill = header_dark_fill
        cell.alignment = Alignment(horizontal="center" if col_i > 1 else "left", vertical="center")
        cell.border = cell_border

    for r_idx, cat in enumerate(categories_list, start=15):
        ws_piv.cell(row=r_idx, column=1, value=cat).font = data_bold
        for c_idx, reg in enumerate(regions_list, start=2):
            cell = ws_piv.cell(row=r_idx, column=c_idx, 
                value=f'=SUMIFS(Sales_Transactions!O:O, Sales_Transactions!G:G, "{cat}", Sales_Transactions!D:D, "{reg}", Sales_Transactions!Q:Q, "<>Cancelled")')
            cell.number_format = "₹#,##0.00"
            cell.font = data_font
            cell.border = cell_border
            if r_idx % 2 == 1:
                cell.fill = zebra_fill

        tot_cell = ws_piv.cell(row=r_idx, column=7, value=f"=SUM(B{r_idx}:F{r_idx})")
        tot_cell.number_format = "₹#,##0.00"
        tot_cell.font = data_bold
        tot_cell.fill = accent_fill
        tot_cell.border = cell_border

    p_tot_row = 15 + len(categories_list)
    ws_piv.cell(row=p_tot_row, column=1, value="Grand Total").font = data_bold
    for c_idx in range(2, 7):
        col_letter = get_column_letter(c_idx)
        cell = ws_piv.cell(row=p_tot_row, column=c_idx, value=f"=SUM({col_letter}15:{col_letter}{p_tot_row-1})")
        cell.number_format = "₹#,##0.00"
        cell.font = data_bold
        cell.fill = accent_fill
        cell.border = total_border

    grand_p_tot_cell = ws_piv.cell(row=p_tot_row, column=7, value=f"=SUM(G15:G{p_tot_row-1})")
    grand_p_tot_cell.number_format = "₹#,##0.00"
    grand_p_tot_cell.font = data_bold
    grand_p_tot_cell.fill = PatternFill(start_color="BBF7D0", end_color="BBF7D0", fill_type="solid")
    grand_p_tot_cell.border = total_border

    piv_widths = {"A": 20, "B": 18, "C": 18, "D": 18, "E": 18, "F": 18, "G": 20}
    for col, width in piv_widths.items():
        ws_piv.column_dimensions[col].width = width

    # --------------------------------------------------------------------------
    # SHEET 5: Customer_Lifetime_Value
    # --------------------------------------------------------------------------
    ws_cust = wb.create_sheet(title="Customer_Lifetime_Value")
    ws_cust.views.sheetView[0].showGridLines = True

    # Title
    ws_cust.merge_cells("A1:H2")
    c_title = ws_cust["A1"]
    c_title.value = "   CUSTOMER LIFETIME VALUE (CLV) & SEGMENTATION DIRECTORY"
    c_title.font = title_font
    c_title.fill = title_fill
    c_title.alignment = Alignment(vertical="center")

    cust_headers = ["Customer ID", "Customer Name", "City", "Region", "Total Orders", "Lifetime Spend (INR)", "Last Order Date", "Loyalty Tier"]
    for col_i, h in enumerate(cust_headers, start=1):
        cell = ws_cust.cell(row=4, column=col_i, value=h)
        cell.font = header_font
        cell.fill = header_fill
        cell.alignment = Alignment(horizontal="center" if col_i in (1, 4, 5, 7, 8) else "left", vertical="center")
        cell.border = cell_border

    # Load customers from MySQL CSV or summary
    cust_csv_path = "../Business_Analytics/backend/exports/customers.csv"
    if os.path.exists(cust_csv_path):
        with open(cust_csv_path, mode="r", encoding="utf-8") as f:
            c_reader = csv.DictReader(f)
            for idx, c in enumerate(c_reader, start=5):
                cid = int(c["customer_id"])
                cname = c["customer_name"]
                ccity = c["city"]
                cregion = c["region"]

                ws_cust.cell(row=idx, column=1, value=cid).alignment = Alignment(horizontal="center")
                ws_cust.cell(row=idx, column=2, value=cname)
                ws_cust.cell(row=idx, column=3, value=ccity)
                ws_cust.cell(row=idx, column=4, value=cregion).alignment = Alignment(horizontal="center")

                # Formulas linking to Sales_Transactions
                ws_cust.cell(row=idx, column=5, value=f'=COUNTIFS(Sales_Transactions!C:C, "{cname}", Sales_Transactions!Q:Q, "<>Cancelled")').number_format = "#,##0"
                
                spend_c = ws_cust.cell(row=idx, column=6, value=f'=SUMIFS(Sales_Transactions!M:M, Sales_Transactions!C:C, "{cname}", Sales_Transactions!Q:Q, "<>Cancelled")')
                spend_c.number_format = "₹#,##0.00"

                ws_cust.cell(row=idx, column=7, value=f'=IF(E{idx}=0, "Never Purchased", "Active Customer")').alignment = Alignment(horizontal="center")

                tier_c = ws_cust.cell(row=idx, column=8, value=f'=IF(E{idx}=0, "Inactive", IF(F{idx}>=50000, "Platinum", IF(F{idx}>=20000, "Gold", IF(F{idx}>=5000, "Silver", "Bronze"))))')
                tier_c.alignment = Alignment(horizontal="center")
                tier_c.font = data_bold

                for c_i in range(1, 9):
                    cell = ws_cust.cell(row=idx, column=c_i)
                    cell.border = cell_border
                    if idx % 2 == 1:
                        cell.fill = zebra_fill

    cust_widths = {"A": 14, "B": 24, "C": 18, "D": 16, "E": 14, "F": 22, "G": 18, "H": 18}
    for col, width in cust_widths.items():
        ws_cust.column_dimensions[col].width = width

    # Remove default initial sheet
    wb.remove(default_sheet)

    # Save workbook
    out_dir = "02_Excel"
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, "retail_sales_analytics.xlsx")
    wb.save(out_path)
    print(f"Successfully generated {out_path} ({os.path.getsize(out_path)} bytes)")

if __name__ == "__main__":
    create_workbook()
