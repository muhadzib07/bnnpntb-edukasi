import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Jika Anda ingin mengukur performa di aplikasi Anda, kirimkan sebuah fungsi
// untuk mencatat hasil (misalnya: reportWebVitals(console.log))
// atau kirimkan ke endpoint analitik. Pelajari lebih lanjut: https://bit.ly/CRA-vitals
reportWebVitals();
