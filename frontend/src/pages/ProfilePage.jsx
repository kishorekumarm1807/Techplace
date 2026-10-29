import React, { useState, useEffect } from 'react';
import {
  User,
  Building2,
  Briefcase,
  Calendar,
  Flame,
  Check,
  AlertCircle,
  Save,
  RotateCcw,
  Code2,
  Calculator,
  BookOpen,
  Award
} from 'lucide-react';
import { api } from '../api/client';

export default function ProfilePage({ user, onUserUpdated, dashboardData }) {
  const [name, setName] = useState(user?.name || '');
  const [college, setCollege] = useState(user?.college || '');
  const [targetRole, setTargetRole] = useState(user?.targetRole || 'Software Development Engineer');
  const [graduationYear, setGraduationYear] = useState(user?.graduationYear || '2027');

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setCollege(user.college || '');
      setTargetRole(user.targetRole || 'Software Development Engineer');
      setGraduationYear(user.graduationYear || '2027');
    }
  }, [user]);

  const handleReset = () => {
    setName(user?.name || '');
    setCollege(user?.college || '');
    setTargetRole(user?.targetRole || 'Software Development Engineer');
    setGraduationYear(user?.graduationYear || '2027');
    setMsg(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setMsg({ type: 'error', text: 'Full name cannot be empty.' });
      return;
    }

    setLoading(true);
    setMsg(null);
    try {
      const res = await api.updateProfile({
        name: name.trim(),
        college: college.trim(),
        targetRole: targetRole.trim(),
        graduationYear: graduationYear.trim(),
      });
      if (res.user) {
        onUserUpdated(res.user);
        setMsg({ type: 'success', text: 'Profile changes successfully saved.' });
      }
    } catch (err) {
      setMsg({ type: 'error', text: err.message || 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  const streak = dashboardData?.streak || dashboardData?.scores?.streak || {};
  const currentStreak = streak.currentStreak ?? 0;
  const longestStreak = streak.longestStreak ?? 0;
  const totalActiveDays = streak.totalActiveDays ?? 0;

  const dsaSolved = dashboardData?.scores?.dsaStats?.totalSolved ?? 0;
  const coreCompleted = dashboardData?.scores?.coreStats?.completedTopics ?? 0;
  const aptSolved = dashboardData?.scores?.aptitudeStats?.totalProblemsSolved ?? 0;

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
              <User className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-bold text-charcoal">Profile & Account Settings</h1>
          </div>
          <p className="text-xs text-muted mt-1">
            Manage your personal placement target credentials and view preparation milestones.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs text-muted bg-[#F7F8FA] px-3.5 py-2 rounded-lg border border-slate-200">
          <span>Login ID:</span>
          <strong className="text-charcoal font-mono">{user?.username}</strong>
        </div>
      </div>

      {/* Main Grid: Profile Form + Study Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Edit Form */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <h2 className="text-sm font-bold text-charcoal pb-3 border-b border-slate-100 mb-4">
            Personal Information
          </h2>

          {msg && (
            <div className={`mb-4 p-3.5 rounded-lg text-xs flex items-center space-x-2.5 ${
              msg.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}>
              {msg.type === 'success' ? <Check className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
              <span className="font-medium">{msg.text}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-charcoal mb-1">
                Username / Login ID
              </label>
              <input
                type="text"
                disabled
                value={user?.username || ''}
                className="w-full px-3 py-2 text-xs bg-slate-100 border border-slate-200 rounded-lg text-muted cursor-not-allowed font-mono"
              />
              <span className="text-[10px] text-muted block mt-1">Username is immutable to preserve persistent preparation history.</span>
            </div>

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
                  placeholder="Your full name"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg text-charcoal focus:outline-none focus:ring-2 focus:ring-primary"
                />
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
                  placeholder="e.g. CEG Chennai, NIT, IIT"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg text-charcoal focus:outline-none focus:ring-2 focus:ring-primary"
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
                    placeholder="e.g. SDE-1 / Software Engineer"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg text-charcoal focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1">
                  Graduation Year
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-muted absolute left-3 top-2.5 pointer-events-none" />
                  <input
                    type="text"
                    value={graduationYear}
                    onChange={(e) => setGraduationYear(e.target.value)}
                    placeholder="2027"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg text-charcoal focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center space-x-1 px-4 py-2 text-xs font-medium text-muted hover:bg-slate-100 rounded-lg transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Cancel</span>
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex items-center space-x-1.5 px-4 py-2 text-xs font-bold text-white bg-primary hover:bg-primary-800 rounded-lg shadow-xs transition-colors disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{loading ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Study Statistics Card */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <h2 className="text-sm font-bold text-charcoal pb-3 border-b border-slate-100 mb-4">
              Preparation Statistics
            </h2>

            {/* Streak Metrics */}
            <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 space-y-2 mb-4">
              <div className="flex items-center space-x-2 text-amber-900">
                <Flame className="w-4 h-4 fill-amber-500 text-amber-600" />
                <span className="text-xs font-bold">Study Streak Performance</span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center pt-2">
                <div>
                  <span className="text-[10px] text-muted block uppercase">Current</span>
                  <span className="font-extrabold text-charcoal text-base">{currentStreak} d</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted block uppercase">Longest</span>
                  <span className="font-extrabold text-charcoal text-base">{longestStreak} d</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted block uppercase">Total Active</span>
                  <span className="font-extrabold text-charcoal text-base">{totalActiveDays} d</span>
                </div>
              </div>
            </div>

            {/* Volume Summaries */}
            <div className="space-y-2.5 text-xs text-charcoal">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#F7F8FA] border border-slate-100">
                <span className="flex items-center space-x-2 text-muted">
                  <Code2 className="w-4 h-4 text-primary" />
                  <span>Coding Problems Logged:</span>
                </span>
                <span className="font-bold text-charcoal">{dsaSolved}</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#F7F8FA] border border-slate-100">
                <span className="flex items-center space-x-2 text-muted">
                  <Calculator className="w-4 h-4 text-accent" />
                  <span>Aptitude Solved Volume:</span>
                </span>
                <span className="font-bold text-charcoal">{aptSolved}</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#F7F8FA] border border-slate-100">
                <span className="flex items-center space-x-2 text-muted">
                  <BookOpen className="w-4 h-4 text-emerald-700" />
                  <span>Core CS Topics Mastered:</span>
                </span>
                <span className="font-bold text-charcoal">{coreCompleted}</span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 text-[11px] text-muted text-center">
            All records stored locally in your Core Java backend storage.
          </div>
        </div>
      </div>
    </div>
  );
}
