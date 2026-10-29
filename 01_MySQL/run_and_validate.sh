#!/bin/bash
# ==============================================================================
# Run & Validate MySQL Scripts for Retail Sales & Customer Analytics
# ==============================================================================
set -e

MYSQL_BIN="/usr/local/mysql/bin/mysql"
if ! command -v "$MYSQL_BIN" &> /dev/null; then
    MYSQL_BIN="mysql"
fi

DB_USER="root"
DB_PASS="1234"
DB_NAME="retail_analytics"

echo "=========================================================="
echo " Running MySQL Analytics Validation Script"
echo " Target: $DB_USER@localhost/$DB_NAME"
echo "=========================================================="

echo "1. Checking MySQL Server connection..."
"$MYSQL_BIN" -u "$DB_USER" -p"$DB_PASS" -e "SELECT VERSION() AS mysql_version;"

echo "2. Applying schema and analytical views..."
"$MYSQL_BIN" -u "$DB_USER" -p"$DB_PASS" < 01_MySQL/01_schema_and_views.sql

echo "3. Populating seed dataset..."
"$MYSQL_BIN" -u "$DB_USER" -p"$DB_PASS" < 01_MySQL/02_seed_data.sql

echo "4. Executing analytical query suite..."
"$MYSQL_BIN" -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" < 01_MySQL/03_analytical_queries.sql > 01_MySQL/latest_execution_output.txt

echo "=========================================================="
echo " Validation complete! Query outputs written to:"
echo " 01_MySQL/latest_execution_output.txt"
echo "=========================================================="
