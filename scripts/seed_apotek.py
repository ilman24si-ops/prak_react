#!/usr/bin/env python3
"""
seed_apotek.py - Import data Apotek Keluarga ke Supabase
Jalankan: python3 scripts/seed_apotek.py

Dependensi: pip install requests
"""

import requests
import json
import sys
from datetime import datetime

SUPABASE_URL = "https://txwvvhmyolrlelgbhwbm.supabase.co"
SUPABASE_KEY = "sb_publishable_Sehk1mQgLhcQ123J9vnWCw_c2cPh7FW"

HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "resolution=merge-duplicates"
}

def parse_date(d):
    """Ubah format DD/MM/YYYY ke YYYY-MM-DD"""
    if not d:
        return None
    try:
        return datetime.strptime(d.strip(), "%d/%m/%Y").strftime("%Y-%m-%d")
    except:
        return None

def insert_batch(table, data, batch_size=200):
    """Insert data dalam batch ke Supabase"""
    url = f"{SUPABASE_URL}/rest/v1/{table}"
    total = 0
    errors = []
    for i in range(0, len(data), batch_size):
        batch = data[i:i+batch_size]
        resp = requests.post(url, headers=HEADERS, json=batch)
        if resp.status_code in (200, 201):
            total += len(batch)
        else:
            errors.append(f"  Batch {i}-{i+batch_size}: {resp.status_code} - {resp.text[:200]}")
        sys.stdout.write(f"\r  [{table}] {min(i+batch_size, len(data))}/{len(data)} rows...")
        sys.stdout.flush()
    print(f"\n  Selesai: {total}/{len(data)} rows -> [{table}]")
    for e in errors:
        print(f"  ERROR: {e}")

