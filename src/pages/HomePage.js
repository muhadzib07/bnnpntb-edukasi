// HomePage.js
import React from 'react';

const HomePage = ({ setCurrentPage }) => (
  <div className="p-8 text-center">
    <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Selamat Datang di Portal Edukasi BNN</h2>
    <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
      Membangun generasi muda yang bersih dari narkoba adalah tanggung jawab kita bersama. Mari bersama-sama edukasi diri dan keluarga.
    </p>
    <button
      onClick={() => setCurrentPage('about')}
      className="bg-green-500 text-white font-semibold py-3 px-6 rounded-full shadow-lg hover:bg-green-600 transition duration-300"
    >
      Pelajari Lebih Lanjut
    </button>
  </div>
);

export default HomePage;
