import requests
from lxml import html
import re

# This "disguises" our script as a real browser
HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36'
}

def clean_price(price_text):
    """
    Cleans the price string. Removes "₹", ",", "+", "&nbsp;"
    and returns a float.
    """
    if price_text is None:
        return None
    try:
        # Remove all non-numeric characters except the decimal point
        cleaned = re.sub(r"[^0-9.]", "", price_text)
        return float(cleaned)
    except:
        return None

def get_data_from_xpath(tree, xpath):
    """
    Helper function to get text from an XPath.
    """
    try:
        # xpath() returns a list, we want the first element's text
        element = tree.xpath(xpath)
        if element:
            return element[0].text_content()
    except Exception as e:
        print(f"Error reading xpath {xpath}: {e}")
    return None

def get_gold_price():
    """
    Scrapes 24K, 22K, and 18K gold prices using the user's XPaths.
    """
    try:
        url = "https://www.goodreturns.in/gold-rates/"
        response = requests.get(url, headers=HEADERS, timeout=10)
        response.raise_for_status()
        
        # Create an lxml tree object that can use XPaths
        tree = html.fromstring(response.content)
        
        prices = {}
        
        # --- 24K ---
        # These are the XPaths you provided
        xpath_24k_today = '/html/body/div[1]/div[2]/div[1]/section[4]/table/tbody/tr[1]/td[2]'
        xpath_24k_yest = '/html/body/div[1]/div[2]/div[1]/section[4]/table/tbody/tr[1]/td[3]'
        xpath_24k_change = '/html/body/div[1]/div[2]/div[1]/section[4]/table/tbody/tr[1]/td[4]'
        
        prices["24K"] = {
            "today": clean_price(get_data_from_xpath(tree, xpath_24k_today)),
            "yesterday": clean_price(get_data_from_xpath(tree, xpath_24k_yest)),
            "change": clean_price(get_data_from_xpath(tree, xpath_24k_change))
        }

        # --- 22K ---
        xpath_22k_today = '/html/body/div[1]/div[2]/div[1]/section[5]/table/tbody/tr[1]/td[2]'
        xpath_22k_yest = '/html/body/div[1]/div[2]/div[1]/section[5]/table/tbody/tr[1]/td[3]'
        xpath_22k_change = '/html/body/div[1]/div[2]/div[1]/section[5]/table/tbody/tr[1]/td[4]'

        prices["22K"] = {
            "today": clean_price(get_data_from_xpath(tree, xpath_22k_today)),
            "yesterday": clean_price(get_data_from_xpath(tree, xpath_22k_yest)),
            "change": clean_price(get_data_from_xpath(tree, xpath_22k_change))
        }

        # --- 18K ---
        xpath_18k_today = '/html/body/div[1]/div[2]/div[1]/section[6]/table/tbody/tr[1]/td[2]'
        xpath_18k_yest = '/html/body/div[1]/div[2]/div[1]/section[6]/table/tbody/tr[1]/td[3]'
        xpath_18k_change = '/html/body/div[1]/div[2]/div[1]/section[6]/table/tbody/tr[1]/td[4]'

        prices["18K"] = {
            "today": clean_price(get_data_from_xpath(tree, xpath_18k_today)),
            "yesterday": clean_price(get_data_from_xpath(tree, xpath_18k_yest)),
            "change": clean_price(get_data_from_xpath(tree, xpath_18k_change))
        }
                        
        return prices

    except Exception as e:
        print(f"Error fetching gold price: {e}")
        return None

def get_silver_price():
    """
    Scrapes silver price using the user's XPath.
    """
    try:
        url = "https://www.goodreturns.in/silver-rates/"
        response = requests.get(url, headers=HEADERS, timeout=10)
        response.raise_for_status()
        
        tree = html.fromstring(response.content)
        
        # This is the XPath you provided for 1G silver
        xpath_silver = '/html/body/div[1]/div[2]/div[1]/section[5]/table/tbody/tr[1]/td[2]'
        
        price = clean_price(get_data_from_xpath(tree, xpath_silver))
        
        if price is None:
            return None
            
        # Return a structured dictionary
        return {
            "1 G": {
                "today": price
            }
        }
    except Exception as e:
        print(f"Error fetching silver price: {e}")
        return None
