import React, { useState } from 'react';
import { Lock, User, AlertCircle, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { api } from '../api/client';

export default function LoginPage({ onLoginSuccess, onGoRegister, onGoLanding }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!username.trim()) {
      setError('Please enter your username or login ID.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.login(username.trim(), password);
      if (res.user) {
        onLoginSuccess(res.user);
      }
    } catch (err) {
      setError(err.message || 'Invalid username or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* TechPlace Brand Header */}
        <div
          onClick={onGoLanding}
          className="flex items-center justify-center space-x-3 cursor-pointer mb-6 group select-none"
        >
          <div className="w-11 h-11 rounded-xl bg-primary flex items-center justify-center text-white shadow-xs group-hover:bg-primary-800 transition-colors">
            <span className="font-extrabold text-base tracking-wider">TP</span>
          </div>
          <div>
            <span className="text-2xl font-extrabold tracking-tight text-primary">Tech<span className="text-accent">Place</span></span>
            <span className="block text-[11px] font-medium text-muted -mt-1">Placement Readiness System</span>
          </div>
        </div>

        <h2 className="text-center text-xl font-bold tracking-tight text-charcoal">
          Sign In to Your Preparation Dashboard
        </h2>
        <p className="mt-1 text-center text-xs text-muted">
          Track DSA, aptitude, core CS progress, and your placement readiness score
        </p>
      </div>

      <div className="mt-7 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-sm border border-slate-200 sm:rounded-xl sm:px-10">
          {error && (
            <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg flex items-start space-x-2.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span className="font-medium leading-relaxed">{error}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold text-charcoal mb-1.5">
                Username / Login ID
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-muted absolute left-3 top-2.5 pointer-events-none" />
                <input
                  type="text"
                  required
                  autoFocus
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg text-charcoal placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-muted absolute left-3 top-2.5 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-9 pr-10 py-2 text-xs border border-slate-300 rounded-lg text-charcoal placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-muted hover:text-charcoal focus:outline-none"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex items-center justify-center space-x-2 py-2.5 px-4 text-xs font-bold text-white bg-primary hover:bg-primary-800 rounded-lg shadow-xs transition-colors disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-muted">Don't have an account?</span>
            <button
              type="button"
              onClick={onGoRegister}
              className="font-bold text-accent hover:underline focus:outline-none"
            >
              Create Account &rarr;
            </button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={onGoLanding}
            className="text-xs text-muted hover:text-charcoal transition-colors"
          >
            &larr; Back to TechPlace Overview
          </button>
        </div>
      </div>
    </div>
  );
}
