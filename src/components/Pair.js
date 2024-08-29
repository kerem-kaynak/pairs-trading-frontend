import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BACKEND_HOST } from '../envConfig';

const Pair = () => {
  const [trades, setTrades] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const ticker1 = searchParams.get('ticker_1');
  const ticker2 = searchParams.get('ticker_2');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [tradesResponse, metricsResponse] = await Promise.all([
          fetch(`${BACKEND_HOST}/api/model-chosen-pairs/trades?ticker_1=${ticker1}&ticker_2=${ticker2}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
          }),
          fetch(`${BACKEND_HOST}/api/model-chosen-pairs/metrics?ticker_1=${ticker1}&ticker_2=${ticker2}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
          })
        ]);

        if (!tradesResponse.ok || !metricsResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const tradesData = await tradesResponse.json();
        const metricsData = await metricsResponse.json();

        const sortedTrades = tradesData.sort((a, b) => new Date(a.date) - new Date(b.date));

        setTrades(sortedTrades);
        setMetrics(metricsData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    if (ticker1 && ticker2) {
      fetchData();
    }
  }, [ticker1, ticker2]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Pair Details: {ticker1} / {ticker2}</h1>
      
      <div className="mb-12">
        <h2 className="text-xl font-semibold mb-2">Budget Over Time</h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart 
            data={trades}
            margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tickFormatter={(date) => new Date(date).toLocaleDateString()}
            />
            <YAxis 
              domain={[85000, 115000]}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip 
              labelFormatter={(date) => new Date(date).toLocaleDateString()}
              formatter={(value) => ['$' + value.toFixed(2), 'Budget']}
            />
            <Line 
              type="monotone" 
              dataKey="budget" 
              stroke="#8884d8" 
              dot={false}
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Total Return</h3>
            <p className="text-3xl font-bold text-blue-600">
              {(metrics.total_return * 100).toFixed(2)}%
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Annualized Return</h3>
            <p className="text-3xl font-bold text-green-600">
              {(metrics.annualized_return * 100).toFixed(2)}%
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Max Drawdown</h3>
            <p className="text-3xl font-bold text-red-600">
              {(metrics.max_drawdown * 100).toFixed(2)}%
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pair;