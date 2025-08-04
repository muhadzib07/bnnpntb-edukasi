import React, { useState, useEffect, useCallback } from 'react';
import { getAuth, onAuthStateChanged, signInWithCustomToken, signInAnonymously } from 'firebase/auth';
import { getFirestore, collection, onSnapshot, addDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';

// Variabel global dari lingkungan Canvas
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

// Inisialisasi Firebase
let app, auth, db;
try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} catch (e) {
  console.error("Gagal menginisialisasi Firebase:", e);
}

const MaterialManager = () => {
  const [user, setUser] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [materials, setMaterials] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');

  const showMessage = useCallback((msg, type = 'info') => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 5000);
  }, []);

  useEffect(() => {
    if (!app) {
      console.error("Firebase belum diinisialisasi.");
      return;
    }

    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        try {
          if (initialAuthToken) {
            await signInWithCustomToken(auth, initialAuthToken);
          } else {
            await signInAnonymously(auth);
          }
        } catch (error) {
          console.error("Gagal masuk:", error);
        }
      }
      setUser(currentUser);
      setIsAuthReady(true);
      setIsLoading(false);
    });

    return () => unsubscribeAuth();
  }, [initialAuthToken]);

  useEffect(() => {
    if (!isAuthReady || !user) {
      return;
    }

    const materialCollection = collection(db, 'artifacts', appId, 'public', 'data', 'materials');
    const q = query(materialCollection, orderBy("createdAt", "desc"));
    const unsubscribeSnapshot = onSnapshot(q, (querySnapshot) => {
      const fetchedMaterials = [];
      querySnapshot.forEach((doc) => {
        fetchedMaterials.push({ id: doc.id, ...doc.data() });
      });
      setMaterials(fetchedMaterials);
    }, (error) => {
      console.error("Gagal mengambil materi:", error);
      showMessage("Gagal mengambil materi dari database.", 'error');
    });

    return () => unsubscribeSnapshot();
  }, [isAuthReady, user, db, appId, showMessage]);

  const handleAddMaterial = async (e) => {
    e.preventDefault();
    if (!newTitle || !newContent) {
      showMessage("Judul dan isi materi tidak boleh kosong.", 'error');
      return;
    }

    try {
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'materials'), {
        title: newTitle,
        content: newContent,
        createdAt: serverTimestamp(),
      });
      showMessage("Materi berhasil ditambahkan!");
      setNewTitle('');
      setNewContent('');
    } catch (error) {
      console.error("Gagal menambahkan materi:", error);
      showMessage("Gagal menambahkan materi. Coba lagi.", 'error');
    }
  };

  if (!isAuthReady || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-8">
        <div className="text-center text-lg text-gray-600">Memuat...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      {message && (
        <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg text-white z-50 animate-fade-in-out ${message.includes('Gagal') ? 'bg-red-500' : 'bg-blue-500'}`}>
          {message}
        </div>
      )}

      <div className="container mx-auto max-w-4xl bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Manajemen Materi Edukasi</h1>

        <form onSubmit={handleAddMaterial} className="mb-8 p-6 bg-gray-50 rounded-lg shadow-inner">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Tambah Materi Baru</h2>
          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-700 font-medium mb-2">Judul Materi</label>
            <input
              type="text"
              id="title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
              placeholder="Masukkan judul materi"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="content" className="block text-gray-700 font-medium mb-2">Isi Materi</label>
            <textarea
              id="content"
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
              rows="6"
              placeholder="Tuliskan isi materi di sini..."
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg shadow-md transition duration-150 ease-in-out transform hover:scale-105"
          >
            Simpan Materi
          </button>
        </form>

        <h2 className="text-xl font-semibold text-gray-700 mb-4">Daftar Materi</h2>
        {materials.length === 0 ? (
          <p className="text-gray-500 italic text-center">Belum ada materi yang ditambahkan.</p>
        ) : (
          <div className="space-y-4">
            {materials.map((material) => (
              <div key={material.id} className="bg-gray-50 p-6 rounded-lg shadow-md border border-gray-200">
                <h3 className="text-lg font-bold text-gray-800 mb-2">{material.title}</h3>
                <p className="text-gray-600 mb-4">{material.content}</p>
                <small className="text-gray-400">
                  Dipublikasikan pada: {material.createdAt ? new Date(material.createdAt.toDate()).toLocaleString() : 'Tanggal tidak tersedia'}
                </small>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MaterialManager;
