import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './components/Home';
import Pair from './components/Pair';
import Tickers from './components/Tickers';
import Ticker from './components/Ticker';
import SuggestedPairs from './components/SuggestedPairs';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="pair" element={<Pair />} />
            <Route path="tickers" element={<Tickers />} />
            <Route path="ticker/:ticker" element={<Ticker />} />
            <Route path="suggested-pairs" element={<SuggestedPairs />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;