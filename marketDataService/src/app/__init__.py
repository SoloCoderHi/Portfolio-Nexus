from flask import Flask, request, jsonify
from .clients.stock_client import search_stocks, get_stock_price
from .clients.mf_client import search_mutual_funds, get_mutual_fund_nav
from .clients.crypto_client import search_crypto, get_crypto_price
from .clients.nps_client import search_nps, get_nps_nav
from .clients.metals_client import get_gold_price, get_silver_price

app = Flask(__name__)

@app.route('/', methods=['GET'])
def handle_get():
    return 'Hello world'

@app.route('/health', methods=['GET'])
def health_check():
    return 'OK'

@app.route('/search/stock', methods=['GET'])
def handle_stock_search():
    query = request.args.get('q')
    if not query:
        return jsonify({'error': 'Query parameter "q" is required'}), 400
    results = search_stocks(query)
    return jsonify(results)

@app.route('/price/stock/<string:symbol>', methods=['GET'])
def handle_stock_price(symbol):
    price = get_stock_price(symbol)
    if price is None:
        return jsonify({'error': f'Price not found for symbol {symbol}'}), 404
    # Return the price in a clean JSON format
    return jsonify({'symbol': symbol, 'price': price})

@app.route('/search/mf', methods=['GET'])
def handle_mf_search():
    query = request.args.get('q')
    if not query:
        return jsonify({'error': 'Query parameter "q" is required'}), 400
    results = search_mutual_funds(query)
    return jsonify(results)

@app.route('/price/mf/<string:scheme_code>', methods=['GET'])
def handle_mf_price(scheme_code):
    nav = get_mutual_fund_nav(scheme_code)
    if nav is None:
        return jsonify({'error': f'NAV not found for scheme code {scheme_code}'}), 404
    return jsonify({'scheme_code': scheme_code, 'nav': nav})

@app.route('/search/crypto', methods=['GET'])
def handle_crypto_search():
    query = request.args.get('q')
    if not query:
        return jsonify({'error': 'Query parameter "q" is required'}), 400
    results = search_crypto(query)
    return jsonify(results)

@app.route('/price/crypto/<string:coin_id>', methods=['GET'])
def handle_crypto_price(coin_id):
    price = get_crypto_price(coin_id)
    if price is None:
        return jsonify({'error': f'Price not found for coin {coin_id}'}), 404
    # We return the price in USD, as requested from the API
    return jsonify({'id': coin_id, 'price': price, 'currency': 'usd'})

@app.route('/search/nps', methods=['GET'])
def handle_nps_search():
    query = request.args.get('q')
    if not query:
        return jsonify({'error': 'Query parameter "q" is required'}), 400
    results = search_nps(query)
    return jsonify(results)

@app.route('/price/nps/<string:scheme_id>', methods=['GET'])
def handle_nps_price(scheme_id):
    nav = get_nps_nav(scheme_id)
    if nav is None:
        return jsonify({'error': f'NAV not found for NPS scheme {scheme_id}'}), 404
    # The API provides NAV as a string, so we just return it
    return jsonify({'scheme_id': scheme_id, 'nav': nav})

@app.route('/price/gold', methods=['GET'])
def handle_gold_price():
    prices = get_gold_price()
    if not prices:
        return jsonify({'error': 'Price not found for gold'}), 404
    return jsonify(prices)

@app.route('/price/silver', methods=['GET'])
def handle_silver_price():
    prices = get_silver_price()
    if not prices:
        return jsonify({'error': 'Price not found for silver'}), 404
    return jsonify(prices)

if __name__ == "__main__":
    app.run(host="localhost", port=8010, debug=True)