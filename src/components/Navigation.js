// Navigation.js
import React, { useState } from 'react';

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
          <div className="md:hidden flex items-center">
            <button onClick={toggleMenu} className="text-gray-800 hover:text-gray-600 focus:outline-none focus:text-gray-600">
              <svg className="hamburger-icon-svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map(item => (
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
                className="px-3 py-2 rounded-md text-sm font-medium text-white bg-red-500 hover:bg-red-600 transition duration-300"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => setCurrentPage('login')}
                className="px-3 py-2 rounded-md text-sm font-medium text-white bg-green-500 hover:bg-green-600 transition duration-300"
              >
                Login Admin
              </button>
            )}
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map(item => (
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
                Login Admin
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
