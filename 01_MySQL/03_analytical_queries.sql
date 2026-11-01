-- ==============================================================================
-- PulseCare Hospital Analytics - Master Analytical SQL Query Suite
-- Inpatient Admissions, Bed Occupancy, ALOS, Clinical Billing & Outcomes
-- Target DBMS: MySQL 8.0+ / 9.x
-- Database: hospital_analytics
-- ==============================================================================

USE hospital_analytics;

-- ------------------------------------------------------------------------------
-- Topic 1: Basic SELECT, Filtering (WHERE), and Sorting (ORDER BY)
-- Business Objective: Retrieve high-complexity surgical/clinical procedures 
-- costing >= ₹50,000 sorted by procedure fee.
-- ------------------------------------------------------------------------------
SELECT 
    billing_id,
    procedure_name,
    procedure_cost,
    doctor_fee,
    room_charges,
    net_amount,
    insurance_covered,
    patient_payable
FROM medical_billing
WHERE procedure_cost >= 50000.00
ORDER BY procedure_cost DESC
LIMIT 10;

-- ------------------------------------------------------------------------------
-- Topic 2: Relational INNER JOIN with Multi-Condition Filtering
-- Business Objective: Identify all critical care triage inpatient admissions
-- with patient names, age, and assigned ward.
-- ------------------------------------------------------------------------------
SELECT 
    a.admission_id,
    a.admission_date,
    p.patient_name,
    p.age,
    d.department_name,
    d.assigned_ward,
    a.triage_level,
    a.admission_status
FROM admissions a
INNER JOIN patients p ON a.patient_id = p.patient_id
INNER JOIN departments d ON a.department_id = d.department_id
WHERE a.triage_level LIKE '%Critical%'
ORDER BY a.admission_date DESC
LIMIT 15;

-- ------------------------------------------------------------------------------
-- Topic 3: GROUP BY with Multi-Metric Aggregations (SUM, COUNT, AVG, ROUND)
-- Business Objective: Clinical department performance breakdown (admissions, 
-- average length of stay, total billing, and insurance coverage).
-- ------------------------------------------------------------------------------
SELECT 
    d.department_name,
    COUNT(DISTINCT a.admission_id) AS total_admissions,
    ROUND(AVG(a.length_of_stay), 1) AS avg_length_of_stay_days,
    ROUND(SUM(b.gross_amount), 2) AS total_gross_billing,
    ROUND(SUM(b.net_amount), 2) AS total_net_billing,
    ROUND(SUM(b.insurance_covered), 2) AS total_insurance_settled,
    ROUND((SUM(b.insurance_covered) / SUM(b.net_amount)) * 100, 2) AS insurance_claim_ratio_pct
FROM admissions a
INNER JOIN departments d ON a.department_id = d.department_id
INNER JOIN medical_billing b ON a.admission_id = b.admission_id
GROUP BY d.department_name
ORDER BY total_net_billing DESC;

-- ------------------------------------------------------------------------------
-- Topic 4: Regional Patient Inflow with Average Encounter Value (AEV)
-- Business Objective: Analyze geographic referral patterns across Indian regions.
-- ------------------------------------------------------------------------------
SELECT 
    p.region,
    COUNT(DISTINCT a.admission_id) AS admission_count,
    ROUND(SUM(b.net_amount), 2) AS regional_clinical_revenue,
    ROUND(SUM(b.net_amount) / COUNT(DISTINCT a.admission_id), 2) AS avg_encounter_value,
    ROUND(AVG(a.length_of_stay), 1) AS regional_avg_stay_days
FROM admissions a
INNER JOIN patients p ON a.patient_id = p.patient_id
INNER JOIN medical_billing b ON a.admission_id = b.admission_id
GROUP BY p.region
ORDER BY regional_clinical_revenue DESC;

-- ------------------------------------------------------------------------------
-- Topic 5: Patient Lifetime Encounters using LEFT JOIN, SUM, GROUP BY, and COALESCE
-- Business Objective: Retrieve EVERY registered patient, classifying their clinical care tier.
-- ------------------------------------------------------------------------------
SELECT 
    p.patient_id,
    p.patient_name,
    p.city,
    p.region,
    p.insurance_plan,
    COUNT(DISTINCT a.admission_id) AS admission_count,
    COALESCE(SUM(b.net_amount), 0) AS lifetime_billing_inr,
    COALESCE(MAX(a.admission_date), 'No Admissions') AS last_admission_date,
    CASE 
        WHEN COUNT(DISTINCT a.admission_id) = 0 THEN 'Registered / Inactive'
        WHEN COALESCE(SUM(b.net_amount), 0) >= 200000 THEN 'Critical High-Care Tier'
        WHEN COALESCE(SUM(b.net_amount), 0) >= 100000 THEN 'Moderate Inpatient Tier'
        ELSE 'Routine Clinical Tier'
    END AS patient_care_category
FROM patients p
LEFT JOIN admissions a ON p.patient_id = a.patient_id
LEFT JOIN medical_billing b ON a.admission_id = b.admission_id
GROUP BY 
    p.patient_id, p.patient_name, p.city, p.region, p.insurance_plan
ORDER BY lifetime_billing_inr DESC;

-- ------------------------------------------------------------------------------
-- Topic 6: Identification of Inactive Registered Patients (Zero Encounters)
-- Business Objective: Detect registered patients who never had an inpatient encounter.
-- ------------------------------------------------------------------------------
SELECT 
    p.patient_id,
    p.patient_name,
    p.city,
    p.region,
    p.insurance_plan,
    0 AS total_admissions,
    0.00 AS total_billing,
    'No Clinical Encounters' AS encounter_status
FROM patients p
LEFT JOIN admissions a ON p.patient_id = a.patient_id
WHERE a.admission_id IS NULL
ORDER BY p.patient_id ASC;

-- ------------------------------------------------------------------------------
-- Topic 7: Monthly Inpatient Admission Velocity & Growth Analysis
-- Business Objective: Month-over-Month (MoM) inpatient volume and clinical revenue.
-- ------------------------------------------------------------------------------
SELECT 
    DATE_FORMAT(a.admission_date, '%Y-%m') AS admission_month,
    COUNT(DISTINCT a.admission_id) AS monthly_admissions,
    ROUND(SUM(b.net_amount), 2) AS monthly_billing,
    ROUND(AVG(a.length_of_stay), 1) AS monthly_avg_stay_days
FROM admissions a
INNER JOIN medical_billing b ON a.admission_id = b.admission_id
GROUP BY DATE_FORMAT(a.admission_date, '%Y-%m')
ORDER BY admission_month ASC;

-- ------------------------------------------------------------------------------
-- Topic 8: Top 10 High-Volume Medical Procedures
-- Business Objective: Procedure frequency and revenue generation.
-- ------------------------------------------------------------------------------
SELECT 
    b.procedure_name,
    COUNT(*) AS procedure_count,
    ROUND(AVG(b.procedure_cost), 2) AS avg_procedure_cost,
    ROUND(SUM(b.net_amount), 2) AS total_net_billed,
    ROUND(SUM(b.insurance_covered), 2) AS insurance_reimbursed
FROM medical_billing b
GROUP BY b.procedure_name
ORDER BY total_net_billed DESC
LIMIT 10;

-- ------------------------------------------------------------------------------
-- Topic 9: Window Functions (DENSE_RANK() OVER Department Partition)
-- Business Objective: Rank procedures by billing WITHIN their departments.
-- ------------------------------------------------------------------------------
WITH DeptProcedureSummary AS (
    SELECT 
        d.department_name,
        b.procedure_name,
        ROUND(SUM(b.net_amount), 2) AS procedure_revenue,
        COUNT(*) AS total_cases
    FROM departments d
    JOIN admissions a ON d.department_id = a.department_id
    JOIN medical_billing b ON a.admission_id = b.admission_id
    GROUP BY d.department_name, b.procedure_name
)
SELECT 
    department_name,
    procedure_name,
    procedure_revenue,
    total_cases,
    DENSE_RANK() OVER (PARTITION BY department_name ORDER BY procedure_revenue DESC) AS rank_in_department
FROM DeptProcedureSummary
ORDER BY department_name, rank_in_department;

-- ------------------------------------------------------------------------------
-- Topic 10: Window Functions (Cumulative Running Clinical Revenue)
-- Business Objective: Compute running cumulative billing over the timeline.
-- ------------------------------------------------------------------------------
SELECT 
    admission_month,
    monthly_billing,
    SUM(monthly_billing) OVER (ORDER BY admission_month ASC) AS cumulative_clinical_revenue
FROM (
    SELECT 
        DATE_FORMAT(a.admission_date, '%Y-%m') AS admission_month,
        ROUND(SUM(b.net_amount), 2) AS monthly_billing
    FROM admissions a
    JOIN medical_billing b ON a.admission_id = b.admission_id
    GROUP BY DATE_FORMAT(a.admission_date, '%Y-%m')
) AS monthly_summary
ORDER BY admission_month ASC;

-- ------------------------------------------------------------------------------
-- Topic 11: Common Table Expressions (CTE) - Patient Readmission Frequency
-- Business Objective: Track one-time vs repeat readmitted patients.
-- ------------------------------------------------------------------------------
WITH PatientEncounters AS (
    SELECT 
        p.patient_id,
        COUNT(DISTINCT a.admission_id) AS admission_count
    FROM patients p
    LEFT JOIN admissions a ON p.patient_id = a.patient_id
    GROUP BY p.patient_id
)
SELECT 
    CASE 
        WHEN admission_count = 0 THEN '0 Encounters (Registered Only)'
        WHEN admission_count = 1 THEN '1 Encounter (Single Admission)'
        WHEN admission_count BETWEEN 2 AND 3 THEN '2-3 Encounters (Repeat Care)'
        ELSE '4+ Encounters (Chronic / Frequent Inpatient)'
    END AS patient_engagement_tier,
    COUNT(*) AS total_patients,
    ROUND((COUNT(*) / (SELECT COUNT(*) FROM patients)) * 100, 2) AS percentage_of_patient_base
FROM PatientEncounters
GROUP BY patient_engagement_tier
ORDER BY total_patients DESC;
