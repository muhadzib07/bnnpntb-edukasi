import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

/**
 * Komponen formulir untuk menambahkan berita baru ke Firestore.
 * @param {object} props - Props komponen.
 * @param {object} props.db - Instance Firestore.
 * @param {string} props.appId - ID Aplikasi dari Firebase.
 * @param {string} props.userId - ID pengguna yang sedang masuk.
 */
function NewsForm({ db, appId, userId }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) {
      // Menggunakan console.log untuk menghindari alert
      console.log('Judul dan isi berita tidak boleh kosong.');
      return;
    }
    
    if (!db) {
      setError('Database tidak tersedia.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const newsData = {
        title: title,
        content: content,
        timestamp: serverTimestamp(),
        authorId: userId,
      };
      
      const collectionPath = `/artifacts/${appId}/public/data/news`;
      await addDoc(collection(db, collectionPath), newsData);
      
      setTitle('');
      setContent('');
      console.log('Berita berhasil ditambahkan!');
    } catch (e) {
      console.error('Error adding document: ', e);
      setError('Gagal menambahkan berita.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl w-full bg-white rounded-xl shadow-lg p-6 sm:p-8">
      {/* Formulir untuk menambah berita baru */}
      <h1 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-6">Tambahkan Berita Baru</h1>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-3 mb-4 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-gray-700 text-sm font-semibold mb-2">
            Judul Berita
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Masukkan judul berita"
            required
          />
        </div>
        <div>
          <label htmlFor="content" className="block text-gray-700 text-sm font-semibold mb-2">
            Isi Berita
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg h-40 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Masukkan isi berita lengkap"
            required
          ></textarea>
        </div>
        <button
          type="submit"
          disabled={isSubmitting || !db || !userId}
          className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md disabled:bg-gray-400"
        >
          {isSubmitting ? 'Menambahkan...' : 'Tambahkan Berita'}
        </button>
      </form>
    </div>
  );
}

export default NewsForm;
