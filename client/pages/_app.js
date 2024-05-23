import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import ScrollToTopButton from '@/components/ScrollToTopButton';
import "@/styles/globals.css";
import { AuthProvider } from '@/components/AuthContext';

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Navbar/>
      <Component {...pageProps} />
      <ScrollToTopButton />
    </AuthProvider>
  );
}
