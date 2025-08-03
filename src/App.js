/* global __firebase_config, __app_id, __initial_auth_token */
import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithCustomToken, signInAnonymously } from 'firebase/auth';
import { getFirestore, collection, onSnapshot, query, addDoc, serverTimestamp, doc, getDoc, updateDoc } from 'firebase/firestore';

// Menggunakan tailwindcss secara langsung dalam aplikasi React.
import 'tailwindcss/tailwind.css';

// --- Global Variables (Canvas Environment) ---
// Mendeklarasikan variabel global dengan nilai default terlebih dahulu
// untuk menghindari kesalahan `no-undef` dari ESLint.
let firebaseConfig = {
  // Ganti dengan konfigurasi Firebase Anda jika perlu.
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

// Komponen Halaman Berita & Materi yang sudah diperbaiki
const NewsAndMaterialsPage = ({ userId, showMessage }) => {
  const [contentList, setContentList] = useState([]);
  const [isDataLoading, setIsDataLoading] = useState(true);

  useEffect(() => {
    const contentCollectionPath = `artifacts/${appId}/public/data/content`;
    const q = query(collection(db, contentCollectionPath));

    setIsDataLoading(true);

    // Menggunakan onSnapshot untuk mendengarkan perubahan data secara real-time.
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedContent = [];
      querySnapshot.forEach((doc) => {
        fetchedContent.push({ id: doc.id, ...doc.data() });
      });
      // Sort data in-memory to avoid Firestore index issues for now.
      fetchedContent.sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0));
      setContentList(fetchedContent);
      setIsDataLoading(false);
    }, (error) => {
      console.error("Gagal mendengarkan data: ", error);
      setIsDataLoading(false);
      showMessage("Gagal memuat konten. Silakan coba lagi.", "red");
    });

    return () => unsubscribe();
  }, [showMessage]);

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
                  Ditambahkan oleh user: {item.userId?.substring(0, 8)}... pada {new Date(item.timestamp?.seconds * 1000).toLocaleString()}
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

// Komponen Halaman Kuis (daftar kuis)
const QuizSelectionPage = ({ quizzes, setCurrentPage, setActiveQuiz }) => (
    <div className="p-8">
      <h2 className="text-3xl md:text-4xl font-bold text-purple-600 mb-6">Pilih Kuis</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.length > 0 ? (
          quizzes.map(quiz => (
            <div key={quiz.id} className="bg-white p-6 rounded-lg shadow-lg flex flex-col">
              <h3 className="text-xl font-bold text-gray-800 mb-2">{quiz.title}</h3>
              <p className="text-gray-600 flex-grow mb-4">{quiz.description}</p>
              <button
                onClick={() => {
                  setActiveQuiz(quiz);
                  setCurrentPage('activeQuiz');
                }}
                className="mt-auto w-full bg-purple-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-purple-600 transition duration-300"
              >
                Mulai Kuis
              </button>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-3">Belum ada kuis yang tersedia.</p>
        )}
      </div>
    </div>
  );

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
          onClick={() => setCurrentPage('home')}
          className="bg-green-500 text-white font-semibold py-3 px-6 rounded-full shadow-lg hover:bg-green-600 transition duration-300"
        >
          Kembali ke Beranda
        </button>
      </div>
    );
  };

// Komponen Halaman Admin
const AdminPage = ({ isAdmin, showMessage }) => {
  const [formInput, setFormInput] = useState({ title: '', content: '', type: 'berita', description: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quizForm, setQuizForm] = useState({ title: '', description: '', questions: [{ question: '', options: ['', '', '', ''], answer: '' }] });
  
  const handleNewsInputChange = (e) => {
    const { name, value } = e.target;
    setFormInput(prev => ({ ...prev, [name]: value }));
  };
  
  const handleQuizInputChange = (e, questionIndex, inputType) => {
    const { name, value } = e.target;
    const newQuestions = [...quizForm.questions];
    if (inputType === 'option') {
      const optionIndex = parseInt(name.split('-')[2], 10);
      newQuestions[questionIndex].options[optionIndex] = value;
    } else {
      newQuestions[questionIndex][name] = value;
    }
    setQuizForm(prev => ({ ...prev, questions: newQuestions }));
  };

  const addQuizQuestion = () => {
    setQuizForm(prev => ({
      ...prev,
      questions: [...prev.questions, { question: '', options: ['', '', '', ''], answer: '' }]
    }));
  };

  const handleNewsSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const newsData = { ...formInput, userId: auth.currentUser.uid, timestamp: serverTimestamp() };
      const collectionPath = `artifacts/${appId}/public/data/content`;
      await addDoc(collection(db, collectionPath), newsData);
      showMessage('Konten berita berhasil ditambahkan!', 'green');
      setFormInput({ title: '', content: '', type: 'berita', description: '' });
    } catch (error) {
      console.error('Error adding document: ', error);
      showMessage('Gagal menambahkan konten.', 'red');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuizSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const quizData = { ...quizForm, userId: auth.currentUser.uid, timestamp: serverTimestamp() };
      const collectionPath = `artifacts/${appId}/public/data/quizzes`;
      await addDoc(collection(db, collectionPath), quizData);
      showMessage('Kuis berhasil ditambahkan!', 'green');
      setQuizForm({ title: '', description: '', questions: [{ question: '', options: ['', '', '', ''], answer: '' }] });
    } catch (error) {
      console.error('Error adding quiz: ', error);
      showMessage('Gagal menambahkan kuis.', 'red');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAdmin) {
    return <div className="p-8 text-center text-red-500">Akses Ditolak</div>;
  }
  
  return (
    <div className="p-8">
      <h2 className="text-3xl md:text-4xl font-bold text-purple-600 mb-6">Halaman Admin</h2>
      
      {/* Formulir Tambah Berita/Materi */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
        <h3 className="text-2xl font-semibold mb-4 text-gray-800">Tambah Berita & Materi</h3>
        <form onSubmit={handleNewsSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            value={formInput.title}
            onChange={handleNewsInputChange}
            placeholder="Judul Berita/Materi"
            required
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
          <textarea
            name="content"
            value={formInput.content}
            onChange={handleNewsInputChange}
            placeholder="Isi Berita/Materi"
            required
            className="w-full p-3 border border-gray-300 rounded-lg h-32 resize-none"
          />
          <select
            name="type"
            value={formInput.type}
            onChange={handleNewsInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg"
          >
            <option value="berita">Berita</option>
            <option value="materi">Materi</option>
          </select>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-green-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-600 transition duration-300 disabled:bg-gray-400"
          >
            {isSubmitting ? 'Menambahkan...' : 'Tambah Konten'}
          </button>
        </form>
      </div>

      {/* Formulir Tambah Kuis */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-2xl font-semibold mb-4 text-gray-800">Tambah Kuis Baru</h3>
        <form onSubmit={handleQuizSubmit} className="space-y-4">
            <input
              type="text"
              name="title"
              value={quizForm.title}
              onChange={(e) => setQuizForm(prev => ({...prev, title: e.target.value}))}
              placeholder="Judul Kuis"
              required
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
            <textarea
              name="description"
              value={quizForm.description}
              onChange={(e) => setQuizForm(prev => ({...prev, description: e.target.value}))}
              placeholder="Deskripsi Kuis"
              required
              className="w-full p-3 border border-gray-300 rounded-lg h-24 resize-none"
            />

            {quizForm.questions.map((q, qIndex) => (
              <div key={qIndex} className="p-4 border border-gray-200 rounded-lg bg-gray-50 space-y-3">
                  <p className="font-semibold text-gray-700">Pertanyaan {qIndex + 1}</p>
                  <input
                    type="text"
                    name="question"
                    value={q.question}
                    onChange={(e) => handleQuizInputChange(e, qIndex)}
                    placeholder="Teks Pertanyaan"
                    required
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                  {q.options.map((option, oIndex) => (
                    <input
                      key={oIndex}
                      type="text"
                      name={`option-${qIndex}-${oIndex}`}
                      value={option}
                      onChange={(e) => handleQuizInputChange(e, qIndex, 'option')}
                      placeholder={`Opsi Jawaban ${String.fromCharCode(65 + oIndex)}`}
                      required
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                  ))}
                  <input
                    type="text"
                    name="answer"
                    value={q.answer}
                    onChange={(e) => handleQuizInputChange(e, qIndex)}
                    placeholder="Jawaban Benar (harus sama dengan salah satu opsi)"
                    required
                    className="w-full p-2 border border-gray-300 rounded-lg bg-yellow-100"
                  />
              </div>
            ))}

            <button
              type="button"
              onClick={addQuizQuestion}
              className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
            >
              Tambah Pertanyaan
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-purple-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-purple-600 transition duration-300 disabled:bg-gray-400"
            >
              {isSubmitting ? 'Menambahkan...' : 'Tambah Kuis'}
            </button>
        </form>
      </div>
    </div>
  );
};

// Komponen Halaman Login
const LoginPage = ({ setCurrentPage, showMessage }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      showMessage('Login berhasil!', 'green');
      setCurrentPage('home');
    } catch (error) {
      console.error('Login gagal: ', error.message);
      let errorMessage = 'Login gagal. Periksa email dan password.';
      if (error.code === 'auth/invalid-credential') {
        errorMessage = 'Email atau password salah.';
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = 'Pengguna tidak ditemukan.';
      }
      showMessage(errorMessage, 'red');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 text-center">Login</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="w-full p-3 border border-gray-300 rounded-lg"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          className="w-full p-3 border border-gray-300 rounded-lg"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-green-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-600 transition duration-300 disabled:bg-gray-400"
        >
          {isSubmitting ? 'Login...' : 'Login'}
        </button>
      </form>
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Belum punya akun?{' '}
          <button
            onClick={() => setCurrentPage('register')}
            className="text-green-600 hover:underline font-semibold"
          >
            Daftar di sini.
          </button>
        </p>
      </div>
    </div>
  );
};

// --- Komponen Halaman Register (BARU) ---
const RegisterPage = ({ setCurrentPage, showMessage }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      showMessage('Password tidak cocok.', 'red');
      return;
    }
    setIsSubmitting(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      showMessage('Registrasi berhasil! Silakan login.', 'green');
      setCurrentPage('login');
    } catch (error) {
      console.error('Registrasi gagal: ', error.message);
      let errorMessage = 'Registrasi gagal. Silakan coba lagi.';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Email sudah digunakan.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password terlalu lemah (minimal 6 karakter).';
      }
      showMessage(errorMessage, 'red');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 text-center">Registrasi</h2>
      <form onSubmit={handleRegister} className="space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="w-full p-3 border border-gray-300 rounded-lg"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          className="w-full p-3 border border-gray-300 rounded-lg"
        />
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Konfirmasi Password"
          required
          className="w-full p-3 border border-gray-300 rounded-lg"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-purple-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-purple-600 transition duration-300 disabled:bg-gray-400"
        >
          {isSubmitting ? 'Mendaftar...' : 'Daftar'}
        </button>
      </form>
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Sudah punya akun?{' '}
          <button
            onClick={() => setCurrentPage('login')}
            className="text-purple-600 hover:underline font-semibold"
          >
            Login di sini.
          </button>
        </p>
      </div>
    </div>
  );
};


// --- Komponen Tata Letak ---
const Navigation = ({ currentPage, setCurrentPage, isAdmin, isLoggedIn, handleLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);

  const navItems = [
    { name: 'Beranda', page: 'home', color: 'green' },
    { name: 'Tentang BNN', page: 'about', color: 'green' },
    { name: 'Bahaya Narkoba', page: 'danger', color: 'red' },
    { name: 'Rehabilitasi', page: 'rehabilitation', color: 'blue' },
    { name: 'Berita & Materi', page: 'newsAndMaterials', color: 'green' },
    { name: 'Kuis', page: 'quiz', color: 'purple' },
  ];
  
  const adminNavItem = { name: 'Admin', page: 'admin', color: 'purple' };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <h1 className="text-2xl font-bold text-green-600">BNN Edukasi</h1>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <button
                  key={item.page}
                  onClick={() => setCurrentPage(item.page)}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    currentPage === item.page ? `bg-${item.color}-500 text-white` : 'text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {item.name}
                </button>
              ))}
              {isAdmin && (
                <button
                  onClick={() => setCurrentPage(adminNavItem.page)}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    currentPage === adminNavItem.page ? `bg-${adminNavItem.color}-500 text-white` : 'text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {adminNavItem.name}
                </button>
              )}
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-md text-sm font-medium text-white bg-red-500 hover:bg-red-600"
                >
                  Logout
                </button>
              ) : (
                <button
                  onClick={() => setCurrentPage('login')}
                  className="px-3 py-2 rounded-md text-sm font-medium text-white bg-green-500 hover:bg-green-600"
                >
                  Login
                </button>
              )}
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={toggleMenu}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Buka menu utama</span>
              {!isOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <button
                key={item.page}
                onClick={() => {
                  setCurrentPage(item.page);
                  setIsOpen(false);
                }}
                className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                  currentPage === item.page ? `bg-${item.color}-500 text-white` : 'text-gray-800 hover:bg-gray-200'
                }`}
              >
                {item.name}
              </button>
            ))}
            {isAdmin && (
              <button
                onClick={() => {
                  setCurrentPage(adminNavItem.page);
                  setIsOpen(false);
                }}
                className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                  currentPage === adminNavItem.page ? `bg-${adminNavItem.color}-500 text-white` : 'text-gray-800 hover:bg-gray-200'
                }`}
              >
                {adminNavItem.name}
              </button>
            )}
            {isLoggedIn ? (
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white bg-red-500 hover:bg-red-600"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => {
                  setCurrentPage('login');
                  setIsOpen(false);
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white bg-green-500 hover:bg-green-600"
              >
                Login
                </button>
              )}
          </div>
        </div>
      )}
    </nav>
  );
};


const Footer = () => (
  <footer className="bg-gray-800 text-white py-6 mt-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <p>&copy; 2024 BNN Edukasi. Hak Cipta Dilindungi.</p>
      <p className="text-sm text-gray-400 mt-2">
        Situs ini bertujuan untuk edukasi dan pencegahan.
      </p>
    </div>
  </footer>
);

// --- Komponen Utama Aplikasi ---
const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [quizzes, setQuizzes] = useState([]);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [score, setScore] = useState(0);

  // Fungsi untuk menampilkan pesan toast
  const showMessage = (msg, type = 'blue') => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  // Efek untuk inisialisasi otentikasi
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (initialAuthToken) {
          await signInWithCustomToken(auth, initialAuthToken);
        } else {
          await signInAnonymously(auth);
        }
      } catch (error) {
        console.error("Firebase Auth Error:", error);
      } finally {
        setIsAuthReady(true);
      }
    };
    initAuth();
  }, []);

  // Efek untuk mendengarkan perubahan status otentikasi
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoggedIn(!!currentUser && currentUser.isAnonymous === false);
      setIsAdmin(currentUser && currentUser.uid === ADMIN_USER_ID);
    });
    return () => unsubscribe();
  }, []);

  // Efek untuk mengambil data kuis dari Firestore
  useEffect(() => {
    if (!isAuthReady) return;

    const quizzesCollectionPath = `artifacts/${appId}/public/data/quizzes`;
    const q = query(collection(db, quizzesCollectionPath));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedQuizzes = [];
      querySnapshot.forEach((doc) => {
        fetchedQuizzes.push({ id: doc.id, ...doc.data() });
      });
      setQuizzes(fetchedQuizzes);
    }, (error) => {
      console.error("Gagal mendengarkan data kuis: ", error);
      showMessage("Gagal memuat kuis. Silakan coba lagi.", "red");
    });

    return () => unsubscribe();
  }, [isAuthReady, showMessage]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setCurrentPage('home');
      showMessage('Anda telah keluar.', 'blue');
    } catch (error) {
      console.error('Logout gagal: ', error.message);
      showMessage('Gagal keluar. Silakan coba lagi.', 'red');
    }
  };

  const handleQuizSubmission = (e, selectedAnswers) => {
    e.preventDefault();
    if (!activeQuiz) return;
  
    let correctCount = 0;
    activeQuiz.questions.forEach((q, index) => {
      const selected = selectedAnswers[index];
      if (selected === q.answer) {
        correctCount++;
      }
    });
  
    setScore(correctCount);
    setCurrentPage('certificate');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage setCurrentPage={setCurrentPage} />;
      case 'about':
        return <AboutPage />;
      case 'danger':
        return <DangerPage />;
      case 'rehabilitation':
        return <RehabilitationPage />;
      case 'newsAndMaterials':
        return <NewsAndMaterialsPage showMessage={showMessage} />;
      case 'quiz':
        return <QuizSelectionPage quizzes={quizzes} setCurrentPage={setCurrentPage} setActiveQuiz={setActiveQuiz} />;
      case 'activeQuiz':
        return activeQuiz ? <QuizPage activeQuiz={activeQuiz} handleSubmit={handleQuizSubmission} /> : <div className="p-8 text-center text-red-500">Kuis tidak ditemukan.</div>;
      case 'certificate':
        return <CertificatePage user={user} activeQuiz={activeQuiz} score={score} setCurrentPage={setCurrentPage} />;
      case 'login':
        return <LoginPage setCurrentPage={setCurrentPage} showMessage={showMessage} />;
      case 'register': // Kasus baru untuk halaman register
        return <RegisterPage setCurrentPage={setCurrentPage} showMessage={showMessage} />;
      case 'admin':
        return <AdminPage isAdmin={isAdmin} showMessage={showMessage} />;
      default:
        return <HomePage setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <Navigation
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        isAdmin={isAdmin}
        isLoggedIn={isLoggedIn}
        handleLogout={handleLogout}
      />
      {message && (
        <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg text-white z-50 animate-fade-in-out ${message.includes('gagal') ? 'bg-red-500' : 'bg-blue-500'}`}>
          {message}
        </div>
      )}
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

// Untuk me-render aplikasi di root element
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
