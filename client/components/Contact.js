import React, { useState } from 'react';
import emailjs from '@emailjs/browser';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [formStatus, setFormStatus] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const serviceID = 'service_ci3utdo';
    const templateID = 'template_bnsrk4q';
    const userID = 'Vy5ZsTQCSWioxj66N';

    const templateParams = {
      from_name: formData.name,
      from_email: formData.email,
      message: formData.message,
      to_name: 'Arda',
      to_email: 'abatuhan20@gmail.com',
    };

    try {
      await emailjs.send(serviceID, templateID, templateParams, userID);
      setFormStatus('Mesajınız başarıyla gönderildi!');
      setFormData({
        name: '',
        email: '',
        message: '',
      });
    } catch (error) {
      console.error('Email gönderimi başarısız:', error);
      setFormStatus('Mesaj gönderilirken bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  return (
    /*min-h-screen Gerekirse kullan */
    <div className="flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">İletişim</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sorularınız veya geri bildirimleriniz için benimle iletişime geçin.
          </p>
          <p className="mt-2 text-center text-sm text-gray-600">
            Arda Batuhan Aydın - İstanbul Ticaret Üniversitesi - 200021986
          </p>
          <p className="mt-2 text-center text-sm text-gray-600">
            Kitap Öneri Bitirme Projesi
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="name" className="sr-only">
                İsim
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="İsim"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="email" className="sr-only">
                Email adresi
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email adresi"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="message" className="sr-only">
                Mesaj
              </label>
              <textarea
                id="message"
                name="message"
                rows="4"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Mesaj"
                value={formData.message}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Gönder
            </button>
          </div>

          {formStatus && (
            <div className="text-center text-green-500 mt-4">
              {formStatus}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Contact;
