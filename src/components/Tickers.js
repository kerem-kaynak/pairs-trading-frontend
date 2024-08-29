import React, { useState, useEffect } from 'react';
import { BACKEND_HOST } from '../envConfig';
import { Link } from 'react-router-dom';

const Tickers = () => {
  const [tickers, setTickers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTickers = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${BACKEND_HOST}/api/ticker/all`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to fetch tickers: ${response.status} ${response.statusText}\n${errorText}`);
        }

        const data = await response.json();
        setTickers(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching tickers:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchTickers();
  }, []);

  const filteredTickers = tickers.filter(ticker =>
    ticker.ticker.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="text-center mt-8">Loading...</div>;
  if (error) return <div className="text-center mt-8 text-red-600">Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Tickers</h1>
      
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by ticker..."
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredTickers.map((ticker) => (
          <Link to={`/ticker/${ticker.ticker}`} key={ticker.ticker} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 h-48 flex flex-col">
            <div className="p-4 flex-grow">
              <h2 className="text-xl font-semibold mb-2 truncate">{ticker.ticker}</h2>
              <p className="text-gray-600 mb-2 overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{ticker.name}</p>
            </div>
            <div className="bg-gray-50 p-4 flex justify-between items-center">
              <span className={`px-2 py-1 rounded-full text-sm ${ticker.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {ticker.active ? 'Active' : 'Inactive'}
              </span>
              <span className="text-blue-600 font-medium">{ticker.type}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Tickers;