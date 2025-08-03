// DangerPage.js
import React from 'react';

const DangerPage = () => (
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

export default DangerPage;
