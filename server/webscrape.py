import requests
from bs4 import BeautifulSoup
import pandas as pd
import mysql.connector
from dotenv import load_dotenv
import os
from openai import OpenAI


# Sırası çok önemli burayı uygulamazsam keyi çekmiyor asla
load_dotenv()
client = OpenAI(
    api_key=os.environ.get("OPENAI_API_KEY"),
)

# Veritabanı bağlantısı
mydb = mysql.connector.connect(
    host=os.environ.get("HOST"),
    user=os.environ.get("USER"),
    password=os.environ.get("PASSWORD"),
    database=os.environ.get("DATABASE"),  
    charset='utf8mb4'
)
mycursor = mydb.cursor()

book_data = []
for i in range(50):
    url = 'https://www.kitapyurdu.com/index.php?route=product/category&page=' + str(i + 2) + '&filter_category_all=true&path=1&filter_in_stock=1&sort=purchased_365&order=DESC'

    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36'}
    response = requests.get(url, headers=headers)

    soup = BeautifulSoup(response.content.decode("utf-8"), 'html.parser')
    parent_element = soup.find_all('div', class_='product-cr')
    print(len(parent_element))
    book_links = []
    for parent_element in parent_element:
        child_element = parent_element.find('a', class_='pr-img-link')
        if child_element:
            book_links.append(child_element.get("href"))
        else:
            print("Link bulunamadı")

    for link in book_links:
        response = requests.get(link, headers=headers)
        soup = BeautifulSoup(response.content, 'html.parser')
        title_element = soup.find('h1', class_='pr_header__heading')
        author_element = soup.find('a', class_='pr_producers__link')
        description_element = soup.find('span', class_='info__text')
        publisher_element = soup.find('div', class_='pr_producers__publisher')
        if publisher_element:
            publisher_element = publisher_element.find('a', class_='pr_producers__link')
        image_url_element = soup.find('div', class_='book-front')
        if image_url_element:
            image_url_element = image_url_element.find('img', id='js-book-cover')

        title = title_element.text.strip() if title_element else "Title Not Found"
        author = author_element.text.strip() if author_element else "Author Not Found"
        description = description_element.text.strip() if description_element else "Description Not Found"
        publisher = publisher_element.text.strip() if publisher_element else "Publisher Not Found"
        site_url = link
        image_url = image_url_element.get('src') if image_url_element else "Image Not Found"

        # Veritabanında aynı başlığa sahip bir kitap olup olmadığını kontrol et
        mycursor.execute("SELECT COUNT(*) FROM books WHERE title = %s", (title,))
        result = mycursor.fetchone()
        if result[0] > 0:
            print(f"{title} zaten veritabanında mevcut, atlanıyor.")
            continue

        embedding_vector = client.embeddings.create(input=description, model="text-embedding-3-small").data[0].embedding
        embedding_vector_str = ",".join(map(str, embedding_vector))

        sql = "INSERT INTO books (title, author, description, publisher, site_url, image_url, embedding_vector) VALUES (%s, %s, %s, %s, %s, %s, %s)"
        val = (title, author, description, publisher, site_url, image_url, embedding_vector_str)
        mycursor.execute(sql, val)
        mydb.commit()

        print(mycursor.rowcount, "record inserted.")

        book_data.append({'Title': title, 'Author': author, 'Description': description, 'Publisher': publisher, 'Site URL': site_url, 'Image URL': image_url, 'Embedding Vector': embedding_vector_str})

books_df = pd.DataFrame(book_data)
print(book_links)
print(books_df)

books_df.to_csv('kitapyurdu_books.csv', index=False)
