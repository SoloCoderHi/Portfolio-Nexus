import os
import requests
import json
import time
from pathlib import Path

# Cache file path
CACHE_FILE = Path(__file__).parent / "nps_data.json"
CACHE_DURATION = 24 * 60 * 60  # 24 hours in seconds

# NPS API endpoints
NPS_DETAILED_API_URL = "https://npsnav.in/api/detailed/"

# Common NPS scheme codes for major funds (for search demonstration)
# In production, this list should be comprehensive or fetched from a data source
COMMON_NPS_SCHEMES = [
    {"code": "SM001001", "name": "SBI PENSION FUND SCHEME - CENTRAL GOVT"},
    {"code": "SM001002", "name": "SBI PENSION FUND SCHEME - STATE GOVT"},
    {"code": "SM001003", "name": "SBI PENSION FUND SCHEME E - TIER I"},
    {"code": "SM001004", "name": "SBI PENSION FUND SCHEME C - TIER I"},
    {"code": "SM001005", "name": "SBI PENSION FUND SCHEME G - TIER I"},
    {"code": "SM002001", "name": "UTI RETIREMENT SOLUTIONS PENSION FUND SCHEME - CENTRAL GOVT"},
    {"code": "SM002002", "name": "UTI RETIREMENT SOLUTIONS PENSION FUND SCHEME - STATE GOVT"},
    {"code": "SM002003", "name": "UTI RETIREMENT SOLUTIONS PENSION FUND SCHEME E - TIER I"},
    {"code": "SM008001", "name": "HDFC PENSION MANAGEMENT COMPANY LTD-SCHEME E-TIER I"},
    {"code": "SM008002", "name": "HDFC PENSION MANAGEMENT COMPANY LTD-SCHEME C-TIER I"},
    {"code": "SM008003", "name": "HDFC PENSION MANAGEMENT COMPANY LTD-SCHEME G-TIER I"},
]


def get_nps_data():
    """
    Get NPS scheme data. Uses cached data if available and fresh.
    Falls back to the common schemes list if API is unavailable.
    
    Returns the list of NPS schemes.
    """
    # Check if cache is valid
    if CACHE_FILE.exists():
        file_age = time.time() - CACHE_FILE.stat().st_mtime
        if file_age < CACHE_DURATION:
            # Cache is still valid, load from file
            try:
                with open(CACHE_FILE, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    if data:  # If cache has data, use it
                        return data
            except Exception as e:
                print(f"Error loading cached NPS data: {e}")
    
    # For now, return the common schemes list
    # In production, this would fetch from a comprehensive data source
    try:
        # Save to cache file
        with open(CACHE_FILE, 'w', encoding='utf-8') as f:
            json.dump(COMMON_NPS_SCHEMES, f)
        
        print(f"Using common NPS schemes list")
        return COMMON_NPS_SCHEMES
    except Exception as e:
        print(f"Error caching NPS data: {e}")
        return COMMON_NPS_SCHEMES


def search_nps(query):
    """
    Search for NPS schemes by scheme name or code.
    
    Returns a list of matching scheme objects.
    """
    nps_data = get_nps_data()
    
    if not nps_data:
        return []
    
    results = []
    query_lower = query.lower()
    
    for scheme in nps_data:
        scheme_name = scheme.get('name', '')
        scheme_code = scheme.get('code', '')
        
        # Check if query matches scheme name or code
        if (query_lower in scheme_name.lower() or 
            query_lower in scheme_code.lower()):
            results.append(scheme)
    
    return results


def get_nps_nav(scheme_id):
    """
    Get the NAV for a specific NPS scheme by code using the detailed API.
    
    Returns the NAV value, or None if not found.
    """
    try:
        url = f"{NPS_DETAILED_API_URL}{scheme_id}"
        response = requests.get(url, timeout=30)
        response.raise_for_status()
        
        data = response.json()
        
        # Extract NAV from the detailed API response
        nav = data.get('NAV')
        return nav
    except Exception as e:
        print(f"Error fetching NAV for scheme {scheme_id}: {e}")
        return None
