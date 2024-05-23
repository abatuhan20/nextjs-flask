import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/components/AuthContext';

const Profile = () => {
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [allBooks, setAllBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token && !isLoggedIn) {
          router.push('/login');
          return;
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
        setFirstName(data.first_name || '');
        setLastName(data.last_name || '');
        setSelectedBooks(data.selected_books || []);

        const booksResponse = await fetch('http://localhost:8080/api/books');
        const booksData = await booksResponse.json();
        setAllBooks(booksData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleSelectBook = (bookTitle) => {
    setSelectedBooks((prev) => {
      if (prev.includes(bookTitle)) {
        return prev.filter((title) => title !== bookTitle);
      } else if (prev.length < 5) {
        return [...prev, bookTitle];
      }
      return prev;
    });
  };

  const handleSaveProfile = async () => {
    const response = await fetch('http://localhost:8080/api/profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        first_name: firstName,
        last_name: lastName,
        selected_books: selectedBooks,
      }),
    });

    if (response.ok) {
      alert('Profile updated successfully');
    } else {
      alert('Failed to update profile');
    }
  };

  const handleGetRecommendations = async () => {
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
      router.push('/recommend');
    } else {
      alert('Failed to get recommendations');
    }
  };

  const filteredBooks = allBooks.filter(book =>
    book.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Profil
          </h2>
        </div>
        <div className="rounded-md shadow-sm -space-y-px">
          <div>
            <label htmlFor="firstName" className="sr-only">
              First Name
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              autoComplete="firstName"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="lastName" className="sr-only">
              Last Name
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              autoComplete="lastName"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-4">
          <h3 className="text-lg font-medium text-gray-900">
            Maksimum 5 adet kitap seçiniz.
          </h3>
          <input
            type="text"
            placeholder="Search books..."
            className="mt-2 appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="mt-2 max-h-60 overflow-y-auto">
            {allBooks
              .filter((book) =>
                book.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((book) => (
                <div key={book} className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    checked={selectedBooks.includes(book)}
                    onChange={() => handleSelectBook(book)}
                  />
                  <label
                    htmlFor={book}
                    className="ml-2 block text-sm text-gray-900"
                  >
                    {book}
                  </label>
                </div>
              ))}
          </div>
          <p className="mt-2 text-sm text-gray-600">
            Gösterilen {filteredBooks.length} adet kitap
          </p>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900">Seçtiğiniz Kitaplar</h3>
          <ul className="list-disc pl-5 mt-2">
            {selectedBooks.map((book) => (
              <li key={book} className="text-sm text-gray-900">
                {book}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 space-y-2">
          <button
            onClick={handleSaveProfile}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Profili Kaydet
          </button>
          <button
            onClick={handleGetRecommendations}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Öneri Sayfasına Git
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;

         
