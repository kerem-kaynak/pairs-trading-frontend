import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BACKEND_HOST } from '../envConfig';

const Home = () => {
  const [pairs, setPairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPairs = async () => {
      try {
        const response = await fetch(`${BACKEND_HOST}/api/model-chosen-pairs`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch pairs');
        }
        const data = await response.json();
        setPairs(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPairs();
  }, []);

  if (loading) return <div className="text-center mt-8">Loading...</div>;
  if (error) return <div className="text-center mt-8 text-red-600">Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Model Chosen Pairs</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pairs.map((pair) => (
          <Link to={`/pair?ticker_1=${pair.ticker_1}&ticker_2=${pair.ticker_2}`} key={pair.id}>
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4">
                <h2 className="text-xl font-semibold text-center">{pair.ticker_1} / {pair.ticker_2}</h2>
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-600 text-center">Click to view details</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;