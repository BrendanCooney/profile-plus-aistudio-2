import React, { useState } from 'react';
import { GoogleIcon, MailIcon, LockClosedIcon } from './icons';

interface LoginModalProps {
  onLogin: () => void;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ onLogin, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.toLowerCase() === 'test@example.com' && password === 'password') {
      onLogin();
    } else {
      setError('Invalid credentials. Use test@example.com and password.');
    }
  };

  const handleGoogleLogin = () => {
    onLogin();
  };

  const handleModalContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 transition-opacity duration-300"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
      aria-labelledby="login-modal-title"
    >
      <div
        className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md m-4 transform transition-all duration-300 scale-100"
        onClick={handleModalContentClick}
        role="document"
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 id="login-modal-title" className="text-2xl font-bold text-slate-900">Welcome Back</h2>
            <p className="text-slate-500 mt-1">Sign in to manage your profile.</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-3xl leading-none" aria-label="Close modal">&times;</button>
        </div>

        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 sr-only">Email</label>
            <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <MailIcon className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="block w-full rounded-md border-slate-300 pl-10 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm py-3"
                  placeholder="test@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
            </div>
          </div>

          <div>
            <label htmlFor="password"className="block text-sm font-medium text-slate-700 sr-only">Password</label>
             <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <LockClosedIcon className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  name="password"
                  id="password"
                  className="block w-full rounded-md border-slate-300 pl-10 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm py-3"
                  placeholder="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
            </div>
          </div>
          
          {error && <p className="text-red-500 text-sm text-center" role="alert">{error}</p>}

          <div>
            <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
              Sign In
            </button>
          </div>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-slate-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-slate-500">Or continue with</span>
          </div>
        </div>

        <div>
          <button
            onClick={handleGoogleLogin}
            type="button"
            className="w-full inline-flex justify-center py-3 px-4 border border-slate-300 rounded-md shadow-sm bg-white text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <GoogleIcon className="w-5 h-5 mr-2 -ml-1" />
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
};
