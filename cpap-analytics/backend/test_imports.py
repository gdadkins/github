#!/usr/bin/env python3
"""Test imports to debug backend issues"""

import sys
sys.path.append('.')

try:
    from app.main import app
    print('[OK] App imports successfully')
except Exception as e:
    print(f'[ERROR] App import error: {e}')
    import traceback
    traceback.print_exc()

try:
    from app.api.endpoints.auth import router
    print('[OK] Auth router imports successfully') 
except Exception as e:
    print(f'[ERROR] Auth router import error: {e}')
    import traceback
    traceback.print_exc()

try:
    from app.analytics import generate_insights
    print('[OK] Analytics imports successfully')
except Exception as e:
    print(f'[ERROR] Analytics import error: {e}')
    import traceback
    traceback.print_exc()

print("Import test complete!")