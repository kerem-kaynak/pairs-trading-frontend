import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

const Layout = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? "bg-gray-200" : "";
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-md">
        <nav className="mt-5">
          <Link to="/" className={`block py-2 px-4 text-gray-700 hover:bg-gray-200 ${isActive('/')}`}>Home</Link>
          <Link to="/tickers" className={`block py-2 px-4 text-gray-700 hover:bg-gray-200 ${isActive('/tickers')}`}>All Tickers</Link>
          <Link to="/suggested-pairs" className={`block py-2 px-4 text-gray-700 hover:bg-gray-200 ${isActive('/suggested-pairs')}`}>Suggested Pairs</Link>
        </nav>
      </aside>
      <main className="flex-1 overflow-y-auto p-5">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;