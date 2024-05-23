from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, JWTManager
from datetime import timedelta
import mysql.connector
import os
from openai import OpenAI
import json
from dotenv import load_dotenv
import numpy as np

# Load environment variables
load_dotenv()

# Initialize OpenAI client
client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

# MySQL connection
mydb = mysql.connector.connect(
    host=os.environ.get("HOST"),
    user=os.environ.get("USER"),
    password=os.environ.get("PASSWORD"),
    database=os.environ.get("DATABASE"),
    charset='utf8mb4'
)
mycursor = mydb.cursor(buffered=True)
def parse_embedding(embedding_str):
    return np.array([float(x) for x in embedding_str.split(',')])

# Flask app setup
app = Flask(__name__)
CORS(app)
bcrypt = Bcrypt(app)
app.config["JWT_SECRET_KEY"] = "mysuperuperdubersecretkey"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)
jwt = JWTManager(app)

@app.route('/api/verify_token', methods=['POST'])
@jwt_required()  # Bu endpoint sadece doğrulanmış kullanıcılar için erişilebilir olacak
def verify_token():
    current_user = get_jwt_identity()
    return jsonify(message='Token is valid', user=current_user), 200
# Function to calculate GPT embedding

def calculate_gpt_embedding(text):
    try:
        response = client.embeddings.create(
            input=text,
            model="text-embedding-3-small"
        )
        return response.data[0].embedding
    except Exception as e:
        print(f"Error in calculating GPT embedding: {e}")
        return None

# Endpoint to return home
@app.route("/api/home", methods=['POST'])
def return_home():
    data = request.json
    user_text = data.get('text')
    if not user_text:
        return jsonify({'error': 'Text parameter is missing'}), 400

    user_embedding = calculate_gpt_embedding(user_text)
    if user_embedding is None:
        return jsonify({'error': 'Failed to calculate GPT embedding'}), 500

    def cosine_similarity(a, b):
        dot_product = sum(x * y for x, y in zip(a, b))
        magnitude_a = sum(x ** 2 for x in a) ** 0.5
        magnitude_b = sum(y ** 2 for y in b) ** 0.5
        return dot_product / (magnitude_a * magnitude_b)

    mycursor.execute("SELECT title, description FROM books")
    books = mycursor.fetchall()
    
    similarities = [(book[0], cosine_similarity(user_embedding, calculate_gpt_embedding(book[1]))) for book in books]
    sorted_books = sorted(similarities, key=lambda x: x[1], reverse=True)

    recommendations = [
        {
            'title': book[0],
            'author': next((item['author'] for item in books if item['title'] == book[0]), None),
            'publisher': next((item['publisher'] for item in books if item['title'] == book[0]), None),
            'description': next((item['description'] for item in books if item['title'] == book[0]), None),
            'similarityScore': book[1],
            'siteUrl': next((item['site_url'] for item in books if item['title'] == book[0]), None),
            'imageUrl': next((item['image_url'] for item in books if item['title'] == book[0]), None)
        }
        for book in sorted_books[:3]
    ]

    return jsonify({
        'message': "Book Recommendations",
        'books': recommendations,
    })

# Endpoint for user registration
@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    first_name = data.get('first_name')
    last_name = data.get('last_name')

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    sql = "INSERT INTO users (username, password, first_name, last_name) VALUES (%s, %s, %s, %s)"
    val = (username, hashed_password, first_name, last_name)
    mycursor.execute(sql, val)
    mydb.commit()
    return jsonify({'message': 'User registered successfully'}), 201

# Endpoint for user login
@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    mycursor.execute("SELECT * FROM users WHERE username = %s", (username,))
    user = mycursor.fetchone()

    if user and bcrypt.check_password_hash(user[2], password):
        access_token = create_access_token(identity=username)
        return jsonify({'message': 'Login successful', 'access_token': access_token})
    else:
        return jsonify({'message': 'Invalid credentials'}), 401

# Endpoint for user profile
@app.route('/api/profile', methods=['GET', 'POST'])
@jwt_required()
def profile():
    current_user = get_jwt_identity()
    mycursor.execute("SELECT * FROM users WHERE username = %s", (current_user,))
    user = mycursor.fetchone()
    
    if request.method == 'GET':
        return jsonify({
            'username': user[1],
            'first_name': user[3],
            'last_name': user[4],
            'profile_image_url': user[5],
            'selected_books': json.loads(user[6]) if user[6] else []
        })

    if request.method == 'POST':
        data = request.json
        selected_books = json.dumps(data.get('selected_books'),ensure_ascii=False)
        sql = "UPDATE users SET selected_books = %s WHERE username = %s"
        val = (selected_books, current_user)
        mycursor.execute(sql, val)
        mydb.commit()
        return jsonify({'message': 'Profile updated successfully'})

# Endpoint for getting all books
@app.route('/api/books', methods=['GET'])
def get_books():
    mycursor.execute("SELECT title FROM books")
    books = mycursor.fetchall()
    return jsonify([book[0] for book in books])

@app.route('/api/recommendations', methods=['POST'])
@jwt_required()
def recommendations():
    current_user = get_jwt_identity()
    mycursor.execute("SELECT selected_books FROM users WHERE username = %s", (current_user,))
    selected_books_json = mycursor.fetchone()[0]

    if not selected_books_json:
        return jsonify({'error': 'No books selected'}), 400

    selected_books = json.loads(selected_books_json)
    selected_embeddings = []
    for book_title in selected_books:
        mycursor.execute("SELECT embedding_vector FROM books WHERE title = %s", (book_title,))
        embedding = mycursor.fetchone()
        if embedding:
            try:
                selected_embeddings.append(parse_embedding(embedding[0]))
            except ValueError as e:
                print(f"Error parsing embedding for book {book_title}: {e}")
                continue

    def cosine_similarity(a, b):
        dot_product = np.dot(a, b)
        magnitude_a = np.linalg.norm(a)
        magnitude_b = np.linalg.norm(b)
        if magnitude_a == 0 or magnitude_b == 0:
            return 0
        return dot_product / (magnitude_a * magnitude_b)

    mycursor.execute("SELECT title, embedding_vector FROM books")
    all_books = mycursor.fetchall()

    similarities = []
    for book in all_books:
        if book[0] in selected_books:
            continue
        try:
            book_embedding = parse_embedding(book[1])
        except ValueError as e:
            print(f"Error parsing embedding for book {book[0]}: {e}")
            continue
        similarity = max(cosine_similarity(book_embedding, selected_embedding) for selected_embedding in selected_embeddings)
        similarities.append((book[0], similarity))

    sorted_books = sorted(similarities, key=lambda x: x[1], reverse=True)
    recommendations = sorted_books[:3]

    recommended_books = []
    for book in recommendations:
        mycursor.execute("SELECT title, author, publisher, description, site_url, image_url FROM books WHERE title = %s", (book[0],))
        book_data = mycursor.fetchone()
        if book_data:
            recommended_books.append({
                'title': book_data[0],
                'author': book_data[1],
                'publisher': book_data[2],
                'description': book_data[3],
                'siteUrl': book_data[4],
                'imageUrl': book_data[5],
                'similarityScore': book[1]
            })

    return jsonify({
        'message': "Recommended Books",
        'books': recommended_books,
    })


if __name__ == "__main__":
    app.run(debug=True, port=8080)
