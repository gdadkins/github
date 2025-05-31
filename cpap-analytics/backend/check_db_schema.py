import sqlite3

# Connect to the existing database
conn = sqlite3.connect('cpap_analytics.db')
cursor = conn.cursor()

# Get all table names
cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
tables = cursor.fetchall()

print("Existing tables:")
for table in tables:
    print(f"- {table[0]}")
    
    # Get schema for each table
    cursor.execute(f"PRAGMA table_info({table[0]});")
    columns = cursor.fetchall()
    
    print(f"  Columns in {table[0]}:")
    for col in columns:
        print(f"    {col[1]} ({col[2]}) - Primary Key: {bool(col[5])}")
    print()

conn.close()