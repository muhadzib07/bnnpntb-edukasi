// NewsPage.js
import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';

const NewsPage = ({ userId, isAuthReady, showMessage, db, appId }) => {
  const [contentList, setContentList] = useState([]);
  const [isDataLoading, setIsDataLoading] = useState(true);

  useEffect(() => {
    if (!isAuthReady || !db) return;
    
    const contentCollectionPath = `artifacts/${appId}/public/data/content`;
    const q = query(collection(db, contentCollectionPath), orderBy('timestamp', 'desc'));

    setIsDataLoading(true);

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedContent = [];
      querySnapshot.forEach((doc) => {
        fetchedContent.push({ id: doc.id, ...doc.data() });
      });
      setContentList(fetchedContent);
      setIsDataLoading(false);
    }, (error) => {
      console.error("Gagal mendengarkan data: ", error);
      setIsDataLoading(false);
      showMessage("Gagal memuat konten. Silakan coba lagi.", "red");
    });

    return () => unsubscribe();
  }, [isAuthReady, showMessage, db, appId]);

  return (
    <div className="p-8">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Berita & Materi Edukasi</h2>
      <p className="text-gray-700 leading-relaxed mb-6">
        Informasi terbaru seputar BNN dan materi edukasi untuk pencegahan narkoba.
      </p>
      <h3 className="text-2xl font-semibold mb-4 text-gray-800">Daftar Konten</h3>
      {isDataLoading ? (
        <p className="text-center text-gray-500">Memuat konten...</p>
      ) : (
        <div className="space-y-6">
          {contentList.length > 0 ? (
            contentList.map((item) => (
              <div key={item.id} className="bg-white p-6 rounded-lg shadow-lg">
                <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full mb-2 ${item.type === 'berita' ? 'bg-blue-200 text-blue-800' : 'bg-green-200 text-green-800'}`}>
                  {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                </span>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed mb-2">{item.content}</p>
                <p className="text-sm text-gray-500">
                  Ditambahkan oleh user: {item.userId?.substring(0, 8)}...
                </p>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">Belum ada konten yang tersedia.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default NewsPage;
