import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BACKEND_HOST } from '../envConfig';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    if (token) {
      localStorage.setItem('token', token);
      navigate('/dashboard');
    }
  }, [location, navigate]);

  const handleGoogleSignIn = () => {
    const currentURL = encodeURIComponent(`${window.location.origin}/login`);
    window.location.href = `${BACKEND_HOST}/auth/google/login?redirect_url=${currentURL}`;
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white rounded-lg shadow-md">
        <button
          onClick={handleGoogleSignIn}
          className="flex items-center justify-center px-4 py-2 space-x-2 text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
          </svg>
          <span>Sign in with Google</span>
        </button>
      </div>
    </div>
  );
};

export default LoginPage;