import React, { useState, useEffect } from 'react';
import {
  HelpCircle,
  CheckCircle,
  XCircle,
  RotateCcw,
  History,
  ArrowRight,
  ArrowLeft,
  Award,
  AlertCircle
} from 'lucide-react';
import { api } from '../api/client';

const QUIZ_TOPICS = [
  { id: 'dbms', name: 'DBMS (Database Management Systems)', type: 'core_cs' },
  { id: 'os', name: 'Operating Systems', type: 'core_cs' },
  { id: 'cn', name: 'Computer Networks', type: 'core_cs' },
  { id: 'oop', name: 'Object-Oriented Programming', type: 'core_cs' },
  { id: 'dsa_concept', name: 'DSA Theoretical Concepts', type: 'core_cs' },
  { id: 'core_cs', name: 'Full Core CS Mock Test (Mixed)', type: 'core_cs' },
  { id: 'apt_numbers', name: 'Aptitude: Numbers & Arithmetic', type: 'aptitude' },
  { id: 'apt_time_work', name: 'Aptitude: Time, Work & Pipes', type: 'aptitude' },
  { id: 'apt_profit_loss', name: 'Aptitude: Profit, Loss & Percentage', type: 'aptitude' },
  { id: 'apt_speed_dist', name: 'Aptitude: Speed, Distance & Trains', type: 'aptitude' },
  { id: 'aptitude', name: 'Full Quantitative Aptitude Test', type: 'aptitude' },
];

export default function QuizPage({ initialTopic, onGoHistory, onScoreChange }) {
  const [selectedTopic, setSelectedTopic] = useState(initialTopic || 'dbms');
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [quizActive, setQuizActive] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (initialTopic) {
      setSelectedTopic(initialTopic);
    }
  }, [initialTopic]);

  const startQuiz = async () => {
    setLoading(true);
    setResult(null);
    setUserAnswers({});
    setCurrentIdx(0);
    try {
      const res = await api.generateQuiz(selectedTopic);
      setQuestions(res.questions || []);
      setQuizActive(true);
    } catch (err) {
      alert(err.message || 'Error loading quiz questions');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (qId, optionIdx) => {
    setUserAnswers((prev) => ({
      ...prev,
      [qId]: optionIdx,
    }));
  };

  const handleSubmitQuiz = async () => {
    const answeredCount = Object.keys(userAnswers).length;
    if (answeredCount < questions.length) {
      if (!window.confirm(`You answered ${answeredCount} of ${questions.length} questions. Submit anyway?`)) {
        return;
      }
    }

    setSubmitting(true);
    try {
      const topicObj = QUIZ_TOPICS.find((t) => t.id === selectedTopic);
      const res = await api.submitQuiz({
        topicId: selectedTopic,
        topicName: topicObj ? topicObj.name : selectedTopic,
        type: topicObj ? topicObj.type : (selectedTopic.startsWith('apt') ? 'aptitude' : 'core_cs'),
        answers: userAnswers,
      });
      setResult(res);
      setQuizActive(false);
      if (onScoreChange) onScoreChange();
    } catch (err) {
      alert(err.message || 'Error submitting quiz');
    } finally {
      setSubmitting(false);
    }
  };

  const currentQ = questions[currentIdx];
  const answeredCount = Object.keys(userAnswers).length;

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Quiz Top Header */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-charcoal">Placement Practice Quizzes</h1>
              <p className="text-xs text-muted">10-question rotating assessment sessions with explanations.</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onGoHistory}
              className="flex items-center space-x-1 px-3 py-1.5 text-xs font-semibold text-charcoal bg-[#F7F8FA] hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
            >
              <History className="w-3.5 h-3.5 text-muted" />
              <span>Past Attempts</span>
            </button>
          </div>
        </div>

        <div className="mt-4 p-3 bg-amber-50/70 border border-amber-200/80 rounded-lg text-xs text-amber-900 flex items-center space-x-2">
          <Award className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span>
            <strong>Recall Evaluation:</strong> Practice tests measure exam agility under timed conditions. Quiz scores are <strong>strictly separated</strong> from your Placement Readiness Score.
          </span>
        </div>
      </div>

      {/* State 1: Choose Topic & Start */}
      {!quizActive && !result && (
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div>
            <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-2.5">
              Select Assessment Topic
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {QUIZ_TOPICS.map((t) => (
                <button
                  type="button"
                  key={t.id}
                  onClick={() => setSelectedTopic(t.id)}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    selectedTopic === t.id
                      ? 'border-primary bg-primary/5 text-primary shadow-xs ring-1 ring-primary'
                      : 'border-slate-200 hover:border-slate-300 text-charcoal bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold">{t.name}</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                      t.type === 'core_cs' ? 'bg-emerald-50 text-emerald-700' : 'bg-accent/10 text-accent'
                    }`}>
                      {t.type === 'core_cs' ? 'Core CS' : 'Aptitude'}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-muted">Each session selects 10 rotating questions from the question bank.</span>
            <button
              onClick={startQuiz}
              disabled={loading}
              className="flex items-center space-x-2 px-6 py-2.5 bg-primary hover:bg-primary-800 text-white text-xs font-bold rounded-lg shadow-xs transition-colors disabled:opacity-50"
            >
              <span>{loading ? 'Preparing Session...' : 'Start 10-Question Quiz'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* State 2: Active Quiz In Progress */}
      {quizActive && currentQ && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Progress Header */}
          <div className="bg-[#F7F8FA] px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-primary">Question {currentIdx + 1} of {questions.length}</span>
              <span className="text-xs text-muted ml-2">({answeredCount} answered)</span>
            </div>
            <div className="flex items-center space-x-1">
              {questions.map((q, idx) => (
                <button
                  key={q.id}
                  onClick={() => setCurrentIdx(idx)}
                  className={`w-6 h-6 rounded text-xs font-bold transition-colors ${
                    currentIdx === idx
                      ? 'bg-primary text-white'
                      : userAnswers[q.id] !== undefined
                      ? 'bg-accent/20 text-accent font-extrabold'
                      : 'bg-slate-200 text-muted hover:bg-slate-300'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Question Text & Options */}
          <div className="p-6 space-y-6">
            <h2 className="text-sm sm:text-base font-bold text-charcoal leading-snug">
              {currentQ.question}
            </h2>

            <div className="space-y-2.5">
              {currentQ.options.map((opt, optIdx) => {
                const isSelected = userAnswers[currentQ.id] === optIdx;
                const letter = String.fromCharCode(65 + optIdx);
                return (
                  <button
                    key={optIdx}
                    type="button"
                    onClick={() => handleSelectOption(currentQ.id, optIdx)}
                    className={`w-full p-3.5 rounded-xl border text-left flex items-center space-x-3 transition-colors ${
                      isSelected
                        ? 'border-primary bg-primary/5 text-primary ring-1 ring-primary'
                        : 'border-slate-200 hover:bg-slate-50 text-charcoal'
                    }`}
                  >
                    <span className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold ${
                      isSelected ? 'bg-primary text-white' : 'bg-slate-100 text-muted'
                    }`}>
                      {letter}
                    </span>
                    <span className="text-xs font-medium">{opt}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Bar */}
          <div className="bg-[#F7F8FA] px-6 py-4 border-t border-slate-200 flex items-center justify-between">
            <button
              onClick={() => setCurrentIdx((prev) => Math.max(0, prev - 1))}
              disabled={currentIdx === 0}
              className="flex items-center space-x-1 px-3 py-2 text-xs font-semibold text-muted hover:text-charcoal disabled:opacity-30"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            <div className="flex items-center space-x-3">
              {currentIdx < questions.length - 1 ? (
                <button
                  onClick={() => setCurrentIdx((prev) => Math.min(questions.length - 1, prev + 1))}
                  className="flex items-center space-x-1 px-4 py-2 bg-primary hover:bg-primary-800 text-white text-xs font-bold rounded-lg shadow-xs"
                >
                  <span>Next Question</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={handleSubmitQuiz}
                  disabled={submitting}
                  className="flex items-center space-x-1 px-5 py-2 bg-accent hover:bg-accent-700 text-white text-xs font-bold rounded-lg shadow-xs"
                >
                  <span>{submitting ? 'Evaluating...' : 'Submit Assessment'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* State 3: Quiz Results & Detailed Explanations */}
      {result && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary mb-3">
              <Award className="w-7 h-7" />
            </div>

            <h2 className="text-xl font-bold text-charcoal">Assessment Completed</h2>
            <p className="text-xs text-muted mt-0.5">Attempt #{result.attemptNumber} recorded in your quiz history</p>

            <div className="mt-4 inline-flex items-center space-x-6 bg-[#F7F8FA] px-6 py-3.5 rounded-xl border border-slate-200">
              <div>
                <span className="text-[11px] text-muted block font-medium">Your Score</span>
                <span className="text-2xl font-black text-charcoal">{result.score} / {result.totalQuestions}</span>
              </div>
              <div className="pl-6 border-l border-slate-200">
                <span className="text-[11px] text-muted block font-medium">Percentage</span>
                <span className={`text-2xl font-black ${
                  result.percentage >= 70 ? 'text-accent' :
                  result.percentage >= 50 ? 'text-primary' : 'text-amber-600'
                }`}>
                  {result.percentage}%
                </span>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                onClick={startQuiz}
                className="flex items-center space-x-1.5 px-4 py-2 bg-primary hover:bg-primary-800 text-white text-xs font-bold rounded-lg shadow-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retake Quiz (Rotated Pool)</span>
              </button>
              <button
                onClick={() => {
                  setResult(null);
                  setQuizActive(false);
                }}
                className="px-4 py-2 text-xs font-semibold text-charcoal bg-[#F7F8FA] hover:bg-slate-100 border border-slate-200 rounded-lg"
              >
                Select Different Topic
              </button>
            </div>
          </div>

          {/* Question Breakdown with Explanations */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-charcoal text-sm">Detailed Question Breakdown</h3>

            <div className="space-y-3.5">
              {(result.breakdown || []).map((item, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border ${
                    item.isCorrect ? 'bg-emerald-50/40 border-emerald-200' : 'bg-rose-50/40 border-rose-200'
                  }`}
                >
                  <div className="flex items-start space-x-2.5">
                    {item.isCorrect ? (
                      <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <span className="text-xs font-bold text-charcoal">
                        Q{idx + 1}. {item.question}
                      </span>

                      <div className="mt-2 space-y-1 text-xs">
                        {item.options?.map((opt, oIdx) => {
                          const isUserChoice = item.userSelected === oIdx;
                          const isCorrectChoice = item.correctOptionIndex === oIdx;
                          return (
                            <div
                              key={oIdx}
                              className={`px-2.5 py-1 rounded text-[11px] font-medium flex items-center justify-between ${
                                isCorrectChoice
                                  ? 'bg-emerald-100 text-emerald-900 font-bold'
                                  : isUserChoice && !item.isCorrect
                                  ? 'bg-rose-100 text-rose-900 line-through'
                                  : 'text-muted'
                              }`}
                            >
                              <span>{String.fromCharCode(65 + oIdx)}. {opt}</span>
                              {isCorrectChoice && <span className="text-[10px] text-emerald-700">Correct Answer ✓</span>}
                              {isUserChoice && !isCorrectChoice && <span className="text-[10px] text-rose-700">Your Choice ✗</span>}
                            </div>
                          );
                        })}
                      </div>

                      {item.explanation && (
                        <div className="mt-2.5 p-2.5 bg-white/90 rounded border border-slate-200 text-[11px] text-charcoal leading-relaxed">
                          <strong>Explanation:</strong> {item.explanation}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
