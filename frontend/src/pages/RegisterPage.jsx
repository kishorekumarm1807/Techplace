import React, { useState } from 'react';
import { Lock, User, Building2, Briefcase, Calendar, AlertCircle, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { api } from '../api/client';

export default function RegisterPage({ onRegisterSuccess, onGoLogin, onGoLanding }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [college, setCollege] = useState('');
  const [targetRole, setTargetRole] = useState('Software Development Engineer');
  const [graduationYear, setGraduationYear] = useState('2027');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Please provide your full name.');
      return;
    }
    if (!username.trim()) {
      setError('Please choose a username or login ID.');
      return;
    }
    if (!password || password.length < 4) {
      setError('Password must be at least 4 characters long.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.register({
        username: username.trim(),
        password,
        name: name.trim(),
        college: college.trim(),
        targetRole: targetRole.trim(),
        graduationYear: graduationYear.trim(),
      });
      if (res.user) {
        onRegisterSuccess(res.user);
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Username may already be in use.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* TechPlace Brand Header */}
        <div
          onClick={onGoLanding}
          className="flex items-center justify-center space-x-3 cursor-pointer mb-5 group select-none"
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
          Create Your Student Account
        </h2>
        <p className="mt-1 text-center text-xs text-muted">
          Start building your personalized Tech Placement Readiness Score
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-sm border border-slate-200 sm:rounded-xl sm:px-10">
          {error && (
            <div className="mb-4 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg flex items-start space-x-2.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span className="font-medium leading-relaxed">{error}</span>
            </div>
          )}

          <form className="space-y-3.5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold text-charcoal mb-1">
                Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-muted absolute left-3 top-2.5 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Suresh Krishnan"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg text-charcoal placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal mb-1">
                Username / Login ID *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-muted absolute left-3 top-2.5 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Choose unique username"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg text-charcoal placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal mb-1">
                Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-muted absolute left-3 top-2.5 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 4 characters"
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

            <div>
              <label className="block text-xs font-semibold text-charcoal mb-1">
                College / University
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-muted absolute left-3 top-2.5 pointer-events-none" />
                <input
                  type="text"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  placeholder="e.g. CEG Chennai / Rajalakshmi"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg text-charcoal placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1">
                  Target Role
                </label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 text-muted absolute left-3 top-2.5 pointer-events-none" />
                  <input
                    type="text"
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    placeholder="e.g. SDE-1"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg text-charcoal placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1">
                  Grad Year
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-muted absolute left-3 top-2.5 pointer-events-none" />
                  <input
                    type="text"
                    value={graduationYear}
                    onChange={(e) => setGraduationYear(e.target.value)}
                    placeholder="2027"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg text-charcoal placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex items-center justify-center space-x-2 py-2.5 px-4 text-xs font-bold text-white bg-primary hover:bg-primary-800 rounded-lg shadow-xs transition-colors disabled:opacity-50"
            >
              <span>{loading ? 'Creating account...' : 'Complete Registration'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-muted">Already registered?</span>
            <button
              type="button"
              onClick={onGoLogin}
              className="font-bold text-accent hover:underline focus:outline-none"
            >
              Sign In &rarr;
            </button>
          </div>
        </div>

        <div className="mt-5 text-center">
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
