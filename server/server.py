from flask import Flask, jsonify, request
from flask_cors import CORS
import random
from dotenv import load_dotenv
import os
from openai import OpenAI

# Sırası çok önemli burayı uygulamazsam keyi çekmiyor asla
load_dotenv()
client = OpenAI(
    api_key=os.environ.get("OPENAI_API_KEY"),
)

# GPT 3-small modelini kullanarak embedding olusturuyorum
def calculate_gpt_embedding(text):
    try:
        response = client.embeddings.create(
            input=text,
            model="text-embedding-3-small"
        )
        return response.data[0].embedding
    except Exception as e:
        # Log the error
        print(f"Error in calculating GPT embedding: {e}")
        return None

# Dummy book data
dummy_books = [
    {
        'title': 'Söyleme Bilmesinler',
        'author': 'Şermin Yaşar',
        'publisher': 'DOĞAN KİTAP',
        'description': '“Yalansızız artık. Hâlâ birkaç sırrımız var. Ama yalansızız. Evlenip aynı çatı altında yaşıyorlar diye karı koca olur mu insanlar?',
        'rating': random.randint(1, 5),
        'imageUrl': 'https://img.kitapyurdu.com/v1/getImage/fn:11815086/wh:true/wi:220',
        'siteUrl': 'https://www.kitapyurdu.com/kitap/soyleme-bilmesinler/668247.html'
    },
    {
        'title': 'Cehaletten Kurtulma Sanatı',
        'author': 'Celal Şengör ',
        'publisher': 'MASA KİTAP',
        'description': 'Tarihte kanunlar veya kurallar değil, kişiler ve onların şahsî dehâları önemlidir. Tarihin doğal kanunları olduğunu zannedenler hep hüsrana uğramışlardır. Onun için bu kitapta okuyucularıma, birkaç büyük insanın çarpıcı bulduğum yönlerini anlatmak istedim. Bu ve benzeri insanlar hayatta bana kılavuz oldu. ',
        'rating': random.randint(1, 5),
        'imageUrl': 'https://img.kitapyurdu.com/v1/getImage/fn:11879538/wh:true/wi:220',
        'siteUrl': 'https://www.kitapyurdu.com/kitap/cehaletten-kurtulma-sanati-kim-kimdir/680331.html'
    },
    {
        'title': 'İnsanlığımı Yitirirken',
        'author': 'Osamu Dazai',
        'publisher': 'KAPRA YAYINCILIK',
        'description': 'Gerçek bir korkak, mutluluktan bile dehşet duyar. Ham pamuktan bile berelenir. Neşeden bile yaralanır',
        'rating': random.randint(1, 5),
        'imageUrl': 'https://img.kitapyurdu.com/v1/getImage/fn:11801746/wh:true/wi:220',
        'siteUrl': 'https://www.kitapyurdu.com/kitap/insanligimi-yitirirken/665638.html'
    },
    {
        'title': 'Üç Cisim Problemi',
        'author': 'Cixin Liu',
        'publisher': 'İTHAKİ YAYINLARI',
        'description': 'Yılın bilimkurgu romanı Üç Cisim Problemi, Çince aslından çevirisiyle Türkçede! 2015 Hugo En İyi Roman Ödülü 2014 Nebula Ödülü Adayı 2015 Locus Ödülü Adayı 2015 John W. Campbell Ödülü Adayı Gizli bir askeri proje, uzaylılarla iletişime geçmek için uzaya sinyal gönderir. Bu sinyali yakalayan, yıkımın eşiğindeki bir uygarlık ise Dünya’yı kendisi için istemektedir. “Olağanüstü bir kitap, bilimsel ve felsefi tartışmaların eşsiz bir karışımı.” –George R. R. Martin, Buz ve Ateşin Şarkısı serisinin Hugo, Nebula ve Locus ödüllü yazarı “Cixin Liu, bilimkurgunun süperstarı.” –John Scalzi, Yaşlı Adamın Savaşı serisinin Hugo ve',
        'rating': random.randint(1, 5),
        'imageUrl': 'https://img.kitapyurdu.com/v1/getImage/fn:11332315/wh:true/wi:220',
        'siteUrl': 'https://www.kitapyurdu.com/kitap/uc-cisim-problemi/379066.html'
    },
    {
        'title': 'Aşk Hikayesi',
        'author': 'Prof. Dr. İskender Pala ',
        'publisher': 'KAPI YAYINLARI',
        'description': 'Daha senden gayrı âşık mı yoktur Nedir bu telaşın hay deli gönül Hele düşün devr-i Âdem’den beri Neler gelmiş geçmiş say deli gönülRuhsatî10 Haziran 1617 sabahı Kulaksız Kabristanı’nda hatun kişi mezarı üzerinde, biri hanım üç ceset bulundu. Erkekler mezara kapaklanmış, kadın da erkeklerden birine sarılmış vaziyetteydi. Devrin ases teşkilatı aylar sonra üçünün de aynı vakitte öldüğünü açıkladı; aşk yüzünden…',
        'rating': random.randint(1, 5),
        'imageUrl': 'https://img.kitapyurdu.com/v1/getImage/fn:11875304/wh:true/wi:220',
        'siteUrl': 'https://www.kitapyurdu.com/kitap/ask-hikayesi/662242.html'
    },
    {
        'title': 'Nietzsche Ağladığında',
        'author': 'Irvin D. Yalom',
        'publisher': 'AYRINTI YAYINLARI',
        'description': 'Yoğun ve sürükleyici olan yeni bir düşünce romanı sunuyoruz: Nietzsche Ağladığında. Edebiyatla da düşünülebileceğini gösteren müthiş bir örnek...SAHNE Psikanalizin doğumu arifesindeki 19. yüzyıl Viyana’sı. Entelektüel ortamlar. Hava soğuk.AKTÖRLER Nietzche: Henüz iki kitabı yayımlanmış, kimsenin tanımadığı bir filozof. Yalnızlığı seçmiş. Acılarıyla barışmış. İhaneti tatmış. Tek sahip olduğu şey, valizi ve kafasında tasarladığı kitaplar. Karısı, toplumsal görevleri ve vatanı yok. İnzivayı seviyor. Tanrı’yı öldürmüş. “Ümit kötülüklerin en',
        'rating': random.randint(1, 5),
        'imageUrl': 'https://img.kitapyurdu.com/v1/getImage/fn:11852743/wh:true/wi:220',
        'siteUrl': 'https://www.kitapyurdu.com/kitap/nietzsche-agladiginda/9632.html'
    }
]
# Book descriptionlarının embeddinglerini tuttugum array (dictionary)
book_embeddings = {book['title']: calculate_gpt_embedding(book['description']) for book in dummy_books}


app = Flask(__name__)
CORS(app)

# Endpoint
@app.route("/api/home", methods=['GET', 'POST'])
def return_home():
    # Datayı frontendden alıyorum
    data = request.json
    user_text = data.get('text')
    if not user_text:
        return jsonify({'error': 'Text parameter is missing'}), 400

    # Userdan aldigim textin embeddingini alıyorum
    user_embedding = calculate_gpt_embedding(user_text)

    if user_embedding is None:
        return jsonify({'error': 'Failed to calculate GPT embedding'}), 500

    # Cosine similarity hesapliyorum
    def cosine_similarity(a, b):
        dot_product = sum(x * y for x, y in zip(a, b))
        magnitude_a = sum(x ** 2 for x in a) ** 0.5
        magnitude_b = sum(y ** 2 for y in b) ** 0.5
        return dot_product / (magnitude_a * magnitude_b)

    # Userin girdigi text bilgisi ile her kitabın descriptionunun cosine similaritylerini hesaplıyorum.
    similarities = [(book['title'], cosine_similarity(user_embedding, calculate_gpt_embedding(book['description']))) for book in dummy_books]

    # Similarity score göre kitapları sıralıyorum
    sorted_books = sorted(similarities, key=lambda x: x[1], reverse=True)

    recommendations = [
        {
            'title': book[0],
            'author': next((item['author'] for item in dummy_books if item['title'] == book[0]), None),
            'publisher': next((item['publisher'] for item in dummy_books if item['title'] == book[0]), None),
            'description': next((item['description'] for item in dummy_books if item['title'] == book[0]), None),
            'similarityScore': book[1],
            'siteUrl': next((item['siteUrl'] for item in dummy_books if item['title'] == book[0]), None),
            'imageUrl': next((item['imageUrl'] for item in dummy_books if item['title'] == book[0]), None)
        }
        for book in sorted_books[:3]
    ]


    return jsonify({
        'message': "Book Recommendations",
        'books': recommendations,
    })

# Port önemli serveri başlatıyor
if __name__ == "__main__":
    app.run(debug=True, port=8080)
