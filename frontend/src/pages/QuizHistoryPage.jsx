import React, { useState, useEffect } from 'react';
import { History, Award, Calendar, HelpCircle, ArrowRight } from 'lucide-react';
import { api } from '../api/client';

export default function QuizHistoryPage({ onStartQuiz }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        setLoading(true);
        const res = await api.getQuizHistory();
        setHistory(res.history || []);
      } catch (err) {
        console.error('Failed to load quiz history', err);
      } finally {
        setLoading(false);
      }
    };
    loadHistory();
  }, []);

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
              <History className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-bold text-charcoal">Assessment & Quiz History</h1>
          </div>
          <p className="text-xs text-muted mt-1">
            Complete record of your practice quiz scores, topic breakdown, and timestamps.
          </p>
        </div>

        <button
          onClick={() => onStartQuiz()}
          className="flex items-center space-x-1.5 px-4 py-2 bg-primary hover:bg-primary-800 text-white text-xs font-bold rounded-lg shadow-xs transition-colors"
        >
          <HelpCircle className="w-4 h-4" />
          <span>New Practice Session</span>
        </button>
      </div>

      <div className="p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-lg text-xs text-amber-900 flex items-center space-x-2.5">
        <Award className="w-4 h-4 text-amber-600 flex-shrink-0" />
        <span>
          <strong>Recall Evaluation:</strong> These records evaluate mock interview agility. Quiz scores remain separate from your overall Placement Readiness Score.
        </span>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-muted font-medium">Loading history...</div>
        ) : history.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#F7F8FA] border-b border-slate-200 text-muted font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Topic / Exam</th>
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4">Attempt #</th>
                  <th className="py-3 px-4">Score</th>
                  <th className="py-3 px-4">Percentage</th>
                  <th className="py-3 px-4 text-right">Date & Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {history.map((a) => {
                  const dateStr = a.timestamp ? new Date(a.timestamp).toLocaleString() : 'Recent';
                  return (
                    <tr key={a.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-bold text-charcoal">
                        {a.topicName || a.topicId}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          a.type === 'core_cs' ? 'bg-emerald-50 text-emerald-700' : 'bg-accent/15 text-accent'
                        }`}>
                          {a.type === 'core_cs' ? 'Core CS' : 'Aptitude'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-muted font-medium">
                        Attempt {a.attemptNumber || 1}
                      </td>
                      <td className="py-3 px-4 font-bold text-charcoal">
                        {a.score} / {a.totalQuestions}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded font-bold text-xs ${
                          a.percentage >= 70 ? 'bg-accent/15 text-accent' :
                          a.percentage >= 50 ? 'bg-primary/10 text-primary' : 'bg-amber-50 text-amber-800'
                        }`}>
                          {a.percentage}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right text-muted font-mono text-[11px]">
                        {dateStr}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center">
            <History className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-charcoal">No quiz attempts recorded yet</p>
            <p className="text-xs text-muted mt-0.5">
              Take practice tests on Core CS or Aptitude to evaluate your knowledge.
            </p>
            <button
              onClick={() => onStartQuiz()}
              className="mt-4 inline-flex items-center space-x-1.5 px-3 py-2 bg-primary hover:bg-primary-800 text-white text-xs font-semibold rounded-lg shadow-xs"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Start First Quiz</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
