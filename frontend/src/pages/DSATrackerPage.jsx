import React, { useState, useEffect } from 'react';
import {
  Code2,
  Plus,
  Search,
  Filter,
  Trash2,
  Edit2,
  BookOpen,
  X,
  ArrowUpDown,
  CheckCircle2
} from 'lucide-react';
import { api, getLocalDateString } from '../api/client';

const CATEGORIES = [
  'Array',
  'String',
  'Linked List',
  'Stack',
  'Queue',
  'Tree',
  'Graph',
  'Recursion',
  'Greedy',
  'Dynamic Programming',
  'Sorting',
  'Searching',
  'Hashing'
];

const PLATFORMS = [
  'LeetCode',
  'GeeksforGeeks',
  'HackerRank',
  'CodeChef',
  'Codeforces',
  'Other'
];

export default function DSATrackerPage({ initialOpenAdd, onScoreChange }) {
  const [problems, setProblems] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedDifficulty, setSelectedDifficulty] = useState('ALL');
  const [selectedPlatform, setSelectedPlatform] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [sortOrder, setSortOrder] = useState('newest'); // 'newest' | 'oldest'

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProblem, setEditingProblem] = useState(null);
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('Array');
  const [formDifficulty, setFormDifficulty] = useState('Medium');
  const [formPlatform, setFormPlatform] = useState('LeetCode');
  const [formNotes, setFormNotes] = useState('');
  const [formStatus, setFormStatus] = useState('Completed');
  const [formDate, setFormDate] = useState(getLocalDateString());
  const [saving, setSaving] = useState(false);

  // Revision Note View Modal
  const [activeNotesView, setActiveNotesView] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await api.getDsa();
      setProblems(res.problems || []);
      setStats(res.stats || {});
      if (onScoreChange) onScoreChange();
    } catch (err) {
      console.error('Failed to load DSA data', err);
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

  const openAddModal = () => {
    setEditingProblem(null);
    setFormName('');
    setFormCategory('Array');
    setFormDifficulty('Medium');
    setFormPlatform('LeetCode');
    setFormNotes('');
    setFormStatus('Completed');
    setFormDate(getLocalDateString());
    setIsModalOpen(true);
  };

  const openEditModal = (p) => {
    setEditingProblem(p);
    setFormName(p.name);
    setFormCategory(p.category);
    setFormDifficulty(p.difficulty);
    setFormPlatform(p.platform);
    setFormNotes(p.notes || '');
    setFormStatus(p.status || 'Completed');
    setFormDate(p.datePracticed || getLocalDateString());
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formName.trim()) return;
    setSaving(true);
    try {
      if (editingProblem) {
        await api.updateDsaProblem({
          id: editingProblem.id,
          name: formName.trim(),
          category: formCategory,
          difficulty: formDifficulty,
          platform: formPlatform,
          notes: formNotes,
          status: formStatus,
          datePracticed: formDate,
        });
      } else {
        await api.addDsaProblem({
          name: formName.trim(),
          category: formCategory,
          difficulty: formDifficulty,
          platform: formPlatform,
          notes: formNotes,
          status: formStatus,
          datePracticed: formDate,
        });
      }
      setIsModalOpen(false);
      await loadData();
    } catch (err) {
      alert(err.message || 'Error saving problem');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this solved problem record?')) return;
    try {
      await api.deleteDsaProblem(id);
      await loadData();
    } catch (err) {
      alert(err.message || 'Error deleting problem');
    }
  };

  const filteredProblems = problems.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                          p.category.toLowerCase().includes(search.toLowerCase()) ||
                          (p.notes && p.notes.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = selectedCategory === 'ALL' || p.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'ALL' || p.difficulty === selectedDifficulty;
    const matchesPlatform = selectedPlatform === 'ALL' || p.platform === selectedPlatform;
    const matchesStatus = selectedStatus === 'ALL' || (p.status || 'Completed') === selectedStatus;
    return matchesSearch && matchesCategory && matchesDifficulty && matchesPlatform && matchesStatus;
  });

  filteredProblems.sort((a, b) => {
    const dateA = a.datePracticed || a.solvedAt || '';
    const dateB = b.datePracticed || b.solvedAt || '';
    return sortOrder === 'newest'
      ? String(dateB).localeCompare(String(dateA))
      : String(dateA).localeCompare(String(dateB));
  });

  const completedCount = problems.filter((p) => (p.status || 'Completed') === 'Completed').length;

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      {/* Top Header & Metrics Bar */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
                <Code2 className="w-4 h-4" />
              </div>
              <h1 className="text-xl font-bold text-charcoal">Coding / DSA Tracker</h1>
            </div>
            <p className="text-xs text-muted mt-1">
              Track solved coding questions, personal solution approaches, and category variety across interview platforms.
            </p>
          </div>

          <button
            onClick={openAddModal}
            className="flex items-center space-x-1.5 px-4 py-2.5 bg-primary hover:bg-primary-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Coding Problem</span>
          </button>
        </div>

        {/* DSA Stats Summary Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-4 text-center">
          <div className="p-3 bg-[#F7F8FA] rounded-lg border border-slate-100">
            <span className="text-[10px] font-semibold text-muted uppercase block">Total Logged</span>
            <span className="text-xl font-black text-charcoal">{stats.total ?? 0}</span>
          </div>

          <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100">
            <span className="text-[10px] font-semibold text-emerald-800 uppercase block">Easy Solved</span>
            <span className="text-xl font-black text-emerald-700">{stats.easyCount ?? 0}</span>
          </div>

          <div className="p-3 bg-amber-50 rounded-lg border border-amber-100">
            <span className="text-[10px] font-semibold text-amber-800 uppercase block">Medium Solved</span>
            <span className="text-xl font-black text-amber-700">{stats.mediumCount ?? 0}</span>
          </div>

          <div className="p-3 bg-rose-50 rounded-lg border border-rose-100">
            <span className="text-[10px] font-semibold text-rose-800 uppercase block">Hard Solved</span>
            <span className="text-xl font-black text-rose-700">{stats.hardCount ?? 0}</span>
          </div>

          <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
            <span className="text-[10px] font-semibold text-primary uppercase block">Topic Breadth</span>
            <span className="text-xl font-black text-primary">{stats.distinctCategories ?? 0} / 13</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-muted absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search problems or revision notes..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg text-charcoal placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 text-charcoal bg-white focus:outline-none"
          >
            <option value="ALL">All Categories ({CATEGORIES.length})</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* Difficulty Filter */}
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 text-charcoal bg-white focus:outline-none"
          >
            <option value="ALL">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>

          {/* Platform Filter */}
          <select
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value)}
            className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 text-charcoal bg-white focus:outline-none"
          >
            <option value="ALL">All Platforms</option>
            {PLATFORMS.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
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
            title="Toggle sort order"
          >
            <ArrowUpDown className="w-3 h-3 text-muted" />
            <span>{sortOrder === 'newest' ? 'Newest' : 'Oldest'}</span>
          </button>
        </div>
      </div>

      {/* Problems Table / List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-muted font-medium">Loading problems...</div>
        ) : filteredProblems.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#F7F8FA] border-b border-slate-200 text-muted font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Problem Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Difficulty</th>
                  <th className="py-3 px-4">Platform</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date Practiced</th>
                  <th className="py-3 px-4">Notes</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProblems.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-bold text-charcoal">
                      {p.name}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-charcoal font-semibold text-[11px]">
                        {p.category}
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
                      {p.platform}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        (p.status || 'Completed') === 'Completed' ? 'bg-emerald-50 text-emerald-700' :
                        p.status === 'In Progress' ? 'bg-amber-50 text-amber-700' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {p.status || 'Completed'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-muted font-mono text-[11px]">
                      {p.datePracticed || '—'}
                    </td>
                    <td className="py-3 px-4 max-w-xs">
                      {p.notes ? (
                        <button
                          onClick={() => setActiveNotesView(p)}
                          className="flex items-center space-x-1 text-primary hover:underline text-[11px] font-medium"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span className="truncate max-w-[140px] inline-block">{p.notes}</span>
                        </button>
                      ) : (
                        <span className="text-slate-300 italic">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-1 rounded text-muted hover:text-primary hover:bg-slate-100"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="p-1 rounded text-muted hover:text-rose-600 hover:bg-rose-50"
                          title="Delete"
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
            <Code2 className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-charcoal">No coding problems found</p>
            <p className="text-xs text-muted mt-0.5">
              {search || selectedCategory !== 'ALL' || selectedDifficulty !== 'ALL'
                ? 'Try adjusting your search keywords or filters.'
                : 'Start tracking problems you solve on LeetCode, CodeChef, or GFG.'}
            </p>
            <button
              onClick={openAddModal}
              className="mt-4 inline-flex items-center space-x-1.5 px-3 py-2 bg-primary hover:bg-primary-800 text-white text-xs font-semibold rounded-lg shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add First Problem</span>
            </button>
          </div>
        )}
      </div>

      {/* Add / Edit Problem Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div
            className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150"
            onKeyDown={(e) => { if (e.key === 'Escape') setIsModalOpen(false); }}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="font-bold text-charcoal text-sm">
                {editingProblem ? 'Edit Coding Problem' : 'Log Solved Coding Problem'}
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
                  Problem Name / Title *
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. 3Sum, Trapping Rain Water, Course Schedule"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg text-charcoal placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-charcoal mb-1">
                    DSA Category *
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg text-charcoal bg-white focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-charcoal mb-1">
                    Platform *
                  </label>
                  <select
                    value={formPlatform}
                    onChange={(e) => setFormPlatform(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg text-charcoal bg-white focus:outline-none focus:ring-2 focus:ring-primary"
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
                            ? 'bg-primary/10 border-primary text-primary font-bold'
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
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg text-charcoal bg-white focus:outline-none focus:ring-2 focus:ring-primary"
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
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg text-charcoal bg-white focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1">
                  Revision Notes & Key Intuition
                </label>
                <textarea
                  rows={3}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Key takeaway, edge cases, time & space complexity, approach trick..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg text-charcoal placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary font-mono"
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
                  className="px-4 py-2 text-xs font-bold text-white bg-primary hover:bg-primary-800 rounded-lg shadow-xs transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editingProblem ? 'Save Changes' : 'Save Problem'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Revision Note View Modal */}
      {activeNotesView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div
            className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150"
            onKeyDown={(e) => { if (e.key === 'Escape') setActiveNotesView(null); }}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-charcoal text-sm">{activeNotesView.name}</h3>
                <span className="text-[11px] text-muted">{activeNotesView.category} • {activeNotesView.difficulty}</span>
              </div>
              <button
                onClick={() => setActiveNotesView(null)}
                className="p-1 rounded text-muted hover:text-charcoal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-muted mb-2">
                Personal Solution & Revision Notes
              </label>
              <div className="p-3.5 bg-[#F7F8FA] rounded-lg border border-slate-100 text-xs font-mono whitespace-pre-wrap text-charcoal leading-relaxed">
                {activeNotesView.notes || 'No notes saved for this problem.'}
              </div>
            </div>
            <div className="px-6 py-3 bg-[#F7F8FA] border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setActiveNotesView(null)}
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
