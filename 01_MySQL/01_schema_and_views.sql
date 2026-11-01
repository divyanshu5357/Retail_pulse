-- ==============================================================================
-- PulseCare Hospital Analytics & Clinical Operations Database Schema
-- Database Name: hospital_analytics
-- Target DBMS: MySQL 8.0+ / 9.x
-- ==============================================================================

CREATE DATABASE IF NOT EXISTS hospital_analytics
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE hospital_analytics;

DROP VIEW IF EXISTS v_tableau_hospital_master;
DROP VIEW IF EXISTS v_patient_clinical_summary;
DROP TABLE IF EXISTS medical_billing;
DROP TABLE IF EXISTS admissions;
DROP TABLE IF EXISTS departments;
DROP TABLE IF EXISTS patients;

-- 1. Patients Table
CREATE TABLE patients (
    patient_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_name VARCHAR(100) NOT NULL,
    age INT NOT NULL,
    gender VARCHAR(10) NOT NULL,
    blood_group VARCHAR(5) NOT NULL,
    city VARCHAR(50) NOT NULL,
    region VARCHAR(30) NOT NULL,
    insurance_plan VARCHAR(80) NOT NULL,
    INDEX idx_patients_city (city),
    INDEX idx_patients_region (region),
    INDEX idx_patients_age (age)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Departments Table
CREATE TABLE departments (
    department_id INT AUTO_INCREMENT PRIMARY KEY,
    department_name VARCHAR(80) NOT NULL,
    assigned_ward VARCHAR(100) NOT NULL,
    INDEX idx_dept_name (department_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Admissions Table
CREATE TABLE admissions (
    admission_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    department_id INT NOT NULL,
    admission_date DATE NOT NULL,
    discharge_date DATE NOT NULL,
    length_of_stay INT NOT NULL,
    admission_type VARCHAR(50) NOT NULL,
    admission_status VARCHAR(50) NOT NULL,
    triage_level VARCHAR(50) NOT NULL,
    CONSTRAINT fk_admissions_patient
        FOREIGN KEY (patient_id) REFERENCES patients(patient_id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_admissions_dept
        FOREIGN KEY (department_id) REFERENCES departments(department_id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    INDEX idx_admissions_date (admission_date),
    INDEX idx_admissions_status (admission_status),
    INDEX idx_admissions_triage (triage_level)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Medical Billing Table
CREATE TABLE medical_billing (
    billing_id INT AUTO_INCREMENT PRIMARY KEY,
    admission_id INT NOT NULL,
    procedure_name VARCHAR(120) NOT NULL,
    procedure_cost DECIMAL(12, 2) NOT NULL,
    medication_cost DECIMAL(12, 2) NOT NULL,
    doctor_fee DECIMAL(12, 2) NOT NULL,
    room_charges DECIMAL(12, 2) NOT NULL,
    discount_percent DECIMAL(5, 2) NOT NULL DEFAULT 0.00,
    discount_amount DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    gross_amount DECIMAL(12, 2) NOT NULL,
    net_amount DECIMAL(12, 2) NOT NULL,
    insurance_covered DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    patient_payable DECIMAL(12, 2) NOT NULL,
    CONSTRAINT fk_billing_admission
        FOREIGN KEY (admission_id) REFERENCES admissions(admission_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_billing_net (net_amount)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- View 1: Patient Clinical Summary
CREATE OR REPLACE VIEW v_patient_clinical_summary AS
SELECT 
    p.patient_id,
    p.patient_name,
    p.age,
    p.gender,
    p.blood_group,
    p.city,
    p.region,
    p.insurance_plan,
    COUNT(DISTINCT a.admission_id) AS total_admissions,
    COALESCE(SUM(b.net_amount), 0) AS lifetime_clinical_billing,
    COALESCE(AVG(a.length_of_stay), 0) AS avg_length_of_stay,
    CASE 
        WHEN COUNT(DISTINCT a.admission_id) = 0 THEN 'Registered / No Encounters'
        WHEN COALESCE(SUM(b.net_amount), 0) >= 200000 THEN 'Critical High-Care Tier'
        WHEN COALESCE(SUM(b.net_amount), 0) >= 100000 THEN 'Moderate Inpatient Tier'
        ELSE 'Routine Clinical Tier'
    END AS patient_care_category
FROM patients p
LEFT JOIN admissions a ON p.patient_id = a.patient_id
LEFT JOIN medical_billing b ON a.admission_id = b.admission_id
GROUP BY 
    p.patient_id, p.patient_name, p.age, p.gender, p.blood_group, p.city, p.region, p.insurance_plan;

-- View 2: Tableau & Excel Master Reporting Flat View
CREATE OR REPLACE VIEW v_tableau_hospital_master AS
SELECT 
    b.billing_id,
    a.admission_id,
    a.admission_date,
    DATE_FORMAT(a.admission_date, '%Y-%m') AS admission_year_month,
    YEAR(a.admission_date) AS admission_year,
    MONTH(a.admission_date) AS admission_month,
    DATE_FORMAT(a.admission_date, '%b') AS admission_month_name,
    a.discharge_date,
    a.length_of_stay,
    a.admission_type,
    a.admission_status,
    a.triage_level,
    p.patient_id,
    p.patient_name,
    p.age,
    p.gender,
    p.blood_group,
    p.city,
    p.region,
    p.insurance_plan,
    d.department_id,
    d.department_name,
    d.assigned_ward,
    b.procedure_name,
    b.procedure_cost,
    b.medication_cost,
    b.doctor_fee,
    b.room_charges,
    b.discount_percent,
    b.gross_amount,
    b.discount_amount,
    b.net_amount,
    b.insurance_covered,
    b.patient_payable
FROM admissions a
JOIN patients p ON a.patient_id = p.patient_id
JOIN departments d ON a.department_id = d.department_id
JOIN medical_billing b ON a.admission_id = b.admission_id;
