import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/components/AuthContext';

const Profile = () => {
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [allBooks, setAllBooks] = useState([]);
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
      // Add your logic to display recommended books
    } else {
      alert('Failed to get recommendations');
    }
  };

  return (
    <div>
      <h2>Profile</h2>
      <input 
        type="text" 
        placeholder="First Name" 
        value={firstName} 
        onChange={(e) => setFirstName(e.target.value)} 
      />
      <input 
        type="text" 
        placeholder="Last Name" 
        value={lastName} 
        onChange={(e) => setLastName(e.target.value)} 
      />
      <h3>Select up to 5 books</h3>
      <div>
        {allBooks.map((book) => (
          <div key={book}>
            <input
              type="checkbox"
              checked={selectedBooks.includes(book)}
              onChange={() => handleSelectBook(book)}
            />
            {book}
          </div>
        ))}
      </div>
      <button onClick={handleSaveProfile}>Save Profile</button>
      <button onClick={handleGetRecommendations}>Get Recommendations</button>
    </div>
  );
};

export default Profile;
