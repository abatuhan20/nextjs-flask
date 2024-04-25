from flask import Flask, jsonify
from flask_cors import CORS

# app instance
app = Flask(__name__)
CORS(app)

# /api/home
@app.route("/api/home", methods=['GET'])
def return_home():
    return jsonify({
        'message': "Hello world! My Book Recommendation site template.",
        'kitap': ['Kitap1', 'Kitap2', 'Kitap3']
    })
# python server.py başlatma kodu

if __name__ == "__main__":
    app.run(debug=True, port=8080)