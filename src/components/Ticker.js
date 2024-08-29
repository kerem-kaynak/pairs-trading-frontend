import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BACKEND_HOST } from '../envConfig';

const Ticker = () => {
  const { ticker } = useParams();
  const [details, setDetails] = useState(null);
  const [ohlcData, setOhlcData] = useState([]);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState({details: true, ohlc: true, news: true});
  const [error, setError] = useState({details: null, ohlc: null, news: null});

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await fetch(`${BACKEND_HOST}/api/ticker/${ticker}/details`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        });
        if (!response.ok) throw new Error('Failed to fetch details');
        const data = await response.json();
        setDetails(data);
      } catch (err) {
        setError(prev => ({ ...prev, details: err.message }));
      } finally {
        setLoading(prev => ({ ...prev, details: false }));
      }
    };

    const fetchOHLC = async () => {
      try {
        const response = await fetch(`${BACKEND_HOST}/api/ticker/${ticker}/daily-ohlc`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        });
        if (!response.ok) throw new Error('Failed to fetch OHLC data');
        const data = await response.json();
        setOhlcData(data.sort((a, b) => new Date(a.date) - new Date(b.date)));
      } catch (err) {
        setError(prev => ({ ...prev, ohlc: err.message }));
      } finally {
        setLoading(prev => ({ ...prev, ohlc: false }));
      }
    };

    const fetchNews = async () => {
      try {
        const response = await fetch(`${BACKEND_HOST}/api/ticker/${ticker}/news-mentions`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        });
        if (!response.ok) throw new Error('Failed to fetch news mentions');
        const data = await response.json();
        setNews(data);
      } catch (err) {
        setError(prev => ({ ...prev, news: err.message }));
      } finally {
        setLoading(prev => ({ ...prev, news: false }));
      }
    };

    fetchDetails();
    fetchOHLC();
    fetchNews();
  }, [ticker]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{ticker} {details && `- ${details.name}`}</h1>

      {/* Metric Cards */}
      {loading.details ? (
        <div className="text-center mt-4">Loading details...</div>
      ) : error.details ? (
        <div className="text-center mt-4 text-red-600">Error loading details: {error.details}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {['SMA', 'EMA', 'RSI', 'MACD'].map((metric) => (
            <div key={metric} className="bg-white rounded-lg shadow-md p-4">
              <h3 className="text-lg font-semibold mb-2">{metric}</h3>
              <p className="text-2xl font-bold text-blue-600">
                {details[metric.toLowerCase()].toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* OHLC Chart */}
      {loading.ohlc ? (
        <div className="text-center mt-4">Loading OHLC data...</div>
      ) : error.ohlc ? (
        <div className="text-center mt-4 text-red-600">Error loading OHLC data: {error.ohlc}</div>
      ) : (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Closing Prices</h2>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={ohlcData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickFormatter={(date) => new Date(date).toLocaleDateString()} />
              <YAxis />
              <Tooltip 
                labelFormatter={(date) => new Date(date).toLocaleDateString()}
                formatter={(value) => ['$' + value.toFixed(2), 'Close']}
              />
              <Line type="monotone" dataKey="close" stroke="#8884d8" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* News Mentions */}
      {loading.news ? (
        <div className="text-center mt-4">Loading news mentions...</div>
      ) : error.news ? (
        <div className="text-center mt-4 text-black-600">This ticker has no news mentions...</div>
      ) : (
        <div>
          <h2 className="text-2xl font-semibold mb-4">News Mentions</h2>
          <div className="h-96 overflow-y-auto">
            {news.map((item) => (
              <a 
                href={item.source_url} 
                target="_blank" 
                rel="noopener noreferrer" 
                key={item.id} 
                className="block mb-4 bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300"
              >
                <h3 className="text-lg font-semibold mb-2">{item.publisher}</h3>
                <p className="text-sm text-gray-600 mb-2">By {item.author}</p>
                <p className="mb-2">{item.short_summary}</p>
                <p className="text-sm text-gray-500">{new Date(item.publish_time).toLocaleString()}</p>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Ticker;