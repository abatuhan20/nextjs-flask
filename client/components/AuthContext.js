import React, { createContext, useContext, useState, useEffect } from 'react';

// Context oluşturma
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Oturum durumunu kontrol eden fonksiyon
  const verifyToken = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:8080/api/verify_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // JWT tokenını Authorization başlığında gönderin
      }
    });
  
    if (response.ok) {
      const data = await response.json();
      console.log('Token is valid for user:', data.user);
      setIsLoggedIn(true);
    } else {
      console.error('Token verification failed');
      setIsLoggedIn(false);
    }
  };
  // Bileşen montajı sırasında oturum durumunu kontrol et
  useEffect(() => {
    verifyToken();
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
