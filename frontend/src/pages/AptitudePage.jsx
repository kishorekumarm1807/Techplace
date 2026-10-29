import React, { useState, useEffect } from 'react';
import {
  Calculator,
  Plus,
  Search,
  Filter,
  Trash2,
  Edit2,
  BookOpen,
  X,
  ExternalLink,
  CheckCircle2,
  HelpCircle,
  Clock,
  Layers,
  ArrowUpDown,
  ListFilter
} from 'lucide-react';
import { api, getLocalDateString } from '../api/client';

const APT_TOPICS = [
  'Numbers',
  'Relations and Functions',
  'Divisibility',
  'HCF and LCM',
  'Series and Progression',
  'Ratio and Proportion',
  'Time and Work',
  'Profit and Loss',
  'Percentage',
  'Speed and Distance',
  'Simple Interest',
  'Compound Interest',
  'Probability',
  'Permutation and Combination',
  'Mixture and Allegation',
  'Pipes and Cisterns'
];

const PLATFORMS = [
  'IndiaBIX',
  'GeeksforGeeks',
  'HackerRank',
  'Custom',
  'RS Aggarwal',
  'Other'
];

export default function AptitudePage({ initialOpenAdd, onStartQuiz, onScoreChange }) {
  const [activeTab, setActiveTab] = useState('problems'); // 'problems' | 'syllabus'
  const [problems, setProblems] = useState([]);
  const [topics, setTopics] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [filterTopic, setFilterTopic] = useState('ALL');
  const [filterDifficulty, setFilterDifficulty] = useState('ALL');
  const [filterPlatform, setFilterPlatform] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [sortOrder, setSortOrder] = useState('newest'); // 'newest' | 'oldest'

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProblem, setEditingProblem] = useState(null);
  const [formTitle, setFormTitle] = useState('');
  const [formTopic, setFormTopic] = useState('Numbers');
  const [formDifficulty, setFormDifficulty] = useState('Medium');
  const [formPlatform, setFormPlatform] = useState('IndiaBIX');
  const [formNotes, setFormNotes] = useState('');
  const [formDate, setFormDate] = useState(getLocalDateString());
  const [formStatus, setFormStatus] = useState('Completed');
  const [saving, setSaving] = useState(false);

  // Notes View Modal
  const [viewingNotes, setViewingNotes] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await api.getAptitude();
      setProblems(res.problems || []);
      setTopics(res.topics || []);
      setStats(res.stats || {});
      if (onScoreChange) onScoreChange();
    } catch (err) {
      console.error('Failed to load Aptitude data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    if (initialOpenAdd) {
      openAddModal();
    }
  }, [initialOpenAdd]);

  const openAddModal = (presetTopic = 'Numbers') => {
    setEditingProblem(null);
    setFormTitle('');
    setFormTopic(presetTopic);
    setFormDifficulty('Medium');
    setFormPlatform('IndiaBIX');
    setFormNotes('');
    setFormDate(getLocalDateString());
    setFormStatus('Completed');
    setIsModalOpen(true);
  };

  const openEditModal = (p) => {
    setEditingProblem(p);
    setFormTitle(p.title);
    setFormTopic(p.topic);
    setFormDifficulty(p.difficulty);
    setFormPlatform(p.platform);
    setFormNotes(p.notes || '');
    setFormDate(p.datePracticed || getLocalDateString());
    setFormStatus(p.status || 'Completed');
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formTitle.trim()) return;
    setSaving(true);
    try {
      if (editingProblem) {
        await api.updateAptitudeProblem({
          id: editingProblem.id,
          title: formTitle.trim(),
          topic: formTopic,
          difficulty: formDifficulty,
          platform: formPlatform,
          notes: formNotes,
          datePracticed: formDate,
          status: formStatus,
        });
      } else {
        await api.addAptitudeProblem({
          title: formTitle.trim(),
          topic: formTopic,
          difficulty: formDifficulty,
          platform: formPlatform,
          notes: formNotes,
          datePracticed: formDate,
          status: formStatus,
        });
      }
      setIsModalOpen(false);
      await loadData();
    } catch (err) {
      alert(err.message || 'Error saving aptitude problem');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this aptitude problem record?')) {
      return;
    }
    try {
      await api.deleteAptitudeProblem(id);
      await loadData();
    } catch (err) {
      alert(err.message || 'Error deleting problem');
    }
  };

  // Filter & Sort logic
  const filteredProblems = problems.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
                          p.topic.toLowerCase().includes(search.toLowerCase()) ||
                          (p.notes && p.notes.toLowerCase().includes(search.toLowerCase()));
    const matchesTopic = filterTopic === 'ALL' || p.topic === filterTopic;
    const matchesDifficulty = filterDifficulty === 'ALL' || p.difficulty === filterDifficulty;
    const matchesPlatform = filterPlatform === 'ALL' || p.platform === filterPlatform;
    const matchesStatus = filterStatus === 'ALL' || (p.status || 'Completed') === filterStatus;
    return matchesSearch && matchesTopic && matchesDifficulty && matchesPlatform && matchesStatus;
  });

  filteredProblems.sort((a, b) => {
    const dateA = a.datePracticed || a.createdAt || '';
    const dateB = b.datePracticed || b.createdAt || '';
    return sortOrder === 'newest'
      ? String(dateB).localeCompare(String(dateA))
      : String(dateA).localeCompare(String(dateB));
  });

  const totalCompleted = problems.filter((p) => (p.status || 'Completed') === 'Completed').length;

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      {/* Header & Metrics Bar */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-accent/10 text-accent flex items-center justify-center font-bold">
                <Calculator className="w-4 h-4" />
              </div>
              <h1 className="text-xl font-bold text-charcoal">Aptitude Problem Tracker</h1>
            </div>
            <p className="text-xs text-muted mt-1">
              Log individual aptitude questions, record source platforms, revision notes, and track your completion rate.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => openAddModal()}
              className="flex items-center space-x-1.5 px-4 py-2.5 bg-accent hover:bg-accent-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Aptitude Problem</span>
            </button>
          </div>
        </div>

        {/* Summary Statistics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 text-center">
          <div className="p-3 bg-[#F7F8FA] rounded-lg border border-slate-100">
            <span className="text-[10px] font-semibold text-muted block uppercase">Saved Problems</span>
            <span className="text-xl font-black text-charcoal">{problems.length}</span>
          </div>

          <div className="p-3 bg-accent/5 rounded-lg border border-accent/20">
            <span className="text-[10px] font-semibold text-accent block uppercase">Completed</span>
            <span className="text-xl font-black text-accent">{totalCompleted}</span>
          </div>

          <div className="p-3 bg-[#F7F8FA] rounded-lg border border-slate-100">
            <span className="text-[10px] font-semibold text-muted block uppercase">In Progress</span>
            <span className="text-xl font-black text-amber-600">
              {problems.filter((p) => p.status === 'In Progress').length}
            </span>
          </div>

          <div className="p-3 bg-[#F7F8FA] rounded-lg border border-slate-100">
            <span className="text-[10px] font-semibold text-muted block uppercase">Topics Covered</span>
            <span className="text-xl font-black text-primary">
              {new Set(problems.map((p) => p.topic)).size} / 16
            </span>
          </div>
        </div>

        {/* Tab Switcher: Problem Tracker vs Syllabus Overview */}
        <div className="mt-5 flex border-b border-slate-200">
          <button
            onClick={() => setActiveTab('problems')}
            className={`pb-2.5 px-4 text-xs font-bold border-b-2 transition-colors flex items-center space-x-1.5 ${
              activeTab === 'problems'
                ? 'border-accent text-accent'
                : 'border-transparent text-muted hover:text-charcoal'
            }`}
          >
            <ListFilter className="w-3.5 h-3.5" />
            <span>Individual Problems ({problems.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('syllabus')}
            className={`pb-2.5 px-4 text-xs font-bold border-b-2 transition-colors flex items-center space-x-1.5 ${
              activeTab === 'syllabus'
                ? 'border-accent text-accent'
                : 'border-transparent text-muted hover:text-charcoal'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Syllabus & Topic Guides (16)</span>
          </button>
        </div>
      </div>

      {/* TAB 1: Individual Problems Primary View */}
      {activeTab === 'problems' && (
        <div className="space-y-4">
          {/* Search, Filter & Sort Controls */}
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-muted absolute left-3 top-2.5 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search aptitude problems or notes..."
                className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg text-charcoal placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Topic Filter */}
              <select
                value={filterTopic}
                onChange={(e) => setFilterTopic(e.target.value)}
                className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 text-charcoal bg-white focus:outline-none"
              >
                <option value="ALL">All Topics ({APT_TOPICS.length})</option>
                {APT_TOPICS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>

              {/* Difficulty Filter */}
              <select
                value={filterDifficulty}
                onChange={(e) => setFilterDifficulty(e.target.value)}
                className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 text-charcoal bg-white focus:outline-none"
              >
                <option value="ALL">All Difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>

              {/* Platform Filter */}
              <select
                value={filterPlatform}
                onChange={(e) => setFilterPlatform(e.target.value)}
                className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 text-charcoal bg-white focus:outline-none"
              >
                <option value="ALL">All Sources</option>
                {PLATFORMS.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>

              {/* Status Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 text-charcoal bg-white focus:outline-none"
              >
                <option value="ALL">All Statuses</option>
                <option value="Completed">Completed</option>
                <option value="In Progress">In Progress</option>
                <option value="Not Started">Not Started</option>
              </select>

              {/* Sort Order */}
              <button
                onClick={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')}
                className="flex items-center space-x-1 text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 text-charcoal hover:bg-slate-50"
                title="Toggle sort order by date"
              >
                <ArrowUpDown className="w-3 h-3 text-muted" />
                <span>{sortOrder === 'newest' ? 'Newest First' : 'Oldest First'}</span>
              </button>
            </div>
          </div>

          {/* Table of Aptitude Problems */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-8 text-center text-xs text-muted font-medium">Loading aptitude problems...</div>
            ) : filteredProblems.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#F7F8FA] border-b border-slate-200 text-muted font-bold uppercase tracking-wider text-[10px]">
                      <th className="py-3 px-4">Problem Title</th>
                      <th className="py-3 px-4">Topic</th>
                      <th className="py-3 px-4">Difficulty</th>
                      <th className="py-3 px-4">Platform / Source</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Date Practiced</th>
                      <th className="py-3 px-4">Notes</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredProblems.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 font-bold text-charcoal max-w-xs">
                          {p.title}
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-charcoal font-semibold text-[11px]">
                            {p.topic}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                            p.difficulty === 'Easy' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                            p.difficulty === 'Medium' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                            'bg-rose-50 text-rose-800 border-rose-200'
                          }`}>
                            {p.difficulty}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-muted font-medium">
                          {p.platform || 'Custom'}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            p.status === 'Completed' ? 'bg-emerald-50 text-emerald-700' :
                            p.status === 'In Progress' ? 'bg-amber-50 text-amber-700' :
                            'bg-slate-100 text-slate-600'
                          }`}>
                            {p.status || 'Completed'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-muted font-mono text-[11px]">
                          {p.datePracticed || '—'}
                        </td>
                        <td className="py-3 px-4">
                          {p.notes ? (
                            <button
                              onClick={() => setViewingNotes(p)}
                              className="flex items-center space-x-1 text-accent hover:underline text-[11px] font-medium"
                            >
                              <BookOpen className="w-3.5 h-3.5" />
                              <span className="truncate max-w-[120px] inline-block">{p.notes}</span>
                            </button>
                          ) : (
                            <span className="text-slate-300 italic">—</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end space-x-1.5">
                            <button
                              onClick={() => openEditModal(p)}
                              className="p-1 rounded text-muted hover:text-accent hover:bg-slate-100"
                              title="Edit Problem"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(p.id)}
                              className="p-1 rounded text-muted hover:text-rose-600 hover:bg-rose-50"
                              title="Delete Problem"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-12 text-center">
                <Calculator className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-bold text-charcoal">No aptitude problems found</p>
                <p className="text-xs text-muted mt-0.5">
                  {search || filterTopic !== 'ALL' || filterDifficulty !== 'ALL' || filterStatus !== 'ALL'
                    ? 'Try clearing your filters or search keywords.'
                    : 'Start tracking quantitative aptitude questions you practice.'}
                </p>
                <button
                  onClick={() => openAddModal()}
                  className="mt-4 inline-flex items-center space-x-1.5 px-3 py-2 bg-accent hover:bg-accent-700 text-white text-xs font-semibold rounded-lg shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Log First Problem</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: Syllabus & Topic Guides Reference */}
      {activeTab === 'syllabus' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {topics.map((t) => {
            const topicProblems = problems.filter((p) => p.topic === t.name);
            const topicCompleted = topicProblems.filter((p) => (p.status || 'Completed') === 'Completed').length;
            const hasLegacy = (t.problemsSolved ?? 0) > 0;

            return (
              <div
                key={t.id}
                className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-colors"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-bold text-charcoal">{t.name}</h3>
                      <p className="text-xs text-muted mt-1 leading-relaxed">{t.description}</p>
                    </div>

                    <button
                      onClick={() => onStartQuiz(t.id)}
                      className="p-1.5 rounded-lg text-muted hover:text-accent hover:bg-accent/10 transition-colors flex-shrink-0"
                      title="Practice model questions for this topic"
                    >
                      <HelpCircle className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="mt-3 flex items-center space-x-3 text-xs text-muted">
                    <span>Practiced: <strong className="text-charcoal">{topicProblems.length}</strong></span>
                    <span>• Completed: <strong className="text-accent">{topicCompleted}</strong></span>
                    {hasLegacy && <span className="text-[10px] text-muted">(includes legacy logs)</span>}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  {t.referenceUrl ? (
                    <a
                      href={t.referenceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 text-[11px] font-semibold text-primary hover:underline"
                    >
                      <span>{t.referenceTitle || 'Study Guide'}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : <div />}

                  <button
                    onClick={() => openAddModal(t.name)}
                    className="inline-flex items-center space-x-1 text-xs font-semibold text-accent hover:text-accent-700"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add {t.name} Problem</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Aptitude Problem Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div
            className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150"
            onKeyDown={(e) => { if (e.key === 'Escape') setIsModalOpen(false); }}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="font-bold text-charcoal text-sm">
                {editingProblem ? 'Edit Aptitude Problem' : 'Log Aptitude Problem'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded text-muted hover:text-charcoal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1">
                  Problem Title or Short Description *
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. A and B together can do work in 12 days..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg text-charcoal placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-charcoal mb-1">
                    Aptitude Topic *
                  </label>
                  <select
                    value={formTopic}
                    onChange={(e) => setFormTopic(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg text-charcoal bg-white focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    {APT_TOPICS.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-charcoal mb-1">
                    Platform / Source *
                  </label>
                  <select
                    value={formPlatform}
                    onChange={(e) => setFormPlatform(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg text-charcoal bg-white focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    {PLATFORMS.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-charcoal mb-1">
                    Difficulty Level *
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {['Easy', 'Medium', 'Hard'].map((diff) => (
                      <button
                        type="button"
                        key={diff}
                        onClick={() => setFormDifficulty(diff)}
                        className={`py-1.5 text-xs font-semibold rounded-lg border text-center transition-colors ${
                          formDifficulty === diff
                            ? 'bg-accent/15 border-accent text-accent font-bold'
                            : 'bg-white border-slate-200 text-muted hover:bg-slate-50'
                        }`}
                      >
                        {diff}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-charcoal mb-1">
                    Status *
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg text-charcoal bg-white focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    <option value="Completed">Completed</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Not Started">Not Started</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1">
                  Date Practiced
                </label>
                <input
                  type="date"
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg text-charcoal bg-white focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1">
                  Optional Solution Notes & Key Shortcut
                </label>
                <textarea
                  rows={3}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Formula applied, shortcut trick, common pitfall..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg text-charcoal placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-accent font-mono"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-muted hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 text-xs font-bold text-white bg-accent hover:bg-accent-700 rounded-lg shadow-xs transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editingProblem ? 'Save Changes' : 'Add Problem'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Notes View Modal */}
      {viewingNotes && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div
            className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150"
            onKeyDown={(e) => { if (e.key === 'Escape') setViewingNotes(null); }}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-charcoal text-sm">{viewingNotes.title}</h3>
                <span className="text-[11px] text-muted">{viewingNotes.topic} • {viewingNotes.difficulty}</span>
              </div>
              <button
                onClick={() => setViewingNotes(null)}
                className="p-1 rounded text-muted hover:text-charcoal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-muted mb-2">
                Solution Notes & Method
              </label>
              <div className="p-3.5 bg-[#F7F8FA] rounded-lg border border-slate-100 text-xs font-mono whitespace-pre-wrap text-charcoal leading-relaxed">
                {viewingNotes.notes || 'No notes saved for this problem.'}
              </div>
            </div>
            <div className="px-6 py-3 bg-[#F7F8FA] border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setViewingNotes(null)}
                className="px-4 py-1.5 text-xs font-semibold text-charcoal hover:bg-slate-200 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
