import React from 'react';
import Image from 'next/image';
import resim2 from '@/public/resim1.jpg'

function Anasayfa() {
  return (
    <>
      <div className='p-10'>
        <h1 className="mt-4 pl-12 pt-8 font-semibold text-3xl">Bir sonraki okuyacağım kitap ne olmalı?</h1>
        <div className='flex flex-row max-sm:flex-wrap m-auto'>
          <p className='p-8 text-lg'>İyi kitaplar ararken, sıklıkla çok satanlar listesine göz atar, internette ve sosyal medya platformlarında dolaşır, ve dostlarımızın önerilerini alırız. Ancak, standart kategoriler ve türler genellikle fazla geniş gelir ve çoğu zaman ruh halimize veya ilgi alanlarımıza göre kitap seçmekte zorlanırız. Eğer ilginç kitaplar arıyorsanız, çok beğeneceğiniz özel önerilere sahibiz. Kitap öneri bölümümüze giderek hayalinizdeki kitabı arayabilirsiniz!</p>
          <Image src={resim2} width={500} className='h-auto rounded'/>
        </div>
      </div>
    </>
  );
}

export default Anasayfa;
