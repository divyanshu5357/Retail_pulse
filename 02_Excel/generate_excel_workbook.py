#!/usr/bin/env python3
"""
Generate hospital_clinical_analytics.xlsx
Comprehensive, professionally styled Excel workbook for Healthcare & Hospital Operations:
1. Executive_Clinical_Dashboard (KPI scorecards, Department occupancy/billing tables, and native bar chart)
2. Patient_Encounters (530 formatted clinical billing records with proper currency/date formats)
3. Advanced_Formulas_Lab (Live evaluations of IF, Nested IF, AND, OR, NOT, IFERROR, SUMIF, AVERAGEIF, COUNTIF)
4. Pivot_Summary_Matrix (5x3 Department x Triage cross-tabulation table with SUMIFS formulas)
5. Patient_Registry (110 patient directory with clinical encounter tiers)
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
    default_sheet = wb.active

    # Dark / Clinical Slate Palette
    navy_dark = "0B132B"       # Deep Obsidian
    navy_blue = "1C2541"       # Slate Blue
    cyan_primary = "0891B2"    # Cyan 600
    cyan_light = "CFFAFE"      # Cyan 100
    blue_accent = "2563EB"     # Blue 600
    emerald_accent = "059669"  # Emerald 600
    gray_header = "1E293B"     # Slate 800
    gray_zebra = "F8FAFC"      # Slate 50
    gray_border = "CBD5E1"     # Slate 300
    white = "FFFFFF"

    font_family = "Calibri"

    title_font = Font(name=font_family, size=16, bold=True, color=white)
    subtitle_font = Font(name=font_family, size=11, italic=True, color="E2E8F0")
    header_font = Font(name=font_family, size=11, bold=True, color=white)
    kpi_title_font = Font(name=font_family, size=10, bold=True, color="475569")
    kpi_value_font = Font(name=font_family, size=18, bold=True, color=navy_dark)
    data_font = Font(name=font_family, size=10, color="0F172A")
    data_bold = Font(name=font_family, size=10, bold=True, color="0F172A")
    formula_font = Font(name="Consolas", size=9.5, color="0369A1")

    title_fill = PatternFill(start_color=navy_dark, end_color=navy_dark, fill_type="solid")
    header_fill = PatternFill(start_color=cyan_primary, end_color=cyan_primary, fill_type="solid")
    header_dark_fill = PatternFill(start_color=gray_header, end_color=gray_header, fill_type="solid")
    kpi_bg_fill = PatternFill(start_color="F0FDFA", end_color="F0FDFA", fill_type="solid")
    zebra_fill = PatternFill(start_color=gray_zebra, end_color=gray_zebra, fill_type="solid")
    accent_fill = PatternFill(start_color=cyan_light, end_color=cyan_light, fill_type="solid")

    thin_border_side = Side(style="thin", color=gray_border)
    double_bottom_side = Side(style="double", color=navy_dark)

    cell_border = Border(left=thin_border_side, right=thin_border_side, top=thin_border_side, bottom=thin_border_side)
    total_border = Border(top=thin_border_side, bottom=double_bottom_side, left=thin_border_side, right=thin_border_side)
    kpi_border = Border(left=thin_border_side, right=thin_border_side, top=thin_border_side, bottom=thin_border_side)

    # 1. Load CSV data
    csv_path = "03_Tableau/hospital_clinical_master.csv"
    rows_data = []
    with open(csv_path, mode="r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for r in reader:
            rows_data.append(r)

    # --------------------------------------------------------------------------
    # SHEET 1: Executive_Clinical_Dashboard
    # --------------------------------------------------------------------------
    ws_dash = wb.create_sheet(title="Executive_Clinical_Dashboard")
    ws_dash.views.sheetView[0].showGridLines = True

    # Title Banner
    ws_dash.merge_cells("A1:K2")
    title_cell = ws_dash["A1"]
    title_cell.value = "   PULSECARE HOSPITAL OPERATIONS & CLINICAL EXECUTIVE DASHBOARD"
    title_cell.font = title_font
    title_cell.fill = title_fill
    title_cell.alignment = Alignment(vertical="center")

    ws_dash.merge_cells("A3:K3")
    sub_cell = ws_dash["A3"]
    sub_cell.value = f"   Dataset: 530 Encounters | 280 Admissions | 110 Registered Patients | 6 Clinical Wings | Generated: {datetime.now().strftime('%Y-%m-%d')}"
    sub_cell.font = subtitle_font
    sub_cell.fill = PatternFill(start_color=navy_blue, end_color=navy_blue, fill_type="solid")
    sub_cell.alignment = Alignment(vertical="center")

    # KPI Cards (Row 5 to 7)
    kpis = [
        ("TOTAL INPATIENT BILLING", "=SUM(Patient_Encounters!L2:L531)", "₹#,##0.00", "B5:C7"),
        ("INSURANCE CLAIMED", "=SUM(Patient_Encounters!M2:M531)", "₹#,##0.00", "D5:E7"),
        ("INSURANCE RATIO", "=D6/B6", "0.00%", "F5:G7"),
        ("TOTAL ADMISSIONS", "=MAX(Patient_Encounters!B2:B531)", "#,##0", "H5:I7"),
        ("AVG LENGTH OF STAY (ALOS)", "=AVERAGE(Patient_Encounters!D2:D531)", "0.0 Days", "J5:K7")
    ]

    for title, formula, num_fmt, merge_range in kpis:
        c1, c2 = merge_range.split(":")
        start_col, start_row = c1[0], int(c1[1])
        end_col, end_row = c2[0], int(c2[1])

        for col_idx in range(openpyxl.utils.column_index_from_string(start_col), openpyxl.utils.column_index_from_string(end_col) + 1):
            for row_idx in range(start_row, end_row + 1):
                cell = ws_dash.cell(row=row_idx, column=col_idx)
                cell.fill = kpi_bg_fill
                cell.border = kpi_border

        ws_dash.merge_cells(f"{start_col}{start_row}:{end_col}{start_row}")
        t_cell = ws_dash[f"{start_col}{start_row}"]
        t_cell.value = title
        t_cell.font = kpi_title_font
        t_cell.alignment = Alignment(horizontal="center", vertical="center")

        ws_dash.merge_cells(f"{start_col}{start_row+1}:{end_col}{end_row}")
        v_cell = ws_dash[f"{start_col}{start_row+1}"]
        v_cell.value = formula
        v_cell.font = kpi_value_font
        v_cell.alignment = Alignment(horizontal="center", vertical="center")
        v_cell.number_format = num_fmt

    # Section 1: Department Clinical Breakdown (Row 9)
    ws_dash["B9"].value = "Clinical Department Utilization & Revenue Breakdown"
    ws_dash["B9"].font = Font(name=font_family, size=12, bold=True, color=navy_dark)

    dept_headers = ["Department", "Encounters Count", "Avg Stay (Days)", "Gross Billing (INR)", "Net Billing (INR)", "Insurance Settled (INR)"]
    for col_i, h in enumerate(dept_headers, start=2):
        cell = ws_dash.cell(row=10, column=col_i, value=h)
        cell.font = header_font
        cell.fill = header_fill
        cell.alignment = Alignment(horizontal="center" if col_i not in (2,) else "left", vertical="center")
        cell.border = cell_border

    departments_list = ["Cardiology", "Neurology", "Orthopedics", "Oncology", "Pediatrics", "Emergency"]
    for idx, dname in enumerate(departments_list, start=11):
        ws_dash.cell(row=idx, column=2, value=dname).font = data_bold
        ws_dash.cell(row=idx, column=3, value=f'=COUNTIF(Patient_Encounters!H:H, "{dname}")').number_format = "#,##0"
        ws_dash.cell(row=idx, column=4, value=f'=AVERAGEIF(Patient_Encounters!H:H, "{dname}", Patient_Encounters!D:D)').number_format = "0.0"
        ws_dash.cell(row=idx, column=5, value=f'=SUMIF(Patient_Encounters!H:H, "{dname}", Patient_Encounters!K:K)').number_format = "₹#,##0.00"
        ws_dash.cell(row=idx, column=6, value=f'=SUMIF(Patient_Encounters!H:H, "{dname}", Patient_Encounters!L:L)').number_format = "₹#,##0.00"
        ws_dash.cell(row=idx, column=7, value=f'=SUMIF(Patient_Encounters!H:H, "{dname}", Patient_Encounters!M:M)').number_format = "₹#,##0.00"

        for c_idx in range(2, 8):
            cell = ws_dash.cell(row=idx, column=c_idx)
            cell.font = data_font if c_idx != 2 else data_bold
            cell.border = cell_border
            if idx % 2 == 0:
                cell.fill = zebra_fill

    tot_row = 11 + len(departments_list)
    ws_dash.cell(row=tot_row, column=2, value="Hospital Total").font = data_bold
    ws_dash.cell(row=tot_row, column=3, value=f"=SUM(C11:C{tot_row-1})").number_format = "#,##0"
    ws_dash.cell(row=tot_row, column=4, value=f"=AVERAGE(D11:D{tot_row-1})").number_format = "0.0"
    ws_dash.cell(row=tot_row, column=5, value=f"=SUM(E11:E{tot_row-1})").number_format = "₹#,##0.00"
    ws_dash.cell(row=tot_row, column=6, value=f"=SUM(F11:F{tot_row-1})").number_format = "₹#,##0.00"
    ws_dash.cell(row=tot_row, column=7, value=f"=SUM(G11:G{tot_row-1})").number_format = "₹#,##0.00"
    for c_idx in range(2, 8):
        c = ws_dash.cell(row=tot_row, column=c_idx)
        c.font = data_bold
        c.fill = accent_fill
        c.border = total_border

    # Native Excel Column Chart
    chart = BarChart()
    chart.type = "col"
    chart.style = 10
    chart.title = "Net Clinical Billing by Department"
    chart.y_axis.title = "INR (₹)"
    chart.x_axis.title = "Department"
    chart.width = 15
    chart.height = 10

    data_ref = Reference(ws_dash, min_col=6, min_row=10, max_col=6, max_row=16)
    cats_ref = Reference(ws_dash, min_col=2, min_row=11, max_row=16)
    chart.add_data(data_ref, titles_from_data=True)
    chart.set_categories(cats_ref)
    ws_dash.add_chart(chart, "I9")

    dash_widths = {"A": 4, "B": 24, "C": 18, "D": 18, "E": 22, "F": 22, "G": 22, "H": 18, "I": 20, "J": 20, "K": 20}
    for col, width in dash_widths.items():
        ws_dash.column_dimensions[col].width = width

    # --------------------------------------------------------------------------
    # SHEET 2: Patient_Encounters
    # --------------------------------------------------------------------------
    ws_enc = wb.create_sheet(title="Patient_Encounters")
    ws_enc.views.sheetView[0].showGridLines = True

    enc_headers = [
        "Billing_ID", "Admission_ID", "Admission_Date", "Length_of_Stay", "Admission_Status",
        "Triage_Level", "Patient_Name", "Department", "Procedure_Name", "Procedure_Cost",
        "Gross_Amount", "Net_Amount", "Insurance_Covered", "Patient_Payable"
    ]

    for col_idx, h in enumerate(enc_headers, start=1):
        cell = ws_enc.cell(row=1, column=col_idx, value=h)
        cell.font = header_font
        cell.fill = PatternFill(start_color=navy_dark, end_color=navy_dark, fill_type="solid")
        cell.alignment = Alignment(horizontal="center", vertical="center")
        cell.border = cell_border

    for row_idx, r in enumerate(rows_data, start=2):
        ws_enc.cell(row=row_idx, column=1, value=int(r["billing_id"])).alignment = Alignment(horizontal="center")
        ws_enc.cell(row=row_idx, column=2, value=int(r["admission_id"])).alignment = Alignment(horizontal="center")
        ws_enc.cell(row=row_idx, column=3, value=r["admission_date"]).alignment = Alignment(horizontal="center")
        ws_enc.cell(row=row_idx, column=4, value=int(r["length_of_stay"])).alignment = Alignment(horizontal="right")
        ws_enc.cell(row=row_idx, column=5, value=r["admission_status"]).alignment = Alignment(horizontal="center")
        ws_enc.cell(row=row_idx, column=6, value=r["triage_level"]).alignment = Alignment(horizontal="center")
        ws_enc.cell(row=row_idx, column=7, value=r["patient_name"])
        ws_enc.cell(row=row_idx, column=8, value=r["department_name"]).alignment = Alignment(horizontal="center")
        ws_enc.cell(row=row_idx, column=9, value=r["procedure_name"])

        p_cost = ws_enc.cell(row=row_idx, column=10, value=float(r["procedure_cost"]))
        p_cost.number_format = "₹#,##0.00"

        gross = ws_enc.cell(row=row_idx, column=11, value=float(r["gross_amount"]))
        gross.number_format = "₹#,##0.00"

        net = ws_enc.cell(row=row_idx, column=12, value=float(r["net_amount"]))
        net.number_format = "₹#,##0.00"

        ins = ws_enc.cell(row=row_idx, column=13, value=float(r["insurance_covered"]))
        ins.number_format = "₹#,##0.00"

        pay = ws_enc.cell(row=row_idx, column=14, value=float(r["patient_payable"]))
        pay.number_format = "₹#,##0.00"

        for c_idx in range(1, 15):
            c = ws_enc.cell(row=row_idx, column=c_idx)
            c.font = data_font
            c.border = cell_border
            if row_idx % 2 == 1:
                c.fill = zebra_fill

    ws_enc.auto_filter.ref = f"A1:N{len(rows_data)+1}"
    ws_enc.freeze_panes = "A2"

    for col in ws_enc.columns:
        col_letter = get_column_letter(col[0].column)
        max_len = max(len(str(cell.value or '')) for cell in col[:15])
        ws_enc.column_dimensions[col_letter].width = max(max_len + 4, 12)

    # --------------------------------------------------------------------------
    # SHEET 3: Advanced_Formulas_Lab
    # --------------------------------------------------------------------------
    ws_form = wb.create_sheet(title="Advanced_Formulas_Lab")
    ws_form.views.sheetView[0].showGridLines = True

    ws_form.merge_cells("A1:G2")
    f_title = ws_form["A1"]
    f_title.value = "   EXCEL CLINICAL ANALYTICS: ADVANCED LOGICAL & AGGREGATE FORMULAS"
    f_title.font = title_font
    f_title.fill = title_fill
    f_title.alignment = Alignment(vertical="center")

    form_headers = ["Formula Type", "Function Syntax", "Target Clinical Field", "Healthcare Business Logic", "Live Formula Output"]
    for col_i, h in enumerate(form_headers, start=1):
        cell = ws_form.cell(row=4, column=col_i, value=h)
        cell.font = header_font
        cell.fill = header_fill
        cell.alignment = Alignment(horizontal="center" if col_i in (1, 5) else "left", vertical="center")
        cell.border = cell_border

    formula_rows = [
        ("IF", '=IF(Patient_Encounters!L2>=80000, "High-Cost Encounter", "Standard Inpatient")', "Net_Amount (Col L)", 
         "Binary threshold check: flags treatment as High-Cost if billing >= ₹80,000.",
         '=IF(Patient_Encounters!L2>=80000, "High-Cost Encounter", "Standard Inpatient")'),
        
        ("Nested IF", '=IF(Patient_Encounters!D2>=10, "Extended ICU", IF(Patient_Encounters!D2>=5, "Moderate Stay", IF(Patient_Encounters!D2>=2, "Standard Inpatient", "Daycare")))', 
         "Length_of_Stay (Col D)",
         "Hierarchical stay grading: Extended ICU (>=10d), Moderate (>=5d), Standard (>=2d), Daycare (<2d).",
         '=IF(Patient_Encounters!D2>=10, "Extended ICU", IF(Patient_Encounters!D2>=5, "Moderate Stay", IF(Patient_Encounters!D2>=2, "Standard Inpatient", "Daycare")))'),

        ("AND", '=IF(AND(Patient_Encounters!D2>=7, Patient_Encounters!E2="Critical Care"), "ICU Escalation Required", "Standard Protocol")',
         "Length of Stay & Status",
         "Conjunctive test: requires stay >= 7 days AND clinical status 'Critical Care'.",
         '=IF(AND(Patient_Encounters!D2>=7, Patient_Encounters!E2="Critical Care"), "ICU Escalation Required", "Standard Protocol")'),

        ("OR", '=IF(OR(Patient_Encounters!H2="Cardiology", Patient_Encounters!H2="Neurology"), "Priority Wing", "General Wing")',
         "Department (Col H)",
         "Disjunctive test: tags patient if in critical department (Cardiology OR Neurology).",
         '=IF(OR(Patient_Encounters!H2="Cardiology", Patient_Encounters!H2="Neurology"), "Priority Wing", "General Wing")'),

        ("NOT", '=IF(NOT(Patient_Encounters!E2="Discharged"), "Active Inpatient", "Closed Record")',
         "Admission_Status (Col E)",
         "Logical negation: isolates active admitted patients by excluding completed Discharged cases.",
         '=IF(NOT(Patient_Encounters!E2="Discharged"), "Active Inpatient", "Closed Record")'),

        ("IFERROR", '=IFERROR(Patient_Encounters!M2/Patient_Encounters!L2, 0)',
         "Insurance Covered / Net Billing",
         "Fault-tolerance error handler: safely calculates insurance coverage ratio preventing #DIV/0! errors.",
         '=IFERROR(Patient_Encounters!M2/Patient_Encounters!L2, 0)'),

        ("SUMIF", '=SUMIF(Patient_Encounters!H:H, "Cardiology", Patient_Encounters!L:L)',
         "Department (H) & Net Amount (L)",
         "Conditional summation: aggregates net clinical billing specifically for Cardiology department.",
         '=SUMIF(Patient_Encounters!H:H, "Cardiology", Patient_Encounters!L:L)'),

        ("AVERAGEIF", '=AVERAGEIF(Patient_Encounters!H:H, "Orthopedics", Patient_Encounters!D:D)',
         "Department (H) & Length of Stay (D)",
         "Conditional average: computes mean inpatient days for Orthopedics joint replacement cases.",
         '=AVERAGEIF(Patient_Encounters!H:H, "Orthopedics", Patient_Encounters!D:D)'),

        ("COUNTIF", '=COUNTIF(Patient_Encounters!F:F, "Level 1 - Critical")',
         "Triage_Level (Col F)",
         "Conditional frequency: counts total number of Level 1 Critical emergency presentations.",
         '=COUNTIF(Patient_Encounters!F:F, "Level 1 - Critical")')
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
        if ftype == "SUMIF":
            c5.number_format = "₹#,##0.00"
        elif ftype == "AVERAGEIF":
            c5.number_format = "0.0 Days"
        elif ftype == "COUNTIF":
            c5.number_format = "#,##0"
        elif ftype == "IFERROR":
            c5.number_format = "0.00%"

        for c_i in range(1, 6):
            cell = ws_form.cell(row=idx, column=c_i)
            cell.border = cell_border
            if idx % 2 == 1:
                cell.fill = zebra_fill

    form_widths = {"A": 16, "B": 48, "C": 26, "D": 45, "E": 28}
    for col, width in form_widths.items():
        ws_form.column_dimensions[col].width = width

    # --------------------------------------------------------------------------
    # SHEET 4: Pivot_Summary_Matrix
    # --------------------------------------------------------------------------
    ws_piv = wb.create_sheet(title="Pivot_Summary_Matrix")
    ws_piv.views.sheetView[0].showGridLines = True

    ws_piv.merge_cells("A1:G2")
    p_title = ws_piv["A1"]
    p_title.value = "   HOSPITAL CLINICAL CROSS-TABULATION MATRIX (DEPARTMENT X TRIAGE LEVEL)"
    p_title.font = title_font
    p_title.fill = title_fill
    p_title.alignment = Alignment(vertical="center")

    ws_piv["A3"].value = "Table 1: Net Treatment Billing Matrix (INR)"
    ws_piv["A3"].font = Font(name=font_family, size=11, bold=True, color=navy_dark)

    pivot_headers = ["Department", "Level 1 - Critical", "Level 2 - Emergent", "Level 3 - Stable", "Total Department Billing"]
    for col_i, h in enumerate(pivot_headers, start=1):
        cell = ws_piv.cell(row=4, column=col_i, value=h)
        cell.font = header_font
        cell.fill = header_fill
        cell.alignment = Alignment(horizontal="center" if col_i > 1 else "left", vertical="center")
        cell.border = cell_border

    triage_cols = ["Level 1 - Critical", "Level 2 - Emergent", "Level 3 - Stable"]
    for r_idx, dname in enumerate(departments_list, start=5):
        ws_piv.cell(row=r_idx, column=1, value=dname).font = data_bold
        for c_idx, tlevel in enumerate(triage_cols, start=2):
            cell = ws_piv.cell(row=r_idx, column=c_idx, 
                value=f'=SUMIFS(Patient_Encounters!L:L, Patient_Encounters!H:H, "{dname}", Patient_Encounters!F:F, "{tlevel}")')
            cell.number_format = "₹#,##0.00"
            cell.font = data_font
            cell.border = cell_border
            if r_idx % 2 == 1:
                cell.fill = zebra_fill

        tot_cell = ws_piv.cell(row=r_idx, column=5, value=f"=SUM(B{r_idx}:D{r_idx})")
        tot_cell.number_format = "₹#,##0.00"
        tot_cell.font = data_bold
        tot_cell.fill = accent_fill
        tot_cell.border = cell_border

    b_tot_row = 5 + len(departments_list)
    ws_piv.cell(row=b_tot_row, column=1, value="Grand Hospital Total").font = data_bold
    for c_idx in range(2, 5):
        col_letter = get_column_letter(c_idx)
        cell = ws_piv.cell(row=b_tot_row, column=c_idx, value=f"=SUM({col_letter}5:{col_letter}{b_tot_row-1})")
        cell.number_format = "₹#,##0.00"
        cell.font = data_bold
        cell.fill = accent_fill
        cell.border = total_border

    grand_tot_cell = ws_piv.cell(row=b_tot_row, column=5, value=f"=SUM(E5:E{b_tot_row-1})")
    grand_tot_cell.number_format = "₹#,##0.00"
    grand_tot_cell.font = data_bold
    grand_tot_cell.fill = PatternFill(start_color="CFFAFE", end_color="CFFAFE", fill_type="solid")
    grand_tot_cell.border = total_border

    piv_widths = {"A": 22, "B": 22, "C": 22, "D": 22, "E": 26}
    for col, width in piv_widths.items():
        ws_piv.column_dimensions[col].width = width

    # --------------------------------------------------------------------------
    # SHEET 5: Patient_Registry
    # --------------------------------------------------------------------------
    ws_pat = wb.create_sheet(title="Patient_Registry")
    ws_pat.views.sheetView[0].showGridLines = True

    ws_pat.merge_cells("A1:H2")
    c_title = ws_pat["A1"]
    c_title.value = "   PULSECARE REGISTERED PATIENT DIRECTORY & CLINICAL CARE TIERS"
    c_title.font = title_font
    c_title.fill = title_fill
    c_title.alignment = Alignment(vertical="center")

    pat_headers = ["Patient ID", "Patient Name", "Age", "Gender", "City", "Insurance Plan", "Encounters Count", "Lifetime Billing (INR)"]
    for col_i, h in enumerate(pat_headers, start=1):
        cell = ws_pat.cell(row=4, column=col_i, value=h)
        cell.font = header_font
        cell.fill = header_fill
        cell.alignment = Alignment(horizontal="center" if col_i in (1, 3, 4, 7) else "left", vertical="center")
        cell.border = cell_border

    # Load unique patients from CSV
    seen_patients = {}
    for r in rows_data:
        pid = int(r["patient_id"])
        if pid not in seen_patients:
            seen_patients[pid] = {
                "name": r["patient_name"],
                "age": r["age"],
                "gender": r["gender"],
                "city": r["city"],
                "insurance": r["insurance_plan"]
            }

    for idx, (pid, pinfo) in enumerate(sorted(seen_patients.items()), start=5):
        ws_pat.cell(row=idx, column=1, value=pid).alignment = Alignment(horizontal="center")
        ws_pat.cell(row=idx, column=2, value=pinfo["name"])
        ws_pat.cell(row=idx, column=3, value=int(pinfo["age"])).alignment = Alignment(horizontal="center")
        ws_pat.cell(row=idx, column=4, value=pinfo["gender"]).alignment = Alignment(horizontal="center")
        ws_pat.cell(row=idx, column=5, value=pinfo["city"])
        ws_pat.cell(row=idx, column=6, value=pinfo["insurance"])

        ws_pat.cell(row=idx, column=7, value=f'=COUNTIF(Patient_Encounters!G:G, "{pinfo["name"]}")').number_format = "#,##0"
        bill_cell = ws_pat.cell(row=idx, column=8, value=f'=SUMIF(Patient_Encounters!G:G, "{pinfo["name"]}", Patient_Encounters!L:L)')
        bill_cell.number_format = "₹#,##0.00"

        for c_i in range(1, 9):
            cell = ws_pat.cell(row=idx, column=c_i)
            cell.border = cell_border
            if idx % 2 == 1:
                cell.fill = zebra_fill

    pat_widths = {"A": 14, "B": 24, "C": 10, "D": 12, "E": 18, "F": 26, "G": 18, "H": 22}
    for col, width in pat_widths.items():
        ws_pat.column_dimensions[col].width = width

    wb.remove(default_sheet)

    out_dir = "02_Excel"
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, "hospital_clinical_analytics.xlsx")
    wb.save(out_path)
    # also save as retail_sales_analytics.xlsx for compatibility
    wb.save(os.path.join(out_dir, "retail_sales_analytics.xlsx"))
    print(f"Successfully generated {out_path} ({os.path.getsize(out_path)} bytes)")

if __name__ == "__main__":
    create_workbook()
