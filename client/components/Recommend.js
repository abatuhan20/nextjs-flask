import React, { useEffect, useState } from 'react';
import BookCard from './BookCard';
import Image from 'next/image';
import { useAuth } from '@/components/AuthContext';
import { useRouter } from 'next/router';
import books from '@/public/books.jpg';

const Recommend = () => {
  const { isLoggedIn } = useAuth();
  const [message, setMessage] = useState('');
  const [kitap, setKitap] = useState([]);
  const [recommendationMade, setRecommendationMade] = useState(false);
  const [recommendationSuccess, setRecommendationSuccess] = useState(false);
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [username, setUsername] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          return; // Eğer token yoksa, profil verisini çekme
        }

        const response = await fetch('http://localhost:8080/api/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.status === 401) {
          router.push('/login');
          return;
        }

        const data = await response.json();
        setSelectedBooks(data.selected_books || []);
        setUsername(data.username || '');
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (isLoggedIn) {
      fetchData();
    }
  }, [isLoggedIn, router]);

  const handleGetRecommendations = async () => {
    if (!isLoggedIn) {
      alert("Lütfen giriş yapınız.");
      return;
    }

    const response = await fetch('http://localhost:8080/api/recommendations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    const data = await response.json();
    if (response.ok) {
      console.log('Recommended books:', data.books);
      setMessage(data.message);
      setKitap(data.books);
      setRecommendationMade(true);
      setRecommendationSuccess(true);
    } else {
      setMessage('Failed to get recommendations');
      setRecommendationSuccess(false);
    }
  };

  return (
    <div className='flex flex-col justify-center text-center'>
      <h2 className='text-3xl'>Bana kitap öner!</h2>
      <div className='flex flex-col items-center'>
        <p className="text-lg font-bold mb-2 pt-4">Profilinizde seçili kitap isimleri</p>
        {isLoggedIn ? (
          <ul className="list-disc mb-4">
            {selectedBooks.map((book, index) => (
              <li key={index} className="text-sm">{book}</li>
            ))}
          </ul>
        ) : (
          <p className="text-red-500 mb-4">Kullanıcı girişi yapılmadı</p>
        )}
        <p className="text-sm mb-4">Kullanıcı adı: {isLoggedIn ? username : 'Lütfen giriş yapınız'}</p>
        <button className="btn btn-recommend mt-4 mb-4" onClick={handleGetRecommendations}>Kitap Öner!</button>
        {recommendationSuccess && (
          <p className="text-green-500">Öneriniz başarıyla alındı!</p>
        )}
        {message && !recommendationSuccess && (
          <p className="text-red-500">{message}</p>
        )}
      </div>
      {recommendationMade && (
        <div className="book-card-container">
          {kitap.map((book, index) => (
            <BookCard
              key={index}
              title={book.title}
              author={book.author}
              publisher={book.publisher}
              description={book.description}
              similarityScore={book.similarityScore}
              siteUrl={book.siteUrl}
              imageUrl={book.imageUrl=="Image Not Found" ? "https://www.forewordreviews.com/books/covers/what-lucy-taught-us.jpg" : book.imageUrl}
            />
          ))}
        </div>
      )}
      <div className="p-8 flex justify-center">
        <Image src={books} alt='anasayfa-resim' className='rounded w-auto' />
      </div>
    </div>
  );
};

export default Recommend;
