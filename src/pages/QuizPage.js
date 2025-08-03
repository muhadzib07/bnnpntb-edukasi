// QuizPage.js
import React from 'react';

const QuizPage = ({ quizzes, setCurrentPage, setActiveQuiz }) => (
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

export default QuizPage;
