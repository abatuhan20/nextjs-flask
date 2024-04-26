/* React imports */
import React, { useEffect, useState } from 'react';

/* Component imports */
import Navbar from '@/components/Navbar';
import Anasayfa from '@/components/Anasayfa';
import Recommend from '@/components/Recommend';
import ScrollToTopButton from '@/components/ScrollToTopButton';

const Home = () => {
  const [message, setMessage] = useState('Loading');
  const [kitap, setKitap] = useState([]);
  const isLoggedIn = true;

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
    <div>
      <Navbar isLoggedIn={isLoggedIn}/>
      <Anasayfa/>
      <Recommend/>
      <ScrollToTopButton/>
    </div>
  );
}

export default Home;
