import React, { useState, useEffect } from 'react';
import { FaAngleDoubleUp } from 'react-icons/fa';

function UpButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
    className={`w-full flex justify-end px-4 md:px-20 sticky top-0 left-0 bottom-1 right-1 ${
      isVisible ? 'visible' : 'hidden'
    }`}
  >
    <button
      className='w-[50px] h-[50px] rounded-full bg-blue-900 flex justify-center items-center animate-bounce absolute bottom-10 md:bottom-20'
      onClick={scrollToTop}
    >
      <FaAngleDoubleUp className='text-white scale-150' />
    </button>
  </div>
  );
}

export default UpButton;