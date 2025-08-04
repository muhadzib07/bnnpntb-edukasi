/* global __firebase_config, __app_id, __initial_auth_token */
import React, { useState, useEffect, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithCustomToken, signInAnonymously } from 'firebase/auth';
import { getFirestore, collection, onSnapshot, query, addDoc, serverTimestamp, doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';

// Menggunakan tailwindcss secara langsung dalam aplikasi React.
import 'tailwindcss/tailwind.css';

// --- Global Variables (Canvas Environment) ---
// Mendeklarasikan variabel global dengan nilai default terlebih dahulu
// untuk menghindari kesalahan `no-undef` dari ESLint.
let firebaseConfig = {
  // Konfigurasi Firebase Anda.
  apiKey: "AIzaSyAO7XTU1rNf8nR7tvpLWYOVXHJfkqgqVl0",
  authDomain: "ajib-93ee9.firebaseapp.com",
  projectId: "ajib-93ee9",
  storageBucket: "ajib-93ee9.firebasestorage.app",
  messagingSenderId: "252308517260",
  appId: "1:252308517260:web:76660f5c43ec197507a6a9",
  measurementId: "G-94N3X5JNGX"
};
let appId = 'default-app-id';
let initialAuthToken = null;

// Menimpa nilai default jika variabel global disediakan oleh lingkungan Canvas.
if (typeof __firebase_config !== 'undefined') {
  firebaseConfig = JSON.parse(__firebase_config);
}
if (typeof __app_id !== 'undefined') {
  appId = __app_id;
}
if (typeof __initial_auth_token !== 'undefined') {
  initialAuthToken = __initial_auth_token;
}

const ADMIN_USER_ID = "MXadTY0qP0P9AfECqjbHCyWCaoT2"; // ID Admin untuk demo

// Inisialisasi Firebase.
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// --- Komponen Halaman ---

const HomePage = ({ setCurrentPage }) => {
  return (
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
};

const AboutPage = () => {
  return (
    <div className="p-8">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Tentang BNN</h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        Badan Narkotika Nasional (BNN) adalah lembaga pemerintah non-kementerian di Indonesia yang memiliki tugas utama untuk mencegah dan memberantas penyalahgunaan serta peredaran gelap narkotika, psikotropika, prekursor, dan bahan adiktif lainnya.
      </p>
      <p className="text-gray-700 leading-relaxed">
        BNN didirikan berdasarkan Undang-Undang Nomor 35 Tahun 2009 tentang Narkotika. BNN berkomitmen untuk mewujudkan Indonesia yang bersih dari narkoba (Bersinar).
      </p>
    </div>
  );
};

const DangerPage = () => {
  return (
    <div className="p-8">
      <h2 className="text-3xl md:text-4xl font-bold text-red-600 mb-4">Bahaya Narkoba</h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        Penyalahgunaan narkoba memiliki dampak yang sangat merusak, baik secara fisik, mental, maupun sosial. Berikut adalah beberapa bahaya utamanya:
      </p>
      <ul className="list-disc list-inside space-y-2 text-gray-700">
        <li>Kerusakan fungsi otak dan organ tubuh lainnya.</li>
        <li>Gangguan kesehatan mental seperti depresi, kecemasan, dan psikosis.</li>
        <li>Penurunan produktivitas dan prestasi akademik.</li>
        <li>Masalah hukum dan kriminalitas.</li>
        <li>Kerusakan hubungan sosial dan keluarga.</li>
      </ul>
    </div>
  );
};

const RehabilitationPage = () => {
  return (
    <div className="p-8">
      <h2 className="text-3xl md:text-4xl font-bold text-blue-600 mb-4">Rehabilitasi Narkoba</h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        Rehabilitasi adalah jalan terbaik untuk pulih dari kecanduan narkoba. BNN menyediakan layanan rehabilitasi untuk membantu pecandu kembali ke kehidupan normal.
      </p>
      <p className="text-gray-700 leading-relaxed">
        Proses rehabilitasi meliputi detoksifikasi, terapi fisik dan psikologis, serta pembinaan spiritual dan sosial. Jika Anda atau orang terdekat membutuhkan bantuan, jangan ragu untuk menghubungi pusat rehabilitasi BNN terdekat.
      </p>
    </div>
  );
};

// Komponen Modal untuk Edit Konten
const EditContentModal = ({ content, onClose, onUpdateSuccess, showMessage }) => {
    const [formInput, setFormInput] = useState({ ...content });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormInput(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const docRef = doc(db, `artifacts/${appId}/public/data/content`, content.id);
            await updateDoc(docRef, {
                title: formInput.title,
                content: formInput.content,
                type: formInput.type,
            });
            showMessage('Konten berhasil diperbarui!', 'green');
            onUpdateSuccess();
        } catch (error) {
            console.error('Error updating document: ', error);
            showMessage('Gagal memperbarui konten.', 'red');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
            <div className="bg-white p-6 md:p-8 rounded-lg shadow-xl w-full max-w-lg animate-fade-in-up">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit Konten</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Judul</label>
                        <input id="title" type="text" name="title" value={formInput.title} onChange={handleInputChange} required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">Isi</label>
                        <textarea id="content" name="content" value={formInput.content} onChange={handleInputChange} required className="w-full p-3 border border-gray-300 rounded-lg h-32 resize-y focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                        <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Tipe</label>
                        <select id="type" name="type" value={formInput.type} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                            <option value="berita">Berita</option>
                            <option value="materi">Materi</option>
                        </select>
                    </div>
                    <div className="flex justify-end space-x-4 pt-4">
                        <button type="button" onClick={onClose} className="py-2 px-5 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition duration-300">Batal</button>
                        <button type="submit" disabled={isSubmitting} className="py-2 px-5 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-300 disabled:bg-gray-400">{isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Komponen Halaman Berita & Materi dengan fitur Edit/Hapus
const NewsAndMaterialsPage = ({ showMessage, isAuthReady, isAdmin }) => {
  const [contentList, setContentList] = useState([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [editingContent, setEditingContent] = useState(null);
  const [deletingContentId, setDeletingContentId] = useState(null);

  useEffect(() => {
    if (!isAuthReady) return;
    const contentCollectionPath = `artifacts/${appId}/public/data/content`;
    const q = query(collection(db, contentCollectionPath));
    setIsDataLoading(true);
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedContent = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      fetchedContent.sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0));
      setContentList(fetchedContent);
      setIsDataLoading(false);
    }, (error) => {
      console.error("Gagal mendengarkan data: ", error);
      setIsDataLoading(false);
      showMessage("Gagal memuat konten. Silakan coba lagi.", "red");
    });
    return () => unsubscribe();
  }, [isAuthReady, showMessage]);

  const handleDelete = async () => {
    if (!deletingContentId) return;
    try {
      await deleteDoc(doc(db, `artifacts/${appId}/public/data/content`, deletingContentId));
      showMessage('Konten berhasil dihapus.', 'green');
    } catch (error) {
      console.error("Gagal menghapus dokumen: ", error);
      showMessage('Gagal menghapus konten.', 'red');
    } finally {
      setDeletingContentId(null);
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Berita & Materi Edukasi</h2>
      <p className="text-gray-700 leading-relaxed mb-6">Informasi terbaru seputar BNN dan materi edukasi untuk pencegahan narkoba.</p>
      <h3 className="text-2xl font-semibold mb-4 text-gray-800">Daftar Konten</h3>
      {isDataLoading ? <p className="text-center text-gray-500">Memuat konten...</p> : (
        <div className="space-y-6">
          {contentList.length > 0 ? contentList.map((item) => (
            <div key={item.id} className="bg-white p-6 rounded-lg shadow-lg relative group">
              <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full mb-2 ${item.type === 'berita' ? 'bg-blue-200 text-blue-800' : 'bg-green-200 text-green-800'}`}>{item.type.charAt(0).toUpperCase() + item.type.slice(1)}</span>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h3>
              <p className="text-gray-600 leading-relaxed mb-2 whitespace-pre-wrap">{item.content}</p>
              <p className="text-sm text-gray-500">Ditambahkan oleh user: {item.userId?.substring(0, 8)}... pada {item.timestamp ? new Date(item.timestamp.seconds * 1000).toLocaleString() : 'N/A'}</p>
              {isAdmin && (
                <div className="absolute top-4 right-4 flex opacity-0 group-hover:opacity-100 transition-opacity duration-300 space-x-2">
                  <button onClick={() => setEditingContent(item)} className="p-2 bg-yellow-400 text-white rounded-full hover:bg-yellow-500 shadow-md transform hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>
                  </button>
                  <button onClick={() => setDeletingContentId(item.id)} className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-md transform hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg>
                  </button>
                </div>
              )}
            </div>
          )) : <p className="text-center text-gray-500">Belum ada konten yang tersedia.</p>}
        </div>
      )}
      {editingContent && <EditContentModal content={editingContent} onClose={() => setEditingContent(null)} onUpdateSuccess={() => setEditingContent(null)} showMessage={showMessage} />}
      {deletingContentId && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl animate-fade-in-up">
            <h3 className="text-lg font-bold mb-4">Konfirmasi Hapus</h3>
            <p>Apakah Anda yakin ingin menghapus konten ini?</p>
            <div className="mt-6 flex justify-end space-x-4">
              <button onClick={() => setDeletingContentId(null)} className="py-2 px-5 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition duration-300">Batal</button>
              <button onClick={handleDelete} className="py-2 px-5 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition duration-300">Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Komponen Modal untuk Edit Kuis
const EditQuizModal = ({ quiz, onClose, onUpdateSuccess, showMessage }) => {
    const [quizForm, setQuizForm] = useState(JSON.parse(JSON.stringify(quiz)));
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleMainInputChange = (e) => {
        const { name, value } = e.target;
        setQuizForm(prev => ({ ...prev, [name]: value }));
    };

    const handleQuestionChange = (e, qIndex) => {
        const { name, value } = e.target;
        const newQuestions = [...quizForm.questions];
        newQuestions[qIndex][name] = value;
        setQuizForm(prev => ({ ...prev, questions: newQuestions }));
    };

    const handleOptionChange = (e, qIndex, oIndex) => {
        const newQuestions = [...quizForm.questions];
        newQuestions[qIndex].options[oIndex] = e.target.value;
        setQuizForm(prev => ({ ...prev, questions: newQuestions }));
    };

    const addQuestion = () => {
        setQuizForm(prev => ({ ...prev, questions: [...prev.questions, { question: '', options: ['', '', '', ''], answer: '' }] }));
    };

    const removeQuestion = (qIndex) => {
        const newQuestions = quizForm.questions.filter((_, index) => index !== qIndex);
        setQuizForm(prev => ({ ...prev, questions: newQuestions }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const docRef = doc(db, `artifacts/${appId}/public/data/quizzes`, quiz.id);
            await updateDoc(docRef, {
                title: quizForm.title,
                description: quizForm.description,
                questions: quizForm.questions,
            });
            showMessage('Kuis berhasil diperbarui!', 'green');
            onUpdateSuccess();
        } catch (error) {
            console.error('Error updating quiz: ', error);
            showMessage('Gagal memperbarui kuis.', 'red');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
            <div className="bg-white p-6 md:p-8 rounded-lg shadow-xl w-full max-w-2xl animate-fade-in-up max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit Kuis</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" name="title" value={quizForm.title} onChange={handleMainInputChange} placeholder="Judul Kuis" required className="w-full p-3 border border-gray-300 rounded-lg" />
                    <textarea name="description" value={quizForm.description} onChange={handleMainInputChange} placeholder="Deskripsi Kuis" required className="w-full p-3 border border-gray-300 rounded-lg h-24" />
                    <hr/>
                    {quizForm.questions.map((q, qIndex) => (
                        <div key={qIndex} className="p-4 border border-gray-200 rounded-lg bg-gray-50 space-y-3 relative">
                             <p className="font-semibold text-gray-700">Pertanyaan {qIndex + 1}</p>
                             <button type="button" onClick={() => removeQuestion(qIndex)} className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full text-xs hover:bg-red-600">X</button>
                             <input type="text" name="question" value={q.question} onChange={(e) => handleQuestionChange(e, qIndex)} placeholder="Teks Pertanyaan" required className="w-full p-2 border border-gray-300 rounded-lg" />
                             {q.options.map((opt, oIndex) => (
                                 <input key={oIndex} type="text" value={opt} onChange={(e) => handleOptionChange(e, qIndex, oIndex)} placeholder={`Opsi ${oIndex + 1}`} required className="w-full p-2 border border-gray-300 rounded-lg" />
                             ))}
                             <input type="text" name="answer" value={q.answer} onChange={(e) => handleQuestionChange(e, qIndex)} placeholder="Jawaban Benar (harus sama persis dengan salah satu opsi)" required className="w-full p-2 border border-gray-300 rounded-lg" />
                        </div>
                    ))}
                     <button type="button" onClick={addQuestion} className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600">Tambah Pertanyaan</button>
                    <div className="flex justify-end space-x-4 pt-4">
                        <button type="button" onClick={onClose} className="py-2 px-5 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300">Batal</button>
                        <button type="submit" disabled={isSubmitting} className="py-2 px-5 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:bg-gray-400">{isSubmitting ? 'Menyimpan...' : 'Simpan Kuis'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Komponen Halaman Kuis (daftar kuis)
const QuizSelectionPage = ({ quizzes, setCurrentPage, setActiveQuiz, isAuthReady, isAdmin, showMessage }) => {
    const [editingQuiz, setEditingQuiz] = useState(null);
    const [deletingQuizId, setDeletingQuizId] = useState(null);

    const handleDeleteQuiz = async () => {
        if (!deletingQuizId) return;
        try {
            await deleteDoc(doc(db, `artifacts/${appId}/public/data/quizzes`, deletingQuizId));
            showMessage('Kuis berhasil dihapus.', 'green');
        } catch (error) {
            console.error("Gagal menghapus kuis: ", error);
            showMessage('Gagal menghapus kuis.', 'red');
        } finally {
            setDeletingQuizId(null);
        }
    };

    return (
        <div className="p-8">
            <h2 className="text-3xl md:text-4xl font-bold text-purple-600 mb-6">Pilih Kuis</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {quizzes.length > 0 ? (
                    quizzes.map(quiz => (
                        <div key={quiz.id} className="bg-white p-6 rounded-lg shadow-lg flex flex-col group relative">
                            <h3 className="text-xl font-bold text-gray-800 mb-2">{quiz.title}</h3>
                            <p className="text-gray-600 flex-grow mb-4">{quiz.description}</p>
                            <button onClick={() => { setActiveQuiz(quiz); setCurrentPage('activeQuiz'); }} className="mt-auto w-full bg-purple-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-purple-600 transition duration-300">Mulai Kuis</button>
                            {isAdmin && (
                                <div className="absolute top-2 right-2 flex opacity-0 group-hover:opacity-100 transition-opacity duration-300 space-x-2">
                                    <button onClick={() => setEditingQuiz(quiz)} className="p-2 bg-yellow-400 text-white rounded-full hover:bg-yellow-500 shadow-md"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg></button>
                                    <button onClick={() => setDeletingQuizId(quiz.id)} className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-md"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg></button>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500 col-span-3">{isAuthReady ? "Belum ada kuis yang tersedia." : "Memuat kuis..."}</p>
                )}
            </div>
            {editingQuiz && <EditQuizModal quiz={editingQuiz} onClose={() => setEditingQuiz(null)} onUpdateSuccess={() => setEditingQuiz(null)} showMessage={showMessage} />}
            {deletingQuizId && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
                    <div className="bg-white p-6 rounded-lg shadow-xl animate-fade-in-up">
                        <h3 className="text-lg font-bold mb-4">Konfirmasi Hapus</h3>
                        <p>Apakah Anda yakin ingin menghapus kuis ini?</p>
                        <div className="mt-6 flex justify-end space-x-4">
                            <button onClick={() => setDeletingQuizId(null)} className="py-2 px-5 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300">Batal</button>
                            <button onClick={handleDeleteQuiz} className="py-2 px-5 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700">Hapus</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
  
// Komponen Halaman Kuis Aktif
const QuizPage = ({ activeQuiz, handleSubmit }) => {
    const [selectedAnswers, setSelectedAnswers] = useState({});
  
    const handleAnswerChange = (questionIndex, answer) => {
      setSelectedAnswers(prev => ({
        ...prev,
        [questionIndex]: answer
      }));
    };
  
    const isFormValid = () => {
      return Object.keys(selectedAnswers).length === activeQuiz.questions.length;
    };
  
    return (
      <div className="p-8">
        <h2 className="text-3xl md:text-4xl font-bold text-purple-600 mb-6">{activeQuiz.title}</h2>
        <form onSubmit={(e) => handleSubmit(e, selectedAnswers)} className="space-y-8">
          {activeQuiz.questions.map((q, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-lg font-semibold text-gray-800 mb-4">{index + 1}. {q.question}</p>
              <div className="space-y-3">
                {q.options.map((option, i) => (
                  <label key={i} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name={`question-${index}`}
                      value={option}
                      checked={selectedAnswers[index] === option}
                      onChange={() => handleAnswerChange(index, option)}
                      className="form-radio h-5 w-5 text-purple-600"
                    />
                    <span className="text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
          <button
            type="submit"
            disabled={!isFormValid()}
            className={`w-full py-3 px-6 rounded-lg font-bold text-white transition-colors duration-300 ${
              isFormValid() ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            Kirim Jawaban
          </button>
        </form>
      </div>
    );
  };
  
// Komponen Halaman Sertifikat
const CertificatePage = ({ user, activeQuiz, score, setCurrentPage }) => {
    return (
      <div className="p-8 text-center bg-gray-50 rounded-lg shadow-inner">
        <h2 className="text-4xl md:text-5xl font-bold text-green-600 mb-4">Selamat!</h2>
        <p className="text-xl text-gray-700 mb-2">Anda berhasil menyelesaikan kuis:</p>
        <h3 className="text-3xl font-semibold text-purple-600 mb-4">"{activeQuiz.title}"</h3>
        <p className="text-2xl font-bold text-gray-800 mb-6">Dengan skor: {score} / {activeQuiz.questions.length}</p>
        <p className="text-lg text-gray-600 mb-8">
          Sertifikat Anda telah dibuat. Anda dapat melihatnya di halaman profil.
        </p>
        <button
          onClick={() => setCurrentPage('profile')}
          className="bg-green-500 text-white font-semibold py-3 px-6 rounded-full shadow-lg hover:bg-green-600 transition duration-300"
        >
          Lihat Profil
        </button>
      </div>
    );
  };

// Komponen Halaman Profil Pengguna
const ProfilePage = ({ user, isAuthReady, showMessage }) => {
    const [quizResults, setQuizResults] = useState([]);
    const [quizzes, setQuizzes] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!isAuthReady || !user) {
            return;
        }

        const userId = user.uid;
        const quizResultsCollectionPath = `artifacts/${appId}/users/${userId}/quiz_results`;
        const q = query(collection(db, quizResultsCollectionPath));

        const unsubscribe = onSnapshot(q, async (querySnapshot) => {
            const results = [];
            const quizIds = new Set();
            querySnapshot.forEach(doc => {
                const data = doc.data();
                results.push({ id: doc.id, ...data });
                if (data.quizId) {
                    quizIds.add(data.quizId);
                }
            });

            const newQuizzes = {};
            // Menggunakan Promise.all untuk mengambil data kuis secara paralel
            await Promise.all(Array.from(quizIds).map(async (quizId) => {
                try {
                    const quizDocRef = doc(db, `artifacts/${appId}/public/data/quizzes`, quizId);
                    const quizDocSnap = await getDoc(quizDocRef);
                    if (quizDocSnap.exists()) {
                        newQuizzes[quizId] = quizDocSnap.data();
                    }
                } catch (error) {
                    console.error(`Gagal mengambil data kuis ID ${quizId}: `, error);
                }
            }));

            setQuizzes(newQuizzes);
            setQuizResults(results);
            setIsLoading(false);
        }, (error) => {
            console.error("Gagal mendengarkan hasil kuis: ", error);
            showMessage("Gagal memuat riwayat kuis Anda.", "red");
            setIsLoading(false);
        });

        // Mengembalikan fungsi unsubscribe untuk pembersihan
        return () => unsubscribe();
    }, [isAuthReady, user, showMessage]);

    if (!user) return <div className="p-8 text-center text-red-500">Silakan masuk untuk melihat profil Anda.</div>;

    return (
        <div className="p-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">Profil Pengguna</h2>
            <div className="bg-gray-100 p-6 rounded-lg shadow-inner mb-8">
                <p className="text-lg font-semibold text-gray-700">ID Pengguna: <span className="font-mono text-gray-600">{user.uid}</span></p>
                <p className="text-lg font-semibold text-gray-700">Email: <span className="font-mono text-gray-600">{user.email || 'Anonim'}</span></p>
            </div>
            <h3 className="text-2xl font-bold text-purple-600 mb-4">Riwayat Kuis</h3>
            {isLoading ? <p className="text-center text-gray-500">Memuat riwayat kuis...</p> : (
                <div className="space-y-4">
                    {quizResults.length > 0 ? quizResults.map((result) => (
                        <div key={result.id} className="bg-white p-6 rounded-lg shadow-md">
                            <h4 className="text-xl font-bold text-gray-800">{quizzes[result.quizId]?.title || 'Kuis Tidak Ditemukan'}</h4>
                            <p className="text-gray-600 mt-2">Skor Anda: {result.score} / {quizzes[result.quizId]?.questions?.length || '?'}{' '}<span className="text-sm text-gray-500">({result.timestamp ? new Date(result.timestamp.seconds * 1000).toLocaleDateString() : 'N/A'})</span></p>
                        </div>
                    )) : <p className="text-center text-gray-500">Anda belum menyelesaikan kuis apa pun.</p>}
                </div>
            )}
        </div>
    );
};

// Komponen Halaman Admin
const AdminPage = ({ isAdmin, showMessage }) => {
  const [formInput, setFormInput] = useState({ title: '', content: '', type: 'berita' });
  const [isSubmittingNews, setIsSubmittingNews] = useState(false);
  const [quizForm, setQuizForm] = useState({ title: '', description: '', questions: [{ question: '', options: ['', '', '', ''], answer: '' }] });
  const [isSubmittingQuiz, setIsSubmittingQuiz] = useState(false);

  const handleNewsInputChange = (e) => {
    const { name, value } = e.target;
    setFormInput(prev => ({ ...prev, [name]: value }));
  };

  const handleQuizMainInputChange = (e) => {
    const { name, value } = e.target;
    setQuizForm(prev => ({ ...prev, [name]: value }));
  };

  const handleQuizQuestionChange = (e, qIndex) => {
    const { name, value } = e.target;
    const newQuestions = [...quizForm.questions];
    newQuestions[qIndex][name] = value;
    setQuizForm(prev => ({ ...prev, questions: newQuestions }));
  };

  const handleQuizOptionChange = (e, qIndex, oIndex) => {
    const newQuestions = [...quizForm.questions];
    newQuestions[qIndex].options[oIndex] = e.target.value;
    setQuizForm(prev => ({ ...prev, questions: newQuestions }));
  };

  const addQuizQuestion = () => {
    setQuizForm(prev => ({ ...prev, questions: [...prev.questions, { question: '', options: ['', '', '', ''], answer: '' }] }));
  };

  const removeQuizQuestion = (qIndex) => {
    const newQuestions = quizForm.questions.filter((_, index) => index !== qIndex);
    setQuizForm(prev => ({ ...prev, questions: newQuestions }));
  };

  const validateQuizForm = () => {
    if (!quizForm.title.trim() || !quizForm.description.trim()) return false;
    if (quizForm.questions.length === 0) return false;
    for (const q of quizForm.questions) {
      if (!q.question.trim() || !q.answer.trim() || q.options.some(opt => !opt.trim())) return false;
      if (!q.options.includes(q.answer)) return false; // Jawaban harus salah satu dari opsi
    }
    return true;
  };

  const handleNewsSubmit = async (e) => {
    e.preventDefault();
    setIsSubmittingNews(true);
    try {
      await addDoc(collection(db, `artifacts/${appId}/public/data/content`), { ...formInput, userId: auth.currentUser.uid, timestamp: serverTimestamp() });
      showMessage('Konten berhasil ditambahkan!', 'green');
      setFormInput({ title: '', content: '', type: 'berita' });
    } catch (error) {
      console.error('Error adding document: ', error);
      showMessage('Gagal menambahkan konten.', 'red');
    } finally {
      setIsSubmittingNews(false);
    }
  };

  const handleQuizSubmit = async (e) => {
    e.preventDefault();
    if (!validateQuizForm()) {
      showMessage('Harap isi semua field kuis dengan benar. Pastikan jawaban yang benar ada di dalam opsi.', 'red');
      return;
    }
    setIsSubmittingQuiz(true);
    try {
      await addDoc(collection(db, `artifacts/${appId}/public/data/quizzes`), { ...quizForm, userId: auth.currentUser.uid, timestamp: serverTimestamp() });
      showMessage('Kuis berhasil ditambahkan!', 'green');
      setQuizForm({ title: '', description: '', questions: [{ question: '', options: ['', '', '', ''], answer: '' }] });
    } catch (error) {
      console.error('Error adding quiz: ', error);
      showMessage(`Gagal menambahkan kuis: ${error.message}`, 'red');
    } finally {
      setIsSubmittingQuiz(false);
    }
  };

  if (!isAdmin) return <div className="p-8 text-center text-red-500">Akses Ditolak</div>;
  
  return (
    <div className="p-8">
      <h2 className="text-3xl md:text-4xl font-bold text-purple-600 mb-6">Halaman Admin</h2>
      <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
        <h3 className="text-2xl font-semibold mb-4 text-gray-800">Tambah Berita & Materi</h3>
        <form onSubmit={handleNewsSubmit} className="space-y-4">
          <input type="text" name="title" value={formInput.title} onChange={handleNewsInputChange} placeholder="Judul Berita/Materi" required className="w-full p-3 border border-gray-300 rounded-lg" />
          <textarea name="content" value={formInput.content} onChange={handleNewsInputChange} placeholder="Isi Berita/Materi" required className="w-full p-3 border border-gray-300 rounded-lg h-32 resize-none" />
          <select name="type" value={formInput.type} onChange={handleNewsInputChange} className="w-full p-3 border border-gray-300 rounded-lg">
            <option value="berita">Berita</option>
            <option value="materi">Materi</option>
          </select>
          <button type="submit" disabled={isSubmittingNews} className="w-full bg-green-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-600 transition duration-300 disabled:bg-gray-400">{isSubmittingNews ? 'Menambahkan...' : 'Tambah Konten'}</button>
        </form>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-2xl font-semibold mb-4 text-gray-800">Tambah Kuis Baru</h3>
        <form onSubmit={handleQuizSubmit} className="space-y-4">
          <input type="text" name="title" value={quizForm.title} onChange={handleQuizMainInputChange} placeholder="Judul Kuis" required className="w-full p-3 border border-gray-300 rounded-lg" />
          <textarea name="description" value={quizForm.description} onChange={handleQuizMainInputChange} placeholder="Deskripsi Kuis" required className="w-full p-3 border border-gray-300 rounded-lg h-24 resize-none" />
          {quizForm.questions.map((q, qIndex) => (
            <div key={qIndex} className="p-4 border border-gray-200 rounded-lg bg-gray-50 space-y-3 relative">
              <p className="font-semibold text-gray-700">Pertanyaan {qIndex + 1}</p>
              {quizForm.questions.length > 1 && <button type="button" onClick={() => removeQuizQuestion(qIndex)} className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full text-xs hover:bg-red-600">X</button>}
              <input type="text" name="question" value={q.question} onChange={(e) => handleQuizQuestionChange(e, qIndex)} placeholder="Teks Pertanyaan" required className="w-full p-2 border border-gray-300 rounded-lg" />
              {q.options.map((option, oIndex) => <input key={oIndex} type="text" value={option} onChange={(e) => handleQuizOptionChange(e, qIndex, oIndex)} placeholder={`Opsi ${oIndex + 1}`} required className="w-full p-2 border border-gray-300 rounded-lg" />)}
              <input type="text" name="answer" value={q.answer} onChange={(e) => handleQuizQuestionChange(e, qIndex)} placeholder="Jawaban Benar (salin dari salah satu opsi)" required className="w-full p-2 border border-gray-300 rounded-lg" />
            </div>
          ))}
          <button type="button" onClick={addQuizQuestion} className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600">Tambah Pertanyaan</button>
          <button type="submit" disabled={isSubmittingQuiz || !validateQuizForm()} className="w-full bg-purple-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-purple-700 transition duration-300 disabled:bg-gray-400">{isSubmittingQuiz ? 'Menambahkan...' : 'Tambah Kuis'}</button>
        </form>
      </div>
    </div>
  );
};

const LoginPage = ({ setCurrentPage, showMessage }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
      e.preventDefault();
      setIsLoading(true);
      try {
        await signInWithEmailAndPassword(auth, email, password);
        showMessage('Berhasil masuk!', 'green');
      } catch (error) {
        console.error("Gagal masuk:", error);
        showMessage('Email atau kata sandi salah.', 'red');
      } finally {
        setIsLoading(false);
      }
    };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Masuk</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required className="w-full p-3 border border-gray-300 rounded-lg" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Kata Sandi" required className="w-full p-3 border border-gray-300 rounded-lg" />
        <button type="submit" disabled={isLoading} className="w-full bg-blue-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-600 transition duration-300 disabled:bg-gray-400">{isLoading ? 'Memproses...' : 'Masuk'}</button>
      </form>
      <p className="mt-4 text-center text-gray-600">Belum punya akun?{' '}<button onClick={() => setCurrentPage('register')} className="text-blue-500 hover:underline">Daftar sekarang</button></p>
    </div>
  );
};

const RegisterPage = ({ setCurrentPage, showMessage }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      showMessage('Pendaftaran berhasil! Silakan masuk.', 'green');
      setCurrentPage('login');
    } catch (error) {
      console.error("Gagal mendaftar:", error);
      showMessage('Gagal mendaftar. Email sudah terdaftar atau kata sandi kurang kuat.', 'red');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Daftar Akun Baru</h2>
      <form onSubmit={handleRegister} className="space-y-4">
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required className="w-full p-3 border border-gray-300 rounded-lg" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Kata Sandi (min. 6 karakter)" required className="w-full p-3 border border-gray-300 rounded-lg" />
        <button type="submit" disabled={isLoading} className="w-full bg-green-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-600 transition duration-300 disabled:bg-gray-400">{isLoading ? 'Mendaftar...' : 'Daftar'}</button>
      </form>
      <p className="mt-4 text-center text-gray-600">Sudah punya akun?{' '}<button onClick={() => setCurrentPage('login')} className="text-blue-500 hover:underline">Masuk di sini</button></p>
    </div>
  );
};

const Navigation = ({ currentPage, setCurrentPage, isLoggedIn, isAdmin, handleLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navItems = [
    { name: 'Beranda', page: 'home' }, { name: 'Tentang BNN', page: 'about' }, { name: 'Bahaya Narkoba', page: 'danger' },
    { name: 'Rehabilitasi', page: 'rehabilitation' }, { name: 'Materi & Berita', page: 'news' }, { name: 'Kuis', page: 'quizzes' },
  ];
  if (isLoggedIn) navItems.push({ name: 'Profil', page: 'profile' });
  if (isAdmin) navItems.push({ name: 'Admin', page: 'admin' });

  return (
    <nav className="bg-white shadow-md sticky top-0 z-30">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-gray-800"><button onClick={() => setCurrentPage('home')}>BNN Edukasi</button></div>
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-500 hover:text-gray-700 focus:outline-none">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">{isMenuOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />}</svg>
          </button>
        </div>
        <div className={`md:flex items-center space-x-6 ${isMenuOpen ? 'block' : 'hidden'} md:block absolute md:static top-16 left-0 w-full md:w-auto bg-white shadow-md md:shadow-none z-40`}>
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6 p-4 md:p-0">
            {navItems.map((item) => (
              <button key={item.page} onClick={() => { setCurrentPage(item.page); setIsMenuOpen(false); }} className={`font-medium transition duration-300 ${currentPage === item.page ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-600 hover:text-blue-500'}`}>{item.name}</button>
            ))}
          </div>
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 p-4 md:p-0 border-t md:border-t-0 mt-4 md:mt-0 pt-4 md:pt-0">
            {isLoggedIn ? <button onClick={handleLogout} className="bg-red-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-600 transition duration-300">Keluar</button> : <button onClick={() => setCurrentPage('login')} className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300">Masuk</button>}
          </div>
        </div>
      </div>
    </nav>
  );
};

const Footer = () => (
  <footer className="bg-gray-800 text-white py-4 mt-8">
    <div className="container mx-auto text-center">
      <p>&copy; {new Date().getFullYear()} BNN Edukasi. All rights reserved.</p>
    </div>
  </footer>
);

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [message, setMessage] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [quizzes, setQuizzes] = useState([]);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [score, setScore] = useState(0);

  const showMessage = useCallback((msg, type = 'green') => {
    setMessage({text: msg, type: type});
    setTimeout(() => setMessage(null), 5000);
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    showMessage('Berhasil keluar.', 'green');
    setCurrentPage('home');
  };

  const handleQuizSubmit = async (e, answers) => {
    e.preventDefault();
    let correctCount = 0;
    activeQuiz.questions.forEach((q, index) => {
      if (answers[index] === q.answer) correctCount++;
    });
    setScore(correctCount);
    if (user) {
        try {
            const quizResult = { quizId: activeQuiz.id, score: correctCount, totalQuestions: activeQuiz.questions.length, timestamp: serverTimestamp() };
            await addDoc(collection(db, `artifacts/${appId}/users/${user.uid}/quiz_results`), quizResult);
            showMessage('Hasil kuis berhasil disimpan!', 'green');
        } catch (error) {
            console.error('Gagal menyimpan hasil kuis:', error);
            showMessage('Gagal menyimpan hasil kuis.', 'red');
        }
    }
    setCurrentPage('certificate');
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setIsLoggedIn(true);
        setIsAdmin(currentUser.uid === ADMIN_USER_ID);
      } else {
        try {
          if (initialAuthToken) await signInWithCustomToken(auth, initialAuthToken);
          else await signInAnonymously(auth);
        } catch (error) {
          console.error("Gagal masuk anonim:", error);
        }
        setUser(null);
        setIsLoggedIn(false);
        setIsAdmin(false);
      }
      setIsAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!isAuthReady) return;
    const q = query(collection(db, `artifacts/${appId}/public/data/quizzes`));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedQuizzes = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setQuizzes(fetchedQuizzes);
    }, (error) => {
      console.error("Gagal memuat kuis:", error);
      showMessage('Gagal memuat daftar kuis.', 'red');
    });
    return () => unsubscribe();
  }, [isAuthReady, showMessage]);

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <HomePage setCurrentPage={setCurrentPage} />;
      case 'about': return <AboutPage />;
      case 'danger': return <DangerPage />;
      case 'rehabilitation': return <RehabilitationPage />;
      case 'news': return <NewsAndMaterialsPage showMessage={showMessage} isAuthReady={isAuthReady} isAdmin={isAdmin} />;
      case 'quizzes': return <QuizSelectionPage quizzes={quizzes} setCurrentPage={setCurrentPage} setActiveQuiz={setActiveQuiz} isAuthReady={isAuthReady} isAdmin={isAdmin} showMessage={showMessage} />;
      case 'activeQuiz': return <QuizPage activeQuiz={activeQuiz} handleSubmit={handleQuizSubmit} />;
      case 'certificate': return <CertificatePage user={user} activeQuiz={activeQuiz} score={score} setCurrentPage={setCurrentPage} />;
      case 'profile': return <ProfilePage user={user} isAuthReady={isAuthReady} showMessage={showMessage} />;
      case 'login': return <LoginPage setCurrentPage={setCurrentPage} showMessage={showMessage} />;
      case 'register': return <RegisterPage setCurrentPage={setCurrentPage} showMessage={showMessage} />;
      case 'admin': return <AdminPage isAdmin={isAdmin} showMessage={showMessage} />;
      default: return <HomePage setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <style>{`
        .animate-fade-in-out { animation: fadeInOut 5s ease-in-out forwards; }
        @keyframes fadeInOut { 0% { opacity: 0; transform: translateY(-20px); } 10% { opacity: 1; transform: translateY(0); } 90% { opacity: 1; transform: translateY(0); } 100% { opacity: 0; transform: translateY(-20px); } }
        .animate-fade-in-up { animation: fadeInUp 0.3s ease-out; }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
      <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} isAdmin={isAdmin} isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
      {message && <div className={`fixed top-20 right-4 p-4 rounded-lg shadow-lg text-white z-50 animate-fade-in-out ${message.type === 'red' ? 'bg-red-500' : 'bg-green-500'}`}>{message.text}</div>}
      <main className="container mx-auto py-8 px-4">
        <div className="bg-white shadow-lg rounded-lg p-6 md:p-8">
          {isAuthReady ? renderPage() : <div className="p-8 text-center">Memuat...</div>}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;

const container = document.getElementById('root');
if (container) {
    const root = createRoot(container);
    root.render(<App />);
}
