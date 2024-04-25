import React from 'react';
import Image from 'next/image';
import resim1 from '@/public/books.jpg'

function Anasayfa() {
  return (
    <>
      <div className="container">
        <h1 className="mt-4 pl-12 pt-8 font-semibold text-3xl">Bir sonraki okuyacağım kitap ne olmalı?</h1>
        <p className='p-8 text-lg'>İyi kitaplar ararken, sıklıkla çok satanlar listesine göz atar, internette ve sosyal medya platformlarında dolaşır, ve dostlarımızın önerilerini alırız. Ancak, standart kategoriler ve türler genellikle fazla geniş gelir ve çoğu zaman, ruh halimize veya ilgi alanlarımıza göre kitap seçmekte zorlanırız. Eğer ilginç kitaplar arıyorsanız, çok beğeneceğiniz özel önerilere sahibiz. Kitap öneri bölümümüze giderek hayalinizdeki kitabı arayabilirsiniz!</p>
      </div>
          
      <div className="p-8 flex justify-center">
      <Image src={resim1} alt='anasayfa-resim' className='rounded w-auto w-fit'/>
      </div>
    </>
  );
}

export default Anasayfa;
