import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Circle,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  HelpCircle,
  Lightbulb,
  Check
} from 'lucide-react';
import { api } from '../api/client';

export default function CoreCSPage({ onStartQuiz, onScoreChange }) {
  const [subjects, setSubjects] = useState([]);
  const [coreScore, setCoreScore] = useState(0);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [expandedSubjects, setExpandedSubjects] = useState({});

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await api.getCoreCs();
      setSubjects(res.subjects || []);
      setCoreScore(res.coreCsScore || 0);
      setStats(res.coreStats || {});
      if (res.subjects && res.subjects.length > 0 && Object.keys(expandedSubjects).length === 0) {
        setExpandedSubjects({
          [res.subjects[0].id]: true,
          [res.subjects[1].id]: true,
        });
      }
      if (onScoreChange) onScoreChange();
    } catch (err) {
      console.error('Failed to load Core CS subjects', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const toggleSubject = (subId) => {
    setExpandedSubjects((prev) => ({
      ...prev,
      [subId]: !prev[subId],
    }));
  };

  const handleToggleTopic = async (topicId, currentStatus) => {
    try {
      const res = await api.toggleCoreTopic(topicId, !currentStatus);
      if (res.subjects) {
        setSubjects(res.subjects);
        setCoreScore(res.coreCsScore || 0);
      }
      if (onScoreChange) onScoreChange();
    } catch (err) {
      alert(err.message || 'Error updating topic status');
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      {/* Header and Core CS Score Metric */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                <BookOpen className="w-4 h-4" />
              </div>
              <h1 className="text-xl font-bold text-charcoal">Core Computer Science Preparation</h1>
            </div>
            <p className="text-xs text-muted mt-1">
              Curated technical theory, interview concepts, and placement topics across 7 core computer science subjects.
            </p>
          </div>

          <div className="flex items-center space-x-4 bg-emerald-50/70 border border-emerald-100 px-4 py-2.5 rounded-xl">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">Core CS Score</span>
              <span className="text-2xl font-black text-emerald-800">{coreScore}%</span>
            </div>
            <div className="text-xs text-emerald-700 font-medium pl-3 border-l border-emerald-200">
              <div><strong>{stats.completedTopics ?? 0}</strong> of <strong>{stats.totalTopics ?? 36}</strong> topics</div>
              <span className="text-[10px] text-emerald-600 font-medium">Completed ✓</span>
            </div>
          </div>
        </div>

        <p className="text-xs text-muted pt-3">
          Click the checkmark circle to mark any topic completed. Your progress immediately updates your Placement Readiness Score and logs to your daily study streak.
        </p>
      </div>

      {/* Subjects Accordion */}
      <div className="space-y-4">
        {subjects.map((sub) => {
          const isExpanded = !!expandedSubjects[sub.id];
          return (
            <div
              key={sub.id}
              className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden transition-colors"
            >
              {/* Subject Header */}
              <div
                onClick={() => toggleSubject(sub.id)}
                className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50 select-none transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <button className="text-muted hover:text-charcoal">
                    {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                  </button>
                  <div>
                    <h3 className="text-base font-bold text-charcoal">{sub.name}</h3>
                    <p className="text-xs text-muted mt-0.5">{sub.description}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right hidden sm:block">
                    <span className="text-xs font-semibold text-charcoal">
                      {sub.completedTopics} / {sub.totalTopics}
                    </span>
                    <span className="text-xs text-muted ml-1">({sub.progressPercentage}%)</span>
                    <div className="w-24 bg-slate-100 rounded-full h-1.5 mt-1 overflow-hidden">
                      <div
                        className="bg-emerald-600 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${sub.progressPercentage}%` }}
                      />
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onStartQuiz(sub.id);
                    }}
                    className="flex items-center space-x-1 px-3 py-1.5 bg-primary/10 hover:bg-primary/15 text-primary text-xs font-semibold rounded-lg border border-primary/20 transition-colors"
                    title="Take a 10-question practice quiz on this subject"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Practice Quiz</span>
                  </button>
                </div>
              </div>

              {/* Topics Container */}
              {isExpanded && (
                <div className="border-t border-slate-100 divide-y divide-slate-100 bg-[#F7F8FA]">
                  {sub.topics.map((t) => (
                    <div
                      key={t.id}
                      className={`p-4 flex flex-col sm:flex-row sm:items-start justify-between gap-3 transition-colors ${
                        t.completed ? 'bg-emerald-50/30' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <button
                          onClick={() => handleToggleTopic(t.id, t.completed)}
                          className={`mt-0.5 p-1 rounded-md transition-colors ${
                            t.completed
                              ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs'
                              : 'text-slate-300 hover:text-slate-500 hover:bg-slate-200'
                          }`}
                          title={t.completed ? 'Mark incomplete' : 'Mark completed'}
                        >
                          {t.completed ? <Check className="w-4 h-4 stroke-[3]" /> : <Circle className="w-4 h-4" />}
                        </button>

                        <div>
                          <div className="flex items-center space-x-2">
                            <span className={`text-xs sm:text-sm font-bold ${
                              t.completed ? 'text-emerald-950 line-through decoration-emerald-500/60' : 'text-charcoal'
                            }`}>
                              {t.name}
                            </span>
                            {t.completed && (
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                                Completed ✓
                              </span>
                            )}
                          </div>

                          <p className="text-xs text-muted mt-1 max-w-2xl leading-relaxed">
                            {t.description}
                          </p>

                          {/* Why it matters for placements */}
                          <div className="mt-2 flex items-start space-x-1.5 text-xs text-charcoal bg-white p-2.5 rounded-lg border border-slate-200 max-w-2xl">
                            <Lightbulb className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                            <span className="text-[11px] leading-relaxed">
                              <strong className="text-charcoal">Interview Relevance:</strong> {t.whyItMatters}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Learning Reference Link */}
                      {t.referenceUrl && (
                        <div className="sm:text-right flex-shrink-0 pl-7 sm:pl-0">
                          <a
                            href={t.referenceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-1 text-[11px] font-semibold text-primary hover:underline bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 shadow-2xs"
                          >
                            <span>{t.referenceTitle || 'Study Guide'}</span>
                            <ExternalLink className="w-3 h-3 ml-0.5" />
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
