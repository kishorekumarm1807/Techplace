import React, { useState } from 'react';
import {
  Target,
  Code2,
  BookOpen,
  Calculator,
  Flame,
  Plus,
  ArrowUpRight,
  Info,
  Calendar,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  Clock,
  Award,
  X
} from 'lucide-react';
import { api, getLocalDateString } from '../api/client';

export default function DashboardPage({ data, onNavigate, onRefresh }) {
  const [sessionModalOpen, setSessionModalOpen] = useState(false);
  const [sessionTitle, setSessionTitle] = useState('');
  const [sessionNotes, setSessionNotes] = useState('');
  const [recording, setRecording] = useState(false);

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-muted text-xs font-semibold animate-pulse">Loading placement dashboard...</div>
      </div>
    );
  }

  const { user, scores, recentDsa, recentQuizzes, streak } = data;
  const overall = scores?.overallReadiness ?? 0;
  const dsaScore = scores?.dsaScore ?? 0;
  const coreCsScore = scores?.coreCsScore ?? 0;
  const aptitudeScore = scores?.aptitudeScore ?? 0;

  const dsaStats = scores?.dsaStats || {};
  const coreStats = scores?.coreStats || {};
  const aptStats = scores?.aptitudeStats || {};
  const quizStats = scores?.quizStats || {};

  const currentStreak = streak?.currentStreak ?? scores?.streak?.currentStreak ?? 0;
  const longestStreak = streak?.longestStreak ?? scores?.streak?.longestStreak ?? 0;
  const totalActiveDays = streak?.totalActiveDays ?? scores?.streak?.totalActiveDays ?? 0;
  const todayRecorded = streak?.todayRecorded ?? scores?.streak?.todayRecorded ?? false;
  const recentActivities = streak?.recentActivities ?? scores?.streak?.recentActivities ?? [];

  const handleRecordSession = async (e) => {
    e.preventDefault();
    if (!sessionTitle.trim()) return;
    setRecording(true);
    try {
      await api.recordStudySession({
        title: sessionTitle.trim(),
        description: sessionNotes.trim(),
      });
      setSessionModalOpen(false);
      setSessionTitle('');
      setSessionNotes('');
      if (onRefresh) onRefresh();
    } catch (err) {
      alert(err.message || 'Error recording study session');
    } finally {
      setRecording(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      {/* Welcome Banner & Quick Action Buttons */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-charcoal tracking-tight">
            Welcome back, {user?.name || user?.username}!
          </h1>
          <p className="text-xs text-muted mt-1">
            Targeting <span className="font-semibold text-charcoal">{user?.targetRole || 'Software Development Engineer'}</span> • Class of {user?.graduationYear || '2027'} {user?.college ? `• ${user.college}` : ''}
          </p>
        </div>

        {/* Quick Actions (Add coding problem, add aptitude problem, record study session) */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onNavigate('coding', { openAdd: true })}
            className="flex items-center space-x-1.5 px-3 py-2 bg-primary hover:bg-primary-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Coding Problem</span>
          </button>

          <button
            onClick={() => onNavigate('aptitude', { openAdd: true })}
            className="flex items-center space-x-1.5 px-3 py-2 bg-accent hover:bg-accent-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Aptitude Problem</span>
          </button>

          <button
            onClick={() => setSessionModalOpen(true)}
            className="flex items-center space-x-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-charcoal border border-slate-300 text-xs font-semibold rounded-lg shadow-xs transition-colors"
          >
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>Record Study Session</span>
          </button>
        </div>
      </div>

      {/* Top Grid: Placement Readiness Score + Daily Study Streak Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Placement Readiness Score Card (Takes 2 columns on lg) */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 rounded-2xl bg-primary text-white flex flex-col items-center justify-center flex-shrink-0 shadow-sm">
                  <span className="text-2xl font-black">{overall}</span>
                  <span className="text-[10px] uppercase font-bold text-accent tracking-wider">Score</span>
                </div>

                <div>
                  <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-primary/5 text-primary text-[10px] font-bold uppercase tracking-wider mb-1">
                    <Target className="w-3 h-3" />
                    <span>Placement Readiness</span>
                  </div>
                  <h2 className="text-lg font-bold text-charcoal">Overall Preparation Level</h2>
                  <p className="text-xs text-muted max-w-md">
                    Deterministic index derived from DSA problem difficulty, core CS syllabus coverage, and aptitude volume.
                  </p>
                </div>
              </div>

              <button
                onClick={() => onNavigate('readiness')}
                className="self-start sm:self-center text-xs font-semibold text-primary hover:text-accent hover:underline flex items-center space-x-1 whitespace-nowrap"
              >
                <span>View Full Formula</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 3 Pillar Progress Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div
                onClick={() => onNavigate('coding')}
                className="p-3 rounded-lg bg-[#F7F8FA] border border-slate-100 cursor-pointer hover:border-slate-200 transition-colors"
              >
                <div className="flex justify-between text-xs font-semibold mb-1.5">
                  <span className="text-charcoal flex items-center space-x-1">
                    <Code2 className="w-3.5 h-3.5 text-primary" />
                    <span>Coding (40%)</span>
                  </span>
                  <span className="font-bold text-primary">{dsaScore}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-primary h-1.5 rounded-full transition-all duration-500" style={{ width: `${dsaScore}%` }} />
                </div>
                <span className="text-[10px] text-muted block mt-1.5">{dsaStats.totalSolved ?? 0} solved</span>
              </div>

              <div
                onClick={() => onNavigate('core-cs')}
                className="p-3 rounded-lg bg-[#F7F8FA] border border-slate-100 cursor-pointer hover:border-slate-200 transition-colors"
              >
                <div className="flex justify-between text-xs font-semibold mb-1.5">
                  <span className="text-charcoal flex items-center space-x-1">
                    <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Core CS (35%)</span>
                  </span>
                  <span className="font-bold text-emerald-700">{coreCsScore}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-emerald-600 h-1.5 rounded-full transition-all duration-500" style={{ width: `${coreCsScore}%` }} />
                </div>
                <span className="text-[10px] text-muted block mt-1.5">{coreStats.completedTopics ?? 0}/{coreStats.totalTopics ?? 36} topics</span>
              </div>

              <div
                onClick={() => onNavigate('aptitude')}
                className="p-3 rounded-lg bg-[#F7F8FA] border border-slate-100 cursor-pointer hover:border-slate-200 transition-colors"
              >
                <div className="flex justify-between text-xs font-semibold mb-1.5">
                  <span className="text-charcoal flex items-center space-x-1">
                    <Calculator className="w-3.5 h-3.5 text-accent" />
                    <span>Aptitude (25%)</span>
                  </span>
                  <span className="font-bold text-accent">{aptitudeScore}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-accent h-1.5 rounded-full transition-all duration-500" style={{ width: `${aptitudeScore}%` }} />
                </div>
                <span className="text-[10px] text-muted block mt-1.5">{aptStats.totalProblemsSolved ?? 0} problems</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center space-x-2 text-[11px] text-muted">
            <Info className="w-3.5 h-3.5 text-accent flex-shrink-0" />
            <span>Practice quiz scores evaluate test stamina and do <strong>not</strong> alter this score.</span>
          </div>
        </div>

        {/* Daily Study Streak Card (Persistent Feature) */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Flame className="w-4 h-4 fill-amber-500 text-amber-600" />
                </div>
                <h3 className="font-bold text-charcoal text-sm">Daily Study Streak</h3>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                todayRecorded
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}>
                {todayRecorded ? 'Today Active ✓' : 'Study Today Pending'}
              </span>
            </div>

            <div className="text-center py-4">
              <div className="inline-flex items-baseline space-x-1.5">
                <span className="text-4xl font-extrabold text-charcoal">{currentStreak}</span>
                <span className="text-xs font-bold text-muted uppercase">days</span>
              </div>
              <p className="text-xs text-muted mt-1">
                {todayRecorded
                  ? 'Great work! You completed a study session today.'
                  : 'Complete a problem or session to keep your streak going!'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-center text-xs">
              <div className="p-2 rounded-lg bg-[#F7F8FA]">
                <span className="text-[10px] text-muted block">Longest Streak</span>
                <span className="font-bold text-charcoal text-sm">{longestStreak} days</span>
              </div>
              <div className="p-2 rounded-lg bg-[#F7F8FA]">
                <span className="text-[10px] text-muted block">Total Active Days</span>
                <span className="font-bold text-charcoal text-sm">{totalActiveDays} days</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-2">
            <button
              onClick={() => setSessionModalOpen(true)}
              className="w-full py-2 px-3 text-xs font-semibold text-primary bg-[#F7F8FA] hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors flex items-center justify-center space-x-1"
            >
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>Log Today's Study Activity</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3 Preparation Progress Summaries */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Coding Progress Card */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
                  <Code2 className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-charcoal text-sm">Coding Tracker</h3>
              </div>
              <span className="text-xs font-extrabold text-primary">{dsaScore}%</span>
            </div>

            <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 text-center my-1 text-xs">
              <div>
                <span className="text-[10px] text-muted block">Total</span>
                <span className="font-bold text-charcoal text-sm">{dsaStats.totalSolved ?? 0}</span>
              </div>
              <div>
                <span className="text-[10px] text-muted block">Easy/Med/Hard</span>
                <span className="font-semibold text-[11px] text-charcoal">
                  <span className="text-emerald-600">{dsaStats.easyCount ?? 0}</span>/
                  <span className="text-amber-600">{dsaStats.mediumCount ?? 0}</span>/
                  <span className="text-rose-600">{dsaStats.hardCount ?? 0}</span>
                </span>
              </div>
              <div>
                <span className="text-[10px] text-muted block">Categories</span>
                <span className="font-bold text-charcoal text-sm">{dsaStats.categoriesCovered ?? 0}/13</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('coding')}
            className="mt-3 w-full py-1.5 px-3 rounded-lg text-xs font-semibold text-primary bg-[#F7F8FA] hover:bg-slate-100 border border-slate-200 transition-colors flex items-center justify-center space-x-1"
          >
            <span>Manage Problems</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Aptitude Progress Card */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-lg bg-accent/10 text-accent flex items-center justify-center font-bold">
                  <Calculator className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-charcoal text-sm">Aptitude Practice</h3>
              </div>
              <span className="text-xs font-extrabold text-accent">{aptitudeScore}%</span>
            </div>

            <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 text-center my-1 text-xs">
              <div>
                <span className="text-[10px] text-muted block">Problems</span>
                <span className="font-bold text-charcoal text-sm">{aptStats.totalProblemsSolved ?? 0}</span>
              </div>
              <div>
                <span className="text-[10px] text-muted block">Topics Active</span>
                <span className="font-bold text-accent text-sm">{aptStats.topicsCovered ?? 0}/16</span>
              </div>
              <div>
                <span className="text-[10px] text-muted block">Saved Records</span>
                <span className="font-bold text-charcoal text-sm">{aptStats.individualSaved ?? 0}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('aptitude')}
            className="mt-3 w-full py-1.5 px-3 rounded-lg text-xs font-semibold text-accent bg-[#F7F8FA] hover:bg-slate-100 border border-slate-200 transition-colors flex items-center justify-center space-x-1"
          >
            <span>Track Aptitude</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Core CS Card */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                  <BookOpen className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-charcoal text-sm">Core CS Prep</h3>
              </div>
              <span className="text-xs font-extrabold text-emerald-700">{coreCsScore}%</span>
            </div>

            <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 text-center my-1 text-xs">
              <div>
                <span className="text-[10px] text-muted block">Completed</span>
                <span className="font-bold text-emerald-700 text-sm">{coreStats.completedTopics ?? 0}</span>
              </div>
              <div>
                <span className="text-[10px] text-muted block">Total Topics</span>
                <span className="font-bold text-charcoal text-sm">{coreStats.totalTopics ?? 36}</span>
              </div>
              <div>
                <span className="text-[10px] text-muted block">Pending</span>
                <span className="font-bold text-amber-600 text-sm">{coreStats.remainingTopics ?? 0}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('core-cs')}
            className="mt-3 w-full py-1.5 px-3 rounded-lg text-xs font-semibold text-emerald-700 bg-[#F7F8FA] hover:bg-slate-100 border border-slate-200 transition-colors flex items-center justify-center space-x-1"
          >
            <span>Review Syllabus</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Bottom Grid: Recent Activity Feed & Strong/Weak Areas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Study Activity Feed */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-charcoal text-sm flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-accent" />
              <span>Recent Study Activity</span>
            </h3>
            <span className="text-[11px] text-muted">{recentActivities.length} logs recorded</span>
          </div>

          {recentActivities.length > 0 ? (
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {recentActivities.map((act) => (
                <div key={act.id} className="p-2.5 rounded-lg bg-[#F7F8FA] border border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-charcoal">{act.title}</span>
                    {act.description && (
                      <span className="text-muted block text-[11px] mt-0.5">{act.description}</span>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0 ml-3">
                    <span className="text-[10px] text-muted font-mono block">{act.date}</span>
                    <span className="text-[10px] uppercase font-bold text-accent bg-accent/10 px-1.5 py-0.5 rounded">
                      {act.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-xs text-muted bg-[#F7F8FA] rounded-lg border border-slate-100">
              No recent study activity recorded.
              <button
                onClick={() => setSessionModalOpen(true)}
                className="mt-2 block mx-auto text-primary font-semibold hover:underline"
              >
                Log a study session to begin your streak &rarr;
              </button>
            </div>
          )}
        </div>

        {/* Diagnosis & Recommendations */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-charcoal text-sm flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span>Preparation Diagnosis</span>
          </h3>

          <div className="space-y-2">
            <div className="text-[10px] font-bold uppercase tracking-wider text-muted">Strengths</div>
            {scores.strongAreas && scores.strongAreas.length > 0 ? (
              <div className="space-y-1.5">
                {scores.strongAreas.map((area, idx) => (
                  <div key={idx} className="flex items-center space-x-2 text-xs text-emerald-900 bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-100 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>{area}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-muted bg-[#F7F8FA] p-3 rounded-lg border border-slate-100">
                Keep practicing to turn areas into strengths.
              </div>
            )}
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="text-[10px] font-bold uppercase tracking-wider text-muted">Focus Areas</div>
            {scores.weakAreas && scores.weakAreas.length > 0 ? (
              <div className="space-y-1.5">
                {scores.weakAreas.map((area, idx) => (
                  <div key={idx} className="flex items-center space-x-2 text-xs text-amber-900 bg-amber-50 px-3 py-2 rounded-lg border border-amber-100 font-medium">
                    <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <span>{area}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-emerald-700 bg-emerald-50 p-3 rounded-lg border border-emerald-100">
                All pillars well-balanced!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Record Study Session Modal */}
      {sessionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div
            className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150"
            onKeyDown={(e) => { if (e.key === 'Escape') setSessionModalOpen(false); }}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-amber-600" />
                <h3 className="font-bold text-charcoal text-sm">Record Study Session</h3>
              </div>
              <button
                onClick={() => setSessionModalOpen(false)}
                className="p-1 rounded text-muted hover:text-charcoal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRecordSession} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1">
                  Session Topic or Description *
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={sessionTitle}
                  onChange={(e) => setSessionTitle(e.target.value)}
                  placeholder="e.g. Practiced Dynamic Programming / Solved 5 IndiaBIX problems"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg text-charcoal placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1">
                  Additional Notes (Optional)
                </label>
                <textarea
                  rows={3}
                  value={sessionNotes}
                  onChange={(e) => setSessionNotes(e.target.value)}
                  placeholder="Key concepts revised, hours spent, topics covered..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg text-charcoal placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setSessionModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-muted hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={recording}
                  className="px-4 py-2 text-xs font-bold text-white bg-primary hover:bg-primary-800 rounded-lg shadow-xs transition-colors disabled:opacity-50"
                >
                  {recording ? 'Saving...' : 'Record Session'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
