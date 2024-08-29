import React, { useState, useEffect } from 'react';
import { BACKEND_HOST } from '../envConfig';

const SuggestedPairs = () => {
  const [pairs, setPairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPairs = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${BACKEND_HOST}/api/pairs`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch suggested pairs');
        }

        const data = await response.json();
        setPairs(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching suggested pairs:', err);
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
      <h1 className="text-3xl font-bold mb-6">Suggested Pairs</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pairs.map((pair) => (
          <div key={pair.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4">
              <h2 className="text-xl font-semibold mb-2">{pair.ticker_1} / {pair.ticker_2}</h2>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Spread Intercept</p>
                  <p className="text-lg font-semibold">{pair.spread_intercept.toFixed(4)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Spread Slope</p>
                  <p className="text-lg font-semibold">{pair.spread_slope.toFixed(4)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Cointegration P-Value</p>
                  <p className="text-lg font-semibold">{(pair.cointegration_p_value * 100).toFixed(2)}%</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Half Life</p>
                  <p className="text-lg font-semibold">{pair.half_life.toFixed(2)} months</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-500">Mean Crossings</p>
                <p className="text-lg font-semibold">{pair.mean_crossings}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuggestedPairs;