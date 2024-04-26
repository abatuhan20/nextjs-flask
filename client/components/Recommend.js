import React, { useEffect, useState } from 'react';
import BookCard from './BookCard';
import Image from 'next/image';
import books from '@/public/books.jpg'

const Recommend = () => {
  const [message, setMessage] = useState('');
  const [kitap, setKitap] = useState([]);
  const [topics, setTopics] = useState('');
  const [interests, setInterests] = useState('');
  const [recommendationMade, setRecommendationMade] = useState(false);
  const [inputWarning, setInputWarning] = useState(false);
  const [recommendationSuccess, setRecommendationSuccess] = useState(false);

  const handleRecommend = () => {
    if (!topics || !interests) {
      setInputWarning(true);
      alert("Lütfen tüm alanları doldurun.");
      setRecommendationSuccess(false);
      return;
    }
    console.log('Topics:', topics);
    console.log('Interests:', interests);
    setRecommendationMade((prev) => !prev);
    setRecommendationSuccess(true);
    setInputWarning(false);
  };

  useEffect(() => {
    fetch('http://localhost:8080/api/home')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        return response.json();
      })
      .then((data) => {
        setMessage(data.message);
        setKitap(data.kitap);
      })
      .catch((error) => {
        setMessage('Error fetching data');
        console.error('Fetch error:', error);
      });
  }, []);

  return (
    <div className='flex flex-col justify-center text-center'>
      <h2 className='text-3xl'>Bana kitap öner!</h2>
      <div className='flex flex-col items-center'>
        <label htmlFor="topics-input" className="block text-gray-700 font-bold mb-2">Hangi konuda kitap önerisi almak istersiniz? (veya bir metin girin)</label>
        <input type="text" className="w-1/2 h-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 block px-4 py-2 border border-gray-300 bg-white rounded-md shadow-sm" id="favorite-books" name="topics" placeholder="Metin veya konu giriniz..." value={topics} onChange={(e) => setTopics(e.target.value)} />
        <label htmlFor="interests-input" className="block text-gray-700 font-bold mb-2 pt-4">İlgi alanlarınız ve hobileriniz</label>
        <input type="text" className="w-1/2 h-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 block px-4 py-2 border border-gray-300 bg-white rounded-md shadow-sm" id="interests-input" name="interests" placeholder="İlgi alanlarınız ve hobileriniz ile ilgili bilgi veriniz, virgül ile ayırın..." value={interests} onChange={(e) => setInterests(e.target.value)} />
        <button className="btn btn-recommend mt-4 mb-4" onClick={handleRecommend}>Kitap Öner!</button>
        {inputWarning && (
          <p className="text-red-500">Lütfen tüm alanları doldurun.</p>
        )}
        {recommendationSuccess && (
          <p className="text-green-500">Öneriniz başarıyla gönderildi!</p>
        )}
      </div>
      {/* Kitap kartı üretim kısmı */}
       {recommendationMade && (
        <div className="book-card-container">
          {kitap.map((book, index) => (
            <BookCard
              key={index}
              title={book.title}
              author={book.author}
              publisher={book.publisher}
              description={book.description}
              rating={book.rating}
              siteUrl={book.siteUrl}
              imageUrl={book.imageUrl}
            />
          ))}
        </div>
      )}
      <div className="p-8 flex justify-center">
        <Image src={books} alt='anasayfa-resim' className='rounded w-auto'/>
      </div>
    </div>
  );
};

export default Recommend;