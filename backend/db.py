import os
import sqlite3
import pymysql
import pymysql.cursors
from contextlib import contextmanager
from config import Config

def get_mysql_connection(database=None):
    """Attempt connection to MySQL server."""
    return pymysql.connect(
        host=Config.DB_HOST,
        port=Config.DB_PORT,
        user=Config.DB_USER,
        password=Config.DB_PASSWORD,
        database=database or Config.DB_NAME,
        charset='utf8mb4',
        cursorclass=pymysql.cursors.DictCursor,
        autocommit=True,
        connect_timeout=3
    )

def test_mysql_available():
    """Verify if MySQL server is reachable."""
    try:
        conn = pymysql.connect(
            host=Config.DB_HOST,
            port=Config.DB_PORT,
            user=Config.DB_USER,
            password=Config.DB_PASSWORD,
            connect_timeout=2
        )
        conn.close()
        return True
    except Exception as e:
        print(f"[DB] MySQL connection check failed: {e}")
        return False

# Detect engine mode at runtime
USE_MYSQL = test_mysql_available()
SQLITE_PATH = Config.BASE_DIR / 'retail_analytics_fallback.db'

def dict_factory(cursor, row):
    """Row factory for sqlite3 to return dictionaries matching DictCursor."""
    d = {}
    for idx, col in enumerate(cursor.description):
        d[col[0]] = row[idx]
    return d

@contextmanager
def get_db():
    """Context manager for database connections."""
    global USE_MYSQL
    conn = None
    if USE_MYSQL:
        try:
            conn = get_mysql_connection()
        except Exception as e:
            print(f"[DB Warning] MySQL connection failed, using SQLite: {e}")
            USE_MYSQL = False

    if conn is not None:
        try:
            yield conn
        finally:
            conn.close()
        return

    # SQLite fallback
    conn = sqlite3.connect(str(SQLITE_PATH))
    conn.row_factory = dict_factory
    try:
        yield conn
    finally:
        conn.close()


import re

def query_db(sql, params=(), one=False, commit=False):
    """
    Execute a parameterized SQL query safely.
    Handles differences between %s (MySQL) and ? (SQLite) automatically.
    Safely escapes literal % symbols in MySQL when parameters are bound.
    """
    global USE_MYSQL
    with get_db() as conn:
        cursor = conn.cursor()
        
        # Dialect conversion if in SQLite mode
        if not USE_MYSQL:
            # Convert %s placeholder to ? for sqlite
            formatted_sql = sql.replace('%s', '?')
            # Convert MySQL DATE_FORMAT and other dialect specifics
            formatted_sql = formatted_sql.replace("DATE_FORMAT(", "strftime('%Y-%m', ")
            formatted_sql = formatted_sql.replace("'%Y-%m')", "'%Y-%m')")
            if params:
                cursor.execute(formatted_sql, params)
            else:
                cursor.execute(formatted_sql)
        else:
            if params:
                # Escape literal % that aren't param placeholders (%s) or already escaped (%%)
                escaped_sql = re.sub(r'%(?!s|%)', '%%', sql)
                cursor.execute(escaped_sql, params)
            else:
                cursor.execute(sql)
            
        if commit:
            conn.commit()
            last_id = cursor.lastrowid
            cursor.close()
            return last_id
            
        result = cursor.fetchall()
        cursor.close()
        return (result[0] if result else None) if one else result


def execute_script(sql_script):
    """Execute raw SQL statements sequentially. Adapts syntax for SQLite when MySQL is offline."""
    global USE_MYSQL
    if USE_MYSQL:
        conn = pymysql.connect(
            host=Config.DB_HOST,
            port=Config.DB_PORT,
            user=Config.DB_USER,
            password=Config.DB_PASSWORD,
            database=Config.DB_NAME,
            charset='utf8mb4',
            client_flag=pymysql.constants.CLIENT.MULTI_STATEMENTS
        )
        try:
            with conn.cursor() as cur:
                cur.execute(sql_script)
            conn.commit()
        finally:
            conn.close()
    else:
        conn = sqlite3.connect(str(SQLITE_PATH))
        try:
            # Strip MySQL-specific commands for SQLite
            clean_lines = []
            for line in sql_script.splitlines():
                stripped = line.strip().upper()
                if stripped.startswith('CREATE DATABASE') or stripped.startswith('USE '):
                    continue
                # Replace AUTO_INCREMENT with AUTOINCREMENT and strip ENGINE=InnoDB
                adapted_line = line.replace('AUTO_INCREMENT', 'AUTOINCREMENT')
                adapted_line = re.sub(r'ENGINE=InnoDB\s*(DEFAULT\s*)?CHARSET=\w+(\s*COLLATE=\w+)?;?', ';', adapted_line, flags=re.IGNORECASE)
                clean_lines.append(adapted_line)
            clean_sql = '\n'.join(clean_lines)
            conn.executescript(clean_sql)
            conn.commit()
        finally:
            conn.close()


def get_db_status():
    """Return health and metadata information about the active database."""
    global USE_MYSQL
    try:
        with get_db() as conn:
            cur = conn.cursor()
            if USE_MYSQL:
                cur.execute("SELECT VERSION() AS ver;")
                ver = cur.fetchone()['ver']
                engine_name = f"MySQL {ver}"
                
                cur.execute("SELECT COUNT(*) AS cnt FROM customers;")
                cust_cnt = cur.fetchone()['cnt']
                cur.execute("SELECT COUNT(*) AS cnt FROM products;")
                prod_cnt = cur.fetchone()['cnt']
                cur.execute("SELECT COUNT(*) AS cnt FROM orders;")
                ord_cnt = cur.fetchone()['cnt']
                cur.execute("SELECT COUNT(*) AS cnt FROM order_items;")
                item_cnt = cur.fetchone()['cnt']
            else:
                engine_name = "SQLite Fallback (MySQL service offline)"
                cur.execute("SELECT COUNT(*) AS cnt FROM customers;")
                cust_cnt = cur.fetchone()['cnt']
                cur.execute("SELECT COUNT(*) AS cnt FROM products;")
                prod_cnt = cur.fetchone()['cnt']
                cur.execute("SELECT COUNT(*) AS cnt FROM orders;")
                ord_cnt = cur.fetchone()['cnt']
                cur.execute("SELECT COUNT(*) AS cnt FROM order_items;")
                item_cnt = cur.fetchone()['cnt']

            return {
                "status": "connected",
                "engine": engine_name,
                "is_mysql": USE_MYSQL,
                "database": Config.DB_NAME if USE_MYSQL else "retail_analytics_fallback.db",
                "host": Config.DB_HOST if USE_MYSQL else "local",
                "counts": {
                    "customers": cust_cnt,
                    "products": prod_cnt,
                    "orders": ord_cnt,
                    "order_items": item_cnt
                }
            }
    except Exception as e:
        return {
            "status": "error",
            "message": str(e),
            "is_mysql": USE_MYSQL,
            "engine": "Unknown / Disconnected"
        }
